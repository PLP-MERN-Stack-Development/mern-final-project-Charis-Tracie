import React, { useState, useEffect } from 'react';
import { tasksAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { X, Calendar, User, Tag, Edit2, Save } from 'lucide-react';
import { format } from 'date-fns';
import CommentSection from '../Comments/CommentSection';

const TaskDetail = ({ task, onClose, projectMembers }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    status: task.status,
    assignedTo: task.assignedTo?._id || '',
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async () => {
    try {
      const updateData = { ...formData };
      if (!updateData.assignedTo) delete updateData.assignedTo;
      if (!updateData.dueDate) delete updateData.dueDate;

      await tasksAPI.update(task._id, updateData);
      toast.success('Task updated successfully!');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3 flex-1">
            {editing ? (
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none flex-1"
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
            )}
          </div>
          <div className="flex items-center gap-2">
            {editing ? (
              <button
                onClick={handleUpdate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Status and Priority */}
          <div className="flex flex-wrap gap-2 mb-6">
            {editing ? (
              <>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(formData.status)}`}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(formData.priority)}`}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </>
            ) : (
              <>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
            {editing ? (
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Add a description..."
              />
            ) : (
              <p className="text-gray-600">{task.description || 'No description provided'}</p>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Assigned To */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Assigned To</p>
                {editing ? (
                  <select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Unassigned</option>
                    {projectMembers.map((member) => (
                      <option key={member.user._id} value={member.user._id}>
                        {member.user.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center gap-2">
                    {task.assignedTo ? (
                      <>
                        <img
                          src={task.assignedTo.avatar}
                          alt={task.assignedTo.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <p className="font-medium text-gray-900">{task.assignedTo.name}</p>
                      </>
                    ) : (
                      <p className="font-medium text-gray-900">Unassigned</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Due Date */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Due Date</p>
                {editing ? (
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                ) : (
                  <p className="font-medium text-gray-900">
                    {task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : 'No due date'}
                  </p>
                )}
              </div>
            </div>

            {/* Created By */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Created By</p>
                <div className="flex items-center gap-2">
                  <img
                    src={task.createdBy.avatar}
                    alt={task.createdBy.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <p className="font-medium text-gray-900">{task.createdBy.name}</p>
                </div>
              </div>
            </div>

            {/* Created At */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Created At</p>
                <p className="font-medium text-gray-900">
                  {format(new Date(task.createdAt), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-medium text-gray-700">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="border-t border-gray-200 pt-6">
            <CommentSection taskId={task._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;