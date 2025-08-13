export type NotificationItem = {
  id: string;
  name?: string;
  email?: string;
  message?: string;
  formType?: "contact" | "inquiry" | "property" | string;
  createdAt: number; 
};
