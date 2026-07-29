import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, GitBranch, Globe } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import PasswordInput from '../components/PasswordInput';
import SocialLogin from '../components/SocialLogin';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      // The context handles fetching user details properly with getMe now
      login(data.access_token, { email });
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
          AI Resume Checker
        </h1>
        <h2 className="text-xl font-semibold text-white mt-4">Welcome back</h2>
        <p className="text-sm text-gray-400 mt-2">Log in to continue optimizing your resume</p>
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
        
        <PasswordInput 
          label="Password" 
          id="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••" 
          required 
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center justify-center w-4 h-4">
              <input type="checkbox" className="peer appearance-none w-4 h-4 border border-white/20 rounded bg-white/5 checked:bg-accent-blue checked:border-accent-blue transition-colors cursor-pointer" />
              <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span className="text-gray-300 group-hover:text-white transition-colors">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-accent-blue hover:text-accent-cyan transition-colors">
            Forgot Password?
          </Link>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-2 flex items-center justify-center rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold hover:shadow-lg hover:shadow-accent-blue/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <div className="relative flex items-center justify-center mt-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative px-4 bg-transparent backdrop-blur-xl">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Or continue with</span>
        </div>
      </div>

      <div className="flex gap-4">
        <SocialLogin provider="Google" icon={Globe} onClick={() => {}} />
        <SocialLogin provider="GitHub" icon={GitBranch} onClick={() => {}} />
      </div>

      <p className="text-center text-sm text-gray-400 mt-4">
        Don't have an account?{' '}
        <Link to="/signup" className="text-accent-blue hover:text-accent-cyan font-medium transition-colors">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
