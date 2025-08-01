import React from 'react';
import { Users, BookOpen, Activity, TrendingUp, UserPlus, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  // Mock data for demonstration
  const systemStats = [
    {
      label: 'Total Users',
      value: 1248,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      change: '+12%',
      trend: 'up'
    },
    {
      label: 'Active Courses',
      value: 67,
      icon: BookOpen,
      color: 'text-green-600',
      bg: 'bg-green-100',
      change: '+5%',
      trend: 'up'
    },
    {
      label: 'System Activity',
      value: '94%',
      icon: Activity,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      change: '+2%',
      trend: 'up'
    },
    {
      label: 'Revenue',
      value: '$24,580',
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
      change: '+18%',
      trend: 'up'
    }
  ];

  const userBreakdown = [
    { role: 'Students', count: 1050, percentage: 84, color: 'bg-blue-500' },
    { role: 'Teachers', count: 185, percentage: 15, color: 'bg-green-500' },
    { role: 'Admins', count: 13, percentage: 1, color: 'bg-purple-500' }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'user_registered',
      message: 'New student registered: Alice Johnson',
      time: '5 minutes ago',
      icon: UserPlus,
      color: 'text-green-600'
    },
    {
      id: '2',
      type: 'course_published',
      message: 'Course "Advanced Python" published by Dr. Smith',
      time: '1 hour ago',
      icon: BookOpen,
      color: 'text-blue-600'
    },
    {
      id: '3',
      type: 'system_alert',
      message: 'Server maintenance scheduled for tonight',
      time: '2 hours ago',
      icon: AlertTriangle,
      color: 'text-orange-600'
    },
    {
      id: '4',
      type: 'backup_completed',
      message: 'Daily backup completed successfully',
      time: '3 hours ago',
      icon: CheckCircle,
      color: 'text-green-600'
    }
  ];

  const topCourses = [
    {
      id: '1',
      title: 'Advanced React Concepts',
      instructor: 'John Smith',
      students: 245,
      revenue: '$4,900',
      rating: 4.8,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100'
    },
    {
      id: '2',
      title: 'TypeScript Fundamentals',
      instructor: 'Sarah Johnson',
      students: 189,
      revenue: '$3,780',
      rating: 4.7,
      thumbnail: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=100'
    },
    {
      id: '3',
      title: 'Python for Data Science',
      instructor: 'Mike Wilson',
      students: 167,
      revenue: '$3,340',
      rating: 4.9,
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=100'
    }
  ];

  const pendingApprovals = [
    {
      id: '1',
      type: 'course',
      title: 'Machine Learning Basics',
      teacher: 'Dr. Emily Chen',
      submitted: '2024-02-10',
      status: 'pending'
    },
    {
      id: '2',
      type: 'teacher',
      title: 'Teacher Application',
      teacher: 'Robert Davis',
      submitted: '2024-02-09',
      status: 'pending'
    },
    {
      id: '3',
      type: 'material',
      title: 'Advanced CSS Techniques',
      teacher: 'Lisa Anderson',
      submitted: '2024-02-08',
      status: 'pending'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900">Admin Dashboard</h1>
        <p className="text-secondary-600 mt-2">System overview and management</p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {systemStats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                </div>
              </div>
              <div className="text-sm font-medium text-green-600">
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* User Breakdown */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">User Distribution</h3>
          <div className="space-y-4">
            {userBreakdown.map((user, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-secondary-700">{user.role}</span>
                  <span className="text-sm font-semibold text-secondary-900">{user.count}</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div 
                    className={`${user.color} h-2 rounded-full`} 
                    style={{ width: `${user.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Courses */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Top Courses</h3>
          <div className="space-y-4">
            {topCourses.map((course, index) => (
              <div key={course.id} className="flex items-center space-x-3">
                <img 
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-secondary-900 text-sm">{course.title}</h4>
                  <p className="text-xs text-secondary-600">by {course.instructor}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-secondary-500">{course.students} students</span>
                    <span className="text-xs font-medium text-green-600">{course.revenue}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="text-xs font-medium text-secondary-700 ml-1">{course.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-secondary-600">Server Uptime</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-secondary-900">99.9%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-secondary-600">Database</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-secondary-900">Healthy</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-secondary-600">Storage Used</span>
              <span className="text-sm font-medium text-secondary-900">67%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-secondary-600">Active Sessions</span>
              <span className="text-sm font-medium text-secondary-900">342</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-secondary-600">Last Backup</span>
              <span className="text-sm font-medium text-secondary-900">3 hours ago</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-secondary-100 ${activity.color}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-secondary-900">{activity.message}</p>
                  <p className="text-xs text-secondary-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All Activities
          </button>
        </div>

        {/* Pending Approvals */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Pending Approvals
            <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
              {pendingApprovals.length}
            </span>
          </h3>
          <div className="space-y-4">
            {pendingApprovals.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-secondary-900 text-sm">{item.title}</h4>
                  <p className="text-xs text-secondary-600">by {item.teacher}</p>
                  <p className="text-xs text-secondary-500">
                    Submitted: {new Date(item.submitted).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.type === 'course' ? 'bg-blue-100 text-blue-800' :
                    item.type === 'teacher' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {item.type}
                  </span>
                  <Clock className="h-4 w-4 text-orange-500" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex space-x-3 mt-4">
            <button className="flex-1 btn-primary text-sm">
              Review All
            </button>
            <button className="flex-1 btn-secondary text-sm">
              Quick Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};