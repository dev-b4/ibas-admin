import React, { useState } from 'react';
import { X, Save, Building, FileText, Activity } from 'lucide-react';

export default function AddProjectModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    nome: '',
    categoria: 'Floresta',
    volume: '',
    preco: '',
    status: 'Custodiado',
    metodologia: '',
    auditor: '',
    enderecoContrato: '',
    linkWhitepaper: '',
    linkCertificado: '',
    apiPrecos: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in font-sans" onClick={onClose}>
      <div className="bg-white w-[95%] md:w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0 bg-slate-50 rounded-t-3xl text-slate-900">
          <div>
            <h2 className="text-xl font-bold text-[#150B2D]">Adicionar Novo Projeto</h2>
            <p className="text-sm text-slate-500 mt-1">Preencha os dados básicos do projeto para listagem.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-grow bg-white">
          <form id="add-project-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Seção 1: Informações Gerais */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Building size={16} className="text-purple-600" /> Informações Gerais
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Nome do Projeto *</label>
                  <input required name="nome" value={formData.nome} onChange={handleChange} type="text" placeholder="Ex: Projeto BF Terra" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Categoria / Nicho *</label>
                  <select name="categoria" value={formData.categoria} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-900">
                    <option value="Floresta">Floresta / REDD+</option>
                    <option value="Energia Renovável">Energia Renovável</option>
                    <option value="Agricultura Sustentável">Agricultura Sustentável</option>
                    <option value="Biogás">Biogás</option>
                    <option value="Geral">Geral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Endereço do Contrato (Blockchain)</label>
                  <input name="enderecoContrato" value={formData.enderecoContrato} onChange={handleChange} type="text" placeholder="0x..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-600 focus:outline-none focus:border-purple-500 text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Status Inicial</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 text-slate-900">
                    <option value="Custodiado">Custodiado (Não listado)</option>
                    <option value="Em Avaliação">Em Avaliação (Score Pendente)</option>
                    <option value="Aprovado B4">Aprovado B4 (Pronto para Listagem)</option>
                    <option value="Listado">Listado Ativo</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Seção 2: Dados Financeiros e de Impacto */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Activity size={16} className="text-emerald-600" /> Ativos e Metodologia
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Volume Total (Estoque de Créditos) *</label>
                  <input required name="volume" value={formData.volume} onChange={handleChange} type="text" placeholder="Ex: 1.250.000" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Preço Inicial (Reais) *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-slate-400 font-bold text-sm">R$</span>
                    </div>
                    <input required name="preco" value={formData.preco} onChange={handleChange} type="number" step="0.01" placeholder="3.93" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-slate-900" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Metodologia Padrão</label>
                  <input name="metodologia" value={formData.metodologia} onChange={handleChange} type="text" placeholder="Ex: VM0015 | VCS" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Auditor Independente (Verificação)</label>
                  <input name="auditor" value={formData.auditor} onChange={handleChange} type="text" placeholder="Ex: Bureau Veritas" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-slate-900" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-2">API de Preços da B4</label>
                  <input name="apiPrecos" value={formData.apiPrecos} onChange={handleChange} type="url" placeholder="https://api.b4.capital/v1/price/..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-slate-900 font-mono text-slate-600" />
                  <p className="text-[10px] text-slate-500 mt-1">Endpoint de integração para atualização automática da cotação do ativo.</p>
                </div>
              </div>
            </div>

            {/* Seção 3: Documentação Inicial */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                <FileText size={16} className="text-blue-600" /> Documentação Inicial
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Link do Whitepaper do Projeto</label>
                  <input name="linkWhitepaper" value={formData.linkWhitepaper} onChange={handleChange} type="url" placeholder="https://" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Link do Certificado de Conformidade / Validação</label>
                  <input name="linkCertificado" value={formData.linkCertificado} onChange={handleChange} type="url" placeholder="https://" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-900" />
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-3xl shrink-0 text-slate-900">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors">
            Cancelar
          </button>
          <button form="add-project-form" type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 flex items-center gap-2 transition-colors shadow-lg shadow-purple-500/30">
            <Save size={16} /> Salvar e Criar Projeto
          </button>
        </div>

      </div>
    </div>
  );
}
