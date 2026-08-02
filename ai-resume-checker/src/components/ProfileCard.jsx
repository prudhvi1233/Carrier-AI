import React from 'react';
import { Mail, Phone, GraduationCap, MapPin, Link, GitBranch, Award, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function ProfileCard({ profile }) {
  const { user } = useAuth();

  const details = [
    { icon: Mail, label: 'Email', value: user?.email || '' },
    { icon: Phone, label: 'Phone', value: profile?.phone || 'Not provided' },
    { icon: GraduationCap, label: 'Education', value: profile?.education || 'Not provided' },
    { icon: MapPin, label: 'Location', value: profile?.location || 'Not provided' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card overflow-hidden"
    >
      {/* Banner */}
      <div className="h-32 bg-gradient-to-r from-accent-blue/30 via-accent-purple/30 to-accent-blue/30 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="px-6 pb-6 flex flex-col sm:flex-row gap-6">
        {/* Avatar */}
        <div className="relative -mt-16 shrink-0 z-10">
          <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple p-1 shadow-2xl shadow-accent-purple/30">
            <div className="w-full h-full bg-secondary rounded-xl flex items-center justify-center overflow-hidden">
              {profile?.profile_photo || user?.avatar ? (
                <img src={profile?.profile_photo || user?.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-foreground">
                  {user?.name ? user.name.charAt(0) : 'J'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 pt-4 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              {user?.name || 'Jane Doe'}
              <Award size={20} className="text-accent-blue" />
            </h2>
            <p className="text-accent-purple font-medium mt-1">Software Engineer</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mt-4">
              {details.map((detail, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-muted">
                  <detail.icon size={16} className="text-gray-500" />
                  <span>{detail.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col gap-4 min-w-[120px]">
            <div className="flex items-center gap-3">
              <a href={profile?.linkedin_url || '#'} target="_blank" rel="noopener noreferrer" className="p-2 bg-overlay rounded-lg text-muted hover:text-foreground hover:bg-[#0077b5] transition-colors border border-border hover:border-transparent">
                <Link size={20} />
              </a>
              <a href={profile?.github_url || '#'} target="_blank" rel="noopener noreferrer" className="p-2 bg-overlay rounded-lg text-muted hover:text-foreground hover:bg-[#333] transition-colors border border-border hover:border-transparent">
                <GitBranch size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
