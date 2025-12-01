import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Bell,
  Shield,
  Users,
  CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NotificationSetting {
  id: string;
  role: string;
  label: string;
  description: string;
  enabled: boolean;
}

export default function NotificationSettingsPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "admin-all",
      role: "ADMIN",
      label: "Notificaciones de Administración",
      description: "Recibir todas las notificaciones del sistema",
      enabled: true,
    },
    {
      id: "po-project",
      role: "PRODUCT_OWNER",
      label: "Notificaciones de Proyectos",
      description: "Notificaciones sobre cambios en proyectos",
      enabled: true,
    },
    {
      id: "sm-team",
      role: "SCRUM_MASTER",
      label: "Notificaciones de Equipos",
      description: "Notificaciones sobre actividad de equipos",
      enabled: true,
    },
    {
      id: "student-personal",
      role: "STUDENT",
      label: "Notificaciones Personales",
      description: "Notificaciones relevantes para estudiantes",
      enabled: true,
    },
  ]);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // Load current user from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      
      // Redirect if not admin
      if (user.role !== 'ADMIN') {
        toast({
          title: "Acceso Denegado",
          description: "Solo los administradores pueden acceder a esta página",
          variant: "destructive",
        });
        navigate('/dashboard');
      }
    }
  }, [navigate, toast]);

  const handleToggleSetting = (settingId: string) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.id === settingId 
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
    
    toast({
      title: "Configuración actualizada",
      description: "Los cambios se han guardado correctamente",
    });
  };

  const handleSaveAll = () => {
    toast({
      title: "Éxito",
      description: "Todas las configuraciones se han guardado",
    });
  };

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background-light">
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        onMobileToggle={toggleMobileSidebar}
      />
      
      <div className="flex-1 p-6 bg-background-light min-h-screen">
        {/* Header */}
        <header className="bg-background rounded-lg shadow-soft p-6 mb-6" data-testid="settings-header">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
              aria-hidden="true"
            >
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Configuración de Notificaciones
              </h1>
              <p className="text-muted-foreground mt-1">
                Administra los permisos y configuraciones de notificaciones del sistema
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="mt-2">
            <Shield className="h-3 w-3 mr-1" />
            Panel de Administrador
          </Badge>
        </header>

        {/* Admin Info */}
        {currentUser && currentUser.name && (
          <div className="bg-background rounded-lg shadow-soft p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">
                  {currentUser.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {currentUser.name}
                </p>
                <p className="text-xs text-gray-500">
                  {currentUser.email} • {currentUser.role}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Cards */}
        <div className="space-y-4" data-testid="notification-settings-section">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Configuración por Rol</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Configura qué tipos de notificaciones recibe cada rol de usuario
            </p>
            
            <div className="space-y-4">
              {settings.map(setting => (
                <div 
                  key={setting.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  data-testid={`setting-${setting.id}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Label htmlFor={setting.id} className="font-medium cursor-pointer">
                        {setting.label}
                      </Label>
                      <Badge variant="outline" className="text-xs">
                        {setting.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {setting.description}
                    </p>
                  </div>
                  <Switch
                    id={setting.id}
                    checked={setting.enabled}
                    onCheckedChange={() => handleToggleSetting(setting.id)}
                    data-testid={`switch-${setting.id}`}
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Resumen de Permisos</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {settings.map(setting => (
                <div 
                  key={`summary-${setting.id}`}
                  className={`p-4 border rounded-lg ${setting.enabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={setting.enabled ? "default" : "secondary"}>
                      {setting.role}
                    </Badge>
                    {setting.enabled && (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <p className="text-sm font-medium">
                    {setting.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {setting.enabled ? 'Activo' : 'Desactivado'}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/notifications')}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveAll}
              data-testid="save-settings-button"
            >
              Guardar Cambios
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
