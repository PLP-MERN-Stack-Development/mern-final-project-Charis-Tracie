import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Settings, Users } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      name: 'Projects',
      path: '/projects',
      icon: <FolderKanban className="w-5 h-5" />
    },
    {
      name: 'Team',
      path: '/team',
      icon: <Users className="w-5 h-5" />
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">TF</span>
          </div>
          <span className="text-xl font-bold text-gray-900">TaskFlow</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;