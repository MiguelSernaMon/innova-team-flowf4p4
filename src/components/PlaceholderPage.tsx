import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export default function PlaceholderPage({ 
  title, 
  description, 
  icon: Icon = Construction 
}: PlaceholderPageProps) {
  const navigate = useNavigate();

  return (
    <div className="flex-1 p-6 bg-background-light min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al Dashboard
        </Button>

        {/* Main Content */}
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon className="h-10 w-10 text-primary" />
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {title}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              {description}
            </p>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Esta sección está en desarrollo y estará disponible próximamente.
              </p>
              
              <Button onClick={() => navigate("/dashboard")} className="btn-hero">
                Ir al Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}