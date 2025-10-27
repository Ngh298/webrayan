import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import {
  apiRateLimit,
  withRateLimit,
  createRateLimitResponse,
} from '@/lib/rate-limit';
import { requirePermission } from '@/lib/auth-utils';

// GET - دریافت لیست پروژه‌ها
export async function GET(request) {
  try {
    // Rate limiting
    const rateLimitResult = await withRateLimit(apiRateLimit, request);

    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult);
    }

    const { db } = await connectDB();

    // دریافت پارامترهای query
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit')) || 50;
    const skip = parseInt(searchParams.get('skip')) || 0;
    const published = searchParams.get('published');

    // ساخت فیلتر
    let filter = {};
    if (category && category !== 'all') {
      filter.category = category;
    }
    if (published !== null) {
      filter.published = published === 'true';
    }

    // دریافت پروژه‌ها
    const projects = await db
      .collection('portfolio_projects')
      .find(filter)
      .sort({ createdAt: -1, order: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // شمارش کل پروژه‌ها
    const total = await db
      .collection('portfolio_projects')
      .countDocuments(filter);

    return NextResponse.json(
      {
        success: true,
        projects: projects.map(project => ({
          ...project,
          id: project._id.toString(),
          _id: undefined,
        })),
        pagination: {
          total,
          limit,
          skip,
          hasMore: skip + limit < total,
        },
      },
      {
        status: 200,
        headers: rateLimitResult.headers,
      }
    );
  } catch (error) {
    console.error('❌ خطا در دریافت پروژه‌ها:', error);

    return NextResponse.json(
      {
        error: 'Server Error',
        message: 'خطا در دریافت پروژه‌ها',
      },
      { status: 500 }
    );
  }
}

// POST - ایجاد پروژه جدید (فقط برای مدیران)
export async function POST(request) {
  try {
    // بررسی دسترسی
    await requirePermission('manage_content');

    // Rate limiting
    const rateLimitResult = await withRateLimit(apiRateLimit, request);

    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult);
    }

    const {
      title,
      description,
      category,
      image,
      demoUrl,
      githubUrl,
      tech,
      client,
      duration,
      year,
      published = false,
      featured = false,
      order = 0,
    } = await request.json();

    // اعتبارسنجی ورودی‌ها
    if (!title || !description || !category) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'عنوان، توضیحات و دسته‌بندی الزامی هستند',
        },
        {
          status: 400,
          headers: rateLimitResult.headers,
        }
      );
    }

    const { db } = await connectDB();

    // ایجاد پروژه جدید
    const newProject = {
      title: title.trim(),
      description: description.trim(),
      category,
      image: image || '🚀',
      demoUrl: demoUrl || null,
      githubUrl: githubUrl || null,
      tech: Array.isArray(tech) ? tech : [],
      client: client?.trim() || null,
      duration: duration?.trim() || null,
      year: year || new Date().getFullYear().toString(),
      published: Boolean(published),
      featured: Boolean(featured),
      order: parseInt(order) || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection('portfolio_projects')
      .insertOne(newProject);

    console.log('✅ Portfolio project created:', result.insertedId);

    return NextResponse.json(
      {
        success: true,
        message: 'پروژه با موفقیت ایجاد شد',
        project: {
          ...newProject,
          id: result.insertedId.toString(),
        },
      },
      {
        status: 201,
        headers: rateLimitResult.headers,
      }
    );
  } catch (error) {
    console.error('❌ خطا در ایجاد پروژه:', error);

    if (error.message.includes('Unauthorized')) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'شما اجازه ایجاد پروژه ندارید',
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: 'Server Error',
        message: 'خطا در ایجاد پروژه',
      },
      { status: 500 }
    );
  }
}
