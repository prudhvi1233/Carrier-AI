import React from 'react';
import { motion } from 'framer-motion';
import UploadCard from '../components/upload/UploadCard';
import TipsCard from '../components/upload/TipsCard';
import SecurityCard from '../components/upload/SecurityCard';
import RecentUploads from '../components/upload/RecentUploads';

export default function UploadPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-12">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3"
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
          Resume Upload
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl">
          Upload your resume and let AI analyze its ATS compatibility, skills, formatting, and improvement opportunities.
        </p>
      </motion.div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Upload Area */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <UploadCard />
        </div>

        {/* Right Column: Information & Security */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <TipsCard />
          <SecurityCard />
        </div>
      </div>

      {/* Bottom Section: Recent Uploads */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-4"
      >
        <RecentUploads />
      </motion.div>
    </div>
  );
}
