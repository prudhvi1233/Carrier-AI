import React from 'react';
import { Link } from 'react-router-dom';

export default function DropdownItem({ icon: Icon, label, onClick, to, color = 'text-muted', hoverColor = 'text-foreground' }) {
  const content = (
    <>
      <Icon size={18} className={`transition-colors group-hover:${hoverColor}`} />
      <span className="font-medium text-sm">{label}</span>
    </>
  );

  const className = `flex items-center gap-3 w-full px-4 py-2.5 transition-colors group ${color} hover:bg-overlay hover:${hoverColor}`;

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  );
}
