import { useState } from "react";
import { cn } from "@/lib/utils";
import GermanyFlag from "@/assets/germany logo.png";
import UKFlag from "@/assets/uk logo.png";

type Country = "DE" | "UK";

interface CountryToggleProps {
  value: Country;
  onChange: (country: Country) => void;
  className?: string;
}

export function CountryToggle({ value, onChange, className }: CountryToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center p-1 bg-muted rounded-pill",
        "border border-border/50",
        className
      )}
    >
      <button
        onClick={() => onChange("DE")}
        className={cn(
          "flex items-center gap-2 rounded-pill transition-all duration-micro ease-out text-sm font-medium",
          // Desktop styling
          "px-4 py-2",
          // Mobile styling - smaller padding and no gap for text
          "sm:px-4 sm:py-2 px-2 py-1.5 sm:gap-2 gap-0",
          value === "DE"
            ? "bg-primary text-primary-foreground shadow-soft"
            : "text-muted-foreground hover:text-foreground"
        )}
        title="Germany" // Tooltip for mobile users
      >
        <img 
          src={GermanyFlag} 
          alt="Germany Flag" 
          className="w-6 h-4 object-cover rounded-sm flex-shrink-0" 
        />
        <span className="hidden sm:inline">Germany</span>
      </button>
      <button
        onClick={() => onChange("UK")}
        className={cn(
          "flex items-center gap-2 rounded-pill transition-all duration-micro ease-out text-sm font-medium",
          // Desktop styling
          "px-4 py-2",
          // Mobile styling - smaller padding and no gap for text
          "sm:px-4 sm:py-2 px-2 py-1.5 sm:gap-2 gap-0",
          value === "UK"
            ? "bg-primary text-primary-foreground shadow-soft"
            : "text-muted-foreground hover:text-foreground"
        )}
        title="United Kingdom" // Tooltip for mobile users
      >
        <img 
          src={UKFlag} 
          alt="UK Flag" 
          className="w-6 h-4 object-cover rounded-sm flex-shrink-0" 
        />
        <span className="hidden sm:inline">United Kingdom</span>
      </button>
    </div>
  );
}