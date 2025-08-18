import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
  variant?: "default" | "primary" | "accent";
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  variant = "default"
}: StatCardProps) {
  const variantStyles = {
    default: "bg-card border-border",
    primary: "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20",
    accent: "bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20"
  };

  return (
    <div
      className={cn(
        "relative p-6 rounded-2xl border shadow-soft",
        "transition-all duration-standard ease-out",
        "hover:shadow-medium hover:-translate-y-1",
        "group overflow-hidden",
        variantStyles[variant],
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-primary rounded-full" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-primary rounded-full" />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <p className="text-3xl font-bold text-foreground">
              {value}
            </p>
          </div>
          {Icon && (
            <div className={cn(
              "p-3 rounded-xl",
              variant === "primary" ? "bg-primary/10" : 
              variant === "accent" ? "bg-accent/10" : "bg-muted"
            )}>
              <Icon className={cn(
                "w-6 h-6",
                variant === "primary" ? "text-primary" :
                variant === "accent" ? "text-accent-foreground" : "text-muted-foreground"
              )} />
            </div>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground mb-3">
            {description}
          </p>
        )}

        {/* Trend */}
        {trend && (
          <div className="flex items-center gap-1">
            <span className={cn(
              "text-xs font-medium px-2 py-1 rounded-pill",
              trend.value > 0 
                ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                : trend.value < 0
                ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                : "bg-muted text-muted-foreground"
            )}>
              {trend.value > 0 ? "+" : ""}{trend.value}%
            </span>
            <span className="text-xs text-muted-foreground">
              {trend.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}