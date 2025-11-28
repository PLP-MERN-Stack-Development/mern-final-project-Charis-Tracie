const express = require('express');
const router = express.Router();
const {
  getComments,
  createComment,
  updateComment,
  deleteComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');
const { commentValidation, mongoIdValidation, validate } = require('../middleware/validation');

router.route('/')
  .get(protect, getComments)
  .post(protect, commentValidation, validate, createComment);

router.route('/:id')
  .put(protect, mongoIdValidation, commentValidation, validate, updateComment)
  .delete(protect, mongoIdValidation, validate, deleteComment);

module.exports = router;