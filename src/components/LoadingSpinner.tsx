import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export default function LoadingSpinner({ size = "md", text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  return (
    <div 
      className="flex flex-col items-center justify-center gap-2"
      role="status"
      aria-live="polite"
      aria-label={text ? `Cargando: ${text}` : "Cargando contenido"}
    >
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      {text && (
        <span className="text-sm text-muted-foreground">
          {text}
        </span>
      )}
      <span className="sr-only">
        {text ? `Cargando: ${text}` : "Cargando contenido, por favor espere"}
      </span>
    </div>
  );
}