import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsAPI, tasksAPI } from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, Users, Calendar, Edit, Trash2, 
  Plus, UserPlus, CheckCircle2, Circle, Clock 
} from 'lucide-react';
import { format } from 'date-fns';
import CreateTask from '../Tasks/CreateTask';
import TaskCard from '../Tasks/TaskCard';
import Loading from '../Common/Loading';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { socket, joinProject, leaveProject } = useSocket();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchProject();
    fetchTasks();
    
    if (socket) {
      joinProject(id);
    }

    return () => {
      if (socket) {
        leaveProject(id);
      }
    };
  }, [id, socket]);

  useEffect(() => {
    if (socket) {
      socket.on('task:created', (newTask) => {
        if (newTask.project._id === id) {
          setTasks((prev) => [newTask, ...prev]);
          toast.success('New task created!');
        }
      });

      socket.on('task:updated', (updatedTask) => {
        setTasks((prev) =>
          prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
        );
      });

      socket.on('task:deleted', (data) => {
        setTasks((prev) => prev.filter((t) => t._id !== data.id));
      });

      socket.on('project:updated', (updatedProject) => {
        if (updatedProject._id === id) {
          setProject(updatedProject);
        }
      });

      return () => {
        socket.off('task:created');
        socket.off('task:updated');
        socket.off('task:deleted');
        socket.off('project:updated');
      };
    }
  }, [socket, id]);

  const fetchProject = async () => {
    try {
      const res = await projectsAPI.getOne(id);
      setProject(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch project');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await tasksAPI.getAll({ project: id });
      setTasks(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const res = await tasksAPI.create({ ...taskData, project: id });
      setTasks([res.data.data, ...tasks]);
      setShowCreateTask(false);
      toast.success('Task created successfully!');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await projectsAPI.addMember(id, { email: memberEmail, role: 'member' });
      toast.success('Member added successfully!');
      setShowAddMember(false);
      setMemberEmail('');
      fetchProject();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsAPI.delete(id);
        toast.success('Project deleted successfully!');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  const getFilteredTasks = () => {
    if (filter === 'all') return tasks;
    return tasks.filter((task) => task.status === filter);
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'done').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const todo = tasks.filter((t) => t.status === 'todo').length;
    return { total, completed, inProgress, todo };
  };

  if (loading) return <Loading />;

  const stats = getTaskStats();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4"
               style={{ borderColor: project?.color || '#3b82f6' }}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{project?.name}</h1>
                <p className="text-gray-600">{project?.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddMember(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Member
                </button>
                <button
                  onClick={handleDeleteProject}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span>{project?.members.length} members</span>
              </div>
              {project?.deadline && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Due: {format(new Date(project.deadline), 'MMM dd, yyyy')}</span>
                </div>
              )}
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                project?.status === 'active' ? 'bg-green-100 text-green-800' :
                project?.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
                project?.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-red-100 text-red-800'
              }`}>
                {project?.status}
              </span>
            </div>

            {/* Team Members */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Team Members</h3>
              <div className="flex flex-wrap gap-2">
                {project?.members.map((member) => (
                  <div
                    key={member.user._id}
                    className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1"
                  >
                    <img
                      src={member.user.avatar}
                      alt={member.user.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm">{member.user.name}</span>
                    <span className="text-xs text-gray-500">({member.role})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Circle className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">To Do</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todo}</p>
              </div>
              <Circle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('todo')}
                className={`px-4 py-2 rounded-lg ${filter === 'todo' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                To Do
              </button>
              <button
                onClick={() => setFilter('in-progress')}
                className={`px-4 py-2 rounded-lg ${filter === 'in-progress' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilter('done')}
                className={`px-4 py-2 rounded-lg ${filter === 'done' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Done
              </button>
            </div>

            <button
              onClick={() => setShowCreateTask(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              New Task
            </button>
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            {getFilteredTasks().length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No tasks found</p>
              </div>
            ) : (
              getFilteredTasks().map((task) => (
                <TaskCard key={task._id} task={task} projectMembers={project?.members || []} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateTask && (
        <CreateTask
          onClose={() => setShowCreateTask(false)}
          onCreate={handleCreateTask}
          projectMembers={project?.members || []}
        />
      )}

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Team Member</h2>
            <form onSubmit={handleAddMember}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Member Email
                </label>
                <input
                  type="email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddMember(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;