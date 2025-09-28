import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import PlaceholderPage from "@/components/PlaceholderPage";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-background-light">
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        onMobileToggle={toggleMobileSidebar}
      />
      <PlaceholderPage
        title="Configuración"
        description="Personaliza tu experiencia, administra notificaciones y configura las preferencias de la plataforma."
        icon={Settings}
      />
    </div>
  );
}