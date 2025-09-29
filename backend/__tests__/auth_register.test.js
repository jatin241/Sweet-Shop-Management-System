const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
require('dotenv').config(); 

describe('POST /api/auth/register', () => {
    beforeAll(async () => {
        
        const mongoUri = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/userRegistrationTest';
        await mongoose.connect(mongoUri);
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
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
        expect(response.body.msg).toMatch('user created');
        console.log('Test completed, response:', response.body);
    });
});