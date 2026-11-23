import React from 'react';

export default function Card({
  children,
  className = '',
  title,
  subtitle,
  action,
  headerClassName = '',
  bodyClassName = '',
  hoverEffect = false,
  ...props
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs transition-all duration-200 ${
        hoverEffect ? 'hover:shadow-md hover:border-slate-300' : ''
      } ${className}`}
      {...props}
    >
      {(title || subtitle || action) && (
        <div
          className={`flex items-start justify-between px-6 py-5 border-b border-slate-100 ${headerClassName}`}
        >
          <div>
            {title && (
              <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-0.5 text-xs text-slate-500 font-normal">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0 ml-4">{action}</div>}
        </div>
      )}
      <div className={`p-6 ${bodyClassName}`}>{children}</div>
    </div>
  );
}
