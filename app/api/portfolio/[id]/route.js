import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/mongodb';
import {
  apiRateLimit,
  withRateLimit,
  createRateLimitResponse,
} from '@/lib/rate-limit';
import { requirePermission } from '@/lib/auth-utils';

// GET - دریافت یک پروژه خاص
export async function GET(request, { params }) {
  try {
    // Rate limiting
    const rateLimitResult = await withRateLimit(apiRateLimit, request);

    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult);
    }

    const { id } = params;

    // بررسی معتبر بودن ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          error: 'Invalid ID',
          message: 'شناسه پروژه معتبر نیست',
        },
        { status: 400 }
      );
    }

    const { db } = await connectDB();

    const project = await db
      .collection('portfolio_projects')
      .findOne({ _id: new ObjectId(id) });

    if (!project) {
      return NextResponse.json(
        {
          error: 'Not Found',
          message: 'پروژه پیدا نشد',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        project: {
          ...project,
          id: project._id.toString(),
          _id: undefined,
        },
      },
      {
        status: 200,
        headers: rateLimitResult.headers,
      }
    );
  } catch (error) {
    console.error('❌ خطا در دریافت پروژه:', error);

    return NextResponse.json(
      {
        error: 'Server Error',
        message: 'خطا در دریافت پروژه',
      },
      { status: 500 }
    );
  }
}

// PUT - بروزرسانی پروژه (فقط برای مدیران)
export async function PUT(request, { params }) {
  try {
    // بررسی دسترسی
    await requirePermission('manage_content');

    // Rate limiting
    const rateLimitResult = await withRateLimit(apiRateLimit, request);

    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult);
    }

    const { id } = params;

    // بررسی معتبر بودن ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          error: 'Invalid ID',
          message: 'شناسه پروژه معتبر نیست',
        },
        { status: 400 }
      );
    }

    const updateData = await request.json();
    const { db } = await connectDB();

    // حذف فیلدهای غیرقابل ویرایش
    delete updateData._id;
    delete updateData.id;
    delete updateData.createdAt;

    // آماده‌سازی داده‌های بروزرسانی
    const updateFields = {};

    if (updateData.title) updateFields.title = updateData.title.trim();
    if (updateData.description)
      updateFields.description = updateData.description.trim();
    if (updateData.category) updateFields.category = updateData.category;
    if (updateData.image !== undefined) updateFields.image = updateData.image;
    if (updateData.demoUrl !== undefined)
      updateFields.demoUrl = updateData.demoUrl;
    if (updateData.githubUrl !== undefined)
      updateFields.githubUrl = updateData.githubUrl;
    if (updateData.tech !== undefined)
      updateFields.tech = Array.isArray(updateData.tech) ? updateData.tech : [];
    if (updateData.client !== undefined)
      updateFields.client = updateData.client?.trim() || null;
    if (updateData.duration !== undefined)
      updateFields.duration = updateData.duration?.trim() || null;
    if (updateData.year !== undefined) updateFields.year = updateData.year;
    if (updateData.published !== undefined)
      updateFields.published = Boolean(updateData.published);
    if (updateData.featured !== undefined)
      updateFields.featured = Boolean(updateData.featured);
    if (updateData.order !== undefined)
      updateFields.order = parseInt(updateData.order) || 0;

    updateFields.updatedAt = new Date();

    const result = await db
      .collection('portfolio_projects')
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          error: 'Not Found',
          message: 'پروژه پیدا نشد',
        },
        { status: 404 }
      );
    }

    console.log('✅ Portfolio project updated:', id);

    // دریافت پروژه بروزرسانی شده
    const updatedProject = await db
      .collection('portfolio_projects')
      .findOne({ _id: new ObjectId(id) });

    return NextResponse.json(
      {
        success: true,
        message: 'پروژه با موفقیت بروزرسانی شد',
        project: {
          ...updatedProject,
          id: updatedProject._id.toString(),
          _id: undefined,
        },
      },
      {
        status: 200,
        headers: rateLimitResult.headers,
      }
    );
  } catch (error) {
    console.error('❌ خطا در بروزرسانی پروژه:', error);

    if (error.message.includes('Unauthorized')) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'شما اجازه ویرایش پروژه ندارید',
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: 'Server Error',
        message: 'خطا در بروزرسانی پروژه',
      },
      { status: 500 }
    );
  }
}

// DELETE - حذف پروژه (فقط برای مدیران)
export async function DELETE(request, { params }) {
  try {
    // بررسی دسترسی
    await requirePermission('delete_content');

    // Rate limiting
    const rateLimitResult = await withRateLimit(apiRateLimit, request);

    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult);
    }

    const { id } = params;

    // بررسی معتبر بودن ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          error: 'Invalid ID',
          message: 'شناسه پروژه معتبر نیست',
        },
        { status: 400 }
      );
    }

    const { db } = await connectDB();

    // دریافت پروژه قبل از حذف (برای لاگ)
    const project = await db
      .collection('portfolio_projects')
      .findOne({ _id: new ObjectId(id) });

    if (!project) {
      return NextResponse.json(
        {
          error: 'Not Found',
          message: 'پروژه پیدا نشد',
        },
        { status: 404 }
      );
    }

    // حذف پروژه
    const result = await db
      .collection('portfolio_projects')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          error: 'Delete Failed',
          message: 'خطا در حذف پروژه',
        },
        { status: 500 }
      );
    }

    console.log('🗑️ Portfolio project deleted:', project.title, id);

    return NextResponse.json(
      {
        success: true,
        message: 'پروژه با موفقیت حذف شد',
        deletedProject: {
          id: project._id.toString(),
          title: project.title,
        },
      },
      {
        status: 200,
        headers: rateLimitResult.headers,
      }
    );
  } catch (error) {
    console.error('❌ خطا در حذف پروژه:', error);

    if (error.message.includes('Unauthorized')) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'شما اجازه حذف پروژه ندارید',
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: 'Server Error',
        message: 'خطا در حذف پروژه',
      },
      { status: 500 }
    );
  }
}
