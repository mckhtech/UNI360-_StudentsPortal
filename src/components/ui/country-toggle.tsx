import { useState } from "react";
import { cn } from "@/lib/utils";

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
          "flex items-center gap-2 px-4 py-2 rounded-pill",
          "transition-all duration-micro ease-out",
          "text-sm font-medium",
          value === "DE"
            ? "bg-primary text-primary-foreground shadow-soft"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <span className="text-lg">🇩🇪</span>
        Germany
      </button>
      <button
        onClick={() => onChange("UK")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-pill",
          "transition-all duration-micro ease-out",
          "text-sm font-medium",
          value === "UK"
            ? "bg-primary text-primary-foreground shadow-soft"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <span className="text-lg">🇬🇧</span>
        United Kingdom
      </button>
    </div>
  );
}