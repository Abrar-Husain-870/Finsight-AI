import { create } from 'zustand';
import { UserResponse } from '@finsight/shared';

interface AuthState {
  user: UserResponse | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isSessionExpired: boolean;
  setAuth: (user: UserResponse, accessToken: string) => void;
  clearAuth: (expired?: boolean) => void;
  setInitializing: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitializing: true,
  isSessionExpired: false,
  setAuth: (user, accessToken) => set({ user, accessToken, isAuthenticated: true, isSessionExpired: false }),
  clearAuth: (expired = false) => set({ user: null, accessToken: null, isAuthenticated: false, isSessionExpired: expired }),
  setInitializing: (status) => set({ isInitializing: status }),
}));
