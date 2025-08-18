import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FloatingSidebar } from "@/components/ui/floating-sidebar";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { CountryToggle } from "@/components/ui/country-toggle";
import { Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

type Country = "DE" | "UK";

export function AppLayout() {
  const [selectedCountry, setSelectedCountry] = useState<Country>("DE");

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="font-bold text-xl text-foreground">Uni360</span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <CountryToggle
              value={selectedCountry}
              onChange={setSelectedCountry}
            />
            
            {/* Notifications */}
            <button className={cn(
              "relative p-2 rounded-xl transition-all duration-micro",
              "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}>
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
            </button>

            {/* Profile */}
            <button className={cn(
              "p-2 rounded-xl transition-all duration-micro",
              "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}>
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        <FloatingSidebar />
        <div className="md:ml-24 min-h-[calc(100vh-4rem)]">
          <div className="container mx-auto px-6 py-8 max-w-7xl">
            <Outlet context={{ selectedCountry }} />
          </div>
        </div>
        <BottomNavigation />
      </main>
    </div>
  );
}