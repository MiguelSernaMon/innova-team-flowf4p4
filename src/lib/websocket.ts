/**
 * WebSocket Service para InnoSistemas
 * Maneja conexiones STOMP sobre WebSocket para notificaciones en tiempo real
 * 
 * Endpoints del Backend:
 * - WS Endpoint: ws://localhost:8080/api/v1/ws
 * - Topics:
 *   - /topic/notifications - Notificaciones globales
 *   - /topic/teams/{teamId} - Notificaciones de equipo específico
 *   - /user/queue/notifications - Notificaciones privadas del usuario
 */

import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Tipos para mensajes WebSocket
export interface WebSocketMessage<T = any> {
  type: string;
  payload: T;
  timestamp: string;
}

export interface NotificationMessage {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'TEAM_UPDATE' | 'ADMIN';
  userId?: string;
  teamId?: string;
  timestamp: string;
}

export interface TeamUpdateMessage {
  teamId: string;
  action: 'MEMBER_ADDED' | 'MEMBER_REMOVED' | 'TEAM_UPDATED' | 'TEAM_DELETED';
  memberId?: string;
  memberName?: string;
  updatedBy: string;
  timestamp: string;
}

type MessageHandler = (message: any) => void;

/**
 * Singleton WebSocket Manager
 */
class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private isConnecting = false;

  /**
   * Inicializa la conexión WebSocket
   */
  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.client?.connected) {
        console.log('WebSocket ya está conectado');
        resolve();
        return;
      }

      if (this.isConnecting) {
        console.log('WebSocket ya está intentando conectar');
        return;
      }

      this.isConnecting = true;

      const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:8080/api/v1/ws';

      // Crear cliente STOMP
      this.client = new Client({
        webSocketFactory: () => new SockJS(wsUrl) as any,
        
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },

        debug: (str) => {
          if (import.meta.env.DEV) {
            console.log('[STOMP Debug]', str);
          }
        },

        reconnectDelay: this.reconnectDelay,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,

        onConnect: (frame) => {
          console.log('✅ WebSocket conectado:', frame);
          this.reconnectAttempts = 0;
          this.isConnecting = false;
          resolve();
        },

        onStompError: (frame) => {
          console.error('❌ Error STOMP:', frame.headers['message']);
          console.error('Detalles:', frame.body);
          this.isConnecting = false;
          reject(new Error(frame.headers['message']));
        },

        onWebSocketError: (error) => {
          console.error('❌ Error WebSocket:', error);
          this.isConnecting = false;
          reject(error);
        },

        onDisconnect: () => {
          console.log('🔌 WebSocket desconectado');
          this.isConnecting = false;
          this.handleReconnect(token);
        },
      });

      // Activar la conexión
      this.client.activate();
    });
  }

  /**
   * Maneja la reconexión automática
   */
  private handleReconnect(token: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Reintentando conexión (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect(token).catch((error) => {
          console.error('Error en reconexión:', error);
        });
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('❌ Máximo de reintentos alcanzado. Conexión WebSocket perdida.');
    }
  }

  /**
   * Suscribe a notificaciones generales
   */
  subscribeToNotifications(handler: MessageHandler): () => void {
    if (!this.client?.connected) {
      console.error('WebSocket no está conectado');
      return () => {};
    }

    const subscription = this.client.subscribe('/topic/notifications', (message: IMessage) => {
      const data = JSON.parse(message.body) as NotificationMessage;
      console.log('📬 Notificación recibida:', data);
      handler(data);
    });

    this.subscriptions.set('notifications', subscription);

    // Retorna función para desuscribirse
    return () => {
      subscription.unsubscribe();
      this.subscriptions.delete('notifications');
    };
  }

  /**
   * Suscribe a notificaciones privadas del usuario
   */
  subscribeToUserNotifications(handler: MessageHandler): () => void {
    if (!this.client?.connected) {
      console.error('WebSocket no está conectado');
      return () => {};
    }

    const subscription = this.client.subscribe('/user/queue/notifications', (message: IMessage) => {
      const data = JSON.parse(message.body) as NotificationMessage;
      console.log('📨 Notificación privada recibida:', data);
      handler(data);
    });

    this.subscriptions.set('user-notifications', subscription);

    return () => {
      subscription.unsubscribe();
      this.subscriptions.delete('user-notifications');
    };
  }

  /**
   * Suscribe a actualizaciones de un equipo específico
   */
  subscribeToTeam(teamId: string, handler: MessageHandler): () => void {
    if (!this.client?.connected) {
      console.error('WebSocket no está conectado');
      return () => {};
    }

    const destination = `/topic/teams/${teamId}`;
    const key = `team-${teamId}`;

    const subscription = this.client.subscribe(destination, (message: IMessage) => {
      const data = JSON.parse(message.body) as TeamUpdateMessage;
      console.log(`👥 Actualización de equipo ${teamId}:`, data);
      handler(data);
    });

    this.subscriptions.set(key, subscription);

    return () => {
      subscription.unsubscribe();
      this.subscriptions.delete(key);
    };
  }

  /**
   * Suscribe a notificaciones de admin (solo para usuarios ADMIN)
   */
  subscribeToAdminNotifications(handler: MessageHandler): () => void {
    if (!this.client?.connected) {
      console.error('WebSocket no está conectado');
      return () => {};
    }

    const subscription = this.client.subscribe('/topic/admin', (message: IMessage) => {
      const data = JSON.parse(message.body);
      console.log('👑 Notificación de admin recibida:', data);
      handler(data);
    });

    this.subscriptions.set('admin-notifications', subscription);

    return () => {
      subscription.unsubscribe();
      this.subscriptions.delete('admin-notifications');
    };
  }

  /**
   * Envía un mensaje al servidor
   */
  send(destination: string, body: any) {
    if (!this.client?.connected) {
      console.error('WebSocket no está conectado');
      return;
    }

    this.client.publish({
      destination,
      body: JSON.stringify(body),
    });

    console.log('📤 Mensaje enviado a', destination, ':', body);
  }

  /**
   * Desconecta el WebSocket
   */
  disconnect(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.client) {
        resolve();
        return;
      }

      // Desuscribir de todos los topics
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();

      // Desactivar cliente
      this.client.deactivate().then(() => {
        console.log('🔌 WebSocket desconectado correctamente');
        this.client = null;
        resolve();
      });
    });
  }

  /**
   * Verifica si está conectado
   */
  isConnected(): boolean {
    return this.client?.connected || false;
  }

  /**
   * Obtiene el estado de la conexión
   */
  getConnectionState(): string {
    if (!this.client) return 'NOT_INITIALIZED';
    if (this.isConnecting) return 'CONNECTING';
    if (this.client.connected) return 'CONNECTED';
    return 'DISCONNECTED';
  }
}

// Exportar instancia singleton
export const websocketService = new WebSocketService();

export default websocketService;
