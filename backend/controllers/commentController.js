const Comment = require('../models/Comment');
const Task = require('../models/Task');

// @desc    Get all comments for a task
// @route   GET /api/comments?task=:taskId
// @access  Private
exports.getComments = async (req, res, next) => {
  try {
    const { task } = req.query;

    if (!task) {
      return res.status(400).json({
        success: false,
        message: 'Task ID is required'
      });
    }

    const comments = await Comment.find({ task })
      .populate('author', 'name email avatar')
      .sort('createdAt');

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new comment
// @route   POST /api/comments
// @access  Private
exports.createComment = async (req, res, next) => {
  try {
    req.body.author = req.user.id;

    // Verify task exists
    const task = await Task.findById(req.body.task).populate('project');
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has access to the project
    const project = task.project;
    const hasAccess = project.owner.toString() === req.user.id ||
                     project.members.some(m => m.user.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to comment on this task'
      });
    }

    const comment = await Comment.create(req.body);

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name email avatar');

    // Emit socket event
    if (req.io) {
      req.io.to(`project:${project._id}`).emit('comment:created', populatedComment);
    }

    res.status(201).json({
      success: true,
      data: populatedComment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
exports.updateComment = async (req, res, next) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment'
      });
    }

    comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      { new: true, runValidators: true }
    ).populate('author', 'name email avatar');

    // Get task and project for socket room
    const task = await Task.findById(comment.task).populate('project');

    // Emit socket event
    if (req.io && task) {
      req.io.to(`project:${task.project._id}`).emit('comment:updated', comment);
    }

    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    // Get task and project for socket room
    const task = await Task.findById(comment.task).populate('project');

    await comment.deleteOne();

    // Emit socket event
    if (req.io && task) {
      req.io.to(`project:${task.project._id}`).emit('comment:deleted', { id: comment._id });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};