import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Key, Smartphone, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ChangePasswordDialog } from '@/components/settings/ChangePasswordDialog';
import { TwoFactorAuthDialog } from '@/components/settings/TwoFactorAuthDialog';
import { RecoveryCodesDialog } from '@/components/settings/RecoveryCodesDialog';
import { ActivityLogDialog } from '@/components/settings/ActivityLogDialog';
import { getAuthInfo } from '@/hooks/UserInfo';

const accessLogs = [
  {
    id: 1,
    device: 'MacBook Pro',
    location: 'New York, United States',
    time: '2 hours ago',
    current: true,
  },
  {
    id: 2,
    device: 'iPhone 15 Pro',
    location: 'New York, United States',
    time: '1 day ago',
    current: false,
  },
  {
    id: 3,
    device: 'iPad Pro',
    location: 'Boston, United States',
    time: '3 days ago',
    current: false,
  },
];

export function formatLongDate(
  date: string | null,
  locale = 'en-US'
) {
  if (!date) return '—';

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export default function SecuritySettings() {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showTwoFactorDialog, setShowTwoFactorDialog] = useState(false);
  const [showRecoveryCodesDialog, setShowRecoveryCodesDialog] = useState(false);
  const [showActivityLogDialog, setShowActivityLogDialog] = useState(false);
  const {userInfo, loading: loadingAuth} = getAuthInfo();
  const is2FAEnabled = userInfo?.mfa_enabled;

  if(loadingAuth) return null;
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
            Security
          </h1>
          <p className="text-muted-foreground text-sm">
            Password, two-factor authentication, and access logs
          </p>
        </motion.div>

        {/* Password Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex items-start gap-4 p-6 bg-card border border-border rounded-sm">
            <div className="p-3 bg-accent rounded-sm">
              <Key className="w-5 h-5 text-foreground" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h2 className="font-medium text-foreground mb-1">Password</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Last changed {formatLongDate(userInfo?.password_updated_at)}. We recommend updating your password regularly.
              </p>
              <Button 
                variant="outline" 
                className="border-border hover:bg-accent"
                onClick={() => setShowPasswordDialog(true)}
              >
                Change Password
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Two-Factor Authentication */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex items-start gap-4 p-6 bg-card border border-border rounded-sm">
            <div className="p-3 bg-accent rounded-sm">
              <Smartphone className="w-5 h-5 text-foreground" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="font-medium text-foreground">Two-Factor Authentication</h2>
                {is2FAEnabled ? 
                <Badge variant="outline" className="text-success border-success/30 bg-success/10">
                  Enabled
                </Badge> :
                <Badge variant="outline" className="text-destructive border-destructive/30 bg-destructive/10">
                  Disabled
                </Badge>
              }
                
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Your account is protected with authenticator app verification.
              </p>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="border-border hover:bg-accent"
                  onClick={() => setShowTwoFactorDialog(true)}
                >
                  Manage 2FA
                </Button>
                {/* <Button 
                  variant="ghost" 
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setShowRecoveryCodesDialog(true)}
                >
                  View Recovery Codes
                </Button> */}
              </div>
            </div>
          </div>
        </motion.div>

        <Separator className="my-10" />

        {/* Access Logs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-foreground" strokeWidth={1.5} />
            <h2 className="font-serif text-xl text-foreground">Access Logs</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Recent sessions and device activity on your account
          </p>

          <div className="space-y-4">
            {accessLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 bg-card border border-border rounded-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-accent rounded-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-foreground">{log.device}</p>
                      {log.current && (
                        <Badge variant="outline" className="text-xs">
                          Current Session
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{log.location}</span>
                      <span>•</span>
                      <span>{log.time}</span>
                    </div>
                  </div>
                </div>
                {!log.current && (
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button 
            variant="outline" 
            className="mt-6 border-border hover:bg-accent"
            onClick={() => setShowActivityLogDialog(true)}
          >
            View Full Activity Log
          </Button>
        </motion.div>

        {/* Dialogs */}
        <ChangePasswordDialog 
          isOpen={showPasswordDialog} 
          onClose={() => setShowPasswordDialog(false)} 
        />
        <TwoFactorAuthDialog 
          isOpen={showTwoFactorDialog} 
          onClose={() => setShowTwoFactorDialog(false)}
          isEnabled={is2FAEnabled}
        />
        <RecoveryCodesDialog 
          isOpen={showRecoveryCodesDialog} 
          onClose={() => setShowRecoveryCodesDialog(false)} 
        />
        <ActivityLogDialog 
          isOpen={showActivityLogDialog} 
          onClose={() => setShowActivityLogDialog(false)} 
        />
      </div>
    </MainLayout>
  );
}
