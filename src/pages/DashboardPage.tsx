import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import WebSocketNotificationHandler from "@/components/WebSocketNotificationHandler";

export default function DashboardPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-background-light">
      {/* WebSocket Handler para notificaciones en tiempo real */}
      <WebSocketNotificationHandler />
      
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        onMobileToggle={toggleMobileSidebar}
      />
      <Dashboard />
    </div>
  );
}