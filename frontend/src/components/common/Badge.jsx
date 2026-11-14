import React from 'react';

const variantStyles = {
  brand: 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
  amber: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
  warning: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
  rose: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20',
  danger: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20',
  slate: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20',
  violet: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/20'
};

const sizeStyles = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
  lg: 'text-sm px-3 py-1.5'
};

export default function Badge({
  children,
  variant = 'brand',
  size = 'md',
  dot = false,
  className = ''
}) {
  const chosenVariant = variantStyles[variant] || variantStyles.brand;
  const chosenSize = sizeStyles[size] || sizeStyles.md;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-xs ${chosenVariant} ${chosenSize} ${className}`}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      )}
      {children}
    </span>
  );
}
