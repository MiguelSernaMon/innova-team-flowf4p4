import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";

export default function DashboardPage() {
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
      <Dashboard />
    </div>
  );
}