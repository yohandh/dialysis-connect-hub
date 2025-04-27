
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  street: String,
  city: String,
  state: String,
  zipCode: String
});

const emergencyContactSchema = new Schema({
  name: String,
  relationship: String,
  phone: String
});

const patientSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  dateOfBirth: {
    type: String
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  address: addressSchema,
  emergencyContact: emergencyContactSchema,
  preferredCenter: {
    type: Schema.Types.ObjectId,
    ref: 'Center'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Patient', patientSchema);
