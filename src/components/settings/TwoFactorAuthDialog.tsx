import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Copy, Check, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface TwoFactorAuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isEnabled: boolean;
}

type Step = 'overview' | 'setup' | 'verify' | 'complete' | 'disable';

export function TwoFactorAuthDialog({ isOpen, onClose, isEnabled }: TwoFactorAuthDialogProps) {
  const [step, setStep] = useState<Step>('overview');
  const [verificationCode, setVerificationCode] = useState('');
  const [copied, setCopied] = useState(false);

  // Mock QR code secret
  const mockSecret = 'JBSW Y3DP EHPK 3PXP';
  const mockQRData = 'otpauth://totp/Aurem:client@fungisteel.com?secret=JBSWY3DPEHPK3PXP&issuer=Aurem';

  const handleCopySecret = () => {
    navigator.clipboard.writeText(mockSecret.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length === 6) {
      setStep('complete');
    }
  };

  const handleClose = () => {
    setStep('overview');
    setVerificationCode('');
    onClose();
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto bg-accent rounded-sm flex items-center justify-center">
          <Shield className="w-8 h-8 text-foreground" strokeWidth={1.5} />
        </div>
        <h3 className="font-serif text-xl text-foreground">Two-Factor Authentication</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          {isEnabled
            ? 'Your account is protected with an additional layer of security.'
            : 'Add an extra layer of security to your account by requiring a verification code.'}
        </p>
      </div>

      {isEnabled ? (
        <div className="space-y-4">
          <div className="p-4 bg-success/10 border border-success/20 rounded-sm">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-success" />
              <div>
                <p className="font-medium text-foreground">Two-factor authentication is enabled</p>
                <p className="text-sm text-muted-foreground">Using authenticator app</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setStep('disable')}
              className="flex-1 border-border hover:bg-accent"
            >
              Disable 2FA
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-border hover:bg-accent"
            >
              Close
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1 border-border hover:bg-accent"
          >
            Cancel
          </Button>
          <Button
            onClick={() => setStep('setup')}
            className="flex-1 bg-foreground text-background hover:bg-foreground/90"
          >
            Enable 2FA
          </Button>
        </div>
      )}
    </div>
  );

  const renderSetup = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-serif text-xl text-foreground">Set Up Authenticator</h3>
        <p className="text-sm text-muted-foreground">
          Scan this QR code with your authenticator app (Google Authenticator, Authy, or 1Password).
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-48 h-48 bg-white p-4 rounded-sm border border-border">
          {/* Mock QR Code - in production, generate real QR */}
          <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNMjAgMjBoNDB2NDBIMjB6TTcwIDIwaDEwdjEwSDcwek04MCAyMGgxMHYxMEg4MHpNMTAwIDIwaDEwdjEwSDEwMHpNMTIwIDIwaDEwdjEwSDEyMHpNMTQwIDIwaDQwdjQwSDE0MHpNMjAgMzBoMTB2MTBIMjB6TTUwIDMwaDEwdjEwSDUwek03MCAzMGgxMHYxMEg3MHpNOTAgMzBoMTB2MTBIOTB6TTExMCAzMGgxMHYxMEgxMTB6TTE0MCAzMGgxMHYxMEgxNDB6TTE3MCAzMGgxMHYxMEgxNzB6TTIwIDQwaDEwdjEwSDIwek0zMCA0MGgxMHYxMEgzMHpNNDAgNDBoMTB2MTBINDB6TTUwIDQwaDEwdjEwSDUwek03MCA0MGgxMHYxMEg3MHpNOTAgNDBoMTB2MTBIOTA+TTE0MCA0MGgxMHYxMEgxNDB6TTE1MCA0MGgxMHYxMEgxNTB6TTE2MCA0MGgxMHYxMEgxNjB6TTE3MCA0MGgxMHYxMEgxNzB6TTIwIDUwaDEwdjEwSDIwek0zMCA1MGgxMHYxMEgzMHpNNDAgNTBoMTB2MTBINDB6TTUwIDUwaDEwdjEwSDUwek03MCA1MGgxMHYxMEg3MHpNODAgNTBoMTB2MTBIOTBNMTEwIDUwaDEwdjEwSDExMHpNMTQwIDUwaDEwdjEwSDE0MHpNMTUwIDUwaDEwdjEwSDE1MHpNMTYwIDUwaDEwdjEwSDE2MHpNMTcwIDUwaDEwdjEwSDE3MHpNMjAgNjBoMTB2MTBIMjB6TTUwIDYwaDEwdjEwSDUwek03MCA2MGgxMHYxMEg3MHpNOTAgNjBoMTB2MTBIOTA+TTEwMCA2MGgxMHYxMEgxMDB6TTExMCA2MGgxMHYxMEgxMTB6TTE0MCA2MGgxMHYxMEgxNDB6TTE3MCA2MGgxMHYxMEgxNzB6TTIwIDcwaDQwdjEwSDIwek03MCA3MGgxMHYxMEg3MHpNOTAgNzBoMTB2MTBIOTBNMTEwIDcwaDEwdjEwSDExMHpNMTQwIDcwaDQwdjEwSDE0MHoiIGZpbGw9ImJsYWNrIi8+PC9zdmc+')] bg-contain bg-center bg-no-repeat" />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground text-center">
          Or enter this code manually:
        </p>
        <div className="flex items-center justify-center gap-2">
          <code className="px-4 py-2 bg-accent rounded-sm font-mono text-sm tracking-wider">
            {mockSecret}
          </code>
          <button
            onClick={handleCopySecret}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setStep('overview')}
          className="flex-1 border-border hover:bg-accent"
        >
          Back
        </Button>
        <Button
          onClick={() => setStep('verify')}
          className="flex-1 bg-foreground text-background hover:bg-foreground/90"
        >
          Continue
        </Button>
      </div>
    </div>
  );

  const renderVerify = () => (
    <form onSubmit={handleVerify} className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-serif text-xl text-foreground">Verify Setup</h3>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit verification code from your authenticator app.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="verification-code" className="text-sm text-foreground">
          Verification Code
        </Label>
        <Input
          id="verification-code"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
          className="text-center text-2xl tracking-[0.5em] font-mono bg-card border-border focus:border-foreground"
          placeholder="000000"
        />
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep('setup')}
          className="flex-1 border-border hover:bg-accent"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={verificationCode.length !== 6}
          className="flex-1 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
        >
          Verify & Enable
        </Button>
      </div>
    </form>
  );

  const renderComplete = () => (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 mx-auto bg-success/20 rounded-full flex items-center justify-center">
        <Check className="w-8 h-8 text-success" />
      </div>
      <div className="space-y-2">
        <h3 className="font-serif text-xl text-foreground">Two-Factor Authentication Enabled</h3>
        <p className="text-sm text-muted-foreground">
          Your account is now protected with an additional layer of security.
        </p>
      </div>
      <Button
        onClick={handleClose}
        className="w-full bg-foreground text-background hover:bg-foreground/90"
      >
        Done
      </Button>
    </div>
  );

  const renderDisable = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-serif text-xl text-foreground">Disable Two-Factor Authentication</h3>
        <p className="text-sm text-muted-foreground">
          Enter a verification code from your authenticator app to confirm.
        </p>
      </div>

      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-sm">
        <p className="text-sm text-foreground">
          <strong>Warning:</strong> Disabling two-factor authentication will make your account less secure.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="disable-code" className="text-sm text-foreground">
          Verification Code
        </Label>
        <Input
          id="disable-code"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
          className="text-center text-2xl tracking-[0.5em] font-mono bg-card border-border focus:border-foreground"
          placeholder="000000"
        />
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setStep('overview')}
          className="flex-1 border-border hover:bg-accent"
        >
          Cancel
        </Button>
        <Button
          disabled={verificationCode.length !== 6}
          className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
        >
          Disable 2FA
        </Button>
      </div>
    </div>
  );

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
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                  <span className="text-sm text-muted-foreground">Manage 2FA</span>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              {step === 'overview' && renderOverview()}
              {step === 'setup' && renderSetup()}
              {step === 'verify' && renderVerify()}
              {step === 'complete' && renderComplete()}
              {step === 'disable' && renderDisable()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
