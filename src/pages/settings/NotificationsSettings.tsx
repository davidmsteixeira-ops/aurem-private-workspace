import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { getAuthInfo } from '@/hooks/UserInfo';
import { getNotificationsInfo } from '@/hooks/NotificationsInfo';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// How Notifications are Grouped
// type GroupedNotification = {
//   group_id: number;
//   group_title: string;
//   group_description: string;
//   notifications: NotificationEntry[];
// };

// type NotificationEntry = {
//   id: number;
//   notification_group_id: number;
//   user_id: number;
//   label: string;
//   description: string;
//   created_at: string;
//   updated_at: string;
//   checked: boolean;
// };

export default function NotificationsSettings() {
  const {userInfo, loading: loadingAuth} = getAuthInfo();
  const notificationGroups = getNotificationsInfo();
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Estado para controlar os switches: { [id_notificacao]: boolean }
  const [localSettings, setLocalSettings] = useState<Record<number, boolean>>({});

  // Inicializa o estado local quando os dados chegam do banco
  useEffect(() => {
    if (notificationGroups.length > 0 && !isInitialized) {
      const initialState: Record<number, boolean> = {};
      
      notificationGroups.forEach(group => {
        group.notifications.forEach(notif => {
          initialState[notif.id] = notif.checked;
        });
      });
      
      setLocalSettings(initialState);
      setIsInitialized(true);
    }
  }, [notificationGroups, isInitialized]);

  // Função para alternar o switch individualmente
  const handleToggle = (id: number, checked: boolean) => {
    setLocalSettings(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Refining notification filters...");

    try {
      // Prepara os dados para atualização
      // Vamos iterar sobre o objeto localSettings e atualizar cada linha
      const updates = Object.entries(localSettings).map(([id, checked]) => ({
        id: Number(id),
        is_checked: checked,
        updated_at: new Date().toISOString(),
      }));

      // No Supabase, podemos usar o .upsert para atualizar várias linhas de uma vez
      // desde que o 'id' esteja presente para fazer o match
      const { error } = await supabase
        .from('notification_user_checks') // Substitua pelo nome real da sua tabela
        .upsert(updates);

      if (error) throw error;

      toast.success("Preferences archived successfully", { id: toastId });

      // Refresh de luxo com delay de 1.5s
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error: any) {
      toast.error(error.message || "Failed to save preferences", { id: toastId });
      setIsSaving(false);
    }
  };

  if (loadingAuth) return null;


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
              key={group.group_title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: groupIndex * 0.1 }}
            >
              <div className="mb-6">
                <h2 className="font-serif text-xl text-foreground mb-1">
                  {group.group_title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {group.group_description}
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
                    <Switch checked={localSettings[notification.id] ?? notification.checked} 
                      onCheckedChange={(checked) => handleToggle(notification.id, checked)} />
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
          <Button 
          onClick={handleSavePreferences} 
          disabled={isSaving}
          className="bg-foreground text-background hover:bg-foreground/90 px-8">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Preferences"}
          </Button>
        </motion.div>
      </div>
    </MainLayout>

    
  );
}



