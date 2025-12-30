export type NotificationGroup = {
  id: number;
  title: number;
  description: string;
  category: string;
  created_at: string;
  updated_at: string;
};

export type NotificationEntry = {
  id: number;
  notification_group_id: number;
  user_id: number;
  label: string;
  description: string;
  checked: boolean;
  created_at: string;
  updated_at: string;
};