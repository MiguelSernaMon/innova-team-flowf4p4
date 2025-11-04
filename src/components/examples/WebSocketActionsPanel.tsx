// Componente de ejemplo: Panel de acciones rápidas con WebSocket
// Copia este archivo y adáptalo a tus necesidades

import { useState } from 'react';
import { useWebSocket } from '@/hooks/use-websocket';
import { websocketService } from '@/lib/websocket';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Bell, Users, MessageSquare, AlertCircle, Send } from 'lucide-react';

export default function WebSocketActionsPanel() {
  const { isConnected } = useWebSocket();
  const { toast } = useToast();
  
  const [teamId, setTeamId] = useState('1');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR'>('INFO');

  // 1. Enviar notificación al equipo
  const handleSendTeamNotification = () => {
    if (!isConnected) {
      toast({
        title: 'Error',
        description: 'No conectado a WebSocket',
        variant: 'destructive',
      });
      return;
    }

    if (!notificationTitle || !notificationMessage) {
      toast({
        title: 'Error',
        description: 'Completa todos los campos',
        variant: 'destructive',
      });
      return;
    }

        websocketService.send('/app/team.notify', {
      teamId,
      title: notificationTitle,
      message: notificationMessage,
      type: notificationType,
      timestamp: new Date().toISOString(),
    });

    toast({
      title: 'Notificación Enviada',
      description: `Enviada al equipo ${teamId}`,
    });

    // Limpiar formulario
    setNotificationTitle('');
    setNotificationMessage('');
  };

  // 2. Unirse a un equipo
  const handleJoinTeam = () => {
    if (!isConnected) {
      toast({
        title: 'Error',
        description: 'No conectado a WebSocket',
        variant: 'destructive',
      });
      return;
    }

    websocketService.send('/app/team.join', {
      teamId,
      timestamp: new Date().toISOString(),
    });

    toast({
      title: 'Solicitud Enviada',
      description: `Uniéndote al equipo ${teamId}`,
    });
  };

  // 3. Acciones rápidas predefinidas
  const quickActions = [
    {
      label: 'Convocar Reunión',
      icon: Users,
      color: 'bg-blue-500',
      handler: () => {
        websocketService.send('/app/team.meeting.schedule', {
          teamId,
          title: 'Reunión de Equipo',
          scheduledFor: new Date(Date.now() + 86400000).toISOString(), // Mañana
        });
        toast({ title: 'Reunión Programada', description: 'El equipo ha sido notificado' });
      },
    },
    {
      label: 'Solicitar Ayuda',
      icon: AlertCircle,
      color: 'bg-orange-500',
      handler: () => {
        websocketService.send('/app/team.help.request', {
          teamId,
          message: 'El equipo necesita ayuda',
          priority: 'HIGH',
        });
        toast({ title: 'Solicitud de Ayuda', description: 'Enviada a los administradores' });
      },
    },
    {
      label: 'Iniciar Sprint',
      icon: Send,
      color: 'bg-green-500',
      handler: () => {
        websocketService.send('/app/team.sprint.start', {
          teamId,
          sprintNumber: 1,
          startDate: new Date().toISOString(),
        });
        toast({ title: 'Sprint Iniciado', description: 'El equipo ha sido notificado' });
      },
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      {/* Estado de Conexión */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            WebSocket {isConnected ? 'Conectado' : 'Desconectado'}
          </CardTitle>
          <CardDescription>
            {isConnected 
              ? 'Puedes enviar y recibir notificaciones en tiempo real' 
              : 'Esperando conexión...'}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Selector de Equipo */}
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Equipo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="teamId">ID del Equipo</Label>
              <Input
                id="teamId"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                placeholder="1"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleJoinTeam} disabled={!isConnected}>
                <Users className="mr-2 h-4 w-4" />
                Unirse al Equipo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enviar Notificación Personalizada */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Enviar Notificación al Equipo
          </CardTitle>
          <CardDescription>
            Envía una notificación personalizada a todos los miembros del equipo seleccionado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={notificationTitle}
              onChange={(e) => setNotificationTitle(e.target.value)}
              placeholder="Ej: Nueva tarea asignada"
            />
          </div>

          <div>
            <Label htmlFor="message">Mensaje</Label>
            <Textarea
              id="message"
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              placeholder="Describe el mensaje de la notificación..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="type">Tipo</Label>
            <Select value={notificationType} onValueChange={(value: any) => setNotificationType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INFO">Información (azul)</SelectItem>
                <SelectItem value="SUCCESS">Éxito (verde)</SelectItem>
                <SelectItem value="WARNING">Advertencia (amarillo)</SelectItem>
                <SelectItem value="ERROR">Error (rojo)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleSendTeamNotification} 
            disabled={!isConnected}
            className="w-full"
          >
            <Send className="mr-2 h-4 w-4" />
            Enviar Notificación
          </Button>
        </CardContent>
      </Card>

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Acciones Rápidas
          </CardTitle>
          <CardDescription>
            Envía notificaciones predefinidas con un click
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.label}
                  onClick={action.handler}
                  disabled={!isConnected}
                  variant="outline"
                  className="h-auto py-6 flex-col gap-2"
                >
                  <div className={`${action.color} text-white rounded-full p-3`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Instrucciones */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Cómo usar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. Asegúrate de que WebSocket esté conectado (indicador verde)</p>
          <p>2. Selecciona o ingresa el ID del equipo al que quieres enviar notificaciones</p>
          <p>3. Usa las acciones rápidas o envía notificaciones personalizadas</p>
          <p>4. Los miembros del equipo recibirán las notificaciones en tiempo real</p>
          <p className="text-xs mt-4 p-2 bg-muted rounded">
            <strong>Nota:</strong> Este es un componente de ejemplo. Puedes copiarlo a tu proyecto
            y modificarlo según tus necesidades. Ver <code>WEBSOCKET_SEND_EVENTS.md</code> para más ejemplos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
