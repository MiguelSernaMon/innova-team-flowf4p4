import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/lib/api";
import { 
  User, 
  Bell, 
  Users, 
  FolderOpen, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileToggle: () => void;
}

export default function Sidebar({ isMobileOpen, onMobileToggle }: SidebarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const navigationItems = [
    {
      name: "Perfil",
      href: "/profile",
      icon: User,
      current: false,
    },
    {
      name: "Notificaciones", 
      href: "/dashboard",
      icon: Bell,
      current: true,
    },
    {
      name: "Equipos",
      href: "/teams",
      icon: Users,
      current: false,
    },
    {
      name: "Proyectos",
      href: "/projects", 
      icon: FolderOpen,
      current: false,
    },
    {
      name: "Estadísticas",
      href: "/stats",
      icon: BarChart3,
      current: false,
    },
    {
      name: "Configuración",
      href: "/settings",
      icon: Settings,
      current: false,
    },
  ];

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authAPI.logout();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al cerrar sesión",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8" role="img" aria-label="Logo InnoSistemas">
            <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
              <path d="M8 32L20 8L32 32H8Z" fill="hsl(var(--primary))" />
              <circle cx="20" cy="20" r="6" fill="hsl(var(--secondary))" />
            </svg>
          </div>
          <div className="text-left">
            <div className="text-xl font-bold">
              <span className="text-sidebar-foreground">Inno</span>
              <span className="text-primary">sistemas</span>
            </div>
            <div className="text-xs text-muted-foreground -mt-1">
              Innovate & Develop Systems
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6" aria-label="Navegación principal">
        <ul className="space-y-2" role="list">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`
                  }
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      onMobileToggle();
                    }
                  }}
                >
                  {({ isActive }) => (
                    <>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      {item.name}
                      {isActive && <span className="sr-only">(página actual)</span>}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          onClick={handleLogout}
          disabled={isLoading}
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2"
          aria-label={isLoading ? "Cerrando sesión..." : "Cerrar sesión"}
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
          {isLoading ? "Cerrando..." : "Cerrar Sesión"}
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        onClick={onMobileToggle}
        aria-label={isMobileOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
        aria-expanded={isMobileOpen}
        aria-controls="mobile-sidebar"
      >
        {isMobileOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onMobileToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="mobile-sidebar"
        className={`
          fixed md:static inset-y-0 left-0 z-50 w-80 bg-sidebar border-r border-sidebar-border
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          flex flex-col
        `}
        aria-label="Barra lateral de navegación"
      >
        {sidebarContent}
      </aside>
    </>
  );
}