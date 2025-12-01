import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { mockNotificationsAPI, mockPermissionsAPI } from "@/lib/mock-api";
import type { Notification, NotificationStats } from "@/lib/types";
import NotificationCard from "@/components/NotificationCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatusAnnouncer from "@/components/StatusAnnouncer";
import { 
  Bell, 
  Search, 
  Filter, 
  Eye,
  Loader2,
  Settings
} from "lucide-react";

export default function NotificationsPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({ total: 0, unread: 0, read: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const { toast } = useToast();

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // Load current user from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  }, []);

  const filterOptions = [
    { value: "all", label: "Todas" },
    { value: "alert", label: "Alertas" },
    { value: "team", label: "Equipos" },
    { value: "admin", label: "Admin" },
    { value: "project", label: "Proyectos" },
  ];

  // Load notifications usando mock API con filtrado por rol
  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      setStatusMessage("Cargando notificaciones...");
      
      // Obtener el usuario actual del localStorage
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const userRole = user?.role || 'STUDENT';
      
      // Usar la API de permisos para obtener notificaciones filtradas por rol
      const response = await mockPermissionsAPI.getNotificationsForRole(userRole, {
        type: typeFilter,
        search: searchQuery,
      });
      
      if (response.success) {
        setNotifications(response.notifications);
        setStats(response.stats);
        setStatusMessage(`${response.notifications.length} notificaciones cargadas`);
      }
    } catch (error) {
      const errorMessage = "Error al cargar las notificaciones";
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

  // Effect to reload notifications when filters change
  useEffect(() => {
    const delayedLoad = setTimeout(() => {
      loadNotifications();
    }, 300); // Debounce search
    
    return () => clearTimeout(delayedLoad);
  }, [searchQuery, typeFilter]);

  // Initial load
  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await mockNotificationsAPI.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, status: "read" as const }
            : n
        )
      );
      
      setStats(prev => ({
        ...prev,
        unread: Math.max(0, prev.unread - 1),
        read: prev.read + 1,
      }));
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al marcar como leída",
        variant: "destructive",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setIsMarkingAllRead(true);
      await mockNotificationsAPI.markAllAsRead();
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, status: "read" as const }))
      );
      
      setStats(prev => ({
        total: prev.total,
        unread: 0,
        read: prev.total,
      }));
      
      toast({
        title: "Éxito",
        description: "Todas las notificaciones marcadas como leídas",
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al marcar todas como leídas",
        variant: "destructive",
      });
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  const handleNavigate = (link: string) => {
    console.log("Navigating to:", link);
    toast({
      title: "Navegación",
      description: `Redirigiendo a: ${link}`,
    });
  };

  return (
    <div className="flex min-h-screen bg-background-light">
      <StatusAnnouncer message={statusMessage} />
      
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        onMobileToggle={toggleMobileSidebar}
      />
      
      <div className="flex-1 p-6 bg-background-light min-h-screen">
        {/* User Info Header */}
        {currentUser && currentUser.name && (
          <div className="bg-background rounded-lg shadow-soft p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {currentUser.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground" data-testid="user-name">
                    {currentUser.name}
                  </h2>
                  <p className="text-sm text-gray-500" data-testid="user-role">
                    {currentUser.role || 'Usuario'}
                  </p>
                </div>
              </div>
              {currentUser.role === 'ADMIN' && (
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/notifications/settings'}
                  data-testid="notification-settings-button"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </Button>
              )}
            </div>
          </div>
        )}
        
        {/* Header */}
        <header className="bg-background rounded-lg shadow-soft p-6 mb-6" data-testid="notifications-header">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
                aria-hidden="true"
              >
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Notificaciones
                </h1>
                <p className="text-muted-foreground mt-1" data-testid="notification-stats">
                  {stats.total} total • {stats.unread} sin leer • {stats.read} leídas
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAllRead || stats.unread === 0}
              className="flex items-center gap-2"
              data-testid="mark-all-read-button"
              aria-label="Marcar todas las notificaciones como leídas"
            >
              {isMarkingAllRead ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              Marcar todas como leídas
            </Button>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-background rounded-lg shadow-soft p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" aria-hidden="true" />
              <Input
                type="search"
                placeholder="Buscar notificaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                aria-label="Buscar notificaciones"
                data-testid="search-notifications-input"
              />
            </div>

            {/* Type Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  aria-label="Filtrar notificaciones por tipo"
                  data-testid="filter-notifications-button"
                >
                  <Filter className="h-4 w-4" aria-hidden="true" />
                  Filtrar: {filterOptions.find(opt => opt.value === typeFilter)?.label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {filterOptions.map(option => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setTypeFilter(option.value)}
                    data-testid={`filter-option-${option.value}`}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4" data-testid="notifications-section">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : notifications.length === 0 ? (
            <Card className="p-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
              <p className="text-muted-foreground">
                No hay notificaciones
              </p>
            </Card>
          ) : (
            notifications.map(notification => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onNavigate={handleNavigate}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
