import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, MapPin, Monitor, Smartphone, Tablet, Globe, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ActivityLogDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type ActivityType = 'login' | 'logout' | 'password_change' | '2fa_enabled' | '2fa_disabled' | 'session_revoked';

interface ActivityItem {
  id: number;
  type: ActivityType;
  device: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  location: string;
  ip: string;
  timestamp: string;
  date: string;
}

const activityLog: ActivityItem[] = [
  {
    id: 1,
    type: 'login',
    device: 'MacBook Pro',
    deviceType: 'desktop',
    browser: 'Safari 17.2',
    location: 'New York, United States',
    ip: '192.168.1.***',
    timestamp: '2 hours ago',
    date: 'December 31, 2024',
  },
  {
    id: 2,
    type: 'login',
    device: 'iPhone 15 Pro',
    deviceType: 'mobile',
    browser: 'Safari Mobile',
    location: 'New York, United States',
    ip: '192.168.1.***',
    timestamp: '1 day ago',
    date: 'December 30, 2024',
  },
  {
    id: 3,
    type: '2fa_enabled',
    device: 'MacBook Pro',
    deviceType: 'desktop',
    browser: 'Safari 17.2',
    location: 'New York, United States',
    ip: '192.168.1.***',
    timestamp: '3 days ago',
    date: 'December 28, 2024',
  },
  {
    id: 4,
    type: 'password_change',
    device: 'MacBook Pro',
    deviceType: 'desktop',
    browser: 'Safari 17.2',
    location: 'Boston, United States',
    ip: '192.168.2.***',
    timestamp: '1 week ago',
    date: 'December 24, 2024',
  },
  {
    id: 5,
    type: 'login',
    device: 'iPad Pro',
    deviceType: 'tablet',
    browser: 'Safari Mobile',
    location: 'Boston, United States',
    ip: '192.168.2.***',
    timestamp: '1 week ago',
    date: 'December 24, 2024',
  },
  {
    id: 6,
    type: 'session_revoked',
    device: 'Windows PC',
    deviceType: 'desktop',
    browser: 'Chrome 120',
    location: 'Miami, United States',
    ip: '192.168.3.***',
    timestamp: '2 weeks ago',
    date: 'December 17, 2024',
  },
  {
    id: 7,
    type: 'login',
    device: 'MacBook Pro',
    deviceType: 'desktop',
    browser: 'Safari 17.1',
    location: 'New York, United States',
    ip: '192.168.1.***',
    timestamp: '3 weeks ago',
    date: 'December 10, 2024',
  },
  {
    id: 8,
    type: 'logout',
    device: 'iPhone 15 Pro',
    deviceType: 'mobile',
    browser: 'Safari Mobile',
    location: 'New York, United States',
    ip: '192.168.1.***',
    timestamp: '3 weeks ago',
    date: 'December 10, 2024',
  },
];

const getActivityLabel = (type: ActivityType): string => {
  switch (type) {
    case 'login':
      return 'Signed in';
    case 'logout':
      return 'Signed out';
    case 'password_change':
      return 'Password changed';
    case '2fa_enabled':
      return '2FA enabled';
    case '2fa_disabled':
      return '2FA disabled';
    case 'session_revoked':
      return 'Session revoked';
    default:
      return 'Activity';
  }
};

const getDeviceIcon = (deviceType: 'desktop' | 'mobile' | 'tablet') => {
  switch (deviceType) {
    case 'desktop':
      return <Monitor className="w-4 h-4" strokeWidth={1.5} />;
    case 'mobile':
      return <Smartphone className="w-4 h-4" strokeWidth={1.5} />;
    case 'tablet':
      return <Tablet className="w-4 h-4" strokeWidth={1.5} />;
  }
};

export function ActivityLogDialog({ isOpen, onClose }: ActivityLogDialogProps) {
  const [filter, setFilter] = useState<ActivityType | 'all'>('all');

  const filteredLog = filter === 'all' 
    ? activityLog 
    : activityLog.filter(item => item.type === filter);

  // Group by date
  const groupedLog = filteredLog.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = [];
    }
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, ActivityItem[]>);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 m-auto w-full max-w-xl h-fit max-h-[70vh] bg-background border border-border rounded-sm shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                  <h2 className="font-serif text-2xl text-foreground">Activity Log</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Complete history of account activity and security events
              </p>

              {/* Filters */}
              <div className="flex gap-2 flex-wrap">
                {([
                  { value: 'all', label: 'All Activity' },
                  { value: 'login', label: 'Sign Ins' },
                  { value: 'password_change', label: 'Password' },
                  { value: '2fa_enabled', label: '2FA' },
                  { value: 'session_revoked', label: 'Sessions' },
                ] as const).map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setFilter(item.value)}
                    className={`px-3 py-1.5 text-sm rounded-sm transition-colors ${
                      filter === item.value
                        ? 'bg-foreground text-background'
                        : 'bg-accent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Activity List */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-8">
                {Object.entries(groupedLog).map(([date, items]) => (
                  <div key={date}>
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">{date}</h3>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-card border border-border rounded-sm"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="p-2 bg-accent rounded-sm">
                                {getDeviceIcon(item.deviceType)}
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-foreground">
                                    {getActivityLabel(item.type)}
                                  </p>
                                  <Badge variant="outline" className="text-xs">
                                    {item.device}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Globe className="w-3 h-3" />
                                    {item.browser}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {item.location}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground/70">
                                  IP: {item.ip}
                                </p>
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                              {item.timestamp}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border flex-shrink-0">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredLog.length} of {activityLog.length} events
                </p>
                <Button variant="outline" className="border-border hover:bg-accent">
                  Export Log
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
