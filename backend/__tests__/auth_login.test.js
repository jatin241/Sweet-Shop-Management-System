const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const User = require("../models/userModel");
require('dotenv').config(); 

describe("Auth: Login", () => {
  
  beforeAll(async () => {
        const mongoUri = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/userRegistrationTest';
        await mongoose.connect(mongoUri);
        await User.deleteOne({ email: "test4@example.com" });
  });

  
  

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should login successfully with valid credentials", async () => {
    
     const userData = {
            email: `test4@example.com`,
            password: '123'
        };
        const user = new User(userData);
        await user.save();  // Don't forget await

        
    

    const res = await request(app)
      .post("/api/auth/login")
      .send(userData);

    expect(res.statusCode).toBe(200);
    //expect(res.body).toMatch(userData);
    expect(res.body.user.email).toBe("test4@example.com");
  });

});

const uniqueEmail = `test${Date.now()}@example.com`;
// Use uniqueEmail in your registration and login steps
