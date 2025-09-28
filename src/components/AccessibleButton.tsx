import { Button, ButtonProps } from "@/components/ui/button";
import { forwardRef } from "react";

interface AccessibleButtonProps extends ButtonProps {
  "aria-label"?: string;
  "aria-describedby"?: string;
  isLoading?: boolean;
  loadingText?: string;
}

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ 
    children, 
    isLoading = false, 
    loadingText = "Cargando...",
    disabled,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedBy,
    ...props 
  }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || isLoading}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? loadingText : children}
      </Button>
    );
  }
);

AccessibleButton.displayName = "AccessibleButton";

export default AccessibleButton;