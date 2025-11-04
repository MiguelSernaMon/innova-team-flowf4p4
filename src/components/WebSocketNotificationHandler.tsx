import { useCallback } from 'react';
import { useWebSocketSubscriptions } from '@/hooks/use-websocket';
import { useToast } from '@/hooks/use-toast';
import type { WSNotificationMessage, TeamUpdateMessage, AdminNotificationMessage } from '@/lib/types';
import { Bell, Users, Shield } from 'lucide-react';

/**
 * Componente que maneja las notificaciones WebSocket en tiempo real
 * Se monta en el componente principal (App o Dashboard) para recibir notificaciones globales
 */
export function WebSocketNotificationHandler() {
  const { toast } = useToast();

  // Handler para notificaciones de usuario
  const handleUserNotification = useCallback((notification: WSNotificationMessage) => {
    console.log('📨 Notificación de usuario recibida:', notification);

    // Mapear tipo de notificación a variante de toast
    let variant: 'default' | 'destructive' = 'default';
    let icon = <Bell className="h-4 w-4" />;

    switch (notification.type) {
      case 'ERROR':
        variant = 'destructive';
        break;
      case 'WARNING':
        variant = 'destructive';
        break;
      case 'TEAM_UPDATE':
        icon = <Users className="h-4 w-4" />;
        break;
      case 'ADMIN':
        icon = <Shield className="h-4 w-4" />;
        break;
    }

    toast({
      title: notification.title,
      description: notification.message,
      variant,
      duration: 5000,
    });
  }, [toast]);

  // Handler para actualizaciones de equipo
  const handleTeamUpdate = useCallback((update: TeamUpdateMessage) => {
    console.log('👥 Actualización de equipo recibida:', update);

    let message = '';
    switch (update.action) {
      case 'MEMBER_ADDED':
        message = `${update.memberName} se ha unido al equipo`;
        break;
      case 'MEMBER_REMOVED':
        message = `${update.memberName} ha salido del equipo`;
        break;
      case 'TEAM_UPDATED':
        message = `El equipo ha sido actualizado`;
        break;
      case 'TEAM_DELETED':
        message = `El equipo ha sido eliminado`;
        break;
    }

    toast({
      title: '👥 Actualización de Equipo',
      description: message,
      duration: 5000,
    });
  }, [toast]);

  // Handler para notificaciones de admin
  const handleAdminNotification = useCallback((notification: AdminNotificationMessage) => {
    console.log('👑 Notificación de admin recibida:', notification);

    toast({
      title: `👑 ${notification.title}`,
      description: notification.message,
      duration: 6000,
    });
  }, [toast]);

  // Obtener teamId del usuario actual si está disponible
  const user = localStorage.getItem('user');
  const teamId = user ? JSON.parse(user).teamId : undefined;

  // Obtener rol del usuario
  const userRole = localStorage.getItem('userRole');
  const isAdmin = userRole === 'ADMIN';

  // Suscribirse a las notificaciones
  const { isConnected, connectionState } = useWebSocketSubscriptions({
    onUserNotification: handleUserNotification,
    onTeamUpdate: handleTeamUpdate,
    onAdminNotification: isAdmin ? handleAdminNotification : undefined,
    teamId,
    enableUserNotifications: true,
    enableTeamUpdates: !!teamId,
    enableAdminNotifications: isAdmin,
  });

  // Este componente no renderiza nada visible
  // Solo maneja las suscripciones y muestra toasts
  return (
    <div className="hidden" data-ws-connected={isConnected} data-ws-state={connectionState}>
      {/* Indicador de conexión para debugging */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              isConnected
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            WS: {connectionState}
          </div>
        </div>
      )}
    </div>
  );
}

export default WebSocketNotificationHandler;
