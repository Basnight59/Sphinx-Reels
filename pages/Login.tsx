import React from 'react';
import { Clapperboard, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth delay
    setTimeout(onLogin, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
            <Clapperboard className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-muted mt-2 text-center">Sign in to continue creating viral faceless reels.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Email</label>
            <input 
              type="email" 
              placeholder="creator@example.com" 
              className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-6"
          >
            Sign In <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted">
            Don't have an account? <a href="#" className="text-primary hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};