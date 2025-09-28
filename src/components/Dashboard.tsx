import { useState, useEffect } from "react";
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
import { notificationsAPI, type Notification, type NotificationStats } from "@/lib/api";
import NotificationCard from "./NotificationCard";
import LoadingSpinner from "./LoadingSpinner";
import StatusAnnouncer from "./StatusAnnouncer";
import { 
  Bell, 
  Search, 
  Filter, 
  Eye,
  Loader2
} from "lucide-react";

export default function Dashboard() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({ total: 0, unread: 0, read: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  
  const { toast } = useToast();

  const filterOptions = [
    { value: "all", label: "Todas" },
    { value: "alert", label: "Alertas" },
    { value: "team", label: "Equipos" },
    { value: "admin", label: "Admin" },
    { value: "project", label: "Proyectos" },
  ];

  // Load notifications
  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      setStatusMessage("Cargando notificaciones...");
      const response = await notificationsAPI.getNotifications({
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
      await notificationsAPI.markAsRead(notificationId);
      
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
      await notificationsAPI.markAllAsRead();
      
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
    // In a real app, this would use react-router navigation
    console.log("Navigating to:", link);
    toast({
      title: "Navegación",
      description: `Redirigiendo a: ${link}`,
    });
  };

  return (
    <>
      <StatusAnnouncer message={statusMessage} />
      
      <div className="flex-1 p-6 bg-background-light min-h-screen">
        {/* Header */}
        <header className="bg-background rounded-lg shadow-soft p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Left side - Title and bell */}
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-foreground">Notificaciones</h1>
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative"
                  aria-label={`Notificaciones. ${stats.unread} sin leer de ${stats.total} total`}
                >
                  <Bell className="h-6 w-6" />
                  {stats.unread > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                      aria-label={`${stats.unread} notificaciones sin leer`}
                    >
                      {stats.unread}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>

            {/* Right side - Search and filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  placeholder="Buscar notificaciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  aria-label="Buscar en notificaciones"
                />
              </div>

              {/* Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    aria-label={`Filtrar por: ${filterOptions.find(opt => opt.value === typeFilter)?.label}`}
                  >
                    <Filter className="h-4 w-4" />
                    {filterOptions.find(opt => opt.value === typeFilter)?.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {filterOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setTypeFilter(option.value)}
                      className={typeFilter === option.value ? "bg-accent" : ""}
                      aria-current={typeFilter === option.value ? "true" : "false"}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mark all as read */}
              <Button 
                variant="outline" 
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAllRead || stats.unread === 0}
                className="gap-2"
                aria-label="Marcar todas las notificaciones como leídas"
              >
                {isMarkingAllRead ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                Ver todas
              </Button>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6" aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">Estadísticas de notificaciones</h2>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground" aria-label={`${stats.total} notificaciones en total`}>
              {stats.total}
            </div>
            <div className="text-sm text-muted-foreground">Total</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary" aria-label={`${stats.unread} notificaciones sin leer`}>
              {stats.unread}
            </div>
            <div className="text-sm text-muted-foreground">Sin leer</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-muted-foreground" aria-label={`${stats.read} notificaciones leídas`}>
              {stats.read}
            </div>
            <div className="text-sm text-muted-foreground">Leídas</div>
          </Card>
        </section>

        {/* Notifications List */}
        <main id="main-content">
          <h2 className="sr-only">Lista de notificaciones</h2>
          <div className="space-y-4" role="region" aria-label="Notificaciones">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" text="Cargando notificaciones..." />
              </div>
            ) : notifications.length === 0 ? (
              <Card className="p-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No hay notificaciones
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery || typeFilter !== "all" 
                    ? "No se encontraron notificaciones con los filtros actuales"
                    : "No tienes notificaciones en este momento"
                  }
                </p>
              </Card>
            ) : (
              <ul className="space-y-4" role="list">
                {notifications.map((notification) => (
                  <li key={notification.id}>
                    <NotificationCard
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onNavigate={handleNavigate}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </>
  );
}