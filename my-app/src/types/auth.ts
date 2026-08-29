export interface User {
  id: string;
  username: string;
  fullName: string;
  email?: string;
  role?: string;
  roles?: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}
