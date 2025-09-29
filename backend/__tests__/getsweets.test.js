const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Sweet = require('../models/sweetModel');

let token;

beforeAll(async () => {
    const mongoUri = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/userRegistrationTest';
    await mongoose.connect(mongoUri);
    // Register and login a user to get a token
    const userData = {
        email: `testuser_${Date.now()}@example.com`,
        password: 'TestPassword123'
    };
    await request(app)
        .post('/api/auth/register')
        .send(userData);
    const loginRes = await request(app)
        .post('/api/auth/login')
        .send(userData);
    token = loginRes.body.token;
    // Add a sweet for testing
    await Sweet.create({
        name: `testSweet_${Date.now()}`,
        category: 'testCategory',
        price: 100,
        quantity: 10
    });
}, 20000);

afterAll(async () => {
    await Sweet.deleteMany({ name: /testSweet/i });
    await mongoose.connection.close();
});

describe('GET /api/sweets', () => {
    it('should fetch sweets and return 200 with sweets array', async () => {
        const response = await request(app)
            .get('/api/sweets')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.sweets)).toBe(true);
    });
});
