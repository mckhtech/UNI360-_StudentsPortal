import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  FileText,
  GraduationCap,
  Plane,
  CreditCard,
  FolderOpen,
  BookOpen,
  Bot,
  Settings,
  LogOut,
  ChevronRight
} from "lucide-react";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Applications", url: "/applications", icon: FileText },
  { title: "Universities", url: "/universities", icon: GraduationCap },
  { title: "Visa", url: "/visa", icon: Plane },
  { title: "Finances", url: "/finances", icon: CreditCard },
  { title: "Documents", url: "/documents", icon: FolderOpen },
  { title: "Resources", url: "/resources", icon: BookOpen },
  { title: "AI Tools", url: "/ai-tools", icon: Bot },
];

export function FloatingSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Desktop/Tablet Floating Sidebar */}
      <aside
        className={cn(
          "fixed left-6 top-1/2 -translate-y-1/2 z-50",
          "hidden md:flex flex-col",
          "bg-gradient-glass backdrop-blur-xl border border-border/50",
          "shadow-float transition-all duration-standard ease-out",
          "rounded-2xl overflow-hidden",
          isExpanded ? "w-72" : "w-16"
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Navigation Items */}
        <nav className="flex-1 p-2">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <NavLink
                  key={item.url}
                  to={item.url}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl",
                    "transition-all duration-micro ease-out",
                    "group relative overflow-hidden",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span
                    className={cn(
                      "font-medium transition-all duration-standard",
                      isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                    )}
                  >
                    {item.title}
                  </span>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-xl" />
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Profile Section */}
        <div className="border-t border-border/50 p-2">
          <NavLink
            to="/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl",
              "transition-all duration-micro ease-out",
              "text-muted-foreground hover:text-foreground hover:bg-muted",
              location.pathname === "/settings" && "bg-primary text-primary-foreground shadow-soft"
            )}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span
              className={cn(
                "font-medium transition-all duration-standard",
                isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
              )}
            >
              Settings
            </span>
          </NavLink>
          
          <button
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
              "transition-all duration-micro ease-out",
              "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span
              className={cn(
                "font-medium transition-all duration-standard",
                isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
              )}
            >
              Sign Out
            </span>
          </button>
        </div>

        {/* Expand Indicator */}
        <div className="absolute -right-3 top-1/2 -translate-y-1/2">
          <div
            className={cn(
              "w-6 h-8 bg-gradient-glass backdrop-blur-xl border border-border/50",
              "rounded-r-lg flex items-center justify-center",
              "transition-transform duration-standard",
              isExpanded && "rotate-180"
            )}
          >
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
          </div>
        </div>
      </aside>
    </>
  );
}