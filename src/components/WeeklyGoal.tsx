import React from 'react';
import { GameState } from '../types';
import { Trophy, Compass, Star, TrendingUp, Sparkles, Building2, Server } from 'lucide-react';

interface WeeklyGoalProps {
  gameState: GameState;
  onChangeTab: (tab: 'simulator' | 'dashboard') => void;
  onResetProgress: () => void;
  onToggleTheme: () => void;
  user: any;
  loadingDb: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export function getLevelTitle(level: number): { title: string; color: string; icon: any } {
  if (level <= 1) return { title: 'Freelancer Iniciante', color: 'from-amber-400 to-yellow-500 text-amber-100', icon: Star };
  if (level === 2) return { title: 'Freelancer Pro', color: 'from-blue-500 to-cyan-400 text-blue-100', icon: Compass };
  if (level === 3) return { title: 'Agência Local', color: 'from-emerald-500 to-teal-400 text-emerald-100', icon: Building2 };
  if (level === 4) return { title: 'Agência Nacional', color: 'from-purple-500 to-indigo-400 text-purple-100', icon: Server };
  if (level === 5) return { title: 'Agência Elite', color: 'from-rose-500 to-red-400 text-rose-100', icon: Trophy };
  return { title: 'Agência Bilionária', color: 'from-violet-600 via-pink-500 to-yellow-400 text-amber-50 animate-pulse', icon: Sparkles };
}

export function getXpProgress(xp: number): { currentXpInLevel: number; nextLevelXp: number; progressPercent: number } {
  // Let's create an easy but rich dynamic scaling for levels:
  // Lvl 1: 0 - 150 XP
  // Lvl 2: 151 - 400 XP
  // Lvl 3: 401 - 800 XP
  // Lvl 4: 801 - 1500 XP
  // Lvl 5: 1501 - 3000 XP
  // Lvl 6+: 3000+
  const brackets = [0, 150, 400, 800, 1500, 3000, 6000, 12000, 24000];
  let currentLvl = 1;
  for (let i = 0; i < brackets.length; i++) {
    if (xp >= brackets[i]) {
      currentLvl = i + 1;
    } else {
      break;
    }
  }

  const base = brackets[currentLvl - 1] || 0;
  const target = brackets[currentLvl] || (base + 3000);
  const diffRequired = target - base;
  const currentAccumulated = xp - base;
  const progressPercent = Math.min(100, Math.max(0, (currentAccumulated / diffRequired) * 100));

  return {
    currentXpInLevel: currentAccumulated,
    nextLevelXp: diffRequired,
    progressPercent
  };
}

export default function WeeklyGoal({ 
  gameState, 
  onChangeTab, 
  onResetProgress,
  onToggleTheme,
  user,
  loadingDb,
  onLogin,
  onLogout
}: WeeklyGoalProps) {
  const completedProjects = gameState.clients.filter(c => c.status === 'concluido').length;
  const totalProjects = gameState.clients.length;
  const progressPercent = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;
  
  const { title: levelTitle, color: levelColor, icon: LevelIcon } = getLevelTitle(gameState.level);
  const xpProg = getXpProgress(gameState.totalXp);

  return (
    <header className="bg-sleek-header border-b border-sleek-border shrink-0 select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Brand Logo & Professional Tier */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/20 flex items-center justify-center text-white" id="app_logo">
            <Building2 className="w-5.5 h-5.5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-white font-black text-base tracking-tight uppercase">Agência Simulator <span className="text-indigo-400 font-black">Pro</span></span>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-bold">
                WEEKLY CHALLENGE
              </span>
            </div>
            
            {/* Level Tier display badge */}
            <div className="flex items-center space-x-2 mt-1">
              <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold bg-gradient-to-r ${levelColor} flex items-center space-x-1 shadow-sm`}>
                <LevelIcon className="w-3.5 h-3.5" />
                <span>Nível {gameState.level}: {levelTitle}</span>
              </div>
              <span className="text-zinc-500 text-[10px] font-semibold">
                {gameState.totalXp} XP Acumulado
              </span>
            </div>
          </div>
        </div>

        {/* Global Weekly Goal Status */}
        <div className="flex-1 max-w-md mx-auto md:mx-6 w-full py-1">
          <div className="flex justify-between items-center text-xs mb-1 bg-transparent">
            <span className="text-zinc-400 font-bold flex items-center space-x-1 text-[11px] uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-emerald-400 mr-1" />
              Meta de Entregas da Semana
            </span>
            <span className="text-indigo-400 font-extrabold text-[11px]">
              {completedProjects}/{totalProjects} Projetos Concluídos ({Math.round(progressPercent)}%)
            </span>
          </div>
          
          {/* Main Progress Bar */}
          <div className="w-full h-2.5 bg-sleek-dark rounded-full overflow-hidden border border-sleek-border relative">
            <div 
              className="h-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.5)] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* XP Progress Bar */}
          <div className="mt-1.5 flex items-center justify-between text-[9px] text-zinc-505">
            <span className="uppercase text-zinc-400 font-bold tracking-tight">Evolução de Carreira:</span>
            <div className="flex items-center space-x-1.5 flex-1 max-w-[140px] ml-2">
              <div className="flex-1 h-1 bg-sleek-dark rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-400 transition-all duration-550 ease-out"
                  style={{ width: `${xpProg.progressPercent}%` }}
                />
              </div>
              <span className="text-zinc-400 font-semibold">{xpProg.currentXpInLevel}/{xpProg.nextLevelXp} XP</span>
            </div>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2 shrink-0 justify-end flex-wrap md:flex-nowrap">
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg bg-sleek-dark text-slate-400 hover:text-white border border-sleek-border cursor-pointer"
          >
             {gameState.theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {/* Firestore cloud synchronization state */}
          {loadingDb ? (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 border border-white/5 animate-pulse text-[10px] uppercase font-extrabold text-indigo-400">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
              <span>Nuvem Ativa</span>
            </div>
          ) : user ? (
            <div className="flex items-center space-x-2 bg-[#121315] hover:bg-[#15171a] border border-white/5 pl-2 pr-3 py-1 rounded-lg transition">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'Usuário'} 
                  className="w-5 h-5 rounded-full border border-indigo-400/30"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-[9px] font-black text-white shrink-0">
                  {user.displayName?.charAt(0) || 'U'}
                </div>
              )}
              <div className="flex flex-col text-left max-w-[90px]">
                <span className="text-white font-extrabold text-[10px] leading-tight truncate">
                  {user.displayName?.split(' ')[0] || 'Nuvem'}
                </span>
                <button 
                  onClick={onLogout}
                  className="text-zinc-500 hover:text-red-400 text-[8px] uppercase font-extrabold tracking-tight text-left cursor-pointer transition-all border-none p-0 bg-transparent"
                >
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onLogin}
              title="Salvar progresso de forma permanente na nuvem"
              className="px-2.5 py-1.5 rounded-lg text-[10.5px] font-bold transition-all border bg-[#0e1013] hover:bg-zinc-800 text-indigo-400 hover:text-indigo-300 border-white/5 flex items-center space-x-1.5 cursor-pointer shadow-md"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shrink-0" />
              <span>Salvar na Nuvem</span>
            </button>
          )}

          <button
            onClick={() => onChangeTab('simulator')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
              gameState.activeTab === 'simulator'
                ? 'bg-indigo-600 text-white border-indigo-550 shadow-lg shadow-indigo-600/20'
                : 'bg-sleek-dark text-slate-300 border-sleek-border hover:text-white hover:bg-zinc-800'
            }`}
          >
            💬 CRM
          </button>
          <button
            onClick={() => onChangeTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
              gameState.activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white border-indigo-550 shadow-lg shadow-indigo-600/20'
                : 'bg-sleek-dark text-slate-300 border-sleek-border hover:text-white hover:bg-zinc-800'
            }`}
          >
            📊 Ganhos
          </button>
          
          <button
            onClick={onResetProgress}
            title="Reiniciar Semana / Novos Clientes"
            className="px-2 py-1.5 rounded-lg bg-sleek-dark text-zinc-500 hover:text-red-400 border border-sleek-border text-[10px] uppercase font-bold tracking-tighter cursor-pointer"
          >
            Reset
          </button>
        </div>

      </div>
    </header>
  );
}
