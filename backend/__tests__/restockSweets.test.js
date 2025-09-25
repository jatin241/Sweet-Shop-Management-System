const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Sweet = require('../models/sweetModel');

let sweetId;
let token;

beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/sweetsTest';
  await mongoose.connect(mongoUri);

  // Create a sweet to restock
  const sweet = await Sweet.create({
    name: 'Barfi',
    category: 'Gram',
    price: 100,
    quantity: 10
  });
  sweetId = sweet._id;

  // Register and login to get token
  const email = 'admin@test.com';
  const password = 'password';
  await request(app).post('/api/auth/register').send({ email, password, isAdmin: true });
  const loginRes = await request(app).post('/api/auth/login').send({ email, password });
  token = loginRes.body.token;
});

afterAll(async () => {
  await Sweet.deleteMany({});
  await mongoose.connection.close();
});

describe('POST /api/sweets/:id/restock', () => {
  it('should restock sweets and increase quantity', async () => {
    const response = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 5 });
    expect(response.status).toBe(200);
    expect(response.body.msg).toMatch(/restock successful/i);
    expect(response.body.sweet.quantity).toBe(15);
  });

  it('should return 400 for invalid quantity', async () => {
    const response = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 0 });
    expect(response.status).toBe(400);
    expect(response.body.msg).toMatch(/invalid restock quantity/i);
  });

  it('should return 404 if sweet not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .post(`/api/sweets/${fakeId}/restock`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 2 });
    expect(response.status).toBe(404);
    expect(response.body.msg).toMatch(/not found/i);
  });
});