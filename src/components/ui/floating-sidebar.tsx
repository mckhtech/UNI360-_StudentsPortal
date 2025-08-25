import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
  MoreHorizontal
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Documents", url: "/documents", icon: FolderOpen },
  { title: "Universities", url: "/universities", icon: GraduationCap },
  { title: "Applications", url: "/applications", icon: FileText },
  { title: "AI Tools", url: "/ai-tools", icon: Bot },
  { title: "Finances", url: "/finances", icon: CreditCard },
  { title: "Visa", url: "/visa", icon: Plane },
  { title: "Resources", url: "/resources", icon: BookOpen },
 
];

// Primary navigation items for mobile (most important ones)
const primaryNavItems = navigationItems.slice(0, 4);

export function FloatingSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      navigate('/login');
    }
  };

  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);
  const closeMobileMenu = () => setShowMobileMenu(false);

  return (
    <>
      {/* Desktop/Tablet Floating Sidebar */}
      <aside
        className={cn(
          "fixed left-6 top-1/2 -translate-y-1/2 z-50",
          "hidden lg:flex flex-col",
          "bg-gradient-glass backdrop-blur-xl border border-border/50",
          "shadow-float transition-all duration-300 ease-out",
          "rounded-2xl overflow-hidden",
          "min-h-[400px] max-h-[80vh]",
          isExpanded ? "w-72" : "w-16"
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Navigation Items */}
        <nav className="flex-1 p-2 overflow-y-auto scrollbar-hide">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <NavLink
                  key={item.url}
                  to={item.url}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl",
                    "transition-all duration-200 ease-out",
                    "group relative overflow-hidden",
                    "whitespace-nowrap",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span
                    className={cn(
                      "font-medium transition-all duration-300 ease-out",
                      isExpanded 
                        ? "opacity-100 translate-x-0 delay-100" 
                        : "opacity-0 -translate-x-2 delay-0"
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

        {/* Desktop Profile Section */}
        <div className="border-t border-border/50 p-2 flex-shrink-0">
          <NavLink
            to="/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl",
              "transition-all duration-200 ease-out",
              "text-muted-foreground hover:text-foreground hover:bg-muted",
              "whitespace-nowrap",
              location.pathname === "/settings" && "bg-primary text-primary-foreground shadow-soft"
            )}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span
              className={cn(
                "font-medium transition-all duration-300 ease-out",
                isExpanded 
                  ? "opacity-100 translate-x-0 delay-100" 
                  : "opacity-0 -translate-x-2 delay-0"
              )}
            >
              Profile Settings
            </span>
          </NavLink>
          
          <button
            onClick={handleSignOut}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
              "transition-all duration-200 ease-out",
              "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
              "whitespace-nowrap"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span
              className={cn(
                "font-medium transition-all duration-300 ease-out",
                isExpanded 
                  ? "opacity-100 translate-x-0 delay-100" 
                  : "opacity-0 -translate-x-2 delay-0"
              )}
            >
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile/Tablet Floating Pill Navigation */}
      <div className="lg:hidden">
        {/* Mobile Menu Overlay */}
        {showMobileMenu && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[45]"
            onClick={closeMobileMenu}
          />
        )}

        {/* Expanded Mobile Menu */}
        {showMobileMenu && (
          <div
            className={cn(
              "fixed bottom-24 left-1/2 -translate-x-1/2 z-50",
              "bg-gradient-glass backdrop-blur-xl border border-border/50",
              "shadow-float rounded-3xl p-3",
              "animate-in slide-in-from-bottom-5 duration-300",
              "w-[90vw] max-w-md"
            )}
          >
            <div className="grid grid-cols-2 gap-2">
              {navigationItems.slice(4).map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <NavLink
                    key={item.url}
                    to={item.url}
                    onClick={closeMobileMenu}
                    className={cn(
                      "flex flex-col items-center gap-2 px-4 py-3 rounded-2xl",
                      "transition-all duration-200 ease-out",
                      "group relative overflow-hidden",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className="w-6 h-6 flex-shrink-0" />
                    <span className="text-sm font-medium text-center">
                      {item.title}
                    </span>
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-2xl" />
                    )}
                  </NavLink>
                );
              })}
              
              {/* Settings in expanded menu */}
              <NavLink
                to="/settings"
                onClick={closeMobileMenu}
                className={cn(
                  "flex flex-col items-center gap-2 px-4 py-3 rounded-2xl",
                  "transition-all duration-200 ease-out",
                  "text-muted-foreground hover:text-foreground hover:bg-muted",
                  location.pathname === "/settings" && "bg-primary text-primary-foreground shadow-soft"
                )}
              >
                <Settings className="w-6 h-6 flex-shrink-0" />
                <span className="text-sm font-medium text-center">Settings</span>
              </NavLink>
              
              {/* Sign Out in expanded menu */}
              <button
                onClick={() => {
                  closeMobileMenu();
                  handleSignOut();
                }}
                className={cn(
                  "flex flex-col items-center gap-2 px-4 py-3 rounded-2xl",
                  "transition-all duration-200 ease-out",
                  "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                )}
              >
                <LogOut className="w-6 h-6 flex-shrink-0" />
                <span className="text-sm font-medium text-center">Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Floating Pill Navigation */}
        <nav
          className={cn(
            "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
            "bg-gradient-glass backdrop-blur-xl border border-border/50",
            "shadow-float rounded-full px-2 py-2",
            "flex items-center gap-1"
          )}
        >
          {/* Primary Navigation Items */}
          {primaryNavItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <NavLink
                key={item.url}
                to={item.url}
                className={cn(
                  "flex items-center justify-center",
                  "w-12 h-12 rounded-full",
                  "transition-all duration-200 ease-out",
                  "group relative overflow-hidden",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft scale-110"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted hover:scale-105"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-full" />
                )}
              </NavLink>
            );
          })}

          {/* More Button */}
          <button
            onClick={toggleMobileMenu}
            className={cn(
              "flex items-center justify-center",
              "w-12 h-12 rounded-full",
              "transition-all duration-200 ease-out",
              "text-muted-foreground hover:text-foreground hover:bg-muted hover:scale-105",
              showMobileMenu && "bg-muted text-foreground scale-105"
            )}
          >
            <MoreHorizontal className="w-5 h-5 flex-shrink-0" />
          </button>
        </nav>
      </div>
    </>
  );
}