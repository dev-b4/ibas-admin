import React from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export default function FeedbackModal({ isOpen, type = 'info', title, message, onConfirm, onCancel, confirmText = 'OK', cancelText = 'Cancelar' }) {
  if (!isOpen) return null;

  const icons = {
    success: <CheckCircle className="text-emerald-500 w-12 h-12 mb-4" />,
    warning: <AlertTriangle className="text-amber-500 w-12 h-12 mb-4" />,
    error: <AlertTriangle className="text-red-500 w-12 h-12 mb-4" />,
    info: <Info className="text-blue-500 w-12 h-12 mb-4" />
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in font-sans" onClick={onCancel || onConfirm}>
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl flex flex-col items-center text-center p-8 animate-fade-in-up border border-slate-100 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onCancel || onConfirm} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
          <X size={16} />
        </button>
        
        {icons[type]}
        
        <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-sm text-slate-500 mb-6">{message}</p>
        
        <div className="flex gap-3 w-full">
          {onCancel && (
            <button 
              onClick={onCancel}
              className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button 
            onClick={onConfirm}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white transition-colors shadow-lg ${
              type === 'warning' || type === 'error' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' : 
              type === 'success' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 
              'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
