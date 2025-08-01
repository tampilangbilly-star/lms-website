import React from 'react';
import { BookOpen, Clock, CheckCircle, PlayCircle, Download, Calendar, Upload } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  // Mock data for demonstration
  const enrolledCourses = [
    {
      id: '1',
      title: 'Advanced React Concepts',
      instructor: 'John Smith',
      progress: 75,
      totalLessons: 20,
      completedLessons: 15,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300',
      nextLesson: 'State Management with Redux'
    },
    {
      id: '2',
      title: 'TypeScript Fundamentals',
      instructor: 'Sarah Johnson',
      progress: 45,
      totalLessons: 15,
      completedLessons: 7,
      thumbnail: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=300',
      nextLesson: 'Generic Types'
    },
    {
      id: '3',
      title: 'Node.js Backend Development',
      instructor: 'Mike Wilson',
      progress: 20,
      totalLessons: 25,
      completedLessons: 5,
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300',
      nextLesson: 'Express.js Basics'
    }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'lesson_completed',
      title: 'Completed "React Hooks Deep Dive"',
      course: 'Advanced React Concepts',
      time: '2 hours ago'
    },
    {
      id: '2',
      type: 'assignment_submitted',
      title: 'Submitted TypeScript Project',
      course: 'TypeScript Fundamentals',
      time: '1 day ago'
    },
    {
      id: '3',
      type: 'grade_received',
      title: 'Received grade for React Components Assignment',
      course: 'Advanced React Concepts',
      time: '2 days ago',
      grade: 'A-'
    }
  ];

  const upcomingAssignments = [
    {
      id: '1',
      title: 'Redux State Management Project',
      course: 'Advanced React Concepts',
      dueDate: '2024-02-15',
      status: 'pending'
    },
    {
      id: '2',
      title: 'TypeScript Interface Design',
      course: 'TypeScript Fundamentals',
      dueDate: '2024-02-20',
      status: 'in_progress'
    }
  ];

  const stats = [
    {
      label: 'Courses Enrolled',
      value: enrolledCourses.length,
      icon: BookOpen,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      label: 'Lessons Completed',
      value: enrolledCourses.reduce((sum, course) => sum + course.completedLessons, 0),
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      label: 'Hours Studied',
      value: 47,
      icon: Clock,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      label: 'Average Progress',
      value: `${Math.round(enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCourses.length)}%`,
      icon: Calendar,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900">Welcome back, Jane!</h1>
        <p className="text-secondary-600 mt-2">Continue your learning journey</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">{stat.label}</p>
                <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enrolled Courses */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-secondary-900">My Courses</h2>
              <button className="text-primary-600 hover:text-primary-700 font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-6">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="flex items-center space-x-4 p-4 border border-secondary-200 rounded-lg hover:border-primary-300 transition-colors">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-secondary-900">{course.title}</h3>
                    <p className="text-sm text-secondary-600">by {course.instructor}</p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-secondary-600">
                          {course.completedLessons}/{course.totalLessons} lessons
                        </span>
                        <span className="text-primary-600 font-medium">
                          {course.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-secondary-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-sm text-primary-600 mt-2">
                      Next: {course.nextLesson}
                    </p>
                  </div>
                  <button className="btn-primary flex items-center">
                    <PlayCircle className="h-5 w-5 mr-2" />
                    Continue
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Assignments */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Upcoming Assignments
            </h3>
            <div className="space-y-4">
              {upcomingAssignments.map((assignment) => (
                <div key={assignment.id} className="border-l-4 border-orange-400 pl-4">
                  <h4 className="font-medium text-secondary-900">{assignment.title}</h4>
                  <p className="text-sm text-secondary-600">{assignment.course}</p>
                  <p className="text-sm text-orange-600 font-medium">
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {activity.type === 'lesson_completed' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {activity.type === 'assignment_submitted' && (
                      <Upload className="h-5 w-5 text-blue-500" />
                    )}
                    {activity.type === 'grade_received' && (
                      <Download className="h-5 w-5 text-purple-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900">
                      {activity.title}
                    </p>
                    <p className="text-xs text-secondary-600">{activity.course}</p>
                    <p className="text-xs text-secondary-500">{activity.time}</p>
                    {activity.grade && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                        Grade: {activity.grade}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full btn-primary flex items-center justify-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Browse Courses
              </button>
              <button className="w-full btn-secondary flex items-center justify-center">
                <Download className="h-5 w-5 mr-2" />
                Download Materials
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};