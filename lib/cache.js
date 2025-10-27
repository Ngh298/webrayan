/**
 * Caching Strategies برای بهبود عملکرد
 * شامل In-Memory Cache, Redis Cache, و Browser Cache
 */

import React from 'react';

// In-Memory Cache for server-side
const memoryCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * In-Memory Cache Functions
 */
export const memCache = {
  set(key, value, ttl = CACHE_TTL) {
    const expireAt = Date.now() + ttl;
    memoryCache.set(key, { value, expireAt });
  },

  get(key) {
    const item = memoryCache.get(key);
    if (!item) return null;

    if (Date.now() > item.expireAt) {
      memoryCache.delete(key);
      return null;
    }

    return item.value;
  },

  delete(key) {
    return memoryCache.delete(key);
  },

  clear() {
    memoryCache.clear();
  },

  size() {
    return memoryCache.size;
  },
};

/**
 * Browser Cache Functions (Client-side)
 */
export const browserCache = {
  set(key, value, ttl = CACHE_TTL) {
    if (typeof window === 'undefined') return;

    const expireAt = Date.now() + ttl;
    const item = { value, expireAt };

    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to set localStorage cache:', error);
    }
  },

  get(key) {
    if (typeof window === 'undefined') return null;

    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      if (Date.now() > item.expireAt) {
        localStorage.removeItem(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.warn('Failed to get localStorage cache:', error);
      return null;
    }
  },

  delete(key) {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },

  clear() {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  },
};

/**
 * Session Storage Cache (Client-side)
 */
export const sessionCache = {
  set(key, value) {
    if (typeof window === 'undefined') return;

    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to set sessionStorage cache:', error);
    }
  },

  get(key) {
    if (typeof window === 'undefined') return null;

    try {
      const itemStr = sessionStorage.getItem(key);
      return itemStr ? JSON.parse(itemStr) : null;
    } catch (error) {
      console.warn('Failed to get sessionStorage cache:', error);
      return null;
    }
  },

  delete(key) {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(key);
  },

  clear() {
    if (typeof window === 'undefined') return;
    sessionStorage.clear();
  },
};

/**
 * Redis Cache Functions (Server-side with Upstash)
 */
let redisClient = null;

async function getRedisClient() {
  if (redisClient) return redisClient;

  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    try {
      const { Redis } = await import('@upstash/redis');
      redisClient = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
      return redisClient;
    } catch (error) {
      console.warn('Failed to initialize Redis client:', error);
      return null;
    }
  }

  return null;
}

export const redisCache = {
  async set(key, value, ttl = 300) {
    // 5 minutes default
    try {
      const redis = await getRedisClient();
      if (!redis) return false;

      await redis.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('Failed to set Redis cache:', error);
      return false;
    }
  },

  async get(key) {
    try {
      const redis = await getRedisClient();
      if (!redis) return null;

      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.warn('Failed to get Redis cache:', error);
      return null;
    }
  },

  async delete(key) {
    try {
      const redis = await getRedisClient();
      if (!redis) return false;

      await redis.del(key);
      return true;
    } catch (error) {
      console.warn('Failed to delete Redis cache:', error);
      return false;
    }
  },

  async clear(pattern = '*') {
    try {
      const redis = await getRedisClient();
      if (!redis) return false;

      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      return true;
    } catch (error) {
      console.warn('Failed to clear Redis cache:', error);
      return false;
    }
  },
};

/**
 * Unified Cache Interface
 */
export const cache = {
  // Server-side caching (Memory + Redis)
  async setServer(key, value, ttl = CACHE_TTL) {
    // Set in memory cache first (fast)
    memCache.set(key, value, ttl);

    // Set in Redis cache (persistent)
    await redisCache.set(key, value, Math.floor(ttl / 1000));
  },

  async getServer(key) {
    // Try memory cache first
    let value = memCache.get(key);
    if (value !== null) return value;

    // Try Redis cache
    value = await redisCache.get(key);
    if (value !== null) {
      // Store back in memory cache
      memCache.set(key, value);
    }

    return value;
  },

  // Client-side caching
  setClient(key, value, ttl = CACHE_TTL, useSession = false) {
    if (useSession) {
      sessionCache.set(key, value);
    } else {
      browserCache.set(key, value, ttl);
    }
  },

  getClient(key, useSession = false) {
    if (useSession) {
      return sessionCache.get(key);
    } else {
      return browserCache.get(key);
    }
  },

  // Clear all caches
  async clearAll() {
    memCache.clear();
    await redisCache.clear();
    browserCache.clear();
    sessionCache.clear();
  },
};

/**
 * Cache Keys Constants
 */
export const CACHE_KEYS = {
  PORTFOLIO_PROJECTS: 'portfolio:projects',
  CONTACT_MESSAGES: 'contact:messages',
  USER_SESSION: 'user:session',
  SITE_CONFIG: 'site:config',
  BLOG_POSTS: 'blog:posts',
  TESTIMONIALS: 'testimonials:list',
  SERVICES: 'services:list',
};

/**
 * Cache Wrapper Function
 */
export function withCache(fn, key, ttl = CACHE_TTL, useRedis = true) {
  return async (...args) => {
    const cacheKey = typeof key === 'function' ? key(...args) : key;

    // Try to get from cache
    let cachedResult;
    if (typeof window === 'undefined' && useRedis) {
      // Server-side
      cachedResult = await cache.getServer(cacheKey);
    } else {
      // Client-side
      cachedResult = cache.getClient(cacheKey);
    }

    if (cachedResult !== null) {
      return cachedResult;
    }

    // Execute function and cache result
    const result = await fn(...args);

    if (typeof window === 'undefined' && useRedis) {
      // Server-side
      await cache.setServer(cacheKey, result, ttl);
    } else {
      // Client-side
      cache.setClient(cacheKey, result, ttl);
    }

    return result;
  };
}

/**
 * React Hook for Client-side Caching
 */
export function useCache(key, fetcher, options = {}) {
  const {
    ttl = CACHE_TTL,
    useSession = false,
    dependencies = [],
    enabled = true,
  } = options;

  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!enabled) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try cache first
        const cachedData = cache.getClient(key, useSession);
        if (cachedData !== null) {
          setData(cachedData);
          setLoading(false);
          return;
        }

        // Fetch fresh data
        const freshData = await fetcher();

        // Cache the result
        cache.setClient(key, freshData, ttl, useSession);

        setData(freshData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key, ttl, useSession, enabled, ...dependencies]);

  const invalidate = React.useCallback(() => {
    cache.getClient(key, useSession) &&
      (useSession ? sessionCache.delete(key) : browserCache.delete(key));
  }, [key, useSession]);

  const refetch = React.useCallback(async () => {
    invalidate();
    const freshData = await fetcher();
    cache.setClient(key, freshData, ttl, useSession);
    setData(freshData);
    return freshData;
  }, [key, fetcher, ttl, useSession, invalidate]);

  return { data, loading, error, invalidate, refetch };
}

/**
 * Cache Cleanup (run periodically)
 */
export function cleanupCache() {
  // Clean expired memory cache entries
  for (const [key, item] of memoryCache.entries()) {
    if (Date.now() > item.expireAt) {
      memoryCache.delete(key);
    }
  }

  console.log(`Cache cleanup completed. Memory cache size: ${memCache.size()}`);
}

// Run cleanup every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupCache, 10 * 60 * 1000);
}
