const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const adminExists = await Admin.findOne({ admin_name: 'testadmin' });
  if (!adminExists) {
    await Admin.create({
      admin_name: 'testadmin',
      password: 'test123' // Will be hashed by pre('save') hook
    });
    console.log('Test Admin seeded');
  } else {
    console.log('Test Admin already exists');
  }
  process.exit(0);
}).catch(err => {
  console.log(err);
  process.exit(1);
});
