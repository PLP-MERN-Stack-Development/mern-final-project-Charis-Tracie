import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">TF</span>
            </div>
            <span className="text-xl font-bold text-gray-900">TaskFlow</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="hidden md:inline">Dashboard</span>
            </Link>

            {/* User Menu */}
            <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
              <div className="flex items-center gap-3">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-10 h-10 rounded-full border-2 border-blue-100"
                />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;