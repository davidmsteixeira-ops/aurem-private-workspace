import { motion } from 'framer-motion';
import { ArrowLeft, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function ProfileSettings() {
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
            Profile
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your personal information and preferences
          </p>
        </motion.div>

        {/* Avatar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center">
                <span className="text-2xl font-medium text-foreground">F</span>
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-card border border-border rounded-full hover:bg-accent transition-colors">
                <Camera className="w-4 h-4 text-foreground" />
              </button>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Profile Photo</p>
              <p className="text-sm text-muted-foreground">
                JPG, PNG or GIF. Max 2MB.
              </p>
            </div>
          </div>
        </motion.div>

        <Separator className="mb-10" />

        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          <h2 className="font-serif text-xl text-foreground">
            Personal Information
          </h2>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-xs uppercase tracking-wide-luxury text-muted-foreground">
                First Name
              </Label>
              <Input
                id="firstName"
                defaultValue="Alexander"
                className="bg-card border-border focus:border-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-xs uppercase tracking-wide-luxury text-muted-foreground">
                Last Name
              </Label>
              <Input
                id="lastName"
                defaultValue="Morrison"
                className="bg-card border-border focus:border-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs uppercase tracking-wide-luxury text-muted-foreground">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              defaultValue="alexander@fungisteel.com"
              className="bg-card border-border focus:border-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-xs uppercase tracking-wide-luxury text-muted-foreground">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              defaultValue="+1 (555) 123-4567"
              className="bg-card border-border focus:border-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs uppercase tracking-wide-luxury text-muted-foreground">
              Title / Role
            </Label>
            <Input
              id="title"
              defaultValue="Chief Executive Officer"
              className="bg-card border-border focus:border-foreground"
            />
          </div>
        </motion.div>

        <Separator className="my-10" />

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-8"
        >
          <h2 className="font-serif text-xl text-foreground">
            Preferences
          </h2>

          <div className="space-y-2">
            <Label htmlFor="timezone" className="text-xs uppercase tracking-wide-luxury text-muted-foreground">
              Timezone
            </Label>
            <Input
              id="timezone"
              defaultValue="Eastern Time (ET)"
              className="bg-card border-border focus:border-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="language" className="text-xs uppercase tracking-wide-luxury text-muted-foreground">
              Preferred Language
            </Label>
            <Input
              id="language"
              defaultValue="English (US)"
              className="bg-card border-border focus:border-foreground"
            />
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12"
        >
          <Button className="bg-foreground text-background hover:bg-foreground/90 px-8">
            Save Changes
          </Button>
        </motion.div>
      </div>
    </MainLayout>
  );
}
