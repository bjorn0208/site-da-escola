import React, { useState, useRef, useEffect } from 'react';
import { Client, Message } from '../types';
import { Phone, Video, MoreVertical, Send, CheckCheck, FileText, Image as ImageIcon, Sparkles, Smile, Star, ArrowRight, ClipboardCopy } from 'lucide-react';

interface ChatAreaProps {
  client: Client | null;
  onSendMessage: (text: string, type?: Message['type'], extra?: any) => void;
  onAdvanceClientStep: (action: string) => void; // State progress callback
  isTyping?: boolean;
}

export default function ChatArea({ client, onSendMessage, onAdvanceClientStep, isTyping }: ChatAreaProps) {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [client?.chatHistory]);

  if (!client) {
    return (
      <div className="flex-1 bg-[#0c0d0e] flex flex-col items-center justify-center p-8 text-center select-none relative">
        <div className="absolute inset-0 bg-micro-grid opacity-5 pointer-events-none" />
        <div className="w-16 h-16 rounded-2xl bg-[#141517] border border-white/5 flex items-center justify-center text-zinc-600 text-2xl mb-4 animate-bounce shadow-xl z-10">
          💬
        </div>
        <h3 className="text-white font-bold text-sm tracking-tight z-10">Central de Vendas e Negociações</h3>
        <p className="text-slate-400 text-xs max-w-sm mt-1.5 leading-relaxed font-semibold z-10">
          Selecione um cliente ativo no painel esquerdo para visualizar a negociação, propor desenvolvimento de sites/aplicativos e gerar briefings.
        </p>
      </div>
    );
  }

  const handleCustomSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim(), 'text');
    setInputText('');
  };

  // Contextual Quick Reply Buttons matching the status / step of the client conversa
  const renderQuickReplies = () => {
    const { step, projectType, nicho, proposalSent } = client;

    // STEP: GREETING (Initial state)
    if (step === 'greeting') {
      return (
        <div className="flex flex-col space-y-1.5 p-3.5 bg-[#0c0d0e] border-t border-white/5">
          <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide px-1">
            Qual proposta de desenvolvimento deseja inicializar?
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onAdvanceClientStep('choose_site')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg hover:shadow-indigo-500/20 flex items-center space-x-1"
            >
              <span>💻 Ofertar Criação de Site</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onAdvanceClientStep('choose_app')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg hover:shadow-purple-500/20 flex items-center space-x-1"
            >
              <span>📱 Ofertar Criação de Aplicativo (Apenas R$1200)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      );
    }

    // Site chosen, awaiting proposal
    if (step === 'waiting_choice' && projectType === 'site') {
      return (
        <div className="flex flex-col space-y-1.5 p-3.5 bg-[#0c0d0e] border-t border-white/5">
          <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide px-1">
            Enviar proposta para criar o site ({nicho})?
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onAdvanceClientStep('send_proposal_site_500')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-555 text-white font-bold text-xs rounded-xl transition-all shadow-lg hover:shadow-emerald-500/20"
            >
              💼 Enviar Proposta Completa de R$ 500
            </button>
            <button
              onClick={() => {
                onSendMessage('Pode me passar mais informações sobre as seções que você precisa?', 'text');
                setTimeout(() => {
                  onSendMessage(`Claro! Quero apresentar nossos serviços, diferenciais, informações de contato e uma galeria bem moderna da minha empresa de ${nicho}. O que me sugere de valor?`, 'text', { sender: 'client' });
                }, 1000);
              }}
              className="px-3.5 py-2 bg-[#141517] hover:bg-zinc-800 text-slate-350 hover:text-white border border-white/5 font-bold text-xs rounded-xl transition-all"
            >
              ❓ Pedir mais detalhes
            </button>
          </div>
        </div>
      );
    }

    // App chosen, ask purpose
    if (step === 'waiting_choice' && projectType === 'app') {
      const isAwaitingPurposeAnswer = client.chatHistory[client.chatHistory.length - 1]?.sender === 'agency' && client.chatHistory[client.chatHistory.length - 1]?.text.includes('finalidade');

      return (
        <div className="flex flex-col space-y-1.5 p-3.5 bg-[#0c0d0e] border-t border-white/5">
          <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide px-1">
            Avançar processo de aplicativo mobile:
          </span>
          <div className="flex flex-wrap gap-2">
            {!isAwaitingPurposeAnswer ? (
              <button
                onClick={() => onAdvanceClientStep('ask_app_purpose')}
                className="px-4 py-2 bg-[#141517] border border-white/10 hover:bg-zinc-800 text-slate-200 font-bold text-xs rounded-xl transition-all shadow-sm"
              >
                ❓ Perguntar: Qual será a finalidade principal do aplicativo?
              </button>
            ) : (
              <button
                onClick={() => onAdvanceClientStep('send_proposal_app_1200')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md"
              >
                💼 Enviar Proposta Completa de R$ 1200
              </button>
            )}
          </div>
        </div>
      );
    }

    // Proposal pending: Negotiating installment or discounts
    if (step === 'proposal_pending') {
      const lastMessageText = client.chatHistory[client.chatHistory.length - 1]?.text || '';
      const clientRequestedInstallments = lastMessageText.toLowerCase().includes('parcelar') || lastMessageText.toLowerCase().includes('condição');

      if (clientRequestedInstallments) {
        return (
          <div className="flex flex-col space-y-1.5 p-3.5 bg-[#0c0d0e] border-t border-white/5">
            <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide px-1">
              O cliente quer facilidade. Oferecer parcelamento ou desconto?
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onAdvanceClientStep('accept_installments')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md"
              >
                💳 Fechar em até 3x no Cartão de Crédito
              </button>
              <button
                onClick={() => onAdvanceClientStep('offer_cash_discount')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md"
              >
                💰 Propor Desconto de 10% à vista via PIX
              </button>
            </div>
          </div>
        );
      }

      // Default wait client response simulation button (if game gets stuck)
      return (
        <div className="flex flex-col space-y-1.5 p-3.5 bg-[#0c0d0e] border-t border-white/5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide px-1">
              Aguardando decisão... Pressione para simular resposta do cliente:
            </span>
            <button
              onClick={() => onAdvanceClientStep('simulate_client_decision')}
              className="px-3 py-1 bg-[#141517] border border-white/10 hover:bg-zinc-800 text-indigo-400 font-bold text-[10px] rounded-lg transition"
            >
              Simular Decisão
            </button>
          </div>
        </div>
      );
    }

    // Closed agreement, awaiting briefing conversion log
    if (step === 'proposal_accepted') {
      return (
        <div className="flex flex-col space-y-1.5 p-3.5 bg-[#0c0d0e] border-t border-white/5">
          <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide px-1">
            Contrato Assinado! Solicitar dados para produção
          </span>
          <div className="flex">
            <button
              onClick={() => onAdvanceClientStep('generate_briefing')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-[#4f46e5] text-white font-black text-xs rounded-xl transition-all shadow-lg hover:shadow-indigo-500/20 animate-pulse flex-1 text-center"
            >
              ⚡ Gerar & Importar Briefing Completo no Painel de Produção
            </button>
          </div>
        </div>
      );
    }

    // Client briefing provided, is currently in production
    if (step === 'briefing_provided' || step === 'in_production') {
      return (
        <div className="p-3.5 bg-[#0c0d0e] border-t border-white/5 text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-4 py-2 rounded-xl text-xs font-bold shadow-xs">
            <Sparkles className="w-4.5 h-4.5 animate-spin" />
            <span>Este projeto está em produção! Acompanhe e finalize no Painel à direita.</span>
          </div>
        </div>
      );
    }

    // Client project is completely delivered
    if (step === 'finalized') {
      return (
        <div className="p-3.5 bg-[#0c0d0e] border-t border-white/5 text-center">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-4 py-2 rounded-xl text-xs font-bold leading-none">
            <Star className="w-4.5 h-4.5 text-yellow-400" />
            <span>Projeto Concluído e Entregue! Cliente satisfeito na carteira. 🚀</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex-1 bg-[#0c0d0e] flex flex-col h-full border-r border-white/5 relative" id="chat_panel">
      {/* Chat Area Header (WhatsApp Web vibe) */}
      <div className="bg-[#141517]/80 backdrop-blur-md px-4 py-3 border-b border-white/5 flex items-center justify-between shrink-0 select-none z-10">
        <div className="flex items-center space-x-3 text-left">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-sm ${client.avatarColor}`}>
            {client.avatarEmoji}
          </div>
          <div>
            <h3 className="text-white font-bold text-xs leading-none flex items-center gap-1.5 capitalize">
              {client.name}
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
            </h3>
            <p className="text-slate-400 text-[10px] mt-1 truncate max-w-[200px] md:max-w-xs font-semibold">
              {client.companyName} • {client.phone}
            </p>
          </div>
        </div>

        {/* Action icons mockup */}
        <div className="flex items-center space-x-1.5 text-zinc-450">
          <button 
            title="Ligar (Voz)"
            onClick={() => alert(`Simulando chamada de voz para ${client.name} no telefone ${client.phone}...`)}
            className="p-2 hover:bg-white/5 rounded-lg hover:text-white transition"
          >
            <Phone className="w-4 h-4 text-slate-400" />
          </button>
          <button 
            title="Vídeo Chamada"
            onClick={() => alert(`Iniciando reunião virtual de briefing com ${client.companyName}... (XP de Alinhamento)`)}
            className="p-2 hover:bg-white/5 rounded-lg hover:text-white transition"
          >
            <Video className="w-4 h-4 text-slate-400" />
          </button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button className="p-2 hover:bg-white/5 rounded-lg hover:text-white transition">
            <MoreVertical className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Messages Canvas Grid */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#0c0d0e] relative scrollbar-none z-10">
        {/* Subtle radial microgrid pattern */}
        <div className="absolute inset-0 bg-micro-grid opacity-5 pointer-events-none" />
        
        {/* Intro Alert */}
        <div className="flex justify-center select-none relative z-10">
          <div className="bg-[#141517]/80 text-zinc-500 border border-white/5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
            Conversa iniciada hoje às 09:00
          </div>
        </div>

        {/* Chat History Rendering */}
        {client.chatHistory.map((msg) => {
          const isMe = msg.sender === 'agency';
          const isSystem = msg.sender === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center relative z-10">
                <div className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-4 py-2 rounded-xl text-[10px] font-bold max-w-sm flex items-start space-x-2">
                  <span className="text-sm shrink-0">📈</span>
                  <div className="text-left font-medium leading-relaxed">{msg.text}</div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex w-full relative z-10 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] md:max-w-md p-3.5 rounded-2xl shadow-lg relative ${
                  isMe
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-900/20'
                    : 'bg-[#141517]/80 backdrop-blur rounded-tl-none border border-white/5 text-slate-200'
                }`}
              >
                {/* Specific Layout structures depending on Message Type */}
                {msg.type === 'proposal' ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-1.5 border-b border-white/10 pb-1.5">
                      <Star className="w-4 h-4 text-emerald-300 animate-pulse text-xs shrink-0" />
                      <span className="font-extrabold text-xs uppercase tracking-tight text-emerald-300">Proposta de Negócio Enviada</span>
                    </div>
                    <p className="text-xs leading-relaxed whitespace-pre-wrap font-semibold text-white/95">{msg.text}</p>
                    <div className="bg-white/10 p-2.5 rounded-lg flex items-center justify-between border border-white/10 mt-15">
                      <div>
                        <p className="text-[10px] text-zinc-300 font-bold uppercase">Orçamento do Projeto</p>
                        <p className="text-sm font-black text-white">R$ {msg.proposalValue}</p>
                      </div>
                      <span className="text-[9px] font-black uppercase text-emerald-300 px-2 py-0.5 rounded-md bg-white/15">
                        Em análise
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Standard Text node */
                  <p className="text-xs whitespace-pre-wrap leading-relaxed font-semibold">
                    {msg.text}
                  </p>
                )}

                {/* Metadata footer */}
                <div className={`flex items-center justify-end space-x-1 mt-2 text-[8px] font-medium leading-none select-none ${isMe ? 'text-indigo-200' : 'text-slate-500'}`}>
                  <span>{msg.timestamp}</span>
                  {isMe && <CheckCheck className="w-3.5 h-3.5 text-emerald-450 shrink-0" />}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex w-full justify-start relative z-10 animate-pulse">
            <div className="bg-[#141517]/80 backdrop-blur rounded-2xl rounded-tl-none border border-white/5 p-3.5 max-w-[85%] md:max-w-md text-slate-405 text-xs font-semibold flex items-center space-x-2">
              <span className="flex space-x-1 shrink-0">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
              <span className="text-slate-450 text-[11px] font-bold">{client.name} está digitando...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Replies Context Frame */}
      {renderQuickReplies()}

      {/* Manual message input bar */}
      <form
        onSubmit={handleCustomSend}
        className="bg-[#0c0d0e] p-3 border-t border-white/5 flex items-center space-x-2 shrink-0 z-10"
      >
        <button
          type="button"
          onClick={() => alert('Anexar imagens ou logotipos não é obrigatório para avançar no simulador. Use as ações rápidas.')}
          className="p-2.5 text-slate-500 hover:text-slate-300 hover:bg-white/5 rounded-lg transition shrink-0"
          title="Anexar arquivos"
        >
          <ImageIcon className="w-4 h-4 text-slate-400" />
        </button>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Escreva sua mensagem personalizada..."
          className="flex-1 bg-[#141517] text-zinc-200 placeholder-slate-500 text-xs px-4 py-2.5 rounded-xl border border-white/5 focus:outline-none focus:border-indigo-550 transition-all font-semibold"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 bg-indigo-650 text-white rounded-xl hover:bg-indigo-500 hover:scale-105 transition disabled:opacity-45 disabled:scale-100 disabled:hover:bg-indigo-650 shrink-0 shadow-lg"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
}
