const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  color: { type: String, default: '#FFD60A' },
  credits: { type: Number, default: 3 },
  instructor: { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Course', courseSchema)
