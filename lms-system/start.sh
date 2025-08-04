#!/bin/bash

echo "🚀 Starting EduTech SITARO LMS System..."
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Create uploads directories if they don't exist
echo "📁 Creating upload directories..."
mkdir -p public/uploads/materi
mkdir -p public/uploads/tugas
mkdir -p public/uploads/profiles

# Set proper permissions for upload directories
chmod 755 public/uploads
chmod 755 public/uploads/materi
chmod 755 public/uploads/tugas
chmod 755 public/uploads/profiles

echo "✅ Upload directories created"
echo ""

# Display system information
echo "🔧 System Configuration:"
echo "   - Backend Server: http://localhost:5000"
echo "   - Frontend React: http://localhost:3000"
echo "   - Database: SQLite (auto-created)"
echo ""

echo "👤 Default Accounts:"
echo "   Admin    - Username: admin    | Password: admin123"
echo "   Teacher  - Username: teacher1 | Password: teacher123"
echo "   Student  - Register new account at /register"
echo ""

echo "🌐 Starting servers..."
echo "   Press Ctrl+C to stop the servers"
echo ""

# Start the application
npm start