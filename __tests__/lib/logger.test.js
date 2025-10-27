/**
 * Tests for Logger Utility
 */

import { logger } from '@/lib/logger';

describe('Logger Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Development Environment', () => {
    beforeAll(() => {
      process.env.NODE_ENV = 'development';
    });

    it('should log debug messages in development', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      logger.debug('Test debug message');
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should log info messages in development', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      logger.info('Test info message');
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should log success messages in development', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      logger.success('Test success message');
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('Production Environment', () => {
    beforeAll(() => {
      process.env.NODE_ENV = 'production';
    });

    it('should not log debug messages in production', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      logger.debug('Test debug message');
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should log error messages in production', () => {
      const consoleSpy = jest.spyOn(console, 'error');
      logger.error('Test error', new Error('Test'));
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should log warning messages in production', () => {
      const consoleSpy = jest.spyOn(console, 'warn');
      logger.warn('Test warning');
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('Error Logging', () => {
    it('should log errors with context', () => {
      const consoleSpy = jest.spyOn(console, 'error');
      const error = new Error('Test error');
      const context = { userId: '123' };

      logger.error('Error occurred', error, context);

      expect(consoleSpy).toHaveBeenCalled();
      const callArgs = consoleSpy.mock.calls[0];
      expect(callArgs[1]).toHaveProperty('context', context);
    });
  });
});

