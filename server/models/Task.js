const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  project: {
    type: String,
    default: 'No Project',
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  estimatedPomodoros: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  completedPomodoros: {
    type: Number,
    default: 0
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
taskSchema.index({ user: 1, completed: 1, createdAt: -1 });

module.exports = mongoose.model('Task', taskSchema); 