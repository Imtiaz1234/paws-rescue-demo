const mongoose = require('mongoose');

const adoptionApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cat: { type: mongoose.Schema.Types.ObjectId, ref: 'Cat' },
  fullName: String,
  email: String,
  phone: String,
  address: String,
  homeType: String,
  rentOwn: String,
  householdMembers: String,
  existingPets: String,
  smokingHome: Boolean,
  outdoorSpace: Boolean,
  petExperience: String,
  workSchedule: String,
  petCareResponsible: String,
  willingVetCare: Boolean,
  surrenderedPetBefore: String,
  reasonAdopting: String,
  allergies: String,
  homeEnvironment: String,
  additionalDetails: String,
  agreePolicies: Boolean,
  contactDetails: String,
  homeCheckPassed: Boolean,
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdoptionApplication', adoptionApplicationSchema);
