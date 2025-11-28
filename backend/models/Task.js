const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a task title'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'review', 'done'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  attachments: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

// Create indexes for better query performance
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ dueDate: 1 });

// Update the updatedAt field before saving
taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.status === 'done' && !this.completedAt) {
    this.completedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);