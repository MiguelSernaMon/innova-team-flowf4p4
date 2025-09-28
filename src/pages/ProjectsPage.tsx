import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import PlaceholderPage from "@/components/PlaceholderPage";
import { FolderOpen } from "lucide-react";

export default function ProjectsPage() {
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
        title="Proyectos"
        description="Desarrolla productos mínimos viables (MVPs), gestiona el progreso de tus proyectos y recibe retroalimentación."
        icon={FolderOpen}
      />
    </div>
  );
}