import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../api/supabaseClient';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if(password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      
      if (updateError) throw updateError;
      
      setSuccess(true);
      await supabase.auth.signOut();
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStrength = () => {
    if(password.length === 0) return { label: '', color: 'bg-slate-700', w: 'w-0' };
    if(password.length < 6) return { label: 'Fraca', color: 'bg-red-500', w: 'w-1/3' };
    if(password.length < 10) return { label: 'Média', color: 'bg-yellow-500', w: 'w-2/3' };
    return { label: 'Forte', color: 'bg-green-500', w: 'w-full' };
  };
  const strength = getStrength();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#150B2D] text-slate-200 font-sans p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 bg-slate-900 rounded-xl shadow-2xl"
      >
        {!success ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Criar nova senha</h1>
              <p className="text-slate-400 text-sm">Digite sua nova senha abaixo.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg flex items-center text-red-200">
                <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nova senha</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-[#7C2DFF] transition-colors"
                  placeholder="••••••••"
                  required
                />
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${strength.color} ${strength.w} transition-all duration-300`} />
                    </div>
                    <p className={`text-xs mt-1 text-right ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Confirmar nova senha</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-[#7C2DFF] transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 px-4 bg-[#7C2DFF] hover:bg-[#6821d6] text-white font-medium rounded-lg transition-colors flex justify-center items-center"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Salvar nova senha"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-3">Senha alterada!</h2>
            <p className="text-slate-400 text-sm">Sua senha foi redefinida com sucesso. Redirecionando para o login...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
