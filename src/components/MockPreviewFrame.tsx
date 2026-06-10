import React, { useState } from 'react';
import { Client } from '../types';
import { Smartphone, Laptop, Globe, CheckCircle2, ShieldCheck, Mail, Phone, Instagram, MapPin } from 'lucide-react';

interface MockPreviewFrameProps {
  client: Client;
  onClose: () => void;
}

export default function MockPreviewFrame({ client, onClose }: MockPreviewFrameProps) {
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>(
    client.projectType === 'app' ? 'mobile' : 'desktop'
  );
  
  const { companyName, nicho, briefing, phone, city, instagram } = client;
  const brandColor = briefing.cores[0] || '#3b82f6';
  const brandDark = briefing.cores[1] || '#1f2937';
  const brandLight = briefing.cores[2] || '#f3f4f6';
  const estilo = briefing.estilo;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
      {/* Top Header */}
      <div className="w-full max-w-5xl bg-[#141517] border border-white/5 rounded-t-2xl p-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-[#0c0d0e] border border-white/5">
            {client.avatarEmoji}
          </div>
          <div>
            <h3 className="text-white font-black text-sm leading-tight">{companyName}</h3>
            <p className="text-slate-400 text-[11px] font-bold mt-0.5">{nicho} • {estilo}</p>
          </div>
        </div>

        {/* Viewport Toggles */}
        <div className="flex items-center space-x-1 bg-[#0c0d0e] p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setViewportMode('desktop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              viewportMode === 'desktop' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Laptop className="w-4.5 h-4.5" />
            <span>Site Simulado</span>
          </button>
          <button
            onClick={() => setViewportMode('mobile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              viewportMode === 'mobile' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4.5 h-4.5" />
            <span>App mobile</span>
          </button>
        </div>

        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-white px-4 py-2 rounded-xl bg-[#0c0d0e] hover:bg-zinc-800 border border-white/5 text-xs font-bold transition cursor-pointer shadow-md"
        >
          Fechar Prévia
        </button>
      </div>

      {/* Main Sandbox Frame */}
      <div className="w-full max-w-5xl bg-[#0c0d0e] border-x border-b border-white/5 rounded-b-2xl flex-1 max-h-[80vh] overflow-y-auto p-6 flex justify-center items-start relative">
        {/* Sleek micro-grid pattern */}
        <div className="absolute inset-0 bg-micro-grid opacity-5 pointer-events-none" />
        {viewportMode === 'desktop' ? (
          /* Desktop Browser Mockup */
          <div className="w-full bg-white text-slate-800 rounded-lg shadow-2xl overflow-hidden flex flex-col minim-h-[500px] border border-zinc-200">
            {/* Desktop Browser Toolbar */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 max-w-md mx-auto bg-white border border-slate-300 rounded text-[10px] text-slate-500 py-0.5 px-3 flex items-center space-x-1.5 justify-center">
                <Globe className="w-3 h-3 text-slate-400" />
                <span>{client.linkOrApk || `https://${companyName.toLowerCase().replace(/\s+/g, '')}.site`}</span>
              </div>
            </div>

            {/* Simulated Homepage */}
            <div className="flex-1 flex flex-col" style={{ fontFamily: briefing.fontes[0] || 'Inter' }}>
              {/* Header */}
              <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between" style={{ backgroundColor: brandLight }}>
                <div className="flex items-center space-x-2 font-bold text-lg text-slate-900">
                  <span style={{ color: brandColor }}>{client.avatarEmoji}</span>
                  <span>{companyName}</span>
                </div>
                <nav className="flex space-x-6 text-xs font-semibold text-slate-600">
                  {(briefing.secoes || ['Início', 'Serviços', 'Diferenciais', 'Contato']).map((sec, sidx) => (
                    <span key={sidx} className="cursor-pointer hover:opacity-80 transition" style={{ color: sidx === 0 ? brandColor : '' }}>
                      {sec}
                    </span>
                  ))}
                </nav>
                <button className="px-4 py-1.5 text-xs text-white font-medium rounded-full shadow-sm transition hover:brightness-110" style={{ backgroundColor: brandColor }}>
                  Falar Conosco
                </button>
              </header>

              {/* Hero Banner */}
              <section className="px-8 py-16 text-center bg-radial flex flex-col items-center justify-center border-b border-slate-50" style={{ background: `linear-gradient(135deg, ${brandLight} 0%, #ffffff 100%)` }}>
                <span className="text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full bg-opacity-15 mb-4 border" style={{ color: brandColor, borderColor: `${brandColor}44`, backgroundColor: `${brandColor}15` }}>
                  Nicho: {nicho}
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight max-w-2xl leading-tight">
                  Eleve seu conceito de <span style={{ color: brandColor }}>{nicho}</span> com inovação e conforto.
                </h1>
                <p className="mt-4 text-sm text-slate-600 max-w-xl leading-relaxed">
                  {briefing.objective} Atendimento personalizado focado no seu bem-estar completo, com as melhores soluções tecnológicas.
                </p>
                <div className="mt-8 flex items-center space-x-4">
                  <button className="px-6 py-2.5 text-xs font-semibold text-white rounded-lg shadow-md hover:brightness-110 transition" style={{ backgroundColor: brandColor }}>
                    Agende agora mesmo
                  </button>
                  <button className="px-6 py-2.5 text-xs font-semibold border rounded-lg hover:bg-slate-50 transition" style={{ borderColor: brandColor, color: brandColor }}>
                    Ver Serviços
                  </button>
                </div>
              </section>

              {/* Highlights section */}
              <section className="px-8 py-12 bg-white">
                <div className="text-center max-w-xl mx-auto mb-10">
                  <h2 className="text-xl font-bold text-slate-950">Por que escolher o {companyName}?</h2>
                  <p className="text-xs text-slate-500 mt-2">Diferenciais desenvolvidos especialmente para você.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {briefing.differentials.map((diff, idx) => (
                    <div key={idx} className="p-5 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col space-y-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${brandColor}15` }}>
                        <CheckCircle2 className="w-5 h-5" style={{ color: brandColor }} />
                      </div>
                      <h4 className="font-bold text-xs text-slate-950">{diff}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">Focado em máxima qualidade para oferecer a melhor experiência do mercado.</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Gallery mockup */}
              <section className="px-8 py-10 bg-slate-50" style={{ backgroundColor: `${brandLight}44` }}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6 text-center">FOTOS DO PROJETO COMPILADAS</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {briefing.images.map((grad, gidx) => (
                    <div key={gidx} className="aspect-video rounded-lg relative overflow-hidden shadow-sm" style={{ background: grad }}>
                      <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition duration-300 flex items-end p-2 bg-gradient-to-t from-black/50 to-transparent">
                        <span className="text-[9px] text-white font-medium">Foto {gidx + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Services Offered */}
              <section className="px-8 py-12 bg-white">
                <div className="max-w-xl mx-auto text-center mb-8">
                  <h2 className="text-xl font-bold text-slate-900">Nossos Serviços Especializados</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
                  {briefing.services.map((srv, sridx) => (
                    <div key={sridx} className="flex items-center space-x-3 p-4 rounded-lg border border-slate-100 hover:border-slate-300 transition cursor-pointer">
                      <span className="text-xl">{client.avatarEmoji}</span>
                      <div>
                        <p className="text-xs font-bold text-slate-900 leading-none">{srv}</p>
                        <p className="text-[10px] text-zinc-500 mt-1">Garantia de satisfação profissional</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Footer */}
              <footer className="mt-auto px-8 py-8 text-white flex flex-col md:flex-row items-center justify-between border-t border-slate-800" style={{ backgroundColor: brandDark }}>
                <div className="flex items-center space-x-2 font-bold mb-4 md:mb-0">
                  <span>{client.avatarEmoji}</span>
                  <span className="text-sm">{companyName}</span>
                </div>
                <div className="flex flex-col md:flex-row md:space-x-8 text-[11px] text-slate-300 space-y-2 md:space-y-0 text-center md:text-left">
                  <span className="flex items-center justify-center md:justify-start space-x-1"><Phone className="w-3.5 h-3.5 mr-1" /> {phone}</span>
                  <span className="flex items-center justify-center md:justify-start space-x-1"><Instagram className="w-3.5 h-3.5 mr-1" /> {instagram}</span>
                  <span className="flex items-center justify-center md:justify-start space-x-1"><MapPin className="w-3.5 h-3.5 mr-1" /> {city}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-4 md:mt-0">
                  © 2026. Todos os direitos reservados.
                </div>
              </footer>
            </div>
          </div>
        ) : (
          /* Mobile Smartphone Mockup */
          <div className="w-[320px] bg-slate-900 rounded-[3rem] p-3.5 border-4 border-slate-800 shadow-2xl relative overflow-hidden">
            {/* Top Ear Camera */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-10 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-zinc-800 mr-2"></div>
              <div className="w-8 h-1 rounded bg-zinc-700"></div>
            </div>

            {/* Screen Inner Container */}
            <div className="bg-white rounded-[2.5rem] overflow-hidden min-h-[520px] flex flex-col text-slate-800 select-none" style={{ fontFamily: briefing.fontes[0] || 'Inter' }}>
              {/* StatusBar Mock */}
              <div className="bg-slate-100 pt-7 px-5 pb-1 flex justify-between items-center text-[10px] font-bold text-slate-600">
                <span>15:00</span>
                <div className="flex space-x-1 items-center">
                  <span>LTE</span>
                  <div className="w-5 h-2.5 bg-slate-600 rounded-sm"></div>
                </div>
              </div>

              {/* App Navbar */}
              <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100" style={{ backgroundColor: brandLight }}>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{client.avatarEmoji}</span>
                  <span className="font-extrabold text-xs text-slate-950 tracking-tight">{companyName} App</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>

              {/* App Content */}
              <div className="flex-1 overflow-y-auto px-4 py-3 bg-slate-50 text-[11px] leading-relaxed">
                {/* Welcome Widget */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-xs mb-3">
                  <h4 className="font-extrabold text-slate-900 text-xs">Olá, seja bem-vindo!</h4>
                  <p className="text-[10px] text-slate-500 mt-1">{briefing.objective}</p>
                </div>

                {/* Primary Feature List */}
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block mb-2 px-1">Recursos Premium do App</span>
                
                <div className="space-y-2 mb-4">
                  {(briefing.features || ['Reserva 24h', 'Acompanhamento do Pedido', 'Suporte Especializado']).map((feat, fidx) => (
                    <div key={fidx} className="bg-white p-3 rounded-lg border border-slate-100 flex items-start space-x-2.5 shadow-2xs">
                      <div className="p-1 rounded-sm flex items-center justify-center shrink-0" style={{ backgroundColor: `${brandColor}15` }}>
                        <ShieldCheck className="w-4 h-4" style={{ color: brandColor }} />
                      </div>
                      <div>
                        <p className="font-bold text-[10px] text-slate-900 leading-tight">{feat}</p>
                        <p className="text-[9px] text-zinc-500 mt-0.5">Funcionalidade nativa inclusa</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dynamic Screen simulation select or mock screenshot */}
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block mb-2 px-1">Telas Desenvolvidas</span>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {(briefing.telas || ['Painel Inicial', 'Controle Financeiro', 'Área de Agendamento', 'Perfil Usuário']).map((tela, tidx) => (
                    <div key={tidx} className="bg-white p-2.5 rounded-lg border border-slate-100 text-center flex flex-col justify-center items-center">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1 bg-zinc-100">
                        📱
                      </div>
                      <p className="font-bold text-[9px] text-slate-900 truncate w-full">{tela}</p>
                      <span className="text-[8px] text-green-600 mt-0.5 font-medium">✓ Ativa</span>
                    </div>
                  ))}
                </div>

                {/* Monetization details & specs block */}
                <div className="p-3.5 rounded-xl border border-dashed border-zinc-200 mt-2 bg-zinc-50 space-y-1.5">
                  <p className="font-bold text-[10px] text-zinc-800">Infraestrutura Mobile:</p>
                  <p className="text-[9px] text-zinc-600"><strong className="text-zinc-800">Login:</strong> {briefing.login || 'E-mail, Google'}</p>
                  <p className="text-[9px] text-zinc-600"><strong className="text-zinc-800">Painel ADM:</strong> {briefing.dashboard || 'Incluso'}</p>
                  <p className="text-[9px] text-zinc-600"><strong className="text-zinc-800">Integração:</strong> {briefing.integracoes || 'Gateway e APIs'}</p>
                  <p className="text-[9px] text-zinc-600"><strong className="text-zinc-800">Monetização:</strong> {briefing.monetizacao || 'Venda direta'}</p>
                </div>
              </div>

              {/* App Tab Bar Mock */}
              <div className="mt-auto border-t border-slate-100 px-4 py-2 flex justify-around items-center bg-white">
                <div className="flex flex-col items-center cursor-pointer">
                  <span className="text-sm" style={{ color: brandColor }}>🏠</span>
                  <span className="text-[8px] font-bold" style={{ color: brandColor }}>Home</span>
                </div>
                <div className="flex flex-col items-center cursor-pointer opacity-50">
                  <span className="text-sm">⭐</span>
                  <span className="text-[8px] font-bold">Vantagens</span>
                </div>
                <div className="flex flex-col items-center cursor-pointer opacity-50">
                  <span className="text-sm">💬</span>
                  <span className="text-[8px] font-bold">Ajuda</span>
                </div>
              </div>

              {/* iPhone Home Indicator */}
              <div className="w-32 h-1 bg-slate-300 rounded-full mx-auto my-1.5 shrink-0"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
