const mongoose = require('mongoose');
const User = require('../models/userModel.js');

async function deleteAllUsers() {
  await mongoose.connect('mongodb://127.0.0.1:27017/userRegistration');
  await User.deleteMany({});
  console.log('All users deleted');
  await mongoose.connection.close();
}

deleteAllUsers();