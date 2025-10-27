import { NextResponse } from 'next/server';

/**
 * Health Check API
 * بررسی وضعیت کلی سیستم
 */

export async function GET() {
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'WebrayanDev API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks: {
      server: '✅ Running',
      memory: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
      uptime: `${Math.round(process.uptime())} seconds`,
      database: process.env.MONGODB_URI ? '✅ Configured' : '❌ Not configured',
    },
  };

  return NextResponse.json(healthStatus, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
