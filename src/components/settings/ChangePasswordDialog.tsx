import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { getAuthInfo } from '@/hooks/UserInfo';
import { toast } from 'sonner';
import { getDeviceDetails, insertAccessLogs } from '@/hooks/AccessLogsInfo';


interface ChangePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordDialog({ isOpen, onClose }: ChangePasswordDialogProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const {userInfo, loading: loadingAuth} = getAuthInfo();
  const [isSaving, setIsSaving] = useState(false);

  

  const passwordRequirements = [
    { label: 'At least 12 characters', met: newPassword.length >= 12 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(newPassword) },
    { label: 'One lowercase letter', met: /[a-z]/.test(newPassword) },
    { label: 'One number', met: /[0-9]/.test(newPassword) },
    { label: 'One special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
  ];

  const allRequirementsMet = passwordRequirements.every((req) => req.met);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allRequirementsMet && passwordsMatch) {
      // Handle password change
      onClose();
    }
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  const handlePasswordUpdate = async () => {

    if(userInfo) {
      setIsSaving(true);
      const toastId = toast.loading("Updating password...");
      const { data, error } = await supabase.rpc("update_password", {
        current_plain_password: currentPassword,
        new_plain_password: newPassword
      });

      if (data === "success") {
        const { error } = await supabase.from('users').update({ password_updated_at: new Date().toISOString()}).eq('id', userInfo.user_id);
        toast.success("Password updated successfully", { id: toastId });

        // LOGGING FOR PASSWORD_CHANGE
        // const { deviceName, browser, deviceType } = getDeviceDetails(window.navigator.userAgent);
        // console.log(`Auditing access: ${browser} on ${deviceName}`);
        // const geoRes = await fetch('https://ipapi.co/json/');
        // const geoData = await geoRes.json();
        // const location = `${geoData.city}, ${geoData.country_name}`;
        // const ip_address = geoData.ip;
        // insertAccessLogs(userInfo.user_id, 'password_change', deviceName, deviceType, browser, location, ip_address);



          // Refresh de luxo com delay de 1.5s
        setTimeout(() => {
          window.location.reload();
        }, 1500);

      } else if (data === "incorrect") {
        toast.error("Wrong current password", { id: toastId });
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 m-auto w-full max-w-md h-fit max-h-[85vh] overflow-y-auto bg-background border border-border rounded-sm shadow-2xl z-50"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-2xl text-foreground">Change Password</h2>
                <button
                  onClick={handleClose}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-sm text-foreground">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="pr-10 bg-card border-border focus:border-foreground"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-sm text-foreground">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pr-10 bg-card border-border focus:border-foreground"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {newPassword && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                            req.met ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {req.met && <Check className="w-3 h-3" />}
                        </div>
                        <span className={req.met ? 'text-foreground' : 'text-muted-foreground'}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm text-foreground">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pr-10 bg-card border-border focus:border-foreground"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && !passwordsMatch && (
                    <p className="text-sm text-destructive">Passwords do not match</p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 border-border hover:bg-accent"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!allRequirementsMet || !passwordsMatch || !currentPassword}
                    onClick={handlePasswordUpdate}
                    className="flex-1 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
