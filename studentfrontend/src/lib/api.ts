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

// User API
export const userAPI = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get('/accounts/profile/');
    return response.data;
  },
  
  updateProfile: async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await apiClient.patch('/accounts/profile/', profileData);
    return response.data;
  },
  
  uploadProfilePicture: async (file: File): Promise<{ profile_picture: string }> => {
    const formData = new FormData();
    formData.append('profile_picture', file);
    const response = await apiClient.patch('/accounts/profile/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

// Achievements API
export const achievementsAPI = {
  getAchievements: async (params?: {
    page?: number;
    search?: string;
    category?: string;
    verified?: boolean;
  }): Promise<{ results: Achievement[]; count: number; next?: string; previous?: string }> => {
    const response = await apiClient.get('/achievements/', { params });
    return response.data;
  },
  
  getAchievement: async (id: number): Promise<Achievement> => {
    const response = await apiClient.get(`/achievements/${id}/`);
    return response.data;
  },
  
  createAchievement: async (achievementData: {
    title: string;
    description: string;
    category: string;
    date_achieved: string;
    points: number;
  }): Promise<Achievement> => {
    const response = await apiClient.post('/achievements/', achievementData);
    return response.data;
  },
  
  updateAchievement: async (id: number, achievementData: Partial<Achievement>): Promise<Achievement> => {
    const response = await apiClient.patch(`/achievements/${id}/`, achievementData);
    return response.data;
  },
  
  deleteAchievement: async (id: number): Promise<void> => {
    await apiClient.delete(`/achievements/${id}/`);
  },
};

// Certificates API
export const certificatesAPI = {
  getCertificates: async (params?: {
    page?: number;
    search?: string;
    verified?: boolean;
  }): Promise<{ results: Certificate[]; count: number; next?: string; previous?: string }> => {
    const response = await apiClient.get('/certificates/', { params });
    return response.data;
  },
  
  getCertificate: async (id: number): Promise<Certificate> => {
    const response = await apiClient.get(`/certificates/${id}/`);
    return response.data;
  },
  
  uploadCertificate: async (certificateData: {
    title: string;
    description: string;
    certificate_file: File;
  }): Promise<Certificate> => {
    const formData = new FormData();
    formData.append('title', certificateData.title);
    formData.append('description', certificateData.description);
    formData.append('certificate_file', certificateData.certificate_file);
    
    const response = await apiClient.post('/certificates/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  updateCertificate: async (id: number, certificateData: Partial<Certificate>): Promise<Certificate> => {
    const response = await apiClient.patch(`/certificates/${id}/`, certificateData);
    return response.data;
  },
  
  deleteCertificate: async (id: number): Promise<void> => {
    await apiClient.delete(`/certificates/${id}/`);
  },
};

// Volunteering API
export const volunteeringAPI = {
  getVolunteeringActivities: async (params?: {
    page?: number;
    search?: string;
    category?: string;
    verified?: boolean;
  }): Promise<{ results: VolunteeringActivity[]; count: number; next?: string; previous?: string }> => {
    const response = await apiClient.get('/volunteering/', { params });
    return response.data;
  },
  
  getVolunteeringActivity: async (id: number): Promise<VolunteeringActivity> => {
    const response = await apiClient.get(`/volunteering/${id}/`);
    return response.data;
  },
  
  createVolunteeringActivity: async (activityData: {
    title: string;
    organization: string;
    location?: string;
    date: string;
    hours: number;
    description?: string;
    category?: string;
    skills: string[];
  }): Promise<VolunteeringActivity> => {
    const response = await apiClient.post('/volunteering/', activityData);
    return response.data;
  },
  
  updateVolunteeringActivity: async (id: number, activityData: Partial<VolunteeringActivity>): Promise<VolunteeringActivity> => {
    const response = await apiClient.patch(`/volunteering/${id}/`, activityData);
    return response.data;
  },
  
  deleteVolunteeringActivity: async (id: number): Promise<void> => {
    await apiClient.delete(`/volunteering/${id}/`);
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

// Reports API
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
};

export default apiClient;
