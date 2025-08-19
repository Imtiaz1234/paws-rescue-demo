const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: { type: String, enum: ['Male', 'Female', 'Unknown'] },
  healthStatus: String,
  images: [String],
  location: String,
  specialNeeds: String,
  adoptionStatus: {
  type: String,
  enum: ['Available', 'Pending', 'Approved', 'Adopted'],
  default: 'Available'
},

  rescueCenter: { type: mongoose.Schema.Types.ObjectId, ref: 'RescueCenter' }
});

module.exports = mongoose.model('Cat', catSchema);
