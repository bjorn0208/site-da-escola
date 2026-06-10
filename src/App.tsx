import React, { useState, useEffect } from 'react';
import { Client, GameState, Message } from './types';
import { generateWeeklyClients } from './data/mockClients';
import WeeklyGoal, { getXpProgress } from './components/WeeklyGoal';
import LeftSidebar from './components/LeftSidebar';
import ChatArea from './components/ChatArea';
import ProjectArea from './components/ProjectArea';
import Dashboard from './components/Dashboard';
import DeliverPreviewModal from './components/DeliverPreviewModal';
import MockPreviewFrame from './components/MockPreviewFrame';
import { Sparkles, Star, Trophy, CheckCircle2, ShieldClose, Volume2, X } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'agencia_simulator_pro_save_v10_gemini';

export default function App() {
  // Initialize state from local storage or generate fresh weekly content
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure standard keys exist
        if (parsed.clients && parsed.clients.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing save', e);
      }
    }
    return {
      clients: generateWeeklyClients(),
      currentClientId: 'client-1',
      totalXp: 0,
      level: 1,
      activeTab: 'simulator'
    };
  });

  // State handles for interactive modals
  const [deliveringClient, setDeliveringClient] = useState<Client | null>(null);
  const [popupPreviewClient, setPopupPreviewClient] = useState<Client | null>(null);
  const [levelUpMessage, setLevelUpMessage] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Auto-persist changes to state
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  // Recalculates levels based on total accumulated XP points
  const checkLevelUp = (additionalXp: number, currentXp: number): { nextLevel: number; leveledUp: boolean } => {
    const newXp = currentXp + additionalXp;
    const brackets = [0, 150, 400, 800, 1500, 3000, 6000, 12000, 24000];
    let calculatedLvl = 1;
    for (let i = 0; i < brackets.length; i++) {
      if (newXp >= brackets[i]) {
        calculatedLvl = i + 1;
      } else {
        break;
      }
    }
    
    return {
      nextLevel: calculatedLvl,
      leveledUp: calculatedLvl > gameState.level
    };
  };

  // Safe wrapper helper to reward XP points
  const rewardXp = (amount: number, customMessage?: string) => {
    setGameState(prev => {
      const { nextLevel, leveledUp } = checkLevelUp(amount, prev.totalXp);
      const updatedXp = prev.totalXp + amount;
      
      if (leveledUp) {
        setLevelUpMessage(`🎉 PARABÉNS! Você subiu para o Nível ${nextLevel}!\nSeus negócios estão prosperando no mercado!`);
        // Web audio context beep alternative
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscNode = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          oscNode.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          oscNode.type = 'sine';
          oscNode.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
          oscNode.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
          oscNode.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.3); // G5
          oscNode.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.45); // C6
          gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
          oscNode.start();
          oscNode.stop(audioCtx.currentTime + 0.6);
        } catch (e) {}
      }

      return {
        ...prev,
        totalXp: updatedXp,
        level: nextLevel
      };
    });
  };

  // Callback to reset progress (button trigger)
  const handleResetProgress = () => {
    const confirm = window.confirm('Deseja reiniciar a semana corrente? Seus XP acumulados e Nível serão mantidos, mas novos clientes serão gerados!');
    if (!confirm) return;
    
    setGameState(prev => ({
      ...prev,
      clients: generateWeeklyClients(),
      currentClientId: 'client-1',
      activeTab: 'simulator'
    }));
    rewardXp(10);
  };

  // Selecting active client from sidebar list
  const handleSelectClient = (id: string) => {
    setGameState(prev => ({
      ...prev,
      currentClientId: id
    }));
  };

  // Client Gemini Auto-Response Service
  const fetchClientGeminiResponse = async (clientToFetch: Client, userMessageText: string) => {
    setIsTyping(true);
    const timestamp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: {
            id: clientToFetch.id,
            name: clientToFetch.name,
            companyName: clientToFetch.companyName,
            nicho: clientToFetch.nicho,
            projectType: clientToFetch.projectType,
            step: clientToFetch.step,
            proposalPrice: clientToFetch.proposalPrice
          },
          history: clientToFetch.chatHistory,
          userMsg: userMessageText
        })
      });

      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }

      const data = await response.json();
      const replyText = data.reply || "Gostei muito, vamos continuar agilizando esse projeto.";
      const decision = data.decision || "nenhuma";

      const replyMessage: Message = {
        id: `msg-gemini-${Date.now()}`,
        sender: 'client',
        text: replyText,
        timestamp,
        type: 'text'
      };

      setGameState(prev => {
        const updatedClients = prev.clients.map(c => {
          if (c.id === clientToFetch.id) {
            let updatedC = { ...c };
            updatedC.chatHistory = [...c.chatHistory, replyMessage];

            if (decision === 'escolheu_site') {
              updatedC.projectType = 'site';
              updatedC.step = 'waiting_choice';
            } else if (decision === 'escolheu_app') {
              updatedC.projectType = 'app';
              updatedC.step = 'waiting_choice';
            } else if (decision === 'pedido_parcelamento' || decision === 'pedido_desconto') {
              updatedC.step = 'proposal_pending';
            } else if (decision === 'proposta_aceita') {
              updatedC.step = 'proposal_accepted';
            } else if (decision === 'briefing_enviado') {
              updatedC.status = 'produzindo';
              updatedC.step = 'briefing_provided';
              updatedC.progress = 10;
              if (data.suggestedBriefing) {
                updatedC.briefing = {
                  ...updatedC.briefing,
                  objective: data.suggestedBriefing.objective || updatedC.briefing.objective,
                  targetAudience: data.suggestedBriefing.targetAudience || updatedC.briefing.targetAudience,
                  services: data.suggestedBriefing.services || updatedC.briefing.services,
                  differentials: data.suggestedBriefing.differentials || updatedC.briefing.differentials,
                  cores: data.suggestedBriefing.cores || updatedC.briefing.cores,
                  fontes: data.suggestedBriefing.fontes || updatedC.briefing.fontes,
                  estilo: data.suggestedBriefing.estilo || updatedC.briefing.estilo,
                  secoes: data.suggestedBriefing.secoes || updatedC.briefing.secoes || [],
                  features: data.suggestedBriefing.features || updatedC.briefing.features || []
                };
              }

              updatedC.chatHistory = [
                ...updatedC.chatHistory,
                {
                  id: `deploy-sys-briefing-${Date.now()}`,
                  sender: 'system',
                  text: `💼 Briefing fornecido de modo inteligente pelo cliente via IA Gemini! Dados de produção atualizados com sucesso no painel lateral.`,
                  timestamp
                }
              ];
            }

            return updatedC;
          }
          return c;
        });

        // Also track updated current select client values
        return {
          ...prev,
          clients: updatedClients
        };
      });

    } catch (err) {
      console.error("Failed to fetch client response:", err);
      const fallbackMsg: Message = {
        id: `msg-fallback-${Date.now()}`,
        sender: 'client',
        text: "Muito interessante! Me fale mais sobre os próximos passos do projeto.",
        timestamp,
        type: 'text'
      };
      setGameState(prev => ({
        ...prev,
        clients: prev.clients.map(c => c.id === clientToFetch.id ? { ...c, chatHistory: [...c.chatHistory, fallbackMsg] } : c)
      }));
    } finally {
      setIsTyping(false);
    }
  };

  // Send communication bubble
  const handleSendMessage = (text: string, type: Message['type'] = 'text', extraReplyInfo: any = null) => {
    if (!gameState.currentClientId) return;

    const timestamp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: extraReplyInfo?.sender || 'agency',
      text,
      timestamp,
      type,
      proposalValue: extraReplyInfo?.proposalValue
    };

    let updatedClientForGemini: Client | null = null;
    const targetClientId = gameState.currentClientId;

    setGameState(prev => {
      const updatedClients = prev.clients.map(client => {
        if (client.id === targetClientId) {
          const updated = {
            ...client,
            chatHistory: [...client.chatHistory, newMessage]
          };
          updatedClientForGemini = updated;
          return updated;
        }
        return client;
      });

      return {
        ...prev,
        clients: updatedClients
      };
    });

    if (newMessage.sender === 'agency' || type === 'proposal') {
      rewardXp(10); // Reward active user reply with 10XP
      setTimeout(() => {
        if (updatedClientForGemini) {
          fetchClientGeminiResponse(updatedClientForGemini, text);
        }
      }, 50);
    }
  };

  // Comprehensive state transition automation for quick reply buttons
  const handleAdvanceClientStep = (action: string) => {
    const currentClient = gameState.clients.find(c => c.id === gameState.currentClientId);
    if (!currentClient) return;

    // 1. CHOOSE WORK TYPE: SITE
    if (action === 'choose_site') {
      setGameState(prev => ({
        ...prev,
        clients: prev.clients.map(c => c.id === prev.currentClientId ? { ...c, projectType: 'site', step: 'waiting_choice' } : c)
      }));
      handleSendMessage('Proponho desenvolvermos um site completo de alta performance para a sua empresa.', 'text');
      rewardXp(15);
    }

    // 2. CHOOSE WORK TYPE: APP
    else if (action === 'choose_app') {
      setGameState(prev => ({
        ...prev,
        clients: prev.clients.map(c => c.id === prev.currentClientId ? { ...c, projectType: 'app', step: 'waiting_choice' } : c)
      }));
      handleSendMessage('Acho excelente a ideia de criarmos um aplicativo mobile exclusivo p/ sua marca.', 'text');
      rewardXp(15);
    }

    // 3. ASK FOR APP FUNCTIONALITY / PURPOSE
    else if (action === 'ask_app_purpose') {
      handleSendMessage('Entendido! Para planejarmos da melhor forma, qual será a finalidade principal do seu aplicativo?', 'text');
      rewardXp(15);
    }

    // 4. SEND PROPOSAL: SITE (R$ 500)
    else if (action === 'send_proposal_site_500') {
      const proposalText = `Posso desenvolver seu site completo com entrega expressa em até 24 horas.\n\nInclui:\n✓ Landing Page completa e customizada\n✓ Domínio profissional (.com.br) incluso\n✓ Hospedagem em nuvem rápida inclusa\n✓ Versão responsiva adaptável mobile/tablet\n✓ Estrutura de SEO básico para Google\n✓ Painel de administração simplificado\n\nValor total: R$ 500`;
      
      setGameState(prev => ({
        ...prev,
        clients: prev.clients.map(c => c.id === prev.currentClientId ? { ...c, proposalSent: true, proposalPrice: 500, step: 'proposal_pending' } : c)
      }));
      handleSendMessage(proposalText, 'proposal', { proposalValue: 500 });
      rewardXp(25);
    }

    // 5. SEND PROPOSAL: APP (R$ 1200)
    else if (action === 'send_proposal_app_1200') {
      const proposalText = `Consigo desenvolver seu aplicativo mobile completo pronto p/ publicação nas lojas em até 48 horas.\n\nInclui:\n✓ Arquivo compilado (APK instalador Android)\n✓ Banco de dados integrado de segurança\n✓ Sistema de login social integrado\n✓ Push Notifications ilimitadas\n✓ Código limpo de alta performance\n\nValor total: R$ 1.200`;
      
      setGameState(prev => ({
        ...prev,
        clients: prev.clients.map(c => c.id === prev.currentClientId ? { ...c, proposalSent: true, proposalPrice: 1200, step: 'proposal_pending' } : c)
      }));
      handleSendMessage(proposalText, 'proposal', { proposalValue: 1200 });
      rewardXp(25);
    }

    // 6. ACCEPT INSTALLMENTS
    else if (action === 'accept_installments') {
      const price = currentClient.proposalPrice || 500;
      handleSendMessage(`Sem problemas! Conseguimos parcelar esse valor em até 3x sem juros de R$ ${Math.round(price / 3)} no cartão de crédito.`, 'text');
      rewardXp(20);
    }

    // 7. OFFER CASH DISCOUNT (10%)
    else if (action === 'offer_cash_discount') {
      const price = currentClient.proposalPrice || 500;
      const discounted = Math.round(price * 0.9);
      handleSendMessage(`Para fecharmos agora via PIX à vista, consigo te dar um excelente desconto de 10%, ficando por apenas R$ ${discounted}!`, 'text');
      rewardXp(20);
    }

    // 8. FORCE SIMULATE CLIENT RESPONSE
    else if (action === 'simulate_client_decision') {
      setGameState(prev => ({
        ...prev,
        clients: prev.clients.map(c => c.id === prev.currentClientId ? { ...c, step: 'proposal_accepted' } : c)
      }));
      handleSendMessage('Está combinado! Decidi fechar o projeto com vocês, o preço está justo. Qual o próximo passo?', 'text', { sender: 'client' });
      rewardXp(15);
    }

    // 9. CONVERT TO BRIEFING - START PRODUCTION STATUS
    else if (action === 'generate_briefing') {
      setGameState(prev => ({
        ...prev,
        clients: prev.clients.map(c => c.id === prev.currentClientId ? { 
          ...c, 
          status: 'produzindo', 
          step: 'briefing_provided',
          progress: 10
        } : c)
      }));
      handleSendMessage('Excelente! Vou registrar os dados do seu briefing com prioridade no nosso painel de produção. Iniciando desenvolvimento!', 'text');
      rewardXp(40);
    }
  };

  // PRODUCTION PIPELINE MANAGEMENT CONTROLLERS
  // Milestone 1: Start (progress = 25%)
  const handleStartProject = (id: string) => {
    setGameState(prev => ({
      ...prev,
      clients: prev.clients.map(c => c.id === id ? { 
        ...c, 
        progress: 25, 
        step: 'in_production',
        chatHistory: [...c.chatHistory, {
          id: `setup-done-${Date.now()}`,
          sender: 'system',
          text: '🔧 Setup inicial de software concluído! Repositório Git instanciado, hospedagem em nuvem configurada e esqueleto visual pronto.',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }]
      } : c)
    }));
    rewardXp(15);
  };

  // Milestone 2: Send Preview (progress = 60%)
  const handleSendPreview = (id: string) => {
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    setGameState(prev => ({
      ...prev,
      clients: prev.clients.map(c => c.id === id ? { 
        ...c, 
        progress: 60,
        chatHistory: [...c.chatHistory, 
          {
            id: `p-prev-${Date.now()}`,
            sender: 'agency',
            text: 'Olá! Concluímos a prévia de design e usabilidade do seu projeto. Você pode acompanhar no seu painel lateral!',
            timestamp: time
          }
        ]
      } : c)
    }));

    // Client answers nicely after 1.5 seconds
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        clients: prev.clients.map(c => c.id === id ? {
          ...c,
          chatHistory: [...c.chatHistory, 
            {
              id: `p-prev-resp-${Date.now()}`,
              sender: 'client',
              text: 'Nossa, que visual incrível! Gostei muito da combinação de cores e da distribuição de seções. Está ficando melhor do que eu imaginava! Só gostaria de calibrar uns pequenos textos se puder, mas o grosso está perfeito.',
              timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            }
          ]
        } : c)
      }));
    }, 1500);

    rewardXp(25);
  };

  // Milestone 3: Request Adjustments (progress = 80%)
  const handleRequestAjustes = (id: string) => {
    setGameState(prev => ({
      ...prev,
      clients: prev.clients.map(c => c.id === id ? { 
        ...c, 
        progress: 80,
        chatHistory: [...c.chatHistory, {
          id: `ajustes-${Date.now()}`,
          sender: 'system',
          text: '🔄 Pequenos ajustes e refinamentos de tipografia solicitados pelo cliente foram revisados e concluídos na build! Progresso geral em 80%.',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }]
      } : c)
    }));
    rewardXp(15);
  };

  // Milestone 4: Trigger Finalize Modal
  const handleFinalizeProject = (id: string) => {
    const target = gameState.clients.find(c => c.id === id);
    if (target) {
      setDeliveringClient(target);
    }
  };

  // Confirms the modal delivery, logs final success alerts
  const handleConfirmDelivery = (urlOrApkValue: string) => {
    if (!deliveringClient) return;
    const cid = deliveringClient.id;
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    setGameState(prev => ({
      ...prev,
      clients: prev.clients.map(c => c.id === cid ? {
        ...c,
        status: 'concluido',
        step: 'finalized',
        progress: 100,
        linkOrApk: urlOrApkValue,
        deliveredAt: 'Hoje',
        chatHistory: [
          ...c.chatHistory,
          {
            id: `deploy-agency-${Date.now()}`,
            sender: 'agency',
            text: `Tenho o grande prazer de informar que seu projeto foi finalizado com sucesso e já está publicado em produção!\n\nLink de Acesso: ${urlOrApkValue}\n\nMuito obrigado pela confiança!`,
            timestamp: time
          },
          {
            id: `deploy-client-${Date.now()}`,
            sender: 'client',
            text: 'Sensacional!! Muito obrigado à equipe da agência pelo profissionalismo e velocidade. O resultado ficou simplesmente incrível! Já enviei para nossos parceiros e todos elogiaram. Recomendo de olhos fechados!',
            timestamp: time
          },
          {
            id: `deploy-sys-${Date.now()}`,
            sender: 'system',
            text: `🎯 PARABÉNS! Projeto para ${c.companyName} finalizado e publicado! Valor de R$ ${c.proposalPrice} creditado no faturamento e +100 XP adicionados à sua conta.`,
            timestamp: time
          }
        ]
      } : c)
    }));

    // Close modal, activate success trigger triggers
    setDeliveringClient(null);
    rewardXp(100);

    // Beep sound alternative again for completion
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscNode = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscNode.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscNode.type = 'triangle';
      oscNode.frequency.setValueAtTime(523.25, audioCtx.currentTime); 
      oscNode.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); 
      oscNode.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); 
      oscNode.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.3); 
      oscNode.frequency.setValueAtTime(1318.51, audioCtx.currentTime + 0.4); 
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      oscNode.start();
      oscNode.stop(audioCtx.currentTime + 0.5);
    } catch (e) {}
  };

  const currentSelectClient = gameState.clients.find(c => c.id === gameState.currentClientId) || null;

  return (
    <div className="h-screen bg-[#0c0d0e] font-sans flex flex-col overflow-hidden text-slate-100">
      
      {/* Top Meta Goal Header Bar */}
      <WeeklyGoal 
        gameState={gameState} 
        onChangeTab={(tab) => setGameState(prev => ({ ...prev, activeTab: tab }))}
        onResetProgress={handleResetProgress}
      />

      {/* Main Body viewports toggled between simulator (CRM) and portfolio showcases */}
      <main className="flex-1 overflow-hidden flex relative">
        
        {gameState.activeTab === 'simulator' ? (
          /* Active agency simulator screen split in 3 blocks */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left sidebar listing contacts */}
            <LeftSidebar 
              clients={gameState.clients}
              currentClientId={gameState.currentClientId}
              onSelectClient={handleSelectClient}
            />

            {/* Middle active chat logs */}
            <ChatArea 
              client={currentSelectClient}
              onSendMessage={handleSendMessage}
              onAdvanceClientStep={handleAdvanceClientStep}
              isTyping={isTyping}
            />

            {/* Right project metadata board */}
            <ProjectArea 
              client={currentSelectClient}
              onStartProject={handleStartProject}
              onSendPreview={handleSendPreview}
              onRequestAjustes={handleRequestAjustes}
              onFinalizeProject={handleFinalizeProject}
            />
          </div>
        ) : (
          /* Separate deliveries Dashboard screen block */
          <Dashboard 
            gameState={gameState} 
            onOpenPreview={(client) => setPopupPreviewClient(client)}
            onResetProgress={handleResetProgress}
          />
        )}

      </main>

      {/* MODAL 1: FINAL DELIVER PROMPT INPUT */}
      {deliveringClient && (
        <DeliverPreviewModal 
          client={deliveringClient}
          onConfirm={handleConfirmDelivery}
          onClose={() => setDeliveringClient(null)}
        />
      )}

      {/* MODAL 2: INTERACTIVE DYNAMIC MOCKUP PREVIEW FRAME */}
      {popupPreviewClient && (
        <MockPreviewFrame 
          client={popupPreviewClient}
          onClose={() => setPopupPreviewClient(null)}
        />
      )}

      {/* PORTAL 3: EXPERIENCE LEVEL UP CONGRATULATIONS */}
      {levelUpMessage && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141517] border border-white/10 rounded-2xl p-6 max-w-sm text-center space-y-4 shadow-2xl relative select-none animate-bounce">
            <button 
              onClick={() => setLevelUpMessage(null)}
              className="absolute top-2.5 right-2.5 text-zinc-500 hover:text-white p-1 rounded-full hover:bg-zinc-850 cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
            <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 via-amber-500 to-indigo-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-md">
              👑
            </div>
            <h3 className="text-white font-black text-lg uppercase tracking-tight">Carreira Evoluiu!</h3>
            <p className="text-slate-350 text-xs font-bold leading-relaxed whitespace-pre-wrap">{levelUpMessage}</p>
            <button
              onClick={() => setLevelUpMessage(null)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 font-bold rounded-xl text-xs text-white shadow-md transition cursor-pointer"
            >
              Excelente, continuar trabalhando!
            </button>
          </div>
        </div>
      )}

      {/* PORTAL 4: WELCOME ONBOARDING */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#141517] border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-6 text-left space-y-5 animate-fadeIn select-none">
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-lg font-black block">
                🚀
              </div>
              <div>
                <h3 className="text-white font-black text-sm uppercase tracking-tight">Agência Simulator Pro</h3>
                <p className="text-slate-500 text-[10px] font-bold">SIMULADOR COMPLETO DE PROJETOS E SEÇÕES</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-slate-400 leading-relaxed font-semibold">
              <p>
                Bem-vindo ao cockpit da sua própria agência digital! Sua missão nesta semana é atender o chat dos clientes, negociar propostas, gerar briefings e produzir as entregas para atingir <strong className="text-emerald-400">100% da meta semanal</strong>!
              </p>
              
              <div className="space-y-2 bg-[#0c0d0e] p-3.5 rounded-2xl border border-white/5">
                <p className="text-slate-200 font-bold flex items-center text-[11px] uppercase tracking-wide"><Star className="w-4.5 h-4.5 text-yellow-400 mr-2" /> Como Jogar:</p>
                <ul className="list-disc list-inside pl-1 space-y-1 text-[11px] text-slate-400">
                  <li>Selecione clientes marcados como <span className="text-yellow-400">Orçamento 🟡</span> à esquerda.</li>
                  <li>Siga o fluxo e envie propostas de valor clicando nos botões.</li>
                  <li>Após o aceite, clique em <strong className="text-indigo-400">Gerar Briefing</strong> para liberar as etapas de produção.</li>
                  <li>Avance a produção por etapas (Design, Ajustes) e clique em <strong className="text-emerald-400">Finalizar</strong> para registrar o site/APK e faturar o capital!</li>
                </ul>
              </div>

              <p className="text-[11px] text-slate-500">
                Ganhos de XP elevam sua agência de freelancer para elite bilionária. Divirta-se!
              </p>
            </div>

            <button
              onClick={() => setShowWelcome(false)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl text-xs transition shadow-md cursor-pointer"
            >
              Iniciar Agência de Sucesso
            </button>
            
          </div>
        </div>
      )}

    </div>
  );
}
