import React from 'react';
import { MessageSquare } from 'lucide-react';

const StudentKritikSaran = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kritik & Saran</h1>
        <p className="mt-2 text-sm text-gray-600">Sampaikan masukan Anda untuk perbaikan sistem</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Halaman dalam pengembangan</h3>
          <p className="mt-1 text-sm text-gray-500">Fitur kritik dan saran akan segera tersedia.</p>
        </div>
      </div>
    </div>
  );
};

export default StudentKritikSaran;