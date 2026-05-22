export interface User {
  id: string;
  username: string;
  fullName: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
