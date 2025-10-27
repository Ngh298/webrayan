/**
 * Zod Schemas for Validation
 * اسکیماهای اعتبارسنجی با Zod
 */

import { z } from 'zod';

/**
 * Contact Form Schema
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'نام باید حداقل ۲ کاراکتر باشد')
    .max(100, 'نام نباید بیشتر از ۱۰۰ کاراکتر باشد')
    .trim(),
  email: z
    .string()
    .email('فرمت ایمیل صحیح نیست')
    .max(254, 'ایمیل خیلی طولانی است')
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .regex(
      /^(\+98|0)?9\d{9}$/,
      'شماره موبایل صحیح نیست (مثال: 09123456789)'
    )
    .optional()
    .or(z.literal('')),
  subject: z
    .string()
    .min(5, 'موضوع باید حداقل ۵ کاراکتر باشد')
    .max(200, 'موضوع نباید بیشتر از ۲۰۰ کاراکتر باشد')
    .trim(),
  message: z
    .string()
    .min(10, 'پیام باید حداقل ۱۰ کاراکتر باشد')
    .max(1000, 'پیام نباید بیشتر از ۱۰۰۰ کاراکتر باشد')
    .trim(),
  projectType: z
    .enum([
      'website',
      'ecommerce',
      'personal',
      'corporate',
      'educational',
      'news',
      'restaurant & cafe',
      'other',
    ])
    .optional()
    .default('website'),
  budget: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().default('medium'),
  timeline: z.string().optional(),
});

/**
 * User Registration Schema
 */
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'نام باید حداقل ۲ کاراکتر باشد')
    .max(50, 'نام نباید بیشتر از ۵۰ کاراکتر باشد')
    .trim(),
  email: z
    .string()
    .email('فرمت ایمیل صحیح نیست')
    .max(254, 'ایمیل خیلی طولانی است')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد')
    .max(128, 'رمز عبور خیلی طولانی است')
    .regex(/[a-z]/, 'رمز عبور باید حداقل یک حرف کوچک داشته باشد')
    .regex(/[A-Z]/, 'رمز عبور باید حداقل یک حرف بزرگ داشته باشد')
    .regex(/\d/, 'رمز عبور باید حداقل یک عدد داشته باشد')
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      'رمز عبور باید حداقل یک کاراکتر خاص داشته باشد'
    ),
});

/**
 * User Login Schema
 */
export const loginSchema = z.object({
  email: z.string().email('فرمت ایمیل صحیح نیست').toLowerCase().trim(),
  password: z.string().min(1, 'رمز عبور الزامی است'),
});

/**
 * Portfolio Project Schema
 */
export const portfolioProjectSchema = z.object({
  title: z
    .string()
    .min(3, 'عنوان باید حداقل ۳ کاراکتر باشد')
    .max(100, 'عنوان نباید بیشتر از ۱۰۰ کاراکتر باشد')
    .trim(),
  description: z
    .string()
    .min(10, 'توضیحات باید حداقل ۱۰ کاراکتر باشد')
    .max(500, 'توضیحات نباید بیشتر از ۵۰۰ کاراکتر باشد')
    .trim(),
  category: z.enum([
    'ecommerce',
    'personal',
    'restaurant',
    'education',
    'news',
    'corporate',
    'other',
  ]),
  image: z.string().optional().default('🚀'),
  demoUrl: z.string().url('آدرس URL معتبر نیست').optional().nullable(),
  githubUrl: z.string().url('آدرس URL معتبر نیست').optional().nullable(),
  tech: z.array(z.string()).optional().default([]),
  client: z.string().max(100).optional().nullable(),
  duration: z.string().max(50).optional().nullable(),
  year: z.string().regex(/^\d{4}$/, 'سال باید ۴ رقم باشد').optional(),
  published: z.boolean().optional().default(false),
  featured: z.boolean().optional().default(false),
  order: z.number().int().min(0).optional().default(0),
});

/**
 * Update Profile Schema
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'نام باید حداقل ۲ کاراکتر باشد')
    .max(50, 'نام نباید بیشتر از ۵۰ کاراکتر باشد')
    .trim()
    .optional(),
  phone: z
    .string()
    .regex(
      /^(\+98|0)?9\d{9}$/,
      'شماره موبایل صحیح نیست'
    )
    .optional()
    .nullable(),
  image: z.string().url('آدرس تصویر معتبر نیست').optional().nullable(),
});

/**
 * Password Reset Schema
 */
export const passwordResetSchema = z.object({
  email: z.string().email('فرمت ایمیل صحیح نیست').toLowerCase().trim(),
});

/**
 * Password Change Schema
 */
export const passwordChangeSchema = z.object({
  token: z.string().min(1, 'توکن الزامی است'),
  password: z
    .string()
    .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد')
    .max(128, 'رمز عبور خیلی طولانی است')
    .regex(/[a-z]/, 'رمز عبور باید حداقل یک حرف کوچک داشته باشد')
    .regex(/[A-Z]/, 'رمز عبور باید حداقل یک حرف بزرگ داشته باشد')
    .regex(/\d/, 'رمز عبور باید حداقل یک عدد داشته باشد'),
});

/**
 * FAQ Question Schema
 */
export const faqQuestionSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase().trim(),
  question: z.string().min(10).max(500).trim(),
});

/**
 * MongoDB ObjectId Schema
 */
export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ObjectId معتبر نیست');

/**
 * Pagination Schema
 */
export const paginationSchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
  skip: z.number().int().min(0).optional().default(0),
});

/**
 * Helper: Validate Request Body
 */
export async function validateRequestBody(request, schema) {
  try {
    const body = await request.json();
    const validated = schema.parse(body);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    return {
      success: false,
      errors: [{ message: 'خطای اعتبارسنجی' }],
    };
  }
}

/**
 * Helper: Validate Query Params
 */
export function validateQueryParams(searchParams, schema) {
  try {
    const params = Object.fromEntries(searchParams.entries());
    const validated = schema.parse(params);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    return {
      success: false,
      errors: [{ message: 'خطای اعتبارسنجی پارامترها' }],
    };
  }
}

