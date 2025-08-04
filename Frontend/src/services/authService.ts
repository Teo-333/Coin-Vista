import api from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface User {
  email: string;
  id: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    const { token } = response.data;
    localStorage.setItem('auth-token', token);
    return response.data;
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/register', userData);
    const { token } = response.data;
    localStorage.setItem('auth-token', token);
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('auth-token');
  },

  getToken(): string | null {
    return localStorage.getItem('auth-token');
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  getUserFromToken(): User | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        email: payload.email || ''
      };
    } catch {
      return null;
    }
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, email: string, newPassword: string): Promise<{ message: string }> {
    const response = await api.post('/auth/reset-password', {
      token,
      email,
      newPassword
    });
    return response.data;
  }
};

export default authService; 