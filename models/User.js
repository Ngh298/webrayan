import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { logger } from '@/lib/logger';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'نام الزامی است'],
      trim: true,
      minlength: [2, 'نام باید حداقل 2 کاراکتر باشد'],
      maxlength: [50, 'نام نباید بیشتر از 50 کاراکتر باشد'],
    },
    email: {
      type: String,
      required: [true, 'ایمیل الزامی است'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'فرمت ایمیل صحیح نیست',
      ],
    },
    phone: {
      type: String,
      trim: true,
      default: null,
      validate: {
        validator: function(v) {
          // اگر phone خالی یا null باشد، validation را پاس کن
          if (!v || v.length === 0) return true;
          // در غیر این صورت، فرمت را چک کن
          return /^(09[0-9]{9}|(\+98|0098|98)?9[0-9]{9})$/.test(v);
        },
        message: 'فرمت شماره تلفن صحیح نیست (مثال: 09123456789)',
      },
    },
    password: {
      type: String,
      required: function() {
        // رمز عبور فقط برای کاربران credentials الزامی است
        return !this.provider || this.provider === 'credentials';
      },
      minlength: [6, 'رمز عبور باید حداقل 6 کاراکتر باشد'],
      select: false, // پیش‌فرض رمز عبور رو برنمی‌گردونه
    },
    provider: {
      type: String,
      enum: ['credentials', 'google', 'github'],
      default: 'credentials',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // خودکار createdAt و updatedAt رو اضافه می‌کنه
  }
);

// 🔐 Hook قبل از ذخیره - Hash کردن رمز عبور
userSchema.pre('save', async function (next) {
  // فقط اگه رمز عبور تغییر کرده باشه و وجود داشته باشه
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    // تولید Salt با 12 دور (امنیت بالا)
    const salt = await bcrypt.genSalt(12);

    // Hash کردن رمز عبور
    this.password = await bcrypt.hash(this.password, salt);

    logger.debug('رمز عبور Hash شد');
    next();
  } catch (error) {
    logger.error('خطا در Hash کردن رمز', error);
    next(error);
  }
});

// 🔍 متد برای مقایسه رمز عبور
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // مقایسه رمز ورودی با رمز Hash شده
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    logger.debug('نتیجه مقایسه رمز:', isMatch);
    return isMatch;
  } catch (error) {
    logger.error('خطا در مقایسه رمز', error);
    throw new Error('خطا در بررسی رمز عبور');
  }
};

// 📊 متد برای گرفتن اطلاعات عمومی کاربر (بدون رمز)
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// جلوگیری از ایجاد مدل تکراری در Next.js
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
