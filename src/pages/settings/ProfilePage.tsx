import { motion } from 'framer-motion';
import { User, Mail, Phone, Building, MapPin, Calendar, Save } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ProfilePage() {
  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-serif text-4xl text-foreground mb-3">Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and account details.
          </p>
        </div>

        {/* Profile Avatar Section */}
        <div className="mb-12 flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-charcoal flex items-center justify-center">
            <span className="text-2xl font-medium text-primary-foreground">F</span>
          </div>
          <div>
            <h2 className="font-serif text-xl text-foreground mb-1">Fungisteel</h2>
            <p className="text-sm text-muted-foreground">client@fungisteel.com</p>
          </div>
        </div>

        {/* Form Sections */}
        <div className="space-y-12">
          {/* Personal Information */}
          <section>
            <h3 className="font-serif text-lg text-foreground mb-6 pb-3 border-b border-border">
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm text-muted-foreground">
                  First Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                  <Input
                    id="firstName"
                    defaultValue="Alexander"
                    className="pl-10 bg-background border-border focus:border-foreground transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm text-muted-foreground">
                  Last Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                  <Input
                    id="lastName"
                    defaultValue="Hartmann"
                    className="pl-10 bg-background border-border focus:border-foreground transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-muted-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                  <Input
                    id="email"
                    type="email"
                    defaultValue="client@fungisteel.com"
                    className="pl-10 bg-background border-border focus:border-foreground transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm text-muted-foreground">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                  <Input
                    id="phone"
                    type="tel"
                    defaultValue="+41 44 123 4567"
                    className="pl-10 bg-background border-border focus:border-foreground transition-colors"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Company Information */}
          <section>
            <h3 className="font-serif text-lg text-foreground mb-6 pb-3 border-b border-border">
              Company Information
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm text-muted-foreground">
                  Company Name
                </Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                  <Input
                    id="company"
                    defaultValue="Fungisteel AG"
                    className="pl-10 bg-background border-border focus:border-foreground transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm text-muted-foreground">
                  Role / Title
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                  <Input
                    id="role"
                    defaultValue="Chief Executive Officer"
                    className="pl-10 bg-background border-border focus:border-foreground transition-colors"
                  />
                </div>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="address" className="text-sm text-muted-foreground">
                  Business Address
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                  <Textarea
                    id="address"
                    defaultValue="Bahnhofstrasse 42&#10;8001 Zürich&#10;Switzerland"
                    className="pl-10 min-h-[100px] bg-background border-border focus:border-foreground transition-colors resize-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Account Details */}
          <section>
            <h3 className="font-serif text-lg text-foreground mb-6 pb-3 border-b border-border">
              Account Details
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Member Since
                </Label>
                <div className="flex items-center gap-3 text-foreground">
                  <Calendar className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                  <span className="text-sm">January 15, 2024</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Account Type
                </Label>
                <div className="flex items-center gap-3 text-foreground">
                  <span className="text-sm">Private Office — Executive</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Save Button */}
        <div className="mt-12 pt-8 border-t border-border flex justify-end">
          <Button className="gap-2 bg-charcoal hover:bg-charcoal/90 text-primary-foreground px-8">
            <Save className="w-4 h-4" strokeWidth={1.5} />
            Save Changes
          </Button>
        </div>
      </motion.div>
    </MainLayout>
  );
}
