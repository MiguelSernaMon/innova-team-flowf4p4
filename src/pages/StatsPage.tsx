import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import PlaceholderPage from "@/components/PlaceholderPage";
import { BarChart3 } from "lucide-react";

export default function StatsPage() {
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
        title="Estadísticas y Analytics"
        description="Visualiza tu progreso, rendimiento del equipo y métricas de desarrollo de proyectos."
        icon={BarChart3}
      />
    </div>
  );
}