import { useState, useEffect } from "react";
import { useOutletContext, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Plus,
  Clock,
  Mail,
  CheckCircle,
  AlertCircle,
  XCircle,
  Circle,
  Loader2,
  Building2,
  MapPin,
  BookOpen,
  Send,
  X,
  Wifi,
  WifiOff
} from "lucide-react";
import { getApplications, createApplication, submitApplication } from '@/services/auth.js';
import { universityAPI, courseAPI } from '@/services/api.js';

type Country = "DE" | "UK";

interface ContextType {
  selectedCountry: Country;
}

const statusConfig = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-800", icon: Circle },
  submitted: { label: "Submitted", color: "bg-blue-100 text-blue-800", icon: Clock },
  offer: { label: "Offer Received", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle },
  waitlist: { label: "Waitlisted", color: "bg-yellow-100 text-yellow-800", icon: AlertCircle }
};

// New Application Modal Component
const NewApplicationModal = ({ isOpen, onClose, preSelectedUniversity, preSelectedCourse, selectedCountry, isUsingMockData }) => {
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(preSelectedUniversity?.id || '');
  const [selectedCourse, setSelectedCourse] = useState(preSelectedCourse?.id || '');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Mock data for when API is not available
  const getMockUniversities = () => {
    if (selectedCountry === "DE") {
      return [
        { id: "1", name: "Technical University of Munich", city: "Munich" },
        { id: "2", name: "University of Heidelberg", city: "Heidelberg" },
        { id: "3", name: "Humboldt University", city: "Berlin" }
      ];
    } else {
      return [
        { id: "1", name: "University of Cambridge", city: "Cambridge" },
        { id: "2", name: "Oxford University", city: "Oxford" },
        { id: "3", name: "Imperial College London", city: "London" }
      ];
    }
  };

  const getMockCourses = () => [
    { id: "1", name: "Computer Science", degree_type: "Bachelor's" },
    { id: "2", name: "Business Administration", degree_type: "Master's" },
    { id: "3", name: "Engineering", degree_type: "Bachelor's" }
  ];

  useEffect(() => {
    if (isOpen) {
      if (isUsingMockData) {
        setUniversities(getMockUniversities());
      } else {
        loadUniversities();
      }
    }
  }, [isOpen, selectedCountry, isUsingMockData]);

  useEffect(() => {
    if (selectedUniversity) {
      if (isUsingMockData) {
        setCourses(getMockCourses());
      } else {
        loadCourses();
      }
    } else {
      setCourses([]);
      setSelectedCourse('');
    }
  }, [selectedUniversity, isUsingMockData]);

  const loadUniversities = async () => {
    try {
      setLoading(true);
      const country = selectedCountry === "DE" ? "Germany" : "United Kingdom";
      const universitiesData = await universityAPI.getUniversities({ country });
      setUniversities(Array.isArray(universitiesData) ? universitiesData : []);
    } catch (err) {
      console.error('Error loading universities:', err);
      setError('Failed to load universities, using mock data');
      setUniversities(getMockUniversities());
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      setLoading(true);
      const coursesData = await universityAPI.getUniversityCourses(selectedUniversity);
      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (err) {
      console.error('Error loading courses:', err);
      setError('Failed to load courses for this university, using mock data');
      setCourses(getMockCourses());
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedUniversity || !selectedCourse) {
      setError('Please select both university and course');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      if (isUsingMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        onClose(true); // Pass true to indicate success
        return;
      }
      
      const country = selectedCountry === "DE" ? "germany" : "united_kingdom";
      
      await createApplication({
        university: selectedUniversity,
        course: selectedCourse,
        country: country
      });

      onClose(true); // Pass true to indicate success
    } catch (err) {
      console.error('Error creating application:', err);
      setError(err.message || 'Failed to create application');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#C4DFF0] to-[#E08D3C]">
          <div className="flex items-center justify-between text-white">
            <div>
              <h2 className="text-2xl font-bold">New Application</h2>
              <p className="text-white text-opacity-90 flex items-center gap-2">
                Create a new university application
                
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onClose()}
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {isUsingMockData && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 text-sm">
              <div className="flex items-center gap-2">
                <WifiOff className="w-4 h-4" />
                <span>Demo Mode: API server is not available. Using sample data for demonstration.</span>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* University Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select University
              </label>
              <select
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
                className="w-full h-12 rounded-lg border-gray-300 text-sm px-3 bg-white"
                disabled={loading || preSelectedUniversity}
              >
                <option value="">Choose a university...</option>
                {universities.map(uni => (
                  <option key={uni.id} value={uni.id}>
                    {uni.name} - {uni.city}
                  </option>
                ))}
              </select>
              {preSelectedUniversity && (
                <p className="text-xs text-gray-500 mt-1">
                  Pre-selected from your university search
                </p>
              )}
            </div>

            {/* Course Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full h-12 rounded-lg border-gray-300 text-sm px-3 bg-white"
                disabled={!selectedUniversity || loading || preSelectedCourse}
              >
                <option value="">Choose a course...</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.degree_type})
                  </option>
                ))}
              </select>
              {preSelectedCourse && (
                <p className="text-xs text-gray-500 mt-1">
                  Pre-selected from your course search
                </p>
              )}
              {selectedUniversity && courses.length === 0 && !loading && (
                <p className="text-xs text-gray-500 mt-1">
                  No courses found for this university
                </p>
              )}
            </div>

            {loading && (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-[#E08D3C]" />
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => onClose()}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedUniversity || !selectedCourse || submitting}
              className="bg-[#2C3539] hover:bg-[#1e2529]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Application
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Applications() {
  const { selectedCountry } = useOutletContext<ContextType>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for applications
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preSelectedUniversity, setPreSelectedUniversity] = useState(null);
  const [preSelectedCourse, setPreSelectedCourse] = useState(null);

  // Mock data for when API is not available
  const getMockApplications = () => {
    const mockData = [
      {
        id: "mock-1",
        university: "1",
        course: "1",
        country: selectedCountry === "DE" ? "germany" : "united_kingdom",
        status: "draft",
        created_at: "2024-01-15T10:00:00Z",
        universityData: {
          id: "1",
          name: selectedCountry === "DE" ? "Technical University of Munich" : "University of Cambridge",
          city: selectedCountry === "DE" ? "Munich" : "Cambridge"
        },
        courseData: {
          id: "1",
          name: selectedCountry === "DE" ? "Computer Science" : "Computer Science",
          degree_type: "Bachelor's"
        },
        adminName: "Dr. Academic Admin",
        adminEmail: "admin@university.edu",
        deadline: "March 15, 2024",
        logo: "🏛️"
      },
      {
        id: "mock-2",
        university: "2",
        course: "2", 
        country: selectedCountry === "DE" ? "germany" : "united_kingdom",
        status: "submitted",
        created_at: "2024-01-10T10:00:00Z",
        universityData: {
          id: "2",
          name: selectedCountry === "DE" ? "University of Heidelberg" : "Oxford University",
          city: selectedCountry === "DE" ? "Heidelberg" : "Oxford"
        },
        courseData: {
          id: "2",
          name: "Business Administration",
          degree_type: "Master's"
        },
        adminName: "Dr. Business Admin",
        adminEmail: "admin@business.edu",
        deadline: "February 28, 2024",
        logo: "🏛️"
      },
      {
        id: "mock-3",
        university: "3",
        course: "3",
        country: selectedCountry === "DE" ? "germany" : "united_kingdom",
        status: "offer",
        created_at: "2024-01-05T10:00:00Z",
        universityData: {
          id: "3",
          name: selectedCountry === "DE" ? "Humboldt University" : "Imperial College London",
          city: selectedCountry === "DE" ? "Berlin" : "London"
        },
        courseData: {
          id: "3",
          name: "Engineering",
          degree_type: "Master's"
        },
        adminName: "Dr. Engineering Admin",
        adminEmail: "admin@engineering.edu",
        deadline: "January 31, 2024",
        logo: "🏛️"
      }
    ];
    
    return mockData;
  };

  // Check if API is available
  const checkApiConnection = async () => {
    try {
      const response = await fetch('https://3db7221c2aa9.ngrok-free.app/api/', {
        method: 'HEAD',
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });
      return response.ok;
    } catch (error) {
      console.log('API connection check failed:', error);
      return false;
    }
  };

  // Check if user came from university page with pre-selection
  useEffect(() => {
    if (location.state?.university) {
      setPreSelectedUniversity(location.state.university);
      setPreSelectedCourse(location.state.course || null);
      setIsModalOpen(true);
      // Clear the state to prevent reopening modal on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  // Load applications on mount and when country changes
  useEffect(() => {
    loadApplications();
  }, [selectedCountry]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError('');
      setIsUsingMockData(false);
      
      // First check if API is available
      const isApiAvailable = await checkApiConnection();
      
      if (!isApiAvailable) {
        console.log('API server is not available, using mock data');
        setApplications(getMockApplications());
        setIsUsingMockData(true);
        return;
      }

      // Try to get real data from API
      try {
        const applicationsData = await getApplications();
        
        // Filter applications by country
        const countryFilter = selectedCountry === "DE" ? "germany" : "united_kingdom";
        const filteredApplications = applicationsData.filter(app => 
          app.country === countryFilter
        );
        
        // Enrich applications with university and course data
        const enrichedApplications = await Promise.all(
          filteredApplications.map(async (app) => {
            try {
              const [university, course] = await Promise.all([
                universityAPI.getUniversityById(app.university),
                courseAPI.getCourseById(app.course)
              ]);
              
              return {
                ...app,
                universityData: university,
                courseData: course,
                adminName: `Dr. ${university.name.split(' ').slice(-1)[0]} Admin`,
                adminEmail: `admin@${university.name.toLowerCase().replace(/\s+/g, '')}.edu`,
                deadline: course.application_deadline || "March 15, 2024",
                logo: "🏛️"
              };
            } catch (err) {
              console.error(`Error enriching application ${app.id}:`, err);
              return {
                ...app,
                universityData: { name: 'Unknown University', city: 'Unknown' },
                courseData: { name: 'Unknown Course', degree_type: 'Unknown' },
                adminName: 'Admin',
                adminEmail: 'admin@university.edu',
                deadline: "March 15, 2024",
                logo: "🏛️"
              };
            }
          })
        );
        
        setApplications(enrichedApplications);
        setIsUsingMockData(false);
        
      } catch (apiError) {
        console.error('API request failed, falling back to mock data:', apiError);
        setApplications(getMockApplications());
        setIsUsingMockData(true);
      }
      
    } catch (err) {
      console.error('Error loading applications:', err);
      // Even if everything fails, show mock data instead of error
      setApplications(getMockApplications());
      setIsUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitApplication = async (applicationId) => {
    if (isUsingMockData) {
      // Simulate submission for mock data
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'submitted' }
            : app
        )
      );
      return;
    }

    try {
      await submitApplication(applicationId);
      // Reload applications to get updated status
      await loadApplications();
    } catch (err) {
      console.error('Error submitting application:', err);
      alert(err.message || 'Failed to submit application');
    }
  };

  const handleModalClose = (success = false) => {
    setIsModalOpen(false);
    setPreSelectedUniversity(null);
    setPreSelectedCourse(null);
    
    // If application was created successfully, reload applications
    if (success && !isUsingMockData) {
      loadApplications();
    } else if (success && isUsingMockData) {
      // For mock data, just add a new mock application
      const newMockApp = {
        id: `mock-${Date.now()}`,
        university: "3",
        course: "3",
        country: selectedCountry === "DE" ? "germany" : "united_kingdom", 
        status: "draft",
        created_at: new Date().toISOString(),
        universityData: {
          id: "3",
          name: "New University",
          city: "Demo City"
        },
        courseData: {
          id: "3", 
          name: "Demo Course",
          degree_type: "Bachelor's"
        },
        adminName: "Dr. Demo Admin",
        adminEmail: "admin@demo.edu",
        deadline: "March 15, 2024",
        logo: "🏛️"
      };
      setApplications(prev => [newMockApp, ...prev]);
    }
  };

  // Calculate progress based on status
  const getProgress = (status) => {
    switch (status) {
      case 'draft': return 40;
      case 'submitted': return 75;
      case 'offer': return 100;
      case 'rejected': return 100;
      case 'waitlist': return 85;
      default: return 0;
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#E08D3C]" />
          <span className="ml-2 text-gray-600">Loading your applications...</span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="font-bold text-xl text-[#2C3539] mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button 
            onClick={loadApplications}
            className="bg-[#E08D3C] hover:bg-[#c77a32] text-white font-bold px-6 py-3 rounded-lg"
          >
            Try Again
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Applications</h1>
            
          </div>
          <p className="text-muted-foreground">
            Track and manage your university applications for {selectedCountry === "DE" ? "Germany" : "United Kingdom"}
            
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            className="rounded-pill shadow-medium hover:shadow-float transition-shadow"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Application
          </Button>
        </motion.div>
      </motion.div>

      {/* Applications List */}
      <motion.div 
        className="space-y-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {applications.length > 0 ? (
          applications.map((application) => {
            const StatusIcon = statusConfig[application.status as keyof typeof statusConfig].icon;
            const progress = getProgress(application.status);
            
            return (
              <motion.div
                key={application.id}
                variants={item}
                whileHover={{ y: -2, scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-6 hover:shadow-medium transition-all duration-standard">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* University Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white text-xl">
                        {application.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1">
                          {application.universityData.name}
                        </h3>
                        <p className="text-muted-foreground mb-2">
                          {application.courseData.name}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {application.universityData.city}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Due: {application.deadline}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress and Status */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="w-full sm:w-32">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Progress</span>
                          <span className="text-xs font-medium">{progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <motion.div 
                            className="bg-gradient-primary h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge 
                          className={cn(
                            "rounded-pill",
                            statusConfig[application.status as keyof typeof statusConfig].color
                          )}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[application.status as keyof typeof statusConfig].label}
                        </Badge>
                        
                        {application.status === 'draft' && (
                          <Button
                            size="sm"
                            onClick={() => handleSubmitApplication(application.id)}
                            className="bg-[#2C3539] hover:bg-[#1e2529] text-white"
                          >
                            <Send className="w-3 h-3 mr-1" />
                            Submit
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Admin Contact */}
                    <div className="flex flex-col text-sm">
                      <span className="font-medium">{application.adminName}</span>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{application.adminEmail}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-600 mb-4">No applications yet</h3>
              <p className="text-gray-500 mb-8 text-lg leading-relaxed">
                Start your university journey by creating your first application. Browse universities and courses to get started!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#E08D3C] hover:bg-[#c77a32] text-white font-bold px-8 py-3 rounded-lg text-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Application
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/universities')}
                  className="border-[#2C3539] text-[#2C3539] hover:bg-[#2C3539] hover:text-white font-bold px-8 py-3 rounded-lg text-lg"
                >
                  <Building2 className="w-5 h-5 mr-2" />
                  Browse Universities
                </Button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Stats Footer */}
      {applications.length > 0 && (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{applications.length}</div>
            <div className="text-sm text-muted-foreground">Total Applications</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {applications.filter(app => app.status === 'offer').length}
            </div>
            <div className="text-sm text-muted-foreground">Offers Received</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {applications.filter(app => app.status === 'submitted').length}
            </div>
            <div className="text-sm text-muted-foreground">Under Review</div>
          </Card>
        </motion.div>
      )}

      {/* New Application Modal */}
      <NewApplicationModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        preSelectedUniversity={preSelectedUniversity}
        preSelectedCourse={preSelectedCourse}
        selectedCountry={selectedCountry}
      />
    </motion.div>
  );
}