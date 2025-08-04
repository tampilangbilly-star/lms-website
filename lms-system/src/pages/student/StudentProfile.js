import React from 'react';
import { User } from 'lucide-react';

const StudentProfile = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan Profil</h1>
        <p className="mt-2 text-sm text-gray-600">Kelola informasi akun Anda</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Halaman dalam pengembangan</h3>
          <p className="mt-1 text-sm text-gray-500">Fitur pengaturan profil akan segera tersedia.</p>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;