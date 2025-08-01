import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/common/Layout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserRole } from './types';

const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case UserRole.STUDENT:
      return <StudentDashboard />;
    case UserRole.TEACHER:
      return <TeacherDashboard />;
    case UserRole.ADMIN:
      return <AdminDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardRouter />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Placeholder routes for future features */}
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <h1 className="text-3xl font-bold text-secondary-900 mb-8">Courses</h1>
                      <div className="card">
                        <p className="text-secondary-600">Course management feature coming soon...</p>
                      </div>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/assignments"
              element={
                <ProtectedRoute allowedRoles={[UserRole.TEACHER, UserRole.STUDENT]}>
                  <Layout>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <h1 className="text-3xl font-bold text-secondary-900 mb-8">Assignments</h1>
                      <div className="card">
                        <p className="text-secondary-600">Assignment management feature coming soon...</p>
                      </div>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/materials"
              element={
                <ProtectedRoute allowedRoles={[UserRole.TEACHER, UserRole.STUDENT]}>
                  <Layout>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <h1 className="text-3xl font-bold text-secondary-900 mb-8">Materials</h1>
                      <div className="card">
                        <p className="text-secondary-600">Material management feature coming soon...</p>
                      </div>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/students"
              element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.TEACHER]}>
                  <Layout>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <h1 className="text-3xl font-bold text-secondary-900 mb-8">Students</h1>
                      <div className="card">
                        <p className="text-secondary-600">Student management feature coming soon...</p>
                      </div>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/teachers"
              element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <Layout>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <h1 className="text-3xl font-bold text-secondary-900 mb-8">Teachers</h1>
                      <div className="card">
                        <p className="text-secondary-600">Teacher management feature coming soon...</p>
                      </div>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/analytics"
              element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.TEACHER]}>
                  <Layout>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <h1 className="text-3xl font-bold text-secondary-900 mb-8">Analytics</h1>
                      <div className="card">
                        <p className="text-secondary-600">Analytics feature coming soon...</p>
                      </div>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/forums"
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <h1 className="text-3xl font-bold text-secondary-900 mb-8">Discussion Forums</h1>
                      <div className="card">
                        <p className="text-secondary-600">Discussion forum feature coming soon...</p>
                      </div>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/upload"
              element={
                <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
                  <Layout>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <h1 className="text-3xl font-bold text-secondary-900 mb-8">Upload Content</h1>
                      <div className="card">
                        <p className="text-secondary-600">Content upload feature coming soon...</p>
                      </div>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/reports"
              element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <Layout>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <h1 className="text-3xl font-bold text-secondary-900 mb-8">Reports</h1>
                      <div className="card">
                        <p className="text-secondary-600">Reports feature coming soon...</p>
                      </div>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <h1 className="text-3xl font-bold text-secondary-900 mb-8">Settings</h1>
                      <div className="card">
                        <p className="text-secondary-600">Settings feature coming soon...</p>
                      </div>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 Route */}
            <Route 
              path="*" 
              element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-secondary-900 mb-4">404</h1>
                    <p className="text-xl text-secondary-600">Page not found</p>
                  </div>
                </div>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
