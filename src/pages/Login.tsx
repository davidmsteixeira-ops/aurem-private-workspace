import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Welcome to Aurem Private Office");
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || "Access denied. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-6 selection:bg-black selection:text-white">
      {/* Wordmark Superior */}
      <div className="mb-16 animate-fade-in">
        <h2 className="text-sm tracking-[0.3em] uppercase font-sans text-neutral-400 font-light">
          Aurem Private Office
        </h2>
      </div>

      <div className="w-full max-w-[400px] space-y-12">
        {/* Header da Seção */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-serif text-neutral-900 tracking-tight">
            Private Access
          </h1>
          <p className="text-neutral-500 font-sans font-light leading-relaxed">
            Welcome back. Please enter your credentials to access the <span className="text-black font-medium italic">Fungisteel</span> workspace.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-6">
            <div className="group relative">
              <label className="text-[10px] uppercase tracking-widest text-neutral-400 mb-2 block ml-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-neutral-200 py-3 px-1 font-sans focus:outline-none focus:border-black transition-colors duration-500 placeholder:text-neutral-300"
                  placeholder="name@company.com"
                  required
                />
                <Mail className="absolute right-2 top-3 w-4 h-4 text-neutral-300 group-focus-within:text-black transition-colors" />
              </div>
            </div>

            <div className="group relative">
              <label className="text-[10px] uppercase tracking-widest text-neutral-400 mb-2 block ml-1">
                Security Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-neutral-200 py-3 px-1 font-sans focus:outline-none focus:border-black transition-colors duration-500 placeholder:text-neutral-300"
                  placeholder="••••••••"
                  required
                />
                <Lock className="absolute right-2 top-3 w-4 h-4 text-neutral-300 group-focus-within:text-black transition-colors" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full group flex items-center justify-between bg-black text-white px-8 py-4 hover:bg-neutral-800 transition-all duration-300 disabled:opacity-50"
          >
            <span className="font-sans tracking-widest text-xs uppercase">
              {isLoading ? 'Verifying...' : 'Enter Private Office'}
            </span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Footer */}
        <div className="pt-12 text-center">
          <p className="text-[11px] text-neutral-400 font-sans tracking-wide uppercase">
            Invitation-only portal • Encrypted Connection
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;