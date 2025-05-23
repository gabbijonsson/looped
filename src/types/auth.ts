export interface AuthUser {
  id: number;
  created_at: string;
  username: string;
  password: string;
  is_admin: boolean;
}

export interface User {
  username: string;
  isAdmin: boolean;
}
