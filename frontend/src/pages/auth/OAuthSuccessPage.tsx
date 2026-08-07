import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/auth.store.js';
import { authApi } from '../../features/auth/api/auth.api.js';
import { apiClient } from '../../lib/axios.js';
import { SessionLoader } from '../../features/auth/components/SessionLoader.js';

export default function OAuthSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchUser = async () => {
      try {
        apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
        const user = await authApi.getMe();
        setAuth(user, token);
        navigate('/', { replace: true });
      } catch {
        navigate('/login', { replace: true });
      }
    };

    fetchUser();
  }, [searchParams, navigate, setAuth]);

  return <SessionLoader />;
}
