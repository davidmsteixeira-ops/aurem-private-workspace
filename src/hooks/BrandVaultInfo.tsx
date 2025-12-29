// src/components/AuthProvider.tsx
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getAuthInfo } from '@/hooks/UserInfo';
import { BrandVaultEntries } from '@/types/brand_vault_entries';
import { BrandVaultSection } from '@/types/brand_vault_sections';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

type BrandVaultInfo = {
  category: string;
  section_id: number;
  slug: string;
  content: string;
  user_id: number;
  user_name: string;
  client_id: number;
  client_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  updated_by: number;
};

export function getBrandVaultEntries() {
  const {userInfo, loading} = getAuthInfo();
  const [brandVaultEntries, setBrandVaultEntries] = useState([]);

  useEffect(() => {
      getEntries(userInfo?.client_id);
  }, [userInfo?.client_id]);

  async function getEntries(clientID: number): Promise<void> {
    if(clientID) {
      const {data} = await supabase.from('brand_vault_entries').select('id, client_id, section_id, version, status, content, created_at, updated_at, updated_by, section:brand_vault_sections(name, slug, order_index)').eq("client_id", clientID).order('section(order_index)', {ascending: true});
      setBrandVaultEntries(data);
    } else {
      return;
    }
  }

  // console.log("OY2: ", userInfo?.client_id);
  // console.log("OY: ", brandVaultEntries);
  // console.log("OY3: ", brandVaultEntries[0]?.section.name);

  const brandVaultEntriesInfo: BrandVaultInfo[] = brandVaultEntries.map(
  (entry): BrandVaultInfo => ({
    category: entry.section.name,
    section_id: entry.section_id,
    slug: entry.section.slug,
    content: entry.content,
    user_id: entry.updated_by,
    user_name: userInfo?.name,
    client_id: entry.client_id,
    client_name: userInfo?.client_name,
    status: entry.status,
    created_at: entry.created_at,
    updated_at: entry.updated_at,
    updated_by: entry.updated_by,
  })
);
  return brandVaultEntriesInfo;

};

export function getBrandVaultSections() {
  const [brandVaultSections, setBrandVaultSections] = useState<BrandVaultSection[]>([]);

  useEffect(() => {
      getSections();
  }, []);

  async function getSections(): Promise<void> {
      const {data} = await supabase.from("brand_vault_sections").select().limit(10);
      setBrandVaultSections(data);
  }

  // console.log("TT: ", brandVaultSections[0]?.name);

  return brandVaultSections;

}