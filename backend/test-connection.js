
const mongoose = require('mongoose');
require('dotenv').config();

async function testConnections() {
  console.log('Testing MongoDB connection...');
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully');
    await mongoose.disconnect();
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error.message);
  }

  console.log('\nTesting server availability...');
  try {
    const response = await fetch('http://localhost:5000/');
    console.log('✅ Server is responding');
  } catch (error) {
    console.log('❌ Server not responding:', error.message);
  }
}

testConnections();