import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../api/supabaseClient';

export default function VerifyTOTP() {
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 30));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
      if (factorsError) throw factorsError;
      
      const totpFactor = factors?.all?.find(f => f.factor_type === 'totp' && f.status === 'verified');
      if (!totpFactor) throw new Error('Nenhum dispositivo 2FA configurado.');
      
      const challenge = await supabase.auth.mfa.challenge({ factorId: totpFactor.id });
      if (challenge.error) throw challenge.error;
      
      const verify = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challenge.data.id,
        code
      });
      
      if (verify.error) throw verify.error;
      
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError('Código inválido ou expirado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#150B2D] text-slate-200 font-sans p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-slate-900 rounded-xl shadow-2xl"
      >
        <div className="text-center mb-8">
        {error && <div className="mb-4 p-3 bg-red-900/50 text-red-300 text-sm rounded-lg border border-red-500/50">{error}</div>}
          <div className="w-16 h-16 bg-[#7C2DFF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-[#7C2DFF]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Verificação em dois fatores</h1>
          <p className="text-slate-400 text-sm">Digite o código de 6 dígitos do seu autenticador</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <input 
              type="text" 
              maxLength="6"
              value={code}
              autoFocus
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-4 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-[#7C2DFF] text-center text-3xl tracking-[0.5em] font-mono"
              placeholder="000000"
              required
            />
            <div className="text-center mt-3 text-xs text-slate-500">
              Código expira em {timeLeft}s
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || code.length !== 6}
            className="w-full py-3 px-4 bg-[#7C2DFF] hover:bg-[#6821d6] disabled:opacity-50 text-white font-medium rounded-lg transition-colors flex justify-center items-center"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Verificar"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button className="text-sm text-slate-400 hover:text-white transition-colors">
            Tive problemas com meu autenticador
          </button>
        </div>
      </motion.div>
    </div>
  );
}
