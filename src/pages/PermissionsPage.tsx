import Sidebar from "@/components/Sidebar";
import PermissionConfigurationPage from "@/components/PermissionConfigurationPage";
import { useState } from "react";

export default function PermissionsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background-light">
      <Sidebar 
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      <div className="flex-1 overflow-auto">
        <PermissionConfigurationPage />
      </div>
    </div>
  );
}
