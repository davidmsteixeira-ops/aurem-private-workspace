// src/components/AuthProvider.tsx
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getAuthInfo } from '@/hooks/UserInfo';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

type GroupedNotification = {
  group_id: number;
  group_title: string;
  group_description: string;
  group_default: boolean;
  notifications: NotificationEntry[];
};

type NotificationEntry = {
  id: number;
  notification_group_id: number;
  user_id: number;
  label: string;
  description: string;
  created_at: string;
  updated_at: string;
  checked: boolean;
};

type NotificationInfo = {
  id: number;
  notification_group_id: number;
  user_id: number;
  label: string;
  description: string;
  created_at: string;
  updated_at: string;
  checked: boolean;
  group_id: number;
  group_title: string;
  group_description: string;
  group_default: boolean;
};

function groupNotifications(
  rows: NotificationInfo[]
): GroupedNotification[] {
  const groups = rows.reduce<Record<number, GroupedNotification>>(
    (acc, row) => {
      const groupId = row.notification_group_id;
      if(row.group_default) {
        if (!acc[groupId]) {
          acc[groupId] = {
            group_id: groupId,
            group_title: row.group_title,
            group_description: row.group_description,
            group_default: row.group_default,
            notifications: [],
          };
        }
        
        acc[groupId].notifications.push({
          id: row.id,
          notification_group_id: row.notification_group_id,
          user_id: row.user_id,
          label: row.label,
          description: row.description,
          created_at: row.created_at,
          updated_at: row.updated_at,
          checked: row.checked,
        });
      }

      return acc;
    },
    {}
  );

  return Object.values(groups);
}

export function getNotificationsInfo() {
  const {userInfo, loading} = getAuthInfo();
  const [notificationEntries, setNotificationEntries] = useState([]);

  useEffect(() => {
      getNotEntries(userInfo?.user_id);
  }, [userInfo?.user_id]);

  async function getNotEntries(userID: number): Promise<void> {
    if(userID) {
      // console.log("User_id:", userID);
      const {data} = await supabase.from('notification_user_checks').select('id, user_id, notification_entry_id, is_checked, created_at, updated_at, section:notification_entries(id, notification_group_id, label, description, section2:notification_groups(id, title, description, is_default))').eq("user_id", userID);

      setNotificationEntries(data);
    } else {
      return;
    }
  }


  const notificationEntriesInfo: NotificationInfo[] = notificationEntries.map(
  (entry): NotificationInfo => ({
      id: entry.id,
      notification_group_id: entry.section.notification_group_id,
      user_id: entry.user_id,
      label: entry.section.label,
      description: entry.section.description,
      created_at: entry.created_at,
      updated_at: entry.updated_at,
      checked: entry.is_checked,
      group_id: entry.section.section2.id,
      group_title: entry.section.section2.title,
      group_description: entry.section.section2.description,
      group_default: entry.section.section2.is_default,
  })
);
  return groupNotifications(notificationEntriesInfo);

};