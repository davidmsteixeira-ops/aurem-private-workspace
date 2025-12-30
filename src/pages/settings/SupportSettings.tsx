import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, MessageCircle, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function SupportSettings() {
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
            Support
          </h1>
          <p className="text-muted-foreground text-sm">
            Contact your dedicated brand liaison
          </p>
        </motion.div>

        {/* Dedicated Liaison Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10"
        >
          <div className="p-6 bg-card border border-border rounded-sm">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                <User className="w-7 h-7 text-foreground" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide-luxury text-muted-foreground mb-1">
                  Your Dedicated Brand Liaison
                </p>
                <h2 className="font-serif text-xl text-foreground mb-1">
                  Victoria Chen
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Senior Brand Strategist · 8 years with Aurem
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="mailto:victoria.chen@aurem.com"
                    className="inline-flex items-center gap-2 text-sm text-foreground hover:text-foreground/70 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    victoria.chen@aurem.com
                  </a>
                  <a
                    href="tel:+15551234567"
                    className="inline-flex items-center gap-2 text-sm text-foreground hover:text-foreground/70 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Availability */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 p-4 bg-accent/30 border border-border rounded-sm">
            <Clock className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
            <div>
              <p className="text-sm text-foreground">
                Available Monday – Friday, 9:00 AM – 6:00 PM EST
              </p>
              <p className="text-xs text-muted-foreground">
                Response within 2 business hours for urgent matters
              </p>
            </div>
          </div>
        </motion.div>

        <Separator className="my-10" />

        {/* Send Message Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-5 h-5 text-foreground" strokeWidth={1.5} />
            <h2 className="font-serif text-xl text-foreground">Send a Message</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-xs uppercase tracking-wide-luxury text-muted-foreground">
                Subject
              </Label>
              <Input
                id="subject"
                placeholder="Brief description of your inquiry"
                className="bg-card border-border focus:border-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-xs uppercase tracking-wide-luxury text-muted-foreground">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Please describe how we can assist you..."
                className="bg-card border-border focus:border-foreground min-h-[160px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-xs uppercase tracking-wide-luxury text-muted-foreground">
                Priority Level
              </Label>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 border-border hover:bg-accent">
                  Standard
                </Button>
                <Button variant="outline" className="flex-1 border-border hover:bg-accent">
                  High
                </Button>
                <Button variant="outline" className="flex-1 border-border hover:bg-accent">
                  Urgent
                </Button>
              </div>
            </div>

            <Button className="bg-foreground text-background hover:bg-foreground/90 px-8">
              Send Message
            </Button>
          </div>
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 pt-8 border-t border-border"
        >
          <p className="text-xs uppercase tracking-wide-luxury text-muted-foreground mb-4">
            Additional Resources
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Knowledge Base
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Brand Guidelines FAQ
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Schedule a Call
            </Button>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
