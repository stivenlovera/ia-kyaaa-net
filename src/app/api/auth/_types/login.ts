export interface User {
  user_id: number
  email: string
  name: string
  password?: string
  create_at?: Date
  update_at?: Date
}

export interface JWTPayload {
  user_id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'moderator';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: Omit<User, 'password'>;
  accessToken?: string;
}