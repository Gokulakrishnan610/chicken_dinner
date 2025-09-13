/**
 * Utility functions for demo account detection
 */

export const isDemoAccount = (user: any): boolean => {
  if (!user) return false;
  
  // Check if user email contains demo keywords
  const demoKeywords = ['demo', 'test', 'sample'];
  const email = user.email?.toLowerCase() || '';
  
  return demoKeywords.some(keyword => email.includes(keyword)) || 
         user.id === 1 || // First user is often demo
         user.first_name?.toLowerCase() === 'demo' ||
         user.last_name?.toLowerCase() === 'demo';
};

export const getMockData = <T>(mockData: T[], realData: T[] | undefined, user: any): T[] => {
  return isDemoAccount(user) ? mockData : (realData || []);
};
