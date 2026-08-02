import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
      toast.success('Reset link sent if email exists');
    } catch (err) {
      toast.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {!submitted ? (
        <>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-foreground mt-4">Reset Password</h2>
            <p className="text-sm text-muted mt-2">Enter your email and we'll send you a reset link.</p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <InputField 
              label="Email" 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" 
              icon={Mail} 
              required 
            />

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 flex items-center justify-center rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-foreground font-semibold hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Check your email</h2>
          <p className="text-muted mb-8">
            We've sent a password reset link to <span className="text-foreground">{email}</span>. 
            Please check your terminal console since we are in dev mode!
          </p>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors">
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
}
