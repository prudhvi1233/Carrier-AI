import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { AuthProvider } from './context/AuthContext';
import { GlobalStateProvider } from './context/GlobalStateContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import ResumeChecker from './pages/ResumeChecker';
import LandingPage from './pages/LandingPage';
import Profile from './pages/Profile';
import EditProfilePage from './pages/settings/EditProfilePage';
import Contact from './pages/Contact';
import UploadPage from './pages/UploadPage';
import AnalysisPage from './pages/AnalysisPage';
import HistoryPage from './pages/HistoryPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import ResumeWizardPage from './pages/ResumeWizardPage';
import AIEditorWorkspace from './pages/AIEditorWorkspace';
import JobMatchPage from './pages/JobMatchPage';
import CareerAssistantPage from './pages/CareerAssistantPage';
import JobRecommendationsPage from './pages/JobRecommendationsPage';
import JobTrackerPage from './pages/JobTrackerPage';
import InterviewMentorPage from './pages/InterviewMentorPage';
import HelpSupportPage from './pages/HelpSupportPage';
import AdminSupportPage from './pages/AdminSupportPage';

function App() {
  return (
    <AuthProvider>
      <GlobalStateProvider>
        <Router>
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#111928',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/contact" element={<Contact />} />
          
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/checker" element={<ResumeChecker />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/resume-builder" element={<ResumeBuilderPage />} />
            <Route path="/resume-builder/create" element={<ResumeWizardPage />} />
            <Route path="/resume-builder/ai-editor" element={<AIEditorWorkspace />} />
            <Route path="/analysis/:id" element={<AnalysisPage />} />
            <Route path="/job-match" element={<JobMatchPage />} />
            <Route path="/job-recommendations" element={<JobRecommendationsPage />} />
            <Route path="/job-tracker" element={<JobTrackerPage />} />
            <Route path="/interview-mentor" element={<InterviewMentorPage />} />
            <Route path="/career-assistant" element={<CareerAssistantPage />} />
            <Route path="/support" element={<HelpSupportPage />} />
            <Route path="/admin/support" element={<AdminSupportPage />} />
          </Route>
        </Routes>
      </Router>
      </GlobalStateProvider>
    </AuthProvider>
  );
}

export default App;
