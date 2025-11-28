import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token) {
      const socketURL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
      
      const newSocket = io(socketURL, {
        auth: { token }
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        setConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setConnected(false);
      }
    }
  }, [isAuthenticated, token]);

  const joinProject = (projectId) => {
    if (socket && connected) {
      socket.emit('join:project', projectId);
    }
  };

  const leaveProject = (projectId) => {
    if (socket && connected) {
      socket.emit('leave:project', projectId);
    }
  };

  const value = {
    socket,
    connected,
    joinProject,
    leaveProject
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};