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
import { universityAPI, courseAPI } from "@/services/api.js";

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
const CourseModal = ({ university, isOpen, onClose }) => {
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
      const coursesData = await universityAPI.getUniversityCourses(
        university.id
      );
      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (err) {
      setError("Failed to load courses");
      console.error("Error loading courses:", err);
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
    navigate("/applications", {
      state: {
        university: university,
        course: course,
      },
    });
    onClose();
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
                {uniqueSubjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
                <option value="all">All Languages</option>
                {uniqueLanguages.map((language) => (
                  <option key={language} value={language}>
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
                {filteredCourses.map((course) => (
                  <Card
                    key={course.id}
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
      // Reset form when opening
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
    if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
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
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.nationality.trim()) newErrors.nationality = "Nationality is required";
    if (!formData.tenthMarks.trim()) newErrors.tenthMarks = "10th marks are required";
    if (!formData.twelfthMarks.trim()) newErrors.twelfthMarks = "12th marks are required";
    if (!formData.graduationMarks.trim()) newErrors.graduationMarks = "Graduation marks are required";
    if (!formData.passportNumber.trim()) newErrors.passportNumber = "Passport number is required";
    if (!formData.apsCertificate) newErrors.apsCertificate = "APS certificate is required";
    if (!formData.lomFile) newErrors.lomFile = "Letter of Motivation (LOM) upload is compulsory";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      // Simulate API call for form submission
      setTimeout(() => {
        setLoading(false);
        onSubmit(formData, university);
      }, 1000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-[#C4DFF0] to-[#E08D3C] rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-xl bg-white bg-opacity-20 flex items-center justify-center shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-1">Application Form</h2>
                <p className="text-white text-opacity-90 text-lg">Apply to {university?.name}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="lg" 
              onClick={onClose} 
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-8">
            {/* Personal Information */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-[#2C3539] mb-6 flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#E08D3C] text-white flex items-center justify-center mr-3 text-sm font-bold">1</div>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">Full Name *</Label>
                  <Input 
                    id="fullName" 
                    name="fullName" 
                    value={formData.fullName} 
                    onChange={handleInputChange} 
                    className={cn("h-12 border-2 focus:border-[#E08D3C] transition-colors", errors.fullName ? "border-red-500" : "border-gray-200")} 
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email *</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    className={cn("h-12 border-2 focus:border-[#E08D3C] transition-colors", errors.email ? "border-red-500" : "border-gray-200")} 
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone Number *</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    className={cn("h-12 border-2 focus:border-[#E08D3C] transition-colors", errors.phone ? "border-red-500" : "border-gray-200")} 
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-sm font-semibold text-gray-700">Date of Birth *</Label>
                  <Input 
                    id="dateOfBirth" 
                    name="dateOfBirth" 
                    type="date" 
                    value={formData.dateOfBirth} 
                    onChange={handleInputChange} 
                    className={cn("h-12 border-2 focus:border-[#E08D3C] transition-colors", errors.dateOfBirth ? "border-red-500" : "border-gray-200")} 
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality" className="text-sm font-semibold text-gray-700">Nationality *</Label>
                  <Input 
                    id="nationality" 
                    name="nationality" 
                    value={formData.nationality} 
                    onChange={handleInputChange} 
                    className={cn("h-12 border-2 focus:border-[#E08D3C] transition-colors", errors.nationality ? "border-red-500" : "border-gray-200")} 
                  />
                  {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passportNumber" className="text-sm font-semibold text-gray-700">Passport Number *</Label>
                  <Input 
                    id="passportNumber" 
                    name="passportNumber" 
                    value={formData.passportNumber} 
                    onChange={handleInputChange} 
                    className={cn("h-12 border-2 focus:border-[#E08D3C] transition-colors", errors.passportNumber ? "border-red-500" : "border-gray-200")} 
                  />
                  {errors.passportNumber && <p className="text-red-500 text-sm mt-1">{errors.passportNumber}</p>}
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-[#2C3539] mb-6 flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#C4DFF0] text-[#2C3539] flex items-center justify-center mr-3 text-sm font-bold">2</div>
                Academic Information
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tenthMarks" className="text-sm font-semibold text-gray-700">10th Marks (% or GPA) *</Label>
                  <Input 
                    id="tenthMarks" 
                    name="tenthMarks" 
                    type="number" 
                    step="0.01" 
                    value={formData.tenthMarks} 
                    onChange={handleInputChange} 
                    className={cn("h-12 border-2 focus:border-[#E08D3C] transition-colors", errors.tenthMarks ? "border-red-500" : "border-gray-200")} 
                  />
                  {errors.tenthMarks && <p className="text-red-500 text-sm mt-1">{errors.tenthMarks}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twelfthMarks" className="text-sm font-semibold text-gray-700">12th Marks (% or GPA) *</Label>
                  <Input 
                    id="twelfthMarks" 
                    name="twelfthMarks" 
                    type="number" 
                    step="0.01" 
                    value={formData.twelfthMarks} 
                    onChange={handleInputChange} 
                    className={cn("h-12 border-2 focus:border-[#E08D3C] transition-colors", errors.twelfthMarks ? "border-red-500" : "border-gray-200")} 
                  />
                  {errors.twelfthMarks && <p className="text-red-500 text-sm mt-1">{errors.twelfthMarks}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="graduationMarks" className="text-sm font-semibold text-gray-700">Graduation Marks (% or GPA) *</Label>
                  <Input 
                    id="graduationMarks" 
                    name="graduationMarks" 
                    type="number" 
                    step="0.01" 
                    value={formData.graduationMarks} 
                    onChange={handleInputChange} 
                    className={cn("h-12 border-2 focus:border-[#E08D3C] transition-colors", errors.graduationMarks ? "border-red-500" : "border-gray-200")} 
                  />
                  {errors.graduationMarks && <p className="text-red-500 text-sm mt-1">{errors.graduationMarks}</p>}
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-orange-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-[#2C3539] mb-6 flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#E08D3C] text-white flex items-center justify-center mr-3 text-sm font-bold">3</div>
                Documents
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="apsCertificate" className="text-sm font-semibold text-gray-700">APS Certificate Upload *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#E08D3C] transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <Input 
                      id="apsCertificate" 
                      type="file" 
                      accept=".pdf,.doc,.docx" 
                      onChange={(e) => handleFileChange(e, "apsCertificate")} 
                      className={cn("cursor-pointer", errors.apsCertificate ? "border-red-500" : "")} 
                    />
                    <p className="text-sm text-gray-500 mt-2">PDF, DOC, or DOCX (Max 5MB)</p>
                  </div>
                  {errors.apsCertificate && <p className="text-red-500 text-sm mt-1">{errors.apsCertificate}</p>}
                  {formData.apsCertificate && (
                    <div className="flex items-center bg-green-50 p-3 rounded-lg mt-2">
                      <Check className="w-4 h-4 text-green-600 mr-2" />
                      <p className="text-sm text-green-700 font-medium">{formData.apsCertificate.name}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lomFile" className="text-sm font-semibold text-gray-700">Letter of Motivation (LOM) Upload *</Label>
                  <div className="border-2 border-dashed border-red-300 rounded-xl p-6 text-center hover:border-red-400 transition-colors bg-red-50">
                    <FileText className="w-8 h-8 text-red-400 mx-auto mb-3" />
                    <Input 
                      id="lomFile" 
                      type="file" 
                      accept=".pdf,.doc,.docx" 
                      onChange={(e) => handleFileChange(e, "lomFile")} 
                      className={cn("cursor-pointer", errors.lomFile ? "border-red-500" : "")} 
                    />
                    <p className="text-sm text-red-600 mt-2 font-semibold">Compulsory Document</p>
                  </div>
                  {errors.lomFile && <p className="text-red-500 text-sm mt-1">{errors.lomFile}</p>}
                  {formData.lomFile && (
                    <div className="flex items-center bg-green-50 p-3 rounded-lg mt-2">
                      <Check className="w-4 h-4 text-green-600 mr-2" />
                      <p className="text-sm text-green-700 font-medium">{formData.lomFile.name}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-[#2C3539] mb-4">Additional Information (Optional)</h3>
              <Textarea 
                id="additionalInfo" 
                name="additionalInfo" 
                value={formData.additionalInfo} 
                onChange={handleInputChange} 
                rows={4} 
                className="w-full border-2 border-gray-200 focus:border-[#E08D3C] transition-colors rounded-xl" 
                placeholder="Tell us anything else that might be relevant to your application..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                className="px-8 py-3 text-gray-600 border-gray-300 hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="px-8 py-3 bg-primary hover:bg-[#1e2529] text-white font-semibold h-12 min-w-[160px]" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Payment Modal
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
      // Format card number with spaces
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
      if (formattedValue.length > 19) return; // Max 16 digits + 3 spaces
    } else if (name === 'expiry') {
      // Format expiry with slash
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/, '$1/');
      if (formattedValue.length > 5) return; // MM/YY format
    } else if (name === 'cvv') {
      // Only allow numbers for CVV
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 3) return; // Max 3 digits
    }
    
    setCardDetails((prev) => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validatePayment = () => {
    const newErrors = {};
    const cardNumberDigits = cardDetails.cardNumber.replace(/\s/g, '');
    if (cardNumberDigits.length < 13) newErrors.cardNumber = "Invalid card number";
    if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) newErrors.expiry = "Invalid expiry (MM/YY)";
    if (cardDetails.cvv.length !== 3) newErrors.cvv = "Invalid CVV";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePay = (e) => {
    e.preventDefault();
    if (validatePayment()) {
      setLoading(true);
      // Simulate payment processing
      setTimeout(() => {
        setLoading(false);
        onSuccess(university);
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-8 bg-gradient-to-r from-[#C4DFF0] to-[#E08D3C] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-xl bg-white bg-opacity-20 flex items-center justify-center shadow-lg">
                <CreditCard className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">Secure Payment</h2>
                <p className="text-white text-opacity-90">Application Fee: €50</p>
                <p className="text-sm text-white text-opacity-75 mt-1">{university?.name}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="lg" 
              onClick={onClose} 
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePay} className="p-8">
          <div className="space-y-6">
            {/* Card Number */}
            <div className="space-y-2">
              <Label htmlFor="cardNumber" className="text-sm font-semibold text-gray-700 flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                Card Number
              </Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.cardNumber}
                onChange={handleInputChange}
                className={cn(
                  "h-12 text-lg tracking-wider border-2 focus:border-[#E08D3C] transition-colors",
                  errors.cardNumber ? "border-red-500" : "border-gray-200"
                )}
              />
              {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="expiry" className="text-sm font-semibold text-gray-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Expiry Date
                </Label>
                <Input
                  id="expiry"
                  name="expiry"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={handleInputChange}
                  className={cn(
                    "h-12 text-lg border-2 focus:border-[#E08D3C] transition-colors",
                    errors.expiry ? "border-red-500" : "border-gray-200"
                  )}
                />
                {errors.expiry && <p className="text-red-500 text-sm">{errors.expiry}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv" className="text-sm font-semibold text-gray-700 flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
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
                    "h-12 text-lg border-2 focus:border-[#E08D3C] transition-colors",
                    errors.cvv ? "border-red-500" : "border-gray-200"
                  )}
                />
                {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Payment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Application Fee</span>
                  <span className="font-medium">€50.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Processing Fee</span>
                  <span className="font-medium">€0.00</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-[#E08D3C]">€50.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-14 bg-[#2C3539] hover:bg-[#1e2529] text-white font-bold text-lg rounded-xl transition-all duration-200 transform hover:scale-[1.02]" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-3" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-3" />
                  Pay €50 Now
                </>
              )}
            </Button>

            {/* Security Notice */}
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 bg-green-50 p-3 rounded-lg border border-green-200">
              <Lock className="w-4 h-4 text-green-600" />
              <span>Secure payment powered by Stripe • Your data is encrypted and safe</span>
            </div>
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

  // API data states
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simple favorites (keep using in-memory storage for React artifact)
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedDegreeType, setSelectedDegreeType] = useState("all");
  const [selectedIntakeSeason, setSelectedIntakeSeason] = useState("all");
  const [tuitionRange, setTuitionRange] = useState("all");
  const [gpaRange, setGpaRange] = useState("all");

  // Filter options from API
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [subjectAreas, setSubjectAreas] = useState([]);
  const [degreeTypes, setDegreeTypes] = useState([]);

  // Modal states
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Course statistics for universities
  const [universityStats, setUniversityStats] = useState({});

  // Load initial data
  useEffect(() => {
    loadFilterOptions();
    loadData();
  }, []);

  // Load data when filters change
  useEffect(() => {
    loadData();
  }, [
    selectedCountry,
    searchQuery,
    selectedCity,
    selectedState,
    selectedCourse,
    selectedLanguage,
    selectedDegreeType,
    selectedIntakeSeason,
    tuitionRange,
    gpaRange,
  ]);

  // Load both universities and courses
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters for universities
      const universityParams = {};

      // Map selectedCountry to country parameter
      if (selectedCountry === "DE") {
        universityParams.country = "germany";
      } else if (selectedCountry === "UK") {
        universityParams.country = "uk";
      }

      // Apply university filters
      if (selectedCity !== "all") universityParams.city = selectedCity;
      if (selectedState !== "all") universityParams.state = selectedState;
      if (selectedCourse !== "all")
        universityParams.subject_area = selectedCourse;
      if (selectedLanguage !== "all")
        universityParams.language = selectedLanguage;

      // Search query for universities
      if (searchQuery.trim()) {
        universityParams.search = searchQuery.trim();
      }

      // Load universities first
      let universitiesData = await universityAPI.getUniversities(
        universityParams
      );
      const universitiesArray = Array.isArray(universitiesData)
        ? universitiesData
        : [];

      // Load all courses for the country to calculate statistics and handle course search
      const courseParams = {};
      if (selectedCountry === "DE") {
        // For Germany, we'll get courses from German universities
        courseParams.country = "Germany";
      } else if (selectedCountry === "UK") {
        // For UK, we'll get courses from UK universities
        courseParams.country = "United Kingdom";
      }

      // Add course-specific filters if they're set
      if (selectedDegreeType !== "all")
        courseParams.degree_type = selectedDegreeType;
      if (selectedIntakeSeason !== "all")
        courseParams.intake_season = selectedIntakeSeason;
      if (selectedLanguage !== "all") courseParams.language = selectedLanguage;
      if (selectedCourse !== "all") courseParams.subject_area = selectedCourse;

      // If there's a search query, also search in courses
      if (searchQuery.trim()) {
        courseParams.search = searchQuery.trim();
      }

      let coursesData = await courseAPI.getCourses(courseParams);
      const coursesArray = Array.isArray(coursesData) ? coursesData : [];

      // If we have course search results, include their universities
      let finalUniversities = [...universitiesArray];

      if (searchQuery.trim() && coursesArray.length > 0) {
        // Get unique university IDs from course results
        const courseUniversityIds = [
          ...new Set(coursesArray.map((course) => course.university)),
        ];

        // Get universities that have matching courses but weren't in the university search results
        for (const universityId of courseUniversityIds) {
          if (!finalUniversities.some((uni) => uni.id === universityId)) {
            try {
              const additionalUni = await universityAPI.getUniversityById(
                universityId
              );
              if (additionalUni) {
                finalUniversities.push(additionalUni);
              }
            } catch (err) {
              console.warn(`Failed to load university ${universityId}:`, err);
            }
          }
        }
      }

      // Apply course-based filters to universities if course filters are active
      if (
        selectedDegreeType !== "all" ||
        selectedIntakeSeason !== "all" ||
        tuitionRange !== "all" ||
        gpaRange !== "all"
      ) {
        const universityIdsWithMatchingCourses = [
          ...new Set(coursesArray.map((course) => course.university)),
        ];
        finalUniversities = finalUniversities.filter((uni) =>
          universityIdsWithMatchingCourses.includes(uni.id)
        );
      }

      setUniversities(finalUniversities);
      setCourses(coursesArray);

      // Calculate university statistics
      calculateUniversityStats(finalUniversities, coursesArray);
    } catch (err) {
      setError("Failed to load data. Please try again.");
      console.error("Error loading data:", err);
      setUniversities([]);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate course statistics for each university
  const calculateUniversityStats = (universitiesData, coursesData) => {
    const stats = {};

    universitiesData.forEach((university) => {
      const universityCourses = coursesData.filter(
        (course) => course.university === university.id
      );

      const tuitionFees = universityCourses
        .map((course) => parseFloat(course.tuition_fee) || 0)
        .filter((fee) => fee > 0);

      stats[university.id] = {
        totalCourses: universityCourses.length,
        degreeTypes: [
          ...new Set(universityCourses.map((course) => course.degree_type)),
        ].filter(Boolean),
        subjects: [
          ...new Set(universityCourses.map((course) => course.subject_area)),
        ]
          .filter(Boolean)
          .slice(0, 3),
        languages: [
          ...new Set(universityCourses.map((course) => course.language)),
        ].filter(Boolean),
        tuitionRange:
          tuitionFees.length > 0
            ? {
                min: Math.min(...tuitionFees),
                max: Math.max(...tuitionFees),
              }
            : null,
        intakeSeasons: [
          ...new Set(universityCourses.map((course) => course.intake_season)),
        ].filter(Boolean),
      };
    });

    setUniversityStats(stats);
  };

  // Load filter options from API
  const loadFilterOptions = async () => {
    try {
      const [citiesData, statesData, subjectsData, degreeTypesData] =
        await Promise.all([
          universityAPI.getCities(),
          universityAPI.getStates(),
          courseAPI.getSubjectAreas(),
          courseAPI.getDegreeTypes(),
        ]);

      setCities(Array.isArray(citiesData) ? citiesData : []);
      setStates(Array.isArray(statesData) ? statesData : []);
      setSubjectAreas(Array.isArray(subjectsData) ? subjectsData : []);
      setDegreeTypes(Array.isArray(degreeTypesData) ? degreeTypesData : []);
    } catch (err) {
      console.error("Error loading filter options:", err);
      setCities([]);
      setStates([]);
      setSubjectAreas([]);
      setDegreeTypes([]);
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
    console.log("Form submitted:", formData); // For debugging
    setIsFormModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  // Handle payment success - redirect to applications
  const handlePaymentSuccess = (university) => {
    console.log("Payment successful for:", university.name); // For debugging
    setIsPaymentModalOpen(false);
    setSelectedUniversity(null);
    navigate("/applications", {
      state: {
        university: university,
        applicationData: { /* You can pass formData if needed */ },
      },
    });
  };

  // Get filtered universities based on current view
  const filteredUniversities = useMemo(() => {
    let filtered = showFavorites ? favorites : universities;

    // Apply active filter
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
      console.log("Apply Now clicked for:", university.name); // For debugging
      setSelectedUniversity(university);
      setIsFormModalOpen(true);
    };

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#E08D3C] bg-white h-96 w-full flex flex-col">
        <div className="p-4 flex flex-col h-full">
          {/* Header with logo and basic info */}
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

          {/* Rankings and stats */}
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

          {/* Course Statistics */}
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

          {/* Footer with courses count and buttons */}
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
      {/* Header */}
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

      {/* Search and Filters - Only show when not in favorites view */}
      {!showFavorites && (
        <motion.div
          className="space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}>
          {/* Primary Filters - Enhanced with course filters */}
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
              <option value="all">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
              <option value="all">All States</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
              <option value="all">All Subjects</option>
              {subjectAreas.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>

            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
              <option value="all">All Languages</option>
              <option value="english">English</option>
              <option value="german">German</option>
              <option value="both">Both</option>
            </select>
          </div>

          {/* Secondary Filters Row - Enhanced with course-specific filters */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
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
              value={selectedIntakeSeason}
              onChange={(e) => setSelectedIntakeSeason(e.target.value)}
              className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
              <option value="all">All Intakes</option>
              <option value="winter">Winter</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="fall">Fall</option>
            </select>

            <select
              value={tuitionRange}
              onChange={(e) => setTuitionRange(e.target.value)}
              className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
              <option value="all">All Tuition</option>
              <option value="0-10000">Under €10,000</option>
              <option value="10000-20000">€10,000 - €20,000</option>
              <option value="20000-30000">€20,000 - €30,000</option>
              <option value="30000+">€30,000+</option>
            </select>

            <select
              value={gpaRange}
              onChange={(e) => setGpaRange(e.target.value)}
              className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
              <option value="all">All GPA</option>
              <option value="0-2.5">2.5 and below</option>
              <option value="2.5-3.0">2.5 - 3.0</option>
              <option value="3.0-3.5">3.0 - 3.5</option>
              <option value="3.5+">3.5+</option>
            </select>

            <select className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
              <option>All Types</option>
              <option>Public</option>
              <option>Private</option>
            </select>

            <div className="flex flex-col items-start justify-between">
              <span className="text-sm text-[#2C3539] font-medium whitespace-nowrap">
                {loading
                  ? "Loading..."
                  : `${filteredUniversities.length} universities • ${courses.length} courses`}
              </span>
              <select className="h-6 w-full rounded border-gray-300 text-xs px-2 bg-white mt-1">
                <option>Ranking (Best First)</option>
                <option>Name (A to Z)</option>
                <option>Match Score</option>
                <option>Tuition (Low to High)</option>
                <option>Most Courses</option>
              </select>
            </div>
          </div>

          {/* Filter Chips - Standardized button sizes */}
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

      {/* Universities Grid - Enhanced cards with course data */}
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

      {/* Course Modal */}
      <CourseModal
        university={selectedUniversity}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUniversity(null);
        }}
      />

      {/* Application Form Modal */}
      <ApplicationFormModal
        university={selectedUniversity}
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedUniversity(null);
        }}
        onSubmit={handleFormSubmit}
      />

      {/* Payment Modal */}
      <PaymentModal
        university={selectedUniversity}
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedUniversity(null);
        }}
        onSuccess={handlePaymentSuccess}
      />

      {/* Recommendations Footer - Only show when not in favorites view */}
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