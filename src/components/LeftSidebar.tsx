import React, { useState } from 'react';
import { Client } from '../types';
import { Search, CircleAlert, Users, FolderCheck, BadgeAlert, Sparkles, Filter } from 'lucide-react';

interface LeftSidebarProps {
  clients: Client[];
  currentClientId: string | null;
  onSelectClient: (id: string) => void;
}

type FilterType = 'todos' | 'aguardando' | 'negociando' | 'produzindo' | 'concluido';

export default function LeftSidebar({ clients, currentClientId, onSelectClient }: LeftSidebarProps) {
  const [filter, setFilter] = useState<FilterType>('todos');
  const [search, setSearch] = useState('');

  // Count metrics
  const totalCount = clients.length;
  const completedCount = clients.filter(c => c.status === 'concluido').length;
  const pendingCount = totalCount - completedCount;

  // Filter clients
  const filteredClients = clients.filter(client => {
    const matchesFilter = filter === 'todos' || client.status === filter;
    const searchString = `${client.name} ${client.companyName} ${client.nicho}`.toLowerCase();
    const matchesSearch = searchString.includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusDetails = (status: Client['status']) => {
    switch (status) {
      case 'aguardando':
        return { label: 'Aguardando orçamento', iconColor: 'bg-yellow-500 shadow-yellow-500/20 text-yellow-500', bgBadge: 'bg-yellow-400/10 text-yellow-400 border-yellow-500/20' };
      case 'negociando':
        return { label: 'Em negociação', iconColor: 'bg-blue-500 shadow-blue-500/20 text-blue-500', bgBadge: 'bg-blue-400/10 text-blue-400 border-blue-500/20' };
      case 'produzindo':
        return { label: 'Em produção', iconColor: 'bg-orange-500 shadow-orange-500/20 text-orange-500', bgBadge: 'bg-orange-400/10 text-orange-400 border-orange-500/20' };
      case 'concluido':
        return { label: 'Concluído', iconColor: 'bg-green-500 shadow-green-500/20 text-green-500', bgBadge: 'bg-emerald-400/10 text-emerald-400 border-emerald-500/20' };
    }
  };

  return (
    <div className="w-full md:w-80 bg-sleek-sidebar border-r border-sleek-border flex flex-col h-full shrink-0 select-none">
      
      {/* Search Header */}
      <div className="p-3 border-b border-sleek-border space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar contato ou nicho..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-sleek-dark text-zinc-200 placeholder-zinc-500 text-xs pl-9 pr-4 py-2 rounded-lg border border-sleek-border focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
          />
        </div>
      </div>

      {/* Week overview card */}
      <div className="p-3.5 bg-sleek-dark border-b border-sleek-border">
        <h4 className="text-[10px] text-slate-500 font-extrabold tracking-wider uppercase mb-2 flex items-center justify-between">
          <span>Resumo de Atendimento</span>
          <span className="text-[9px] text-indigo-400 font-semibold lowercase">Semana 1</span>
        </h4>
        <div className="grid grid-cols-3 gap-2">
          
          <div className="bg-[#141517] p-2 rounded-lg border border-sleek-border flex flex-col items-center">
            <span className="text-sm font-black text-white">{totalCount}</span>
            <span className="text-[9px] text-slate-400 font-semibold tracking-tight uppercase">Clientes</span>
          </div>
          
          <div className="bg-[#141517] p-2 rounded-lg border border-sleek-border flex flex-col items-center">
            <span className="text-sm font-black text-amber-400">{pendingCount}</span>
            <span className="text-[9px] text-slate-400 font-semibold tracking-tight uppercase">Pendentes</span>
          </div>

          <div className="bg-[#141517] p-2 rounded-lg border border-sleek-border flex flex-col items-center">
            <span className="text-sm font-black text-emerald-400">{completedCount}</span>
            <span className="text-[9px] text-slate-400 font-semibold tracking-tight uppercase">Entregues</span>
          </div>

        </div>
      </div>

      {/* Mini Filter Buttons Scroll */}
      <div className="px-3 py-2 border-b border-sleek-border flex items-center overflow-x-auto whitespace-nowrap gap-1.5 scrollbar-none">
        <button
          onClick={() => setFilter('todos')}
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
            filter === 'todos' 
              ? 'bg-zinc-100 text-zinc-950 font-black' 
              : 'bg-sleek-dark text-slate-400 hover:text-white border border-sleek-border'
          }`}
        >
          Todos ({totalCount})
        </button>
        <button
          onClick={() => setFilter('aguardando')}
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all flex items-center space-x-1 ${
            filter === 'aguardando' 
              ? 'bg-yellow-500 text-yellow-950 font-black' 
              : 'bg-sleek-dark text-slate-400 hover:text-yellow-400 border border-sleek-border'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
          <span>Orçamento</span>
        </button>
        <button
          onClick={() => setFilter('negociando')}
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all flex items-center space-x-1 ${
            filter === 'negociando' 
              ? 'bg-indigo-600 text-white font-black shadow-md shadow-indigo-600/20' 
              : 'bg-sleek-dark text-slate-400 hover:text-indigo-400 border border-sleek-border'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          <span>Negócio</span>
        </button>
        <button
          onClick={() => setFilter('produzindo')}
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all flex items-center space-x-1 ${
            filter === 'produzindo' 
              ? 'bg-orange-500 text-orange-950 font-black' 
              : 'bg-sleek-dark text-slate-400 hover:text-orange-400 border border-sleek-border'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
          <span>Obras</span>
        </button>
        <button
          onClick={() => setFilter('concluido')}
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all flex items-center space-x-1 ${
            filter === 'concluido' 
              ? 'bg-green-500 text-green-950 font-black' 
              : 'bg-sleek-dark text-slate-400 hover:text-green-400 border border-sleek-border'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          <span>OK</span>
        </button>
      </div>

      {/* List Container */}
      <div className="flex-1 overflow-y-auto divide-y divide-sleek-border p-2 space-y-1">
        {filteredClients.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 flex flex-col items-center justify-center space-y-2">
            <Search className="w-8 h-8 text-zinc-650 mb-1" />
            <p className="text-xs font-bold">Nenhum cliente encontrado</p>
            <p className="text-[10px] text-zinc-600">Altere o filtro de busca ao lado.</p>
          </div>
        ) : (
          filteredClients.map((client) => {
            const { iconColor, label, bgBadge } = getStatusDetails(client.status);
            const isSelected = currentClientId === client.id;
            const lastMsg = client.chatHistory[client.chatHistory.length - 1];

            return (
              <div
                key={client.id}
                onClick={() => onSelectClient(client.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center space-x-3 text-left relative ${
                  isSelected 
                    ? 'bg-indigo-600/10 border border-indigo-500/30' 
                    : 'bg-transparent border border-transparent hover:bg-white/5'
                }`}
              >
                {/* Colored Avatar frame */}
                <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-xs font-bold shadow-md relative ${client.avatarColor}`}>
                  <span>{client.avatarEmoji}</span>
                  {/* Glowing Status Dot on Avatar corner */}
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-sleek-sidebar flex items-center justify-center ${iconColor}`}>
                    <span className="w-1.2 h-1.2 rounded-full bg-white opacity-80" />
                  </span>
                </div>

                {/* Info Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold truncate leading-tight ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                      {client.name}
                    </span>
                    <span className="text-[9px] text-slate-500 shrink-0 font-semibold">
                      {lastMsg ? lastMsg.timestamp : '09:00'}
                    </span>
                  </div>

                  <p className="text-slate-400 font-semibold text-[11px] truncate mt-0.5">
                    {client.companyName}
                  </p>

                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-slate-500 truncate font-semibold">
                      {client.nicho}
                    </span>
                    <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-md tracking-tight border ${bgBadge}`}>
                      {client.status === 'aguardando' ? 'Orçamento' : 
                       client.status === 'negociando' ? 'Negociação' :
                       client.status === 'produzindo' ? 'Produzindo' : 'Entregue'}
                    </span>
                  </div>
                </div>

                {/* Unread dot simulation */}
                {client.status === 'aguardando' && (
                  <div className="absolute right-3.5 top-1/2 transform -translate-y-1/2 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
