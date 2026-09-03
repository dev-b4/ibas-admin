import { useState, useEffect } from 'react';
import { LanguageProvider } from "./context/LanguageContext";
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from "framer-motion";
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import Register from './components/Register';
import ProjectDetails from './components/ProjectDetails';
import { getSystemUsers } from './api/mockData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

import Login from './pages/Login';
import SetupTOTP from './pages/SetupTOTP';
import VerifyTOTP from './pages/VerifyTOTP';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AuthGuard from './components/AuthGuard';

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <Header />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
}

import { supabase } from './api/supabaseClient';

function AdminAuthWrapper({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/login');
          return;
        }
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }

        // Check MFA status
        const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
        const totpFactor = factors?.totp?.[0] || factors?.all?.find(f => f.factor_type === 'totp');
        
        if (!totpFactor || totpFactor.status !== 'verified') {
          navigate('/setup-totp');
          return;
        }

        const { data: { assuranceLevel } } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (assuranceLevel?.currentLevel === 'aal1') {
          navigate('/verify-totp');
          return;
        }

        setAuthenticated(true);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 text-slate-500 font-bold">Verificando segurança...</div>;
  }

  if (!authenticated) {
    return null;
  }

  return children;
}


function GlobalAuthWrapper({ children }) {
  // Autenticação removida conforme solicitado
  return children;
}


function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      
      {/* Logic to separate Admin and Public apps based on Env Variable */}
      <Routes location={location} key={location.pathname}>
        {import.meta.env.VITE_APP_MODE === 'admin' ? (
          <>
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/setup-totp" element={<AuthGuard><SetupTOTP /></AuthGuard>} />
            <Route path="/verify-totp" element={<AuthGuard><VerifyTOTP /></AuthGuard>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin" element={<motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:1.05}} transition={{duration:0.3}}><AdminAuthWrapper><AdminPanel /></AdminAuthWrapper></motion.div>} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} transition={{duration:0.3}}><PublicLayout><Dashboard /></PublicLayout></motion.div>} />
            <Route path="/projeto/:id" element={<motion.div initial={{opacity:0, x:50}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-50}} transition={{duration:0.3}}><PublicLayout><ProjectDetails /></PublicLayout></motion.div>} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:1.05}} transition={{duration:0.3}}><AdminAuthWrapper><AdminPanel /></AdminAuthWrapper></motion.div>} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </AnimatePresence>
  );
}


function Preloader({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-slate-50 flex items-center justify-center flex-col"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex items-center justify-center"
      >
        <img src="./ibas-logo.png" alt="IBAS Logo" className="w-32 md:w-48 object-contain" />
      </motion.div>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: 100 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="h-1 bg-[#7C2DFF] rounded-full mt-4"
      />
    </motion.div>
  );
}

function App() {
  const [loadingApp, setLoadingApp] = useState(true);

  return (
    <GlobalAuthWrapper>
      <AnimatePresence>{loadingApp && <Preloader onComplete={() => setLoadingApp(false)} />}</AnimatePresence>
      {!loadingApp && (
      <LanguageProvider>
        <Router>
          <AnimatedRoutes />
        </Router>
      </LanguageProvider>
    )}
    </GlobalAuthWrapper>
  );
}

export default App;
