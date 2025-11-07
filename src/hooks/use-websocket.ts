import { useEffect, useState, useCallback, useRef } from 'react';
import { websocketService } from '@/lib/websocket';
import type { 
  WSNotificationMessage, 
  TeamUpdateMessage, 
  AdminNotificationMessage,
  WebSocketConnectionState 
} from '@/lib/types';

interface UseWebSocketOptions {
  autoConnect?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook para manejar conexiones WebSocket
 * Se conecta automáticamente al montar y se desconecta al desmontar
 */
export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { autoConnect = true, onConnect, onDisconnect, onError } = options;
  const [connectionState, setConnectionState] = useState<WebSocketConnectionState>('NOT_INITIALIZED');
  const [isConnected, setIsConnected] = useState(false);
  const connectAttempted = useRef(false);

  // Conectar al WebSocket
  const connect = useCallback(async () => {
    if (connectAttempted.current) {
      console.log('⏭️ Ya se intentó conectar, saltando...');
      return;
    }
    connectAttempted.current = true;

    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token) {
      console.warn('No hay token disponible para WebSocket');
      setConnectionState('DISCONNECTED');
      return;
    }

    // 🎬 Modo Demo: No conectar WebSocket si es token fake
    if (token.startsWith('fake-token-')) {
      console.log('🎬 Modo Demo - WebSocket deshabilitado (no hay backend)');
      setConnectionState('DISCONNECTED');
      setIsConnected(false);
      return;
    }

    try {
      setConnectionState('CONNECTING');
      await websocketService.connect(token);
      setConnectionState('CONNECTED');
      setIsConnected(true);
      onConnect?.();
    } catch (error) {
      const errorMessage = (error as Error).message;
      
      // No mostrar error ni reintentar en modo demo
      if (errorMessage.includes('Demo mode')) {
        console.log('🎬 Modo Demo detectado - WebSocket deshabilitado');
        setConnectionState('DISCONNECTED');
        setIsConnected(false);
        return;
      }

      console.error('Error conectando WebSocket:', error);
      setConnectionState('DISCONNECTED');
      setIsConnected(false);
      onError?.(error as Error);
      // NO resetear connectAttempted para evitar loops infinitos
    }
  }, [onConnect, onError]);

  // Desconectar del WebSocket
  const disconnect = useCallback(async () => {
    try {
      await websocketService.disconnect();
      setConnectionState('DISCONNECTED');
      setIsConnected(false);
      connectAttempted.current = false;
      onDisconnect?.();
    } catch (error) {
      console.error('Error desconectando WebSocket:', error);
    }
  }, [onDisconnect]);

  // Auto-conectar al montar
  useEffect(() => {
    if (autoConnect && !connectAttempted.current) {
      connect();
    }

    return () => {
      // Desconectar al desmontar
      if (connectAttempted.current) {
        disconnect();
      }
    };
  }, [autoConnect, connect, disconnect]);

  return {
    isConnected,
    connectionState,
    connect,
    disconnect,
  };
}

/**
 * Hook para suscribirse a notificaciones generales
 */
export function useNotifications(
  onNotification: (notification: WSNotificationMessage) => void,
  enabled = true
) {
  const { isConnected } = useWebSocket();

  useEffect(() => {
    if (!isConnected || !enabled) return;

    console.log('📬 Suscribiéndose a notificaciones generales...');
    const unsubscribe = websocketService.subscribeToNotifications(onNotification);

    return () => {
      console.log('📪 Desuscribiéndose de notificaciones generales');
      unsubscribe();
    };
  }, [isConnected, enabled, onNotification]);

  return { isConnected };
}

/**
 * Hook para suscribirse a notificaciones privadas del usuario
 */
export function useUserNotifications(
  onNotification: (notification: WSNotificationMessage) => void,
  enabled = true
) {
  const { isConnected } = useWebSocket();

  useEffect(() => {
    if (!isConnected || !enabled) return;

    console.log('📨 Suscribiéndose a notificaciones privadas...');
    const unsubscribe = websocketService.subscribeToUserNotifications(onNotification);

    return () => {
      console.log('📪 Desuscribiéndose de notificaciones privadas');
      unsubscribe();
    };
  }, [isConnected, enabled, onNotification]);

  return { isConnected };
}

/**
 * Hook para suscribirse a actualizaciones de un equipo
 */
export function useTeamUpdates(
  teamId: string | undefined,
  onUpdate: (update: TeamUpdateMessage) => void,
  enabled = true
) {
  const { isConnected } = useWebSocket();

  useEffect(() => {
    if (!isConnected || !enabled || !teamId) return;

    console.log(`👥 Suscribiéndose al equipo ${teamId}...`);
    const unsubscribe = websocketService.subscribeToTeam(teamId, onUpdate);

    return () => {
      console.log(`📪 Desuscribiéndose del equipo ${teamId}`);
      unsubscribe();
    };
  }, [isConnected, enabled, teamId, onUpdate]);

  return { isConnected };
}

/**
 * Hook para suscribirse a notificaciones de admin (solo ADMIN)
 */
export function useAdminNotifications(
  onNotification: (notification: AdminNotificationMessage) => void,
  enabled = true
) {
  const { isConnected } = useWebSocket();
  const [isAdmin, setIsAdmin] = useState(false);

  // Verificar si el usuario es admin
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setIsAdmin(userRole === 'ADMIN');
  }, []);

  useEffect(() => {
    if (!isConnected || !enabled || !isAdmin) return;

    console.log('👑 Suscribiéndose a notificaciones de admin...');
    const unsubscribe = websocketService.subscribeToAdminNotifications(onNotification);

    return () => {
      console.log('📪 Desuscribiéndose de notificaciones de admin');
      unsubscribe();
    };
  }, [isConnected, enabled, isAdmin, onNotification]);

  return { isConnected, isAdmin };
}

/**
 * Hook todo-en-uno para suscripciones múltiples
 */
export function useWebSocketSubscriptions(config: {
  onNotification?: (notification: WSNotificationMessage) => void;
  onUserNotification?: (notification: WSNotificationMessage) => void;
  onTeamUpdate?: (update: TeamUpdateMessage) => void;
  onAdminNotification?: (notification: AdminNotificationMessage) => void;
  teamId?: string;
  enableNotifications?: boolean;
  enableUserNotifications?: boolean;
  enableTeamUpdates?: boolean;
  enableAdminNotifications?: boolean;
}) {
  const {
    onNotification,
    onUserNotification,
    onTeamUpdate,
    onAdminNotification,
    teamId,
    enableNotifications = false,
    enableUserNotifications = true,
    enableTeamUpdates = true,
    enableAdminNotifications = false,
  } = config;

  // Suscripciones individuales
  useNotifications(
    onNotification || (() => {}),
    enableNotifications && !!onNotification
  );

  useUserNotifications(
    onUserNotification || (() => {}),
    enableUserNotifications && !!onUserNotification
  );

  useTeamUpdates(
    teamId,
    onTeamUpdate || (() => {}),
    enableTeamUpdates && !!onTeamUpdate
  );

  useAdminNotifications(
    onAdminNotification || (() => {}),
    enableAdminNotifications && !!onAdminNotification
  );

  const { isConnected, connectionState } = useWebSocket();

  return {
    isConnected,
    connectionState,
  };
}
