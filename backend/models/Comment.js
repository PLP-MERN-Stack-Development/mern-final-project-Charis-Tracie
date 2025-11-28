const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Comment cannot be empty'],
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isEdited: {
    type: Boolean,
    default: false
  }
});

// Create index for faster queries
commentSchema.index({ task: 1, createdAt: -1 });

// Update the updatedAt field before saving
commentSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.isNew) {
    this.updatedAt = Date.now();
    this.isEdited = true;
  }
  next();
});

module.exports = mongoose.model('Comment', commentSchema);