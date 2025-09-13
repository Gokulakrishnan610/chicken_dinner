import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { 
  achievementsAPI, 
  certificatesAPI, 
  volunteeringAPI, 
  notificationsAPI, 
  userAPI,
  Achievement,
  Certificate,
  VolunteeringActivity,
  Notification,
  UserProfile
} from '@/lib/api';

// Achievements hooks
export const useAchievements = (params?: {
  page?: number;
  search?: string;
  category?: number;
  status?: string;
  user?: number;
}) => {
  return useQuery({
    queryKey: ['achievements', params],
    queryFn: () => achievementsAPI.getAchievements(params),
  });
};

export const useAchievement = (id: number) => {
  return useQuery({
    queryKey: ['achievement', id],
    queryFn: () => achievementsAPI.getAchievement(id),
    enabled: !!id,
  });
};

export const useCreateAchievement = (options?: UseMutationOptions<Achievement, Error, any>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: achievementsAPI.createAchievement,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      options?.onSuccess?.(data, data, undefined);
    },
    ...options,
  });
};

export const useUpdateAchievement = (options?: UseMutationOptions<Achievement, Error, { id: number; data: Partial<Achievement> }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => achievementsAPI.updateAchievement(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      queryClient.invalidateQueries({ queryKey: ['achievement', variables.id] });
      options?.onSuccess?.(data, variables, undefined);
    },
    ...options,
  });
};

export const useDeleteAchievement = (options?: UseMutationOptions<void, Error, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: achievementsAPI.deleteAchievement,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      queryClient.removeQueries({ queryKey: ['achievement', id] });
      options?.onSuccess?.(data, id, undefined);
    },
    ...options,
  });
};

// Certificates hooks
export const useCertificates = (params?: {
  page?: number;
  search?: string;
  category?: number;
  status?: string;
  user?: number;
}) => {
  return useQuery({
    queryKey: ['certificates', params],
    queryFn: () => certificatesAPI.getCertificates(params),
  });
};

export const useCertificate = (id: number) => {
  return useQuery({
    queryKey: ['certificate', id],
    queryFn: () => certificatesAPI.getCertificate(id),
    enabled: !!id,
  });
};

export const useUploadCertificate = (options?: UseMutationOptions<Certificate, Error, any>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: certificatesAPI.uploadCertificate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      options?.onSuccess?.(data, data, undefined);
    },
    ...options,
  });
};

export const useUpdateCertificate = (options?: UseMutationOptions<Certificate, Error, { id: number; data: Partial<Certificate> }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => certificatesAPI.updateCertificate(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      queryClient.invalidateQueries({ queryKey: ['certificate', variables.id] });
      options?.onSuccess?.(data, variables, undefined);
    },
    ...options,
  });
};

export const useDeleteCertificate = (options?: UseMutationOptions<void, Error, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: certificatesAPI.deleteCertificate,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      queryClient.removeQueries({ queryKey: ['certificate', id] });
      options?.onSuccess?.(data, id, undefined);
    },
    ...options,
  });
};

// Volunteering hooks
export const useVolunteeringActivities = (params?: {
  page?: number;
  search?: string;
  category?: number;
  status?: string;
  user?: number;
}) => {
  return useQuery({
    queryKey: ['volunteering', params],
    queryFn: () => volunteeringAPI.getVolunteeringActivities(params),
  });
};

export const useVolunteeringActivity = (id: number) => {
  return useQuery({
    queryKey: ['volunteering-activity', id],
    queryFn: () => volunteeringAPI.getVolunteeringActivity(id),
    enabled: !!id,
  });
};

export const useCreateVolunteeringActivity = (options?: UseMutationOptions<VolunteeringActivity, Error, any>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: volunteeringAPI.createVolunteeringActivity,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['volunteering'] });
      options?.onSuccess?.(data, data, undefined);
    },
    ...options,
  });
};

export const useUpdateVolunteeringActivity = (options?: UseMutationOptions<VolunteeringActivity, Error, { id: number; data: Partial<VolunteeringActivity> }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => volunteeringAPI.updateVolunteeringActivity(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['volunteering'] });
      queryClient.invalidateQueries({ queryKey: ['volunteering-activity', variables.id] });
      options?.onSuccess?.(data, variables, undefined);
    },
    ...options,
  });
};

export const useDeleteVolunteeringActivity = (options?: UseMutationOptions<void, Error, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: volunteeringAPI.deleteVolunteeringActivity,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['volunteering'] });
      queryClient.removeQueries({ queryKey: ['volunteering-activity', id] });
      options?.onSuccess?.(data, id, undefined);
    },
    ...options,
  });
};

// Notifications hooks
export const useNotifications = (params?: {
  page?: number;
  is_read?: boolean;
  is_archived?: boolean;
  priority?: string;
  type?: number;
}) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationsAPI.getNotifications(params),
  });
};

export const useMarkNotificationAsRead = (options?: UseMutationOptions<Notification, Error, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationsAPI.markAsRead,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      options?.onSuccess?.(data, id, undefined);
    },
    ...options,
  });
};

export const useMarkAllNotificationsAsRead = (options?: UseMutationOptions<void, Error, void>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationsAPI.markAllAsRead,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      options?.onSuccess?.(data, undefined, undefined);
    },
    ...options,
  });
};

export const useDeleteNotification = (options?: UseMutationOptions<void, Error, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationsAPI.deleteNotification,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      options?.onSuccess?.(data, id, undefined);
    },
    ...options,
  });
};

// User profile hooks
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: userAPI.getProfile,
  });
};

export const useUpdateProfile = (options?: UseMutationOptions<UserProfile, Error, Partial<UserProfile>>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userAPI.updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      options?.onSuccess?.(data, data, undefined);
    },
    ...options,
  });
};

export const useUploadProfilePicture = (options?: UseMutationOptions<{ profile_picture: string }, Error, File>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userAPI.uploadProfilePicture,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      options?.onSuccess?.(data, data, undefined);
    },
    ...options,
  });
};

// Additional hooks for new features
export const useAchievementCategories = () => {
  return useQuery({
    queryKey: ['achievement-categories'],
    queryFn: () => achievementsAPI.getAchievementCategories(),
  });
};

export const useAchievementStats = () => {
  return useQuery({
    queryKey: ['achievement-stats'],
    queryFn: () => achievementsAPI.getAchievementStats(),
  });
};

export const useCertificateCategories = () => {
  return useQuery({
    queryKey: ['certificate-categories'],
    queryFn: () => certificatesAPI.getCertificateCategories(),
  });
};

export const useCertificateStats = () => {
  return useQuery({
    queryKey: ['certificate-stats'],
    queryFn: () => certificatesAPI.getCertificateStats(),
  });
};

export const useVolunteeringCategories = () => {
  return useQuery({
    queryKey: ['volunteering-categories'],
    queryFn: () => volunteeringAPI.getVolunteeringCategories(),
  });
};

export const useVolunteeringStats = () => {
  return useQuery({
    queryKey: ['volunteering-stats'],
    queryFn: () => volunteeringAPI.getVolunteeringStats(),
  });
};

export const useNotificationStats = () => {
  return useQuery({
    queryKey: ['notification-stats'],
    queryFn: () => notificationsAPI.getNotificationStats(),
  });
};

export const useNotificationTypes = () => {
  return useQuery({
    queryKey: ['notification-types'],
    queryFn: () => notificationsAPI.getNotificationTypes(),
  });
};
