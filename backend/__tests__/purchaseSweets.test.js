const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Sweet = require('../models/sweetModel');

let sweetId;

beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/sweetsTest';
  await mongoose.connect(mongoUri);

  // Create a sweet to purchase
  const sweet = await Sweet.create({
    name: 'Barfi',
    category: 'Gram',
    price: 100,
    quantity: 10
  });
  sweetId = sweet._id;
});

afterAll(async () => {
  await Sweet.deleteMany({});
  await mongoose.connection.close();
});

describe('POST /api/sweets/:id/purchase', () => {
  it('should purchase sweets and reduce quantity', async () => {
    const response = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .send({ quantity: 3 });
    expect(response.status).toBe(200);
    expect(response.body.msg).toMatch(/purchase successful/i);
    expect(response.body.sweet.quantity).toBe(7);
  });

  it('should return 400 for invalid quantity', async () => {
    const response = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .send({ quantity: 0 });
    expect(response.status).toBe(400);
    expect(response.body.msg).toMatch(/invalid purchase quantity/i);
  });

  it('should return 404 if sweet not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .post(`/api/sweets/${fakeId}/purchase`)
      .send({ quantity: 2 });
    expect(response.status).toBe(404);
    expect(response.body.msg).toMatch(/not found/i);
  });

  it('should return 400 if not enough stock', async () => {
    const response = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .send({ quantity: 100 });
    expect(response.status).toBe(400);
    expect(response.body.msg).toMatch(/not enough stock/i);
  });
});