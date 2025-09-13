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
  user: number;
  user_name: string;
  title: string;
  description: string;
  category: number;
  category_name: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  points: number;
  evidence_url?: string;
  evidence_file?: string;
  evidence_file_url?: string;
  verified_by?: number;
  verified_by_name?: string;
  verified_at?: string;
  rejection_reason?: string;
  skills_gained: string[];
  tags: string[];
  is_public: boolean;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  created_at: string;
  updated_at: string;
}

export interface Certificate {
  id: number;
  user: number;
  user_name: string;
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
  verified_by?: number;
  verified_by_name?: string;
  verified_at?: string;
  rejection_reason?: string;
  skills_verified: string[];
  tags: string[];
  is_public: boolean;
  is_expired: boolean;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  created_at: string;
  updated_at: string;
}

export interface VolunteeringActivity {
  id: number;
  user: number;
  user_name: string;
  title: string;
  description: string;
  organization: string;
  location?: string;
  category: number;
  category_name: string;
  activity_date: string;
  hours_volunteered: number;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  points: number;
  evidence_url?: string;
  evidence_file?: string;
  evidence_file_url?: string;
  verified_by?: number;
  verified_by_name?: string;
  verified_at?: string;
  rejection_reason?: string;
  skills_developed: string[];
  tags: string[];
  is_public: boolean;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  user: number;
  type: number;
  type_name: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_read: boolean;
  is_archived: boolean;
  action_url?: string;
  action_text?: string;
  metadata: Record<string, any>;
  expires_at?: string;
  created_at: string;
  read_at?: string;
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    // Use Django's JWT token endpoint
    const response = await apiClient.post('/token/', { 
      email: email,
      password: password 
    });
    const { access, refresh } = response.data;
    
    // Store tokens
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    
    // Get user data
    const userResponse = await apiClient.get('/auth/profile/');
    const user = userResponse.data;
    
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
    const { access, refresh, user } = response.data;
    
    // Store tokens
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    
    return {
      access,
      refresh,
      user: user
    };
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

// Achievements API
export const achievementsAPI = {
  getAchievements: async (params?: {
    page?: number;
    search?: string;
    category?: number;
    status?: string;
    user?: number;
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
    category: number;
    priority?: 'low' | 'medium' | 'high';
    points?: number;
    evidence_url?: string;
    evidence_file?: File;
    skills_gained?: string[];
    tags?: string[];
    is_public?: boolean;
  }): Promise<Achievement> => {
    const formData = new FormData();
    formData.append('title', achievementData.title);
    formData.append('description', achievementData.description);
    formData.append('category', achievementData.category.toString());
    if (achievementData.priority) formData.append('priority', achievementData.priority);
    if (achievementData.points) formData.append('points', achievementData.points.toString());
    if (achievementData.evidence_url) formData.append('evidence_url', achievementData.evidence_url);
    if (achievementData.evidence_file) formData.append('evidence_file', achievementData.evidence_file);
    if (achievementData.skills_gained) formData.append('skills_gained', JSON.stringify(achievementData.skills_gained));
    if (achievementData.tags) formData.append('tags', JSON.stringify(achievementData.tags));
    if (achievementData.is_public !== undefined) formData.append('is_public', achievementData.is_public.toString());
    
    const response = await apiClient.post('/achievements/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  updateAchievement: async (id: number, achievementData: Partial<Achievement>): Promise<Achievement> => {
    const response = await apiClient.patch(`/achievements/${id}/`, achievementData);
    return response.data;
  },
  
  deleteAchievement: async (id: number): Promise<void> => {
    await apiClient.delete(`/achievements/${id}/`);
  },
  
  likeAchievement: async (id: number): Promise<void> => {
    await apiClient.post(`/achievements/${id}/like/`);
  },
  
  shareAchievement: async (id: number, platform: string): Promise<void> => {
    await apiClient.post(`/achievements/${id}/share/`, { platform });
  },
  
  getAchievementStats: async (): Promise<any> => {
    const response = await apiClient.get('/achievements/stats/');
    return response.data;
  },
  
  getAchievementCategories: async (): Promise<any[]> => {
    const response = await apiClient.get('/achievements/categories/');
    return response.data;
  },
};

// Certificates API
export const certificatesAPI = {
  getCertificates: async (params?: {
    page?: number;
    search?: string;
    category?: number;
    status?: string;
    user?: number;
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
    category: number;
    issuer: string;
    issue_date: string;
    expiry_date?: string;
    certificate_number?: string;
    priority?: 'low' | 'medium' | 'high';
    points?: number;
    certificate_file?: File;
    skills_verified?: string[];
    tags?: string[];
    is_public?: boolean;
  }): Promise<Certificate> => {
    const formData = new FormData();
    formData.append('title', certificateData.title);
    formData.append('description', certificateData.description);
    formData.append('category', certificateData.category.toString());
    formData.append('issuer', certificateData.issuer);
    formData.append('issue_date', certificateData.issue_date);
    if (certificateData.expiry_date) formData.append('expiry_date', certificateData.expiry_date);
    if (certificateData.certificate_number) formData.append('certificate_number', certificateData.certificate_number);
    if (certificateData.priority) formData.append('priority', certificateData.priority);
    if (certificateData.points) formData.append('points', certificateData.points.toString());
    if (certificateData.certificate_file) formData.append('certificate_file', certificateData.certificate_file);
    if (certificateData.skills_verified) formData.append('skills_verified', JSON.stringify(certificateData.skills_verified));
    if (certificateData.tags) formData.append('tags', JSON.stringify(certificateData.tags));
    if (certificateData.is_public !== undefined) formData.append('is_public', certificateData.is_public.toString());
    
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
  
  likeCertificate: async (id: number): Promise<void> => {
    await apiClient.post(`/certificates/${id}/like/`);
  },
  
  shareCertificate: async (id: number, platform: string): Promise<void> => {
    await apiClient.post(`/certificates/${id}/share/`, { platform });
  },
  
  getCertificateStats: async (): Promise<any> => {
    const response = await apiClient.get('/certificates/stats/');
    return response.data;
  },
  
  getCertificateCategories: async (): Promise<any[]> => {
    const response = await apiClient.get('/certificates/categories/');
    return response.data;
  },
  
  getPendingReviews: async (): Promise<{ results: Certificate[]; count: number }> => {
    const response = await apiClient.get('/certificates/pending-reviews/');
    return response.data;
  },
};

// Volunteering API
export const volunteeringAPI = {
  getVolunteeringActivities: async (params?: {
    page?: number;
    search?: string;
    category?: number;
    status?: string;
    user?: number;
  }): Promise<{ results: VolunteeringActivity[]; count: number; next?: string; previous?: string }> => {
    const response = await apiClient.get('/volunteering/activities/', { params });
    return response.data;
  },
  
  getVolunteeringActivity: async (id: number): Promise<VolunteeringActivity> => {
    const response = await apiClient.get(`/volunteering/activities/${id}/`);
    return response.data;
  },
  
  createVolunteeringActivity: async (activityData: {
    title: string;
    description: string;
    organization: string;
    location?: string;
    category: number;
    activity_date: string;
    hours_volunteered: number;
    priority?: 'low' | 'medium' | 'high';
    evidence_url?: string;
    evidence_file?: File;
    skills_developed?: string[];
    tags?: string[];
    is_public?: boolean;
  }): Promise<VolunteeringActivity> => {
    const formData = new FormData();
    formData.append('title', activityData.title);
    formData.append('description', activityData.description);
    formData.append('organization', activityData.organization);
    if (activityData.location) formData.append('location', activityData.location);
    formData.append('category', activityData.category.toString());
    formData.append('activity_date', activityData.activity_date);
    formData.append('hours_volunteered', activityData.hours_volunteered.toString());
    if (activityData.priority) formData.append('priority', activityData.priority);
    if (activityData.evidence_url) formData.append('evidence_url', activityData.evidence_url);
    if (activityData.evidence_file) formData.append('evidence_file', activityData.evidence_file);
    if (activityData.skills_developed) formData.append('skills_developed', JSON.stringify(activityData.skills_developed));
    if (activityData.tags) formData.append('tags', JSON.stringify(activityData.tags));
    if (activityData.is_public !== undefined) formData.append('is_public', activityData.is_public.toString());
    
    const response = await apiClient.post('/volunteering/activities/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  updateVolunteeringActivity: async (id: number, activityData: Partial<VolunteeringActivity>): Promise<VolunteeringActivity> => {
    const response = await apiClient.patch(`/volunteering/activities/${id}/`, activityData);
    return response.data;
  },
  
  deleteVolunteeringActivity: async (id: number): Promise<void> => {
    await apiClient.delete(`/volunteering/activities/${id}/`);
  },
  
  likeVolunteeringActivity: async (id: number): Promise<void> => {
    await apiClient.post(`/volunteering/activities/${id}/like/`);
  },
  
  shareVolunteeringActivity: async (id: number, platform: string): Promise<void> => {
    await apiClient.post(`/volunteering/activities/${id}/share/`, { platform });
  },
  
  getVolunteeringStats: async (): Promise<any> => {
    const response = await apiClient.get('/volunteering/stats/');
    return response.data;
  },
  
  getVolunteeringCategories: async (): Promise<any[]> => {
    const response = await apiClient.get('/volunteering/categories/');
    return response.data;
  },
  
  getPendingReviews: async (): Promise<{ results: VolunteeringActivity[]; count: number }> => {
    const response = await apiClient.get('/volunteering/pending-reviews/');
    return response.data;
  },
  
  getVolunteeringOpportunities: async (params?: {
    page?: number;
    search?: string;
    category?: number;
    status?: string;
  }): Promise<{ results: any[]; count: number; next?: string; previous?: string }> => {
    const response = await apiClient.get('/volunteering/opportunities/', { params });
    return response.data;
  },
};

// Notifications API
export const notificationsAPI = {
  getNotifications: async (params?: {
    page?: number;
    is_read?: boolean;
    is_archived?: boolean;
    priority?: string;
    type?: number;
  }): Promise<{ results: Notification[]; count: number; next?: string; previous?: string }> => {
    const response = await apiClient.get('/notifications/', { params });
    return response.data;
  },
  
  getNotification: async (id: number): Promise<Notification> => {
    const response = await apiClient.get(`/notifications/${id}/`);
    return response.data;
  },
  
  markAsRead: async (id: number): Promise<Notification> => {
    const response = await apiClient.patch(`/notifications/${id}/`, { is_read: true });
    return response.data;
  },
  
  markMultipleAsRead: async (notificationIds: number[]): Promise<{ message: string; updated_count: number }> => {
    const response = await apiClient.post('/notifications/mark-read/', { notification_ids: notificationIds });
    return response.data;
  },
  
  markAllAsRead: async (): Promise<{ message: string; updated_count: number }> => {
    const response = await apiClient.post('/notifications/mark-all-read/');
    return response.data;
  },
  
  archiveNotifications: async (notificationIds: number[]): Promise<{ message: string; updated_count: number }> => {
    const response = await apiClient.post('/notifications/archive/', { notification_ids: notificationIds });
    return response.data;
  },
  
  deleteNotifications: async (notificationIds: number[]): Promise<{ message: string; deleted_count: number }> => {
    const response = await apiClient.post('/notifications/delete/', { notification_ids: notificationIds });
    return response.data;
  },
  
  deleteNotification: async (id: number): Promise<void> => {
    await apiClient.delete(`/notifications/${id}/`);
  },
  
  getNotificationStats: async (): Promise<any> => {
    const response = await apiClient.get('/notifications/stats/');
    return response.data;
  },
  
  getNotificationTypes: async (): Promise<any[]> => {
    const response = await apiClient.get('/notifications/types/');
    return response.data;
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
