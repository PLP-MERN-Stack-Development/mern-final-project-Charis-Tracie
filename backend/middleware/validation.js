const { body, param, validationResult } = require('express-validator');

// Validation middleware to check for errors
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// User validation rules
exports.registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

exports.loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
];

// Project validation rules
exports.projectValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Project name is required')
    .isLength({ max: 100 }).withMessage('Project name cannot exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
];

// Task validation rules
exports.taskValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('project')
    .notEmpty().withMessage('Project is required')
    .isMongoId().withMessage('Invalid project ID')
];

// Comment validation rules
exports.commentValidation = [
  body('content')
    .trim()
    .notEmpty().withMessage('Comment cannot be empty')
    .isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters')
];

// MongoDB ObjectId validation
exports.mongoIdValidation = [
  param('id').isMongoId().withMessage('Invalid ID format')
];