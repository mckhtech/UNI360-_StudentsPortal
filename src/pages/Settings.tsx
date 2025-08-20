import React, { useState } from 'react';
import {
  User,
  Settings as SettingsIcon,
  Bell,
  Shield,
  Globe,
  Moon,
  Sun,
  Save,
  Edit,
  Upload,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Trash2,
  Eye,
  EyeOff,
  Key,
  CreditCard,
  Download,
  AlertCircle,
  ChevronLeft,
  Check
} from 'lucide-react';

// Utility function
const cn = (...classes: (string | undefined | boolean)[]) => {
  return classes.filter(Boolean).join(' ');
};

const getInitials = (name: string) => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase();
};

// Card components
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700", className)}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 dark:border-gray-700", className)}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h3 className={cn("text-lg sm:text-xl font-semibold text-gray-900 dark:text-white", className)}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("px-4 sm:px-6 py-4 sm:py-6", className)}>
    {children}
  </div>
);

// Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Button = ({ children, variant = "primary", size = "md", className = "", onClick, ...props }: ButtonProps) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-blue-500",
    ghost: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-blue-500"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Toggle Switch component
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

const ToggleSwitch = ({ checked, onChange, className = "" }: ToggleSwitchProps) => (
  <button
    onClick={() => onChange(!checked)}
    className={cn(
      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
      checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700',
      className
    )}
  >
    <span
      className={cn(
        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
        checked ? 'translate-x-6' : 'translate-x-1'
      )}
    />
  </button>
);

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Mock user data
  const user = {
    id: 'user123',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1-555-0123',
    dateOfBirth: '1995-08-15',
    nationality: 'American',
    currentLocation: 'New York, USA',
    targetCountries: ['Germany', 'United Kingdom'],
    profileCompletion: 85,
    joinedDate: '2024-01-15',
    subscription: 'Premium',
    avatar: null
  };

  const settingsTabs = [
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
    { id: 'preferences', label: 'Preferences', icon: <SettingsIcon size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { id: 'security', label: 'Security', icon: <Shield size={20} /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard size={20} /> }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderMobileTabBar = () => (
    <div className="lg:hidden">
      <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
        <div className="flex space-x-2 min-w-max px-4">
          {settingsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              )}
            >
              {tab.icon}
              <span className="hidden xs:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center overflow-hidden">
                {profileImage || user.avatar ? (
                  <img
                    src={profileImage || user.avatar || ''}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl sm:text-2xl font-semibold text-blue-600">
                    {getInitials(user.name)}
                  </span>
                )}
              </div>
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 p-1.5 sm:p-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Upload size={12} className="sm:w-4 sm:h-4" />
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
                Profile Picture
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                Upload a professional photo for your profile
              </p>
              <div className="flex flex-col xs:flex-row gap-2 mt-2 sm:mt-3">
                <Button variant="outline" size="sm">
                  Change Photo
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  Remove
                </Button>
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                defaultValue={user.name}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                defaultValue={user.email}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                defaultValue={user.phone}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                defaultValue={user.dateOfBirth}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nationality
              </label>
              <input
                type="text"
                defaultValue={user.nationality}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Location
              </label>
              <input
                type="text"
                defaultValue={user.currentLocation}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 text-sm sm:text-base"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Target Study Countries
            </label>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3">
              {['Germany', 'United Kingdom', 'Canada', 'Australia', 'Netherlands'].map((country) => (
                <label key={country} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={user.targetCountries.includes(country)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{country}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button>
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Display & Language</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 mr-4">
              <h4 className="font-medium text-gray-800 dark:text-gray-100 text-sm sm:text-base">Dark Mode</h4>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                Toggle between light and dark theme
              </p>
            </div>
            <ToggleSwitch
              checked={isDarkMode}
              onChange={setIsDarkMode}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>
            <select className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 text-sm sm:text-base">
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>German</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Timezone
            </label>
            <select className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 text-sm sm:text-base">
              <option>Eastern Time (UTC-5)</option>
              <option>Central European Time (UTC+1)</option>
              <option>Greenwich Mean Time (UTC+0)</option>
              <option>Pacific Time (UTC-8)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date Format
            </label>
            <select className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 text-sm sm:text-base">
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-800 dark:text-gray-100 text-sm sm:text-base">Profile Visibility</h4>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                Control who can see your profile information
              </p>
            </div>
            <select className="w-full sm:w-auto px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 text-sm">
              <option>Public</option>
              <option>University Partners Only</option>
              <option>Private</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 mr-4">
              <h4 className="font-medium text-gray-800 dark:text-gray-100 text-sm sm:text-base">Data Sharing</h4>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                Allow anonymous data sharing for service improvement
              </p>
            </div>
            <ToggleSwitch checked={true} onChange={() => {}} />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries({
            email: 'Email Notifications',
            push: 'Push Notifications',
            sms: 'SMS Notifications',
            marketing: 'Marketing Communications'
          }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex-1 min-w-0 mr-4">
                <h4 className="font-medium text-gray-800 dark:text-gray-100 text-sm sm:text-base">{label}</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {key === 'email' && 'Receive important updates via email'}
                  {key === 'push' && 'Get notified on your device'}
                  {key === 'sms' && 'Receive SMS for urgent updates'}
                  {key === 'marketing' && 'Promotional content and newsletters'}
                </p>
              </div>
              <ToggleSwitch
                checked={notifications[key as keyof typeof notifications]}
                onChange={(checked) => setNotifications(prev => ({ ...prev, [key]: checked }))}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {[
            'Application status updates',
            'University responses',
            'Visa process updates',
            'Document reminders',
            'Payment notifications',
            'System maintenance'
          ].map((type, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked={index < 4}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{type}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Password & Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-3 py-2 pr-10 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 text-sm sm:text-base"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 text-sm sm:text-base"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 text-sm sm:text-base"
              placeholder="Confirm new password"
            />
          </div>

          <Button>
            <Key size={16} className="mr-2" />
            Update Password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 gap-3">
            <div className="flex items-center gap-3">
              <Shield className="text-green-600 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-medium text-green-800 dark:text-green-300 text-sm sm:text-base">2FA Enabled</h4>
                <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">Your account is protected</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle size={20} />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg">
            <h4 className="font-medium text-red-800 dark:text-red-300 mb-2 text-sm sm:text-base">Delete Account</h4>
            <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
              <Trash2 size={16} className="mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBillingTab = () => (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg gap-4">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base">Premium Plan</h4>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                Full access to all features and AI tools
              </p>
              <p className="text-xs sm:text-sm text-blue-600 font-medium mt-1">
                $29.99/month • Renews on March 15, 2024
              </p>
            </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              Change Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {[
              { date: '2024-02-15', amount: '$29.99', status: 'Paid', invoice: 'INV-001' },
              { date: '2024-01-15', amount: '$29.99', status: 'Paid', invoice: 'INV-002' },
              { date: '2023-12-15', amount: '$29.99', status: 'Paid', invoice: 'INV-003' }
            ].map((bill, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg gap-3">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <h4 className="font-medium text-gray-800 dark:text-gray-100 text-sm">{bill.invoice}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{bill.date}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-1 sm:mt-0">
                    <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{bill.amount}</p>
                    <p className="text-xs sm:text-sm text-green-600">{bill.status}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <Download size={14} className="mr-1" />
                  PDF
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'preferences':
        return renderPreferencesTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'security':
        return renderSecurityTab();
      case 'billing':
        return renderBillingTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Settings
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                Manage your account preferences and security settings.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        {renderMobileTabBar()}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Desktop Sidebar Navigation */}
          <div className="hidden lg:block">
            <Card className="sticky top-6">
              <CardContent className="p-0">
                <nav className="space-y-1 p-4">
                  {settingsTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-colors text-sm',
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      )}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          
          /* Custom breakpoints */
          @media (min-width: 375px) {
            .xs\\:grid-cols-2 {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
            .xs\\:flex-row {
              flex-direction: row;
            }
            .xs\\:inline {
              display: inline;
            }
          }
          
          /* iPhone SE and small devices */
          @media (max-width: 374px) {
            .grid-cols-1 {
              grid-template-columns: 1fr;
            }
          }
          
          /* Fold devices and tablets */
          @media (min-width: 768px) and (max-width: 1023px) {
            .fold\\:grid-cols-3 {
              grid-template-columns: repeat(3, minmax(0, 1fr));
            }
          }
          
          /* Large devices optimization */
          @media (min-width: 1536px) {
            .xl\\:max-w-none {
              max-width: none;
            }
          }
        `
      }} />
    </div>
  );
};

export default Settings;