import React, { useState, useEffect } from 'react';
import {
  User,
  Settings as SettingsIcon,
  Save,
  Upload,
  Trash2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { uploadProfilePhoto, deleteProfilePhoto } from '@/services/profile';

// Utility function
const cn = (...classes: (string | undefined | boolean)[]) => {
  return classes.filter(Boolean).join(' ');
};

const getInitials = (name: string) => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase();
};

// Card components
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-white rounded-xl shadow-sm border border-gray-200", className)}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200", className)}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h3 className={cn("text-lg sm:text-xl font-semibold", className)} style={{ color: '#2C3539' }}>
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
    primary: "text-white hover:opacity-90 focus:ring-blue-300",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-300",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-blue-300"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  const primaryStyle = variant === "primary" ? { backgroundColor: '#C4DFF0', color: '#2C3539' } : {};
  
  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      onClick={onClick}
      style={primaryStyle}
      {...props}
    >
      {children}
    </button>
  );
};

const Settings = () => {
  const { user, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    currentLocation: '',
    targetCountries: [] as string[]
  });

  // Initialize form data with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        nationality: user.nationality || '',
        currentLocation: user.currentLocation || '',
        targetCountries: user.targetCountries || []
      });
      setProfileImage(user.profilePhoto || null);
    }
  }, [user]);

  const settingsTabs = [
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
    { id: 'preferences', label: 'Preferences', icon: <SettingsIcon size={20} /> },
  ];

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setIsSaving(true);
        // Convert to base64 for preview
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64 = e.target?.result as string;
          setProfileImage(base64);
          
          // Upload to backend
          try {
            const response = await uploadProfilePhoto(base64);
            if (response?.profilePhoto) {
              await updateUserProfile({ profilePhoto: response.profilePhoto });
            }
          } catch (error) {
            console.error('Error uploading photo:', error);
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error handling image upload:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setIsSaving(true);
      await deleteProfilePhoto();
      setProfileImage(null);
      await updateUserProfile({ profilePhoto: null });
    } catch (error) {
      console.error('Error removing photo:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCountryToggle = (country: string) => {
    setFormData(prev => ({
      ...prev,
      targetCountries: prev.targetCountries.includes(country)
        ? prev.targetCountries.filter(c => c !== country)
        : [...prev.targetCountries, country]
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      
      // Split name into first and last name
      const nameParts = formData.name.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const profileData = {
        name: formData.name,
        firstName,
        lastName,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        nationality: formData.nationality,
        currentLocation: formData.currentLocation,
        targetCountries: formData.targetCountries
      };
      
      await updateUserProfile(profileData);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
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
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-600'
              )}
              style={activeTab === tab.id ? { backgroundColor: '#2C3539' } : {}}
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
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#C4DFF0' }}>
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl sm:text-2xl font-semibold" style={{ color: '#2C3539' }}>
                    {getInitials(formData.name || 'User')}
                  </span>
                )}
              </div>
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 p-1.5 sm:p-2 text-white rounded-full cursor-pointer hover:opacity-90 transition-colors shadow-lg"
                style={{ backgroundColor: '#E08D3C' }}
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
              <h3 className="text-base sm:text-lg font-semibold" style={{ color: '#2C3539' }}>
                Profile Picture
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Upload a professional photo for your profile
              </p>
              <div className="flex flex-col xs:flex-row gap-2 mt-2 sm:mt-3">
                <label htmlFor="profile-upload-2">
                  <Button variant="outline" size="sm" disabled={isSaving} className="cursor-pointer" as="span">
                    {isSaving ? 'Uploading...' : 'Change Photo'}
                  </Button>
                  <input
                    id="profile-upload-2"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isSaving}
                  />
                </label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700"
                  onClick={handleRemovePhoto}
                  disabled={isSaving || !profileImage}
                >
                  {isSaving ? 'Removing...' : 'Remove'}
                </Button>
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2C3539' }}>
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent text-sm sm:text-base"
                style={{ 
                  focusRingColor: '#C4DFF0',
                  '--tw-ring-color': '#C4DFF0'
                } as React.CSSProperties}
                onFocus={(e) => e.target.style.borderColor = '#C4DFF0'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2C3539' }}>
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent text-sm sm:text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                onFocus={(e) => e.target.style.borderColor = '#C4DFF0'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2C3539' }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent text-sm sm:text-base"
                onFocus={(e) => e.target.style.borderColor = '#C4DFF0'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2C3539' }}>
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent text-sm sm:text-base"
                onFocus={(e) => e.target.style.borderColor = '#C4DFF0'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2C3539' }}>
                Nationality
              </label>
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent text-sm sm:text-base"
                onFocus={(e) => e.target.style.borderColor = '#C4DFF0'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2C3539' }}>
                Current Location
              </label>
              <input
                type="text"
                value={formData.currentLocation}
                onChange={(e) => handleInputChange('currentLocation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent text-sm sm:text-base"
                onFocus={(e) => e.target.style.borderColor = '#C4DFF0'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: '#2C3539' }}>
              Target Study Countries
            </label>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3">
              {['Germany', 'United Kingdom', 'Canada', 'Australia', 'Netherlands'].map((country) => (
                <label key={country} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.targetCountries.includes(country)}
                    onChange={() => handleCountryToggle(country)}
                    className="rounded border-gray-300 focus:ring-2"
                    style={{ 
                      accentColor: '#C4DFF0',
                      '--tw-ring-color': '#C4DFF0'
                    } as React.CSSProperties}
                  />
                  <span className="text-sm text-gray-700">{country}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveProfile} disabled={isSaving}>
              <Save size={16} className="mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
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
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C3539' }}>
              Language
            </label>
            <select 
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent text-sm sm:text-base"
              onFocus={(e) => e.target.style.borderColor = '#C4DFF0'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            >
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>German</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C3539' }}>
              Timezone
            </label>
            <select 
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent text-sm sm:text-base"
              onFocus={(e) => e.target.style.borderColor = '#C4DFF0'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            >
              <option>Eastern Time (UTC-5)</option>
              <option>Central European Time (UTC+1)</option>
              <option>Greenwich Mean Time (UTC+0)</option>
              <option>Pacific Time (UTC-8)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C3539' }}>
              Date Format
            </label>
            <select 
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent text-sm sm:text-base"
              onFocus={(e) => e.target.style.borderColor = '#C4DFF0'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            >
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>

          <div className="flex justify-end pt-4">
            <Button>
              <Save size={16} className="mr-2" />
              Save Preferences
            </Button>
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
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold" style={{ color: '#2C3539' }}>
                Settings
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Manage your account preferences and profile information.
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
                          ? 'text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      )}
                      style={activeTab === tab.id ? { backgroundColor: '#2C3539' } : {}}
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