
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/authService';
import { ShieldCheck, Lock, User } from 'lucide-react';

interface AdminLoginPageProps {
  onLogin: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (AuthService.login(username, password)) {
      onLogin();
      navigate('/admin/products/fish');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full border-t-4 border-deepSea">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full text-deepSea mb-2">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold text-deepSea">Owner Login</h2>
          <p className="text-gray-500 text-sm">Restricted Access</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4 text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border pl-10 p-2 rounded focus:ring-2 focus:ring-deepSea outline-none" 
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border pl-10 p-2 rounded focus:ring-2 focus:ring-deepSea outline-none" 
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-deepSea hover:bg-blue-800 text-white font-bold py-2 rounded transition-colors mt-2"
          >
            Access Dashboard
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-gray-400">
          Mvs_Aqua Secure Admin System
        </div>
      </div>
    </div>
  );
};
