"use client"
import { Bell, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn, } from "@/lib/utils";
import { notificationColor, notificationMap } from "@/utils/colorStatus";
import { Notification, NotificationType } from "@/generated/prisma";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { markNotificationAsRead } from "../../_actions/mark-notification-as-read";
import { useNotifications } from "@/hooks/useNotifications";
import { markAllAsRead } from "../../_actions/mark-all-notification-as-read";
import { toast } from "react-toastify";
import { deleteNotification } from "../../_actions/delete-notification";


export function NotificationContent({ notifications }: { notifications: Notification[] }) {
  const { refetch } = useNotifications();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    refetch();
  };

  const handleMarkAllRead = async () => {
    const result = await markAllAsRead();

    if (result.error) {
      toast.error(result.error);
    } else {
      refetch();
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteNotification(id);

    if (result.error) {
      toast.error(result.error);
    } else {
      refetch();
    }
  };

  return (
    <div className="absolute top-4 right-16 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative cursor-pointer"
            aria-label={`Notificações: ${unreadCount} não lidas`}
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <div className={cn(
                "absolute -top-1.5 -right-2 bg-primary rounded-full",
                "w-5 h-5 flex items-center justify-center text-xs text-primary-foreground font-semibold",
                "animate-pulse"
              )}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-96 max-h-[500px] overflow-y-auto">
          <DropdownMenuLabel className="flex justify-between items-center">
            Notificações
            {unreadCount > 0 && (
              <Button
                variant="link"
                size="sm"
                className="text-zinc-500 hover:text-zinc-700 font-normal text-sm cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAllRead();
                }}
              >
                Marcar todas como lidas
              </Button>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {unreadCount === 0 ? (
            <div className="py-8 text-center text-zinc-500">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Nenhuma notificação</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "relative mt-1 flex flex-col items-start gap-2 p-3",
                  "bg-zinc-50 dark:bg-background w-full min-h-20 rounded-md border cursor-pointer",
                  "hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group",
                  notification.isRead && "opacity-60"
                )}
                onSelect={(e) => e.preventDefault()}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                    locale: ptBR
                  })}
                </span>
                {/* Badge de tipo */}
                <span className={cn(
                  "absolute top-2 right-2 rounded px-2 py-0.5 text-[11px] font-medium",
                  notificationColor(notification.type as NotificationType)
                )}>
                  {notificationMap[notification.type as keyof typeof notificationMap]}
                </span>

                {/* Avatar (se aplicável) */}
                {!(notification.type === "ITEM_ASSIGNED" || notification.type === "DESKTOP_INVITE") && (
                  <Avatar className="absolute top-2 left-2 w-6 h-6">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                )}

                {/* Mensagem */}
                <p className={cn(
                  "text-sm mt-6 pr-16",
                  !notification.isRead && "italic"
                )}>
                  {notification.message}
                </p>

                {/* Ações */}
                <div className="flex items-center justify-between w-full mt-auto">
                  {!notification.isRead && (
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs text-blue-600 hover:text-blue-700 font-normal cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification.id);
                      }}
                    >
                      Marcar como lida
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-red-600 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notification.id);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}