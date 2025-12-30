import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getAuthInfo } from '@/hooks/UserInfo';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';


export default function ProfileSettings() {
  const {userInfo, loading: loadingAuth} = getAuthInfo();
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

// Estado para os campos do formulário
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    role: '',
    timezone: '',
    language: '',
  });

  // Sincroniza os dados iniciais do Supabase com o estado local
  useEffect(() => {
    if (userInfo && !isInitialized) {
      setFormData({
        first_name: userInfo.first_name || '',
        last_name: userInfo.last_name || '',
        email: userInfo.email || '',
        phone_number: userInfo.phone_number || '',
        role: userInfo.role || '',
        timezone: userInfo.timezone || '',
        language: userInfo.language || '',
      });
      setIsInitialized(true);
    }
  }, [userInfo, isInitialized]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, name, value } = e.target;
    const fieldName = name || id; // Prioriza o name se existir
    
    // Mapeamento para o campo 'role'
    const targetKey = fieldName === 'title' ? 'role' : fieldName;

    setFormData(prev => ({ 
      ...prev, 
      [targetKey]: value 
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Updating your profile...");

    try {
      if (!userInfo) throw new Error("No user found");

      // Update na tabela 'profiles'
      const { error } = await supabase
        .from('users')
        .update({
          name: formData.first_name + " " + formData.last_name,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
          role: formData.role,
          timezone: formData.timezone,
          language: formData.language,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userInfo.user_id);

      if (error) throw error;

      toast.success("Profile updated successfully", { id: toastId });
      // 2. Aguarda 1.5 segundos para o utilizador ler a confirmação e depois faz o refresh
    setTimeout(() => {
      window.location.reload(); 
      // Alternativa se usares react-router-dom: navigate(0);
    }, 1500);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingAuth) {
    return <div className="flex h-screen items-center justify-center font-serif italic text-neutral-400">Loading Office...</div>;
  }


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
                <span className="text-2xl font-medium text-foreground">{formData.first_name?.charAt(0) || formData.email?.charAt(0)}</span>
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
                name="first_name"
                id="first_name"
                defaultValue={formData.first_name}
                onChange={handleInputChange}
                className="bg-card border-border focus:border-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-xs uppercase tracking-wide-luxury text-muted-foreground">
                Last Name
              </Label>
              <Input
                name="last_name"
                id="last_name"
                defaultValue={formData.last_name}
                onChange={handleInputChange}
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
              value={formData.email}
              disabled
              onChange={handleInputChange}
              className="bg-card border-border focus:border-foreground"
            />
            <p className="text-[10px] text-neutral-400 italic font-light">Contact administration to change your official email.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-xs uppercase tracking-wide-luxury text-muted-foreground">
              Phone Number
            </Label>
            <Input
              id="phone_number"
              name="phone_number"
              type="tel"
              defaultValue={formData.phone_number}
              onChange={handleInputChange}
              className="bg-card border-border focus:border-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs uppercase tracking-wide-luxury text-muted-foreground">
              Title / Role
            </Label>
            <Input
              id="role"
              name="role"
              defaultValue={formData.role}
              onChange={handleInputChange}
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
              name="timezone"
              defaultValue={formData.timezone}
              onChange={handleInputChange}
              className="bg-card border-border focus:border-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="language" className="text-xs uppercase tracking-wide-luxury text-muted-foreground">
              Preferred Language
            </Label>
            <Input
              id="language"
              name="language"
              defaultValue={formData.language}
              onChange={handleInputChange}
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
          <Button 
            onClick={handleSaveChanges} 
            disabled={isSaving}
            className="bg-foreground text-background hover:bg-foreground/90 px-8">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Updating...
              </>
            ) : "Save Changes"}
          </Button>
        </motion.div>
      </div>
    </MainLayout>
  );
}
