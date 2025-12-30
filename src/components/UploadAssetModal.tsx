import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, FileText, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { getAuthInfo } from '@/hooks/UserInfo';


interface UploadAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
}

export const UploadAssetModal = ({ isOpen, onClose, categories }: UploadAssetModalProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState(categories[1]); // Defaul  t para a primeira categoria real
  const {userInfo, loading} = getAuthInfo();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const [isUploading, setIsUploading] = useState(false);
  const clientID = userInfo?.client_id;
  const userID = userInfo?.user_id;
  const driver_folder_id = userInfo?.client_driver_folder_id;


const handleUpload = async () => {
  if (!selectedFile || !clientID || !userID || !driver_folder_id) return;
  const { data: { session } } = await supabase.auth.getSession();
  
  setIsUploading(true);
  const toastId = toast.loading("Uploading to brand vault...");

  try {
    // 1. Converter arquivo para Base64 ou FormData
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('category', category);
    formData.append('client_id', String(clientID));
    formData.append('name', selectedFile.name);
    formData.append('user_id', String(userID));
    formData.append('driver_folder_id', driver_folder_id);

    // 2. Chamar a Edge Function do Supabase
    const { data, error } = await supabase.functions.invoke('hello-world', {
      body: formData,
      headers: {
      Authorization: `Bearer ${session?.access_token}`, // Forçando o token explicitamente
    },
    });

    if (error) {
        console.error("Erro na função:", error); 
        // Tente ler o corpo da mensagem de erro
        const errorDetails = await error.context?.json();
        console.log("Detalhes do Backend:", errorDetails);
        
        toast.error(`Error: ${errorDetails?.error || 'Unknown error'}`);

        throw error;
    }

    toast.success("Asset curated successfully", { id: toastId });
    onClose();
    // Aqui você pode disparar um refresh na lista de assets
  } catch (error: any) {
    console.error(error);
    toast.error("Upload failed: " + error.message, { id: toastId });
  } finally {
    setIsUploading(false);
  }
};

  return (
    <AnimatePresence>
      {isOpen && (
        <>
        <div className="flex justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="fixed -translate-x-1/2  bg-white shadow-2xl z-[70] overflow-hidden rounded-sm m-t-3"
          >

            
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-serif text-2xl text-neutral-900 tracking-tight">Add New Asset</h2>
                  <p className="text-xs text-neutral-400 uppercase tracking-widest mt-1">Curate your brand vault</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-neutral-50 rounded-full transition-colors">
                  <X className="w-5 h-5 text-neutral-400" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-8">
                {/* Category Selection */}
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-medium">Select Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.filter(c => c !== 'All').map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={cn(
                          "px-4 py-2 text-xs transition-all duration-300 border",
                          category === cat 
                            ? "bg-black text-white border-black" 
                            : "bg-transparent text-neutral-500 border-neutral-100 hover:border-neutral-300"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dropzone */}
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-medium">File Upload</label>
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={cn(
                      "relative border border-dashed aspect-[16/7] flex flex-col items-center justify-center transition-all duration-500",
                      dragActive ? "border-black bg-neutral-50" : "border-neutral-200 bg-neutral-50/50",
                      selectedFile ? "border-solid border-neutral-900 bg-white" : ""
                    )}
                  >
                    {!selectedFile ? (
                      <>
                        <UploadCloud className="w-8 h-8 text-neutral-300 mb-3 stroke-[1px]" />
                        <p className="text-sm text-neutral-500 font-light">
                          Drag and drop or <span className="text-black font-normal cursor-pointer underline underline-offset-4">browse</span>
                        </p>
                        <input 
                          type="file" 
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
                        />
                      </>
                    ) : (
                      <div className="flex items-center gap-4 animate-fade-in">
                        <div className="p-3 bg-neutral-900 rounded-sm">
                          <FileText className="w-6 h-6 text-white stroke-[1px]" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-neutral-900 truncate max-w-[200px]">{selectedFile.name}</p>
                          <p className="text-xs text-neutral-400">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                        <button 
                          onClick={() => setSelectedFile(null)}
                          className="ml-4 text-[10px] uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 flex items-center justify-end gap-4">
                  <button 
                    onClick={onClose}
                    className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 hover:text-black transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!selectedFile}
                    onClick={handleUpload}
                    className="bg-black text-white px-8 py-4 text-[11px] uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-black/5"
                  >
                    Upload to Office
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        </>
      )}
    </AnimatePresence>
  );
};