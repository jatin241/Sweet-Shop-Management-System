const request = require('supertest');
const app = require('../routes/app');
const mongoose = require('mongoose');

describe('POST /api/auth/register', () => {
    afterAll(async () => {
        await mongoose.connection.close();
        console.log('MongoDB connection closed after tests');
    });

    it('should register a user and return 201 with success message', async () => {
        const userData = {
            email: `testuser_${Date.now()}@example.com`,
            password: 'TestPassword123'
        };
        const response = await request(app)
            .post('/api/auth/register')
            .send(userData);

        expect(response.status).toBe(201);
        expect(response.body.msg).toMatch('success');
        console.log('Test completed, response:', response.body);
    });
});
