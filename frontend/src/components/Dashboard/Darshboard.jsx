import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../../services/api';
import { Plus, FolderKanban, Clock, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';
import CreateProject from '../Projects/CreateProject';
import ProjectCard from './ProjectCard';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { socket } = useSocket();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('project:created', (newProject) => {
        setProjects((prev) => [newProject, ...prev]);
        toast.success('New project created!');
      });

      socket.on('project:updated', (updatedProject) => {
        setProjects((prev) =>
          prev.map((p) => (p._id === updatedProject._id ? updatedProject : p))
        );
      });

      socket.on('project:deleted', (data) => {
        setProjects((prev) => prev.filter((p) => p._id !== data.id));
        toast.success('Project deleted');
      });

      return () => {
        socket.off('project:created');
        socket.off('project:updated');
        socket.off('project:deleted');
      };
    }
  }, [socket]);

  const fetchProjects = async () => {
    try {
      const res = await projectsAPI.getAll();
      setProjects(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const res = await projectsAPI.create(projectData);
      setProjects([res.data.data, ...projects]);
      setShowCreateModal(false);
      toast.success('Project created successfully!');
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage your projects and tasks</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <Plus className="w-5 h-5" />
              New Project
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Projects</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{projects.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <FolderKanban className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Projects</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {projects.filter((p) => p.status === 'active').length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Team Members</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {new Set(projects.flatMap((p) => p.members.map((m) => m.user._id))).size}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <FolderKanban className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No projects yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first project</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <CreateProject
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateProject}
        />
      )}
    </div>
  );
};

export default Dashboard;