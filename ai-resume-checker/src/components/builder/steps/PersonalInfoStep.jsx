import React from 'react';

export default function PersonalInfoStep({ data, onUpdate }) {
  const handleChange = (e) => {
    onUpdate({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-white mb-2">Personal Information</h2>
        <p className="text-gray-400">Let's start with the basics. This is how employers will contact you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">First Name <span className="text-red-400">*</span></label>
          <input 
            type="text" name="firstName" value={data.firstName} onChange={handleChange}
            placeholder="e.g. Jane"
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">Last Name <span className="text-red-400">*</span></label>
          <input 
            type="text" name="lastName" value={data.lastName} onChange={handleChange}
            placeholder="e.g. Doe"
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">Email Address <span className="text-red-400">*</span></label>
          <input 
            type="email" name="email" value={data.email} onChange={handleChange}
            placeholder="jane.doe@example.com"
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">Phone Number</label>
          <input 
            type="tel" name="phone" value={data.phone} onChange={handleChange}
            placeholder="+1 (555) 123-4567"
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-300">Location (City, Country)</label>
          <input 
            type="text" name="location" value={data.location} onChange={handleChange}
            placeholder="e.g. San Francisco, CA"
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">LinkedIn URL</label>
          <input 
            type="url" name="linkedin" value={data.linkedin} onChange={handleChange}
            placeholder="linkedin.com/in/janedoe"
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">GitHub URL</label>
          <input 
            type="url" name="github" value={data.github} onChange={handleChange}
            placeholder="github.com/janedoe"
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors"
          />
        </div>
        
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-300">Portfolio / Website</label>
          <input 
            type="url" name="portfolio" value={data.portfolio} onChange={handleChange}
            placeholder="https://janedoe.com"
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
