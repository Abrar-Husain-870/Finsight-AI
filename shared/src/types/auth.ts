export interface UserResponse {
  id: string;
  email: string;
  name: string;
  picture: string | null;
  provider: string;
  currency: string;
}

export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
}
