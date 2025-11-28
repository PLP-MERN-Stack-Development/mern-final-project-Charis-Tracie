const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get all tasks for a project
// @route   GET /api/tasks?project=:projectId
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    const { project, status, assignedTo } = req.query;
    const filter = {};

    if (project) filter.project = project;
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tasks = await Task.find(filter)
      .populate('project', 'name')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name members')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;

    // Verify project exists and user has access
    const project = await Project.findById(req.body.project);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const hasAccess = project.owner.toString() === req.user.id ||
                     project.members.some(m => m.user.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create tasks in this project'
      });
    }

    const task = await Task.create(req.body);

    const populatedTask = await Task.findById(task._id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    // Emit socket event
    if (req.io) {
      req.io.to(`project:${project._id}`).emit('task:created', populatedTask);
    }

    res.status(201).json({
      success: true,
      data: populatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id).populate('project');

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
        message: 'Not authorized to update this task'
      });
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('project', 'name')
    .populate('assignedTo', 'name email avatar')
    .populate('createdBy', 'name email avatar');

    // Emit socket event
    if (req.io) {
      req.io.to(`project:${task.project._id}`).emit('task:updated', task);
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user is project owner or task creator
    const project = task.project;
    const canDelete = project.owner.toString() === req.user.id ||
                     task.createdBy.toString() === req.user.id;

    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task'
      });
    }

    const projectId = task.project._id;
    await task.deleteOne();

    // Emit socket event
    if (req.io) {
      req.io.to(`project:${projectId}`).emit('task:deleted', { id: task._id });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};