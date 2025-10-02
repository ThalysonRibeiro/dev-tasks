import { Notification } from '@/generated/prisma';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useNotifications() {
  const previousNotifications = useRef<Notification[]>([]);

  const query = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await fetch('/api/notifications');
      if (!response.ok) {
        throw new Error('Erro ao buscar notificações');
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (query.data && query.data.length > 0) {
      const previousIds = previousNotifications.current.map(n => n.id);
      const newNotifications = query.data.filter(
        notification => !previousIds.includes(notification.id)
      );

      if (newNotifications.length > 0) {
        const latest = newNotifications[0];
        const emoji = getNotificationEmoji(latest.type);

        toast(`${emoji} ${latest.message}`, {
          autoClose: 5000,
        });
      }

      previousNotifications.current = query.data;
    }
  }, [query.data]);

  return query;
}

function getNotificationEmoji(type: string): string {
  const emojis: Record<string, string> = {
    FRIEND_REQUEST: '👥',
    FRIEND_ACCEPTED: '✅',
    DESKTOP_INVITE: '💻',
    ITEM_ASSIGNED: '📦',
    CHAT_MESSAGE: '💬',
  };

  return emojis[type] || '🔔';
}