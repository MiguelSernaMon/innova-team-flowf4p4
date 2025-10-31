import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Bell, BellOff, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TeamNotification {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  createdAt: string;
  emailLink: string;
}

interface TeamNotificationsListProps {
  teamId: string;
  isAdmin: boolean;
  onOpenSettings: () => void;
}

// Mock data
const mockNotifications: TeamNotification[] = [
  {
    id: "1",
    title: "Título de la alerta",
    description: "Descripción de la Notificación en 20 palabras.",
    category: "[Project Name]",
    categoryColor: "bg-warning text-warning-foreground",
    createdAt: new Date(2025, 8, 17, 17, 35).toISOString(),
    emailLink: "mailto:team@codefactory.com?subject=Alerta%20Project",
  },
];

export default function TeamNotificationsList({ teamId, isAdmin, onOpenSettings }: TeamNotificationsListProps) {
  const [isSubscribed, setIsSubscribed] = useState(true);
  const { toast } = useToast();
  const [notifications] = useState(mockNotifications);

  const handleSubscriptionToggle = () => {
    setIsSubscribed(!isSubscribed);
    toast({
      title: isSubscribed ? "Desuscrito" : "Suscrito",
      description: isSubscribed 
        ? "Ya no recibirás notificaciones de este equipo" 
        : "Ahora recibirás notificaciones de este equipo",
    });
  };

  return (
    <div className="space-y-4">
      {/* Subscription button */}
      <div className="flex justify-end">
        <Button
          variant={isSubscribed ? "outline" : "default"}
          onClick={handleSubscriptionToggle}
          className="gap-2"
        >
          {isSubscribed ? (
            <>
              <BellOff className="h-4 w-4" />
              Desuscribirse
            </>
          ) : (
            <>
              <Bell className="h-4 w-4" />
              Suscribirse
            </>
          )}
        </Button>
      </div>

      {/* Notifications list */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No hay notificaciones disponibles</p>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card key={notification.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  {/* Category badge */}
                  <Badge className={`${notification.categoryColor} font-medium`}>
                    {notification.category}
                  </Badge>

                  {/* Title */}
                  <h3 className="font-semibold text-foreground">
                    {notification.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground">
                    {notification.description}
                  </p>

                  {/* Email link */}
                  <a
                    href={notification.emailLink}
                    className="inline-block text-sm text-primary hover:text-primary-hover hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  >
                    Hipervínculo asociado al correo
                  </a>
                </div>

                {/* Date and Settings */}
                <div className="flex flex-col items-end gap-2">
                  <time className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </time>
                  
                  {/* Settings button - solo visible para admins */}
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={onOpenSettings}
                      className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                      aria-label="Configuración de permisos de notificaciones"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
