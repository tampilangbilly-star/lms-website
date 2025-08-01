import React, { useState } from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notifications
  const notifications = [
    {
      id: '1',
      title: 'New assignment posted',
      message: 'Advanced React Concepts - Project 3 has been posted',
      time: '5 min ago',
      unread: true
    },
    {
      id: '2',
      title: 'Grade updated',
      message: 'Your submission for TypeScript Basics has been graded',
      time: '1 hour ago',
      unread: true
    },
    {
      id: '3',
      title: 'Course reminder',
      message: 'Live session starts in 30 minutes',
      time: '2 hours ago',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="bg-white shadow-sm border-b border-secondary-200 h-16 flex items-center justify-between px-4 lg:px-6">
      {/* Left side */}
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-md text-secondary-600 hover:bg-secondary-100 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="hidden md:flex items-center ml-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search courses, materials..."
              className="pl-10 pr-4 py-2 w-80 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg"
          >
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-secondary-200 z-50">
              <div className="p-4 border-b border-secondary-200">
                <h3 className="text-lg font-semibold text-secondary-900">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-secondary-100 hover:bg-secondary-50 ${
                      notification.unread ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-secondary-900">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-secondary-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-secondary-500 mt-2">
                          {notification.time}
                        </p>
                      </div>
                      {notification.unread && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full ml-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-secondary-200">
                <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        {user && (
          <div className="flex items-center">
            <div className="hidden md:block text-right mr-3">
              <div className="text-sm font-medium text-secondary-900">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-xs text-secondary-500 capitalize">
                {user.role}
              </div>
            </div>
            {user.avatar ? (
              <img 
                className="h-8 w-8 rounded-full object-cover" 
                src={user.avatar} 
                alt={`${user.firstName} ${user.lastName}`}
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-sm font-medium text-primary-600">
                  {user.firstName[0]}{user.lastName[0]}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close notifications */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowNotifications(false)}
        />
      )}
    </header>
  );
};