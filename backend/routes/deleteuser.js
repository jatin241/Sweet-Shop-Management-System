const mongoose = require('mongoose');
const User = require('../models/userModel.js');
require('dotenv').config()


async function deleteAllUsers() {
  await mongoose.connect(process.env.MONGO_URL);
  await User.deleteMany({});
  console.log('All users deleted');
  await mongoose.connection.close();
}

deleteAllUsers();