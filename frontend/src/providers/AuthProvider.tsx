import React, { useEffect } from 'react';
import { useAuthStore } from '../features/auth/store/auth.store.js';
import { authApi } from '../features/auth/api/auth.api.js';
import { apiClient } from '../lib/axios.js';
import { SessionLoader } from '../features/auth/components/SessionLoader.js';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore(s => s.setAuth);
  const clearAuth = useAuthStore(s => s.clearAuth);
  const setInitializing = useAuthStore(s => s.setInitializing);
  const isInitializing = useAuthStore(s => s.isInitializing);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Attempt to refresh token directly on mount if HTTP-only cookie exists
        const { data } = await apiClient.post('/auth/refresh');
        const accessToken = data.data.accessToken;
        
        // Temporarily set token in headers to fetch user profile
        apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        
        const user = await authApi.getMe();
        setAuth(user, accessToken);
      } catch {
        clearAuth();
      } finally {
        setInitializing(false);
      }
    };

    initAuth();
  }, [setAuth, clearAuth, setInitializing]);

  if (isInitializing) {
    return <SessionLoader />;
  }

  return <>{children}</>;
}
