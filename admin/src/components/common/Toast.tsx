import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export const Toast: React.FC = () => {
  const { toast } = useAdmin();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
    info: <Info className="w-4 h-4 text-sky-500 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-white text-emerald-950',
    error: 'border-rose-200 bg-white text-rose-950',
    warning: 'border-amber-200 bg-white text-amber-950',
    info: 'border-sky-200 bg-white text-sky-950',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-200">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl ${
          borders[toast.type]
        } max-w-sm`}
      >
        {icons[toast.type]}
        <p className="text-xs font-semibold text-slate-800 leading-snug">{toast.message}</p>
      </div>
    </div>
  );
};
