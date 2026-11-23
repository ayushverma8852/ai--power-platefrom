import React from 'react';

const variantClasses = {
  primary:
    'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 focus-visible:ring-indigo-500 border border-transparent',
  secondary:
    'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs focus-visible:ring-indigo-500',
  outline:
    'bg-transparent hover:bg-indigo-50 text-indigo-600 border border-indigo-200 focus-visible:ring-indigo-500',
  ghost:
    'bg-transparent hover:bg-slate-100 text-slate-600 focus-visible:ring-slate-400 border border-transparent',
  danger:
    'bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-200 focus-visible:ring-rose-500 border border-transparent',
  success:
    'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200 focus-visible:ring-emerald-500 border border-transparent'
};

const sizeClasses = {
  sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
  md: 'text-sm px-4 py-2 rounded-xl gap-2',
  lg: 'text-base px-5 py-2.5 rounded-xl gap-2.5 font-semibold'
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99] ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
      {IconRight && !loading && <IconRight className="w-4 h-4 shrink-0" />}
    </button>
  );
}
