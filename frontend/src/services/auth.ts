import axios, { InternalAxiosRequestConfig } from 'axios';
import { api } from './api';

// User types
export interface User {
  username: string;
  email?: string;
  full_name?: string;
  disabled?: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

// Create a separate instance for auth requests that handles form data
const authApi = axios.create({
  baseURL: api.defaults.baseURL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

// Authentication service
export const authService = {
  /**
   * Login with username and password to get JWT token
   */
  login: async (username: string, password: string): Promise<LoginResponse> => {
    // Convert data to form URL encoded format
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await authApi.post<LoginResponse>(
      '/auth/token',
      formData.toString()
    );
    
    // Store token in localStorage
    localStorage.setItem('token', response.data.access_token);
    
    return response.data;
  },
  
  /**
   * Get current user information
   */
  getCurrentUser: async (): Promise<User> => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await api.get<User>('/auth/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  },
  
  /**
   * Logout by removing the token
   */
  logout: (): void => {
    localStorage.removeItem('token');
  },
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
  
  /**
   * Get the authentication token
   */
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
};

// Axios interceptor to add the token to every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: unknown) => Promise.reject(error)
); 