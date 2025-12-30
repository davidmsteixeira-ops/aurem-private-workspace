// src/components/AuthProvider.tsx
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { RegUser } from '@/types/user';
import { Client } from '@/types/client';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

type UserInfo = {
  user_id: number;
  name: string;
  email: string;
  role: string;
  client_id: number;
  client_name: string;
  client_status: string;
  client_driver_folder_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  timezone: string;
  language: string;
  password_updated_at: string;
  mfa_enabled: boolean;
};


export function getAuthInfo() {
  const [userName, setUser] = useState<RegUser>();
  const [clientName, setClient] = useState<Client>();
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUser();
    }, []);

    async function getUser(): Promise<void> {
    // 1. Pega o usuário logado
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
        const {data} = await supabase.from("users").select().eq("user_id", user.id).limit(1).single();
        setUser(data);
        } else {
          setLoading(false);
          return;
        }
    }

    useEffect(() => {
        getClient(userName?.client_id);
    }, [userName?.client_id]);

        async function getClient(clientId: number): Promise<void> {
        const {data} = await supabase.from("clients").select().eq("id", clientId).limit(1).single();
        setClient(data);
        setLoading(false);
    }

    const userInfo: UserInfo = userName && clientName ? {user_id: userName.id, name: userName.name, email: userName.email, role: userName.role, client_id: clientName.id, client_name: clientName.name, client_status: clientName.status, client_driver_folder_id: clientName.drive_folder_id, first_name: userName.first_name, last_name: userName.last_name, phone_number: userName.phone_number, timezone: userName.timezone, language: userName.language, password_updated_at: userName.password_updated_at, mfa_enabled: userName.mfa_enabled} : null;
  return {userInfo, loading};
};