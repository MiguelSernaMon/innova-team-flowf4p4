import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { mockPermissionsAPI } from "@/lib/mock-api";
import type { NotificationPermission, NotificationType } from "@/lib/types";
import LoadingSpinner from "./LoadingSpinner";
import StatusAnnouncer from "./StatusAnnouncer";
import { Shield, Save, AlertCircle } from "lucide-react";

export default function PermissionConfigurationPage() {
  const [permissions, setPermissions] = useState<NotificationPermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");
  
  const { toast } = useToast();

  const notificationTypes: { value: NotificationType; label: string }[] = [
    { value: 'alert', label: 'Alertas' },
    { value: 'team', label: 'Equipo' },
    { value: 'admin', label: 'Admin' },
    { value: 'project', label: 'Proyecto' },
  ];

  // Load permissions configuration
  useEffect(() => {
    loadPermissions();
    
    // Get current user role
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    setCurrentUserRole(user?.role || '');
  }, []);

  const loadPermissions = async () => {
    try {
      setIsLoading(true);
      setStatusMessage("Cargando configuración de permisos...");
      
      const config = await mockPermissionsAPI.getPermissionConfig();
      setPermissions(config.permissions);
      setStatusMessage("Configuración cargada exitosamente");
    } catch (error) {
      const errorMessage = "Error al cargar la configuración";
      setStatusMessage(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePermission = (
    roleId: string,
    type: NotificationType,
    permissionType: 'canReceive' | 'canSend'
  ) => {
    setPermissions(prevPermissions =>
      prevPermissions.map(perm => {
        if (perm.roleId === roleId) {
          const currentPerms = perm[permissionType];
          const hasPermission = currentPerms.includes(type);
          
          return {
            ...perm,
            [permissionType]: hasPermission
              ? currentPerms.filter(t => t !== type)
              : [...currentPerms, type],
          };
        }
        return perm;
      })
    );
  };

  const saveChanges = async () => {
    try {
      setIsSaving(true);
      setStatusMessage("Guardando cambios...");

      // Save all permission changes
      for (const perm of permissions) {
        await mockPermissionsAPI.updatePermissions(perm.roleId, {
          roleId: perm.roleId,
          canReceive: perm.canReceive,
          canSend: perm.canSend,
        });
      }

      setStatusMessage("Configuración actualizada exitosamente");
      toast({
        title: "Éxito",
        description: "Configuración actualizada exitosamente",
        variant: "default",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al guardar cambios";
      setStatusMessage(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6 bg-background-light min-h-screen">
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" text="Cargando configuración..." />
        </div>
      </div>
    );
  }

  // Check if user is admin
  if (currentUserRole !== 'ADMIN') {
    return (
      <>
        <StatusAnnouncer message={statusMessage} />
        <div className="flex-1 p-6 bg-background-light min-h-screen">
          <Card className="p-8 text-center max-w-2xl mx-auto">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acceso Denegado</h2>
            <p className="text-muted-foreground">
              Solo los administradores pueden configurar permisos de notificaciones.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Tu rol actual: <Badge variant="outline">{currentUserRole}</Badge>
            </p>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <StatusAnnouncer message={statusMessage} />
      
      <div className="flex-1 p-6 bg-background-light min-h-screen">
        {/* Header */}
        <header className="bg-background rounded-lg shadow-soft p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Configuración de Permisos
                </h1>
                <p className="text-sm text-muted-foreground">
                  Gestiona qué roles pueden recibir y enviar cada tipo de notificación
                </p>
              </div>
            </div>

            <Button
              onClick={saveChanges}
              disabled={isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </header>

        {/* Permissions Grid */}
        <div className="space-y-6">
          {permissions.map((permission) => (
            <Card key={permission.roleId} className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  {permission.roleName}
                  <Badge variant="outline">{permission.roleId}</Badge>
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Can Receive */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <span>📥</span>
                    Puede Recibir
                  </h4>
                  <div className="space-y-2">
                    {notificationTypes.map((type) => {
                      const isChecked = permission.canReceive.includes(type.value);
                      return (
                        <div key={`receive-${permission.roleId}-${type.value}`} className="flex items-center space-x-2">
                          <Checkbox
                            id={`receive-${permission.roleId}-${type.value}`}
                            checked={isChecked}
                            onCheckedChange={() =>
                              togglePermission(permission.roleId, type.value, 'canReceive')
                            }
                          />
                          <label
                            htmlFor={`receive-${permission.roleId}-${type.value}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {type.label}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Can Send */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <span>📤</span>
                    Puede Enviar
                  </h4>
                  <div className="space-y-2">
                    {notificationTypes.map((type) => {
                      const isChecked = permission.canSend.includes(type.value);
                      return (
                        <div key={`send-${permission.roleId}-${type.value}`} className="flex items-center space-x-2">
                          <Checkbox
                            id={`send-${permission.roleId}-${type.value}`}
                            checked={isChecked}
                            onCheckedChange={() =>
                              togglePermission(permission.roleId, type.value, 'canSend')
                            }
                          />
                          <label
                            htmlFor={`send-${permission.roleId}-${type.value}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {type.label}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Help Text */}
        <Card className="mt-6 p-4 bg-primary/5 border-primary/20">
          <p className="text-sm text-muted-foreground">
            <strong>Nota:</strong> Los cambios se aplicarán inmediatamente después de guardar.
            Los usuarios verán solo las notificaciones que su rol está autorizado a recibir.
          </p>
        </Card>
      </div>
    </>
  );
}
