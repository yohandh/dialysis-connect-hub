
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../models/user.model');
const Patient = require('../models/patient.model');
const Center = require('../models/center.model');
const Appointment = require('../models/appointment.model');
const CkdRecord = require('../models/ckdRecord.model');

// Sample data similar to the mock data in the frontend
const { users, roles } = require('./sampleData/users');
const { centers } = require('./sampleData/centers');
const { appointments } = require('./sampleData/appointments');
const { ckdRecords } = require('./sampleData/ckdRecords');

async function initDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dialysis-center');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Patient.deleteMany({}),
      Center.deleteMany({}),
      Appointment.deleteMany({}),
      CkdRecord.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Create users with hashed passwords
    const createdUsers = [];
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password || 'password123', 10);
      
      const newUser = new User({
        ...user,
        password: hashedPassword
      });

      const savedUser = await newUser.save();
      createdUsers.push(savedUser);

      // Create patient profile for patient users
      if (user.roleId === 3) { // Patient role
        const patientData = {
          userId: savedUser._id,
          firstName: user.name.split(' ')[0],
          lastName: user.name.split(' ')[1] || '',
          email: user.email,
          phone: user.mobileNo,
          dateOfBirth: '1980-01-01', // Default value
          gender: 'male',           // Default value
          address: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'California',
            zipCode: '12345'
          },
          emergencyContact: {
            name: 'Emergency Contact',
            relationship: 'Family',
            phone: '555-1234'
          },
          preferredCenter: null  // Will be updated later
        };
        const patient = new Patient(patientData);
        await patient.save();
      }
    }
    console.log(`Created ${createdUsers.length} users`);

    // Create centers
    const createdCenters = [];
    for (const center of centers) {
      const newCenter = new Center(center);
      const savedCenter = await newCenter.save();
      createdCenters.push(savedCenter);
    }
    console.log(`Created ${createdCenters.length} centers`);

    // Create appointments
    const createdAppointments = [];
    for (const appointment of appointments) {
      // Find a patient user
      const patientUser = createdUsers.find(u => u.roleId === 3);
      const patient = await Patient.findOne({ userId: patientUser?._id });
      
      // Find a center
      const center = createdCenters[0];

      if (patient && center) {
        const newAppointment = new Appointment({
          ...appointment,
          patientId: patient._id,
          centerId: center._id
        });
        const savedAppointment = await newAppointment.save();
        createdAppointments.push(savedAppointment);
      }
    }
    console.log(`Created ${createdAppointments.length} appointments`);

    // Create CKD records
    const createdRecords = [];
    for (const record of ckdRecords) {
      const patient = await Patient.findOne();
      if (patient) {
        const newRecord = new CkdRecord({
          ...record,
          patientId: patient._id
        });
        const savedRecord = await newRecord.save();
        createdRecords.push(savedRecord);
      }
    }
    console.log(`Created ${createdRecords.length} CKD records`);

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Database initialization failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

initDatabase();
