import fs from 'fs';
const file = 'src/pages/ResetPassword.jsx';
let content = fs.readFileSync(file, 'utf8');

// I will just use sed or string replacement since the file is short.
const newContent = `import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../api/supabaseClient';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [needsMFA, setNeedsMFA] = useState(false);
  const [factorId, setFactorId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkMFA = async () => {
      try {
        const { data: { assuranceLevel }, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (mfaError) throw mfaError;

        if (assuranceLevel?.nextLevel === 'aal2' && assuranceLevel?.currentLevel === 'aal1') {
          setNeedsMFA(true);
          const { data: factors } = await supabase.auth.mfa.listFactors();
          const totp = factors?.totp?.[0] || factors?.all?.find(f => f.factor_type === 'totp');
          if (totp) setFactorId(totp.id);
        }
      } catch (err) {
        console.error('Erro ao verificar MFA', err);
      }
    };
    checkMFA();
  }, []);

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
    if (needsMFA && mfaCode.length < 6) {
      setError('Digite o código de 6 dígitos do Authy.');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      if (needsMFA && factorId) {
        const challenge = await supabase.auth.mfa.challenge({ factorId });
        if (challenge.error) throw challenge.error;
        
        const verify = await supabase.auth.mfa.verify({
          factorId,
          challengeId: challenge.data.id,
          code: mfaCode
        });
        
        if (verify.error) throw new Error('Código Authy inválido ou expirado.');
      }

      const { error: updateError } = await supabase.auth.updateUser({ password });
      
      if (updateError) throw updateError;
      
      setSuccess(true);
      await supabase.auth.signOut();
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error(err);
      setError(err.message === 'New password should be different from the old password.' ? 'A nova senha deve ser diferente da antiga.' : err.message);
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
                      <div className={\`h-full \${strength.color} \${strength.w} transition-all duration-300\`} />
                    </div>
                    <p className={\`text-xs mt-1 text-right \${strength.color.replace('bg-', 'text-')}\`}>{strength.label}</p>
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

              {needsMFA && (
                <div className="pt-4 border-t border-slate-700/50">
                  <label className="block text-sm font-medium text-amber-300 mb-2 flex items-center gap-2">
                    <Shield size={16} /> Código Authy Obrigatório
                  </label>
                  <p className="text-xs text-slate-400 mb-3">Sua conta tem autenticação em dois fatores ativada. Digite o código para autorizar a troca de senha.</p>
                  <input 
                    type="text" 
                    maxLength={6}
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\\D/g, ''))}
                    className="w-full px-4 py-3 bg-slate-800 border border-amber-700/30 rounded-lg focus:outline-none focus:border-amber-500 transition-colors text-center tracking-[0.5em] text-xl font-bold"
                    placeholder="000000"
                    required
                  />
                </div>
              )}

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
`;

fs.writeFileSync(file, newContent);
console.log("Patched ResetPassword with MFA support");
