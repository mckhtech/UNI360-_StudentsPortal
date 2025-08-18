import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  FileText,
  GraduationCap,
  Plane,
  User,
  MoreHorizontal
} from "lucide-react";
import { useState } from "react";

const primaryNavItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Applications", url: "/applications", icon: FileText },
  { title: "Universities", url: "/universities", icon: GraduationCap },
  { title: "Visa", url: "/visa", icon: Plane },
  { title: "Profile", url: "/profile", icon: User },
];

const overflowNavItems = [
  { title: "Finances", url: "/finances" },
  { title: "Documents", url: "/documents" },
  { title: "Resources", url: "/resources" },
  { title: "AI Tools", url: "/ai-tools" },
  { title: "Settings", url: "/settings" },
];

export function BottomNavigation() {
  const [showOverflow, setShowOverflow] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-2",
            "bg-gradient-glass backdrop-blur-xl border border-border/50",
            "rounded-pill shadow-float"
          )}
        >
          {primaryNavItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <NavLink
                key={item.url}
                to={item.url}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2",
                  "rounded-xl transition-all duration-micro ease-out",
                  "min-w-[48px] min-h-[48px] justify-center",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium leading-none">
                  {item.title}
                </span>
              </NavLink>
            );
          })}
          
          {/* Overflow Menu Button */}
          <button
            onClick={() => setShowOverflow(!showOverflow)}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2",
              "rounded-xl transition-all duration-micro ease-out",
              "min-w-[48px] min-h-[48px] justify-center",
              "text-muted-foreground hover:text-foreground"
            )}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-xs font-medium leading-none">More</span>
          </button>
        </div>
      </nav>

      {/* Overflow Menu */}
      {showOverflow && (
        <>
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setShowOverflow(false)}
          />
          <div
            className={cn(
              "fixed bottom-24 left-1/2 -translate-x-1/2 z-50 md:hidden",
              "bg-gradient-glass backdrop-blur-xl border border-border/50",
              "rounded-2xl shadow-float p-2 min-w-48",
              "animate-scale-in"
            )}
          >
            {overflowNavItems.map((item) => (
              <NavLink
                key={item.url}
                to={item.url}
                onClick={() => setShowOverflow(false)}
                className={cn(
                  "flex items-center px-4 py-3 rounded-xl",
                  "transition-all duration-micro ease-out",
                  "text-foreground hover:bg-muted",
                  "font-medium"
                )}
              >
                {item.title}
              </NavLink>
            ))}
          </div>
        </>
      )}
    </>
  );
}