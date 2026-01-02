import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns'; // Opcional para "2 hours ago"
import { enUS } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, MapPin, Monitor, Smartphone, Tablet, Globe, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getAuthInfo } from '@/hooks/UserInfo';
import { getAccessLogs } from '@/hooks/AccessLogsInfo';



// ... (seus imports de ícones e UI permanecem iguais)
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
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchActivityLog();
    }
  }, [isOpen, filter]);

  const fetchActivityLog = async () => {
    setIsLoading(true);
    let query = supabase
      .from('user_activity')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (filter !== 'all') {
      query = query.eq('type', filter);
    }

    const { data, error } = await query;

    if (data) {
      const formattedData = data.map(item => ({
        id: item.id,
        type: item.type as ActivityType,
        device: item.device_name,
        deviceType: item.device_type,
        browser: item.browser,
        location: item.location,
        ip: item.ip_address,
        timestamp: formatDistanceToNow(new Date(item.created_at), { addSuffix: true }),
        date: new Date(item.created_at).toLocaleDateString('en-US', { 
          month: 'long', day: 'numeric', year: 'numeric' 
        })
      }));
      setActivities(formattedData);
    }
    setIsLoading(false);
  };

  // Agrupamento por data (mesma lógica que já tinha, mas usando o estado 'activities')
  const groupedLog = activities.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, ActivityItem[]>);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop e Modal permanecem iguais... */}
          
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="h-40 flex items-center justify-center font-serif italic text-neutral-400">
                Retrieving security ledger...
              </div>
            ) : (
              <div className="space-y-8">
                {Object.keys(groupedLog).length === 0 ? (
                  <p className="text-center text-neutral-400 py-10">No records found.</p>
                ) : (
                  Object.entries(groupedLog).map(([date, items]) => (
                    <div key={date}>
                      <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-4">{date}</h3>
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
                  ))
                )}
              </div>
            )}
          </div>
          
          {/* Footer permanece igual... */}
        </>
      )}
    </AnimatePresence>
  );
}