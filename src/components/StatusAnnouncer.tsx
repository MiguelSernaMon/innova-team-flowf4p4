import { useEffect, useState } from "react";

interface StatusAnnouncerProps {
  message?: string;
  priority?: "polite" | "assertive";
}

export default function StatusAnnouncer({ 
  message, 
  priority = "polite" 
}: StatusAnnouncerProps) {
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (message) {
      // Clear first to ensure re-announcement
      setAnnouncement("");
      // Use setTimeout to ensure the clearing is processed
      const timer = setTimeout(() => {
        setAnnouncement(message);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}