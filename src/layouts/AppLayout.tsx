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
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/services/studentProfile";
import UniLogo from "/assets/Uni360-logo.png";

type Country = "DE" | "UK";

interface NotificationMetadata {
  taskName?: string;
  eventType?: string;
  stageName?: string;
  completedBy?: number;
  applicationId?: string;
}

interface Notification {
  id: string;
  userId: number;
  senderId: number;
  type: string;
  title: string;
  message: string;
  contentType: string;
  status: "READ" | "UNREAD";
  actionUrl?: string;
  metadata?: NotificationMetadata;
  createdAt: string;
  readAt?: string;
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
  const [notificationsError, setNotificationsError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch notifications on component mount and periodically
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    // Refresh notifications every 30 seconds
    const notificationInterval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(notificationInterval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      setNotificationsError(null);
      
      const response = await getNotifications();
      console.log("Notifications response:", response);
      
      // Handle the API response structure: { success, data: { notifications: [...] } }
      let notificationsData: Notification[] = [];
      
      if (response?.data?.notifications) {
        notificationsData = response.data.notifications;
      } else if (response?.notifications) {
        notificationsData = response.notifications;
      } else if (Array.isArray(response)) {
        notificationsData = response;
      }
      
      setNotifications(notificationsData);
    } catch (error: any) {
      console.error("Error fetching notifications:", error);
      setNotificationsError(error?.message || "Failed to load notifications");
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await getUnreadNotificationsCount();
      console.log("Unread count response:", response);
      
      // Handle the API response structure: { success, data: { unreadCount: number } }
      let count = 0;
      
      if (response?.data?.unreadCount !== undefined) {
        count = response.data.unreadCount;
      } else if (response?.unreadCount !== undefined) {
        count = response.unreadCount;
      } else if (typeof response === 'number') {
        count = response;
      }
      
      setUnreadCount(count);
    } catch (error: any) {
      console.error("Error fetching unread count:", error);
      // Fallback: count unread notifications from the notifications array
      const unread = notifications.filter((n) => n.status === "UNREAD").length;
      setUnreadCount(unread);
    }
  };

  const handleNotificationRead = async (id: string) => {
    try {
      // Optimistically update UI
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, status: "READ" as const, readAt: new Date().toISOString() }
            : notification
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      // Make API call
      await markNotificationAsRead(id);
      
      // Navigate to action URL if available
      const notification = notifications.find((n) => n.id === id);
      if (notification?.actionUrl) {
        setShowNotifications(false);
        
        // Check if the route exists before navigating
        const validRoutes = ['/dashboard', '/applications', '/profilebuilder', '/universities', '/courses'];
        const routePath = notification.actionUrl.split('?')[0]; // Remove query params
        
        // Check if it's a valid route or starts with a valid route
        const isValidRoute = validRoutes.some(route => routePath === route || routePath.startsWith(route + '/'));
        
        if (isValidRoute) {
          // For application details, navigate to applications list instead
          if (routePath.startsWith('/applications/')) {
            console.log('Navigating to applications list instead of specific application');
            navigate('/applications');
          } else {
            navigate(notification.actionUrl);
          }
        } else {
          console.log('Invalid route in notification actionUrl:', notification.actionUrl);
          // Just mark as read without navigation
        }
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Revert optimistic update on error
      fetchNotifications();
      fetchUnreadCount();
    }
  };

  const handleMarkAllRead = async () => {
    try {
      // Optimistically update UI
      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          status: "READ" as const,
          readAt: notification.readAt || new Date().toISOString(),
        }))
      );
      setUnreadCount(0);

      // Make API call
      await markAllNotificationsAsRead();
      setShowNotifications(false);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      // Revert optimistic update on error
      fetchNotifications();
      fetchUnreadCount();
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

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  const handleBackdropClick = () => {
    setShowNotifications(false);
    setShowProfileMenu(false);
  };

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

  const getUserInitials = () => {
    const name = getUserName();
    const nameParts = name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const formatNotificationDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "TASK_COMPLETION":
        return "✅";
      case "DOCUMENT_REQUEST":
        return "📄";
      case "APPLICATION_UPDATE":
        return "🔔";
      case "DEADLINE_REMINDER":
        return "⏰";
      default:
        return "📢";
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
          {/* Logo - Clickable */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
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
          </button>

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
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-background border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="p-3 sm:p-4 border-b border-border bg-muted/30">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base">
                        Notifications
                        {unreadCount > 0 && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({unreadCount} new)
                          </span>
                        )}
                      </h3>
                      {unreadCount > 0 && !notificationsError && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-xs sm:text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-[28rem] overflow-y-auto">
                    {loadingNotifications ? (
                      <div className="p-6 text-center text-muted-foreground">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50 animate-pulse" />
                        <p className="text-sm">Loading notifications...</p>
                      </div>
                    ) : notificationsError ? (
                      <div className="p-6 text-center text-muted-foreground">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm font-medium">Unable to load notifications</p>
                        <p className="text-xs mt-1 opacity-75">{notificationsError}</p>
                        <button
                          onClick={fetchNotifications}
                          className="mt-3 text-xs text-primary hover:text-primary/80 underline">
                          Try again
                        </button>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-6 text-center text-muted-foreground">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No notifications yet</p>
                        <p className="text-xs mt-1 opacity-75">
                          You'll see updates about your applications here
                        </p>
                      </div>
                    ) : (
                      <div>
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={cn(
                              "p-3 sm:p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer",
                              notification.status === "UNREAD" &&
                                "bg-primary/5 border-l-4 border-l-primary"
                            )}
                            onClick={() => handleNotificationRead(notification.id)}>
                            <div className="flex items-start gap-2 sm:gap-3">
                              <div className="text-2xl flex-shrink-0 mt-0.5">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h4 className="text-sm font-medium text-foreground line-clamp-1">
                                    {notification.title}
                                  </h4>
                                  {notification.status === "UNREAD" && (
                                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <p className="text-xs text-muted-foreground">
                                    {formatNotificationDate(notification.createdAt)}
                                  </p>
                                  {notification.metadata?.stageName && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                      {notification.metadata.stageName.replace(/_/g, ' ')}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-border bg-muted/30">
                      <button
                        className="w-full text-center text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                        onClick={() => {
                          setShowNotifications(false);
                          // TODO: Navigate to full notifications page if you have one
                          // navigate('/notifications');
                        }}>
                        View all notifications
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
                        <p className="text-xs sm:text-sm text-muted-foreground font-mono truncate">
                          {user?.uuid
                            ? `UUID: ${user.uuid.slice(0, 8)}...`
                            : "UUID: Loading..."}
                        </p>
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
          <div className="mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-7xl">
            <Outlet context={{ selectedCountry }} />
          </div>
        </div>
        <BottomNavigation />
      </main>
    </div>
  );
}