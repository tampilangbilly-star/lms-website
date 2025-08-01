# LearnHub - Modern Learning Management System

A comprehensive Learning Management System (LMS) built with React, TypeScript, and Tailwind CSS. Features role-based dashboards for Students, Teachers, and Administrators with modern UI/UX design.

## 🌟 Features

### ✅ Implemented Features

- **Authentication System**
  - User login and registration
  - Role-based access control (Student, Teacher, Admin)
  - Protected routes and authorization
  - Session persistence

- **Role-Based Dashboards**
  - **Student Dashboard**: Course progress, assignments, recent activities
  - **Teacher Dashboard**: Course management, student progress tracking, submissions
  - **Admin Dashboard**: System overview, user management, analytics

- **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Clean and intuitive interface
  - Professional color scheme and typography
  - Mobile-friendly navigation

- **Navigation System**
  - Role-specific sidebar navigation
  - Header with notifications and user profile
  - Quick action buttons

### 🚧 Coming Soon

- Video-based learning content
- File upload and download system
- Assignment submission and grading
- Discussion forums
- Real-time notifications
- Progress tracking and analytics
- Course creation and management tools

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lms-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`

## 🔐 Demo Accounts

Use these demo accounts to test different user roles:

| Role    | Email             | Password |
|---------|-------------------|----------|
| Admin   | admin@lms.com     | password |
| Teacher | teacher@lms.com   | password |
| Student | student@lms.com   | password |

## 📱 User Roles & Permissions

### Student Features
- View enrolled courses and progress
- Access learning materials
- Submit assignments
- Participate in discussion forums
- View grades and feedback

### Teacher Features
- Create and manage courses
- Upload learning materials
- Create and grade assignments
- Track student progress
- Manage course discussions

### Admin Features
- Manage users (students, teachers)
- Monitor system activity
- View analytics and reports
- Oversee content approval
- System configuration

## 🛠 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **State Management**: React Context API
- **Date Handling**: date-fns

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── common/          # Shared components (Layout, Sidebar, Header)
│   ├── admin/           # Admin-specific components
│   ├── teacher/         # Teacher-specific components
│   └── student/         # Student-specific components
├── pages/               # Page components
│   ├── auth/            # Login/Register pages
│   ├── admin/           # Admin dashboard pages
│   ├── teacher/         # Teacher dashboard pages
│   └── student/         # Student dashboard pages
├── context/             # React Context providers
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── assets/              # Static assets
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6) - Used for main actions and highlights
- **Secondary**: Gray (#64748b) - Used for text and subtle elements
- **Success**: Green - Used for positive actions
- **Warning**: Orange - Used for attention-grabbing elements
- **Error**: Red - Used for error states

### Typography
- **Font Family**: Inter (Google Fonts)
- **Font Weights**: 300, 400, 500, 600, 700

## 🔄 State Management

The application uses React Context API for state management:

- **AuthContext**: Manages authentication state and user sessions
- Future contexts will be added for courses, assignments, and notifications

## 🛡 Security Features

- Protected routes with role-based access control
- Authentication state persistence
- Input validation and sanitization
- Secure session management

## 📊 Performance Optimizations

- Component lazy loading (ready for implementation)
- Image optimization with external CDN
- Responsive images with proper sizing
- Efficient re-rendering with React best practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

### Environment Variables

Create a `.env` file in the root directory for environment-specific configurations:

```env
REACT_APP_API_URL=your_api_url_here
REACT_APP_VERSION=1.0.0
```

## 🔮 Roadmap

- [ ] Video streaming integration
- [ ] Real-time chat and messaging
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Third-party integrations (Zoom, Google Drive)
- [ ] Multi-language support
- [ ] Advanced course builder
- [ ] Automated testing suite

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
