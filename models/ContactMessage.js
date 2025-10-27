import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'نام الزامی است'],
      trim: true,
      minlength: [2, 'نام باید حداقل 2 کاراکتر باشد'],
      maxlength: [100, 'نام نباید بیشتر از 100 کاراکتر باشد'],
    },
    email: {
      type: String,
      required: [true, 'ایمیل الزامی است'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'فرمت ایمیل صحیح نیست'],
    },
    phone: {
      type: String,
      trim: true,
      default: '',
      match: [
        /^(\+98|0)?9\d{9}$/,
        'شماره موبایل صحیح نیست (مثال: 09123456789)',
      ],
    },
    subject: {
      type: String,
      required: [true, 'موضوع الزامی است'],
      trim: true,
      minlength: [5, 'موضوع باید حداقل 5 کاراکتر باشد'],
      maxlength: [200, 'موضوع نباید بیشتر از 200 کاراکتر باشد'],
    },
    message: {
      type: String,
      required: [true, 'پیام الزامی است'],
      trim: true,
      minlength: [20, 'پیام باید حداقل 20 کاراکتر باشد'],
      maxlength: [1000, 'پیام نباید بیشتر از 1000 کاراکتر باشد'],
    },
    projectType: {
      type: String,
      enum: [
        'website',
        'ecommerce',
        'personal',
        'corporate',
        'educational',
        'news',
        'restaurant & cafe',
        'other',
      ],
      default: 'website',
    },
    budget: {
      type: String,
      default: '',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    timeline: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'archived'],
      default: 'new',
      index: true,
    },
    ip: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

contactMessageSchema.index({ createdAt: -1 });

const ContactMessage =
  mongoose.models.ContactMessage ||
  mongoose.model('ContactMessage', contactMessageSchema);

export default ContactMessage;
