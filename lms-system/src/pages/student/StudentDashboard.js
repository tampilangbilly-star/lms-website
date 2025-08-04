import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { materiAPI, tugasAPI } from '../../utils/api';
import { 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Calendar,
  Clock,
  Award,
  TrendingUp,
  Play
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalMateri: 0,
    totalTugas: 0,
    tugasPending: 0,
    tugasGraded: 0,
    averageScore: 0
  });
  const [recentMateri, setRecentMateri] = useState([]);
  const [recentTugas, setRecentTugas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch materi
      const materiResponse = await materiAPI.getAll();
      const materiData = materiResponse.data;
      
      // Fetch tugas
      const tugasResponse = await tugasAPI.getAll();
      const tugasData = tugasResponse.data;
      
      // Calculate stats
      const pendingTugas = tugasData.filter(t => t.status === 'pending').length;
      const gradedTugas = tugasData.filter(t => t.status === 'graded');
      const averageScore = gradedTugas.length > 0 
        ? gradedTugas.reduce((sum, t) => sum + (t.nilai || 0), 0) / gradedTugas.length 
        : 0;

      setStats({
        totalMateri: materiData.length,
        totalTugas: tugasData.length,
        tugasPending: pendingTugas,
        tugasGraded: gradedTugas.length,
        averageScore: Math.round(averageScore)
      });

      // Set recent data (last 5 items)
      setRecentMateri(materiData.slice(0, 5));
      setRecentTugas(tugasData.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, description }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon: Icon, to, color }) => (
    <Link
      to={to}
      className="block bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">Selamat Datang, {user?.full_name}!</h1>
        <p className="mt-2 text-blue-100">
          Semangat belajar hari ini! Mari jelajahi materi dan kerjakan tugas-tugas Anda.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Materi"
          value={stats.totalMateri}
          icon={BookOpen}
          color="bg-blue-500"
          description="Materi tersedia"
        />
        <StatCard
          title="Tugas Saya"
          value={stats.totalTugas}
          icon={FileText}
          color="bg-green-500"
          description="Total tugas"
        />
        <StatCard
          title="Belum Dinilai"
          value={stats.tugasPending}
          icon={Clock}
          color="bg-yellow-500"
          description="Menunggu penilaian"
        />
        <StatCard
          title="Rata-rata Nilai"
          value={stats.averageScore || '-'}
          icon={Award}
          color="bg-purple-500"
          description="Dari tugas yang dinilai"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickActionCard
          title="Lihat Materi"
          description="Akses semua materi pembelajaran"
          icon={BookOpen}
          to="/student/materi"
          color="bg-blue-500"
        />
        <QuickActionCard
          title="Upload Tugas"
          description="Kumpulkan tugas Anda"
          icon={FileText}
          to="/student/tugas"
          color="bg-green-500"
        />
        <QuickActionCard
          title="Kritik & Saran"
          description="Sampaikan masukan Anda"
          icon={MessageSquare}
          to="/student/kritik-saran"
          color="bg-purple-500"
        />
      </div>

      {/* Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Materi */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Materi Terbaru</h2>
            <Link 
              to="/student/materi" 
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Lihat Semua
            </Link>
          </div>
          
          {recentMateri.length > 0 ? (
            <div className="space-y-3">
              {recentMateri.map((materi) => (
                <div key={materi.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    {materi.video_url ? (
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Play className="w-5 h-5 text-red-600" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">{materi.title}</p>
                    <p className="text-xs text-gray-500">oleh {materi.teacher_name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Belum ada materi</p>
          )}
        </div>

        {/* Recent Tugas */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Tugas Terbaru</h2>
            <Link 
              to="/student/tugas" 
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Lihat Semua
            </Link>
          </div>
          
          {recentTugas.length > 0 ? (
            <div className="space-y-3">
              {recentTugas.map((tugas) => (
                <div key={tugas.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      tugas.status === 'graded' 
                        ? 'bg-green-100' 
                        : 'bg-yellow-100'
                    }`}>
                      <FileText className={`w-5 h-5 ${
                        tugas.status === 'graded' 
                          ? 'text-green-600' 
                          : 'text-yellow-600'
                      }`} />
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">{tugas.title}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {tugas.status === 'graded' ? 'Sudah dinilai' : 'Menunggu penilaian'}
                      </p>
                      {tugas.status === 'graded' && tugas.nilai && (
                        <span className="text-xs font-medium text-green-600">
                          Nilai: {tugas.nilai}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Belum ada tugas</p>
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Tips Belajar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <TrendingUp className="w-5 h-5 text-blue-600 mt-1 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-900">Buat Jadwal Belajar</p>
              <p className="text-xs text-blue-700">Atur waktu belajar rutin setiap hari</p>
            </div>
          </div>
          <div className="flex items-start">
            <Calendar className="w-5 h-5 text-blue-600 mt-1 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-900">Kerjakan Tugas Tepat Waktu</p>
              <p className="text-xs text-blue-700">Jangan menunda pengumpulan tugas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;