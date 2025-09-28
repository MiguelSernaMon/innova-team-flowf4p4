import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Users, Shield, FolderOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { type Notification } from "@/lib/api";

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onNavigate: (link: string) => void;
}

const typeConfig = {
  alert: {
    icon: AlertCircle,
    label: "Alerta",
    color: "bg-alert text-white",
  },
  team: {
    icon: Users,
    label: "Equipo",
    color: "bg-team text-white",
  },
  admin: {
    icon: Shield,
    label: "Admin",
    color: "bg-admin text-white",
  },
  project: {
    icon: FolderOpen,
    label: "Proyecto",
    color: "bg-project text-white",
  },
};

export default function NotificationCard({ 
  notification, 
  onMarkAsRead, 
  onNavigate 
}: NotificationCardProps) {
  const config = typeConfig[notification.type];
  const Icon = config.icon;
  
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: es,
  });

  const handleClick = () => {
    if (notification.status === "unread") {
      onMarkAsRead(notification.id);
    }
    if (notification.link) {
      onNavigate(notification.link);
    }
  };

  return (
    <Card 
      className={`p-4 cursor-pointer transition-all hover:shadow-md ${
        notification.status === "unread" 
          ? "notification-unread border-l-primary" 
          : "notification-read border-l-muted"
      }`}
      onClick={handleClick}
    >
      <div className="flex gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <Badge 
              variant="secondary" 
              className={`${config.color} text-xs font-medium`}
            >
              {config.label}
            </Badge>
            <time className="text-xs text-muted-foreground">
              {timeAgo}
            </time>
          </div>

          {/* Title */}
          <h4 className={`font-semibold text-sm ${
            notification.status === "unread" ? "text-foreground" : "text-muted-foreground"
          }`}>
            {notification.title}
          </h4>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {notification.description}
          </p>

          {/* Link */}
          {notification.link && (
            <Button 
              variant="link" 
              size="sm" 
              className="h-auto p-0 text-primary hover:text-primary-hover text-xs"
            >
              Ver detalles →
            </Button>
          )}
        </div>

        {/* Unread indicator */}
        {notification.status === "unread" && (
          <div className="flex-shrink-0">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
          </div>
        )}
      </div>
    </Card>
  );
}