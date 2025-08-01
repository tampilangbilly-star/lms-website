import React from 'react';
import { BookOpen, Users, ClipboardList, BarChart3, Upload, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  // Mock data for demonstration
  const myCourses = [
    {
      id: '1',
      title: 'Advanced React Concepts',
      students: 45,
      lessons: 20,
      assignments: 8,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300',
      status: 'active',
      avgProgress: 68
    },
    {
      id: '2',
      title: 'TypeScript Fundamentals',
      students: 32,
      lessons: 15,
      assignments: 5,
      thumbnail: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=300',
      status: 'active',
      avgProgress: 45
    },
    {
      id: '3',
      title: 'JavaScript ES6+',
      students: 28,
      lessons: 12,
      assignments: 4,
      thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=300',
      status: 'draft',
      avgProgress: 0
    }
  ];

  const recentSubmissions = [
    {
      id: '1',
      student: 'Jane Doe',
      assignment: 'Redux State Management',
      course: 'Advanced React Concepts',
      submittedAt: '2024-02-10T10:30:00Z',
      status: 'pending',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
    },
    {
      id: '2',
      student: 'Mike Johnson',
      assignment: 'TypeScript Interfaces',
      course: 'TypeScript Fundamentals',
      submittedAt: '2024-02-10T09:15:00Z',
      status: 'graded',
      grade: 'A-',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    },
    {
      id: '3',
      student: 'Sarah Wilson',
      assignment: 'React Components',
      course: 'Advanced React Concepts',
      submittedAt: '2024-02-09T16:45:00Z',
      status: 'pending',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
    }
  ];

  const stats = [
    {
      label: 'Total Students',
      value: myCourses.reduce((sum, course) => sum + course.students, 0),
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      change: '+8%'
    },
    {
      label: 'Active Courses',
      value: myCourses.filter(course => course.status === 'active').length,
      icon: BookOpen,
      color: 'text-green-600',
      bg: 'bg-green-100',
      change: '+1'
    },
    {
      label: 'Pending Reviews',
      value: recentSubmissions.filter(sub => sub.status === 'pending').length,
      icon: ClipboardList,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
      change: '+3'
    },
    {
      label: 'Avg Progress',
      value: `${Math.round(myCourses.reduce((sum, course) => sum + course.avgProgress, 0) / myCourses.filter(c => c.status === 'active').length)}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      change: '+5%'
    }
  ];

  const quickActions = [
    { label: 'Create New Course', icon: BookOpen, color: 'bg-blue-600' },
    { label: 'Upload Material', icon: Upload, color: 'bg-green-600' },
    { label: 'Create Assignment', icon: ClipboardList, color: 'bg-purple-600' },
    { label: 'View Analytics', icon: BarChart3, color: 'bg-orange-600' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900">Teacher Dashboard</h1>
        <p className="text-secondary-600 mt-2">Manage your courses and track student progress</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Courses */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-secondary-900">My Courses</h2>
              <button className="btn-primary">
                <BookOpen className="h-5 w-5 mr-2" />
                Create Course
              </button>
            </div>
            
            <div className="space-y-6">
              {myCourses.map((course) => (
                <div key={course.id} className="flex items-center space-x-4 p-4 border border-secondary-200 rounded-lg hover:border-primary-300 transition-colors">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-secondary-900">{course.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        course.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-2 text-sm text-secondary-600">
                      <div>
                        <span className="font-medium">{course.students}</span> students
                      </div>
                      <div>
                        <span className="font-medium">{course.lessons}</span> lessons
                      </div>
                      <div>
                        <span className="font-medium">{course.assignments}</span> assignments
                      </div>
                    </div>
                    {course.status === 'active' && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-secondary-600">Average Progress</span>
                          <span className="text-primary-600 font-medium">{course.avgProgress}%</span>
                        </div>
                        <div className="w-full bg-secondary-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-primary-600 h-2 rounded-full" 
                            style={{ width: `${course.avgProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <button className="btn-secondary">
                    Manage
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Submissions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Recent Submissions
            </h3>
            <div className="space-y-4">
              {recentSubmissions.map((submission) => (
                <div key={submission.id} className="flex items-center space-x-3 p-3 border border-secondary-200 rounded-lg">
                  <img 
                    src={submission.avatar}
                    alt={submission.student}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-secondary-900">{submission.student}</h4>
                    <p className="text-sm text-secondary-600">{submission.assignment}</p>
                    <p className="text-xs text-secondary-500">{submission.course}</p>
                  </div>
                  <div className="text-right">
                    {submission.status === 'pending' ? (
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 text-orange-500 mr-1" />
                        <span className="text-xs text-orange-600">Pending</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-xs text-green-600">{submission.grade}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All Submissions
            </button>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <button 
                  key={index}
                  className={`${action.color} text-white p-3 rounded-lg hover:opacity-90 transition-opacity`}
                >
                  <action.icon className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-xs font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Performance Overview */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              This Week
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary-600">New Enrollments</span>
                <span className="font-semibold text-secondary-900">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary-600">Submissions Graded</span>
                <span className="font-semibold text-secondary-900">28</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary-600">Course Views</span>
                <span className="font-semibold text-secondary-900">342</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary-600">Materials Downloaded</span>
                <span className="font-semibold text-secondary-900">89</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};