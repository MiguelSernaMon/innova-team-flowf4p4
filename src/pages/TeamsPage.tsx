import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import PlaceholderPage from "@/components/PlaceholderPage";
import { Users } from "lucide-react";

export default function TeamsPage() {
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
        title="Gestión de Equipos"
        description="Forma equipos multidisciplinarios, colabora con otros estudiantes y gestiona tus proyectos de manera eficiente."
        icon={Users}
      />
    </div>
  );
}