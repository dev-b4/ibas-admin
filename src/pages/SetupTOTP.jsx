import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../api/supabaseClient';

export default function SetupTOTP() {
  const [code, setCode] = useState('');
  const [secret, setSecret] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [factorId, setFactorId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const enrollMFA = async () => {
      try {
        const { data: factors } = await supabase.auth.mfa.listFactors();
        const unverified = factors?.all?.filter(f => f.factor_type === 'totp' && f.status === 'unverified') || [];
        for (const f of unverified) {
          await supabase.auth.mfa.unenroll({ factorId: f.id });
        }
        
        const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
        if (error) throw error;
        
        setFactorId(data.id);
        setQrCodeUrl(data.totp.qr_code);
        setSecret(data.totp.secret);
      } catch (err) {
        console.error(err);
        setError('Erro ao iniciar configuração do Authy: ' + err.message);
      }
    };
    enrollMFA();
  }, []);


  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const challenge = await supabase.auth.mfa.challenge({ factorId });
      if (challenge.error) throw challenge.error;
      
      const verify = await supabase.auth.mfa.verify({
        factorId,
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg p-8 bg-slate-900 rounded-xl shadow-2xl"
      >
        <div className="text-center mb-8">
        {error && <div className="mb-4 p-3 bg-red-900/50 text-red-300 text-sm rounded-lg border border-red-500/50">{error}</div>}
          <div className="w-16 h-16 bg-[#7C2DFF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-[#7C2DFF]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Configurar Autenticador</h1>
          <p className="text-slate-400 text-sm">Para sua segurança, é obrigatório configurar um autenticador de dois fatores.</p>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800 p-4 rounded-lg">
            <h3 className="font-medium text-white mb-2">Passo 1: Instalar aplicativo</h3>
            <p className="text-sm text-slate-400 mb-3">Baixe o Google Authenticator ou Authy na loja de aplicativos do seu celular.</p>
            <div className="flex gap-3">
              <a href="#" className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded transition-colors">App Store</a>
              <a href="#" className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded transition-colors">Play Store</a>
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg flex flex-col items-center">
            <h3 className="font-medium text-white mb-4 w-full text-left">Passo 2: Escanear QR Code</h3>
            <div className="bg-white p-2 rounded-lg mb-4">
              <QRCodeSVG value={`otpauth://totp/IBAS Admin?secret=${secret}&issuer=B4 Capital`} size={160} />
            </div>
            <p className="text-sm text-slate-400 text-center">
              Se não puder escanear, use o código manual:<br/>
              <span className="font-mono text-white tracking-widest mt-1 block">{secret}</span>
            </p>
          </div>

          <form onSubmit={handleVerify}>
            <label className="block text-sm font-medium text-slate-300 mb-2">Passo 3: Digite o código de 6 dígitos</label>
            <input 
              type="text" 
              maxLength="6"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-[#7C2DFF] text-center text-2xl tracking-[0.5em] font-mono"
              placeholder="000000"
              required
            />
            <button 
              type="submit" 
              disabled={loading || code.length !== 6}
              className="w-full mt-6 py-3 px-4 bg-[#7C2DFF] hover:bg-[#6821d6] disabled:opacity-50 text-white font-medium rounded-lg transition-colors flex justify-center items-center"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Confirmar e Ativar"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
