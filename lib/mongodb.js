import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import { logger } from './logger';

if (!process.env.MONGODB_URI) {
  throw new Error('❌ لطفاً MONGODB_URI را در .env.local تنظیم کنید');
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // در حالت development از global cache استفاده می‌کنیم
  // تا در hot-reload دوباره connection ساخته نشه

  let globalWithMongo = global;

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
    logger.db('اتصال جدید به MongoDB ایجاد شد (Development)');
  } else {
    logger.db('استفاده از اتصال موجود MongoDB (Development)');
  }

  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // در حالت production connection جدید می‌سازیم
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
  logger.db('اتصال به MongoDB ایجاد شد (Production)');
}

/**
 * اتصال به دیتابیس و بازگشت client و db
 * @returns {Promise<{client: MongoClient, db: Db}>}
 */
export async function connectDB() {
  try {
    const client = await clientPromise;
    const db = client.db('webrayan'); // نام دیتابیس

    // تست اتصال
    await db.admin().ping();

    return { client, db };
  } catch (error) {
    logger.error('خطا در اتصال به MongoDB', error);
    throw new Error('اتصال به دیتابیس برقرار نشد');
  }
}

/**
 * دریافت دیتابیس (برای استفاده در API routes)
 * @returns {Promise<Db>}
 */
export async function getDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db('webrayan'); // نام دیتابیس
    return db;
  } catch (error) {
    logger.error('خطا در دریافت دیتابیس', error);
    throw new Error('اتصال به دیتابیس برقرار نشد');
  }
}

/**
 * تست اتصال به دیتابیس
 * @returns {Promise<boolean>}
 */
export async function testConnection() {
  try {
    const client = await clientPromise;
    const db = client.db('webrayan');
    await db.admin().ping();
    logger.success('اتصال به MongoDB موفقیت‌آمیز بود');
    return true;
  } catch (error) {
    logger.error('خطا در تست اتصال MongoDB', error);
    return false;
  }
}

/**
 * بستن اتصال (فقط برای cleanup)
 */
export async function disconnectDB() {
  try {
    if (client) {
      await client.close();
      logger.db('اتصال MongoDB بسته شد');
    }
  } catch (error) {
    logger.error('خطا در بستن اتصال MongoDB', error);
  }
}

/**
 * اتصال به MongoDB با استفاده از Mongoose (برای Models)
 * @returns {Promise<typeof mongoose>}
 */
export async function connectMongoDB() {
  try {
    if (mongoose.connection.readyState >= 1) {
      // Already connected or connecting
      logger.db('استفاده از اتصال موجود Mongoose');
      return mongoose;
    }

    const opts = {
      dbName: 'webrayan', // نام دیتابیس یکسان با MongoClient
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(process.env.MONGODB_URI, opts);
    logger.db('اتصال Mongoose به MongoDB برقرار شد (Database: webrayan)');
    return mongoose;
  } catch (error) {
    logger.error('خطا در اتصال Mongoose به MongoDB', error);
    throw new Error('اتصال به دیتابیس با Mongoose برقرار نشد');
  }
}

// Export connectMongoDB as default for easier imports
export default connectMongoDB;
