import { NavLink, useLocation } from 'react-router-dom';
import { Home, Archive, Sparkles, ListChecks, FolderOpen, Settings, Briefcase, Brain, GitBranch, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const navigationItems = [
  { name: 'Private Office', href: '/', icon: Home },
  { name: 'Brand Vault', href: '/brand-vault', icon: Archive },
  { name: 'Brand Intelligence', href: '/brand-intelligence', icon: Sparkles },
  { name: 'Decisions', href: '/decisions', icon: ListChecks },
  { name: 'Assets', href: '/assets', icon: FolderOpen },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Navigation */}
      <nav className="flex-1 px-4 py-8">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-all duration-300',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                  )}
                >
                  <Icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  <span className="tracking-wide">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 w-0.5 h-6 bg-foreground rounded-r-full"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-6 py-6 border-t border-sidebar-border">
        <p className="text-2xs uppercase tracking-wide-luxury text-muted-foreground">
          Private Office
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Aurem © 2024
        </p>
      </div>
    </aside>
  );
}
