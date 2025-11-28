import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

/**
 * Custom hook to use Socket.io context
 * Provides easy access to socket instance and helper methods
 */
export const useSocket = () => {
  const context = useContext(SocketContext);
  
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  
  return context;
};

export default useSocket;