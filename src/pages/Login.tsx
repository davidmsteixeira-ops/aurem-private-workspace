import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Shield, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [showMfa, setShowMfa] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Passo 1: Login com Email e Senha
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Verificar se o utilizador precisa de MFA (aal2)
      const { data: mfaLevels, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      
      if (mfaError) throw mfaError;

      if (mfaLevels.nextLevel === 'aal2') {
        setShowMfa(true);
        toast.info("Security verification required");
      } else {
        toast.success("Welcome to Aurem Private Office");
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || "Access denied. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // Passo 2: Verificação do Código MFA
  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Obter os fatores de autenticação do utilizador
      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
      if (factorsError) throw factorsError;

      const totpFactor = factors.totp.find(f => f.status === 'verified');
      if (!totpFactor) throw new Error("No verified MFA factor found.");

      // 2. Criar o desafio (Challenge)
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: totpFactor.id
      });
      if (challengeError) throw challengeError;

      // 3. Verificar o código (Verify)
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challenge.id,
        code: mfaCode
      });

      if (verifyError) throw verifyError;

      toast.success("Identity verified");
      navigate('/');
    } catch (error: any) {
      toast.error("Invalid verification code. Please try again.");
      setMfaCode('');
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
        {!showMfa ? (
          // Interface de Login Normal
          <>
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-serif text-neutral-900 tracking-tight">
                Private Access
              </h1>
              <p className="text-neutral-500 font-sans font-light leading-relaxed">
                Welcome back. Please enter your credentials to access the <span className="text-black font-medium italic">Fungisteel</span> workspace.
              </p>
            </div>

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
          </>
        ) : (
          // Interface de Verificação MFA
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4 mb-10">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-neutral-50 rounded-full">
                  <Shield className="w-8 h-8 text-black stroke-[1.2]" />
                </div>
              </div>
              <h1 className="text-3xl font-serif text-neutral-900 tracking-tight">
                Verify Identity
              </h1>
              <p className="text-neutral-500 font-sans font-light text-sm">
                Enter the 6-digit code from your authenticator app to complete the secure login.
              </p>
            </div>

            <form onSubmit={handleMfaVerify} className="space-y-8">
              <div className="group relative">
                <label className="text-[10px] uppercase tracking-widest text-neutral-400 mb-4 block text-center">
                  Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                  className="w-full bg-transparent border-b border-neutral-200 py-4 text-center text-4xl font-mono tracking-[0.5em] focus:outline-none focus:border-black transition-colors duration-500 placeholder:text-neutral-100"
                  placeholder="000000"
                  required
                />
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={isLoading || mfaCode.length !== 6}
                  className="w-full flex items-center justify-center bg-black text-white px-8 py-4 hover:bg-neutral-800 transition-all duration-300 disabled:opacity-30"
                >
                  <span className="font-sans tracking-widest text-xs uppercase">
                    {isLoading ? 'Confirming...' : 'Verify Access'}
                  </span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowMfa(false)}
                  className="w-full flex items-center justify-center gap-2 text-neutral-400 hover:text-black transition-colors py-2 text-[10px] uppercase tracking-widest"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Back to credentials
                </button>
              </div>
            </form>
          </div>
        )}

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