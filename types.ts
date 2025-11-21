export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: 'palette' | 'image' | 'youtube' | 'camera';
}

export enum OrderStatus {
  ACCEPTING = 'ACCEPTING',
  NOT_ACCEPTING = 'NOT_ACCEPTING',
  SERVICES_DOWN = 'SERVICES_DOWN',
}

export interface Announcement {
  id: string;
  message: string;
  timestamp: number;
  author: string;
}