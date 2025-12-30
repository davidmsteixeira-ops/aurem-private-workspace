import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const notificationGroups = [
  {
    title: 'Brand Updates',
    description: 'Stay informed about changes to your brand assets and documentation',
    notifications: [
      {
        id: 'vault-updates',
        label: 'Brand Vault Updates',
        description: 'When documents or assets are added or modified',
        defaultChecked: true,
      },
      {
        id: 'decision-updates',
        label: 'Decision Notifications',
        description: 'When new strategic decisions require your attention',
        defaultChecked: true,
      },
      {
        id: 'asset-uploads',
        label: 'Asset Uploads',
        description: 'When new files are added to your asset library',
        defaultChecked: false,
      },
    ],
  },
  {
    title: 'Intelligence Reports',
    description: 'Periodic insights and analysis from Brand Intelligence',
    notifications: [
      {
        id: 'weekly-summary',
        label: 'Weekly Summary',
        description: 'A digest of brand activity and insights each week',
        defaultChecked: true,
      },
      {
        id: 'monthly-report',
        label: 'Monthly Report',
        description: 'Comprehensive monthly brand health report',
        defaultChecked: true,
      },
      {
        id: 'real-time-alerts',
        label: 'Real-time Alerts',
        description: 'Immediate notifications for critical brand matters',
        defaultChecked: false,
      },
    ],
  },
  {
    title: 'Communication Preferences',
    description: 'How you prefer to receive notifications',
    notifications: [
      {
        id: 'email-notifications',
        label: 'Email Notifications',
        description: 'Receive updates via email',
        defaultChecked: true,
      },
      {
        id: 'in-app-notifications',
        label: 'In-App Notifications',
        description: 'Show notifications within the Private Office',
        defaultChecked: true,
      },
    ],
  },
];

export default function NotificationsSettings() {
  return (
    <MainLayout>
      <div className="p-12 max-w-2xl">
        {/* Back Link */}
        <Link
          to="/settings"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Settings</span>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="font-serif text-3xl text-foreground tracking-tight mb-2">
            Notifications
          </h1>
          <p className="text-muted-foreground text-sm">
            Configure how you receive updates and alerts
          </p>
        </motion.div>

        {/* Notification Groups */}
        <div className="space-y-10">
          {notificationGroups.map((group, groupIndex) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: groupIndex * 0.1 }}
            >
              <div className="mb-6">
                <h2 className="font-serif text-xl text-foreground mb-1">
                  {group.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {group.description}
                </p>
              </div>

              <div className="space-y-4">
                {group.notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between p-4 bg-card border border-border rounded-sm"
                  >
                    <div className="flex-1 pr-4">
                      <p className="font-medium text-foreground mb-1">
                        {notification.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {notification.description}
                      </p>
                    </div>
                    <Switch defaultChecked={notification.defaultChecked} />
                  </div>
                ))}
              </div>

              {groupIndex < notificationGroups.length - 1 && (
                <Separator className="mt-10" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12"
        >
          <Button className="bg-foreground text-background hover:bg-foreground/90 px-8">
            Save Preferences
          </Button>
        </motion.div>
      </div>
    </MainLayout>
  );
}
