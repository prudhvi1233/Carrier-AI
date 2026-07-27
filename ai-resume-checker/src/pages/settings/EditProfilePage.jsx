import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Camera, Save, ArrowLeft, User as UserIcon, Phone, MapPin, Briefcase, GraduationCap, GitBranch, Link as LinkIcon, Loader2 } from 'lucide-react';
import { profileService } from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';
import { useGlobalState } from '../../context/GlobalStateContext';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { triggerRefresh } = useGlobalState();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    location: '', 
    current_city: '',
    country: '',
    college: '',
    degree: '',
    branch: '',
    graduation_year: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    bio: '',
    skills: '',
    profile_photo: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await profileService.getProfile();
        if (profileData) {
          setFormData({
            full_name: profileData.full_name || user?.name || '',
            phone: profileData.phone || '',
            current_city: profileData.current_city || '',
            country: profileData.country || '',
            college: profileData.college || '',
            degree: profileData.degree || '',
            branch: profileData.branch || '',
            graduation_year: profileData.graduation_year || '',
            linkedin_url: profileData.linkedin_url || '',
            github_url: profileData.github_url || '',
            portfolio_url: profileData.portfolio_url || '',
            bio: profileData.bio || '',
            skills: Array.isArray(profileData.skills) ? profileData.skills.join(', ') : (profileData.skills || ''),
            profile_photo: profileData.profile_photo || user?.avatar || ''
          });
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/profile/upload-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      });
      
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, profile_photo: data.url }));
        updateUser({ avatar: data.url });
        triggerRefresh(); 
      } else {
        console.error("Upload failed");
        alert("Failed to upload photo. Ensure it is a valid image under 10MB.");
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const dataToSubmit = { ...formData };
      if (dataToSubmit.graduation_year) {
        dataToSubmit.graduation_year = parseInt(dataToSubmit.graduation_year, 10);
      } else {
        dataToSubmit.graduation_year = null;
      }
      
      // Fix Pydantic validation errors for HttpUrls by setting empty strings to null
      ['linkedin_url', 'github_url', 'portfolio_url'].forEach(urlField => {
        if (!dataToSubmit[urlField]) {
          dataToSubmit[urlField] = null;
        }
      });
      
      await profileService.updateProfile(dataToSubmit);
      updateUser({ name: dataToSubmit.full_name });
      triggerRefresh();
      navigate('/profile');
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile. Please check your inputs.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-accent-blue" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/profile')}
          className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5"
        >
          <ArrowLeft size={20} className="text-gray-300" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
          <p className="text-gray-400 text-sm">Update your personal details and professional links</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 flex flex-col items-center text-center sticky top-28"
          >
            <div className="relative group mb-6">
              <div className="w-40 h-40 rounded-full overflow-hidden bg-secondary border-4 border-accent-blue/30 relative">
                {formData.profile_photo ? (
                  <img src={formData.profile_photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-white bg-gradient-to-br from-accent-blue to-accent-purple">
                    {formData.full_name ? formData.full_name.charAt(0) : 'J'}
                  </div>
                )}
                
                <div 
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? (
                    <Loader2 size={24} className="text-white animate-spin" />
                  ) : (
                    <>
                      <Camera size={24} className="text-white mb-2" />
                      <span className="text-xs text-white font-medium">Change Photo</span>
                    </>
                  )}
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload}
                accept="image/jpeg, image/png, image/webp" 
                className="hidden" 
              />
            </div>
            <h3 className="text-lg font-bold text-white">{formData.full_name || 'Your Name'}</h3>
            <p className="text-accent-purple text-sm mb-4">Software Professional</p>
            
            <p className="text-xs text-gray-500 max-w-[200px]">
              Recommended format: JPG or PNG. Max size: 10MB.
            </p>
          </motion.div>
        </div>

        <div className="lg:col-span-2">
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >
            
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <UserIcon size={18} className="text-accent-blue" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1 ml-1">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue transition-colors"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1 ml-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue transition-colors"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1 ml-1">City</label>
                  <input
                    type="text"
                    name="current_city"
                    value={formData.current_city}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue transition-colors"
                    placeholder="San Francisco"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1 ml-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue transition-colors"
                    placeholder="United States"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-400 mb-1 ml-1">Professional Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="3"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue transition-colors resize-none"
                    placeholder="Tell us a little bit about your career..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <GraduationCap size={18} className="text-accent-purple" />
                Education Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-400 mb-1 ml-1">College / University</label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple transition-colors"
                    placeholder="Stanford University"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1 ml-1">Degree</label>
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple transition-colors"
                    placeholder="B.S. Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1 ml-1">Graduation Year</label>
                  <input
                    type="number"
                    name="graduation_year"
                    value={formData.graduation_year}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple transition-colors"
                    placeholder="2024"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-400 mb-1 ml-1">Skills (Comma separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple transition-colors"
                    placeholder="React, Node.js, Python..."
                  />
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <LinkIcon size={18} className="text-accent-blue" />
                Professional Links
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LinkIcon size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="url"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent-blue transition-colors"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <GitBranch size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="url"
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent-blue transition-colors"
                    placeholder="https://github.com/username"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Briefcase size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="url"
                    name="portfolio_url"
                    value={formData.portfolio_url}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent-blue transition-colors"
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 mt-2">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="px-6 py-3 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-accent-blue to-accent-purple hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-accent-blue/20"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} /> Save Changes
                  </>
                )}
              </button>
            </div>

          </motion.form>
        </div>
      </div>
    </div>
  );
}
