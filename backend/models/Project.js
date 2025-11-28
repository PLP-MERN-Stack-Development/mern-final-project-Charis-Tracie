const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a project name'],
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a project description'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member'],
      default: 'member'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['planning', 'active', 'on-hold', 'completed'],
    default: 'planning'
  },
  color: {
    type: String,
    default: '#3b82f6'
  },
  deadline: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for tasks
projectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project'
});

module.exports = mongoose.model('Project', projectSchema);