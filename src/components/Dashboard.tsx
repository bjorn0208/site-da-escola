import React from 'react';
import { Client, GameState } from '../types';
import { getLevelTitle } from './WeeklyGoal';
import { Trophy, Star, ShieldCheck, DollarSign, ExternalLink, Flame, Sparkles, FolderHeart, Calendar, RefreshCcw, Laptop, Smartphone, Copy } from 'lucide-react';

interface DashboardProps {
  gameState: GameState;
  onOpenPreview: (client: Client) => void;
  onResetProgress: () => void;
}

export default function Dashboard({ gameState, onOpenPreview, onResetProgress }: DashboardProps) {
  const { clients, totalXp, level } = gameState;
  
  // Completed list
  const completedClients = clients.filter(c => c.status === 'concluido');
  
  // Financial arithmetic
  const totalRevenue = completedClients.reduce((sum, c) => sum + (c.proposalPrice || 500), 0);
  
  // Level info
  const lvlInfo = getLevelTitle(level);
  const totalSites = completedClients.filter(c => c.projectType === 'site').length;
  const totalApps = completedClients.filter(c => c.projectType === 'app').length;

  return (
    <div className="flex-1 bg-[#0c0d0e] p-4 md:p-8 overflow-y-auto select-none relative" id="dashboard_panel">
      {/* Sleek radial micro-grid background pattern overlay */}
      <div className="absolute inset-0 bg-micro-grid opacity-5 pointer-events-none" />
      
      {/* Outer Wrapper Container */}
      <div className="max-w-5xl mx-auto space-y-6 text-left relative z-10">
        
        {/* Profile Card and Performance overview */}
        <div className="bg-[#141517] border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          {/* Subtle lighting backdrop */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center space-x-4 z-10">
            <div className={`w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl shadow-xl`}>
              <lvlInfo.icon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-white font-black text-lg sm:text-xl tracking-tight">Agência Simulator <span className="text-indigo-400">Pro</span></h2>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase leading-none">
                  Ativo
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-1 font-semibold leading-relaxed">
                Nível {level} • <strong className="text-slate-205 text-slate-200">{lvlInfo.title}</strong>
              </p>
              <div className="flex items-center space-x-3 mt-2 text-[10px] text-slate-500 font-bold">
                <span>⭐ {totalXp} XP Acumulados</span>
                <span>•</span>
                <span>🔥 {completedClients.length} Entregas Concluídas</span>
              </div>
            </div>
          </div>

          {/* Quick reset/restart weekend trigger */}
          <div className="flex flex-col items-end z-10 text-right space-y-2 shrink-0 w-full md:w-auto">
            <p className="text-slate-500 text-[10px] uppercase font-bold">Ações Administrativas</p>
            <button
              onClick={onResetProgress}
              className="px-4 py-2 bg-sleek-dark hover:bg-zinc-800 text-red-400 hover:text-red-300 border border-white/5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-md"
            >
              <RefreshCcw className="w-3.5 h-3.5 text-red-405" />
              <span>Gerar Nova Semana (Reset)</span>
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          
          {/* Revenue */}
          <div className="bg-[#141517]/80 backdrop-blur border border-white/5 p-5 rounded-2xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-black uppercase tracking-wider">Faturamento Total</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-emerald-400 tracking-tight">R$ {totalRevenue.toLocaleString()}</p>
            <p className="text-[9px] text-slate-500 font-bold leading-relaxed">Faturamento real simulado.</p>
          </div>

          {/* Site deliveries */}
          <div className="bg-[#141517]/80 backdrop-blur border border-white/5 p-5 rounded-2xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-black uppercase tracking-wider">Sites Desenvolvidos</span>
              <Laptop className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-black text-white tracking-tight">{totalSites}</p>
            <p className="text-[9px] text-slate-500 font-bold leading-relaxed">Taxa de R$500 por landing page.</p>
          </div>

          {/* Mobile Apps */}
          <div className="bg-[#141517]/80 backdrop-blur border border-white/5 p-5 rounded-2xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-black uppercase tracking-wider">Aplicativos APK</span>
              <Smartphone className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-black text-white tracking-tight">{totalApps}</p>
            <p className="text-[9px] text-slate-500 font-bold leading-relaxed">Média de R$1.200 a R$1.500 p/ APK.</p>
          </div>

          {/* Goal completion */}
          <div className="bg-[#141517]/80 backdrop-blur border border-white/5 p-5 rounded-2xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-black uppercase tracking-wider">Meta Semanal</span>
              <Trophy className="w-4 h-4 text-yellow-500" />
            </div>
            <p className="text-2xl font-black text-white tracking-tight">{Math.round((completedClients.length / clients.length) * 100)}%</p>
            <p className="text-[9px] text-slate-500 font-bold leading-relaxed">{completedClients.length} de {clients.length} concluídos.</p>
          </div>

        </div>

        {/* PORTFOLIO / LISTA DE ENTREGAS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-black text-sm uppercase tracking-wider flex items-center space-x-2">
              <FolderHeart className="w-5 h-5 text-indigo-400" />
              <span>Projetos Concluídos da Semana ({completedClients.length})</span>
            </h3>
            <span className="text-slate-500 text-xs font-bold">Portfólio Ativo</span>
          </div>

          {completedClients.length === 0 ? (
            <div className="p-12 text-center bg-[#141517] border border-dashed border-white/10 rounded-2xl space-y-3 shadow-lg">
              <div className="w-12 h-12 rounded-full bg-sleek-dark flex items-center justify-center mx-auto text-xl shadow-md border border-white/5">
                💼
              </div>
              <p className="text-slate-200 font-bold text-xs0 text-slate-350">Nenhum projeto concluído ainda nesta semana.</p>
              <p className="text-slate-450 text-[11px] max-w-sm mx-auto leading-relaxed text-slate-400 font-semibold">
                Vá até a aba <strong className="text-indigo-400 font-bold">Atendimento CRM</strong>, converse com os clientes, envie propostas, monte os briefings e finalize-os para constar aqui!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedClients.map((client) => {
                const isApp = client.projectType === 'app';
                
                return (
                  <div 
                    key={client.id}
                    className="bg-[#141517]/80 backdrop-blur border border-white/5 rounded-2xl p-5 hover:border-indigo-550/30 transition-all flex flex-col justify-between space-y-4 shadow-lg"
                  >
                    <div>
                      {/* Card Head */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3 text-left">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${client.avatarColor}`}>
                            {client.avatarEmoji}
                          </div>
                          <div>
                            <span className="text-white font-black text-xs leading-none capitalize block">{client.companyName}</span>
                            <span className="text-slate-500 text-[9px] mt-1 font-bold block">{client.nicho} • {client.name}</span>
                          </div>
                        </div>

                        <span className={`text-[9px] font-black tracking-tight uppercase px-2 py-0.5 rounded-md ${
                          isApp 
                            ? 'bg-purple-950/20 text-purple-400 border border-purple-500/10' 
                            : 'bg-indigo-950/20 text-indigo-400 border border-indigo-500/10'
                        }`}>
                          {client.projectType === 'app' ? 'APK Gerado' : 'Website Ativo'}
                        </span>
                      </div>

                      {/* Brief details description */}
                      <p className="text-slate-300 text-[11px] mt-3 leading-relaxed font-semibold">
                        <strong className="text-slate-450 text-slate-400 font-bold">Objetivo:</strong> {client.briefing.objective}
                      </p>

                      {/* URL / APK display box */}
                      <div className="bg-[#0c0d0e] p-2.5 rounded-xl border border-white/5 flex items-center justify-between text-xs mt-3 select-all">
                        <div className="flex items-center space-x-1.5 overflow-hidden">
                          <span className="text-slate-600 text-[10px] uppercase font-mono font-bold">
                            {isApp ? 'APK' : 'URL'}
                          </span>
                          <span className="text-slate-300 font-mono text-[10px] truncate">
                            {client.linkOrApk || 'default.site'}
                          </span>
                        </div>
                        <Copy 
                          className="w-3.5 h-3.5 text-zinc-500 cursor-pointer hover:text-white shrink-0 ml-1"
                          onClick={() => {
                            navigator.clipboard.writeText(client.linkOrApk || '');
                          }}
                        />
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-1">
                      <span className="text-[10px] text-slate-500 font-bold flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        Delivered {client.deliveredAt || 'Hoje'}
                      </span>

                      {/* Trigger dynamic preview */}
                      <button
                        onClick={() => onOpenPreview(client)}
                        className="px-3.5 py-1.5 bg-[#0c0d0e] text-indigo-400 hover:text-white font-black text-[10px] rounded-xl border border-white/5 hover:bg-zinc-800 transition flex items-center space-x-1 shadow-sm leading-none cursor-pointer"
                      >
                        <ExternalLink className="w-3 h-3 text-indigo-455 mr-1" />
                        Teste de Código
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
