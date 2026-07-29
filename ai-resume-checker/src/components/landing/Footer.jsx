import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, MessageCircle, GitBranch, Briefcase } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <Brain className="w-6 h-6 text-purple-400" />
            <span className="font-bold text-lg text-white">CareerAI</span>
          </Link>
          <p className="text-gray-400 text-sm max-w-sm">
            Empowering professionals to land their dream jobs with intelligent AI tools.
          </p>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-semibold text-white">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Resume Analysis</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Keyword Optimization</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Mock Interviews</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Resume Builder</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-white">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-white">Connect</h4>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
              <MessageCircle className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
              <Briefcase className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
              <GitBranch className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
      
      <div className="mt-16 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} CareerAI. All rights reserved.</p>
      </div>
    </footer>
  );
}
