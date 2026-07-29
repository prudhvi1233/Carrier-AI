import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import PasswordInput from '../components/PasswordInput';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  // Redirect if no token is found in the URL
  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.resetPassword(token, password);
      
      // Auto-login user if backend returned token
      if (response.access_token && response.user) {
        login(response.access_token, response.user);
        toast.success('Password successfully reset! You have been logged in.');
        navigate('/dashboard');
      } else {
        toast.success('Password successfully reset! You can now log in.');
        navigate('/login');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to reset password. The token may be expired or invalid.';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'An error occurred');
      setError(typeof errorMessage === 'string' ? errorMessage : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mt-4">New Password</h2>
        <p className="text-sm text-gray-400 mt-2">Enter your new password below.</p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <PasswordInput 
          label="New Password" 
          id="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••" 
          required 
        />

        <PasswordInput 
          label="Confirm New Password" 
          id="confirmPassword" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••" 
          required 
        />

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-2 flex items-center justify-center rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
}
