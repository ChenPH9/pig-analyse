import { ReactNode } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  unit?: string;
  change?: number;
  icon: ReactNode;
  color: string;
}

export function MetricCard({ title, value, unit, change, icon, color }: MetricCardProps) {
  const isPositive = change && change > 0;
  
  return (
    <div className="card-hover bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}20` }}>
          <div style={{ color }}>{icon}</div>
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
            isPositive ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
          }`}>
            {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-slate-400 text-sm mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white font-mono">{value}</span>
          {unit && <span className="text-slate-400">{unit}</span>}
        </div>
      </div>
    </div>
  );
}
