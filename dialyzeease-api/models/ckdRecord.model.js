
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ckdRecordSchema = new Schema({
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  egfr: {
    type: Number,
    required: true
  },
  creatinine: {
    type: Number,
    required: true
  },
  calculatedStage: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  doctorNotes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CkdRecord', ckdRecordSchema);
