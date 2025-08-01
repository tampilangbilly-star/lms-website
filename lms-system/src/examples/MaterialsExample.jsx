import React, { useState } from 'react';
import { UploadMaterial, MaterialsList } from '../components/materials';

const MaterialsExample = () => {
  const [activeTab, setActiveTab] = useState('list');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('list')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'list'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                View Materials
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upload'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Upload Material
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'list' ? <MaterialsList /> : <UploadMaterial />}
      </div>
    </div>
  );
};

export default MaterialsExample;