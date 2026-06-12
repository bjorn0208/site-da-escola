import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Client } from '../types';

interface PerformanceChartProps {
  clients: Client[];
}

export default function PerformanceChart({ clients }: PerformanceChartProps) {
  const data = useMemo(() => {
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const acc: Record<string, { day: string; projects: number; revenue: number }> = days.reduce((a, d) => ({ ...a, [d]: { day: d, projects: 0, revenue: 0 } }), {});

    clients.forEach(c => {
      const day = (c.deliveredAt && days.includes(c.deliveredAt)) ? c.deliveredAt : 'Seg';
      acc[day].projects += 1;
      acc[day].revenue += (c.proposalPrice || 0);
    });

    return Object.values(acc);
  }, [clients]);

  return (
    <div className="bg-[#141517]/80 backdrop-blur border border-white/5 p-5 rounded-2xl shadow-lg h-64 print:hidden">
       <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-4 block">Performance Semanal (Velocity & Revenue)</span>
       <ResponsiveContainer width="100%" height="80%">
         <BarChart data={data}>
           <CartesianGrid strokeDasharray="3 3" stroke="#333" />
           <XAxis dataKey="day" stroke="#777" tick={{fontSize: 10}} />
           <YAxis stroke="#777" tick={{fontSize: 10}} />
           <Tooltip contentStyle={{backgroundColor: '#1c1c1c', border: 'none', fontSize: 10}} />
           <Bar dataKey="projects" fill="#6366f1" name="Projetos" />
           <Bar dataKey="revenue" fill="#10b981" name="Faturamento (R$)" />
        </BarChart>
       </ResponsiveContainer>
    </div>
  );
}
