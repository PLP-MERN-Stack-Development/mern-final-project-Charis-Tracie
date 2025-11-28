const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Get all projects for user
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id }
      ]
    })
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar')
    .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user has access
    const hasAccess = project.owner._id.toString() === req.user.id ||
                     project.members.some(m => m.user._id.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this project'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res, next) => {
  try {
    req.body.owner = req.user.id;
    req.body.members = [{ user: req.user.id, role: 'owner' }];

    const project = await Project.create(req.body);

    // Add project to user's projects
    await User.findByIdAndUpdate(req.user.id, {
      $push: { projects: project._id }
    });

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    // Emit socket event for real-time update
    if (req.io) {
      req.io.emit('project:created', populatedProject);
    }

    res.status(201).json({
      success: true,
      data: populatedProject
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check ownership or admin role
    const isOwnerOrAdmin = project.owner.toString() === req.user.id ||
                          project.members.some(m => 
                            m.user.toString() === req.user.id && 
                            (m.role === 'owner' || m.role === 'admin')
                          );

    if (!isOwnerOrAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar');

    // Emit socket event
    if (req.io) {
      req.io.to(`project:${project._id}`).emit('project:updated', project);
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Only owner can delete
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project'
      });
    }

    await project.deleteOne();

    // Emit socket event
    if (req.io) {
      req.io.to(`project:${project._id}`).emit('project:deleted', { id: project._id });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private
exports.addMember = async (req, res, next) => {
  try {
    const { email, role } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is owner or admin
    const isOwnerOrAdmin = project.owner.toString() === req.user.id ||
                          project.members.some(m => 
                            m.user.toString() === req.user.id && 
                            (m.role === 'owner' || m.role === 'admin')
                          );

    if (!isOwnerOrAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add members'
      });
    }

    // Find user by email
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is already a member
    const isMember = project.members.some(m => 
      m.user.toString() === userToAdd._id.toString()
    );

    if (isMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member'
      });
    }

    // Add member
    project.members.push({
      user: userToAdd._id,
      role: role || 'member'
    });

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    // Emit socket event
    if (req.io) {
      req.io.to(`project:${project._id}`).emit('project:member-added', updatedProject);
    }

    res.status(200).json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    next(error);
  }
};