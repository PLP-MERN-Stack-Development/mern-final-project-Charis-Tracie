import React from 'react';
import { AlertCircle, XCircle } from 'lucide-react';

const ErrorMessage = ({ message, type = 'error', onClose }) => {
  const styles = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <XCircle className="w-5 h-5 text-red-500" />
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: <AlertCircle className="w-5 h-5 text-yellow-500" />
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: <AlertCircle className="w-5 h-5 text-blue-500" />
    }
  };

  const style = styles[type] || styles.error;

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4 mb-4`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">{style.icon}</div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${style.text}`}>{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-3 flex-shrink-0 ${style.text} hover:opacity-75`}
          >
            <XCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;