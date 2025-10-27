'use client';

import { useState, useCallback } from 'react';

/**
 * هوک سفارشی برای مدیریت فرم‌های احراز هویت
 * @param {Object} initialValues - مقادیر اولیه فرم
 * @param {Function} onSubmit - تابع ارسال فرم
 * @param {Function} validate - تابع اعتبارسنجی
 */
export function useAuthForm(initialValues, onSubmit, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // مدیریت تغییرات input
  const handleChange = useCallback(e => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));

    // پاک کردن خطا برای فیلد جاری
    setErrors(prev => ({ ...prev, [name]: '' }));
  }, []);

  // مدیریت blur برای نمایش خطاها
  const handleBlur = useCallback(
    e => {
      const { name } = e.target;
      setTouched(prev => ({ ...prev, [name]: true }));

      // اعتبارسنجی فیلد
      if (validate) {
        const fieldErrors = validate(values);
        if (fieldErrors[name]) {
          setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
        }
      }
    },
    [values, validate]
  );

  // مدیریت ارسال فرم
  const handleSubmit = useCallback(
    async e => {
      e.preventDefault();

      // علامت‌گذاری همه فیلدها به عنوان touched
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);

      // اعتبارسنجی
      if (validate) {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit]
  );

  // ریست کردن فرم
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setErrors,
    setValues,
  };
}

/**
 * توابع اعتبارسنجی رایج
 */
export const validators = {
  required: (value, fieldName = 'این فیلد') => {
    if (!value || !value.toString().trim()) {
      return `${fieldName} الزامی است`;
    }
    return '';
  },

  email: value => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return 'فرمت ایمیل صحیح نیست';
    }
    return '';
  },

  minLength: (value, min) => {
    if (value && value.length < min) {
      return `حداقل ${min} کاراکتر مورد نیاز است`;
    }
    return '';
  },

  maxLength: (value, max) => {
    if (value && value.length > max) {
      return `حداکثر ${max} کاراکتر مجاز است`;
    }
    return '';
  },

  pattern: (value, pattern, message) => {
    if (value && !pattern.test(value)) {
      return message;
    }
    return '';
  },

  match: (value1, value2, message = 'مقادیر یکسان نیستند') => {
    if (value1 !== value2) {
      return message;
    }
    return '';
  },
};
