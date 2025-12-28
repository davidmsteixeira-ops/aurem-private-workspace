import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Bell, Globe, ChevronDown, Settings, LogOut, User } from 'lucide-react';

const TopNavigation = () => {
  const [clientName, setClientName] = useState<string>('Loading...');
  const [userName, setUserName] = useState<string>('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      // 1. Pega o usuário logado
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // 2. Busca o nome do cliente e do usuário na tabela 'profiles' + 'clients'
        // Assumindo que você seguiu a estrutura de tabelas que sugeri anteriormente
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            full_name,
            clients ( name )
          `)
          .eq('id', user.id)
          .single();

        if (data) {
          setClientName(data.clients?.name || 'Private Office');
          setUserName(data.full_name || user.email?.split('@')[0]);
        }
      }
    };

    getProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="h-20 border-b border-neutral-100 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-50">
      {/* Left: Wordmark */}
      <div className="flex items-center">
        <span className="text-sm tracking-[0.3em] uppercase font-sans text-neutral-900 font-medium">
          Aurem Private Office
        </span>
      </div>

      {/* Right: Client & User Controls */}
      <div className="flex items-center gap-8">
        {/* Action Icons */}
        <div className="flex items-center gap-5 pr-5 border-r border-neutral-100">
          <button className="text-neutral-400 hover:text-black transition-colors duration-300">
            <Bell size={18} strokeWidth={1.5} />
          </button>
          
          <div className="flex items-center gap-2 group cursor-pointer text-neutral-400 hover:text-black transition-colors">
            <Globe size={18} strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-widest font-sans">EN</span>
          </div>
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-4 group focus:outline-none"
          >
            <div className="text-right hidden sm:block">
              <p className="text-[11px] uppercase tracking-[0.2em] font-sans text-neutral-400 leading-none mb-1">
                Client
              </p>
              <p className="text-sm font-serif text-neutral-900 leading-none">
                {clientName}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-400 group-hover:border-neutral-300 transition-all duration-300 overflow-hidden">
                <User size={20} strokeWidth={1.2} />
              </div>
              <ChevronDown size={14} className={`text-neutral-300 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {/* Luxury Dropdown Menu */}
          {isProfileOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
              <div className="absolute right-0 mt-4 w-56 bg-white border border-neutral-100 shadow-xl py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="px-4 py-3 border-b border-neutral-50">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Authenticated as</p>
                  <p className="text-xs font-sans text-neutral-900 font-medium truncate">{userName}</p>
                </div>
                
                <button className="w-full flex items-center gap-3 px-4 py-3 text-xs text-neutral-600 hover:bg-neutral-50 transition-colors group">
                  <Settings size={14} className="text-neutral-400 group-hover:text-black" />
                  Office Settings
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs text-red-400 hover:bg-red-50/30 transition-colors group"
                >
                  <LogOut size={14} className="text-red-300 group-hover:text-red-500" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation;