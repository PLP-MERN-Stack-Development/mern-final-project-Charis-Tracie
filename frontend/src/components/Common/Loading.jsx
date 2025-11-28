import React from 'react';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-300 absolute top-0 left-0" style={{ animationDirection: 'reverse' }}></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">{message}</p>
    </div>
  );
};

export default Loading;