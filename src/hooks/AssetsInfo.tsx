// src/components/AuthProvider.tsx
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getAuthInfo } from '@/hooks/UserInfo';
import { Asset } from '@/types/asset';


const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);


export function getAssetsInfo() {
  const {userInfo, loading} = getAuthInfo();
  const [assetEntries, setAssetEntries] = useState<Asset[]>([]);

  useEffect(() => {
      getAssets(userInfo?.client_id);
  }, [userInfo?.client_id]);

  async function getAssets(clientID: number): Promise<void> {
    if(clientID) {
      const {data} = await supabase.from('assets').select().eq("client_id", clientID);
      setAssetEntries(data);
    } else {
      return;
    }
  }

  return assetEntries;

};
