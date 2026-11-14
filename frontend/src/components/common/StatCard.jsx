import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel = 'vs last month',
  color = 'indigo'
}) {
  const iconBgClasses = {
    indigo: 'bg-indigo-50 text-indigo-600 ring-indigo-500/10',
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-500/10',
    amber: 'bg-amber-50 text-amber-600 ring-amber-500/10',
    purple: 'bg-purple-50 text-purple-600 ring-purple-500/10'
  };

  const isPositive = trend && !trend.startsWith('-');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ring-1 ${
              iconBgClasses[color] || iconBgClasses.indigo
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        {trend && (
          <div
            className={`inline-flex items-center font-semibold gap-0.5 ${
              isPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            <span>{trend}</span>
          </div>
        )}
        <span className="text-slate-400 font-normal truncate">
          {subtitle || trendLabel}
        </span>
      </div>
    </div>
  );
}
