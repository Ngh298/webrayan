/**
 * Input Validation and Sanitization Utilities
 * اعتبارسنجی و پاکسازی ورودی‌ها برای امنیت
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Email Validation
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Password Validation
 */
export function validatePassword(password) {
  const minLength = 8;
  const maxLength = 128;

  const validations = {
    length: password.length >= minLength && password.length <= maxLength,
    hasLowerCase: /[a-z]/.test(password),
    hasUpperCase: /[A-Z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    noCommonPatterns: !/(123456|password|qwerty|abc123)/i.test(password),
  };

  const isValid = Object.values(validations).every(Boolean);

  return {
    isValid,
    validations,
    score: Object.values(validations).filter(Boolean).length,
  };
}

/**
 * Name Validation (Persian and English)
 */
export function isValidName(name) {
  // Allow Persian, English letters, spaces, and common punctuation
  const nameRegex = /^[\u0600-\u06FFa-zA-Z\s\-'.]{2,50}$/;
  return nameRegex.test(name.trim());
}

/**
 * Phone Number Validation (Iranian)
 */
export function isValidIranianPhone(phone) {
  // Iranian phone patterns
  const patterns = [
    /^(\+98|0)?9\d{9}$/, // Mobile
    /^(\+98|0)?[1-8]\d{7,10}$/, // Landline
  ];

  const cleanPhone = phone.replace(/[\s\-()]/g, '');
  return patterns.some(pattern => pattern.test(cleanPhone));
}

/**
 * URL Validation
 */
export function isValidURL(url) {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

/**
 * Sanitize HTML Content
 */
export function sanitizeHTML(html) {
  if (typeof window === 'undefined') {
    // Server-side sanitization
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'a'],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
      FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    });
  }

  // Client-side sanitization
  return DOMPurify.sanitize(html);
}

/**
 * Sanitize Plain Text
 */
export function sanitizeText(text) {
  if (typeof text !== 'string') return '';

  return text
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
}

/**
 * SQL Injection Prevention
 */
export function escapeSQLString(str) {
  if (typeof str !== 'string') return str;

  return str
    .replace(/'/g, "''")
    .replace(/;/g, '\\;')
    .replace(/--/g, '\\--')
    .replace(/\/\*/g, '\\/\\*')
    .replace(/\*\//g, '\\*\\/');
}

/**
 * XSS Prevention
 */
export function escapeXSS(str) {
  if (typeof str !== 'string') return str;

  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return str.replace(/[&<>"'/]/g, char => escapeMap[char]);
}

/**
 * File Upload Validation
 */
export function validateFileUpload(file, options = {}) {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'],
  } = options;

  const validations = {
    size: file.size <= maxSize,
    type: allowedTypes.includes(file.type),
    extension: allowedExtensions.some(ext =>
      file.name.toLowerCase().endsWith(ext)
    ),
    name: /^[a-zA-Z0-9._-]+$/.test(file.name),
  };

  return {
    isValid: Object.values(validations).every(Boolean),
    validations,
    errors: Object.entries(validations)
      .filter(([_, valid]) => !valid)
      .map(([key]) => `Invalid ${key}`),
  };
}

/**
 * Rate Limiting Key Generation
 */
export function generateRateLimitKey(identifier, action = 'default') {
  // Sanitize inputs
  const cleanIdentifier = sanitizeText(identifier).replace(/[^\w.-]/g, '');
  const cleanAction = sanitizeText(action).replace(/[^\w-]/g, '');

  return `ratelimit:${cleanAction}:${cleanIdentifier}`;
}

/**
 * MongoDB ObjectId Validation
 */
export function isValidObjectId(id) {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
}

/**
 * Input Length Validation
 */
export function validateLength(value, min = 0, max = Infinity) {
  const length = typeof value === 'string' ? value.length : 0;
  return {
    isValid: length >= min && length <= max,
    length,
    min,
    max,
  };
}

/**
 * Comprehensive Form Validation
 */
export function validateContactForm(data) {
  const errors = {};
  const sanitized = {};

  // Name validation
  if (!data.name || !isValidName(data.name)) {
    errors.name = 'نام باید بین ۲ تا ۵۰ کاراکتر باشد';
  } else {
    sanitized.name = sanitizeText(data.name);
  }

  // Email validation
  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'آدرس ایمیل معتبر نیست';
  } else {
    sanitized.email = data.email.toLowerCase().trim();
  }

  // Phone validation (optional)
  if (data.phone && !isValidIranianPhone(data.phone)) {
    errors.phone = 'شماره تلفن معتبر نیست';
  } else if (data.phone) {
    sanitized.phone = data.phone.replace(/[\s\-()]/g, '');
  }

  // Subject validation
  const subjectValidation = validateLength(data.subject, 5, 100);
  if (!subjectValidation.isValid) {
    errors.subject = 'موضوع باید بین ۵ تا ۱۰۰ کاراکتر باشد';
  } else {
    sanitized.subject = sanitizeText(data.subject);
  }

  // Message validation
  const messageValidation = validateLength(data.message, 10, 1000);
  if (!messageValidation.isValid) {
    errors.message = 'پیام باید بین ۱۰ تا ۱۰۰۰ کاراکتر باشد';
  } else {
    sanitized.message = sanitizeText(data.message);
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized,
  };
}

/**
 * Portfolio Project Validation
 */
export function validatePortfolioProject(data) {
  const errors = {};
  const sanitized = {};

  // Title validation
  const titleValidation = validateLength(data.title, 3, 100);
  if (!titleValidation.isValid) {
    errors.title = 'عنوان باید بین ۳ تا ۱۰۰ کاراکتر باشد';
  } else {
    sanitized.title = sanitizeText(data.title);
  }

  // Description validation
  const descValidation = validateLength(data.description, 10, 500);
  if (!descValidation.isValid) {
    errors.description = 'توضیحات باید بین ۱۰ تا ۵۰۰ کاراکتر باشد';
  } else {
    sanitized.description = sanitizeText(data.description);
  }

  // Category validation
  const validCategories = [
    'ecommerce',
    'personal',
    'restaurant',
    'education',
    'news',
    'corporate',
  ];
  if (!validCategories.includes(data.category)) {
    errors.category = 'دسته‌بندی نامعتبر است';
  } else {
    sanitized.category = data.category;
  }

  // URL validations
  if (data.demoUrl && !isValidURL(data.demoUrl)) {
    errors.demoUrl = 'آدرس دمو معتبر نیست';
  } else if (data.demoUrl) {
    sanitized.demoUrl = data.demoUrl;
  }

  if (data.githubUrl && !isValidURL(data.githubUrl)) {
    errors.githubUrl = 'آدرس گیت‌هاب معتبر نیست';
  } else if (data.githubUrl) {
    sanitized.githubUrl = data.githubUrl;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized,
  };
}

/**
 * User Registration Validation
 */
export function validateUserRegistration(data) {
  const errors = {};
  const sanitized = {};

  // Name validation
  if (!isValidName(data.name)) {
    errors.name = 'نام معتبر نیست';
  } else {
    sanitized.name = sanitizeText(data.name);
  }

  // Email validation
  if (!isValidEmail(data.email)) {
    errors.email = 'آدرس ایمیل معتبر نیست';
  } else {
    sanitized.email = data.email.toLowerCase().trim();
  }

  // Password validation
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password =
      'رمز عبور باید حداقل ۸ کاراکتر و شامل حروف کوچک، بزرگ، عدد و نماد باشد';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized,
    passwordScore: passwordValidation?.score || 0,
  };
}

/**
 * Validation Middleware
 */
export function createValidationMiddleware(validator) {
  return async request => {
    try {
      const body = await request.json();
      const validation = validator(body);

      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors,
          status: 400,
        };
      }

      return {
        success: true,
        data: validation.sanitized,
      };
    } catch (error) {
      return {
        success: false,
        errors: { general: 'داده‌های ورودی نامعتبر است' },
        status: 400,
      };
    }
  };
}

export const contactFormValidator =
  createValidationMiddleware(validateContactForm);
export const portfolioValidator = createValidationMiddleware(
  validatePortfolioProject
);
export const userRegistrationValidator = createValidationMiddleware(
  validateUserRegistration
);
