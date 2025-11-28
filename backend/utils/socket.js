const jwt = require('jsonwebtoken');
const User = require('../models/User');

const setupSocket = (io) => {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.id})`);

    // Join project rooms
    socket.on('join:project', (projectId) => {
      socket.join(`project:${projectId}`);
      console.log(`User ${socket.user.name} joined project ${projectId}`);
    });

    // Leave project rooms
    socket.on('leave:project', (projectId) => {
      socket.leave(`project:${projectId}`);
      console.log(`User ${socket.user.name} left project ${projectId}`);
    });

    // User typing indicator
    socket.on('typing:start', (data) => {
      socket.to(`project:${data.projectId}`).emit('user:typing', {
        user: socket.user.name,
        taskId: data.taskId
      });
    });

    socket.on('typing:stop', (data) => {
      socket.to(`project:${data.projectId}`).emit('user:stopped-typing', {
        user: socket.user.name,
        taskId: data.taskId
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name} (${socket.id})`);
    });
  });
};

module.exports = setupSocket;