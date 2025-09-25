const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Sweet = require('../models/sweetModel');

describe('POST /api/sweets', () => {
    afterAll(async () => {
        await Sweet.deleteMany({ name: /testSweet/i }); // Clean up test sweets
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
            .send(sweetData);
        expect(response.status).toBe(201);
        expect(response.body.msg).toMatch(/sweet added successfully/i);
    });
});
