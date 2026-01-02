// src/components/AuthProvider.tsx
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getAuthInfo } from '@/hooks/UserInfo';
import { formatDistanceToNow } from 'date-fns'; // Opcional para "2 hours ago"



const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);


type ActivityType = 'login' | 'logout' | 'password_change' | '2fa_enabled' | '2fa_disabled' | 'session_revoked';

interface ActivityItem {
  id: number;
  type: ActivityType;
  device: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  location: string;
  ip: string;
  timestamp: string;
  date: string;
}

interface DeviceDetails {
  deviceName: string;
  browser: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
}

export const getDeviceDetails = (ua: string): DeviceDetails => {
  let browser = "Unknown Browser";
  let deviceName = "Unknown Device";
  let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';

  // 1. Detecção do Browser
  if (ua.includes("Edg/")) {
    browser = "Microsoft Edge";
  } else if (ua.includes("Chrome/") && !ua.includes("Edg/")) {
    browser = "Google Chrome";
  } else if (ua.includes("Safari/") && !ua.includes("Chrome/")) {
    browser = "Safari";
  } else if (ua.includes("Firefox/")) {
    browser = "Firefox";
  }

  // 2. Detecção do Sistema Operativo / Nome do Dispositivo
  if (ua.includes("Windows NT 10.0")) {
    deviceName = "Windows PC";
  } else if (ua.includes("Macintosh")) {
    deviceName = "MacBook / iMac";
  } else if (ua.includes("iPhone")) {
    deviceName = "iPhone";
    deviceType = 'mobile';
  } else if (ua.includes("iPad")) {
    deviceName = "iPad";
    deviceType = 'tablet';
  } else if (ua.includes("Android")) {
    deviceName = "Android Device";
    deviceType = 'mobile';
  }

  return { deviceName, browser, deviceType };
};

export async function insertAccessLogs(user_id: number, type: string, device_name: string, device_type: string, browser: string, location: string, ip_address: string) {

  if(user_id) {
    const { data, error } = await supabase.from('user_activity').insert({user_id: user_id, type: type, device_name: device_name, device_type: device_type, browser: browser, location: location, ip_address: ip_address, created_at: new Date().toISOString()});
  
    if(error) throw error;
  }

  return;

}



export function getAccessLogs() {
  const {userInfo, loading} = getAuthInfo();
  const [accessLogs, setAccessLogs] = useState([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  

  useEffect(() => {
      getLogs(userInfo?.user_id);
  }, [userInfo?.user_id]);

  async function getLogs(userID: number): Promise<void> {
    if(userID) {
      const {data} = await supabase.from('user_activity').select().eq("user_id", userID).order('created_at', { ascending: false });
      setAccessLogs(data);

      const formattedData = data.map(item => ({
        id: item.id,
        type: item.type as ActivityType,
        device: item.device_name,
        deviceType: item.device_type,
        browser: item.browser,
        location: item.location,
        ip: item.ip_address,
        timestamp: formatDistanceToNow(new Date(item.created_at), { addSuffix: true }),
        date: new Date(item.created_at).toLocaleDateString('en-US', { 
          month: 'long', day: 'numeric', year: 'numeric' 
        })
      }));
      setActivities(formattedData);
    } else {
      return;
    }
  }

   // Agrupamento por data (mesma lógica que já tinha, mas usando o estado 'activities')
  const groupedLog = activities.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, ActivityItem[]>);

 
  return {accessLogs, activities, groupedLog};

};
