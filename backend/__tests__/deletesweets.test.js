const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Sweet = require('../models/sweetModel');

let sweetId, token;

beforeAll(async () => {
  const mongoUri = process.env.MONGO_URL || process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/userRegistration';
  await mongoose.connect(mongoUri);

  // Clean up users and sweets collections before test (must be first)
  const User = require('../models/userModel');
  await User.deleteMany({});
  await Sweet.deleteMany({});

  // Ensure admin user exists before tests
  const email = 'admin@test.com';
  const password = 'password';
  await request(app).post('/api/auth/register').send({ email, password, isAdmin: true });
  // Force admin privilege in DB
  await mongoose.model('User').updateOne({ email }, { isAdmin: true });
  const loginRes = await request(app).post('/api/auth/login').send({ email, password });
  token = loginRes.body.token;

  // Create a sweet to delete with a unique name
  const sweet = await Sweet.create({
    name: `DeleteMe_${Date.now()}`,
    category: 'Test',
    price: 50,
    quantity: 5
  });
  sweetId = sweet._id;
});

afterAll(async () => {
  await Sweet.deleteMany({});
  await mongoose.connection.close();
});

describe('DELETE /api/sweets/:id', () => {
  it('should delete a sweet and return 200 with success message', async () => {
    const response = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.msg).toMatch(/deleted successfully/i);
  });

  it('should return 404 if sweet does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .delete(`/api/sweets/${fakeId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(404);
    expect(response.body.msg).toMatch(/not found/i);
  });
});