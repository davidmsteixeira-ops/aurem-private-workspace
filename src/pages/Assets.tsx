import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Image, Film, File, Download, Grid, List } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { cn } from '@/lib/utils';
import { getAuthInfo } from '@/hooks/UserInfo';
import { createClient } from '@supabase/supabase-js'
import { UploadAssetModal } from '@/components/UploadAssetModal';

type AssetType = 'document' | 'image' | 'video' | 'other';

interface Asset {
  id: string;
  name: string;
  type: AssetType;
  category: string;
  size: string;
  lastModified: string;
}

const assets: Asset[] = [
  {
    id: '1',
    name: 'Brand Guidelines v3.2',
    type: 'document',
    category: 'Brand Rules',
    size: '24.5 MB',
    lastModified: 'December 20, 2024',
  },
  {
    id: '2',
    name: 'Logo Suite — Primary',
    type: 'image',
    category: 'Visual Identity',
    size: '8.2 MB',
    lastModified: 'December 18, 2024',
  },
  {
    id: '3',
    name: 'Logo Suite — Reversed',
    type: 'image',
    category: 'Visual Identity',
    size: '8.4 MB',
    lastModified: 'December 18, 2024',
  },
  {
    id: '4',
    name: 'Typography License — Canela',
    type: 'document',
    category: 'Visual Identity',
    size: '1.2 MB',
    lastModified: 'December 15, 2024',
  },
  {
    id: '5',
    name: 'Material Photography Collection',
    type: 'image',
    category: 'Assets',
    size: '456 MB',
    lastModified: 'December 12, 2024',
  },
  {
    id: '6',
    name: 'Brand Film — 60s Cut',
    type: 'video',
    category: 'Assets',
    size: '284 MB',
    lastModified: 'December 10, 2024',
  },
  {
    id: '7',
    name: 'Presentation Template — Keynote',
    type: 'document',
    category: 'Assets',
    size: '45.8 MB',
    lastModified: 'December 8, 2024',
  },
  {
    id: '8',
    name: 'Presentation Template — PowerPoint',
    type: 'document',
    category: 'Assets',
    size: '48.2 MB',
    lastModified: 'December 8, 2024',
  },
  {
    id: '9',
    name: 'Social Media Templates',
    type: 'image',
    category: 'Assets',
    size: '32.5 MB',
    lastModified: 'December 5, 2024',
  },
  {
    id: '10',
    name: 'Brand Strategy Document',
    type: 'document',
    category: 'Brand Strategy',
    size: '2.8 MB',
    lastModified: 'December 1, 2024',
  },
  {
    id: '11',
    name: 'Positioning Framework',
    type: 'document',
    category: 'Positioning',
    size: '1.4 MB',
    lastModified: 'November 28, 2024',
  },
  {
    id: '12',
    name: 'Trade Show Booth Specifications',
    type: 'document',
    category: 'Assets',
    size: '18.6 MB',
    lastModified: 'November 25, 2024',
  },
];

const typeIcons = {
  document: FileText,
  image: Image,
  video: Film,
  other: File,
};

const categories = [
  'All',
  'Brand Strategy',
  'Positioning',
  'Visual Identity',
  'Brand Rules',
  'Assets',
];

export default function Assets() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); // NOVO ESTADO
    const {userInfo, loading} = getAuthInfo();
  

  const filteredAssets = selectedCategory === 'All'
    ? assets
    : assets.filter(a => a.category === selectedCategory);

  return (
    <MainLayout>
      <div className="p-12 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="font-serif text-4xl text-foreground tracking-tight mb-3">
            Assets
          </h1>

          <div className="flex items-center justify-between mb-8">
          <p className="text-muted-foreground">
            Curated brand materials and documentation
          </p>

          <button onClick={() => setIsUploadModalOpen(true)} className='px-4 py-2 text-sm rounded-sm transition-colors duration-200 bg-primary text-primary-foreground'>Upload Asset</button>

          </div>
        </motion.div>

        {/* Modal Component */}
        <UploadAssetModal 
          isOpen={isUploadModalOpen} 
          onClose={() => setIsUploadModalOpen(false)} 
          categories={categories}
        />

        

        {/* Filters & View Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-4 py-2 text-sm rounded-sm transition-colors duration-200",
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-muted-foreground hover:text-foreground"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-accent rounded-sm p-1">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-sm transition-colors duration-200",
                viewMode === 'list' ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-sm transition-colors duration-200",
                viewMode === 'grid' ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Grid className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </motion.div>

        {/* Assets List/Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {viewMode === 'list' ? (
            <div className="bg-card border border-border rounded-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wide text-muted-foreground font-medium">
                      Name
                    </th>
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wide text-muted-foreground font-medium">
                      Category
                    </th>
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wide text-muted-foreground font-medium">
                      Size
                    </th>
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wide text-muted-foreground font-medium">
                      Modified
                    </th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map((asset, index) => {
                    const Icon = typeIcons[asset.type];
                    return (
                      <motion.tr
                        key={asset.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b border-border last:border-b-0 hover:bg-accent/30 transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-accent rounded-sm">
                              <Icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                            </div>
                            <span className="text-sm font-medium text-foreground">
                              {asset.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground">
                            {asset.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground">
                            {asset.size}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground">
                            {asset.lastModified}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="p-2 hover:bg-accent rounded-sm transition-colors duration-200">
                            <Download className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {filteredAssets.map((asset, index) => {
                const Icon = typeIcons[asset.type];
                return (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="bg-card border border-border rounded-sm p-6 hover:shadow-luxury-md transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-accent rounded-sm">
                        <Icon className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                      </div>
                      <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-accent rounded-sm transition-all duration-200">
                        <Download className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                      </button>
                    </div>
                    <h3 className="text-sm font-medium text-foreground mb-1 line-clamp-2">
                      {asset.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {asset.category}
                    </p>
                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{asset.size}</span>
                      <span className="text-xs text-muted-foreground">{asset.lastModified}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-8 pt-6 border-t border-border"
        >
          <p className="text-xs text-muted-foreground">
            {filteredAssets.length} assets · For additional materials, contact your brand chief
          </p>
        </motion.div>
              

      </div>
    </MainLayout>
  );
}
