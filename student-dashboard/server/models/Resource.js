const mongoose = require('mongoose')

const resourceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['link', 'note', 'syllabus', 'file'], default: 'link' },
  url: { type: String },
  notes: { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Resource', resourceSchema)
