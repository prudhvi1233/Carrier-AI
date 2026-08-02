import React from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function StatusBadge({ status }) {
  const getBadgeStyle = () => {
    switch (status.toLowerCase()) {
      case 'completed':
        return {
          bg: 'bg-green-500/10',
          text: 'text-green-400',
          border: 'border-green-500/20',
          icon: <CheckCircle2 size={14} />,
        };
      case 'processing':
        return {
          bg: 'bg-yellow-500/10',
          text: 'text-yellow-400',
          border: 'border-yellow-500/20',
          icon: <Loader2 size={14} className="animate-spin" />,
        };
      case 'failed':
        return {
          bg: 'bg-red-500/10',
          text: 'text-red-400',
          border: 'border-red-500/20',
          icon: <AlertCircle size={14} />,
        };
      default:
        return {
          bg: 'bg-gray-500/10',
          text: 'text-muted',
          border: 'border-gray-500/20',
          icon: null,
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}>
      {style.icon}
      <span className="uppercase tracking-wider">{status}</span>
    </span>
  );
}
