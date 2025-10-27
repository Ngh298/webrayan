# Testing Guide

## راهنمای تست برای پروژه Next.js

### نصب Dependencies

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom
```

### اجرای تست‌ها

```bash
# اجرای همه تست‌ها
npm test

# اجرای تست‌ها با watch mode
npm test -- --watch

# اجرای تست‌ها با coverage
npm test -- --coverage

# اجرای یک تست خاص
npm test -- logger.test.js
```

### ساختار تست‌ها

```
__tests__/
├── lib/
│   ├── logger.test.js
│   ├── validation.test.js
│   └── api-response.test.js
├── components/
│   ├── Header.test.js
│   └── Footer.test.js
└── api/
    └── contact.test.js
```

### نوشتن تست‌ها

#### مثال: تست یک Component

```javascript
import { render, screen } from '@testing-library/react';
import Header from '@/app/components/Header';

describe('Header Component', () => {
  it('renders header with logo', () => {
    render(<Header />);
    const logo = screen.getByText(/webrayandev/i);
    expect(logo).toBeInTheDocument();
  });

  it('has navigation links', () => {
    render(<Header />);
    expect(screen.getByText('صفحه اصلی')).toBeInTheDocument();
    expect(screen.getByText('خدمات')).toBeInTheDocument();
  });
});
```

#### مثال: تست یک API Route

```javascript
import { POST } from '@/app/api/contact/route';
import { NextRequest } from 'next/server';

describe('/api/contact', () => {
  it('should validate required fields', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it('should accept valid contact form', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'تست',
        email: 'test@example.com',
        subject: 'موضوع تست',
        message: 'این یک پیام تست است',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
  });
});
```

### Best Practices

1. **نام‌گذاری واضح**: از نام‌های توصیفی برای تست‌ها استفاده کنید
2. **Test Isolation**: هر تست باید مستقل باشد
3. **Cleanup**: بعد از هر تست، resources را پاک کنید
4. **Mock External Dependencies**: سرویس‌های خارجی را mock کنید
5. **Coverage**: حداقل 60% coverage داشته باشید

### Coverage Goals

- **Statements**: حداقل 70%
- **Branches**: حداقل 60%
- **Functions**: حداقل 70%
- **Lines**: حداقل 70%

### Continuous Integration

در CI/CD pipeline، تست‌ها باید قبل از deploy اجرا شوند:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test -- --coverage
```

### Mock Examples

#### Mock MongoDB

```javascript
jest.mock('@/lib/mongodb', () => ({
  connectDB: jest.fn().mockResolvedValue({
    db: {
      collection: jest.fn().mockReturnValue({
        insertOne: jest.fn().mockResolvedValue({ insertedId: 'mock-id' }),
        find: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([]),
        }),
      }),
    },
  }),
}));
```

#### Mock NextAuth

```javascript
jest.mock('@/auth', () => ({
  auth: jest.fn().mockResolvedValue({
    user: { id: '1', email: 'test@test.com', role: 'user' },
  }),
}));
```

### Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Next.js Testing](https://nextjs.org/docs/testing)

