// Página de demostración de WebSocket
// Agrega esta ruta a tu App.tsx: <Route path="/websocket-demo" element={<WebSocketDemoPage />} />

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import WebSocketActionsPanel from '@/components/examples/WebSocketActionsPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code2 } from 'lucide-react';

export default function WebSocketDemoPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      <main className="flex-1 md:ml-80 p-6">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Demo WebSocket</h1>
            <p className="text-muted-foreground mt-2">
              Prueba las funcionalidades de WebSocket en tiempo real
            </p>
          </div>

        <Tabs defaultValue="panel" className="w-full">
          <TabsList>
            <TabsTrigger value="panel">Panel de Acciones</TabsTrigger>
            <TabsTrigger value="code">Código de Ejemplo</TabsTrigger>
            <TabsTrigger value="docs">Documentación</TabsTrigger>
          </TabsList>

          {/* Panel de Acciones */}
          <TabsContent value="panel">
            <WebSocketActionsPanel />
          </TabsContent>

          {/* Código de Ejemplo */}
          <TabsContent value="code">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5" />
                  Ejemplos de Código
                </CardTitle>
                <CardDescription>
                  Copia y pega estos ejemplos en tus componentes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Ejemplo 1 */}
                <div>
                  <h3 className="font-semibold mb-2">1. Enviar Notificación Básica</h3>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import { useWebSocket } from '@/hooks/use-websocket';

function MyComponent() {
  const { sendMessage, isConnected } = useWebSocket();

  const notify = () => {
    sendMessage('/app/team.notify', {
      teamId: '1',
      title: 'Hola Equipo',
      message: 'Esto es un mensaje de prueba'
    });
  };

  return (
    <button onClick={notify} disabled={!isConnected}>
      Enviar Notificación
    </button>
  );
}`}
                  </pre>
                </div>

                {/* Ejemplo 2 */}
                <div>
                  <h3 className="font-semibold mb-2">2. Recibir Notificaciones</h3>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import { useEffect } from 'react';
import { useWebSocket } from '@/hooks/use-websocket';

function NotificationListener({ teamId }) {
  const { isConnected, subscribe } = useWebSocket();

  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = subscribe(
      \`/topic/teams/\${teamId}\`,
      (notification) => {
        console.log('Nueva notificación:', notification);
        // Mostrar toast, actualizar UI, etc.
      }
    );

    return () => unsubscribe();
  }, [isConnected, teamId, subscribe]);

  return <div>Escuchando notificaciones...</div>;
}`}
                  </pre>
                </div>

                {/* Ejemplo 3 */}
                <div>
                  <h3 className="font-semibold mb-2">3. Chat en Tiempo Real</h3>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import { useState, useEffect } from 'react';
import { useWebSocket } from '@/hooks/use-websocket';

function TeamChat({ teamId }) {
  const { sendMessage, subscribe, isConnected } = useWebSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!isConnected) return;

    const unsub = subscribe(
      \`/topic/teams/\${teamId}/chat\`,
      (msg) => setMessages(prev => [...prev, msg])
    );

    return unsub;
  }, [isConnected, teamId]);

  const send = () => {
    sendMessage('/app/team.chat.send', {
      teamId,
      message: input,
      timestamp: new Date().toISOString()
    });
    setInput('');
  };

  return (
    <div>
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i}>{msg.message}</div>
        ))}
      </div>
      <input 
        value={input} 
        onChange={e => setInput(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && send()}
      />
    </div>
  );
}`}
                  </pre>
                </div>

                {/* Ejemplo 4 */}
                <div>
                  <h3 className="font-semibold mb-2">4. Desde la Consola del Navegador</h3>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`// Abre la consola (F12) y prueba estos comandos:

// Enviar notificación de prueba
webSocketService.send('/app/team.notify', {
  teamId: '1',
  title: 'Test',
  message: 'Desde consola!'
});

// Ver estado de conexión
console.log('Conectado:', webSocketService.isConnected());

// Ver suscripciones activas
console.log(webSocketService.getSubscriptions());`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documentación */}
          <TabsContent value="docs">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>📚 Documentación Disponible</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">1. WEBSOCKET_README.md</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Guía rápida de inicio. Cómo funciona y qué está integrado.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">2. WEBSOCKET_SEND_EVENTS.md</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>⭐ Lee este primero</strong> - Explica cómo enviar eventos desde el frontend,
                      cómo el backend los recibe y reenvía, y ejemplos completos de uso.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">3. WEBSOCKET_INTEGRATION.md</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Detalles técnicos de la integración, configuración y arquitectura.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">4. WEBSOCKET_TROUBLESHOOTING.md</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Solución de problemas comunes y debugging.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">5. FIX_GLOBAL_ERROR.md</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Solución al error "global is not defined". Ya aplicado.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🎯 Rutas Disponibles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <h4 className="font-semibold">Enviar al Backend:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li><code>/app/team.notify</code> - Notificar al equipo</li>
                      <li><code>/app/team.join</code> - Unirse a un equipo</li>
                      <li><code>/app/team.chat.send</code> - Enviar mensaje de chat</li>
                      <li><code>/app/user.notify</code> - Notificar usuario (admin)</li>
                      <li><code>/app/admin.broadcast</code> - Broadcast global (admin)</li>
                    </ul>

                    <h4 className="font-semibold mt-4">Recibir del Backend:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li><code>/user/queue/notifications</code> - Notificaciones personales</li>
                      <li><code>/topic/teams/{'{teamId}'}</code> - Actualizaciones del equipo</li>
                      <li><code>/topic/teams/{'{teamId}'}/chat</code> - Chat del equipo</li>
                      <li><code>/topic/admin</code> - Notificaciones admin (solo ADMIN)</li>
                      <li><code>/topic/notifications</code> - Notificaciones globales</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🚀 Próximos Pasos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>1. ✅ WebSocket ya está integrado en el Dashboard</p>
                  <p>2. ✅ Las notificaciones se muestran automáticamente como toasts</p>
                  <p>3. 🔧 Usa este panel para probar enviar notificaciones</p>
                  <p>4. 📖 Lee <code>WEBSOCKET_SEND_EVENTS.md</code> para más ejemplos</p>
                  <p>5. 🎨 Copia <code>WebSocketActionsPanel.tsx</code> y personalízalo</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </main>
    </div>
  );
}
