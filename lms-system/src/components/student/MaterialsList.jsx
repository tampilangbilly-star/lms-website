import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Download, 
  Search, 
  FileText, 
  File, 
  Image, 
  Calendar, 
  User, 
  ChevronDown, 
  ChevronUp,
  AlertCircle,
  Loader
} from 'lucide-react';

const MaterialsList = () => {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'

  // Fetch materials on component mount
  useEffect(() => {
    fetchMaterials();
  }, []);

  // Filter and sort materials when search term or sort changes
  useEffect(() => {
    let filtered = materials.filter(material => 
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.uploaderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort materials
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'uploadDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredMaterials(filtered);
  }, [materials, searchTerm, sortBy, sortOrder]);

  // Fetch materials from API
  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/materials');
      setMaterials(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching materials:', err);
      setError('Failed to load materials. Please try again.');
      // Mock data for demonstration
      setMaterials([
        {
          id: 1,
          title: 'Introduction to React Hooks',
          fileName: 'react-hooks-guide.pdf',
          uploaderName: 'Dr. John Smith',
          uploadDate: '2024-01-15',
          fileSize: '2.5 MB',
          fileType: 'application/pdf',
          downloadUrl: '/api/materials/download/1'
        },
        {
          id: 2,
          title: 'JavaScript ES6 Features',
          fileName: 'es6-features.pptx',
          uploaderName: 'Prof. Sarah Johnson',
          uploadDate: '2024-01-10',
          fileSize: '5.2 MB',
          fileType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          downloadUrl: '/api/materials/download/2'
        },
        {
          id: 3,
          title: 'Database Design Principles',
          fileName: 'database-design.docx',
          uploaderName: 'Dr. Mike Wilson',
          uploadDate: '2024-01-08',
          fileSize: '1.8 MB',
          fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          downloadUrl: '/api/materials/download/3'
        },
        {
          id: 4,
          title: 'CSS Grid Layout Examples',
          fileName: 'css-grid-examples.pdf',
          uploaderName: 'Prof. Emily Chen',
          uploadDate: '2024-01-05',
          fileSize: '3.1 MB',
          fileType: 'application/pdf',
          downloadUrl: '/api/materials/download/4'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle download
  const handleDownload = async (material) => {
    try {
      const response = await axios.get(material.downloadUrl, {
        responseType: 'blob',
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', material.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download file. Please try again.');
    }
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Get file icon based on file type
  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return FileText;
    if (fileType.includes('image')) return Image;
    if (fileType.includes('word') || fileType.includes('document')) return File;
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return FileText;
    return File;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center space-x-2">
          <Loader className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading materials...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Materials</h1>
        <p className="text-gray-600">Access and download course materials shared by your instructors.</p>
      </div>

      {/* Search and Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search materials by title, instructor, or filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Sort */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="title">Title</option>
                <option value="uploaderName">Instructor</option>
                <option value="uploadDate">Date</option>
                <option value="fileName">File Name</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => setViewMode('card')}
                className={`px-3 py-2 text-sm font-medium ${
                  viewMode === 'card' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 text-sm font-medium ${
                  viewMode === 'table' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredMaterials.length} of {materials.length} materials
        </p>
      </div>

      {/* Materials Display */}
      {filteredMaterials.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No materials found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'No materials have been uploaded yet.'}
          </p>
        </div>
      ) : viewMode === 'card' ? (
        /* Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => {
            const FileIcon = getFileIcon(material.fileType);
            return (
              <div key={material.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  <FileIcon className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate" title={material.title}>
                      {material.title}
                    </h3>
                    <p className="text-sm text-gray-600 truncate" title={material.fileName}>
                      {material.fileName}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-2" />
                    {material.uploaderName}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(material.uploadDate)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Size: {material.fileSize}
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(material)}
                  className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Title</span>
                      {sortBy === 'title' && (
                        sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Name
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('uploaderName')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Instructor</span>
                      {sortBy === 'uploaderName' && (
                        sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('uploadDate')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Upload Date</span>
                      {sortBy === 'uploadDate' && (
                        sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMaterials.map((material) => {
                  const FileIcon = getFileIcon(material.fileType);
                  return (
                    <tr key={material.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <FileIcon className="h-6 w-6 text-blue-600" />
                          <div className="text-sm font-medium text-gray-900">
                            {material.title}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {material.fileName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {material.uploaderName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(material.uploadDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {material.fileSize}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDownload(material)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center space-x-1 text-sm"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialsList;