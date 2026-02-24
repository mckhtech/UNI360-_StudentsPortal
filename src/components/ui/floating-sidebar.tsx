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
  MessageCircle,
  Settings,
  LogOut,
  MoreHorizontal,
  X
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

// Primary navigation items for mobile (most important ones) - ensuring Dashboard is first
const primaryNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Documents", url: "/documents", icon: FolderOpen },
  { title: "Universities", url: "/universities", icon: GraduationCap },
  { title: "Applications", url: "/applications", icon: FileText },
];

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
      {/* Desktop/Tablet Floating Sidebar - Only visible on lg screens and above */}
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

      {/* Mobile Navigation - Hidden on lg screens and above */}
      <div className="lg:hidden">
        {/* Mobile Menu Overlay */}
        {showMobileMenu && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[45] touch-none"
            onClick={closeMobileMenu}
          />
        )}

        {/* Expanded Mobile Menu */}
        {showMobileMenu && (
          <div
            className={cn(
              "fixed z-50 touch-auto",
              // Positioning for different screen sizes
              "bottom-20 xs:bottom-24 sm:bottom-24 md:bottom-24",
              "left-1/2 -translate-x-1/2",
              // Responsive sizing
              "w-[95vw] max-w-sm xs:w-[90vw] xs:max-w-md sm:max-w-lg md:max-w-xl",
              "bg-gradient-glass backdrop-blur-xl border border-border/50",
              "shadow-float rounded-3xl",
              // Responsive padding
              "p-2 xs:p-3 sm:p-4",
              "animate-in slide-in-from-bottom-5 duration-300",
              // Max height to prevent overflow on small screens
              "max-h-[60vh] xs:max-h-[65vh] sm:max-h-[70vh]",
              "overflow-y-auto scrollbar-hide"
            )}
          >
            {/* Close button for better UX */}
            <div className="flex justify-between items-center mb-3 px-2">
              <span className="text-sm font-medium text-muted-foreground">More Options</span>
              <button
                onClick={closeMobileMenu}
                className={cn(
                  "flex items-center justify-center",
                  "w-8 h-8 rounded-full",
                  "text-muted-foreground hover:text-foreground hover:bg-muted",
                  "transition-all duration-200"
                )}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Grid layout responsive to screen size */}
            <div className={cn(
              "grid gap-2",
              // Responsive grid columns
              "grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3"
            )}>
              {navigationItems.slice(4).map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <NavLink
                    key={item.url}
                    to={item.url}
                    onClick={closeMobileMenu}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-2xl",
                      // Responsive padding
                      "px-3 py-3 xs:px-4 xs:py-3 sm:px-4 sm:py-4",
                      "transition-all duration-200 ease-out",
                      "group relative overflow-hidden",
                      "min-h-[4rem] xs:min-h-[4.5rem] sm:min-h-[5rem]",
                      "touch-manipulation", // Improves touch responsiveness
                      isActive
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted active:bg-muted/70"
                    )}
                  >
                    <item.icon className={cn(
                      "flex-shrink-0",
                      "w-5 h-5 xs:w-6 xs:h-6 sm:w-6 sm:h-6"
                    )} />
                    <span className={cn(
                      "font-medium text-center leading-tight",
                      "text-xs xs:text-sm sm:text-sm"
                    )}>
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
                  "flex flex-col items-center gap-2 rounded-2xl",
                  "px-3 py-3 xs:px-4 xs:py-3 sm:px-4 sm:py-4",
                  "transition-all duration-200 ease-out",
                  "min-h-[4rem] xs:min-h-[4.5rem] sm:min-h-[5rem]",
                  "touch-manipulation",
                  "text-muted-foreground hover:text-foreground hover:bg-muted active:bg-muted/70",
                  location.pathname === "/settings" && "bg-primary text-primary-foreground shadow-soft"
                )}
              >
                <Settings className={cn(
                  "flex-shrink-0",
                  "w-5 h-5 xs:w-6 xs:h-6 sm:w-6 sm:h-6"
                )} />
                <span className={cn(
                  "font-medium text-center leading-tight",
                  "text-xs xs:text-sm sm:text-sm"
                )}>
                  Settings
                </span>
              </NavLink>
              
              {/* Sign Out in expanded menu */}
              <button
                onClick={() => {
                  closeMobileMenu();
                  handleSignOut();
                }}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl",
                  "px-3 py-3 xs:px-4 xs:py-3 sm:px-4 sm:py-4",
                  "transition-all duration-200 ease-out",
                  "min-h-[4rem] xs:min-h-[4.5rem] sm:min-h-[5rem]",
                  "touch-manipulation",
                  "text-muted-foreground hover:text-destructive hover:bg-destructive/10 active:bg-destructive/20"
                )}
              >
                <LogOut className={cn(
                  "flex-shrink-0",
                  "w-5 h-5 xs:w-6 xs:h-6 sm:w-6 sm:h-6"
                )} />
                <span className={cn(
                  "font-medium text-center leading-tight",
                  "text-xs xs:text-sm sm:text-sm"
                )}>
                  Sign Out
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Main Floating Pill Navigation */}
        <nav
          className={cn(
            "fixed z-50 touch-auto",
            // Responsive positioning
            "bottom-4 xs:bottom-6 sm:bottom-6",
            "left-1/2 -translate-x-1/2",
            // Safe area handling for devices with home indicators
            "pb-safe-bottom",
            "bg-gradient-glass backdrop-blur-xl border border-border/50",
            "shadow-float rounded-full",
            // Responsive padding
            "px-1.5 py-1.5 xs:px-2 xs:py-2 sm:px-2 sm:py-2",
            "flex items-center",
            // Responsive gaps
            "gap-0.5 xs:gap-1 sm:gap-1",
            // Ensure it doesn't overflow on small screens
            "max-w-[95vw]"
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
                  "rounded-full",
                  // Responsive sizing for touch targets
                  "w-10 h-10 xs:w-12 xs:h-12 sm:w-12 sm:h-12",
                  "transition-all duration-200 ease-out",
                  "group relative overflow-hidden",
                  "touch-manipulation", // Improves touch responsiveness
                  "active:scale-95", // Provides visual feedback on touch
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft scale-105 xs:scale-110"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted hover:scale-105"
                )}
              >
                <item.icon className={cn(
                  "flex-shrink-0",
                  "w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5"
                )} />
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
              "rounded-full",
              // Responsive sizing
              "w-10 h-10 xs:w-12 xs:h-12 sm:w-12 sm:h-12",
              "transition-all duration-200 ease-out",
              "touch-manipulation",
              "active:scale-95",
              "text-muted-foreground hover:text-foreground hover:bg-muted hover:scale-105",
              showMobileMenu && "bg-muted text-foreground scale-105"
            )}
          >
            <MoreHorizontal className={cn(
              "flex-shrink-0",
              "w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5"
            )} />
          </button>
        </nav>
      </div>
    </>
  );
}