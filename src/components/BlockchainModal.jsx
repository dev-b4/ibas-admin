import React from "react";
import { X, ExternalLink, ShieldCheck, Link2, Database, Key, Info, Trees } from "lucide-react";

export default function BlockchainModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in-only" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-[95%] md:w-full max-w-6xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <header className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div></div>
          <button onClick={onClose} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors text-slate-300">
            <X size={20} />
          </button>
        </header>

        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          {/* KYB/KYC */}
          <section>
            <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2 mb-3">
              KYB/KYC
            </h3>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div className="flex items-center gap-3">
                <Key className="text-purple-400" size={20} />
                <span className="text-white font-bold">Registro Validado pelo Ecossistema</span>
              </div>
              
              <div className="space-y-4">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-500 mb-1">Carteira Oficial da B4 (Origem)</div>
                  <div className="text-sm font-mono text-emerald-400 break-all">0x65aEcC6D4f8cC5CffB9AA248ED571F18328c49D5</div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-500 mb-1">Carteira do Cliente (Destino - KYB/KYC Validado)</div>
                  <div className="text-sm font-mono text-purple-400 break-all">0xb2BFa31a5D4eC21cCAAAD23AD5a87dFF9225FCF1</div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a href="https://polygonscan.com/tx/0x808116da18e8c8c72c9ae3e3ccbdd28f24f48c665aa405986cbde65615ead56d" target="_blank" rel="noreferrer" className="flex-1 text-center text-sm font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <Link2 size={16} /> Hash da Transação
                  </a>
                  <a href="https://polygonscan.com/tx/0x6ae1a54709b35d59bb7e9f6331db2441d38c3df7d2651b81228e5111d95204fa" target="_blank" rel="noreferrer" className="flex-1 text-center text-sm font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <Link2 size={16} /> Contrato de Crédito
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}