import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getAuthInfo } from '@/hooks/UserInfo';
// ... outros imports

export default function DocumentsSettings() {
  const { userInfo, loading: loadingAuth } = getAuthInfo();
  const [groupedDocs, setGroupedDocs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userInfo) fetchDocuments();
  }, [userInfo]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    
    // Procura documentos que sejam OU gerais OU específicos deste cliente
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .or(`is_general.eq.true,client_id.eq.${userInfo.client_id}`)
      .order('category', { ascending: true });

    if (data) {
      // Agrupar por categoria para o layout
      const groups = data.reduce((acc: any, doc) => {
        const category = doc.category;
        if (!acc[category]) acc[category] = [];
        acc[category].push(notif);
        return acc;
      }, {});
      
      const formattedGroups = Object.keys(groups).map(key => ({
        category: key,
        items: groups[key]
      }));
      
      setGroupedDocs(formattedGroups);
    }
    setIsLoading(false);
  };

  if (loadingAuth || isLoading) return <div className="p-12 font-serif italic">Consulting the vault...</div>;

  return (
    <MainLayout>
      <div className="p-12 max-w-2xl">
        {/* Header permanece igual */}

        <div className="space-y-10">
          {groupedDocs.map((group, groupIndex) => (
            <motion.div key={group.category} {...animationProps}>
              <h2 className="font-serif text-xl text-foreground mb-6">{group.category}</h2>
              <div className="space-y-4">
                {group.items.map((doc) => (
                  <div key={doc.id} className="flex items-start justify-between p-5 bg-card border border-border rounded-sm">
                    <div className="flex items-start gap-4">
                      <FileText className="w-5 h-5 text-neutral-400" />
                      <div>
                        <h3 className="font-medium text-foreground">{doc.title}</h3>
                        <p className="text-sm text-muted-foreground">{doc.description}</p>
                        <p className="text-[10px] mt-2 uppercase tracking-widest text-neutral-400">
                          {doc.is_signed ? "Status: Executed" : "Status: Review Required"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => window.open(doc.google_drive_link, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}