/**
 * Tests for Validation Utility
 */

import {
  isValidEmail,
  validatePassword,
  isValidName,
  isValidIranianPhone,
  sanitizeText,
} from '@/lib/validation';

describe('Validation Utility', () => {
  describe('Email Validation', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });

    it('should reject emails that are too long', () => {
      const longEmail = 'a'.repeat(250) + '@test.com';
      expect(isValidEmail(longEmail)).toBe(false);
    });
  });

  describe('Password Validation', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('Password123!');
      expect(result.isValid).toBe(true);
      expect(result.score).toBe(6);
    });

    it('should reject weak passwords', () => {
      const result = validatePassword('weak');
      expect(result.isValid).toBe(false);
    });

    it('should check for lowercase letters', () => {
      const result = validatePassword('PASSWORD123!');
      expect(result.validations.hasLowerCase).toBe(false);
    });

    it('should check for uppercase letters', () => {
      const result = validatePassword('password123!');
      expect(result.validations.hasUpperCase).toBe(false);
    });

    it('should check for numbers', () => {
      const result = validatePassword('Password!');
      expect(result.validations.hasNumbers).toBe(false);
    });

    it('should check for special characters', () => {
      const result = validatePassword('Password123');
      expect(result.validations.hasSpecialChar).toBe(false);
    });

    it('should check password length', () => {
      const result = validatePassword('Pass1!');
      expect(result.validations.length).toBe(false);
    });
  });

  describe('Name Validation', () => {
    it('should validate Persian names', () => {
      expect(isValidName('محمد')).toBe(true);
      expect(isValidName('علی رضایی')).toBe(true);
    });

    it('should validate English names', () => {
      expect(isValidName('John Doe')).toBe(true);
      expect(isValidName('Mary-Jane')).toBe(true);
    });

    it('should reject invalid names', () => {
      expect(isValidName('A')).toBe(false); // too short
      expect(isValidName('123')).toBe(false); // numbers only
      expect(isValidName('Name123')).toBe(false); // contains numbers
    });
  });

  describe('Iranian Phone Validation', () => {
    it('should validate Iranian mobile numbers', () => {
      expect(isValidIranianPhone('09123456789')).toBe(true);
      expect(isValidIranianPhone('+989123456789')).toBe(true);
      expect(isValidIranianPhone('9123456789')).toBe(true);
    });

    it('should handle phone numbers with spaces and dashes', () => {
      expect(isValidIranianPhone('0912 345 6789')).toBe(true);
      expect(isValidIranianPhone('0912-345-6789')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidIranianPhone('123')).toBe(false);
      expect(isValidIranianPhone('0123456789')).toBe(false);
    });
  });

  describe('Text Sanitization', () => {
    it('should trim whitespace', () => {
      expect(sanitizeText('  test  ')).toBe('test');
    });

    it('should remove HTML tags', () => {
      expect(sanitizeText('test<script>alert(1)</script>')).toBe(
        'testalert(1)'
      );
    });

    it('should remove javascript: URLs', () => {
      expect(sanitizeText('javascript:alert(1)')).toBe('alert(1)');
    });

    it('should limit text length', () => {
      const longText = 'a'.repeat(2000);
      expect(sanitizeText(longText).length).toBe(1000);
    });

    it('should handle non-string input', () => {
      expect(sanitizeText(null)).toBe('');
      expect(sanitizeText(undefined)).toBe('');
      expect(sanitizeText(123)).toBe('');
    });
  });
});

