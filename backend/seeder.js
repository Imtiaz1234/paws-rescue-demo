require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Cat = require('./models/Cat');
const RescueCenter = require('./models/RescueCenter');

const seedData = async () => {
  await connectDB();

  // Clear old data
  await RescueCenter.deleteMany({});
  await Cat.deleteMany({});

  // Create BRACU Cat Rescue center with verified field
  const bracuRescue = new RescueCenter({
    name: 'BRACU Cat Rescue',
    location: 'Dhaka',
    isPublished: false,
    verified: false
  });
  await bracuRescue.save();

  // Create cats linked to BRACU Cat Rescue
  const cats = [
    {
      name: 'Charlie',
      age: 3,
      gender: 'Male',
      healthStatus: 'Healthy',
      images: ['https://raw.githubusercontent.com/Imtiaz1234/cat_images/main/charlie.jpeg'],
      location: 'Dhaka',
      specialNeeds: 'None',
      rescueCenter: bracuRescue._id
    },
    {
      name: 'Luna',
      age: 2,
      gender: 'Female',
      healthStatus: 'Minor cold',
      images: ['https://raw.githubusercontent.com/Imtiaz1234/cat_images/main/luna.jpeg'],
      location: 'Chittagong',
      specialNeeds: 'Requires medication',
      rescueCenter: bracuRescue._id
    },
    {
      name: 'Max',
      age: 1,
      gender: 'Male',
      healthStatus: 'Healthy',
      images: ['https://raw.githubusercontent.com/Imtiaz1234/cat_images/main/max.jpeg'],
      location: 'Sylhet',
      specialNeeds: 'None',
      rescueCenter: bracuRescue._id
    }
  ];

  const savedCats = await Cat.insertMany(cats);

  // Link cats to the rescue center
  bracuRescue.cats = savedCats.map(cat => cat._id);
  await bracuRescue.save();

  // New Rescue Center "Karim biral home"
  const karimRescue = new RescueCenter({
    name: 'Karim biral home',
    location: 'Chattogram',
    isPublished: false,
    verified: false
  });
  await karimRescue.save();

  // New Cat "King" linked to Karim biral home
  const kingCat = new Cat({
    name: 'King',
    age: 4,
    gender: 'Male',
    healthStatus: 'Healthy',
    images: ['https://raw.githubusercontent.com/Imtiaz1234/cat_images/main/king.jpeg'], 
    location: 'Chattogram',
    specialNeeds: 'None',
    rescueCenter: karimRescue._id
  });
  await kingCat.save();

  // Link King cat to Karim biral home
  karimRescue.cats = [kingCat._id];
  await karimRescue.save();

  console.log('Seeded BRACU Cat Rescue and cats, plus Karim biral home and King');
  process.exit();
};

seedData().catch(err => {
  console.error(err);
  process.exit(1);
});
