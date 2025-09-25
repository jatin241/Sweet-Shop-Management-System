const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Sweet = require('../models/sweetModel');

let token;

beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/userRegistrationTest';
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
    // Add sweets for searching
    await Sweet.create([
        { name: 'Barfi', category: 'Milk', price: 100, quantity: 10 },
        { name: 'Ladoo', category: 'Gram', price: 50, quantity: 20 },
        { name: 'Jalebi', category: 'Sugar', price: 80, quantity: 15 }
    ]);
}, 20000);

afterAll(async () => {
    await Sweet.deleteMany({ name: { $in: ['Barfi', 'Ladoo', 'Jalebi'] } });
    await mongoose.connection.close();
});

describe('POST /api/sweets/search', () => {
    it('should search sweets by name', async () => {
        const response = await request(app)
            .post('/api/sweets/search')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Barfi' });
        expect(response.status).toBe(200);
        expect(response.body.sweets.length).toBeGreaterThan(0);
        expect(response.body.sweets[0].name).toMatch(/barfi/i);
    });

    it('should search sweets by category', async () => {
        const response = await request(app)
            .post('/api/sweets/search')
            .set('Authorization', `Bearer ${token}`)
            .send({ category: 'Gram' });
        expect(response.status).toBe(200);
        expect(response.body.sweets.length).toBeGreaterThan(0);
        expect(response.body.sweets[0].category).toMatch(/gram/i);
    });

    it('should search sweets by price range', async () => {
        const response = await request(app)
            .post('/api/sweets/search')
            .set('Authorization', `Bearer ${token}`)
            .send({ minPrice: 60, maxPrice: 120 });
        expect(response.status).toBe(200);
        expect(response.body.sweets.length).toBeGreaterThan(0);
        expect(response.body.sweets.some(s => s.price >= 60 && s.price <= 120)).toBe(true);
    });
});
