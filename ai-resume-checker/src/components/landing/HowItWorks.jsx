import React from 'react';
import { motion } from 'framer-motion';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Build or Upload Resume',
      description: 'Create a beautiful ATS-friendly resume from scratch, or upload your existing one.',
    },
    {
      number: '02',
      title: 'Target Your Role',
      description: 'Paste the exact job description of the position you are aiming for.',
    },
    {
      number: '03',
      title: 'Deep AI Analysis',
      description: 'Get instant ATS scoring, keyword optimization, and actionable rewrite suggestions.',
    },
    {
      number: '04',
      title: 'Ace the Interview',
      description: 'Practice with our AI interviewer using mock questions generated directly from your resume.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-black text-foreground relative border-y border-border">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            How It Works
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative group"
            >
              {/* Connector line */}
              {idx !== steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-full h-px bg-gradient-to-r from-blue-500/50 to-transparent z-0" />
              )}
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-border flex items-center justify-center text-2xl font-bold text-foreground mb-6 group-hover:scale-110 transition-transform">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
