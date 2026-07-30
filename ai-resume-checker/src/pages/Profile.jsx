import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Brain, CheckCircle, Edit2, Lock, Upload, Download, User as UserIcon, Calendar, Phone, MapPin } from 'lucide-react';
import ProfileCard from '../components/ProfileCard';
import SkillBadge from '../components/SkillBadge';
import ActivityTimeline from '../components/ActivityTimeline';
import StatCard from '../components/StatCard';
import { profileService } from '../services/profileService';
import { dashboardService } from '../services/dashboardService';
import { useGlobalState } from '../context/GlobalStateContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { refreshTrigger } = useGlobalState();
  const [profile, setProfile] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileData, dashData] = await Promise.all([
          profileService.getProfile(),
          dashboardService.getDashboard()
        ]);
        setProfile(profileData);
        setDashboardData(dashData);
      } catch (error) {
        console.error('Failed to fetch profile data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [refreshTrigger]);

  const profileStats = [
    { title: 'Total Analyses', value: dashboardData?.total_uploaded_resumes || '0', icon: Target, delay: 0 },
    { title: 'Avg Score', value: dashboardData?.average_score ? `${Math.round(dashboardData.average_score)}%` : 'N/A', icon: Brain, delay: 0.1 },
    { title: 'Recent Score', value: dashboardData?.latest_analysis?.ats_score ? `${Math.round(dashboardData.latest_analysis.ats_score)}%` : 'N/A', icon: CheckCircle, delay: 0.2 },
  ];

  let skills = [];
  if (profile?.skills) {
    if (typeof profile.skills === 'string') {
      skills = profile.skills.split(',').map(s => s.trim()).filter(Boolean);
    } else if (Array.isArray(profile.skills)) {
      skills = profile.skills;
    }
  }

  const profileActions = [
    { name: 'Edit Profile', icon: Edit2, color: 'from-accent-blue to-accent-purple', path: '/profile/edit' },
    { name: 'Change Password', icon: Lock, color: 'from-gray-600 to-gray-400', path: '/settings' },
    { name: 'Upload New Resume', icon: Upload, color: 'from-accent-purple to-pink-500', path: '/upload' },
    { name: 'Download Resume', icon: Download, color: 'from-cyan-500 to-blue-500', path: '/history' },
  ];

  const accountInfo = [
    { label: 'Username', value: user?.name ? `@${user.name.toLowerCase().replace(' ', '')}` : '@user', icon: UserIcon },
    { label: 'Email', value: user?.email || '', icon: Calendar },
    { label: 'Mobile Number', value: profile?.phone || 'Not provided', icon: Phone },
    { label: 'Location', value: profile?.location || 'Not provided', icon: MapPin },
    { label: 'Account Created', value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A', icon: Calendar },
    { label: 'Last Login', value: 'Recently', icon: Calendar },
  ];

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="flex flex-col gap-8 w-full mx-auto">
      
      <ProfileCard profile={profile} />

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
        {/* Profile Actions */}
        <div className="md:col-span-1 lg:col-span-1 flex flex-col gap-3 self-start sticky top-6">
          {profileActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <motion.button 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                onClick={() => action.path && navigate(action.path)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group w-full text-left"
              >
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg shrink-0`}>
                  <Icon size={16} className="text-white" />
                </div>
                <span className="font-medium text-sm text-gray-200 group-hover:text-white transition-colors">{action.name}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Stats & Account Info */}
        <div className="md:col-span-2 lg:col-span-4 flex flex-col gap-6">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {profileStats.map((stat, idx) => (
              <StatCard key={idx} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-6">Account Information</h3>
              <div className="flex flex-col gap-5">
                {accountInfo.map((info, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <span className="text-gray-400 text-sm">{info.label}</span>
                    <span className="text-white font-medium text-sm text-right">{info.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Skills & Timeline */}
            <div className="flex flex-col gap-6">
              
              {/* Skills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <SkillBadge key={idx} name={skill} delay={0.5 + idx * 0.05} />
                  ))}
                </div>
              </motion.div>

              {/* Timeline */}
              <ActivityTimeline />
              
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
