const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Sweet = require('../models/sweetModel');

let token;

beforeAll(async () => {
    // Connect to test database
    const mongoUri = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/userRegistrationTest';
    await mongoose.connect(mongoUri);

    // Register a user
    const userData = {
        email: `testuser_${Date.now()}@example.com`,
        password: 'TestPassword123'
    };
    await request(app)
        .post('/api/auth/register')
        .send(userData);

    // Login to get token
    const loginRes = await request(app)
        .post('/api/auth/login')
        .send(userData);

    token = loginRes.body.token;
}, 20000); // Increase timeout for setup

afterAll(async () => {
    await Sweet.deleteMany({ name: /testSweet/i });
    await mongoose.connection.close();
});

it('should add a sweet and return 201 with success message', async () => {
    const sweetData = {
        name: `testSweet_${Date.now()}`,
        category: 'testCategory',
        price: 100,
        quantity: 10
    };
    const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${token}`)
        .send(sweetData);
    expect(response.status).toBe(201);
    expect(response.body.msg).toMatch(/sweet added successfully/i);
});