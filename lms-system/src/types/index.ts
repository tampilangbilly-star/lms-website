export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  teacher: User;
  thumbnail?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  enrolledStudents: string[];
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  videoUrl?: string;
  order: number;
  isPublished: boolean;
  createdAt: Date;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: Date;
  maxScore: number;
  isPublished: boolean;
  createdAt: Date;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  student: User;
  content: string;
  attachments: string[];
  score?: number;
  feedback?: string;
  submittedAt: Date;
  gradedAt?: Date;
}

export interface Material {
  id: string;
  courseId: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Date;
}

export interface DiscussionForum {
  id: string;
  courseId: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  posts: ForumPost[];
}

export interface ForumPost {
  id: string;
  forumId: string;
  authorId: string;
  author: User;
  content: string;
  replies: ForumReply[];
  createdAt: Date;
}

export interface ForumReply {
  id: string;
  postId: string;
  authorId: string;
  author: User;
  content: string;
  createdAt: Date;
}

export interface Progress {
  id: string;
  studentId: string;
  courseId: string;
  completedLessons: string[];
  totalLessons: number;
  progressPercentage: number;
  lastAccessedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}