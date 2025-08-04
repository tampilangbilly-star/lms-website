import React, { useState, useEffect } from 'react';
import { tugasAPI } from '../../utils/api';
import { FileText, Upload, Plus } from 'lucide-react';

const StudentTugas = () => {
  const [tugas, setTugas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTugas();
  }, []);

  const fetchTugas = async () => {
    try {
      const response = await tugasAPI.getAll();
      setTugas(response.data);
    } catch (error) {
      console.error('Error fetching tugas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tugas Saya</h1>
          <p className="mt-2 text-sm text-gray-600">Kelola dan kumpulkan tugas Anda</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Upload Tugas
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Halaman dalam pengembangan</h3>
          <p className="mt-1 text-sm text-gray-500">Fitur upload dan manajemen tugas akan segera tersedia.</p>
        </div>
      </div>
    </div>
  );
};

export default StudentTugas;