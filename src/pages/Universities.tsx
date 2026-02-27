import { useState, useEffect, useMemo } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getStudentProfile } from "@/services/studentProfile";
import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  Heart,
  MapPin,
  Star,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  ExternalLink,
  Bookmark,
  Loader2,
  Building2,
  ChevronLeft,
  BookOpen,
  Clock,
  GraduationCap,
  Globe,
  X,
  ChevronDown,
  ChevronUp,
  FileText,
  CreditCard,
  Lock,
  Upload,
  Check,
  AlertCircle,      // ADD THIS
  ChevronRight,
} from "lucide-react";
import { universityAPI } from "@/services/api";
import { 
  createApplication, 
  submitApplication,
  getAllCourses,
  addCourseToFavorites,
  removeCourseFromFavorites,
  getApplicationById, 
  getProfileProgress
} from "@/services/studentProfile";
import { useAuth } from "@/contexts/AuthContext";

type Country = "DE" | "UK";

interface ContextType {
  selectedCountry: Country;
}

const filters = [
  "All",
  "Top 50",
  "High Match",
  "Low Tuition",
  "High Acceptance",
];

// Course Modal Component
const CourseModal = ({ 
  university, 
  isOpen, 
  onClose, 
  setSelectedCourse, 
  setSelectedUniversity, 
  setIsPaymentModalOpen, 
  setIsFormModalOpen,
  fetchAndProcessProfile,
  checkProfileCompletion,  // ADD THIS
  setShowProfileIncompleteModal  // ADD THIS
}) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDegreeType, setSelectedDegreeType] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && university) {
      loadCourses();
    }
  }, [isOpen, university]);

const loadCourses = async () => {
  try {
    setLoading(true);
    setError(null);
    
    console.log('[CourseModal] Fetching ALL courses from API...');
    console.log('[CourseModal] Selected university:', university);
    
    // Fetch all courses from the API
    const response = await getAllCourses();
    
    console.log('[CourseModal] Raw courses API response:', response);
    
    // Extract courses array
    let coursesArray = [];
    if (Array.isArray(response)) {
      coursesArray = response;
    } else if (response?.data && Array.isArray(response.data)) {
      coursesArray = response.data;
    }
    
    console.log('[CourseModal] Total courses from API:', coursesArray.length);
    
    // Filter courses for the selected university
    const universityCourses = coursesArray.filter(
      course => course.universityId === university.id
    );
    
    console.log('[CourseModal] Courses for this university:', universityCourses.length);
    
    // CRITICAL: PRESERVE ALL ORIGINAL API FIELDS
    // Map API response to internal format while keeping original fields
    const mappedCourses = universityCourses.map(course => ({
      // Keep ALL original API fields (these are what the backend needs)
      id: course.id,
      universityId: course.universityId,
      universityName: course.universityName,
      universityCode: course.universityCode,
      universityCountry: course.universityCountry,
      name: course.name,
      courseCode: course.courseCode,
      degreeLevel: course.degreeLevel,           // CRITICAL: Keep as MASTERS/BACHELORS
      degreeType: course.degreeType,
      fieldOfStudy: course.fieldOfStudy,
      studyMode: course.studyMode,
      durationYears: course.durationYears,
      tuitionInternational: course.tuitionInternational,
      currency: course.currency,
      scholarshipsAvailable: course.scholarshipsAvailable,
      intakeSeasons: course.intakeSeasons || [],
      applicationDeadline: course.applicationDeadline,
      careerOpportunities: course.careerOpportunities || [],
      isPopular: course.isPopular,
      rating: course.rating,
      hasApplied: course.hasApplied,
      isFavorite: course.isFavorite,
      canApplyNow: course.canApplyNow,
      
      // ALSO keep mapped fields for UI display (backward compatibility)
      university_id: course.universityId,
      subject_area: course.fieldOfStudy,
      degree_type: course.degreeLevel?.toLowerCase() || 'masters',
      degree_level: course.degreeType,
      language: 'English',
      duration_months: (course.durationYears || 3) * 12,
      duration_years: course.durationYears,
      intake_season: course.intakeSeasons?.[0] || 'WINTER',
      tuition_fee: course.tuitionInternational || 0,
      min_gpa: '2.5',
      min_ielts: '6.5',
      study_mode: course.studyMode,
      scholarships_available: course.scholarshipsAvailable,
      is_popular: course.isPopular,
      has_applied: course.hasApplied,
      is_favorite: course.isFavorite,
      can_apply_now: course.canApplyNow,
      description: `${course.degreeType} in ${course.fieldOfStudy}`,
    }));
    
    console.log('[CourseModal] ✅ Mapped courses with preserved fields:', mappedCourses);
    console.log('[CourseModal] Sample course degreeLevel:', mappedCourses[0]?.degreeLevel);
    console.log('[CourseModal] Sample course universityCountry:', mappedCourses[0]?.universityCountry);
    
    setCourses(mappedCourses);
    
  } catch (err) {
    console.error("❌ Error loading courses:", err);
    setError("Failed to load courses. Please try again.");
    setCourses([]);
  } finally {
    setLoading(false);
  }
};

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        !searchQuery ||
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.subject_area.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDegree =
        selectedDegreeType === "all" ||
        course.degree_type === selectedDegreeType;
      const matchesSubject =
        selectedSubject === "all" || course.subject_area === selectedSubject;
      const matchesLanguage =
        selectedLanguage === "all" ||
        course.language.toLowerCase() === selectedLanguage.toLowerCase();

      return (
        matchesSearch && matchesDegree && matchesSubject && matchesLanguage
      );
    });
  }, [
    courses,
    searchQuery,
    selectedDegreeType,
    selectedSubject,
    selectedLanguage,
  ]);

  const uniqueSubjects = [
    ...new Set(courses.map((course) => course.subject_area)),
  ];
  const uniqueLanguages = [
    ...new Set(courses.map((course) => course.language)),
  ];

  const formatTuition = (tuition) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(tuition));
  };

  const formatDuration = (months) => {
    if (months >= 12) {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      if (remainingMonths === 0) {
        return `${years} year${years > 1 ? "s" : ""}`;
      }
      return `${years}y ${remainingMonths}m`;
    }
    return `${months} months`;
  };

// Modify the handleApplyNow function in CourseModal (around line 180)
// REPLACE the entire handleApplyNow function with:
const handleApplyNow = async (course) => {
  console.log('=== COURSE SELECTED FOR APPLICATION ===');
  console.log('Course ID:', course.id);
  console.log('Course degreeLevel:', course.degreeLevel);
  console.log('University ID:', university.id);
  console.log('University Country:', course.universityCountry || university.country);
  
  if (!course || !course.id) {
    alert('Error: Invalid course selected. Please try again.');
    return;
  }
  
  if (!university || !university.id) {
    alert('Error: University information missing. Please try again.');
    return;
  }
  
  // CRITICAL: Store course and university in parent state
  // Make sure we're passing the FULL course object with all fields
  console.log('Setting selectedCourse and selectedUniversity...');
  setSelectedCourse(course);
  setSelectedUniversity(university);
  
  // Check if profile is complete
  console.log('Checking profile completion...');
  const isComplete = await checkProfileCompletion();
  
  if (!isComplete) {
    // Store the course and university for return after profile completion
    sessionStorage.setItem('returnToUniversity', JSON.stringify({
      universityId: university.id,
      universityName: university.name,
      courseId: course.id,
      courseName: course.name,
      courseDegreeLevel: course.degreeLevel, // Store this too
      timestamp: Date.now()
    }));
    
    console.log('Profile incomplete, showing profile modal...');
    onClose();
    setShowProfileIncompleteModal(true);
    return;
  }
  
  // Profile is complete, proceed normally
  console.log('Profile complete, fetching profile data...');
  await fetchAndProcessProfile();
  
  console.log('Closing course modal...');
  onClose();
  
  // THEN open form modal with a small delay
  setTimeout(() => {
    console.log('Opening form modal...');
    setIsFormModalOpen(true);
  }, 100);
};

const handleFavoriteClick = async (courseId, isFavorite) => {
  try {
    console.log(`[CourseModal] Toggling favorite for course ${courseId}, current state: ${isFavorite}`);
    
    if (isFavorite) {
      await removeCourseFromFavorites(courseId);
      console.log(`[CourseModal] ✅ Removed course ${courseId} from favorites`);
    } else {
      await addCourseToFavorites(courseId);
      console.log(`[CourseModal] ✅ Added course ${courseId} to favorites`);
    }
    
    // Refresh courses to update favorite status
    await loadCourses();
  } catch (error) {
    console.error('Error toggling favorite:', error);
    alert('Failed to update favorites. Please try again.');
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#C4DFF0] to-[#E08D3C]">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden shadow-lg">
                {university.image_url ? (
                  <img
                    src={university.image_url}
                    alt={university.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white bg-opacity-20 flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{university.name}</h2>
                <p className="text-white text-opacity-90 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {university.city}
                  {university.country ? `, ${university.country}` : ""}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20">
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-hidden">
          {/* Filters */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedDegreeType}
                onChange={(e) => setSelectedDegreeType(e.target.value)}
                className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
                <option value="all">All Degrees</option>
                <option value="bachelors">Bachelor's</option>
                <option value="masters">Master's</option>
                <option value="phd">PhD</option>
              </select>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
                <option value="all">All Subjects</option>
                {uniqueSubjects.map((subject, index) => (
  <option key={`subject-${index}-${subject}`} value={subject}>
    {subject}
  </option>
))}
              </select>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
                <option value="all">All Languages</option>
                {uniqueLanguages.map((language, index) => (
  <option key={`language-${index}-${language}`} value={language}>
    {language}
  </option>
))}
              </select>
            </div>
            <p className="text-sm text-gray-600">
              Showing {filteredCourses.length} of {courses.length} courses
            </p>
          </div>

          {/* Courses List */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#E08D3C]" />
                <span className="ml-2 text-gray-600">Loading courses...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">{error}</p>
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
               {filteredCourses.map((course, index) => (
  <Card
    key={course.id || `course-${index}`}
    className="p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
  <h3 className="font-bold text-lg text-[#2C3539] line-clamp-2 flex-1">
    {course.name}
  </h3>
  <div className="flex items-center gap-2 ml-2">
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleFavoriteClick(course.id, course.is_favorite);
      }}
      className={`p-1 rounded-lg transition-all ${
        course.is_favorite
          ? 'text-red-500 hover:text-red-600 hover:bg-red-50'
          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
      }`}>
      <Heart className={`w-4 h-4 ${course.is_favorite ? 'fill-current' : ''}`} />
    </button>
    <Badge
      className={`text-xs ${
        course.degree_type === "phd"
          ? "bg-purple-100 text-purple-800"
          : course.degree_type === "masters"
          ? "bg-blue-100 text-blue-800"
          : "bg-green-100 text-green-800"
      }`}>
      {course.degree_type.charAt(0).toUpperCase() +
        course.degree_type.slice(1)}
    </Badge>
  </div>
</div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          <BookOpen className="w-3 h-3 mr-1" />
                          {course.subject_area}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Globe className="w-3 h-3 mr-1" />
                          {course.language}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDuration(course.duration_months)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {course.intake_season}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Tuition Fee:</span>
                          <p className="font-semibold text-[#E08D3C]">
                            {formatTuition(course.tuition_fee)}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Min GPA:</span>
                          <p className="font-semibold">{course.min_gpa}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Min IELTS:</span>
                          <p className="font-semibold">{course.min_ielts}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <p className="font-semibold">
                            {formatDuration(course.duration_months)}
                          </p>
                        </div>
                      </div>

                      {course.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {course.description}
                        </p>
                      )}

                      <div className="flex gap-2 pt-2">
                        
                        <Button
                          size="sm"
                          className="flex-1 bg-[#2C3539] hover:bg-[#1e2529]"
                          onClick={() => handleApplyNow(course)}>
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-600 mb-2">
                  No courses found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Incomplete Modal
// Profile Incomplete Modal
// Profile Incomplete Modal
const ProfileIncompleteModal = ({ isOpen, onClose, profilePercentage }) => {
  const navigate = useNavigate(); // ADD THIS - import navigate inside the component
  
  if (!isOpen) return null;

  const handleGoToProfile = () => {
    onClose();
    navigate("/profilebuilder");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-lg">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#C4DFF0] to-[#E08D3C] text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-bold">Complete Your Profile</h2>
                <p className="text-sm text-white text-opacity-90">Required to apply</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-center">
            <p className="text-gray-700 mb-4">
              To make your application process smooth and easy, please complete your profile first.
            </p>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Profile Completion</span>
                <span className="font-semibold text-[#E08D3C]">{profilePercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-[#E08D3C] h-3 rounded-full transition-all duration-300"
                  style={{ width: `${profilePercentage}%` }}
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm text-blue-800">
                  <Star className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Discover the best courses for you</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-blue-800">
                  <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Auto-fill application forms instantly</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-blue-800">
                  <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Boost your acceptance chances</span>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11"
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleGoToProfile}
              className="flex-1 h-11 bg-[#E08D3C] hover:bg-[#c77a32] text-white font-semibold"
            >
              Complete Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const generateFormFields = (course, university) => {
  const fields = [];
  
  // Section 1: Personal Information (Always Required)
  fields.push({
    section: 'Personal Information',
    sectionNumber: 1,
    fields: [
      {
        id: 'fullName',
        label: 'Full Name',
        type: 'text',
        required: true,
        placeholder: 'Enter your full name',
        validation: (value) => value?.trim() ? null : 'Full name is required'
      },
      {
        id: 'email',
        label: 'Email Address',
        type: 'email',
        required: true,
        placeholder: 'your.email@example.com',
        validation: (value) => {
          if (!value?.trim()) return 'Email is required';
          if (!/\S+@\S+\.\S+/.test(value)) return 'Invalid email format';
          return null;
        }
      },
      {
        id: 'phone',
        label: 'Phone Number',
        type: 'tel',
        required: true,
        placeholder: '+1234567890',
        validation: (value) => value?.trim() ? null : 'Phone number is required'
      },
      {
        id: 'dateOfBirth',
        label: 'Date of Birth',
        type: 'date',
        required: true,
        validation: (value) => value ? null : 'Date of birth is required'
      },
      {
        id: 'nationality',
        label: 'Nationality',
        type: 'text',
        required: true,
        placeholder: 'Your nationality',
        validation: (value) => value?.trim() ? null : 'Nationality is required'
      },
      {
        id: 'passportNumber',
        label: 'Passport Number',
        type: 'text',
        required: false,
        placeholder: 'Optional'
      }
    ]
  });
  
  // Section 2: Academic Background (Dynamic based on degree level)
  const academicFields = [];
  
  // Previous degree required for Masters/PhD
  if (course.degree_type === 'masters' || course.degree_type === 'phd') {
    academicFields.push({
      id: 'previousDegree',
      label: 'Previous Degree',
      type: 'text',
      required: true,
      placeholder: 'e.g., Bachelor of Science in Computer Science',
      validation: (value) => value?.trim() ? null : 'Previous degree is required for graduate programs'
    });
    
    academicFields.push({
      id: 'previousUniversity',
      label: 'Previous University',
      type: 'text',
      required: true,
      placeholder: 'Name of your previous university',
      validation: (value) => value?.trim() ? null : 'Previous university is required'
    });
    
    academicFields.push({
      id: 'graduationYear',
      label: 'Graduation Year',
      type: 'number',
      required: true,
      placeholder: 'e.g., 2023',
      validation: (value) => {
        if (!value) return 'Graduation year is required';
        const year = parseInt(value);
        if (year < 1950 || year > new Date().getFullYear() + 1) return 'Invalid year';
        return null;
      }
    });
  }
  
  // For PhD, add research experience
  if (course.degree_type === 'phd') {
    academicFields.push({
      id: 'researchExperience',
      label: 'Research Experience',
      type: 'textarea',
      required: true,
      placeholder: 'Describe your research experience and interests...',
      rows: 4,
      validation: (value) => {
        if (!value?.trim()) return 'Research experience is required for PhD programs';
        if (value.trim().length < 100) return 'Please provide at least 100 characters';
        return null;
      }
    });
    
    academicFields.push({
      id: 'publications',
      label: 'Publications (if any)',
      type: 'textarea',
      required: false,
      placeholder: 'List your publications...',
      rows: 3
    });
  }
  
  // GPA/Grade (Always required)
  academicFields.push({
    id: 'gpa',
    label: `GPA / Grade ${course.min_gpa ? `(Min: ${course.min_gpa})` : ''}`,
    type: 'text',
    required: true,
    placeholder: course.min_gpa ? `Minimum: ${course.min_gpa}` : 'Your GPA or grade',
    validation: (value) => value?.trim() ? null : 'GPA/Grade is required'
  });
  
  academicFields.push({
    id: 'gradingSystem',
    label: 'Grading System',
    type: 'select',
    required: false,
    options: [
      { value: '', label: 'Select grading system' },
      { value: '4.0', label: '4.0 Scale' },
      { value: '10.0', label: '10.0 Scale' },
      { value: '100', label: 'Percentage (100)' },
      { value: 'other', label: 'Other' }
    ]
  });
  
  fields.push({
    section: 'Academic Background',
    sectionNumber: 2,
    fields: academicFields
  });
  
  // Section 3: Language Proficiency (Dynamic based on course requirements)
  const languageFields = [];
  
  languageFields.push({
    id: 'languageTest',
    label: `Language Test ${course.min_ielts ? `(Min IELTS: ${course.min_ielts})` : ''}`,
    type: 'select',
    required: course.min_ielts ? true : false,
    options: [
      { value: '', label: 'Select test type' },
      { value: 'IELTS', label: 'IELTS' },
      { value: 'TOEFL', label: 'TOEFL' },
      { value: 'PTE', label: 'PTE' },
      { value: 'Duolingo', label: 'Duolingo English Test' },
      { value: 'Cambridge', label: 'Cambridge English' },
      { value: 'other', label: 'Other' }
    ],
    validation: course.min_ielts 
      ? (value) => value ? null : 'Language test is required for this course'
      : null
  });
  
  languageFields.push({
    id: 'languageScore',
    label: 'Score',
    type: 'text',
    required: course.min_ielts ? true : false,
    placeholder: course.min_ielts ? `Minimum: ${course.min_ielts}` : 'Your score',
    validation: course.min_ielts
      ? (value) => value?.trim() ? null : 'Language score is required'
      : null
  });
  
  languageFields.push({
    id: 'testDate',
    label: 'Test Date',
    type: 'date',
    required: false,
    placeholder: 'When did you take the test?'
  });
  
  fields.push({
    section: 'Language Proficiency',
    sectionNumber: 3,
    fields: languageFields
  });
  
  // Section 4: Work Experience (For Masters/PhD or Professional programs)
  if (course.degree_type === 'masters' || course.degree_type === 'phd' || 
      course.name?.toLowerCase().includes('mba') || 
      course.name?.toLowerCase().includes('executive')) {
    fields.push({
      section: 'Work Experience',
      sectionNumber: 4,
      fields: [
        {
          id: 'workExperience',
          label: 'Work Experience',
          type: 'textarea',
          required: course.degree_type === 'phd' || course.name?.toLowerCase().includes('mba'),
          placeholder: 'Describe your relevant work experience...',
          rows: 4,
          validation: (course.degree_type === 'phd' || course.name?.toLowerCase().includes('mba'))
            ? (value) => {
                if (!value?.trim()) return 'Work experience is required for this program';
                if (value.trim().length < 50) return 'Please provide at least 50 characters';
                return null;
              }
            : null
        },
        {
          id: 'yearsOfExperience',
          label: 'Years of Experience',
          type: 'number',
          required: false,
          placeholder: 'e.g., 3',
          min: 0,
          max: 50
        }
      ]
    });
  }
  
  // Add this BEFORE the "Letter of Motivation" section

// Section: Intake Preference (Dynamic based on available intakes)
const intakeSectionNumber = fields.length + 1;
const intakeFields = [];

// Get available intake seasons from course
const availableIntakes = course.intake_season 
  ? [course.intake_season] 
  : ['WINTER', 'SUMMER', 'SPRING', 'FALL'];

// Current year and next 2 years
const currentYear = new Date().getFullYear();
const availableYears = [currentYear, currentYear + 1, currentYear + 2];

intakeFields.push({
  id: 'targetSemester',
  label: 'Preferred Intake Season',
  type: 'select',
  required: true,
  options: [
    { value: '', label: 'Select intake season' },
    ...availableIntakes.map(intake => ({
      value: intake.toUpperCase(),
      label: intake.charAt(0).toUpperCase() + intake.slice(1).toLowerCase()
    }))
  ],
  validation: (value) => value ? null : 'Please select your preferred intake season'
});

intakeFields.push({
  id: 'targetYear',
  label: 'Preferred Intake Year',
  type: 'select',
  required: true,
  options: [
    { value: '', label: 'Select year' },
    ...availableYears.map(year => ({
      value: year.toString(),
      label: year.toString()
    }))
  ],
  validation: (value) => value ? null : 'Please select your preferred intake year'
});

fields.push({
  section: 'Intake Preference',
  sectionNumber: intakeSectionNumber,
  fields: intakeFields
});

  // Section 5: Letter of Motivation (Always Required)
  const motivationSectionNumber = fields.length + 1;
  fields.push({
    section: 'Letter of Motivation',
    sectionNumber: motivationSectionNumber,
    fields: [
      {
        id: 'motivation',
        label: 'Why do you want to study this course?',
        type: 'textarea',
        required: true,
        placeholder: `Explain your motivation for applying to ${course.name} at ${university?.name}...\n\nMinimum 100 characters required.`,
        rows: 6,
        validation: (value) => {
          if (!value?.trim()) return 'Letter of motivation is required';
          if (value.trim().length < 100) return 'Motivation letter should be at least 100 characters';
          return null;
        },
        showCharCount: true,
        minChars: 100
      },
      {
        id: 'careerGoals',
        label: 'Career Goals',
        type: 'textarea',
        required: false,
        placeholder: 'What are your career goals after completing this program?',
        rows: 3
      }
    ]
  });
  
  // Section 6: Additional Documents/Information
  const additionalSectionNumber = fields.length + 1;
  const additionalFields = [];
  
  // For specific programs, add specific requirements
  if (course.field_of_study?.toLowerCase().includes('art') || 
      course.field_of_study?.toLowerCase().includes('design')) {
    additionalFields.push({
      id: 'portfolioLink',
      label: 'Portfolio Link',
      type: 'url',
      required: true,
      placeholder: 'https://yourportfolio.com',
      validation: (value) => {
        if (!value?.trim()) return 'Portfolio is required for this program';
        try {
          new URL(value);
          return null;
        } catch {
          return 'Please enter a valid URL';
        }
      }
    });
  }
  
  if (course.field_of_study?.toLowerCase().includes('music')) {
    additionalFields.push({
      id: 'auditionLink',
      label: 'Audition/Performance Link',
      type: 'url',
      required: false,
      placeholder: 'https://youtube.com/...'
    });
  }
  
  additionalFields.push({
    id: 'additionalInfo',
    label: 'Additional Information',
    type: 'textarea',
    required: false,
    placeholder: 'Share any additional information that supports your application...',
    rows: 3
  });
  
  if (additionalFields.length > 0) {
    fields.push({
      section: 'Additional Information',
      sectionNumber: additionalSectionNumber,
      fields: additionalFields
    });
  }
  
  return fields;
};

// ============ DYNAMIC APPLICATION FORM ============
// ============ DYNAMIC APPLICATION FORM ============
const DynamicApplicationFormModal = ({ 
  university, 
  course, 
  isOpen, 
  onClose, 
  onSubmit, 
  profileData, 
  profileLoading,
  user,
}) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formFields, setFormFields] = useState([]);

  const convertDateFormat = (dateStr) => {
    if (!dateStr) return '';
    // Convert "2003-05-05" to "05-05-2003"
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  // Generate dynamic form fields when course changes
// Modify DynamicApplicationFormModal useEffect (around line 780)
// REPLACE the entire useEffect with:
  useEffect(() => {
    if (isOpen && course && university) {
      console.log('[DynamicForm] Generating form fields for course:', course.name);
      
      const fields = generateFormFields(course, university);
      setFormFields(fields);
      
      // Initialize form data with profile data if available
      const initialData = {
        // Hidden metadata
        targetCourse: course.name,
        targetCourseId: course.id,
        targetUniversity: university.name,
        targetUniversityId: university.id,
        degreeLevel: course.degree_type,
        intakeSeason: course.intake_season,
      };
      
      // Auto-fill from profile if available
      if (profileData) {
        console.log('[DynamicForm] Auto-filling with profile data:', profileData);
        
        const basicInfo = profileData.testing_basic_info || {};
        const education = profileData.education || {};
        const testScores = profileData.test_scores || {};
        const experience = profileData.experience || {};
        const preferences = profileData.preferences || {};
        
        // Personal Information
        // Personal Information
// Full name: combine from user auth object first, fallback to profileData top-level
initialData.fullName = 
  (user?.firstName && user?.lastName)
    ? `${user.firstName} ${user.lastName}`.trim()
    : (user?.first_name && user?.last_name)
    ? `${user.first_name} ${user.last_name}`.trim()
    : user?.name || 
      profileData?.full_name || 
      `${profileData?.first_name || ''} ${profileData?.last_name || ''}`.trim() || 
      '';

initialData.email = user?.email || profileData?.email || '';

// Phone: check basicInfo first, then top-level profileData
initialData.phone = 
  basicInfo.phone || 
  profileData?.phone || 
  '';

// Date of Birth: check basicInfo first, then top-level profileData
initialData.dateOfBirth = 
  convertDateFormat(basicInfo.date_of_birth) || 
  convertDateFormat(profileData?.date_of_birth) || 
  '';

// Nationality: check basicInfo first, then top-level profileData
initialData.nationality = 
  basicInfo.nationality || 
  profileData?.nationality || 
  '';

initialData.passportNumber = 
  basicInfo.passport_number || 
  profileData?.passport_number || 
  '';
        
        // Academic Background
        initialData.previousDegree = ''; // Can be filled manually
        initialData.previousUniversity = education.institution_name || '';
        initialData.graduationYear = education.graduation_year || '';
        initialData.gpa = education.gpa || '';
        initialData.gradingSystem = education.grading_system || '';
        
        // Research/Work Experience
        initialData.researchExperience = ''; // Can be filled manually
        initialData.publications = ''; // Can be filled manually
        
        // Work experience - combine if available
        if (experience.has_work_experience && experience.work_experiences?.length > 0) {
          const workExpText = experience.work_experiences
            .map(exp => `${exp.title || ''} at ${exp.company || ''} (${exp.duration || ''})`)
            .join('\n');
          initialData.workExperience = workExpText;
        } else if (experience.volunteer_work) {
          initialData.workExperience = `Volunteer: ${experience.volunteer_work}`;
        } else {
          initialData.workExperience = '';
        }
        
        initialData.yearsOfExperience = experience.total_experience_years || '';
        
        // Language Proficiency
        initialData.languageTest = testScores.test_type || '';
        initialData.languageScore = testScores.overall_score || '';
        initialData.testDate = convertDateFormat(testScores.test_date) || '';
        
        // Intake Preference - use preferences as default
        initialData.targetSemester = preferences.intake_semester?.toUpperCase() || course.intake_season;
        initialData.targetYear = preferences.intake_year || new Date().getFullYear() + 1;
        
        // Leave motivation and additional info empty for user to fill
        initialData.motivation = '';
        initialData.careerGoals = '';
        initialData.additionalInfo = '';
        initialData.portfolioLink = '';
        initialData.auditionLink = '';
        
        console.log('[DynamicForm] ✅ Auto-filled data:', initialData);
      } else {
        // Set empty values for all fields if no profile data
        fields.forEach(section => {
          section.fields.forEach(field => {
            if (!initialData[field.id]) {
              initialData[field.id] = '';
            }
          });
        });
      }
      
      setFormData(initialData);
      setErrors({});
      
      console.log('[DynamicForm] Generated', fields.length, 'sections');
    }
  }, [isOpen, course, university, profileData, user]);

  // Check if user is returning from profile builder


  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error when user types
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    formFields.forEach(section => {
      section.fields.forEach(field => {
        if (field.validation) {
          const error = field.validation(formData[field.id]);
          if (error) {
            newErrors[field.id] = error;
          }
        }
      });
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = document.querySelector('.border-red-500');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      alert('Please fill in all required fields correctly.');
      return;
    }
    
    console.log('[DynamicForm] Form validated, submitting:', formData);
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSubmit(formData, university);
    }, 1000);
  };

  // Check if profile is complete before allowing application


  // Render different field types
  const renderField = (field) => {
    const hasError = errors[field.id];
    const value = formData[field.id] || '';
    
    switch (field.type) {
      case 'select':
        return (
          <div key={field.id} className="space-y-1">
            <Label htmlFor={field.id} className="text-xs font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <select
              id={field.id}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={cn(
                "w-full h-9 rounded-md border text-xs px-2 bg-white",
                hasError ? "border-red-500" : "border-gray-300"
              )}>
              {field.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {hasError && <p className="text-red-500 text-[10px] mt-0.5">{hasError}</p>}
          </div>
        );
        
      case 'textarea':
        return (
          <div key={field.id} className="space-y-1">
            <Label htmlFor={field.id} className="text-xs font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={field.id}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              rows={field.rows || 3}
              placeholder={field.placeholder}
              className={cn("border-gray-300 text-xs", hasError && "border-red-500")}
            />
            {field.showCharCount && (
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>{value.length} / {field.minChars} minimum</span>
                {hasError && <span className="text-red-500">{hasError}</span>}
              </div>
            )}
            {!field.showCharCount && hasError && (
              <p className="text-red-500 text-[10px] mt-0.5">{hasError}</p>
            )}
          </div>
        );
        
      default: // text, email, tel, date, number, url
        return (
          <div key={field.id} className="space-y-1">
            <Label htmlFor={field.id} className="text-xs font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
              className={cn("border-gray-300 h-9 text-xs", hasError && "border-red-500")}
            />
            {hasError && <p className="text-red-500 text-[10px] mt-0.5">{hasError}</p>}
          </div>
        );
    }
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col">
        {/* Header - Compact */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#C4DFF0] to-[#E08D3C] rounded-t-lg flex-shrink-0">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold leading-tight">{course.name}</h2>
                <p className="text-xs text-white text-opacity-90">{university?.name}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 h-8 w-8 p-0">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Course Summary - Compact */}
        <div className="p-3 bg-blue-50 border-b border-blue-100 flex-shrink-0">
          <div className="grid grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-blue-600 block mb-0.5">Degree Level:</span>
              <p className="font-semibold text-blue-900 capitalize text-xs">{course.degree_type}</p>
            </div>
            <div>
              <span className="text-blue-600 block mb-0.5">Duration:</span>
              <p className="font-semibold text-blue-900 text-xs">{course.duration_years} years</p>
            </div>
            <div>
              <span className="text-blue-600 block mb-0.5">Tuition Fee:</span>
              <p className="font-semibold text-blue-900 text-xs">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: course.currency || 'EUR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(course.tuition_fee || 0)}
              </p>
            </div>
            <div>
              <span className="text-blue-600 block mb-0.5">Intake:</span>
              <p className="font-semibold text-blue-900 text-xs">{course.intake_season}</p>
            </div>
          </div>
        </div>

        {/* Requirements Notice - Compact */}
        <div className="p-3 bg-yellow-50 border-b border-yellow-100 flex-shrink-0">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs">
              <h4 className="font-semibold text-yellow-900 mb-1">Minimum Requirements</h4>
              <div className="text-yellow-700 space-y-0.5">
                <p>• Min GPA: <strong>{course.min_gpa || 'N/A'}</strong> | Min IELTS: <strong>{course.min_ielts || 'N/A'}</strong></p>
                {(course.degree_type === 'masters' || course.degree_type === 'phd') && (
                  <p>• Bachelor's degree required</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {profileLoading && (
          <div className="p-3 bg-blue-50 border-b border-blue-100 flex items-center gap-2 flex-shrink-0">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span className="text-xs text-blue-700">Loading your profile data...</span>
          </div>
        )}

        {profileData && !profileLoading && (
          <div className="p-3 bg-green-50 border-b border-green-100 flex items-start gap-2 flex-shrink-0">
            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-green-700">
              <p className="font-semibold mb-1">Profile data loaded</p>
              <p>Some fields have been auto-filled from your profile. Please review and complete remaining fields.</p>
            </div>
          </div>
        )}

        {/* Dynamic Form Sections - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {formFields.map((section) => (
              <div key={section.sectionNumber} className="space-y-3">
                <h3 className="text-sm font-bold text-[#2C3539] flex items-center pb-2 border-b border-gray-200">
                  <span className="w-6 h-6 rounded-full bg-[#E08D3C] text-white flex items-center justify-center mr-2 text-xs font-bold">
                    {section.sectionNumber}
                  </span>
                  {section.section}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {section.fields.map((field) => {
                    // Full width for textareas and certain fields
                    const isFullWidth = field.type === 'textarea' || 
                                       field.id === 'email' ||
                                       field.id === 'portfolioLink' ||
                                       field.id === 'auditionLink';
                    
                    return (
                      <div key={field.id} className={isFullWidth ? "md:col-span-2" : ""}>
                        {renderField(field)}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </form>
        </div>

        {/* Footer - Compact & Sticky */}
        <div className="p-3 border-t border-gray-200 bg-white flex justify-between items-center gap-3 rounded-b-lg flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 h-9 text-xs">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 h-9 bg-[#E08D3C] hover:bg-[#c77a32] text-white text-xs font-semibold">
            {loading ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
                Processing...
              </>
            ) : (
              <>
                Continue to Payment
                <ChevronRight className="w-3 h-3 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
// ============ END DYNAMIC FORM ============

// Payment Modal
const PaymentModal = ({ university, isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value.replace(/\s/g, '');
    
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
      if (formattedValue.length > 19) return;
    } else if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/, '$1/');
      if (formattedValue.length > 5) return;
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 3) return;
    }
    
    setCardDetails((prev) => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validatePayment = () => {
    const newErrors = {};
    const cardNumberDigits = cardDetails.cardNumber.replace(/\s/g, '');
    if (cardNumberDigits.length < 13) newErrors.cardNumber = "Invalid card";
    if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) newErrors.expiry = "Invalid MM/YY";
    if (cardDetails.cvv.length !== 3) newErrors.cvv = "Invalid CVV";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePay = (e) => {
  e.preventDefault();
  if (validatePayment()) {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log("Payment successful, calling onSuccess with university:", university);
      onSuccess(university); // Pass university explicitly
    }, 2000);
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-lg max-w-md w-full shadow-lg">
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-[#C4DFF0] to-[#E08D3C] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <div>
                <h2 className="text-lg font-bold">Payment</h2>
                <p className="text-xs">Fee: €50 - {university?.name}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePay} className="p-4 space-y-3">
          {/* Card Number */}
          <div className="space-y-1">
            <Label htmlFor="cardNumber" className="text-xs font-semibold text-gray-700 flex items-center">
              <CreditCard className="w-3 h-3 mr-1" />
              Card Number
            </Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardDetails.cardNumber}
              onChange={handleInputChange}
              className={cn(
                "h-9 text-sm",
                errors.cardNumber ? "border-red-500" : "border-gray-200"
              )}
            />
            {errors.cardNumber && <p className="text-red-500 text-xs">{errors.cardNumber}</p>}
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="expiry" className="text-xs font-semibold text-gray-700 flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                Expiry
              </Label>
              <Input
                id="expiry"
                name="expiry"
                placeholder="MM/YY"
                value={cardDetails.expiry}
                onChange={handleInputChange}
                className={cn(
                  "h-9 text-sm",
                  errors.expiry ? "border-red-500" : "border-gray-200"
                )}
              />
              {errors.expiry && <p className="text-red-500 text-xs">{errors.expiry}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="cvv" className="text-xs font-semibold text-gray-700 flex items-center">
                <Lock className="w-3 h-3 mr-1" />
                CVV
              </Label>
              <Input
                id="cvv"
                name="cvv"
                type="password"
                placeholder="123"
                value={cardDetails.cvv}
                onChange={handleInputChange}
                className={cn(
                  "h-9 text-sm",
                  errors.cvv ? "border-red-500" : "border-gray-200"
                )}
              />
              {errors.cvv && <p className="text-red-500 text-xs">{errors.cvv}</p>}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Application Fee</span>
                <span className="font-medium">€50.00</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-[#E08D3C]">€50.00</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full h-9 bg-[#2C3539] hover:bg-[#1e2529] text-white text-sm" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-1" />
                Pay €50
              </>
            )}
          </Button>

          {/* Security Notice */}
          <div className="flex items-center justify-center space-x-1 text-xs text-gray-500 bg-green-50 p-2 rounded border border-green-200">
            <Lock className="w-3 h-3 text-green-600" />
            <span>Secure payment</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Universities() {
  const { selectedCountry } = useOutletContext<ContextType>();
  const [activeFilter, setActiveFilter] = useState("All");
  const navigate = useNavigate();
  const { user } = useAuth();

  // API data states
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simple favorites (keep using in-memory storage for React artifact)
  // Favorites from API
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedDegreeType, setSelectedDegreeType] = useState("all");
  const [selectedIntakeSeason, setSelectedIntakeSeason] = useState("all");
  const [tuitionRange, setTuitionRange] = useState("all");
  const [gpaRange, setGpaRange] = useState("all");
  // New filter states for dynamic API filters
const [universityType, setUniversityType] = useState("all");
const [institutionType, setInstitutionType] = useState("all");
const [universityRanking, setUniversityRanking] = useState("all");
const [scholarshipsOnly, setScholarshipsOnly] = useState(false);

  // Filter options from API
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [subjectAreas, setSubjectAreas] = useState([]);
  const [degreeTypes, setDegreeTypes] = useState([]);
  // Store filter options from API
const [universityRankings, setUniversityRankings] = useState([]);
const [tuitionOptions, setTuitionOptions] = useState([]);
const [hasScholarships, setHasScholarships] = useState(false);

  // Modal states
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [showProfileIncompleteModal, setShowProfileIncompleteModal] = useState(false);
const [profileCompletionPercentage, setProfileCompletionPercentage] = useState(0);

  // Course statistics for universities
  const [universityStats, setUniversityStats] = useState({});
  // In the main Universities component, ADD these state variables right after your existing modal states (around line 1005, after isPaymentModalOpen)
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Add this right after your state declarations to debug
useEffect(() => {
  console.log('=== STATE UPDATE ===');
  console.log('selectedUniversity:', selectedUniversity?.name || 'null');
  console.log('selectedCourse:', selectedCourse?.name || 'null');
  console.log('isModalOpen:', isModalOpen);
  console.log('isFormModalOpen:', isFormModalOpen);
  console.log('isPaymentModalOpen:', isPaymentModalOpen);
}, [selectedUniversity, selectedCourse, isModalOpen, isFormModalOpen, isPaymentModalOpen]);

  // Load initial data
 // Load initial data once on mount
  useEffect(() => {
    loadFilterOptions();
    loadData();
  }, []); // Only runs once on mount

  // Check if user is returning from profile builder
useEffect(() => {
  const checkReturnFromProfile = async () => {
    const returnData = sessionStorage.getItem('returnToUniversity');
    
    if (returnData) {
      try {
        const { universityId, universityName, timestamp } = JSON.parse(returnData);
        
        // Check if timestamp is recent (within 1 hour)
        const oneHour = 60 * 60 * 1000;
        if (Date.now() - timestamp < oneHour) {
          console.log('[Universities] User returned from profile builder');
          
          // Check if profile is now complete
          const isComplete = await checkProfileCompletion();
          
          if (isComplete) {
            // Find the university
            const uni = universities.find(u => u.id === universityId);
            
            if (uni) {
              console.log('[Universities] Profile complete, opening course modal for:', universityName);
              setSelectedUniversity(uni);
              setIsModalOpen(true);
            }
          }
        }
        
        // Clear the return data
        sessionStorage.removeItem('returnToUniversity');
      } catch (error) {
        console.error('[Universities] Error processing return from profile:', error);
        sessionStorage.removeItem('returnToUniversity');
      }
    }
  };
  
  if (universities.length > 0) {
    checkReturnFromProfile();
  }
}, [universities]);

  // Load data when filters change (debounced to avoid excessive calls)
  // Load data when filters change (debounced to avoid excessive calls)
useEffect(() => {
  // Skip the initial render (already handled by first useEffect)
  const timer = setTimeout(() => {
    if (showFavorites) {
      loadFavorites(); // Load favorites when in wishlist view
    } else {
      loadData(); // Load universities when in main view
    }
  }, 300); // 300ms debounce

  return () => clearTimeout(timer);
}, [
  selectedCountry,
  searchQuery,
  selectedCity,
  selectedState,
  selectedCourseFilter,
  selectedLanguage,
  selectedDegreeType,
  selectedIntakeSeason,
  tuitionRange,
  gpaRange,
  universityType,
  institutionType,
  universityRanking,
  scholarshipsOnly,
  showFavorites, // ADD THIS - reload when toggling wishlist
]);
  // Load universities only
 const loadData = async () => {
  try {
    setLoading(true);
    setError(null);

    let universitiesData = [];

    // Build parameters with new filter mappings
    const params = {};
    
    if (selectedCity !== "all") params.country = selectedCity;
    if (selectedState !== "all") params.state = selectedState;
    if (selectedCourseFilter !== "all") params.type = selectedCourseFilter;
    if (selectedLanguage !== "all") params.language = selectedLanguage;
    if (universityType !== "all") params.universityType = universityType;
    if (institutionType !== "all") params.institutionType = institutionType;
    if (universityRanking !== "all") params.ranking = universityRanking;
    if (scholarshipsOnly) params.scholarshipsAvailable = true;
    if (selectedDegreeType !== "all") params.degreeLevel = selectedDegreeType;
    if (selectedIntakeSeason !== "all") params.intakeSeason = selectedIntakeSeason;

    console.log('[Universities] Loading with params:', params);

    // Use search or regular endpoint
    if (searchQuery.trim()) {
      params.query = searchQuery.trim();
      try {
        universitiesData = await universityAPI.searchUniversities(params);
      } catch (err) {
        console.error("Search failed, falling back:", err);
        universitiesData = await universityAPI.getUniversities(params);
      }
    } else {
      universitiesData = await universityAPI.getUniversities(params);
    }

    // Extract array from response
    let universitiesArray = [];
    if (Array.isArray(universitiesData)) {
      universitiesArray = universitiesData;
    } else if (universitiesData?.data) {
      universitiesArray = Array.isArray(universitiesData.data) 
        ? universitiesData.data 
        : [universitiesData.data];
    }

    console.log('[Universities] Loaded:', universitiesArray.length, 'universities');

    // Calculate stats from nested courses
    calculateUniversityStats(universitiesArray);
    
    setUniversities(universitiesArray);
  } catch (err) {
    setError("Failed to load data. Please try again.");
    console.error("Error loading data:", err);
    setUniversities([]);
  } finally {
    setLoading(false);
  }
};

  // Calculate course statistics for each university
  const calculateUniversityStats = (universitiesData) => {
  const stats = {};

  universitiesData.forEach((university) => {
    // Use courses from the university object directly
    const universityCourses = university.courses || [];

    const tuitionFees = universityCourses
      .map((course) => parseFloat(course.tuition_fee_international || course.tuition_fee) || 0)
      .filter((fee) => fee > 0);

    stats[university.id] = {
      totalCourses: universityCourses.length,
      degreeTypes: [
        ...new Set(universityCourses.map((course) => 
          (course.degree_level || course.degree_type || '').toLowerCase()
        ))
      ].filter(Boolean),
      subjects: [
        ...new Set(universityCourses.map((course) => 
          course.field_of_study || course.subject_area
        ))
      ].filter(Boolean).slice(0, 3),
      languages: [
        ...new Set(universityCourses.map((course) => course.language))
      ].filter(Boolean),
      tuitionRange: tuitionFees.length > 0
        ? {
            min: Math.min(...tuitionFees),
            max: Math.max(...tuitionFees),
          }
        : null,
      intakeSeasons: [
        ...new Set(universityCourses.map((course) => course.intake_season))
      ].filter(Boolean),
    };
  });

  setUniversityStats(stats);
};

  // Load filter options from API
  const loadFilterOptions = async () => {
  try {
    console.log('[Universities] Loading filter options from new endpoint...');
    
    // Call the new dynamic filters endpoint
    const filtersResponse = await universityAPI.getDynamicFilters();
    
    console.log('[Universities] Raw filters response:', filtersResponse);
    
    // Extract filters array from response
    const filtersArray = filtersResponse?.data?.filters || filtersResponse?.filters || [];
    
    console.log('[Universities] Extracted filters array:', filtersArray);
    
    // Initialize filter objects
    const filterMap = {
      country: [],
      type: [],
      institutionType: [],
      ranking: [],
      tuition: [],
      scholarshipsAvailable: [],
    };
    
    // Group filters by filterParam
    filtersArray.forEach((filter) => {
      const { filterParam, filterId } = filter;
      
      if (filterMap.hasOwnProperty(filterParam)) {
        // Avoid duplicates
        if (!filterMap[filterParam].includes(filterId)) {
          filterMap[filterParam].push(filterId);
        }
      }
    });
    
    console.log('[Universities] Processed filter map:', filterMap);
    
    // Set state variables based on filter map
    setCities(filterMap.country || []);
    setStates([]);
    setSubjectAreas(filterMap.type || []);
    setDegreeTypes(filterMap.institutionType || []);
    setUniversityRankings(filterMap.ranking || []);
    setTuitionOptions(filterMap.tuition || []);
    setHasScholarships(filtersArray.some(f => f.filterParam === 'scholarshipsAvailable' && f.filterId === true));
    
    console.log('[Universities] ✅ Filter options loaded successfully');
  } catch (err) {
    console.error('[Universities] Error loading filter options:', err);
    
    // Fallback to empty arrays
    setCities([]);
    setStates([]);
    setSubjectAreas([]);
    setDegreeTypes([]);
    setUniversityRankings([]);
    setTuitionOptions([]);
    setHasScholarships(false);
  }
};

// Load favorite courses from API
const loadFavorites = async () => {
  try {
    setFavoritesLoading(true);
    console.log('[Universities] Loading favorite courses from API...');
    
    const response = await getAllCourses();
    
    // Extract courses array
    let coursesArray = [];
    if (Array.isArray(response)) {
      coursesArray = response;
    } else if (response?.data && Array.isArray(response.data)) {
      coursesArray = response.data;
    }
    
    // Filter only favorite courses
    const favoriteCourses = coursesArray.filter(course => course.isFavorite === true);
    
    console.log('[Universities] Found', favoriteCourses.length, 'favorite courses');
    
    // Group by university
    const universitiesWithFavorites = {};
    
    favoriteCourses.forEach(course => {
      const uniId = course.universityId;
      
      if (!universitiesWithFavorites[uniId]) {
        universitiesWithFavorites[uniId] = {
          id: uniId,
          name: course.universityName,
          code: course.universityCode,
          country: course.universityCountry,
          city: course.universityCountry, // Use country as city fallback
          image_url: null,
          total_courses: 0,
          courses: []
        };
      }
      
      universitiesWithFavorites[uniId].courses.push(course);
      universitiesWithFavorites[uniId].total_courses++;
    });
    
    // Convert to array
    const favoritesArray = Object.values(universitiesWithFavorites);
    
    console.log('[Universities] Grouped into', favoritesArray.length, 'universities');
    
    // Calculate stats for favorite universities
    calculateUniversityStats(favoritesArray);
    
    setFavorites(favoritesArray);
    
  } catch (error) {
    console.error('[Universities] Error loading favorites:', error);
    setFavorites([]);
  } finally {
    setFavoritesLoading(false);
  }
};

  // Add to favorites
  // Add to favorites (API integrated)
const addToFavorites = async (universityId) => {
  try {
    const university = universities.find((uni) => uni.id === universityId);
    
    if (!university) {
      console.error('University not found');
      return;
    }
    
    // Get first course from this university to add to favorites
    if (university.courses && university.courses.length > 0) {
      const firstCourse = university.courses[0];
      console.log(`[Favorites] Adding course ${firstCourse.id} to favorites`);
      
      await addCourseToFavorites(firstCourse.id);
      
      // Reload favorites
      await loadFavorites();
      
      console.log('[Favorites] ✅ Added to favorites');
    } else {
      alert('No courses available to add to favorites');
    }
  } catch (error) {
    console.error('[Favorites] Error adding to favorites:', error);
    alert('Failed to add to favorites. Please try again.');
  }
};

// Remove from favorites (API integrated)
const removeFromFavorites = async (universityId) => {
  try {
    const university = favorites.find((fav) => fav.id === universityId);
    
    if (!university) {
      console.error('University not found in favorites');
      return;
    }
    
    // Remove all courses from this university from favorites
    const courseIds = university.courses.map(course => course.id);
    
    console.log(`[Favorites] Removing ${courseIds.length} courses from favorites`);
    
    for (const courseId of courseIds) {
      await removeCourseFromFavorites(courseId);
    }
    
    // Reload favorites
    await loadFavorites();
    
    console.log('[Favorites] ✅ Removed from favorites');
  } catch (error) {
    console.error('[Favorites] Error removing from favorites:', error);
    alert('Failed to remove from favorites. Please try again.');
  }
};

// Check if university is in favorites
const isFavorite = (universityId) => {
  return favorites.some((fav) => fav.id === universityId);
};

  // Handle form submit - opens payment
  const handleFormSubmit = (formData, university) => {
  console.log("Form submitted:", formData);
  console.log("University from form:", university);
  
  // CRITICAL: Ensure university is preserved
  if (!university && selectedUniversity) {
    console.log("Using selectedUniversity from state");
    university = selectedUniversity;
  }
  
  if (!university) {
    console.error("No university available in handleFormSubmit");
    alert("Error: University information missing. Please try again.");
    return;
  }
  
  // Ensure university state is set
  setSelectedUniversity(university);
  
  // Store form data for later use if needed
  setIsFormModalOpen(false);
  
  // Open payment modal with a small delay
  setTimeout(() => {
    setIsPaymentModalOpen(true);
  }, 100);
};

  // Handle payment success - create application and redirect
  // Handle payment success - create application and redirect
  // Add this logging to your handlePaymentSuccess function in Universities.tsx
// Replace the applicationData section with this:

const handlePaymentSuccess = async (university) => {
  console.log("=== PAYMENT SUCCESS ===");
  console.log("University param:", university);
  console.log("Selected course state:", selectedCourse);
  
  const targetUniversity = university || selectedUniversity;
  
  if (!targetUniversity || !targetUniversity.id) {
    console.error("❌ No valid university available");
    alert("Error: University information missing. Please try again.");
    setIsPaymentModalOpen(false);
    return;
  }

  console.log("Payment successful for:", targetUniversity.name);
  
  try {
    setLoading(true);

    if (!user || !user.id) {
      console.error('No user ID available');
      alert('Unable to create application: User not authenticated');
      return;
    }

    if (!selectedCourse?.id) {
      alert('Error: Please select a course before applying.');
      setIsPaymentModalOpen(false);
      setIsModalOpen(true);
      return;
    }

    // Determine semester from course intake seasons
    // Map intake season names to backend-expected semester values
    let targetSemester = "WINTER";
    if (selectedCourse.intakeSeasons && selectedCourse.intakeSeasons.length > 0) {
      const season = selectedCourse.intakeSeasons[0].toUpperCase();
      // Map "FALL" -> "WINTER" (fall intake = winter semester), keep others as-is
      const semesterMap = {
        'FALL': 'WINTER',
        'WINTER': 'WINTER', 
        'SPRING': 'SUMMER',
        'SUMMER': 'SUMMER',
      };
      targetSemester = semesterMap[season] || 'WINTER';
    }

    // CRITICAL: Ensure studentId is a number (not a string from localStorage)
    const numericStudentId = Number(user.id);
    if (isNaN(numericStudentId)) {
      console.error('Invalid user ID:', user.id);
      alert('Error: Invalid user session. Please log out and log back in.');
      setIsPaymentModalOpen(false);
      return;
    }

    // Create clean application data - ONLY these 5 fields
    // Must match exactly: { studentId: number, targetUniversityId: string, targetCourseId: string, targetSemester: string, targetYear: number }
    const applicationData = {
      studentId: numericStudentId,
      targetUniversityId: targetUniversity.id,
      targetCourseId: selectedCourse.id,
      targetSemester: targetSemester,
      targetYear: 2026,
    };

    console.log('=== CREATING APPLICATION ===');
    console.log('University:', targetUniversity.name, '| ID:', targetUniversity.id);
    console.log('Course:', selectedCourse.name, '| ID:', selectedCourse.id);
    console.log('Payload:', JSON.stringify(applicationData, null, 2));
    
    // Compare with working Postman IDs
    const postmanUniversityId = "e19511ea-0013-4faa-9fcb-848e1e6991d8";
    const postmanCourseId = "e2f3c726-360a-42c0-808c-9b80f84cd7c2";
    console.log('⚠️ COMPARISON WITH POSTMAN:');
    console.log('  University ID match:', applicationData.targetUniversityId === postmanUniversityId, 
      `(Frontend: ${applicationData.targetUniversityId}, Postman: ${postmanUniversityId})`);
    console.log('  Course ID match:', applicationData.targetCourseId === postmanCourseId,
      `(Frontend: ${applicationData.targetCourseId}, Postman: ${postmanCourseId})`);
    
    const response = await createApplication(applicationData);
    console.log('✅ Application created:', response);
    
    // Show create response details for debugging
    const appData = response?.data || response;
    console.log('✅ CREATE RESPONSE DETAILS:');
    console.log('  client_id:', appData?.client_id);
    console.log('  country_code:', appData?.country_code);
    console.log('  program_level:', appData?.program_level);
    console.log('  application_type:', appData?.application_type);
    console.log('  workflow_stage:', appData?.workflow_stage);

    const applicationId = response?.data?.id || response?.id;
    
    if (!applicationId) {
      throw new Error('Application created but no ID returned');
    }

    console.log('✅ Application ID:', applicationId);

    // Close modals and navigate
    setIsPaymentModalOpen(false);
    setSelectedUniversity(null);
    setSelectedCourse(null);
    setIsFormModalOpen(false);
    
    navigate("/applications");

  } catch (error) {
    console.error('❌ Error creating application:', error);
    
    let errorMessage = 'Failed to create application. ';
    
    if (error.message?.includes('UUID')) {
      errorMessage += 'Invalid university or course information.';
    } else if (error.message?.includes('401') || error.message?.includes('authenticated')) {
      errorMessage += 'Authentication failed. Please log in again.';
    } else {
      errorMessage += error.message || 'Unknown error occurred.';
    }
    
    alert(errorMessage);
    setIsPaymentModalOpen(false);
  } finally {
    setLoading(false);
  }
};

  // Get filtered universities based on current view
  const filteredUniversities = useMemo(() => {
    let filtered = showFavorites ? favorites : universities;

    switch (activeFilter) {
      case "Top 50":
        filtered = filtered.filter((uni) => uni.ranking && uni.ranking <= 50);
        break;
      case "High Match":
        filtered = filtered.filter(
          (uni) => uni.match_score && uni.match_score >= 80
        );
        break;
      case "Low Tuition":
        filtered = filtered.filter((uni) => {
          const stats = universityStats[uni.id];
          return stats && stats.tuitionRange && stats.tuitionRange.min < 15000;
        });
        break;
      case "High Acceptance":
        filtered = filtered.filter(
          (uni) => uni.acceptance_rate && uni.acceptance_rate >= 20
        );
        break;
      default:
        break;
    }

    return filtered;
  }, [universities, favorites, showFavorites, activeFilter, universityStats]);


// Add this helper function to convert date format (add after filteredUniversities useMemo, around line 150)
  const convertDateFormat = (dateStr) => {
    if (!dateStr) return '';
    // Convert "2003-05-05" to "05-05-2003"
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  // Add this function to fetch and process profile data (add after convertDateFormat)
  const fetchAndProcessProfile = async () => {
    try {
      setProfileLoading(true);
      console.log('[Profile] Fetching student profile...');
      
      const response = await getStudentProfile();
      
      console.log('[Profile] Profile API response:', response);
      
      const profile = response?.data || response;
      
      setProfileData(profile);
      
      return profile;
    } catch (error) {
      console.error('[Profile] Error fetching profile:', error);
      return null;
    } finally {
      setProfileLoading(false);
    }
  };

  // Check if profile is complete before allowing application
  const checkProfileCompletion = async () => {
    try {
      console.log('[Universities] Checking profile completion...');
      const progressData = await getProfileProgress();
      const progress = progressData?.data?.percentage || progressData?.percentage || 0;
      
      console.log('[Universities] Profile completion:', progress + '%');
      setProfileCompletionPercentage(progress);
      
      return progress >= 100;
    } catch (error) {
      console.error('[Universities] Error checking profile completion:', error);
      return false;
    }
  };


  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  // Format currency
  const formatTuition = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Enhanced University Card Component
  const UniversityCard = ({ university }) => {
    const [heartLoading, setHeartLoading] = useState(false);
    const stats = universityStats[university.id] || {};

    const handleHeartClick = async () => {
  if (heartLoading) return;

  setHeartLoading(true);
  try {
    if (isFavorite(university.id)) {
      await removeFromFavorites(university.id);
    } else {
      await addToFavorites(university.id);
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
  } finally {
    setHeartLoading(false);
  }
};

    const handleLearnMore = () => {
      setSelectedUniversity(university);
      setIsModalOpen(true);
    };

    const handleApplyNow = async () => {
  console.log("=== APPLY NOW CLICKED ===");
  console.log("University:", university);
  
  if (!university || !university.id) {
    alert('Error: Invalid university data. Please try again.');
    return;
  }
  
  // Check if profile is complete
  const isComplete = await checkProfileCompletion();
  
  if (!isComplete) {
    // Store the university for return after profile completion
    sessionStorage.setItem('returnToUniversity', JSON.stringify({
      universityId: university.id,
      universityName: university.name,
      timestamp: Date.now()
    }));
    
    // Show profile incomplete modal
    setSelectedUniversity(university);
    setShowProfileIncompleteModal(true);
    return;
  }
  
  // Profile is complete, proceed normally
  setSelectedUniversity(university);
  setSelectedCourse(null);
  setIsModalOpen(true);
};

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#E08D3C] bg-white h-96 w-full flex flex-col">
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                {university.image_url ? (
                  <img
                    src={university.image_url}
                    alt={university.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={`w-full h-full bg-gradient-to-r from-[#C4DFF0] to-[#E08D3C] flex items-center justify-center ${
                    university.image_url ? "hidden" : ""
                  }`}>
                  <Building2 className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-sm group-hover:text-[#E08D3C] transition-colors duration-200 line-clamp-2 leading-tight">
                  {university.name}
                </h3>
                <p className="text-xs text-[#2C3539] flex items-center mt-1">
                  <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">
                    {university.city}
                    {university.country ? `, ${university.country}` : ""}
                  </span>
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className={`p-1 rounded-lg transition-all duration-200 ${
                isFavorite(university.id)
                  ? "text-red-500 hover:text-red-600 hover:bg-red-50"
                  : "text-gray-400 hover:text-red-500 hover:bg-red-50"
              } ${heartLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleHeartClick}
              disabled={heartLoading}>
              {heartLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Heart
                  className={`w-4 h-4 ${
                    isFavorite(university.id) ? "fill-current" : ""
                  }`}
                />
              )}
            </Button>
          </div>

          <div className="flex gap-2 mb-3">
            {university.ranking && (
              <span className="bg-[#C4DFF0] text-[#2C3539] text-xs px-2 py-1 rounded-full font-semibold">
                #{university.ranking}
              </span>
            )}
            {university.match_score && (
              <span className="bg-[#E08D3C] text-white text-xs px-2 py-1 rounded-full font-semibold">
                {university.match_score}% Match
              </span>
            )}
            {university.is_partner && (
              <span className="bg-[#2C3539] text-white text-xs px-2 py-1 rounded-full font-semibold">
                Partner
              </span>
            )}
          </div>

          <div className="space-y-2 mb-3 flex-1">
            <div className="flex justify-between text-xs text-[#2C3539]">
              <span>Total Courses:</span>
              <span className="font-bold text-[#E08D3C]">
                {stats.totalCourses || university.total_courses || 0}
              </span>
            </div>

            {stats.degreeTypes && stats.degreeTypes.length > 0 && (
              <div className="text-xs">
                <span className="text-[#2C3539] mb-1 block">Degrees:</span>
                <div className="flex flex-wrap gap-1">
                  {stats.degreeTypes.slice(0, 3).map((degree) => (
                    <Badge
                      key={degree}
                      variant="outline"
                      className="text-xs py-0 px-2">
                      {degree.charAt(0).toUpperCase() + degree.slice(1)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {stats.subjects && stats.subjects.length > 0 && (
              <div className="text-xs">
                <span className="text-[#2C3539] mb-1 block">
                  Popular Subjects:
                </span>
                <p className="text-gray-600 text-xs line-clamp-1">
                  {stats.subjects.slice(0, 2).join(", ")}
                  {stats.subjects.length > 2 &&
                    ` +${stats.subjects.length - 2} more`}
                </p>
              </div>
            )}

            {stats.tuitionRange && stats.tuitionRange.min > 0 && (
              <div className="flex justify-between text-xs text-[#2C3539]">
                <span>Tuition Range:</span>
                <span className="font-medium text-xs">
                  {stats.tuitionRange.min === stats.tuitionRange.max
                    ? formatTuition(stats.tuitionRange.min)
                    : `${formatTuition(
                        stats.tuitionRange.min
                      )} - ${formatTuition(stats.tuitionRange.max)}`}
                </span>
              </div>
            )}

            {stats.languages && stats.languages.length > 0 && (
              <div className="flex justify-between text-xs text-[#2C3539]">
                <span>Languages:</span>
                <span className="font-medium text-xs">
                  {stats.languages.slice(0, 2).join(", ")}
                </span>
              </div>
            )}

            {university.acceptance_rate && (
              <div className="flex justify-between text-xs text-[#2C3539]">
                <span>Acceptance Rate:</span>
                <span className="font-medium">
                  {university.acceptance_rate}%
                </span>
              </div>
            )}

            {university.description && !stats.subjects?.length && (
              <p className="text-gray-700 text-xs line-clamp-2 leading-relaxed">
                {university.description}
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-gray-100 mt-auto">
            <div className="text-center mb-3">
              <span className="font-bold text-[#E08D3C] text-sm">
                {stats.totalCourses || university.total_courses || 0} Courses
                Available
              </span>
              {stats.degreeTypes && stats.degreeTypes.length > 0 && (
                <div className="text-xs text-gray-600 mt-1">
                  {stats.degreeTypes
                    .map(
                      (degree) =>
                        degree.charAt(0).toUpperCase() + degree.slice(1)
                    )
                    .join(" • ")}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-[#E08D3C] text-[#E08D3C] hover:bg-[#E08D3C] hover:text-white font-medium px-3 py-2 rounded-lg transition-colors duration-200 text-xs"
                onClick={handleLearnMore}>
                {stats.totalCourses > 0 ? "View Courses" : "Learn More"}
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-[#2C3539] hover:bg-[#1e2529] text-white font-medium px-3 py-2 rounded-lg transition-colors duration-200 text-xs"
                onClick={handleApplyNow}>
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}>
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-4">
          {showFavorites && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFavorites(false)}
              className="flex items-center space-x-2 text-gray-600 hover:text-[#E08D3C]">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {showFavorites ? "Your Wishlist" : "Universities"}
            </h1>
            <p className="text-muted-foreground">
              {showFavorites
                ? "Your saved universities"
                : `Discover universities and courses in ${
                    selectedCountry === "DE" ? "Germany" : "United Kingdom"
                  } matched to your profile`}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          className={`rounded-pill transition-all duration-200 ${
            showFavorites
              ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
              : "hover:bg-[#E08D3C] hover:text-white hover:border-[#E08D3C]"
          }`}
          onClick={() => setShowFavorites(!showFavorites)}>
          <Heart
            className={`w-4 h-4 mr-2 ${showFavorites ? "fill-current" : ""}`}
          />
          {showFavorites
            ? "View All Universities"
            : `Wishlist (${favorites.length})`}
        </Button>
      </motion.div>

      {!showFavorites && (
  <motion.div
    className="space-y-4"
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.1 }}>
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
      <div className="relative xs:col-span-2 sm:col-span-3 lg:col-span-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search universities and courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-10 rounded-lg border-gray-300 focus:border-[#E08D3C] focus:ring-[#E08D3C] text-sm"
        />
      </div>

      <select
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
        className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
        <option value="all">All Countries</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      <select
        value={universityType}
        onChange={(e) => setUniversityType(e.target.value)}
        className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
        <option value="all">All Types</option>
        {subjectAreas.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <select
        value={institutionType}
        onChange={(e) => setInstitutionType(e.target.value)}
        className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
        <option value="all">All Institutions</option>
        {degreeTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <select
        value={universityRanking}
        onChange={(e) => setUniversityRanking(e.target.value)}
        className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
        <option value="all">All Rankings</option>
        {universityRankings.map((ranking) => (
          <option key={ranking} value={ranking}>
            {ranking}
          </option>
        ))}
      </select>
    </div>

    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
      <select
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value)}
        className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
        <option value="all">All Languages</option>
      </select>

      <select
        value={selectedDegreeType}
        onChange={(e) => setSelectedDegreeType(e.target.value)}
        className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
        <option value="all">All Degrees</option>
      </select>

      <select
        value={selectedIntakeSeason}
        onChange={(e) => setSelectedIntakeSeason(e.target.value)}
        className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
        <option value="all">All Intakes</option>
      </select>

      <select
        value={tuitionRange}
        onChange={(e) => setTuitionRange(e.target.value)}
        className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
        <option value="all">All Tuition</option>
        {tuitionOptions.map((tuition) => (
          <option key={tuition} value={tuition}>
            {tuition}
          </option>
        ))}
      </select>

      <select
        value={gpaRange}
        onChange={(e) => setGpaRange(e.target.value)}
        className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
        <option value="all">All GPA</option>
      </select>

      <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg border border-gray-300">
        <input
          type="checkbox"
          id="scholarships"
          checked={scholarshipsOnly}
          onChange={(e) => setScholarshipsOnly(e.target.checked)}
          className="w-4 h-4 rounded cursor-pointer"
          disabled={!hasScholarships}
        />
        <label htmlFor="scholarships" className="text-xs font-medium text-gray-700 cursor-pointer">
          Scholarships
        </label>
      </div>
    </div>

    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <motion.button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={cn(
            "h-10 px-6 rounded-full text-sm font-medium transition-all min-w-[100px] flex items-center justify-center",
            activeFilter === filter
              ? "bg-[#E08D3C] text-white shadow"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}>
          {filter}
        </motion.button>
      ))}
    </div>
  </motion.div>
)}

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={container}
        initial="hidden"
        animate="show">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#E08D3C]" />
            <span className="ml-2 text-gray-600">
              Loading universities and courses...
            </span>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-12">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="font-bold text-xl text-[#2C3539] mb-2">
              Something went wrong
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button
              onClick={loadData}
              className="bg-[#E08D3C] hover:bg-[#c77a32] text-white font-bold px-6 py-3 rounded-lg">
              Try Again
            </Button>
          </div>
        ) : filteredUniversities.length > 0 ? (
          filteredUniversities.map((university) => (
            <motion.div
              key={university.id}
              variants={item}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}>
              <UniversityCard university={university} />
            </motion.div>
          ))
        ) : showFavorites ? (
  favoritesLoading ? (
    <div className="col-span-full flex justify-center items-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-[#E08D3C]" />
      <span className="ml-2 text-gray-600">Loading your wishlist...</span>
    </div>
  ) : (
    <div className="col-span-full text-center py-16">
      <div className="max-w-md mx-auto">
        <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-gray-600 mb-4">
          No favorites yet
        </h3>
        <p className="text-gray-500 mb-8 text-lg leading-relaxed">
          Start exploring universities and save your favorites by clicking
          the heart icon on any university card or course!
        </p>
        <Button
          onClick={() => setShowFavorites(false)}
          className="bg-[#E08D3C] hover:bg-[#c77a32] text-white font-bold px-8 py-3 rounded-lg text-lg">
          Browse Universities
        </Button>
      </div>
    </div>
  )
        ) : (
          <div className="col-span-full text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              No universities found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search criteria.
            </p>
            {searchQuery && (
              <p className="text-sm text-gray-400">
                Searched for universities and courses matching: "{searchQuery}"
              </p>
            )}
          </div>
        )}
      </motion.div>

      {/* Course Selection Modal - Opens First */}
{/* Course Selection Modal - Opens First */}
<CourseModal
  university={selectedUniversity}
  isOpen={isModalOpen}
  onClose={() => {
    console.log("Closing course modal, NOT clearing selectedUniversity");
    setIsModalOpen(false);
  }}
  setSelectedCourse={setSelectedCourse}
  setSelectedUniversity={setSelectedUniversity}
  setIsPaymentModalOpen={setIsPaymentModalOpen}
  setIsFormModalOpen={setIsFormModalOpen}
  fetchAndProcessProfile={fetchAndProcessProfile}
   checkProfileCompletion={checkProfileCompletion}
   setShowProfileIncompleteModal={setShowProfileIncompleteModal}  // ADD THIS
/>

{/* Dynamic Application Form Modal - Opens Second */}
<DynamicApplicationFormModal
  university={selectedUniversity}
  course={selectedCourse}
  isOpen={isFormModalOpen}
  onClose={() => {
    setIsFormModalOpen(false);
  }}
  onSubmit={handleFormSubmit}
  profileData={profileData}
  profileLoading={profileLoading}
  user={user}
/>

{/* Payment Modal - Opens Third */}
{/* Payment Modal - Opens Third */}
<PaymentModal
  university={selectedUniversity}
  isOpen={isPaymentModalOpen}
  onClose={() => {
    console.log("Payment modal closing");
    setIsPaymentModalOpen(false);
    // Don't clear university/course on close - user might reopen
  }}
  onSuccess={(uni) => {
    console.log("Payment success callback, uni param:", uni);
    // Pass the university explicitly
    handlePaymentSuccess(uni || selectedUniversity);
  }}
/>

{/* Profile Incomplete Modal */}
{/* Profile Incomplete Modal */}
<ProfileIncompleteModal
  isOpen={showProfileIncompleteModal}
  onClose={() => {
    setShowProfileIncompleteModal(false);
    setSelectedUniversity(null);
  }}
  profilePercentage={profileCompletionPercentage}
/>


      {!showFavorites && (
        <motion.div
          className="text-center py-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}>
          <p className="text-muted-foreground mb-4">
            Can't find what you're looking for?
          </p>
          <Button variant="outline" className="rounded-pill">
            Get Personalized Recommendations
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}