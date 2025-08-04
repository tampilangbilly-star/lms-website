import React, { useState, useEffect } from 'react';
import { materiAPI } from '../../utils/api';
import { 
  BookOpen, 
  Play, 
  Download, 
  Calendar,
  User,
  Search,
  Filter,
  FileText
} from 'lucide-react';

const StudentMateri = () => {
  const [materi, setMateri] = useState([]);
  const [filteredMateri, setFilteredMateri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchMateri();
  }, []);

  useEffect(() => {
    filterMateri();
  }, [materi, searchTerm, filterType]);

  const fetchMateri = async () => {
    try {
      const response = await materiAPI.getAll();
      setMateri(response.data);
    } catch (error) {
      console.error('Error fetching materi:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMateri = () => {
    let filtered = materi;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.teacher_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      if (filterType === 'video') {
        filtered = filtered.filter(item => item.video_url);
      } else if (filterType === 'document') {
        filtered = filtered.filter(item => item.file_path && !item.video_url);
      }
    }

    setFilteredMateri(filtered);
  };

  const handleDownload = (filePath, title) => {
    const link = document.createElement('a');
    link.href = `http://localhost:5000${filePath}`;
    link.download = title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : null;
  };

  const MateriCard = ({ item }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
            {item.description && (
              <p className="text-gray-600 text-sm mb-4">{item.description}</p>
            )}
            
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {item.teacher_name}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(item.created_at).toLocaleDateString('id-ID')}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {item.video_url && (
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-red-600" />
              </div>
            )}
            {item.file_path && (
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Content */}
      {item.video_url && (
        <div className="px-6 pb-4">
          {item.video_type === 'youtube' ? (
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <iframe
                src={getYouTubeEmbedUrl(item.video_url)}
                title={item.title}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <video
                controls
                className="w-full h-full object-cover"
                src={`http://localhost:5000${item.video_url}`}
              >
                Browser Anda tidak mendukung video.
              </video>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {item.file_path && (
              <button
                onClick={() => handleDownload(item.file_path, item.title)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Materi
              </button>
            )}
          </div>
          
          <div className="text-xs text-gray-500">
            {item.video_url && item.file_path ? 'Video & Dokumen' : 
             item.video_url ? 'Video' : 'Dokumen'}
          </div>
        </div>
      </div>
    </div>
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Materi Pembelajaran</h1>
          <p className="mt-2 text-sm text-gray-600">
            Akses semua materi pembelajaran yang tersedia
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari materi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">Semua Jenis</option>
              <option value="video">Video</option>
              <option value="document">Dokumen</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Menampilkan {filteredMateri.length} dari {materi.length} materi
        </p>
      </div>

      {/* Materi Grid */}
      {filteredMateri.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMateri.map((item) => (
            <MateriCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada materi</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterType !== 'all' 
              ? 'Tidak ada materi yang sesuai dengan pencarian atau filter Anda.'
              : 'Belum ada materi yang tersedia.'}
          </p>
          {(searchTerm || filterType !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
            >
              Reset Filter
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentMateri;