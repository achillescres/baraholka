import { apiClient } from '@/shared/api/client';

export const login = (email: string, password: string) => apiClient.post('/auth/login', { email, password });
export const register = (email: string, password: string, username: string) => apiClient.post('/auth/register', { email, password, username }); 