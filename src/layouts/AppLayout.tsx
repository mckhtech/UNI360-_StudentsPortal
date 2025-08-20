import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FloatingSidebar } from "@/components/ui/floating-sidebar";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { CountryToggle } from "@/components/ui/country-toggle";
import { Bell, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Country = "DE" | "UK";

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// Mock user data - replace with your actual user context/state
const mockUser = {
  name: "John Doe",
  avatar: "", // Empty for initials fallback
  uuid: "abc123def456ghi789"
};

// Mock notifications - replace with your actual notifications state
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Application Update",
    message: "Your university application status has been updated",
    isRead: false,
    createdAt: "2025-01-20"
  },
  {
    id: "2",
    title: "New Message",
    message: "You have received a new message from admissions",
    isRead: true,
    createdAt: "2025-01-19"
  },
  {
    id: "3",
    title: "Deadline Reminder",
    message: "Application deadline approaching in 3 days",
    isRead: false,
    createdAt: "2025-01-18"
  }
];

export function AppLayout() {
  const [selectedCountry, setSelectedCountry] = useState<Country>("DE");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    setShowNotifications(false);
  };

  const handleProfileClick = () => {
    setShowProfileMenu(false);
    navigate('/profilebuilder');
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    // Add your logout logic here
    console.log('Logging out...');
    navigate('/login');
  };

  // Close dropdowns when clicking outside
  const handleBackdropClick = () => {
    setShowNotifications(false);
    setShowProfileMenu(false);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Backdrop for closing dropdowns */}
      {(showNotifications || showProfileMenu) && (
        <div 
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
          onClick={handleBackdropClick}
        />
      )}

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
            <div className="relative">
              <button 
                className={cn(
                  "relative p-2 rounded-xl transition-all duration-micro",
                  "text-muted-foreground hover:text-foreground hover:bg-muted",
                  showNotifications && "bg-muted text-foreground"
                )}
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </div>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-muted-foreground">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No notifications yet</p>
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            'p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer',
                            !notification.isRead && 'bg-primary/5 border-l-4 border-l-primary'
                          )}
                          onClick={() => handleNotificationRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                              notification.isRead ? 'bg-muted-foreground/30' : 'bg-primary'
                            )} />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-foreground mb-1">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button 
                className={cn(
                  "flex items-center gap-2 p-2 rounded-xl transition-all duration-micro",
                  "text-muted-foreground hover:text-foreground hover:bg-muted",
                  showProfileMenu && "bg-muted text-foreground"
                )}
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
              >
                {mockUser.avatar ? (
                  <img 
                    src={mockUser.avatar} 
                    alt={mockUser.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {mockUser.name.charAt(0)}
                  </div>
                )}
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-background border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                  {/* User Info */}
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      {mockUser.avatar ? (
                        <img 
                          src={mockUser.avatar} 
                          alt={mockUser.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                          {mockUser.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-foreground">
                          {mockUser.name}
                        </p>
                        <p className="text-sm text-muted-foreground font-mono">
                          ID: {mockUser.uuid.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="p-2">
                    <button
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-muted transition-colors"
                      onClick={handleProfileClick}
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">Profile Builder</span>
                    </button>
                    

                    
                    <div className="border-t border-border my-2" />
                    
                    <button
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-destructive hover:bg-destructive/10 transition-colors"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
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