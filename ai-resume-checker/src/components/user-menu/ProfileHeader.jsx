import React from 'react';
import { User, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfileHeader({ user }) {
  const calculateCompletion = (u) => {
    if (!u) return 0;
    let score = 20; // Base score
    if (u.name) score += 40;
    if (u.email) score += 30;
    if (u.avatar) score += 10;
    return score;
  };
  const completion = calculateCompletion(user);

  return (
    <div className="p-4 border-b border-border">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-accent-purple to-accent-blue p-[2px] shrink-0">
          <div className="w-full h-full bg-secondary rounded-full flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={24} className="text-muted" />
            )}
          </div>
        </div>
        
        <div className="flex flex-col overflow-hidden">
          <h4 className="text-foreground font-bold text-lg truncate">{user?.name || 'Jane Doe'}</h4>
          <p className="text-muted text-sm truncate">{user?.email || 'jane.doe@example.com'}</p>
        </div>
      </div>

      <div className="bg-overlay rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-foreground font-medium">{completion}% Profile Complete</span>
        </div>
        <div className="h-1.5 w-full bg-overlay-hover rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-accent-blue glow-blue rounded-full"
          />
        </div>
        {completion === 100 && (
          <p className="text-[10px] text-green-400 mt-2 flex items-center gap-1">
            <CheckCircle2 size={12} /> All set for applications!
          </p>
        )}
      </div>
    </div>
  );
}
