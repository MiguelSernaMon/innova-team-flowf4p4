import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import PlaceholderPage from "@/components/PlaceholderPage";
import { User } from "lucide-react";

export default function ProfilePage() {
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
        title="Perfil de Usuario"
        description="Gestiona tu información personal, revisa tu progreso académico y configura tus preferencias."
        icon={User}
      />
    </div>
  );
}