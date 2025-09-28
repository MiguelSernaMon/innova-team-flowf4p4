import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/lib/api";
import { Loader2, Eye, EyeOff } from "lucide-react";
import teamIllustration from "@/assets/team-illustration.png";
import SkipLink from "./SkipLink";
import StatusAnnouncer from "./StatusAnnouncer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [statusMessage, setStatusMessage] = useState("");
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!email) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "El email no es válido";
    }
    
    if (!password) {
      newErrors.password = "La contraseña es requerida";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setStatusMessage("Por favor, corrige los errores en el formulario");
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    setStatusMessage("Iniciando sesión...");
    
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        setStatusMessage("¡Sesión iniciada exitosamente! Redirigiendo...");
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión exitosamente",
          variant: "default",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al iniciar sesión";
      setErrors({ 
        general: errorMessage
      });
      setStatusMessage(`Error: ${errorMessage}`);
      toast({
        title: "Error",
        description: "Credenciales inválidas. Intenta con demo@example.com / demo1234",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SkipLink />
      <StatusAnnouncer message={statusMessage} />
      
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-6xl overflow-hidden shadow-elegant">
          <div className="flex min-h-[600px]">
            {/* Left Side - Illustration */}
            <div className="flex-1 bg-dark-blue text-dark-blue-foreground p-8 flex flex-col items-center justify-center text-center">
              <div className="w-full max-w-md mb-8">
                <img 
                  src={teamIllustration} 
                  alt="Equipo de estudiantes colaborando en proyectos de software, trabajando juntos en computadoras"
                  className="w-full h-auto rounded-lg shadow-soft"
                />
              </div>
              <div className="max-w-md">
                <h2 className="text-2xl font-semibold leading-relaxed mb-4">
                  Forma equipos multidisciplinarios y desarrolla productos innovadores
                </h2>
                <p className="text-lg opacity-90">
                  Conecta con estudiantes de Ingeniería de Software y crea soluciones reales
                </p>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 p-8 flex items-center justify-center bg-background">
              <div className="w-full max-w-md">
                {/* Logo Section */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="w-8 h-8" role="img" aria-label="Logo InnoSistemas">
                      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
                        <path d="M8 32L20 8L32 32H8Z" fill="hsl(var(--primary))" />
                        <circle cx="20" cy="20" r="6" fill="hsl(var(--secondary))" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-bold">
                        <span className="text-foreground">Inno</span>
                        <span className="text-primary">sistemas</span>
                      </div>
                      <div className="text-sm text-muted-foreground -mt-1">
                        Innovate & Develop Systems
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Section */}
                <main id="main-content">
                  <h1 className="text-xl font-semibold mb-6 text-center">
                    Iniciar Sesión
                  </h1>

                  {errors.general && (
                    <div 
                      className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm"
                      role="alert"
                      aria-live="polite"
                    >
                      {errors.general}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Ingresa tu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={errors.email ? "border-destructive focus:ring-destructive" : ""}
                        disabled={isLoading}
                        required
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        autoComplete="email"
                      />
                      {errors.email && (
                        <p 
                          id="email-error" 
                          className="text-sm text-destructive"
                          role="alert"
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña *</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Ingresa tu contraseña"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={errors.password ? "border-destructive focus:ring-destructive pr-10" : "pr-10"}
                          disabled={isLoading}
                          required
                          aria-invalid={!!errors.password}
                          aria-describedby={errors.password ? "password-error" : "password-help"}
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                      <p id="password-help" className="text-xs text-muted-foreground">
                        La contraseña debe tener al menos 6 caracteres
                      </p>
                      {errors.password && (
                        <p 
                          id="password-error" 
                          className="text-sm text-destructive"
                          role="alert"
                        >
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full btn-hero"
                      disabled={isLoading}
                      aria-describedby="login-status"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Iniciando sesión...
                        </>
                      ) : (
                        "Iniciar Sesión"
                      )}
                    </Button>
                  </form>

                </main>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}