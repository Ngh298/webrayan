/**
 * اسکریپت بررسی وضعیت دیتابیس
 * نمایش تمام databases، collections و تعداد documents
 */

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';

async function checkDatabases() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔍 در حال اتصال به MongoDB...\n');
    await client.connect();

    // لیست تمام دیتابیس‌ها
    const admin = client.db().admin();
    const dbList = await admin.listDatabases();

    console.log('📊 لیست دیتابیس‌های موجود:');
    console.log('━'.repeat(60));

    for (const db of dbList.databases) {
      console.log(
        `\n📁 Database: ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`
      );

      // اگر دیتابیس webrayan یا test باشه، collections رو هم نمایش بده
      if (
        db.name === 'webrayan' ||
        db.name === 'test' ||
        db.name.includes('webrayan')
      ) {
        const database = client.db(db.name);
        const collections = await database.listCollections().toArray();

        if (collections.length > 0) {
          console.log('  📑 Collections:');
          for (const collection of collections) {
            const count = await database
              .collection(collection.name)
              .countDocuments();
            console.log(`     - ${collection.name}: ${count} documents`);
          }
        } else {
          console.log('  📭 بدون collection');
        }
      }
    }

    console.log('\n' + '━'.repeat(60));
    console.log('✅ بررسی کامل شد!\n');

    // توصیه‌ها
    console.log('💡 توصیه‌ها:');
    console.log('─'.repeat(60));

    const hasWebrayan = dbList.databases.some(db => db.name === 'webrayan');
    const hasTest = dbList.databases.some(db => db.name === 'test');

    if (hasWebrayan && hasTest) {
      console.log('⚠️  دو دیتابیس جداگانه پیدا شد: webrayan و test');
      console.log(
        '   برای حذف دیتابیس test از MongoDB Compass یا mongosh استفاده کنید:'
      );
      console.log('   mongosh');
      console.log('   use test');
      console.log('   db.dropDatabase()');
    } else if (hasWebrayan) {
      console.log('✅ همه چیز در دیتابیس webrayan است');
    }

    console.log(
      '\n📝 نکته: از این به بعد همه collections در دیتابیس webrayan ذخیره می‌شوند'
    );
  } catch (error) {
    console.error('❌ خطا:', error.message);
  } finally {
    await client.close();
    console.log('\n👋 اتصال بسته شد');
  }
}

// اجرای اسکریپت
checkDatabases().catch(console.error);
