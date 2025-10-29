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
} from "lucide-react";
import { universityAPI } from "@/services/api";
import { createApplication, submitApplication } from "@/services/studentProfile";
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
const CourseModal = ({ university, isOpen, onClose, setSelectedCourse, setSelectedUniversity, setIsPaymentModalOpen, setIsFormModalOpen }) => {
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
    
    console.log('[CourseModal] Fetching courses for university:', university.id);
    
    // First, try to get courses from the university object itself
    // Your API returns courses nested in the university object
    if (university.courses && Array.isArray(university.courses) && university.courses.length > 0) {
      console.log('[CourseModal] Using courses from university object:', university.courses);
      
      const validCourses = university.courses
        .filter(course => course.id)
        .map(course => ({
          id: course.id,
          university_id: course.university_id,
          name: course.name || course.official_name,
          subject_area: course.field_of_study || 'General',
          degree_type: course.degree_level?.toLowerCase() || 'bachelors',
          language: course.language || 'English',
          duration_months: (course.duration_years || 3) * 12,
          intake_season: course.intake_season || 'WINTER',
          tuition_fee: course.tuition_fee_international || 0,
          min_gpa: course.min_gpa || '2.5',
          min_ielts: course.min_ielts || '6.5',
          description: course.description || '',
          course_code: course.course_code || '',
        }));
      
      console.log('[CourseModal] Mapped courses from university object:', validCourses);
      setCourses(validCourses);
      setLoading(false);
      return;
    }
    
    // If no courses in university object, fetch from API
    console.log('[CourseModal] Fetching courses from API...');
    const coursesData = await universityAPI.getUniversityCourses(university.id);
    
    console.log('[CourseModal] Raw courses data from API:', coursesData);
    
    // Handle different response structures
    let coursesArray = [];
    if (Array.isArray(coursesData)) {
      coursesArray = coursesData;
    } else if (coursesData?.data && Array.isArray(coursesData.data)) {
      coursesArray = coursesData.data;
    } else if (coursesData?.courses && Array.isArray(coursesData.courses)) {
      coursesArray = coursesData.courses;
    }
    
    // Map backend course structure to frontend structure
    const validCourses = coursesArray
      .filter(course => course.id)
      .map(course => ({
        id: course.id,
        university_id: course.university_id,
        name: course.name || course.official_name,
        subject_area: course.field_of_study || 'General',
        degree_type: course.degree_level?.toLowerCase() || 'bachelors',
        language: course.language || 'English',
        duration_months: (course.duration_years || 3) * 12,
        intake_season: course.intake_season || 'WINTER',
        tuition_fee: course.tuition_fee_international || 0,
        min_gpa: course.min_gpa || '2.5',
        min_ielts: course.min_ielts || '6.5',
        description: course.description || '',
        course_code: course.course_code || '',
      }));
    
    console.log('[CourseModal] Mapped courses from API:', validCourses);
    setCourses(validCourses);
  } catch (err) {
    console.error("Error loading courses:", err);
    
    // Fallback: try to use courses from university object even on error
    if (university.courses && Array.isArray(university.courses) && university.courses.length > 0) {
      console.log('[CourseModal] Using fallback - courses from university object');
      const validCourses = university.courses
        .filter(course => course.id)
        .map(course => ({
          id: course.id,
          university_id: course.university_id,
          name: course.name || course.official_name,
          subject_area: course.field_of_study || 'General',
          degree_type: course.degree_level?.toLowerCase() || 'bachelors',
          language: course.language || 'English',
          duration_months: (course.duration_years || 3) * 12,
          intake_season: course.intake_season || 'WINTER',
          tuition_fee: course.tuition_fee_international || 0,
          min_gpa: course.min_gpa || '2.5',
          min_ielts: course.min_ielts || '6.5',
          description: course.description || '',
          course_code: course.course_code || '',
        }));
      
      setCourses(validCourses);
    } else {
      setError("Failed to load courses");
    }
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

 const handleApplyNow = (course) => {
  console.log('=== COURSE SELECTED FOR APPLICATION ===');
  console.log('Course:', course);
  console.log('University:', university);
  
  if (!course || !course.id) {
    alert('Error: Invalid course selected. Please try again.');
    return;
  }
  
  if (!university || !university.id) {
    alert('Error: University information missing. Please try again.');
    return;
  }
  
  // Store both course and university BEFORE closing modal
  console.log('Setting selectedCourse and selectedUniversity...');
  setSelectedCourse(course);
  setSelectedUniversity(university);
  
  // Open form modal FIRST (both modals can be open simultaneously briefly)
  console.log('Opening form modal...');
  setIsFormModalOpen(true);
  
  // Then close course modal with a small delay to ensure state propagation
  setTimeout(() => {
    console.log('Closing course modal...');
    onClose();
  }, 50);
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
                        <Badge
                          className={`ml-2 text-xs ${
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
                        <Button size="sm" variant="outline" className="flex-1">
                          View Details
                        </Button>
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

// Application Form Modal
const ApplicationFormModal = ({ university, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    nationality: "",
    tenthMarks: "",
    twelfthMarks: "",
    graduationMarks: "",
    passportNumber: "",
    apsCertificate: null,
    lomFile: null,
    additionalInfo: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        nationality: "",
        tenthMarks: "",
        twelfthMarks: "",
        graduationMarks: "",
        passportNumber: "",
        apsCertificate: null,
        lomFile: null,
        additionalInfo: "",
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      alert("File size too large. Max 5MB.");
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: file }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
  const newErrors = {};

  // Only validate email format if user enters something
  if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = "Invalid email";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleSubmit = (e) => {
  e.preventDefault();
  console.log("=== FORM SUBMIT ===");
  console.log("University prop in modal:", university);
  console.log("Form data:", formData);
  
  if (!university) {
    console.error("No university in ApplicationFormModal!");
    alert("Error: University information missing. Please try again.");
    return;
  }
  
  if (validateForm()) {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log("Calling onSubmit with university:", university);
      onSubmit(formData, university);
    }, 1000);
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-lg">
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#C4DFF0] to-[#E08D3C] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="w-6 h-6" />
              <div>
                <h2 className="text-lg font-bold">Apply to {university?.name}</h2>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Personal Information */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#2C3539] flex items-center">
              <span className="w-6 h-6 rounded-full bg-[#E08D3C] text-white flex items-center justify-center mr-2 text-xs">1</span>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="fullName" className="text-xs font-semibold text-gray-700">Full Name</Label>
                <Input 
                  id="fullName" 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleInputChange} 
                  className={cn("h-9 text-sm", errors.fullName ? "border-red-500" : "border-gray-200")} 
                />
                {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs font-semibold text-gray-700">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  className={cn("h-9 text-sm", errors.email ? "border-red-500" : "border-gray-200")} 
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone" className="text-xs font-semibold text-gray-700">Phone</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  className={cn("h-9 text-sm", errors.phone ? "border-red-500" : "border-gray-200")} 
                />
                {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="dateOfBirth" className="text-xs font-semibold text-gray-700">Date of Birth</Label>
                <Input 
                  id="dateOfBirth" 
                  name="dateOfBirth" 
                  type="date" 
                  value={formData.dateOfBirth} 
                  onChange={handleInputChange} 
                  className={cn("h-9 text-sm", errors.dateOfBirth ? "border-red-500" : "border-gray-200")} 
                />
                {errors.dateOfBirth && <p className="text-red-500 text-xs">{errors.dateOfBirth}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="nationality" className="text-xs font-semibold text-gray-700">Nationality</Label>
                <Input 
                  id="nationality" 
                  name="nationality" 
                  value={formData.nationality} 
                  onChange={handleInputChange} 
                  className={cn("h-9 text-sm", errors.nationality ? "border-red-500" : "border-gray-200")} 
                />
                {errors.nationality && <p className="text-red-500 text-xs">{errors.nationality}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="passportNumber" className="text-xs font-semibold text-gray-700">Passport Number</Label>
                <Input 
                  id="passportNumber" 
                  name="passportNumber" 
                  value={formData.passportNumber} 
                  onChange={handleInputChange} 
                  className={cn("h-9 text-sm", errors.passportNumber ? "border-red-500" : "border-gray-200")} 
                />
                {errors.passportNumber && <p className="text-red-500 text-xs">{errors.passportNumber}</p>}
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#2C3539] flex items-center">
              <span className="w-6 h-6 rounded-full bg-[#E08D3C] text-white flex items-center justify-center mr-2 text-xs">2</span>
              Academic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label htmlFor="tenthMarks" className="text-xs font-semibold text-gray-700">10th Marks</Label>
                <Input 
                  id="tenthMarks" 
                  name="tenthMarks" 
                  type="number" 
                  step="0.01" 
                  value={formData.tenthMarks} 
                  onChange={handleInputChange} 
                  className={cn("h-9 text-sm", errors.tenthMarks ? "border-red-500" : "border-gray-200")} 
                />
                {errors.tenthMarks && <p className="text-red-500 text-xs">{errors.tenthMarks}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="twelfthMarks" className="text-xs font-semibold text-gray-700">12th Marks</Label>
                <Input 
                  id="twelfthMarks" 
                  name="twelfthMarks" 
                  type="number" 
                  step="0.01" 
                  value={formData.twelfthMarks} 
                  onChange={handleInputChange} 
                  className={cn("h-9 text-sm", errors.twelfthMarks ? "border-red-500" : "border-gray-200")} 
                />
                {errors.twelfthMarks && <p className="text-red-500 text-xs">{errors.twelfthMarks}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="graduationMarks" className="text-xs font-semibold text-gray-700">Graduation Marks</Label>
                <Input 
                  id="graduationMarks" 
                  name="graduationMarks" 
                  type="number" 
                  step="0.01" 
                  value={formData.graduationMarks} 
                  onChange={handleInputChange} 
                  className={cn("h-9 text-sm", errors.graduationMarks ? "border-red-500" : "border-gray-200")} 
                />
                {errors.graduationMarks && <p className="text-red-500 text-xs">{errors.graduationMarks}</p>}
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#2C3539] flex items-center">
              <span className="w-6 h-6 rounded-full bg-[#E08D3C] text-white flex items-center justify-center mr-2 text-xs">3</span>
              Documents
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="apsCertificate" className="text-xs font-semibold text-gray-700">APS Certificate</Label>
                <div className="border border-dashed border-gray-300 rounded-lg p-3 text-center">
                  <Input 
                    id="apsCertificate" 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    onChange={(e) => handleFileChange(e, "apsCertificate")} 
                    className={cn("text-sm", errors.apsCertificate ? "border-red-500" : "")} 
                  />
                  <p className="text-xs text-gray-500 mt-1">PDF/DOC (Max 5MB)</p>
                </div>
                {errors.apsCertificate && <p className="text-red-500 text-xs">{errors.apsCertificate}</p>}
                {formData.apsCertificate && (
                  <div className="flex items-center text-xs text-green-700">
                    <Check className="w-3 h-3 text-green-600 mr-1" />
                    {formData.apsCertificate.name}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="lomFile" className="text-xs font-semibold text-gray-700">Letter of Motivation</Label>
                <div className="border border-dashed border-red-300 rounded-lg p-3 text-center bg-red-50">
                  <Input 
                    id="lomFile" 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    onChange={(e) => handleFileChange(e, "lomFile")} 
                    className={cn("text-sm", errors.lomFile ? "border-red-500" : "")} 
                  />
                  <p className="text-xs text-red-600 mt-1">Required</p>
                </div>
                {errors.lomFile && <p className="text-red-500 text-xs">{errors.lomFile}</p>}
                {formData.lomFile && (
                  <div className="flex items-center text-xs text-green-700">
                    <Check className="w-3 h-3 text-green-600 mr-1" />
                    {formData.lomFile.name}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-1">
            <Label htmlFor="additionalInfo" className="text-xs font-semibold text-gray-700">Additional Information</Label>
            <Textarea 
              id="additionalInfo" 
              name="additionalInfo" 
              value={formData.additionalInfo} 
              onChange={handleInputChange} 
              rows={3} 
              className="text-sm border-gray-200" 
              placeholder="Optional information..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="px-4 py-2 text-xs" 
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="px-4 py-2 bg-primary text-white text-xs" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-1" />
                  Submit
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

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
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

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

  // Course statistics for universities
  const [universityStats, setUniversityStats] = useState({});

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

  // Load data when filters change (debounced to avoid excessive calls)
  useEffect(() => {
    // Skip the initial render (already handled by first useEffect)
    const timer = setTimeout(() => {
      loadData();
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
    universityType,        // ADD THIS
  institutionType,       // ADD THIS
  universityRanking,     // ADD THIS
  scholarshipsOnly,  
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

  // Add to favorites
  const addToFavorites = (universityId) => {
    const university = universities.find((uni) => uni.id === universityId);

    if (university && !favorites.some((fav) => fav.id === universityId)) {
      const newFavorites = [...favorites, university];
      setFavorites(newFavorites);
    }
  };

  // Remove from favorites
  const removeFromFavorites = (universityId) => {
    const newFavorites = favorites.filter((fav) => fav.id !== universityId);
    setFavorites(newFavorites);
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
  console.log("Selected university state:", selectedUniversity);
  console.log("Selected course state:", selectedCourse);
  
  // Use university from parameter, fall back to state
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

    // Extract intake term and year from course
    let targetSemester = "WINTER";
    let targetYear = new Date().getFullYear() + 1;
    
    if (selectedCourse.intake_season) {
      const intakeStr = selectedCourse.intake_season.toUpperCase();
      
      if (intakeStr.includes('_')) {
        const parts = intakeStr.split('_');
        targetSemester = parts[0];
        targetYear = parseInt(parts[1]) || targetYear;
      } else {
        targetSemester = intakeStr;
        
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        
        if (targetSemester === "WINTER" && currentMonth >= 10) {
          targetYear = currentYear + 1;
        } else if (targetSemester === "SPRING" && currentMonth >= 1) {
          targetYear = currentYear;
        } else if (targetSemester === "SUMMER" && currentMonth >= 4) {
          targetYear = currentYear;
        } else if (targetSemester === "FALL" || targetSemester === "AUTUMN") {
          targetSemester = "FALL";
          targetYear = currentMonth >= 7 ? currentYear : currentYear + 1;
        }
      }
    }

    // Create application data - USE targetUniversity instead of university
    const applicationData = {
      studentId: user.id,
      targetUniversityId: targetUniversity.id,
      targetCourseId: selectedCourse.id,
      targetSemester: targetSemester,
      targetYear: targetYear,
    };

    console.log('=== CREATING APPLICATION ===');
    console.log('Application data:', JSON.stringify(applicationData, null, 2));
    
    // Call the backend API
    const response = await createApplication(applicationData);
    console.log('✅ Application API response:', response);

    const applicationId = response?.data?.id || response?.id;
    
    if (!applicationId) {
      throw new Error('Application created but no ID returned');
    }

    console.log('✅ Application successfully created with ID:', applicationId);

    // Close modals
    setIsPaymentModalOpen(false);
    setSelectedUniversity(null);
    setSelectedCourse(null);
    setIsFormModalOpen(false);
    
    // Success message
    const refNumber = response?.data?.referenceNumber || response?.referenceNumber || 'N/A';
    alert(`🎉 Application submitted successfully!\n\nReference: ${refNumber}\n\nRedirecting to Applications page...`);
    
    // Wait before redirect
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Navigate to applications
    navigate("/applications");
    
  } catch (error) {
    console.error('❌ Error creating application:', error);
    
    let errorMessage = 'Failed to create application. ';
    
    if (error.message?.includes('UUID')) {
      errorMessage += 'Invalid university or course information.';
    } else if (error.message?.includes('401') || error.message?.includes('authenticated')) {
      errorMessage += 'Authentication failed. Please log in again.';
    } else if (error.message?.includes('Missing required')) {
      errorMessage += 'Please select a course before applying.';
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
        await new Promise((resolve) => setTimeout(resolve, 200));

        if (isFavorite(university.id)) {
          removeFromFavorites(university.id);
        } else {
          addToFavorites(university.id);
        }
      } finally {
        setHeartLoading(false);
      }
    };

    const handleLearnMore = () => {
      setSelectedUniversity(university);
      setIsModalOpen(true);
    };

    const handleApplyNow = () => {
  console.log("=== APPLY NOW CLICKED ===");
  console.log("University:", university);
  
  if (!university || !university.id) {
    alert('Error: Invalid university data. Please try again.');
    return;
  }
  
  // Open course modal first, not form modal
  setSelectedUniversity(university);
  setSelectedCourse(null); // Reset course selection
  setIsModalOpen(true); // Open COURSE modal, not form modal
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
          <div className="col-span-full text-center py-16">
            <div className="max-w-md mx-auto">
              <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-600 mb-4">
                No favorites yet
              </h3>
              <p className="text-gray-500 mb-8 text-lg leading-relaxed">
                Start exploring universities and save your favorites by clicking
                the heart icon on any university card!
              </p>
              <Button
                onClick={() => setShowFavorites(false)}
                className="bg-[#E08D3C] hover:bg-[#c77a32] text-white font-bold px-8 py-3 rounded-lg text-lg">
                Browse Universities
              </Button>
            </div>
          </div>
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
    // DON'T clear selectedUniversity here - it's needed for the form modal!
  }}
  setSelectedCourse={setSelectedCourse}
  setSelectedUniversity={setSelectedUniversity}
  setIsPaymentModalOpen={setIsPaymentModalOpen}
  setIsFormModalOpen={setIsFormModalOpen}
/>

{/* Application Form Modal - Opens Second */}
{/* Application Form Modal - Opens Second */}
<ApplicationFormModal
  university={selectedUniversity}
  isOpen={isFormModalOpen}
  onClose={() => {
    setIsFormModalOpen(false);
    // Don't clear university/course here - we need them for payment
  }}
  onSubmit={handleFormSubmit}
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