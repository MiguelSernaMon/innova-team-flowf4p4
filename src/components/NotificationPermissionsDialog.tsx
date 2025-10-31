import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface NotificationPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
}

interface RolePermission {
  id: string;
  name: string;
  canView: boolean;
}

export default function NotificationPermissionsDialog({
  open,
  onOpenChange,
  teamId,
}: NotificationPermissionsDialogProps) {
  const { toast } = useToast();
  
  // Mock data - en producción vendría de la API
  const [roles, setRoles] = useState<RolePermission[]>([
    { id: "rol1", name: "Rol 1", canView: true },
    { id: "rol2", name: "Rol 2", canView: false },
    { id: "rol3", name: "Rol 3", canView: false },
  ]);

  const handleRoleToggle = (roleId: string) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.id === roleId ? { ...role, canView: !role.canView } : role
      )
    );
  };

  const handleSave = () => {
    // Aquí se guardarían los permisos en la API
    toast({
      title: "Configuración actualizada exitosamente",
      description: "Los permisos de notificación han sido guardados",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-primary">
            Quién puede ver la notificación
          </DialogTitle>
          <DialogDescription className="sr-only">
            Selecciona los roles que pueden ver las notificaciones de este equipo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {roles.map((role) => (
            <div key={role.id} className="flex items-center space-x-3">
              <Checkbox
                id={role.id}
                checked={role.canView}
                onCheckedChange={() => handleRoleToggle(role.id)}
                className="border-2"
              />
              <Label
                htmlFor={role.id}
                className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {role.name}
              </Label>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
