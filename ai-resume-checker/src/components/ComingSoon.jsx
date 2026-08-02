import React from 'react';
import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';

export default function ComingSoon({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
      >
        <Construction size={40} className="text-accent-blue" />
      </motion.div>
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-foreground mb-4"
      >
        {title || 'Coming Soon'}
      </motion.h1>
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-muted text-lg max-w-lg"
      >
        {description || 'We are currently building this feature. It will be powered by real backend APIs soon.'}
      </motion.p>
    </div>
  );
}
