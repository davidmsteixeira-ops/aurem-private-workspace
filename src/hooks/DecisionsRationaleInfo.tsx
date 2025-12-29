// src/components/AuthProvider.tsx
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getAuthInfo } from '@/hooks/UserInfo';
import { Decision } from '@/types/decisions';


const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);



type DecisionsInfo = {
  id: number;
  client_id: number;
  title: string;
  status: string;
  rationale: string;
  category: string;
  updated_at: string;
  updated_by: number;
};

export function getDecisionsRationales() {
  const {userInfo, loading} = getAuthInfo();
  const [decisionsEntries, setdecisionsEntries] = useState<Decision[]>([]);

  useEffect(() => {
      getDecisions(userInfo?.client_id);
  }, [userInfo?.client_id]);

  async function getDecisions(clientID: number): Promise<void> {
    if(clientID) {
      const {data} = await supabase.from('decisions_rationale').select().eq("client_id", clientID);
      setdecisionsEntries(data);
    } else {
      return;
    }
  }

  // console.log("OY2: ", userInfo?.client_id);
  // console.log("OY: ", brandVaultEntries);
  // console.log("OY3: ", brandVaultEntries[0]?.section.name);

  const decisionsEntriesInfo: DecisionsInfo[] = decisionsEntries.map(
  (entry): DecisionsInfo => ({
    id: entry.id,
    client_id: entry.client_id,
    title: entry.title,
    status: entry.status,
    rationale: entry.rationale,
    category: entry.category,
    updated_at: entry.updated_at,
    updated_by: entry.updated_by,
  })
);
  return decisionsEntriesInfo;

};
