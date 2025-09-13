import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access, refresh } = response.data;
          localStorage.setItem('access_token', access);
          localStorage.setItem('refresh_token', refresh);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// API Types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'faculty' | 'admin';
  profile?: UserProfile;
}

export interface UserProfile {
  id: number;
  user: number;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  profile_picture?: string;
  bio?: string;
  department?: string;
  student_id?: string;
  faculty_id?: string;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  category: number;
  category_name: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  points: number;
  evidence_url?: string;
  evidence_file_url?: string;
  skills_gained: string[];
  tags: string[];
  is_public: boolean;
  user: number;
  user_name: string;
  verified_by?: number;
  verified_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface Certificate {
  id: number;
  title: string;
  description: string;
  category: number;
  category_name: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  certificate_number?: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  points: number;
  certificate_file?: string;
  certificate_file_url?: string;
  certificate_url?: string;
  skills_verified: string[];
  tags: string[];
  is_public: boolean;
  is_expired: boolean;
  user: number;
  user_name: string;
  verified_by?: number;
  verified_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface VolunteeringActivity {
  id: number;
  title: string;
  organization: string;
  location?: string;
  date: string;
  hours: number;
  description?: string;
  category?: string;
  skills: string[];
  verified: boolean;
  verified_by?: number;
  verified_at?: string;
  student: number;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  user: number;
  created_at: string;
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    // Use Django's custom login endpoint
    const response = await apiClient.post('/auth/login/', { 
      email: email,
      password: password 
    });
    const { user, tokens } = response.data;
    const { access, refresh } = tokens;
    
    // Store tokens
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    
    return {
      access,
      refresh,
      user: user
    };
  },
  
  register: async (userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: 'student' | 'faculty' | 'admin';
  }) => {
    const response = await apiClient.post('/auth/register/', userData);
    return response.data;
  },
  
  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post('/token/refresh/', { refresh: refreshToken });
    return response.data;
  },
  
  logout: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        await apiClient.post('/auth/logout/', { refresh: refreshToken });
      } catch (error) {
        console.error('Logout API call failed:', error);
      }
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/auth/profile/');
    return response.data;
  },
};

// Faculty Review API
export const facultyReviewAPI = {
  getPendingAchievements: async (params?: {
    page?: number;
  }): Promise<{ results: Achievement[]; count: number; next?: string; previous?: string }> => {
    const response = await apiClient.get('/achievements/', { params: { ...params, status: 'pending' } });
    return response.data;
  },
  
  getPendingCertificates: async (params?: {
    page?: number;
  }): Promise<{ results: Certificate[]; count: number; next?: string; previous?: string }> => {
    const response = await apiClient.get('/certificates/pending-reviews/', { params });
    return response.data;
  },
  
  getPendingVolunteeringActivities: async (params?: {
    page?: number;
  }): Promise<{ results: VolunteeringActivity[]; count: number; next?: string; previous?: string }> => {
    const response = await apiClient.get('/volunteering/pending-reviews/', { params });
    return response.data;
  },
  
  approveAchievement: async (id: number, reviewNotes?: string): Promise<{ message: string }> => {
    const response = await apiClient.patch(`/achievements/${id}/approve/`, { 
      action: 'approve',
      review_notes: reviewNotes 
    });
    return response.data;
  },
  
  rejectAchievement: async (id: number, rejectionReason: string, reviewNotes?: string): Promise<{ message: string }> => {
    const response = await apiClient.patch(`/achievements/${id}/approve/`, { 
      action: 'reject',
      rejection_reason: rejectionReason,
      review_notes: reviewNotes 
    });
    return response.data;
  },
  
  approveCertificate: async (id: number, reviewNotes?: string): Promise<{ message: string }> => {
    const response = await apiClient.patch(`/certificates/${id}/approve/`, { 
      action: 'approve',
      review_notes: reviewNotes 
    });
    return response.data;
  },
  
  rejectCertificate: async (id: number, rejectionReason: string, reviewNotes?: string): Promise<{ message: string }> => {
    const response = await apiClient.patch(`/certificates/${id}/approve/`, { 
      action: 'reject',
      rejection_reason: rejectionReason,
      review_notes: reviewNotes 
    });
    return response.data;
  },
  
  approveVolunteeringActivity: async (id: number, reviewNotes?: string): Promise<{ message: string }> => {
    const response = await apiClient.patch(`/volunteering/activities/${id}/approve/`, { 
      action: 'approve',
      review_notes: reviewNotes 
    });
    return response.data;
  },
  
  rejectVolunteeringActivity: async (id: number, rejectionReason: string, reviewNotes?: string): Promise<{ message: string }> => {
    const response = await apiClient.patch(`/volunteering/activities/${id}/approve/`, { 
      action: 'reject',
      rejection_reason: rejectionReason,
      review_notes: reviewNotes 
    });
    return response.data;
  },
  
  getStudentAchievements: async (studentId: number, params?: {
    page?: number;
    status?: string;
  }): Promise<{ results: Achievement[]; count: number; next?: string; previous?: string }> => {
    const response = await apiClient.get('/achievements/', { params: { ...params, user: studentId } });
    return response.data;
  },
  
  getStudentCertificates: async (studentId: number, params?: {
    page?: number;
    status?: string;
  }): Promise<{ results: Certificate[]; count: number; next?: string; previous?: string }> => {
    const response = await apiClient.get('/certificates/', { params: { ...params, user: studentId } });
    return response.data;
  },
  
  getStudentVolunteeringActivities: async (studentId: number, params?: {
    page?: number;
    status?: string;
  }): Promise<{ results: VolunteeringActivity[]; count: number; next?: string; previous?: string }> => {
    const response = await apiClient.get('/volunteering/activities/', { params: { ...params, user: studentId } });
    return response.data;
  },
  
  getReviewStats: async (): Promise<any> => {
    const [achievements, certificates, volunteering] = await Promise.all([
      apiClient.get('/achievements/stats/'),
      apiClient.get('/certificates/stats/'),
      apiClient.get('/volunteering/stats/')
    ]);
    
    return {
      achievements: achievements.data,
      certificates: certificates.data,
      volunteering: volunteering.data
    };
  },
};

// User API
export const userAPI = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get('/auth/profile/');
    return response.data;
  },
  
  updateProfile: async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await apiClient.patch('/auth/profile/', profileData);
    return response.data;
  },
  
  uploadProfilePicture: async (file: File): Promise<{ profile_picture: string }> => {
    const formData = new FormData();
    formData.append('profile_picture', file);
    const response = await apiClient.patch('/auth/profile/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

// Notifications API
export const notificationsAPI = {
  getNotifications: async (params?: {
    page?: number;
    unread_only?: boolean;
  }): Promise<{ results: Notification[]; count: number; next?: string; previous?: string }> => {
    const response = await apiClient.get('/notifications/', { params });
    return response.data;
  },
  
  markAsRead: async (id: number): Promise<Notification> => {
    const response = await apiClient.patch(`/notifications/${id}/mark-read/`);
    return response.data;
  },
  
  markAllAsRead: async (): Promise<void> => {
    await apiClient.post('/notifications/mark-all-read/');
  },
  
  deleteNotification: async (id: number): Promise<void> => {
    await apiClient.delete(`/notifications/${id}/`);
  },
};

export default apiClient;
