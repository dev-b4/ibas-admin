import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';

export default function AuthGuard({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (!['/login', '/forgot-password', '/reset-password'].includes(location.pathname)) {
          navigate('/login');
        }
        return;
      }
      setAuthorized(true);
      setLoading(false);
    };
    checkAuth();
  }, [navigate, location]);

  if (loading) return null;
  if (!authorized) return null;

  return <>{children}</>;
}
