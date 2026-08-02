import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-xl border-b border-border py-4 shadow-[0_4px_30px_rgba(0,0,0,0.1)]' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-border group-hover:border-purple-500/50 transition-colors">
            <Brain className="w-6 h-6 text-purple-400 group-hover:text-blue-400 transition-colors" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">CareerAI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Link 
            to="/login"
            className="text-sm font-medium text-muted hover:text-foreground transition-colors px-4 py-2"
          >
            Log In
          </Link>
          <Link 
            to="/signup"
            className="relative px-5 py-2 text-sm font-medium text-foreground rounded-xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10">Get Started</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 text-muted hover:text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-border flex flex-col p-6 gap-4 shadow-2xl"
        >
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-lg font-medium text-muted hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="h-px bg-overlay-hover my-2" />
          <Link 
            to="/login"
            className="text-lg font-medium text-muted hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Log In
          </Link>
          <Link 
            to="/signup"
            className="mt-2 text-center py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-medium text-foreground shadow-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get Started Free
          </Link>
        </motion.div>
      )}
    </header>
  );
}
