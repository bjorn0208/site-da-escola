import React, { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';
import { Difficulty } from '../types';

interface SpecialistTipProps {
  difficulty: Difficulty;
}

const TIPS = {
  easy: [
    "Dica: Foque em sites rápidos para sites simples, o cliente valoriza velocidade!",
    "Dica: Projete sites com cores contrastantes para melhor acessibilidade.",
    "Dica: Manter comunicação clara aumenta muito a chance de aceite."
  ],
  medium: [
    "Dica: Ofereça diferenciais como SEO básico para aumentar o valor do projeto.",
    "Dica: Apps exigem atenção à experiência de usuário, foque no fluxo da tela principal.",
    "Dica: Briefings detalhados evitam retrabalho desnecessário."
  ],
  hard: [
    "Dica: Propostas focadas em ROI conquistam clientes corporativos.",
    "Dica: Monitore métricas de conversão e sugira melhorias proativas.",
    "Dica: Tecnologias modernas impressionam, mas a solução do problema é o que conta."
  ]
};

export default function SpecialistTip({ difficulty }: SpecialistTipProps) {
  const [tip, setTip] = useState('');

  useEffect(() => {
    const key = (difficulty && TIPS[difficulty]) ? difficulty : 'medium';
    const list = TIPS[key];
    if (list && list.length > 0) {
      setTip(list[Math.floor(Math.random() * list.length)]);
    }
  }, [difficulty]);

  return (
    <div className="absolute top-2 left-2 z-20 p-2 bg-indigo-950/80 border border-indigo-500/50 rounded-lg text-[10px] text-indigo-100 flex items-center space-x-2 animate-fadeIn max-w-[200px]">
      <Lightbulb className="w-3 h-3 text-yellow-400 shrink-0" />
      <span>{tip}</span>
    </div>
  );
}
