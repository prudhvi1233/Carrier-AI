import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, User, GitBranch, Globe, Phone } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import PasswordInput from '../components/PasswordInput';
import SocialLogin from '../components/SocialLogin';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      await authService.register(email, password, fullName, phone || null);
      toast.success('Account created successfully!');
      
      const loginData = await authService.login(email, password);
      login(loginData.access_token, { email, full_name: fullName });
      
      navigate('/dashboard');
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        toast.error(detail[0].msg || 'Validation error occurred');
      } else {
        toast.error(typeof detail === 'string' ? detail : 'Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
          Create Account
        </h1>
        <p className="text-sm text-gray-400 mt-2">Join us to build a better resume with AI</p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <InputField 
          label="Full Name" 
          id="name" 
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="John Doe" 
          icon={User} 
          required 
        />
        
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

        <InputField 
          label="Phone (Optional)" 
          id="phone" 
          type="tel" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1 (555) 000-0000" 
          icon={Phone} 
        />
        
        <PasswordInput 
          label="Password" 
          id="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••" 
          showStrength={true}
          required 
        />
        
        <PasswordInput 
          label="Confirm Password" 
          id="confirmPassword" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••" 
          required 
        />

        <div className="flex items-start gap-2 text-sm mt-1">
          <div className="relative flex items-center justify-center w-4 h-4 mt-0.5 shrink-0">
            <input required type="checkbox" id="terms" className="peer appearance-none w-4 h-4 border border-white/20 rounded bg-white/5 checked:bg-accent-blue checked:border-accent-blue transition-colors cursor-pointer" />
            <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <label htmlFor="terms" className="text-gray-300 text-xs leading-relaxed cursor-pointer group-hover:text-white transition-colors">
            I agree to the{' '}
            <a href="#" className="text-accent-blue hover:text-accent-cyan transition-colors">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-accent-blue hover:text-accent-cyan transition-colors">Privacy Policy</a>
          </label>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-2 flex justify-center items-center rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold hover:shadow-lg hover:shadow-accent-blue/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Register"
          )}
        </button>
      </form>



      <p className="text-center text-sm text-gray-400 mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-accent-blue hover:text-accent-cyan font-medium transition-colors">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
