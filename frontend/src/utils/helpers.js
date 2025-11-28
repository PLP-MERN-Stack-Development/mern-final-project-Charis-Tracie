import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns';

/**
 * Format date for display
 */
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return 'No date';
  return format(new Date(date), formatStr);
};

/**
 * Format date as relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

/**
 * Check if date is overdue
 */
export const isOverdue = (date) => {
  if (!date) return false;
  return isPast(new Date(date)) && !isToday(new Date(date));
};

/**
 * Get status color classes
 */
export const getStatusColor = (status) => {
  const colors = {
    todo: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
    review: 'bg-purple-100 text-purple-800 border-purple-200',
    done: 'bg-green-100 text-green-800 border-green-200',
    planning: 'bg-gray-100 text-gray-800 border-gray-200',
    active: 'bg-green-100 text-green-800 border-green-200',
    'on-hold': 'bg-red-100 text-red-800 border-red-200',
    completed: 'bg-blue-100 text-blue-800 border-blue-200'
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

/**
 * Get priority color classes
 */
export const getPriorityColor = (priority) => {
  const colors = {
    low: 'bg-gray-100 text-gray-800 border-gray-200',
    medium: 'bg-blue-100 text-blue-800 border-blue-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    urgent: 'bg-red-100 text-red-800 border-red-200'
  };
  return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Generate random color for avatars
 */
export const getRandomColor = () => {
  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316'  // orange
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Format task count
 */
export const formatTaskCount = (count) => {
  if (count === 0) return 'No tasks';
  if (count === 1) return '1 task';
  return `${count} tasks`;
};

/**
 * Get due date status
 */
export const getDueDateStatus = (dueDate) => {
  if (!dueDate) return null;
  
  const date = new Date(dueDate);
  
  if (isOverdue(date)) {
    return { label: 'Overdue', color: 'text-red-600' };
  }
  if (isToday(date)) {
    return { label: 'Due today', color: 'text-orange-600' };
  }
  if (isTomorrow(date)) {
    return { label: 'Due tomorrow', color: 'text-yellow-600' };
  }
  
  return { label: formatDate(dueDate), color: 'text-gray-600' };
};

/**
 * Sort array by property
 */
export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (order === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });
};

/**
 * Group array by property
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

/**
 * Calculate progress percentage
 */
export const calculateProgress = (completed, total) => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};