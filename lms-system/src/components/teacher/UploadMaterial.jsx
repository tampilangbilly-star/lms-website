import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';

const UploadMaterial = () => {
  const [formData, setFormData] = useState({
    title: '',
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [dragActive, setDragActive] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear message when user starts typing
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      file: file
    }));
    // Clear message when user selects file
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        file: files[0]
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    if (!formData.title.trim()) {
      setMessage({ type: 'error', text: 'Please enter a title for the material.' });
      return false;
    }
    if (!formData.file) {
      setMessage({ type: 'error', text: 'Please select a file to upload.' });
      return false;
    }
    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];
    if (!allowedTypes.includes(formData.file.type)) {
      setMessage({ 
        type: 'error', 
        text: 'Please upload a valid file type (PDF, Word, PowerPoint, Text, or Image).' 
      });
      return false;
    }
    // Check file size (10MB limit)
    if (formData.file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 10MB.' });
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Create FormData object
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('file', formData.file);

      // Send to backend
      const response = await axios.post('/api/materials/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Success
      setMessage({ type: 'success', text: 'Material uploaded successfully!' });
      setFormData({ title: '', file: null });
      
      // Reset file input
      const fileInput = document.getElementById('file-upload');
      if (fileInput) {
        fileInput.value = '';
      }

    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to upload material. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Get file type icon
  const getFileIcon = (file) => {
    if (!file) return FileText;
    
    const type = file.type;
    if (type.includes('pdf')) return FileText;
    if (type.includes('word') || type.includes('document')) return FileText;
    if (type.includes('powerpoint') || type.includes('presentation')) return FileText;
    return FileText;
  };

  const FileIcon = getFileIcon(formData.file);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Learning Material</h2>
          <p className="text-gray-600">Share resources with your students by uploading documents, presentations, or other materials.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Material Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter a descriptive title for this material"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File *
            </label>
            
            {/* Drag and Drop Area */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="text-center">
                {formData.file ? (
                  <div className="flex items-center justify-center space-x-3">
                    <FileIcon className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{formData.file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <p className="text-lg font-medium text-gray-900">
                        Drop your file here, or <span className="text-blue-600">browse</span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Supports: PDF, Word, PowerPoint, Text, Images (max 10MB)
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`p-4 rounded-lg flex items-center space-x-2 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setFormData({ title: '', file: null });
                setMessage({ type: '', text: '' });
                const fileInput = document.getElementById('file-upload');
                if (fileInput) fileInput.value = '';
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 text-sm font-medium text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload Material</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadMaterial;