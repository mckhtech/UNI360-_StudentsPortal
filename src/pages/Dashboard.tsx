import { useOutletContext, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  FileText,
  GraduationCap,
  Award,
  TrendingUp,
  Bot,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import heroImage from "/assets/hero-image.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { getProfileCompletion, getDashboardData } from "@/services/profile";
import { getUserUUID } from "@/services/utils";
import { useState, useEffect } from "react";

type Country = "DE" | "UK";

interface ContextType {
  selectedCountry: Country;
}

const defaultProgressSteps = [
  { step: 1, title: "Profile Creation", completed: true, current: false },
  { step: 2, title: "Document Upload", completed: true, current: false },
  { step: 3, title: "Verification", completed: true, current: false },
  { step: 4, title: "University Search", completed: false, current: true },
  { step: 5, title: "Application", completed: false, current: false },
  { step: 6, title: "Document Generation", completed: false, current: false },
  { step: 7, title: "Block Account", completed: false, current: false },
  { step: 8, title: "Interview", completed: false, current: false },
  { step: 9, title: "Flywire", completed: false, current: false },
];

// Enhanced profile completion calculation
const calculateDetailedProfileCompletion = (user: any): number => {
  if (!user) return 0;
  
  let completedFields = 0;
  const totalFields = 23; // Total number of profile fields
  
  // Personal information (6 fields)
  if (user.firstName?.trim()) completedFields++;
  if (user.lastName?.trim()) completedFields++;
  if (user.email?.trim()) completedFields++;
  if (user.phone?.trim()) completedFields++;
  if (user.dateOfBirth) completedFields++;
  if (user.nationality?.trim()) completedFields++;
  
  // Academic information (6 fields)
  if (user.educationLevel?.trim()) completedFields++;
  if (user.fieldOfStudy?.trim()) completedFields++;
  if (user.institution?.trim()) completedFields++;
  if (user.graduationYear?.trim()) completedFields++;
  if (user.gpa?.trim()) completedFields++;
  if (user.gradingSystem?.trim()) completedFields++;
  
  // Test scores (5 fields) - At least one test score should be provided
  let testScoreProvided = false;
  if (user.ieltsOverall?.trim()) { completedFields++; testScoreProvided = true; }
  if (user.toeflTotal?.trim()) { completedFields++; testScoreProvided = true; }
  if (user.greTotal?.trim()) { completedFields++; testScoreProvided = true; }
  if (user.gmatTotal?.trim()) { completedFields++; testScoreProvided = true; }
  // Individual IELTS scores if overall is provided
  if (user.ieltsOverall?.trim() && (user.ieltsListening?.trim() || user.ieltsReading?.trim() || user.ieltsWriting?.trim() || user.ieltsSpeaking?.trim())) {
    completedFields++;
  }
  
  // Experience (2 fields) - Optional but if provided, adds to completion
  if (user.workExperience?.trim() || user.internships?.trim() || user.projects?.trim() || user.certifications?.trim()) {
    completedFields += 2;
  }
  
  // Preferences (4 fields)
  if (user.targetCountries?.length > 0) completedFields++;
  if (user.preferredPrograms?.length > 0) completedFields++;
  if (user.studyLevel?.trim()) completedFields++;
  if (user.intakePreference?.trim()) completedFields++;
  
  // Check if profile is explicitly marked as completed
  if (user.profileCompleted === true) {
    return 100;
  }
  
  const percentage = Math.round((completedFields / totalFields) * 100);
  return Math.min(percentage, 99); // Cap at 99% until explicitly completed
};

export default function Dashboard() {
  const { selectedCountry } = useOutletContext<ContextType>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Calculate enhanced profile completion
  const profileCompletion = calculateDetailedProfileCompletion(user);
  const userUUID = getUserUUID(user);
  const isProfileComplete = profileCompletion === 100;
  console.log(isProfileComplete === true ? "Profile is complete" : "Profile is incomplete");

  
  // Extract first name from full name
  const getFirstName = (user) => {
    if (user?.firstName) return user.firstName;
    if (user?.name) {
      return user.name.split(' ')[0];
    }
    return 'Student';
  };
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Retry function for error state
  const retryFetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDashboardData();
      setDashboardData(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Get dynamic progress steps from API
  const getProgressSteps = () => {
    if (error || !dashboardData?.recent_applications?.[0]?.timeline) {
      // Fallback to saved progress or default when API is down
      const savedProgress = localStorage.getItem('userProgress');
      if (savedProgress) {
        return JSON.parse(savedProgress);
      }
      return defaultProgressSteps;
    }

    const timeline = dashboardData.recent_applications[0].timeline;
    const progressSteps = [
      { 
        step: 1, 
        title: "Profile Creation", 
        completed: true, 
        current: false 
      },
      { 
        step: 2, 
        title: "Document Collection", 
        completed: timeline[0]?.status === 'completed', 
        current: timeline[0]?.status === 'in_progress' 
      },
      { 
        step: 3, 
        title: "Verification", 
        completed: timeline[1]?.status === 'completed', 
        current: timeline[1]?.status === 'in_progress' 
      },
      { 
        step: 4, 
        title: "University Search", 
        completed: timeline[2]?.status === 'completed', 
        current: timeline[2]?.status === 'in_progress' 
      },
      { 
        step: 5, 
        title: "Application", 
        completed: timeline[3]?.status === 'completed', 
        current: timeline[3]?.status === 'in_progress' 
      },
      { 
        step: 6, 
        title: "Document Generation", 
        completed: timeline[4]?.status === 'completed', 
        current: timeline[4]?.status === 'in_progress' 
      },
      { 
        step: 7, 
        title: "Block Account", 
        completed: timeline[5]?.status === 'completed', 
        current: timeline[5]?.status === 'in_progress' 
      },
      { 
        step: 8, 
        title: "Interview", 
        completed: timeline[6]?.status === 'completed', 
        current: timeline[6]?.status === 'in_progress' 
      },
      { 
        step: 9, 
        title: "Flywire", 
        completed: timeline[7]?.status === 'completed', 
        current: timeline[7]?.status === 'in_progress' 
      },
    ];

    // Save current progress to localStorage for fallback
    localStorage.setItem('userProgress', JSON.stringify(progressSteps));
    return progressSteps;
  };
  
  const countryData = {
    DE: {
      greeting: "Guten Tag! Ready for Germany?",
      stats: {
        applications: dashboardData?.active_applications || 0,
        offers: 1,
        acceptance: 78,
        universities: "Technical University of Munich, RWTH Aachen, Heidelberg University"
      },
      nextSteps: [
        "Submit remaining documents to TU Munich",
        "Complete APS certificate application",
        "Open blocked account with Deutsche Bank"
      ],
      visaInfo: "Student visa processing: 4-8 weeks"
    },
    UK: {
      greeting: "Hello! Ready for the UK?",
      stats: {
        applications: dashboardData?.active_applications || 0,
        offers: 0,
        acceptance: 65,
        universities: "Imperial College London, University of Edinburgh"
      },
      nextSteps: [
        "Submit UCAS application",
        "Prepare for IELTS exam",
        "Research accommodation options"
      ],
      visaInfo: "Student visa processing: 3-6 weeks"
    }
  };

  const currentData = countryData[selectedCountry];
  const progressSteps = getProgressSteps();
  const currentStepIndex = progressSteps.findIndex(step => step.current);
  const completedSteps = progressSteps.filter(step => step.completed).length;
  const overallProgress = error ? 0 : ((completedSteps) / progressSteps.length) * 100;

  // Format recent applications for display
  const formatRecentApplications = (applications) => {
    if (!applications || applications.length === 0) {
      return [
        {
          type: "info",
          title: "No recent applications",
          subtitle: "Start your first application to see activity here",
          time: "Just now",
          status: "info"
        }
      ];
    }

    return applications.slice(0, 3).map((app) => {
      const statusInfo = getApplicationStatusInfo(app.status);
      
      return {
        type: "application",
        title: `Application to ${app.university_name}`,
        subtitle: app.course_name,
        time: "Recently",
        status: statusInfo.variant,
        priority: app.priority_level
      };
    });
  };

  // Helper function to get status info
  const getApplicationStatusInfo = (status) => {
    const statusMap = {
      draft: { variant: "warning", label: "Draft" },
      submitted: { variant: "info", label: "Submitted" },
      under_review: { variant: "info", label: "Under Review" },
      accepted: { variant: "success", label: "Accepted" },
      rejected: { variant: "error", label: "Rejected" },
      waitlisted: { variant: "warning", label: "Waitlisted" }
    };
    
    return statusMap[status] || { variant: "info", label: status };
  };

  const recentApplications = formatRecentApplications(dashboardData?.recent_applications);

  return (
    <motion.div 
      className="space-y-6 sm:space-y-8 px-3 sm:px-4 md:px-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Welcome Banner */}
      <motion.section 
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-primary p-4 sm:p-6 md:p-8 lg:p-12 text-white"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="absolute inset-0 opacity-20">
          <img 
            src={heroImage} 
            alt="Students studying" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            Welcome back, {getFirstName(user)}!
          </h1>
          <p className="text-base sm:text-lg md:text-xl opacity-90 mb-4 sm:mb-6">
            {currentData.greeting}
          </p>
          <span className="text-xs sm:text-sm">Continue your journey to studying abroad</span>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-4 sm:top-8 right-4 sm:right-8 w-16 sm:w-24 h-16 sm:h-24 bg-white/10 rounded-full animate-float" />
        <div className="absolute bottom-4 sm:bottom-8 right-8 sm:right-16 w-12 sm:w-16 h-12 sm:h-16 bg-white/5 rounded-full animate-float" style={{ animationDelay: "1s" }} />
      </motion.section>

      {/* Overview Cards */}
      <section className={cn(
        "grid gap-3 sm:gap-4 md:gap-6",
        isProfileComplete 
          ? "grid-cols-1 sm:grid-cols-3" 
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      )}>
        {/* Profile Completion Card - Only show if not complete */}
        {!isProfileComplete && (
          <motion.div 
            className="order-first lg:order-none"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ 
              opacity: isProfileComplete ? 0 : 1,
              scale: isProfileComplete ? 0.8 : 1
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            onAnimationComplete={() => {
              if (isProfileComplete) {
                // This will help remove the component from the DOM after animation
                setTimeout(() => {
                  // Component will naturally re-render without this card
                }, 100);
              }
            }}
          >
            <Card className="p-3 sm:p-4 h-full flex flex-col items-center justify-center text-center min-h-[100px] sm:min-h-[120px]">
              <ProgressRing progress={profileCompletion} size="md" className="mb-2 sm:mb-3" />
              <h3 className="font-semibold text-xs sm:text-sm mb-1 sm:mb-2">
                Profile {profileCompletion}% Complete
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 sm:mb-3 px-1">
                {profileCompletion >= 80 
                  ? "Almost there! Complete your profile."
                  : "Complete for better recommendations."}
              </p>
              <Button 
                size="sm" 
                className="rounded-pill text-[10px] sm:text-xs px-3 py-1.5 sm:px-4 sm:py-2"
                onClick={() => navigate('/profilebuilder')}
              >
                Complete Profile
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div 
          className={cn(
            "grid gap-3 sm:gap-4 md:gap-6",
            isProfileComplete 
              ? "grid-cols-1 sm:grid-cols-3 col-span-full" 
              : "grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 col-span-1 sm:col-span-1 lg:col-span-3"
          )}
          layout
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="col-span-1">
            <StatCard
              title="Active Applications"
              value={currentData.stats.applications}
              description={`${currentData.stats.applications} applications in progress`}
              icon={FileText}
              variant="primary"
              trend={{ value: 25, label: "vs last month" }}
              className="animate-slide-in-right h-[140px] sm:h-[160px]"
            />
          </div>

          <div className="col-span-1">
            <StatCard
              title="Offers Received"
              value={currentData.stats.offers}
              description={currentData.stats.offers > 0 ? "Congratulations!" : "Applications under review"}
              icon={Award}
              variant="accent"
              className="animate-slide-in-left h-[140px] sm:h-[160px]"
            />
          </div>

          <div className="col-span-1">
            <StatCard
              title="Success Rate"
              value={`${currentData.stats.acceptance}%`}
              description="Based on your profile strength"
              icon={TrendingUp}
              trend={{ value: 12, label: "improvement" }}
              className="animate-slide-in-right h-[140px] sm:h-[160px]"
            />
          </div>
        </motion.div>
      </section>

      {/* Journey Progress */}
      <section>
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Your Journey Progress</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Step {currentStepIndex + 1 > 0 ? currentStepIndex + 1 : completedSteps + 1} of {progressSteps.length} - You're {Math.round(overallProgress)}% through your university journey!
          </p>
        </div>
        
        <Card className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Overall Progress</span>
              <span className="text-primary font-semibold">{Math.round(overallProgress)}%</span>
            </div>
            {/* Custom Progress Bar with Tigers Eye Color */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="h-3 rounded-full transition-all duration-500 ease-in-out"
                style={{ 
                  width: `${overallProgress}%`,
                  backgroundColor: 'rgba(218, 165, 32, 0.6)' // Lighter tigers eye with opacity
                }}
              />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-2 sm:gap-4 mt-6">
              {progressSteps.map((step) => (
                <div
                  key={step.step}
                  className={`text-center p-2 sm:p-3 rounded-lg border-2 transition-all ${
                    step.completed
                      ? "border-success bg-success/5 text-success"
                      : step.current
                      ? "border-primary bg-primary/5 text-primary animate-pulse"
                      : "border-border bg-muted/50 text-muted-foreground"
                  }`}
                >
                  <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-full mx-auto mb-1 sm:mb-2 flex items-center justify-center text-xs sm:text-sm font-bold ${
                    step.completed
                      ? "bg-success text-success-foreground"
                      : step.current
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {step.completed ? "✓" : step.step}
                  </div>
                  <p className="text-[10px] sm:text-xs font-medium leading-tight">{step.title}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* Quick Actions & Recent Applications */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Quick Actions */}
                <Card className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Quick Actions</h3>
          <div className="space-y-2 sm:space-y-3">
            <Button 
              className="w-full justify-start rounded-xl h-10 sm:h-12 text-sm sm:text-base" 
              variant="outline"
              onClick={() => navigate('/ai-tools')}
            >
              <Bot className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3" />
              AI Tools
            </Button>
            <Button 
              className="w-full justify-start rounded-xl h-10 sm:h-12 text-sm sm:text-base" 
              variant="outline"
              onClick={() => navigate('/universities')}
            >
              <GraduationCap className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3" />
              Browse Universities
            </Button>
            <Button 
              className="w-full justify-start rounded-xl h-10 sm:h-12 text-sm sm:text-base" 
              variant="outline"
              onClick={() => navigate('/documents')}
            >
              <FileText className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3" />
              Upload Documents
            </Button>
          </div>
        </Card>
        {/* Recent Applications */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-lg sm:text-xl font-semibold">Recent Applications</h3>
            {error && (
              <Button
                size="sm"
                variant="outline"
                onClick={retryFetch}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={cn("w-3 sm:w-4 h-3 sm:h-4", loading && "animate-spin")} />
                Retry
              </Button>
            )}
          </div>
          
          {error ? (
            <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
              <AlertCircle className="w-8 sm:w-12 h-8 sm:h-12 text-muted-foreground mb-3 sm:mb-4" />
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">Failed to load applications</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{error}</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {recentApplications.map((application, index) => (
                <div key={index} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                    application.status === "success" ? "bg-green-500" :
                    application.status === "warning" ? "bg-yellow-500" : 
                    application.status === "error" ? "bg-red-500" : "bg-blue-500"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-xs sm:text-sm">{application.title}</p>
                        {application.subtitle && (
                          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{application.subtitle}</p>
                        )}
                      </div>
                      {application.priority && (
                        <Badge variant={application.priority === 1 ? "default" : "secondary"} className="text-[10px] sm:text-xs">
                          Priority {application.priority}
                        </Badge>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">{application.time}</p>
                  </div>
                </div>
              ))}
              
              {dashboardData?.recent_applications && dashboardData.recent_applications.length > 3 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 sm:mt-4 text-xs sm:text-sm"
                  onClick={() => navigate('/applications')}
                >
                  View All Applications
                </Button>
              )}
            </div>
          )}
        </Card>
      </section>
    </motion.div>
  );
}