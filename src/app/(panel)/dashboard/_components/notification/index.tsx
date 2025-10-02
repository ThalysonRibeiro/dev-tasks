"use client"
import { Notification as NotificationTypePrisma } from "@/generated/prisma";
import { NotificationContent } from "./notification-content";
import { useNotifications } from "@/hooks/useNotifications";


export function NotificationList() {
  const { data: notifications = [], isLoading } = useNotifications();
  if (isLoading) {
    return <div>Carregando...</div>;
  }
  return <NotificationContent notifications={notifications} />
}