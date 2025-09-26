const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Sweet = require('../models/sweetModel');

let token;
let sweetId;

beforeAll(async () => {
    const mongoUri = process.env.MONGO_URL || process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/userRegistrationTest';
    await mongoose.connect(mongoUri);
    // Clean up users and sweets collections before test (must be first)
    const User = require('../models/userModel');
    await User.deleteMany({});
    await Sweet.deleteMany({});
    // Ensure admin user exists before tests
    await request(app)
        .post('/api/auth/register')
        .send({ email: 'admin@test.com', password: 'password', isAdmin: true });
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
    // Add a sweet for updating
    const sweet = await Sweet.create({
        name: `Barfi_${Date.now()}`,
        category: 'Milk',
        price: 100,
        quantity: 10
    });
    sweetId = sweet._id;
}, 20000);

afterAll(async () => {
    await Sweet.deleteMany({ name: /UpdateMe|UpdatedSweet/i });
    await mongoose.connection.close();
});

describe('PUT /api/sweets/:id', () => {
    it('should update a sweet and return 200 with updated sweet', async () => {
        const updateData = {
            name: `UpdatedSweet_${Date.now()}`,
            category: 'UpdatedCat',
            price: 99,
            quantity: 20
        };
        const response = await request(app)
            .put(`/api/sweets/${sweetId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updateData);
        expect(response.status).toBe(200);
        expect(response.body.msg).toMatch(/updated successfully/i);
        expect(response.body.sweet.name).toBe(updateData.name); // <-- fix here
        expect(response.body.sweet.category).toBe(updateData.category);
        expect(response.body.sweet.price).toBe(updateData.price);
        expect(response.body.sweet.quantity).toBe(updateData.quantity);
    });
});
