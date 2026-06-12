import React from 'react';
import { Client } from '../types';
import { Play, RotateCcw, Send, CheckSquare, Eye, FolderOpen, Palette, Type, ShieldAlert, Layers, Hash, Copy, Check, ArrowUpToLine, ArrowDownToLine } from 'lucide-react';

interface ProjectAreaProps {
  client: Client | null;
  onStartProject: (id: string) => void;
  onSendPreview: (id: string) => void;
  onRequestAjustes: (id: string) => void;
  onFinalizeProject: (id: string) => void;
}

export default function ProjectArea({
  client,
  onStartProject,
  onSendPreview,
  onRequestAjustes,
  onFinalizeProject
}: ProjectAreaProps) {
  const [copied, setCopied] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  if (!client) {
    return (
      <div className="w-full md:w-80 bg-sleek-sidebar border-l border-sleek-border flex items-center justify-center p-6 text-slate-500 text-xs text-center select-none font-semibold">
        Nenhum projeto ativo selecionado.
      </div>
    );
  }

  const { status, briefing, companyName, nicho, city, phone, instagram, siteAtual, progress, projectType } = client;

  // Verify if they are allowed to use production buttons (status must be 'produzindo' or 'concluido')
  const isLocked = status !== 'produzindo' && status !== 'concluido';

  const handleCopyAll = () => {
    if (!client) return;
    const text = `=== INFORMAÇÕES DO CLIENTE ===
Empresa: ${companyName}
Nicho: ${nicho}
Sede: ${city}
Contato: ${phone}
Social: ${instagram}
Anterior: ${siteAtual || 'Nenhum'}

=== BRIEFING TÉCNICO ===
Objetivo: ${briefing.objective}
Público-Alvo: ${briefing.targetAudience}
Serviços: ${briefing.services.join(', ')}
Diferenciais Competitivos:
${briefing.differentials.map(d => `- ${d}`).join('\n')}

=== IDENTIDADE VISUAL & ATIVOS ===
Paleta de Cores (HEX): ${briefing.cores.join(', ')}
Fontes: ${briefing.fontes.join(' / ')}
Estilo Estético: ${briefing.estilo || 'Nenhum'}
${projectType === 'app' ? 'Módulos & Telas' : 'Estrutura de Seções'}:
${(projectType === 'app' ? briefing.telas || [] : briefing.secoes || []).map(s => `- ${s}`).join('\n')}
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleDownloadLogo = () => {
    // Generate a simple SVG for the logo based on the company's briefing colors & icon
    const svgContent = `
      <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" rx="30" fill="${briefing.cores[0]}" />
        <text x="50%" y="55%" font-size="80" text-anchor="middle" dominant-baseline="middle">${briefing.logoIcon || '🚀'}</text>
      </svg>
    `;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${companyName.replace(/\s+/g, '_')}_logo.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleScrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleScrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div 
      ref={containerRef}
      className="w-full md:w-80 bg-sleek-sidebar border-l border-sleek-border flex flex-col h-full overflow-y-auto select-none scrollbar-thin" 
      id="project_panel"
    >
      
      {/* Title Header */}
      <div className="p-4 border-b border-white/5 shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-black text-xs uppercase tracking-wider flex items-center space-x-1.5">
            <FolderOpen className="w-4.5 h-4.5 text-indigo-400" />
            <span>Painel do Projeto</span>
          </h3>
          <div className="flex items-center space-x-1.5">
            <button 
              onClick={handleScrollToTop}
              title="Rolar para o topo"
              className="p-1 px-1.5 bg-[#0c0d0e] hover:bg-zinc-800 border border-white/5 rounded-lg text-slate-400 hover:text-white transition text-[10px] font-bold flex items-center space-x-0.5 cursor-pointer"
            >
              <ArrowUpToLine className="w-3 h-3 text-indigo-400" />
              <span>Topo</span>
            </button>
            <button 
              onClick={handleScrollToBottom}
              title="Rolar para o final"
              className="p-1 px-1.5 bg-[#0c0d0e] hover:bg-zinc-800 border border-white/5 rounded-lg text-slate-400 hover:text-white transition text-[10px] font-bold flex items-center space-x-0.5 cursor-pointer"
            >
              <ArrowDownToLine className="w-3 h-3 text-indigo-400" />
              <span>Fim</span>
            </button>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 font-semibold leading-normal">
          Dados técnicos, briefing e pipeline de desenvolvimento.
        </p>

        {/* Copy All Button in controls row */}
        <button
          onClick={handleCopyAll}
          className={`w-full py-1.5 px-3 rounded-lg text-[10.5px] font-bold tracking-wide transition flex items-center justify-center space-x-2 border cursor-pointer ${
            copied 
              ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20 font-black' 
              : 'bg-[#0c0d0e] hover:bg-[#141517] text-indigo-400 hover:text-indigo-300 border-white/5'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-bounce" />
              <span className="uppercase font-black text-emerald-400">Informações Copiadas!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 shrink-0" />
              <span>Copiar Dados do Pedido / Briefing</span>
            </>
          )}
        </button>
      </div>

      {/* PIPELINE / BOTÕES DE PRODUÇÃO */}
      <div className="p-4 bg-[#0c0d0e] border-b border-white/5 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-tight text-[11px]">Progresso de Produção</span>
          <span className="text-indigo-400 font-extrabold text-[11px]">{progress}%</span>
        </div>

        {/* Small progress bar */}
        <div className="w-full h-2 bg-sleek-sidebar rounded-full overflow-hidden border border-white/5 relative">
          <div 
            className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Warning if deal is not closed */}
        {isLocked ? (
          <div className="p-3.5 bg-yellow-555/10 border border-yellow-500/20 rounded-xl text-[10px] text-yellow-500 leading-normal flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-semibold">Fechar a proposta no chat antes de liberar as ferramentas de produção de código.</span>
          </div>
        ) : (
          <div className="space-y-2 pt-1.5">
            {/* INICIAR PROJETO */}
            <button
              onClick={() => onStartProject(client.id)}
              disabled={progress >= 25}
              className={`w-full py-2 px-3 text-left rounded-lg text-xs font-bold transition flex items-center justify-between border ${
                progress < 25 
                  ? 'bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border-indigo-505/20 cursor-pointer shadow-xs' 
                  : 'bg-[#141517] text-slate-600 border-white/5 cursor-not-allowed'
              }`}
            >
              <span className="flex items-center space-x-2">
                <Play className="w-3.5 h-3.5" />
                <span>1. Iniciar Projeto</span>
              </span>
              <span className="text-[9px] font-medium bg-[#141517] px-1.5 py-0.5 rounded-md text-zinc-400 border border-white/5">Setup</span>
            </button>

            {/* ENVIAR PRÉVIA */}
            <button
              onClick={() => onSendPreview(client.id)}
              disabled={progress < 25 || progress >= 60}
              className={`w-full py-2 px-3 text-left rounded-lg text-xs font-bold transition flex items-center justify-between border ${
                progress === 25 
                  ? 'bg-amber-600/10 hover:bg-amber-600/20 text-amber-400 border-amber-500/20 cursor-pointer shadow-xs' 
                  : 'bg-[#141517] text-slate-600 border-white/5 cursor-not-allowed'
              }`}
            >
              <span className="flex items-center space-x-2">
                <Send className="w-3.5 h-3.5" />
                <span>2. Enviar Prévia</span>
              </span>
              <span className="text-[9px] font-medium bg-[#141517] px-1.5 py-0.5 rounded-md text-zinc-400 border border-white/5">Design</span>
            </button>

            {/* SOLICITAR AJUSTES */}
            <button
              onClick={() => onRequestAjustes(client.id)}
              disabled={progress < 60 || progress >= 80}
              className={`w-full py-2 px-3 text-left rounded-lg text-xs font-bold transition flex items-center justify-between border ${
                progress === 60 
                  ? 'bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 border-cyan-500/20 cursor-pointer shadow-xs' 
                  : 'bg-[#141517] text-slate-600 border-white/5 cursor-not-allowed'
              }`}
            >
              <span className="flex items-center space-x-2">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>3. Solicitar Ajustes</span>
              </span>
              <span className="text-[9px] font-medium bg-[#141517] px-1.5 py-0.5 rounded-md text-zinc-400 border border-white/5">Ajustes</span>
            </button>

            {/* SELECIONAR FINALIZAR */}
            <button
              onClick={() => onFinalizeProject(client.id)}
              disabled={progress < 60 || progress >= 100}
              className={`w-full py-2.5 px-3 rounded-lg text-xs font-black transition flex items-center justify-between border ${
                progress >= 60 && progress < 100
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-555 hover:brightness-110 text-white border-emerald-500 cursor-pointer shadow-md' 
                  : 'bg-[#141517] text-slate-600 border-white/5 cursor-not-allowed'
              }`}
            >
              <span className="flex items-center space-x-2">
                <CheckSquare className="w-4.5 h-4.5 text-white" />
                <span>4. Finalizar e Entregar</span>
              </span>
              <span className="text-[10px] font-black uppercase text-emerald-100 bg-white/20 px-2 py-0.5 rounded-md leading-none">
                {projectType === 'site' ? 'SITE' : 'APK'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* DETAIL BLOCKS */}
      <div className="p-4 space-y-5 text-left flex-1 bg-sleek-sidebar">
        
        {/* DADOS DA EMPRESA */}
        <section className="space-y-2">
          <h4 className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest border-b border-white/5 pb-1 flex justify-between">
            <span>Dados Corporativos</span>
            <span className="text-slate-600 font-mono">A001</span>
          </h4>
          <div className="text-xs space-y-1.5 font-semibold text-slate-300">
            <p><span className="text-slate-500 font-bold">Empresa:</span> {companyName}</p>
            <p><span className="text-slate-500 font-bold">Nicho:</span> {nicho}</p>
            <p><span className="text-slate-500 font-bold">Sede:</span> {city}</p>
            <p><span className="text-slate-500 font-bold">Contato:</span> {phone}</p>
            <p><span className="text-slate-500 font-bold">Social:</span> <span className="text-indigo-400 cursor-pointer hover:underline">{instagram}</span></p>
            <p className="truncate"><span className="text-slate-500 font-bold">Anterior:</span> <span className="text-slate-400">{siteAtual}</span></p>
          </div>
        </section>

        {/* DETAILS OF BRIEFING */}
        <section className="space-y-3">
          <h4 className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest border-b border-white/5 pb-1">
            Briefing Técnico
          </h4>

          <div className="space-y-2.5 text-xs text-slate-300 font-semibold leading-relaxed">
            <div>
              <p className="text-slate-500 font-bold text-[10px] uppercase">Objetivo:</p>
              <p className="text-slate-300 font-medium">{briefing.objective}</p>
            </div>
            <div>
              <p className="text-slate-500 font-bold text-[10px] uppercase">Público-Alvo:</p>
              <p className="text-slate-300 font-medium">{briefing.targetAudience}</p>
            </div>
            <div>
              <p className="text-slate-500 font-bold text-[10px] uppercase">Serviços:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {briefing.services.map((srv, idx) => (
                  <span key={idx} className="bg-[#0c0d0e] text-slate-300 px-2.5 py-0.5 rounded-xl text-[10px] border border-white/5 font-semibold">
                    {srv}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-slate-500 font-bold text-[10px] uppercase font-bold">Diferenciais Competitivos:</p>
              <ul className="list-disc list-inside text-slate-300 pl-1 space-y-0.5 mt-0.5 font-medium">
                {briefing.differentials.map((diff, idx) => (
                  <li key={idx} className="truncate">{diff}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CHROMATIC BRANDS & ART ASSETS */}
        <section className="space-y-3">
          <h4 className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest border-b border-white/5 pb-1">
            Ativos da Identidade Visual
          </h4>
          
          {/* Colors */}
          <div className="space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center space-x-1">
              <Palette className="w-3.5 h-3.5 text-slate-400 mr-1" />
              Paleta e Fontes
            </span>
            <div className="flex items-center space-x-2 pt-1">
              {briefing.cores.map((col, idx) => (
                <div 
                  key={idx}
                  title={`Clique para copiar: ${col}`}
                  onClick={() => {
                    navigator.clipboard.writeText(col);
                  }}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-white/10 hover:scale-105 transition flex items-center justify-center text-[9px] font-bold shadow-md"
                  style={{ backgroundColor: col }}
                >
                  <span className="bg-black/40 text-white px-1 py-0.5 rounded text-[8px] leading-none shrink-0 uppercase">
                    {idx + 1}
                  </span>
                </div>
              ))}
              <div className="text-left leading-none ml-2">
                <p className="text-slate-300 text-[10px] font-bold uppercase">{briefing.fontes[0]}</p>
                <p className="text-slate-500 text-[9px] mt-0.5 font-medium">{briefing.fontes[1] || 'Inter'}</p>
              </div>
            </div>
          </div>

          {/* Section details or screen outlines */}
          <div className="pt-1">
            <p className="text-slate-500 text-[10px] uppercase font-bold flex items-center space-x-1.5 mb-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>{projectType === 'app' ? 'Módulos & Telas' : 'Estrutura de Seções'}</span>
            </p>
            <div className="flex flex-wrap gap-1">
              {projectType === 'app' ? (
                (briefing.telas || []).map((tela, idx) => (
                  <span key={idx} className="bg-purple-950/20 text-purple-400 border border-purple-500/10 px-2 py-0.5 rounded-md text-[9px] font-bold">
                    📱 {tela}
                  </span>
                ))
              ) : (
                (briefing.secoes || []).map((sec, idx) => (
                  <span key={idx} className="bg-indigo-950/20 text-indigo-400 border border-indigo-500/10 px-2 py-0.5 rounded-md text-[9px] font-bold">
                    💻 {sec}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* ASSETS: LOGO & IMAGES (Simulated compiling) */}
          <div className="space-y-2 pt-2.5">
            <span className="text-slate-500 text-[10px] uppercase font-bold flex justify-between">
              Visualização do Logotipo
              <button onClick={handleDownloadLogo} className="text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer">
                <ArrowDownToLine className="w-3 h-3" />
                <span>Baixar</span>
              </button>
            </span>
            <div className="bg-[#0c0d0e] p-4 border border-white/5 rounded-xl flex items-center justify-center space-x-3 shadow-inner">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md border"
                style={{ 
                  backgroundColor: briefing.cores[0],
                  borderColor: briefing.cores[1] || '#ffffff22'
                }}
              >
                {briefing.logoIcon}
              </div>
              <div className="text-left">
                <p className="text-white text-xs font-black tracking-tight leading-none">{companyName}</p>
                <p className="text-[9px] text-zinc-500 mt-1.5 uppercase tracking-widest font-extrabold" style={{ color: briefing.cores[0] }}>LOGOTIPO VECTOR GERADO</p>
              </div>
            </div>
          </div>

          {/* Images Gallery list */}
          <div className="space-y-1.5 pt-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Mídia Compilada ({briefing.images.length} fotos)</span>
            <div className="grid grid-cols-5 gap-1.5">
              {briefing.images.map((grad, idx) => (
                <div 
                  key={idx}
                  title={`Foto ${idx+1}: Clique do projeto`}
                  className="aspect-square rounded-lg border border-white/5 hover:scale-110 transition shadow-inner cursor-pointer"
                  style={{ background: grad }}
                />
              ))}
            </div>
          </div>

        </section>

      </div>

    </div>
  );
}
