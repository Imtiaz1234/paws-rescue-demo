const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function createAdmin() {
  try {
    // Optional, recommended for Mongoose 7 compatibility
    mongoose.set('strictQuery', false);

    // Connect without deprecated options
    await mongoose.connect('your_mongodb_connection_string_here');

    const hashedPass = await bcrypt.hash('adminami', 10);
    const adminExists = await User.findOne({ email: 'admin@google.com' });

    if (!adminExists) {
      const admin = new User({
        email: 'admin@google.com',
        password: hashedPass,
        role: 'Admin'
      });
      await admin.save();
      console.log('Admin created successfully');
    } else {
      console.log('Admin user already exists');
    }

  } catch (err) {
    console.error('Error creating admin user:', err);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();
