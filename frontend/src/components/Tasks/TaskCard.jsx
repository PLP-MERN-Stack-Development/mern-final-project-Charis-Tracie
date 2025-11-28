import React, { useState } from 'react';
import { tasksAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Calendar, User, Trash2, Edit, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import TaskDetail from './TaskDetail';

const TaskCard = ({ task, projectMembers }) => {
  const [showDetail, setShowDetail] = useState(false);

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      todo: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      review: 'bg-purple-100 text-purple-800',
      done: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await tasksAPI.update(task._id, { status: newStatus });
      toast.success('Status updated!');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.delete(task._id);
        toast.success('Task deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3
              onClick={() => setShowDetail(true)}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer mb-2"
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
            )}
          </div>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 ml-2"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusColor(task.status)}`}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>

          {task.tags && task.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            {task.assignedTo && (
              <div className="flex items-center gap-1">
                <img
                  src={task.assignedTo.avatar}
                  alt={task.assignedTo.name}
                  className="w-6 h-6 rounded-full"
                  title={task.assignedTo.name}
                />
                <span className="text-xs">{task.assignedTo.name}</span>
              </div>
            )}

            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs">{format(new Date(task.dueDate), 'MMM dd')}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowDetail(true)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs">Details</span>
          </button>
        </div>
      </div>

      {showDetail && (
        <TaskDetail
          task={task}
          onClose={() => setShowDetail(false)}
          projectMembers={projectMembers}
        />
      )}
    </>
  );
};

export default TaskCard;