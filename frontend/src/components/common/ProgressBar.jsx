import React from 'react';

const colorThemes = {
  indigo: 'bg-indigo-600',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  gradient: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600'
};

export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  valueText,
  color = 'indigo',
  size = 'md',
  className = '',
  showLabel = true
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (label || valueText) && (
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium text-slate-700">
          <span>{label}</span>
          <span className="text-slate-500">{valueText || `${percentage}%`}</span>
        </div>
      )}
      <div
        className={`w-full bg-slate-100 rounded-full overflow-hidden ${
          heightClasses[size] || heightClasses.md
        }`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            colorThemes[color] || colorThemes.indigo
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
