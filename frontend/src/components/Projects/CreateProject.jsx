import React, { useState } from 'react';
import { X } from 'lucide-react';

const CreateProject = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    color: '#3b82f6',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);

  const colors = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Pink', value: '#ec4899' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onCreate(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength={100}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              maxLength={500}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Describe your project"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/500 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Color
            </label>
            <div className="flex gap-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`w-10 h-10 rounded-full transition-transform ${
                    formData.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deadline (Optional)
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;