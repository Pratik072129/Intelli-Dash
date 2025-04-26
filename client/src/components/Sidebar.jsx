import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Upload CSV', href: '/upload', icon: '📂' },
    { name: 'View Insights', href: '/insights', icon: '📈' },
    { name: 'Ask AI', href: '/ai-helper', icon: '🧠' },
    { name: 'Generate Report', href: '/reports', icon: '📄' },
  ];

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto">
        <div className="flex-grow flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  location.pathname === item.href
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 