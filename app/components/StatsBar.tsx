'use client';

import { Lead } from '@/app/types/lead';

interface StatsBarProps {
  leads: Lead[];
}

export default function StatsBar({ leads }: StatsBarProps) {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const total = leads.length;
  const hot = leads.filter((l) => l.level === 'Hot').length;
  const warm = leads.filter((l) => l.level === 'Warm').length;
  const cold = leads.filter((l) => l.level === 'Cold').length;
  const closedThisMonth = leads.filter((l) => {
    if (l.status !== 'Closed') return false;
    const d = new Date(l.lastContact);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;

  const stats = [
    { label: 'Total Leads', value: total, color: 'text-white' },
    { label: '🔥 Hot', value: hot, color: 'text-red-400' },
    { label: '⚡ Warm', value: warm, color: 'text-yellow-400' },
    { label: '❄️ Cold', value: cold, color: 'text-blue-400' },
    { label: '✅ Closed/Month', value: closedThisMonth, color: 'text-green-400' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-zinc-800 rounded-xl p-3 border border-zinc-700 text-center"
        >
          <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          <div className="text-xs text-zinc-400 mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
