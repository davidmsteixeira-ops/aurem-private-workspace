import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, Check, Image as ImageIcon } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';

const presetAvatars = [
  { id: 'initials', type: 'initials', value: 'F', bg: 'bg-charcoal' },
  { id: 'initials-warm', type: 'initials', value: 'F', bg: 'bg-stone-600' },
  { id: 'initials-slate', type: 'initials', value: 'F', bg: 'bg-slate-700' },
  { id: 'initials-zinc', type: 'initials', value: 'F', bg: 'bg-zinc-600' },
  { id: 'initials-neutral', type: 'initials', value: 'F', bg: 'bg-neutral-500' },
  { id: 'initials-dark', type: 'initials', value: 'F', bg: 'bg-neutral-800' },
];

export default function ChangeAvatarPage() {
  const [selectedAvatar, setSelectedAvatar] = useState('initials');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setSelectedAvatar('uploaded');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveUpload = () => {
    setUploadedImage(null);
    setSelectedAvatar('initials');
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-serif text-4xl text-foreground mb-3">Change Avatar</h1>
          <p className="text-muted-foreground">
            Personalize your profile with a custom avatar or choose from our curated selection.
          </p>
        </div>

        {/* Current Avatar Preview */}
        <div className="mb-12 flex flex-col items-center">
          <div className="mb-6">
            {selectedAvatar === 'uploaded' && uploadedImage ? (
              <img
                src={uploadedImage}
                alt="Avatar preview"
                className="w-32 h-32 rounded-full object-cover border-2 border-border"
              />
            ) : (
              <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
                presetAvatars.find(a => a.id === selectedAvatar)?.bg || 'bg-charcoal'
              }`}>
                <span className="text-4xl font-medium text-primary-foreground">F</span>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">Current Selection</p>
        </div>

        {/* Upload Section */}
        <section className="mb-12">
          <h3 className="font-serif text-lg text-foreground mb-6 pb-3 border-b border-border">
            Upload Custom Image
          </h3>
          <div className="flex items-center gap-4">
            <label className="flex-1 cursor-pointer">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-muted-foreground transition-colors duration-300">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-sm text-foreground mb-1">Click to upload an image</p>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
          {uploadedImage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center justify-between p-4 bg-accent/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-sm text-foreground">Custom image uploaded</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveUpload}
                className="text-muted-foreground hover:text-foreground gap-2"
              >
                <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                Remove
              </Button>
            </motion.div>
          )}
        </section>

        {/* Preset Avatars */}
        <section className="mb-12">
          <h3 className="font-serif text-lg text-foreground mb-6 pb-3 border-b border-border">
            Choose a Preset
          </h3>
          <div className="grid grid-cols-6 gap-4">
            {presetAvatars.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => {
                  setSelectedAvatar(avatar.id);
                  setUploadedImage(null);
                }}
                className={`relative w-full aspect-square rounded-full flex items-center justify-center transition-all duration-300 ${
                  avatar.bg
                } ${
                  selectedAvatar === avatar.id
                    ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background'
                    : 'hover:opacity-80'
                }`}
              >
                <span className="text-xl font-medium text-primary-foreground">{avatar.value}</span>
                {selectedAvatar === avatar.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-foreground rounded-full flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-background" strokeWidth={2} />
                  </motion.div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Save Button */}
        <div className="pt-8 border-t border-border flex justify-end gap-4">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground px-8"
          >
            Cancel
          </Button>
          <Button className="gap-2 bg-charcoal hover:bg-charcoal/90 text-primary-foreground px-8">
            <Check className="w-4 h-4" strokeWidth={1.5} />
            Save Avatar
          </Button>
        </div>
      </motion.div>
    </MainLayout>
  );
}
