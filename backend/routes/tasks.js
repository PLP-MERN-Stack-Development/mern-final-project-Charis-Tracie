const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { taskValidation, mongoIdValidation, validate } = require('../middleware/validation');

// Get all tasks and create new task
router.route('/')
  .get(protect, getTasks)
  .post(protect, taskValidation, validate, createTask);

// Get, update, and delete specific task
router.route('/:id')
  .get(protect, mongoIdValidation, validate, getTask)
  .put(protect, mongoIdValidation, validate, updateTask)
  .delete(protect, mongoIdValidation, validate, deleteTask);

module.exports = router;