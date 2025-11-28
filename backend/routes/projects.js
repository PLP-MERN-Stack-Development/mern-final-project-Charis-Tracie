const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { projectValidation, mongoIdValidation, validate } = require('../middleware/validation');

// Get all projects and create new project
router.route('/')
  .get(protect, getProjects)
  .post(protect, projectValidation, validate, createProject);

// Get, update, and delete specific project
router.route('/:id')
  .get(protect, mongoIdValidation, validate, getProject)
  .put(protect, mongoIdValidation, validate, updateProject)
  .delete(protect, mongoIdValidation, validate, deleteProject);

// Add member to project
router.post('/:id/members', protect, mongoIdValidation, validate, addMember);

module.exports = router;