const request = require('supertest');
const app = require('../app'); // مسیر به اپلیکیشن اکسپرس
const prisma = require('../config/db');

let token;
let createdTaskId;

beforeAll(async () => {
  // ایجاد کاربر تستی و دریافت توکن اگر احراز هویت داری (اختیاری)
  // فرض: کاربر با id = 1 وجود دارد
  token = 'mocked-token'; // یا ایجاد توکن JWT واقعی
});

afterAll(async () => {
  await prisma.task.deleteMany(); // پاک کردن همه تسک‌ها بعد از تست‌ها
  await prisma.$disconnect();
});

describe('🧪 Task API Tests', () => {
  it('✅ Create a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`) // اگر نیاز به auth باشد
      .send({
        title: 'Test Task',
        description: 'Test description',
        dueDate: '2025-06-01',
        categoryId: null,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.title).toBe('Test Task');
    createdTaskId = res.body.data.id;
  });

  it('📥 Get all tasks', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('✏️ Update a task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Task',
        description: 'Updated description',
        status: 'incomplete',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe('Updated Task');
  });

  it('✅ Toggle complete status', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${createdTaskId}/toggle`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(['complete', 'incomplete']).toContain(res.body.data.status);
  });

  it('🗑️ Delete task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Task deleted');
  });
});
