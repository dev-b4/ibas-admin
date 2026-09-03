import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#150B2D] text-slate-200 font-sans p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 bg-slate-900 rounded-xl shadow-2xl"
      >
        {!submitted ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Esqueceu sua senha?</h1>
              <p className="text-slate-400 text-sm">Enviaremos um link para você redefinir sua senha.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-[#7C2DFF] transition-colors"
                  placeholder="admin@b4.capital"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 px-4 bg-[#7C2DFF] hover:bg-[#6821d6] text-white font-medium rounded-lg transition-colors flex justify-center items-center"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Enviar link de redefinição"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-[#7C2DFF]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-[#7C2DFF]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-3">Verifique seu email</h2>
            <p className="text-slate-400 text-sm mb-6">
              Enviamos um link de recuperação para <strong>{email}</strong>.<br/>
              O link expira em 1 hora.
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
