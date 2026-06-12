import React from 'react';
import { Trophy } from 'lucide-react';

export default function TopAgencies() {
  const rivalAgencies = [
    { name: 'EliteDigital', xp: 25000 },
    { name: 'TechMasters', xp: 18000 },
    { name: 'PixelPerfect', xp: 12000 },
  ];

  return (
    <div className="bg-[#141517]/80 backdrop-blur border border-white/5 p-5 rounded-2xl shadow-lg">
      <h3 className="text-white font-black text-sm uppercase tracking-wider flex items-center space-x-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <span>Top Agências ⭐</span>
      </h3>
      <div className="space-y-3">
        {rivalAgencies.map((agency, i) => (
          <div key={i} className="flex justify-between items-center text-[11px] font-bold">
            <span className="text-slate-400">{i + 1}. {agency.name}</span>
            <span className="text-emerald-400">{agency.xp.toLocaleString()} XP</span>
          </div>
        ))}
      </div>
    </div>
  );
}
