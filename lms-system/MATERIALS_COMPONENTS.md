# Materials Management Components

This document describes two React components for handling learning materials in your LMS system.

## Components Overview

### 1. UploadMaterial.jsx
A component for teachers to upload learning materials (documents, presentations, etc.) to the LMS.

### 2. MaterialsList.jsx  
A component for students to view, search, and download learning materials.

## Installation & Setup

### Prerequisites
```bash
npm install axios
npm install lucide-react
```

### Import Components
```javascript
import UploadMaterial from './components/teacher/UploadMaterial';
import MaterialsList from './components/student/MaterialsList';

// Or use the index file
import { UploadMaterial, MaterialsList } from './components/materials';
```

## UploadMaterial Component

### Features
- ✅ File upload with drag-and-drop support
- ✅ Form validation (title required, file required)
- ✅ File type validation (PDF, Word, PowerPoint, images, text)
- ✅ File size validation (10MB limit)
- ✅ Progress indication during upload
- ✅ Success/error messaging
- ✅ Clean, responsive UI with Tailwind CSS

### Usage
```javascript
import UploadMaterial from './components/teacher/UploadMaterial';

function TeacherPage() {
  return (
    <div>
      <UploadMaterial />
    </div>
  );
}
```

### API Endpoint
The component sends a POST request to `/api/materials/upload` with FormData containing:
- `title` (string): Material title
- `file` (File): Selected file

### Expected API Response
```javascript
// Success (200)
{
  "success": true,
  "message": "Material uploaded successfully",
  "data": {
    "id": "123",
    "title": "React Hooks Guide",
    "fileName": "react-hooks.pdf"
  }
}

// Error (400/500)
{
  "success": false,
  "message": "Error message here"
}
```

### Supported File Types
- PDF documents (`.pdf`)
- Microsoft Word (`.doc`, `.docx`)
- PowerPoint presentations (`.ppt`, `.pptx`)
- Text files (`.txt`)
- Images (`.jpg`, `.jpeg`, `.png`, `.gif`)

## MaterialsList Component

### Features
- ✅ Fetch materials from API
- ✅ Search functionality (title, instructor, filename)
- ✅ Sorting (by title, instructor, date, filename)
- ✅ Two view modes (cards and table)
- ✅ File download functionality
- ✅ Loading states and error handling
- ✅ Responsive design
- ✅ File type icons

### Usage
```javascript
import MaterialsList from './components/student/MaterialsList';

function StudentPage() {
  return (
    <div>
      <MaterialsList />
    </div>
  );
}
```

### API Endpoints

#### Get Materials
**GET** `/api/materials`

Expected response:
```javascript
[
  {
    "id": 1,
    "title": "Introduction to React Hooks",
    "fileName": "react-hooks-guide.pdf",
    "uploaderName": "Dr. John Smith",
    "uploadDate": "2024-01-15",
    "fileSize": "2.5 MB",
    "fileType": "application/pdf",
    "downloadUrl": "/api/materials/download/1"
  }
]
```

#### Download Material
**GET** `/api/materials/download/:id`

Should return the file as a blob with appropriate headers for download.

### Search & Sort Features
- **Search**: Searches across title, instructor name, and filename
- **Sort Options**: Title, Instructor, Upload Date, File Name
- **Sort Order**: Ascending/Descending
- **View Modes**: Card view (responsive grid) or Table view

## Complete Example

```javascript
import React, { useState } from 'react';
import { UploadMaterial, MaterialsList } from './components/materials';

const MaterialsPage = ({ userRole }) => {
  const [activeTab, setActiveTab] = useState('list');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('list')}
            className={`py-2 px-1 border-b-2 ${
              activeTab === 'list' ? 'border-blue-500 text-blue-600' : 'border-transparent'
            }`}
          >
            View Materials
          </button>
          {userRole === 'teacher' && (
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-2 px-1 border-b-2 ${
                activeTab === 'upload' ? 'border-blue-500 text-blue-600' : 'border-transparent'
              }`}
            >
              Upload Material
            </button>
          )}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'list' ? (
        <MaterialsList />
      ) : (
        <UploadMaterial />
      )}
    </div>
  );
};

export default MaterialsPage;
```

## Backend API Requirements

### Upload Endpoint
```javascript
// POST /api/materials/upload
// Content-Type: multipart/form-data

app.post('/api/materials/upload', upload.single('file'), (req, res) => {
  const { title } = req.body;
  const file = req.file;
  
  // Validate and save file
  // Return success/error response
});
```

### List Endpoint  
```javascript
// GET /api/materials

app.get('/api/materials', (req, res) => {
  // Return array of materials
  res.json([
    {
      id: 1,
      title: "Material Title",
      fileName: "file.pdf",
      uploaderName: "Teacher Name",
      uploadDate: "2024-01-15",
      fileSize: "2.5 MB",
      fileType: "application/pdf",
      downloadUrl: "/api/materials/download/1"
    }
  ]);
});
```

### Download Endpoint
```javascript
// GET /api/materials/download/:id

app.get('/api/materials/download/:id', (req, res) => {
  const { id } = req.params;
  // Serve file for download
  res.download(filePath, fileName);
});
```

## Styling Notes

Both components use **Tailwind CSS** for styling and are fully responsive. Key classes used:

- `bg-white`, `rounded-lg`, `shadow-sm` - Card styling
- `border`, `border-gray-200` - Borders
- `focus:ring-2`, `focus:ring-blue-500` - Focus states
- `hover:bg-gray-50` - Hover effects
- `grid`, `md:grid-cols-2`, `lg:grid-cols-3` - Responsive grid
- `flex`, `items-center`, `space-x-*` - Flexbox layouts

## Error Handling

Both components include comprehensive error handling:

- **Network errors**: Displayed to user with retry options
- **Validation errors**: Inline form validation
- **File errors**: Size and type validation
- **Download errors**: User-friendly error messages

## Accessibility Features

- Proper ARIA labels
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Color contrast compliance

## Browser Support

Components work in all modern browsers that support:
- ES6+ JavaScript
- CSS Grid and Flexbox
- File API
- FormData API
- Blob API (for downloads)

---

These components are ready to use in any React application with minimal setup. Just ensure your backend API endpoints match the expected format!