import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentMateri from './pages/student/StudentMateri';
import StudentTugas from './pages/student/StudentTugas';
import StudentKritikSaran from './pages/student/StudentKritikSaran';
import StudentProfile from './pages/student/StudentProfile';

// Teacher pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherMateri from './pages/teacher/TeacherMateri';
import TeacherTugas from './pages/teacher/TeacherTugas';
import TeacherProfile from './pages/teacher/TeacherProfile';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminMateri from './pages/admin/AdminMateri';
import AdminTugas from './pages/admin/AdminTugas';
import AdminKritikSaran from './pages/admin/AdminKritikSaran';
import AdminStatistics from './pages/admin/AdminStatistics';
import AdminProfile from './pages/admin/AdminProfile';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Student routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Layout>
                    <StudentDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/materi"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Layout>
                    <StudentMateri />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/tugas"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Layout>
                    <StudentTugas />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/kritik-saran"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Layout>
                    <StudentKritikSaran />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Layout>
                    <StudentProfile />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Teacher routes */}
            <Route
              path="/teacher"
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <Layout>
                    <TeacherDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/materi"
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <Layout>
                    <TeacherMateri />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/tugas"
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <Layout>
                    <TeacherTugas />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/profile"
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <Layout>
                    <TeacherProfile />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <AdminUsers />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/materi"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <AdminMateri />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/tugas"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <AdminTugas />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/kritik-saran"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <AdminKritikSaran />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/statistics"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <AdminStatistics />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <AdminProfile />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;