import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Download, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getAuthInfo } from '@/hooks/UserInfo';

const documents = [
  {
    category: 'Legal Agreements',
    items: [
      {
        id: 1,
        title: 'Master Service Agreement',
        description: 'Terms governing the brand consulting engagement',
        lastUpdated: 'January 15, 2024',
        signed: true,
      },
      {
        id: 2,
        title: 'Non-Disclosure Agreement',
        description: 'Confidentiality terms for sensitive brand information',
        lastUpdated: 'January 15, 2024',
        signed: true,
      },
      {
        id: 3,
        title: 'Intellectual Property Assignment',
        description: 'IP ownership and licensing terms',
        lastUpdated: 'February 1, 2024',
        signed: true,
      },
    ],
  },
  {
    category: 'Service Documentation',
    items: [
      {
        id: 4,
        title: 'Brand Strategy Scope of Work',
        description: 'Detailed outline of strategic deliverables',
        lastUpdated: 'March 10, 2024',
        signed: false,
      },
      {
        id: 5,
        title: 'Visual Identity Guidelines',
        description: 'Usage rules for brand visual elements',
        lastUpdated: 'April 5, 2024',
        signed: false,
      },
      {
        id: 6,
        title: 'Brand Governance Framework',
        description: 'Protocols for brand decision-making',
        lastUpdated: 'April 20, 2024',
        signed: false,
      },
    ],
  },
  {
    category: 'Compliance & Policies',
    items: [
      {
        id: 7,
        title: 'Privacy Policy',
        description: 'How we handle and protect your data',
        lastUpdated: 'January 1, 2024',
        signed: false,
      },
      {
        id: 8,
        title: 'Terms of Service',
        description: 'General terms for using the Private Office',
        lastUpdated: 'January 1, 2024',
        signed: false,
      },
    ],
  },
];

export default function DocumentsSettings() {
  // const { userInfo, loading: loadingAuth } = getAuthInfo();
  // const [groupedDocs, setGroupedDocs] = useState<any[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //     if (userInfo) fetchDocuments();
  //   }, [userInfo]);
  
  //   const fetchDocuments = async () => {
  //     setIsLoading(true);
      
  //     // Procura documentos que sejam OU gerais OU específicos deste cliente
  //     const { data, error } = await supabase
  //       .from('documents')
  //       .select('*')
  //       .or(`is_general.eq.true,client_id.eq.${userInfo.client_id}`)
  //       .order('category', { ascending: true });
  
  //     if (data) {
  //       // Agrupar por categoria para o layout
  //       const groups = data.reduce((acc: any, doc) => {
  //         const category = doc.category;
  //         if (!acc[category]) acc[category] = [];
  //         acc[category].push(doc);
  //         return acc;
  //       }, {});
        
  //       const formattedGroups = Object.keys(groups).map(key => ({
  //         category: key,
  //         items: groups[key]
  //       }));
        
  //       setGroupedDocs(formattedGroups);
  //     }
  //     setIsLoading(false);
  //   };
  
  //   if (loadingAuth || isLoading) return <div className="p-12 font-serif italic">Consulting the vault...</div>;


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
            Documents
          </h1>
          <p className="text-muted-foreground text-sm">
            Legal agreements and service documentation
          </p>
        </motion.div>

        {/* Document Categories */}
        <div className="space-y-10">
          {documents.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              <h2 className="font-serif text-xl text-foreground mb-6">
                {category.category}
              </h2>

              <div className="space-y-4">
                {category.items.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-start gap-4 p-5 bg-card border border-border rounded-sm hover:shadow-luxury-sm transition-shadow"
                  >
                    <div className="p-2 bg-accent rounded-sm">
                      <FileText className="w-4 h-4 text-foreground" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-medium text-foreground mb-1">
                            {doc.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {doc.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Last updated: {doc.lastUpdated}
                            {doc.signed && (
                              <span className="ml-2 text-success">• Signed</span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {categoryIndex < documents.length - 1 && (
                <Separator className="mt-10" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Request Document */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 p-6 bg-accent/30 border border-border rounded-sm"
        >
          <p className="text-sm text-muted-foreground mb-3">
            Need a specific document or have questions about an agreement?
          </p>
          <Button variant="outline" className="border-border hover:bg-accent">
            Contact Your Brand Liaison
          </Button>
        </motion.div>
      </div>
    </MainLayout>
  );
}
