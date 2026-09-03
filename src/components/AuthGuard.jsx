import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AuthGuard({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Basic Auth Check Logic using localStorage for now as a fallback
    // In a real scenario, this would use Supabase auth state
    const isAuthenticated = localStorage.getItem('hasTOTP') !== null || true; // Mock true for testing
    const hasTOTP = localStorage.getItem('hasTOTP') === 'true';
    const isVerified = sessionStorage.getItem('totpVerified') === 'true';

    // Se nÃ£o estÃ¡ autenticado, vai pro login
    if (!isAuthenticated) {
      if (!['/login', '/forgot-password', '/reset-password'].includes(location.pathname)) {
        navigate('/login');
      }
      return;
    }

    // Se estÃ¡ autenticado mas nÃ£o tem TOTP configurado
    if (isAuthenticated && !hasTOTP) {
      if (location.pathname !== '/setup-totp' && location.pathname !== '/login') {
        navigate('/setup-totp');
      }
      return;
    }

    // Se estÃ¡ autenticado, tem TOTP, mas nÃ£o verificou na sessÃ£o atual
    if (isAuthenticated && hasTOTP && !isVerified) {
      // Temporarily mark as verified to avoid infinite loops during mock setup
      sessionStorage.setItem('totpVerified', 'true');
      if (location.pathname !== '/verify-totp' && location.pathname !== '/login') {
        // navigate('/verify-totp');
      }
      return;
    }

  }, [navigate, location]);

  return <>{children}</>;
}
