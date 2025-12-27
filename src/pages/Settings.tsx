import { motion } from 'framer-motion';
import { User, Bell, Shield, FileText, HelpCircle } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { cn } from '@/lib/utils';

const settingsSections = [
  {
    id: 'profile',
    title: 'Profile',
    description: 'Manage your personal information and preferences',
    icon: User,
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Configure how you receive updates and alerts',
    icon: Bell,
  },
  {
    id: 'security',
    title: 'Security',
    description: 'Password, two-factor authentication, and access logs',
    icon: Shield,
  },
  {
    id: 'documents',
    title: 'Documents',
    description: 'Legal agreements and service documentation',
    icon: FileText,
  },
  {
    id: 'support',
    title: 'Support',
    description: 'Contact your dedicated brand liaison',
    icon: HelpCircle,
  },
];

export default function Settings() {
  return (
    <MainLayout>
      <div className="p-12 max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="font-serif text-4xl text-foreground tracking-tight mb-3">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your Private Office preferences
          </p>
        </motion.div>

        {/* Settings Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          {settingsSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.button
                key={section.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="w-full flex items-center gap-6 p-6 bg-card border border-border rounded-sm hover:shadow-luxury-md hover:bg-accent/20 transition-all duration-300 text-left"
              >
                <div className="p-3 bg-accent rounded-sm">
                  <Icon className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="font-medium text-foreground mb-1">
                    {section.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 pt-8 border-t border-border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide-luxury text-muted-foreground mb-1">
                Client Account
              </p>
              <p className="text-sm text-foreground">Fungisteel</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide-luxury text-muted-foreground mb-1">
                Account Status
              </p>
              <p className="text-sm text-success">Active</p>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
