import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import Threads from '../Threads';
import SpecularButton from '../ui/SpecularButton';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-black text-foreground">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 bg-black" />
      <div className="absolute inset-0 z-0 opacity-60 mix-blend-screen pointer-events-none">
        <Threads
          amplitude={1}
          distance={0}
          enableMouseInteraction={true}
          color={[1, 1, 1]} 
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        
        {/* Pill Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-border mb-8 mx-auto"
        >
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-muted">Powered by advanced AI models</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8"
        >
          Your Ultimate All-in-One <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 animate-gradient-x">
            CareerAI Platform
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          From deep ATS resume analysis and intelligent keyword optimization to AI-driven mock interviews and personal career coaching, CareerAI gives you the edge to land your dream job.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <SpecularButton
            onClick={() => navigate('/signup')}
            size="lg"
            radius={18}
            tint="#2563eb"
            tintOpacity={0.2}
            blur={10}
            textColor="#ffffff"
            lineColor="#60a5fa"
            baseColor="#1e3a8a"
            intensity={1.2}
            shineSize={12}
            shineFade={45}
            thickness={1.5}
            speed={0.4}
            followMouse
            autoAnimate
            className="w-full sm:w-auto font-semibold shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:shadow-[0_0_60px_rgba(37,99,235,0.5)]"
          >
            <span className="flex items-center gap-2">
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </span>
          </SpecularButton>

          <a 
            href="#how-it-works"
            className="px-8 py-4 w-full sm:w-auto rounded-2xl font-semibold text-foreground border border-border hover:bg-overlay transition-colors flex items-center justify-center"
          >
            Learn More
          </a>
        </motion.div>
      </div>

    </section>
  );
}
