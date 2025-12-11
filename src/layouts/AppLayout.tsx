import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { FloatingSidebar } from "@/components/ui/floating-sidebar";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { CountryToggle } from "@/components/ui/country-toggle";
import { Bell, User, Settings, LogOut, ChevronDown, X, CheckCheck, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  getNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getStudentApplications,
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
  const [showAllNotificationsModal, setShowAllNotificationsModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  
  const [notificationsError, setNotificationsError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [applicationsMap, setApplicationsMap] = useState<Map<string, any>>(new Map());

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch notifications on component mount and periodically
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    fetchAndMapApplications();

    const notificationInterval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
      fetchAndMapApplications();
    }, 30000);

    return () => clearInterval(notificationInterval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      setNotificationsError(null);
      
      const response = await getNotifications();
      console.log("Notifications response:", response);
      
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
      const unread = notifications.filter((n) => n.status === "UNREAD").length;
      setUnreadCount(unread);
    }
  };

  const fetchAndMapApplications = async () => {
    try {
      const apps = await getStudentApplications();
      console.log('📋 Fetching applications for notifications:', apps);
      
      let appsData = [];
      if (apps?.data?.applications) {
        appsData = apps.data.applications;
      } else if (apps?.applications) {
        appsData = apps.applications;
      } else if (Array.isArray(apps)) {
        appsData = apps;
      }
      
      console.log('📋 Applications data:', appsData);
      console.log('📋 Total applications:', appsData.length);
      
      const map = new Map();
      appsData.forEach(app => {
        const appData = {
          universityName: app.universityName,
          programName: app.programName,
          referenceNumber: app.referenceNumber,
          status: app.status,
          intakeTerm: app.intakeTerm,
        };
        
        console.log('📋 Mapping application ID:', app.id, '→', appData);
        map.set(app.id, appData);
      });
      
      console.log('📋 Applications map created with', map.size, 'entries');
      setApplicationsMap(map);
    } catch (error) {
      console.error("❌ Error fetching applications for notifications:", error);
    }
  };

  const handleNotificationRead = async (id: string) => {
    try {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, status: "READ" as const, readAt: new Date().toISOString() }
            : notification
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      await markNotificationAsRead(id);
      
      const notification = notifications.find((n) => n.id === id);
      if (notification?.actionUrl) {
        setShowNotifications(false);
        setShowAllNotificationsModal(false);
        
        const validRoutes = ['/dashboard', '/applications', '/profilebuilder', '/universities', '/courses'];
        const routePath = notification.actionUrl.split('?')[0];
        
        const isValidRoute = validRoutes.some(route => routePath === route || routePath.startsWith(route + '/'));
        
        if (isValidRoute) {
          if (routePath.startsWith('/applications/')) {
            console.log('Navigating to applications list instead of specific application');
            navigate('/applications');
          } else {
            navigate(notification.actionUrl);
          }
        } else {
          console.log('Invalid route in notification actionUrl:', notification.actionUrl);
        }
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      fetchNotifications();
      fetchUnreadCount();
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          status: "READ" as const,
          readAt: notification.readAt || new Date().toISOString(),
        }))
      );
      setUnreadCount(0);

      await markAllNotificationsAsRead();
      setShowNotifications(false);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
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
        return "📣";
      case "DEADLINE_REMINDER":
        return "⏰";
      default:
        return "🔔";
    }
  };

  const NotificationItem = ({ notification, isInModal = false }: { notification: Notification; isInModal?: boolean }) => {
    const applicationId = notification.metadata?.applicationId;
    const applicationData = applicationId ? applicationsMap.get(applicationId) : null;
    
    if (applicationId) {
      console.log('🔔 Notification ID:', notification.id);
      console.log('   Application ID:', applicationId);
      console.log('   Found data:', applicationData);
      console.log('   Map has:', applicationsMap.size, 'applications');
    }
    
    return (
      <div
        key={notification.id}
        className={cn(
          "p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-all cursor-pointer group",
          notification.status === "UNREAD" && "bg-primary/5 border-l-4 border-l-primary",
          isInModal && "rounded-lg mb-2 border"
        )}
        onClick={() => handleNotificationRead(notification.id)}>
        <div className="flex items-start gap-3">
          <div className="text-2xl flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
            {getNotificationIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="text-sm font-semibold text-foreground line-clamp-2">
                {notification.title}
              </h4>
              {notification.status === "UNREAD" && (
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5 animate-pulse" />
              )}
            </div>
            
            {applicationData && (
              <div className="mb-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200 dark:border-blue-800 shadow-sm">
                <div className="flex items-start gap-2">
                  <span className="text-lg">🎓</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-blue-900 dark:text-blue-100 line-clamp-1 mb-1">
                      {applicationData.universityName}
                    </p>
                    <div className="flex items-start gap-2">
                      <span className="text-sm">📚</span>
                      <p className="text-xs text-blue-700 dark:text-blue-300 line-clamp-2 flex-1">
                        {applicationData.programName}
                      </p>
                    </div>
                    {applicationData.referenceNumber && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-mono mt-2 bg-white/50 dark:bg-black/20 px-2 py-1 rounded inline-block">
                        Ref: {applicationData.referenceNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {notification.message}
            </p>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="text-xs text-muted-foreground font-medium">
                {formatNotificationDate(notification.createdAt)}
              </p>
              <div className="flex items-center gap-2">
                {notification.metadata?.stageName && (
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {notification.metadata.stageName.replace(/_/g, ' ')}
                  </span>
                )}
                {notification.actionUrl && (
                  <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {(showNotifications || showProfileMenu) && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
          onClick={handleBackdropClick}
        />
      )}

      {/* All Notifications Modal */}
      {showAllNotificationsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Bell className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">All Notifications</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notifications.length} total notification{notifications.length !== 1 ? 's' : ''}
                      {unreadCount > 0 && ` • ${unreadCount} unread`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-primary/10">
                      <CheckCheck className="w-4 h-4" />
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setShowAllNotificationsModal(false)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingNotifications ? (
                <div className="p-12 text-center">
                  <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                    <Bell className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Loading notifications...</p>
                </div>
              ) : notificationsError ? (
                <div className="p-12 text-center">
                  <div className="inline-flex p-4 bg-destructive/10 rounded-full mb-4">
                    <Bell className="w-8 h-8 text-destructive" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Unable to load notifications</p>
                  <p className="text-xs mt-2 text-muted-foreground">{notificationsError}</p>
                  <button
                    onClick={fetchNotifications}
                    className="mt-4 text-sm text-primary hover:text-primary/80 underline font-medium">
                    Try again
                  </button>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="inline-flex p-4 bg-muted rounded-full mb-4">
                    <Bell className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">No notifications yet</p>
                  <p className="text-xs mt-2 text-muted-foreground">
                    You'll see updates about your applications here
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} isInModal={true} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="w-full h-16 flex items-center justify-between px-2">
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
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </div>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-background border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                  {/* Header */}
                  <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Bell className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground text-sm">
                            Notifications
                          </h3>
                          {unreadCount > 0 && (
                            <p className="text-xs text-muted-foreground">
                              {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      </div>
                      {unreadCount > 0 && !notificationsError && (
                        <button
                          onClick={handleMarkAllRead}
                          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/10">
                          <CheckCheck className="w-3.5 h-3.5" />
                          Mark all
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-[28rem] overflow-y-auto">
                    {loadingNotifications ? (
                      <div className="p-8 text-center">
                        <div className="inline-flex p-3 bg-primary/10 rounded-full mb-3">
                          <Bell className="w-6 h-6 text-primary animate-pulse" />
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">Loading notifications...</p>
                      </div>
                    ) : notificationsError ? (
                      <div className="p-8 text-center">
                        <div className="inline-flex p-3 bg-destructive/10 rounded-full mb-3">
                          <Bell className="w-6 h-6 text-destructive" />
                        </div>
                        <p className="text-sm font-medium text-foreground">Unable to load notifications</p>
                        <p className="text-xs mt-1 text-muted-foreground">{notificationsError}</p>
                        <button
                          onClick={fetchNotifications}
                          className="mt-3 text-xs text-primary hover:text-primary/80 underline font-medium">
                          Try again
                        </button>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="inline-flex p-3 bg-muted rounded-full mb-3">
                          <Bell className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-foreground">No notifications yet</p>
                        <p className="text-xs mt-1 text-muted-foreground">
                          You'll see updates about your applications here
                        </p>
                      </div>
                    ) : (
                      <div>
                        {notifications.slice(0, 5).map((notification) => (
                          <NotificationItem key={notification.id} notification={notification} />
                        ))}
                      </div>
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-border bg-muted/30">
                      <button
                        className="w-full text-center text-sm text-primary hover:text-primary/80 font-semibold transition-colors py-2 rounded-lg hover:bg-primary/10"
                        onClick={() => {
                          setShowNotifications(false);
                          setShowAllNotificationsModal(true);
                        }}>
                        View all {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
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

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-background border border-border rounded-xl shadow-lg z-50 overflow-hidden">
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