import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { FloatingSidebar } from "@/components/ui/floating-sidebar";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { CountryToggle } from "@/components/ui/country-toggle";
import { Bell, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/services/auth";
import UniLogo from "@/assets/UNI360 lOGO (3).png";

type Country = "DE" | "UK";

interface Notification {
  id: string | number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export function AppLayout() {
  const {
    user,
    logout,
    selectedCountry,
    isCountryToggleDisabled,
    setSelectedCountry,
  } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationsError, setNotificationsError] = useState<string | null>(
    null
  );

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      setNotificationsError(null);
      const notificationsData = await getNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotificationsError(error.message || "Failed to load notifications");
      // Keep notifications as empty array on error
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleNotificationRead = async (id: string | number) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Don't show error to user for this action, just log it
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, is_read: true }))
      );
      setShowNotifications(false);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      // Don't show error to user for this action, just log it
    }
  };

  const handleProfileClick = () => {
    setShowProfileMenu(false);
    navigate("/profilebuilder");
  };

  const handleLogout = async () => {
    setShowProfileMenu(false);
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login");
    }
  };

  // Handle logo click - always navigate to dashboard
  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  // Close dropdowns when clicking outside
  const handleBackdropClick = () => {
    setShowNotifications(false);
    setShowProfileMenu(false);
  };

  // Get user display name
  const getUserName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user?.name) {
      return user.name;
    } else if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  // Get user initials
  const getUserInitials = () => {
    const name = getUserName();
    const nameParts = name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  // Format notification date
  const formatNotificationDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Invalid Date";
    }
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
        <div className="w-full h-16 flex items-center justify-between px-2">
          {/* Logo - Now clickable and always navigates to dashboard */}
          <div className="flex items-center">
            <div className="w-12 h-12 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg flex items-end justify-center pb-1 mt-1 sm:mt-2">
              <img
                src={UniLogo}
                alt="Uni360 Logo"
                className="w-10 h-10 sm:w-10 sm:h-10 md:w-14 md:h-14 object-contain"
              />
            </div>
            <span className="font-bold text-lg sm:text-xl md:text-2xl text-foreground -ml-1 sm:-ml-3">
              <span className="hidden sm:inline">UNI360°</span>
              <span className="sm:hidden">UNI360°</span>
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <CountryToggle
              value={selectedCountry}
              onChange={setSelectedCountry}
              disabled={isCountryToggleDisabled}
            />

            {/* Notifications */}
            <div className="relative">
              <button
                className={cn(
                  "relative p-1.5 sm:p-2 rounded-xl transition-all duration-micro",
                  "text-muted-foreground hover:text-foreground hover:bg-muted",
                  showNotifications && "bg-muted text-foreground"
                )}
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}>
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </div>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-background border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="p-3 sm:p-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base">
                        Notifications
                      </h3>
                      {unreadCount > 0 && !notificationsError && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-xs sm:text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                          Mark all as read
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {loadingNotifications ? (
                      <div className="p-4 sm:p-6 text-center text-muted-foreground">
                        <Bell className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50 animate-pulse" />
                        <p className="text-sm">Loading notifications...</p>
                      </div>
                    ) : notificationsError ? (
                      <div className="p-4 sm:p-6 text-center text-muted-foreground">
                        <Bell className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Notifications unavailable</p>
                        <p className="text-xs mt-1 opacity-75">
                          Feature coming soon
                        </p>
                        <button
                          onClick={fetchNotifications}
                          className="mt-3 text-xs text-primary hover:text-primary/80 underline">
                          Try again
                        </button>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-4 sm:p-6 text-center text-muted-foreground">
                        <Bell className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "p-3 sm:p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer",
                            !notification.is_read &&
                              "bg-primary/5 border-l-4 border-l-primary"
                          )}
                          onClick={() =>
                            handleNotificationRead(notification.id)
                          }>
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                                notification.is_read
                                  ? "bg-muted-foreground/30"
                                  : "bg-primary"
                              )}
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-foreground mb-1">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {formatNotificationDate(
                                  notification.created_at
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {notifications.length > 5 && (
                    <div className="p-3 border-t border-border bg-muted/30">
                      <button
                        className="w-full text-center text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                        onClick={() => {
                          setShowNotifications(false);
                          // Navigate to full notifications page if you have one
                          // navigate('/notifications');
                        }}>
                        View all notifications ({notifications.length})
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                className={cn(
                  "flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-xl transition-all duration-micro",
                  "text-muted-foreground hover:text-foreground hover:bg-muted",
                  showProfileMenu && "bg-muted text-foreground"
                )}
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}>
                {user?.profilePhoto || user?.avatar ? (
                  <img
                    src={user.profilePhoto || user.avatar}
                    alt={getUserName()}
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {getUserInitials()}
                  </div>
                )}
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 hidden sm:block" />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-background border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                  {/* User Info */}
                  <div className="p-3 sm:p-4 border-b border-border">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {user?.profilePhoto || user?.avatar ? (
                        <img
                          src={user.profilePhoto || user.avatar}
                          alt={getUserName()}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {getUserInitials()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">
                          {getUserName()}
                        </p>
<<<<<<< Updated upstream
=======
                        <p className="text-xs sm:text-sm text-muted-foreground font-mono truncate">
                          {user?.uuid
                            ? `UUID: ${user.uuid.slice(0, 8)}...`
                            : "UUID: Loading..."}
                        </p>
>>>>>>> Stashed changes
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <button
                      className="w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg text-left hover:bg-muted transition-colors"
                      onClick={handleProfileClick}>
                      <User className="w-4 h-4" />
                      <span className="text-sm">Profile Builder</span>
                    </button>

                    <div className="border-t border-border my-2" />

                    <button
                      className="w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg text-left text-destructive hover:bg-destructive/10 transition-colors"
                      onClick={handleLogout}>
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
        <div className="md:ml-24 min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)]">
          <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-7xl">
            <Outlet context={{ selectedCountry }} />
          </div>
        </div>
        <BottomNavigation />
      </main>
    </div>
  );
}
