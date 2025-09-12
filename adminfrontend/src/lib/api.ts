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
  category: string;
  date_achieved: string;
  verified: boolean;
  verified_by?: number;
  verified_at?: string;
  points: number;
  student: number;
  created_at: string;
  updated_at: string;
}

export interface Certificate {
  id: number;
  title: string;
  description: string;
  certificate_file: string;
  verified: boolean;
  verified_by?: number;
  verified_at?: string;
  student: number;
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
    const response = await apiClient.get('/accounts/profile/');
    return response.data;
  },
};

// User Management API (Admin)
export const userManagementAPI = {
  getUsers: async (params?: {
    page?: number;
    search?: string;
    role?: string;
    verified?: boolean;
  }): Promise<{ results: User[]; count: number; next?: string; previous?: string }> => {
    const response = await apiClient.get('/accounts/users/', { params });
    return response.data;
  },
  
  getUser: async (id: number): Promise<User> => {
    const response = await apiClient.get(`/accounts/users/${id}/`);
    return response.data;
  },
  
  updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
    const response = await apiClient.patch(`/accounts/users/${id}/`, userData);
    return response.data;
  },
  
  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`/accounts/users/${id}/`);
  },
  
  verifyUser: async (id: number): Promise<User> => {
    const response = await apiClient.post(`/accounts/users/${id}/verify/`);
    return response.data;
  },
};

// Achievements Management API (Admin)
export const achievementsManagementAPI = {
  getAllAchievements: async (params?: {
    page?: number;
    search?: string;
    category?: string;
    verified?: boolean;
    student?: number;
  }): Promise<{ results: Achievement[]; count: number; next?: string; previous?: string }> => {
    const response = await apiClient.get('/achievements/admin/', { params });
    return response.data;
  },
  
  verifyAchievement: async (id: number): Promise<Achievement> => {
    const response = await apiClient.post(`/achievements/${id}/verify/`);
    return response.data;
  },
  
  rejectAchievement: async (id: number, reason: string): Promise<Achievement> => {
    const response = await apiClient.post(`/achievements/${id}/reject/`, { reason });
    return response.data;
  },
};

// Certificates Management API (Admin)
export const certificatesManagementAPI = {
  getAllCertificates: async (params?: {
    page?: number;
    search?: string;
    verified?: boolean;
    student?: number;
  }): Promise<{ results: Certificate[]; count: number; next?: string; previous?: string }> => {
    const response = await apiClient.get('/certificates/admin/', { params });
    return response.data;
  },
  
  verifyCertificate: async (id: number): Promise<Certificate> => {
    const response = await apiClient.post(`/certificates/${id}/verify/`);
    return response.data;
  },
  
  rejectCertificate: async (id: number, reason: string): Promise<Certificate> => {
    const response = await apiClient.post(`/certificates/${id}/reject/`, { reason });
    return response.data;
  },
};

// Volunteering Management API (Admin)
export const volunteeringManagementAPI = {
  getAllVolunteeringActivities: async (params?: {
    page?: number;
    search?: string;
    category?: string;
    verified?: boolean;
    student?: number;
  }): Promise<{ results: VolunteeringActivity[]; count: number; next?: string; previous?: string }> => {
    const response = await apiClient.get('/volunteering/admin/', { params });
    return response.data;
  },
  
  verifyVolunteeringActivity: async (id: number): Promise<VolunteeringActivity> => {
    const response = await apiClient.post(`/volunteering/${id}/verify/`);
    return response.data;
  },
  
  rejectVolunteeringActivity: async (id: number, reason: string): Promise<VolunteeringActivity> => {
    const response = await apiClient.post(`/volunteering/${id}/reject/`, { reason });
    return response.data;
  },
};

// Reports API (Admin)
export const reportsAPI = {
  generateReport: async (reportType: string, params?: Record<string, any>): Promise<Blob> => {
    const response = await apiClient.get(`/reports/${reportType}/`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
  
  getReportHistory: async (): Promise<any[]> => {
    const response = await apiClient.get('/reports/history/');
    return response.data;
  },
  
  getDashboardStats: async (): Promise<{
    total_students: number;
    total_faculty: number;
    total_achievements: number;
    total_certificates: number;
    total_volunteering_hours: number;
    pending_verifications: number;
  }> => {
    const response = await apiClient.get('/reports/dashboard-stats/');
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
  
  createNotification: async (notificationData: {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    user?: number;
  }): Promise<Notification> => {
    const response = await apiClient.post('/notifications/', notificationData);
    return response.data;
  },
};

export default apiClient;
