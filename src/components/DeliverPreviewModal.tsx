import React, { useState } from 'react';
import { Client } from '../types';
import { Sparkles, Globe, Download, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

interface DeliverPreviewModalProps {
  client: Client;
  onConfirm: (urlOrApk: string) => void;
  onClose: () => void;
}

export default function DeliverPreviewModal({ client, onConfirm, onClose }: DeliverPreviewModalProps) {
  const isApp = client.projectType === 'app';
  const cleanCompanyName = client.companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Suggest a suitable default
  const defaultSuggestion = isApp ? `${cleanCompanyName}_app.apk` : `https://www.${cleanCompanyName}.com.br`;
  
  const [inputValue, setInputValue] = useState(defaultSuggestion);
  const [errorString, setErrorString] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      setErrorString('Por favor, preencha o link do site ou nome do arquivo APK.');
      return;
    }
    
    // Simple path validators
    if (isApp) {
      if (!inputValue.toLowerCase().endsWith('.apk')) {
        setErrorString('Para aplicativos, o nome do arquivo deve terminar com .apk (exemplo: academiatitan.apk)');
        return;
      }
    } else {
      if (!inputValue.startsWith('http://') && !inputValue.startsWith('https://') && !inputValue.includes('.')) {
        setErrorString('Por favor, digite uma URL de domínio válida (ex: https:// titanfit.site)');
        return;
      }
    }

    onConfirm(inputValue.trim());
  };  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#141517] border border-white/5 rounded-2xl overflow-hidden shadow-2xl text-left select-none animate-fadeIn">
        
        {/* Banner header inside modal */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-5 text-white relative">
          <div className="absolute right-3 top-3 opacity-25">
            <Sparkles className="w-16 h-16 text-white" />
          </div>
          <p className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase w-fit tracking-wider">
            Entrega de Projeto
          </p>
          <h3 className="text-lg font-black mt-2 tracking-tight">Finalizar {client.companyName}</h3>
          <p className="text-xs text-emerald-100 mt-1">Conclua o desenvolvimento e fature os ganhos na conta da agência!</p>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          <div className="bg-[#0c0d0e] p-4 border border-white/5 rounded-2xl space-y-2 flex items-start space-x-3">
            <div className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-lg ${client.avatarColor}`}>
              {client.avatarEmoji}
            </div>
            <div>
              <p className="text-white text-xs font-black">{client.companyName}</p>
              <p className="text-slate-500 text-[10px] font-bold mt-0.5">
                Nicho: {client.nicho} • {isApp ? 'Aplicativo Mobile' : 'Website Responsivo'}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 font-bold text-[10px] uppercase flex items-center space-x-1">
              {isApp ? (
                <>
                  <Download className="w-4 h-4 text-purple-400 mr-1" />
                  <span>Nome do Arquivo APK Compilado</span>
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 text-indigo-400 mr-1" />
                  <span>Link / Endereço do Site Ativo</span>
                </>
              )}
            </label>
            
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setErrorString('');
              }}
              className="w-full bg-[#0c0d0e] text-slate-200 text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono tracking-tight"
              placeholder={isApp ? 'exemplo: academiatitan.apk' : 'exemplo: https://titanfit.site'}
            />
            
            <p className="text-[10px] text-slate-500 leading-normal font-semibold">
              {isApp 
                ? 'Gere o build no simulador de Android e configure o nome completo do binário.'
                : 'Configure a landing page em ambiente de produção com domínio oficial.'}
            </p>
          </div>

          {errorString && (
            <p className="text-red-400 text-[10px] font-bold bg-red-400/5 p-2 rounded-lg border border-red-500/10 leading-normal">
              ⚠️ {errorString}
            </p>
          )}

          {/* XP Rewards list */}
          <div className="bg-[#0c0d0e]/50 p-3.5 rounded-2xl border border-dashed border-white/10 space-y-1">
            <p className="text-slate-500 text-[9px] uppercase font-extrabold tracking-wider">Abonos e Prêmios da Compilação:</p>
            <div className="text-[10px] text-slate-350 space-y-1 font-semibold">
              <p className="flex justify-between"><span>💰 Faturamento do Projeto:</span> <strong className="text-emerald-400">R$ {client.proposalPrice}</strong></p>
              <p className="flex justify-between"><span>⭐ Experiência Faturamento (XP):</span> <strong className="text-indigo-400">+100 XP</strong></p>
              <p className="flex justify-between"><span>📈 Meta de Projetos Semana:</span> <strong className="text-yellow-400">+1 Concluído</strong></p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-[#0c0d0e] hover:bg-zinc-800 text-slate-400 hover:text-white border border-white/5 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Voltar
            </button>
            <button
              type="submit"
              className="flex-grow py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white text-xs font-black rounded-xl transition shadow-md cursor-pointer"
            >
              Confirmar Entrega Ativa
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
