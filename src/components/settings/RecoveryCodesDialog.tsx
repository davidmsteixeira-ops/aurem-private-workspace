import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Download, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RecoveryCodesDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockRecoveryCodes = [
  'AXKF-2847-MNPL',
  'QWRT-9312-BVNX',
  'HJKL-5678-CZXM',
  'YBNM-1234-VWQP',
  'RTYU-8765-DFGH',
  'ZXCV-4321-LKJH',
  'POIU-6789-ASDF',
  'MNBV-0123-QWER',
];

export function RecoveryCodesDialog({ isOpen, onClose }: RecoveryCodesDialogProps) {
  const [step, setStep] = useState<'verify' | 'codes' | 'regenerate'>('verify');
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [codes, setCodes] = useState(mockRecoveryCodes);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      setStep('codes');
    }
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(codes.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = `Aurem Private Office - Recovery Codes
Generated: ${new Date().toLocaleDateString()}

IMPORTANT: Keep these codes in a secure location.
Each code can only be used once.

${codes.join('\n')}

If you lose access to your authenticator app, you can use one of these codes to sign in.`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aurem-recovery-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRegenerate = () => {
    // In production, generate new codes from server
    const newCodes = codes.map(() => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const part1 = Array(4).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
      const part2 = Array(4).fill(0).map(() => chars[Math.floor(Math.random() * 10)]).join('');
      const part3 = Array(4).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
      return `${part1}-${part2}-${part3}`;
    });
    setCodes(newCodes);
    setStep('codes');
  };

  const handleClose = () => {
    setStep('verify');
    setPassword('');
    onClose();
  };

  const renderVerify = () => (
    <form onSubmit={handleVerify} className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="font-serif text-xl text-foreground">View Recovery Codes</h3>
        <p className="text-sm text-muted-foreground">
          Enter your password to view your recovery codes.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm text-foreground">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-card border-border focus:border-foreground"
          placeholder="Enter your password"
        />
      </div>

      <div className="flex gap-3">
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
          disabled={!password}
          className="flex-1 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
        >
          View Codes
        </Button>
      </div>
    </form>
  );

  const renderCodes = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-serif text-xl text-foreground">Recovery Codes</h3>
        <p className="text-sm text-muted-foreground">
          Use these codes to sign in if you lose access to your authenticator app. Each code can only be used once.
        </p>
      </div>

      <div className="p-4 bg-accent/50 border border-border rounded-sm">
        <div className="grid grid-cols-2 gap-3">
          {codes.map((code, index) => (
            <code
              key={index}
              className="px-3 py-2 bg-background border border-border rounded-sm font-mono text-sm text-center"
            >
              {code}
            </code>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handleCopyAll}
          className="flex-1 border-border hover:bg-accent gap-2"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied' : 'Copy All'}
        </Button>
        <Button
          variant="outline"
          onClick={handleDownload}
          className="flex-1 border-border hover:bg-accent gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
      </div>

      <div className="pt-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={() => setStep('regenerate')}
          className="w-full text-muted-foreground hover:text-foreground gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Generate New Codes
        </Button>
      </div>
    </div>
  );

  const renderRegenerate = () => (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 mx-auto bg-destructive/20 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-destructive" />
        </div>
        <h3 className="font-serif text-xl text-foreground">Generate New Codes?</h3>
        <p className="text-sm text-muted-foreground">
          This will invalidate all existing recovery codes. Make sure to save the new codes in a secure location.
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setStep('codes')}
          className="flex-1 border-border hover:bg-accent"
        >
          Cancel
        </Button>
        <Button
          onClick={handleRegenerate}
          className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          Generate New Codes
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
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleClose}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              {step === 'verify' && renderVerify()}
              {step === 'codes' && renderCodes()}
              {step === 'regenerate' && renderRegenerate()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
