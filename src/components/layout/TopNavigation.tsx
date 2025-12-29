import { useState, useEffect } from 'react';
import { Bell, Globe, ChevronDown, Settings, LogOut, User, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { getAuthInfo } from '@/hooks/UserInfo';


const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);


const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ar', name: 'العربية' },
];

function getInitials(name?: string): string {
  if (!name) return "";

  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join("");
}


export function TopNavigation() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [hasNotifications] = useState(true);
  const navigate = useNavigate();
  const {userInfo, loading} = getAuthInfo();

  const handleLogout = async () => {
      await supabase.auth.signOut();
      navigate('/login');
  };
  

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-background border-b border-border/50">
      {/* Logo */}
      <div className="flex items-center">
        <span className="font-serif text-xl tracking-wide text-foreground">
          Aurem Private Office
        </span>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-accent rounded-sm transition-colors duration-300">
          <Bell className="w-[18px] h-[18px] text-muted-foreground" strokeWidth={1.5} />
          {hasNotifications && (
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-foreground rounded-full" />
          )}
        </button>

        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-accent rounded-sm transition-colors duration-300">
              <Globe className="w-[18px] h-[18px] text-muted-foreground" strokeWidth={1.5} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 bg-popover border border-border shadow-luxury-lg">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`cursor-pointer text-sm ${
                  selectedLanguage === lang.code ? 'bg-accent text-foreground' : 'text-muted-foreground'
                }`}
              >
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Divider */}
        <div className="h-6 w-px bg-border" />

        {/* Client & User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 hover:bg-accent px-3 py-2 rounded-sm transition-colors duration-300">
              <span className="text-sm font-medium text-foreground tracking-wide">{userInfo?.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-charcoal flex items-center justify-center">
                  <span className="text-xs font-medium text-primary-foreground">{getInitials(userInfo?.name)}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover border border-border shadow-luxury-lg">
            <div className="px-3 py-3 border-b border-border">
              <p className="text-sm font-medium text-foreground">{userInfo?.client_name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{userInfo?.email}</p>
            </div>
            <div className="py-1">
              <DropdownMenuItem className="cursor-pointer gap-3 text-sm text-muted-foreground hover:text-foreground">
                <User className="w-4 h-4" strokeWidth={1.5} />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-3 text-sm text-muted-foreground hover:text-foreground">
                <Image className="w-4 h-4" strokeWidth={1.5} />
                Change Avatar
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-3 text-sm text-muted-foreground hover:text-foreground">
                <Settings className="w-4 h-4" strokeWidth={1.5} />
                Settings
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer gap-3 text-sm text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
