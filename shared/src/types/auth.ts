export interface UserResponse {
  id: string;
  email: string;
  name: string;
  picture: string | null;
  provider: string;
}

export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
}
