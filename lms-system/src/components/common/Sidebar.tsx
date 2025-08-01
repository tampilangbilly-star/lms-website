import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  GraduationCap,
  ClipboardList,
  MessageCircle,
  BarChart3,
  Upload,
  Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT] },
  { name: 'Courses', href: '/courses', icon: BookOpen, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT] },
  { name: 'Assignments', href: '/assignments', icon: ClipboardList, roles: [UserRole.TEACHER, UserRole.STUDENT] },
  { name: 'Materials', href: '/materials', icon: Download, roles: [UserRole.TEACHER, UserRole.STUDENT] },
  { name: 'Students', href: '/students', icon: GraduationCap, roles: [UserRole.ADMIN, UserRole.TEACHER] },
  { name: 'Teachers', href: '/teachers', icon: Users, roles: [UserRole.ADMIN] },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: [UserRole.ADMIN, UserRole.TEACHER] },
  { name: 'Forums', href: '/forums', icon: MessageCircle, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT] },
  { name: 'Upload Content', href: '/upload', icon: Upload, roles: [UserRole.TEACHER] },
  { name: 'Reports', href: '/reports', icon: FileText, roles: [UserRole.ADMIN] },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const filteredNavigation = navigation.filter(item => 
    user && item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-30 h-full w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-secondary-200">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-secondary-900">LearnHub</span>
            </div>
          </div>

          {/* User Info */}
          {user && (
            <div className="px-4 py-4 border-b border-secondary-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {user.avatar ? (
                    <img 
                      className="h-10 w-10 rounded-full object-cover" 
                      src={user.avatar} 
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600">
                        {user.firstName[0]}{user.lastName[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-secondary-900">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-xs text-secondary-500 capitalize">
                    {user.role}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="px-4 py-4 border-t border-secondary-200 space-y-2">
            <Link
              to="/settings"
              onClick={onClose}
              className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900 transition-colors"
            >
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};