import React from 'react';
import { STATUS_MAP } from '../../mockJobTrackerData';

export default function StatusBadge({ status }) {
  const config = STATUS_MAP[status] || STATUS_MAP['WISHLIST'];

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${config.bg} ${config.color} border ${config.border}`}>
      {config.label}
    </span>
  );
}
