import { useState, useEffect, useMemo } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Search,
  Heart,
  MapPin,
  Calendar,
  Loader2,
  Building2,
  ChevronLeft,
  BookOpen,
  Clock,
  Globe,
  X,
} from "lucide-react";
import { universityAPI, courseAPI } from "@/services/api.js";
import { createApplication } from "@/services/auth.js";

type Country = "DE" | "UK";

interface ContextType {
  selectedCountry: Country;
}

const filters = ["All", "Top 50", "High Match", "Low Tuition", "High Acceptance"];

/* ============================ Course Modal ============================ */
const CourseModal = ({
  university,
  isOpen,
  onClose,
}: {
  university: any;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDegreeType, setSelectedDegreeType] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && university) {
      loadCourses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, university]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const coursesData = await universityAPI.getUniversityCourses(university.id);
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
        course.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.subject_area?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDegree = selectedDegreeType === "all" || course.degree_type === selectedDegreeType;
      const matchesSubject = selectedSubject === "all" || course.subject_area === selectedSubject;
      const matchesLanguage =
        selectedLanguage === "all" ||
        course.language?.toLowerCase() === selectedLanguage.toLowerCase();

      return matchesSearch && matchesDegree && matchesSubject && matchesLanguage;
    });
  }, [courses, searchQuery, selectedDegreeType, selectedSubject, selectedLanguage]);

  const uniqueSubjects = [...new Set(courses.map((c) => c.subject_area).filter(Boolean))];
  const uniqueLanguages = [...new Set(courses.map((c) => c.language).filter(Boolean))];

  const formatTuition = (tuition: string | number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(tuition || 0));

  const formatDuration = (months: number) => {
    if (!months && months !== 0) return "—";
    if (months >= 12) {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      return remainingMonths === 0 ? `${years} year${years > 1 ? "s" : ""}` : `${years}y ${remainingMonths}m`;
    }
    return `${months} months`;
  };

  // POST an application, then navigate to Applications with helpful state
  const handleApplyNow = async (course: any) => {
    try {
      const apiCountry = (university.country || "")
        .toLowerCase()
        .includes("german")
        ? "germany"
        : "united_kingdom";

      const created = await createApplication({
        university: university.id,
        course: course.id,
        country: apiCountry,
      });

      navigate("/applications", {
        state: {
          justCreatedId: created?.id,
          country: apiCountry,
          university,
          course,
        },
      });
    } catch (e: any) {
      console.error("Create application failed:", e);
      setError(e?.message || "Could not create application");
    } finally {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-[#C4DFF0] to-[#E08D3C] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden shadow-lg">
                {university.image_url ? (
                  <img src={university.image_url} alt={university.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/20 flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{university.name}</h2>
                <p className="text-white/90 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {university.city}
                  {university.country ? `, ${university.country}` : ""}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b bg-gray-50">
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
              className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white"
            >
              <option value="all">All Degrees</option>
              <option value="bachelors">Bachelor's</option>
              <option value="masters">Master's</option>
              <option value="phd">PhD</option>
            </select>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white"
            >
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
              className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white"
            >
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

        {/* Course list */}
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
                <Card key={course.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-[#2C3539] line-clamp-2 flex-1">{course.name}</h3>
                      <Badge
                        className={`ml-2 text-xs ${
                          course.degree_type === "phd"
                            ? "bg-purple-100 text-purple-800"
                            : course.degree_type === "masters"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {course.degree_type?.[0]?.toUpperCase() + course.degree_type?.slice(1)}
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
                        <p className="font-semibold text-[#E08D3C]">{formatTuition(course.tuition_fee)}</p>
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
                        <p className="font-semibold">{formatDuration(course.duration_months)}</p>
                      </div>
                    </div>

                    {course.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-[#2C3539] hover:bg-[#1e2529]"
                        onClick={() => handleApplyNow(course)}
                      >
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
              <h3 className="text-xl font-bold text-gray-600 mb-2">No courses found</h3>
              <p className="text-gray-500">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================ Page ============================ */
export default function Universities() {
  const { selectedCountry } = useOutletContext<ContextType>();
  const [activeFilter, setActiveFilter] = useState("All");
  const navigate = useNavigate();

  // API data states
  const [universities, setUniversities] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // favorites
  const [favorites, setFavorites] = useState<any[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  // filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedDegreeType, setSelectedDegreeType] = useState("all");
  const [selectedIntakeSeason, setSelectedIntakeSeason] = useState("all");
  const [tuitionRange, setTuitionRange] = useState("all");
  const [gpaRange, setGpaRange] = useState("all");

  // filter options
  const [cities, setCities] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [subjectAreas, setSubjectAreas] = useState<string[]>([]);
  const [degreeTypes, setDegreeTypes] = useState<string[]>([]);

  // modal
  const [selectedUniversity, setSelectedUniversity] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // stats cache
  const [universityStats, setUniversityStats] = useState<Record<string, any>>({});

  /* -------- initial loads -------- */
  useEffect(() => {
    loadFilterOptions();
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------- reload on filter changes -------- */
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  /* -------- load both universities and courses -------- */
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build university query
      const universityParams: any = {};
      if (selectedCountry === "DE") universityParams.country = "germany";
      if (selectedCountry === "UK") universityParams.country = "uk";

      if (selectedCity !== "all") universityParams.city = selectedCity;
      if (selectedState !== "all") universityParams.state = selectedState;
      if (selectedCourse !== "all") universityParams.subject_area = selectedCourse;
      if (selectedLanguage !== "all") universityParams.language = selectedLanguage;
      if (searchQuery.trim()) universityParams.search = searchQuery.trim();

      // Universities
      const universitiesData = await universityAPI.getUniversities(universityParams);
      const universitiesArray = Array.isArray(universitiesData) ? universitiesData : [];

      // Courses (for stats/search enrichment)
      const courseParams: any = {};
      courseParams.country = selectedCountry === "DE" ? "Germany" : "United Kingdom";
      if (selectedDegreeType !== "all") courseParams.degree_type = selectedDegreeType;
      if (selectedIntakeSeason !== "all") courseParams.intake_season = selectedIntakeSeason;
      if (selectedLanguage !== "all") courseParams.language = selectedLanguage;
      if (selectedCourse !== "all") courseParams.subject_area = selectedCourse;
      if (searchQuery.trim()) courseParams.search = searchQuery.trim();

      const coursesData = await courseAPI.getCourses(courseParams);
      const coursesArray = Array.isArray(coursesData) ? coursesData : [];

      // Enrich universities with any found by course search
      let finalUniversities = [...universitiesArray];
      if (searchQuery.trim() && coursesArray.length > 0) {
        const courseUniversityIds = [...new Set(coursesArray.map((c) => c.university))];
        for (const id of courseUniversityIds) {
          if (!finalUniversities.some((u) => u.id === id)) {
            try {
              const uni = await universityAPI.getUniversityById(id);
              if (uni) finalUniversities.push(uni);
            } catch (e) {
              console.warn("Failed to load university", id, e);
            }
          }
        }
      }

      // If course filters are active, keep only universities that have matching courses
      if (
        selectedDegreeType !== "all" ||
        selectedIntakeSeason !== "all" ||
        tuitionRange !== "all" ||
        gpaRange !== "all"
      ) {
        const ids = [...new Set(coursesArray.map((c) => c.university))];
        finalUniversities = finalUniversities.filter((u) => ids.includes(u.id));
      }

      setUniversities(finalUniversities);
      setCourses(coursesArray);
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

  /* -------- compute per-uni stats -------- */
  const calculateUniversityStats = (universitiesData: any[], coursesData: any[]) => {
    const stats: Record<string, any> = {};
    universitiesData.forEach((uni) => {
      const uniCourses = coursesData.filter((c) => c.university === uni.id);
      const tuitionFees = uniCourses
        .map((c) => Number(c.tuition_fee) || 0)
        .filter((fee) => fee > 0);

      stats[uni.id] = {
        totalCourses: uniCourses.length,
        degreeTypes: [...new Set(uniCourses.map((c) => c.degree_type))].filter(Boolean),
        subjects: [...new Set(uniCourses.map((c) => c.subject_area))].filter(Boolean).slice(0, 3),
        languages: [...new Set(uniCourses.map((c) => c.language))].filter(Boolean),
        tuitionRange:
          tuitionFees.length > 0
            ? { min: Math.min(...tuitionFees), max: Math.max(...tuitionFees) }
            : null,
        intakeSeasons: [...new Set(uniCourses.map((c) => c.intake_season))].filter(Boolean),
      };
    });
    setUniversityStats(stats);
  };

  /* -------- load filter options -------- */
  const loadFilterOptions = async () => {
    try {
      const [citiesData, statesData, subjectsData, degreeTypesData] = await Promise.all([
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

  /* -------- favorites helpers -------- */
  const addToFavorites = (universityId: string) => {
    const uni = universities.find((u) => u.id === universityId);
    if (uni && !favorites.some((f) => f.id === universityId)) {
      setFavorites((prev) => [...prev, uni]);
    }
  };
  const removeFromFavorites = (universityId: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== universityId));
  };
  const isFavorite = (universityId: string) => favorites.some((f) => f.id === universityId);

  /* -------- filtered list -------- */
  const filteredUniversities = useMemo(() => {
    let filtered = showFavorites ? favorites : universities;

    switch (activeFilter) {
      case "Top 50":
        filtered = filtered.filter((u) => u.ranking && u.ranking <= 50);
        break;
      case "High Match":
        filtered = filtered.filter((u) => u.match_score && u.match_score >= 80);
        break;
      case "Low Tuition":
        filtered = filtered.filter((u) => {
          const s = universityStats[u.id];
          return s && s.tuitionRange && s.tuitionRange.min < 15000;
        });
        break;
      case "High Acceptance":
        filtered = filtered.filter((u) => u.acceptance_rate && u.acceptance_rate >= 20);
        break;
      default:
        break;
    }

    return filtered;
  }, [universities, favorites, showFavorites, activeFilter, universityStats]);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const item = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } };

  const formatTuition = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);

  /* -------- University Card -------- */
  const UniversityCard = ({ university }: { university: any }) => {
    const [heartLoading, setHeartLoading] = useState(false);
    const stats = universityStats[university.id] || {};

    const handleHeartClick = async () => {
      if (heartLoading) return;
      setHeartLoading(true);
      try {
        await new Promise((r) => setTimeout(r, 200));
        if (isFavorite(university.id)) removeFromFavorites(university.id);
        else addToFavorites(university.id);
      } finally {
        setHeartLoading(false);
      }
    };

    const openCourseModal = () => {
      setSelectedUniversity(university);
      setIsModalOpen(true);
    };

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#E08D3C] bg-white h-96 w-full flex flex-col">
        <div className="p-4 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                {university.image_url ? (
                  <img
                    src={university.image_url}
                    alt={university.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const t = e.target as HTMLImageElement;
                      t.style.display = "none";
                      (t.nextSibling as HTMLElement).style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={`w-full h-full bg-gradient-to-r from-[#C4DFF0] to-[#E08D3C] flex items-center justify-center ${
                    university.image_url ? "hidden" : ""
                  }`}
                >
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
              disabled={heartLoading}
            >
              {heartLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className={`w-4 h-4 ${isFavorite(university.id) ? "fill-current" : ""}`} />}
            </Button>
          </div>

          {/* Tags */}
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

          {/* Stats */}
          <div className="space-y-2 mb-3 flex-1">
            <div className="flex justify-between text-xs text-[#2C3539]">
              <span>Total Courses:</span>
              <span className="font-bold text-[#E08D3C]">{stats.totalCourses || university.total_courses || 0}</span>
            </div>

            {stats.degreeTypes?.length > 0 && (
              <div className="text-xs">
                <span className="text-[#2C3539] mb-1 block">Degrees:</span>
                <div className="flex flex-wrap gap-1">
                  {stats.degreeTypes.slice(0, 3).map((degree: string) => (
                    <Badge key={degree} variant="outline" className="text-xs py-0 px-2">
                      {degree?.[0]?.toUpperCase() + degree?.slice(1)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {stats.subjects?.length > 0 && (
              <div className="text-xs">
                <span className="text-[#2C3539] mb-1 block">Popular Subjects:</span>
                <p className="text-gray-600 text-xs line-clamp-1">
                  {stats.subjects.slice(0, 2).join(", ")}
                  {stats.subjects.length > 2 && ` +${stats.subjects.length - 2} more`}
                </p>
              </div>
            )}

            {stats.tuitionRange && stats.tuitionRange.min > 0 && (
              <div className="flex justify-between text-xs text-[#2C3539]">
                <span>Tuition Range:</span>
                <span className="font-medium text-xs">
                  {stats.tuitionRange.min === stats.tuitionRange.max
                    ? formatTuition(stats.tuitionRange.min)
                    : `${formatTuition(stats.tuitionRange.min)} - ${formatTuition(stats.tuitionRange.max)}`}
                </span>
              </div>
            )}

            {stats.languages?.length > 0 && (
              <div className="flex justify-between text-xs text-[#2C3539]">
                <span>Languages:</span>
                <span className="font-medium text-xs">{stats.languages.slice(0, 2).join(", ")}</span>
              </div>
            )}

            {university.acceptance_rate && (
              <div className="flex justify-between text-xs text-[#2C3539]">
                <span>Acceptance Rate:</span>
                <span className="font-medium">{university.acceptance_rate}%</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-gray-100 mt-auto">
            <div className="text-center mb-3">
              <span className="font-bold text-[#E08D3C] text-sm">
                {stats.totalCourses || university.total_courses || 0} Courses Available
              </span>
              {stats.degreeTypes?.length > 0 && (
                <div className="text-xs text-gray-600 mt-1">
                  {stats.degreeTypes.map((d: string) => d?.[0]?.toUpperCase() + d?.slice(1)).join(" • ")}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-[#E08D3C] text-[#E08D3C] hover:bg-[#E08D3C] hover:text-white font-medium px-3 py-2 rounded-lg transition-colors duration-200 text-xs"
                onClick={openCourseModal}
              >
                {stats.totalCourses > 0 ? "View Courses" : "Learn More"}
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-[#2C3539] hover:bg-[#1e2529] text-white font-medium px-3 py-2 rounded-lg transition-colors duration-200 text-xs"
                onClick={openCourseModal} // open modal so user selects a course, then we POST
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  /* -------- render -------- */
  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          {showFavorites && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFavorites(false)}
              className="flex items-center space-x-2 text-gray-600 hover:text-[#E08D3C]"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold mb-2">{showFavorites ? "Your Wishlist" : "Universities"}</h1>
            <p className="text-muted-foreground">
              {showFavorites
                ? "Your saved universities"
                : `Discover universities and courses in ${selectedCountry === "DE" ? "Germany" : "United Kingdom"} matched to your profile`}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          className={`rounded-pill transition-all duration-200 ${
            showFavorites ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100" : "hover:bg-[#E08D3C] hover:text-white hover:border-[#E08D3C]"
          }`}
          onClick={() => setShowFavorites(!showFavorites)}
        >
          <Heart className={`w-4 h-4 mr-2 ${showFavorites ? "fill-current" : ""}`} />
          {showFavorites ? "View All Universities" : `Wishlist (${favorites.length})`}
        </Button>
      </motion.div>

      {/* Top filters */}
      {!showFavorites && (
        <motion.div className="space-y-4" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
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

            <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
              <option value="all">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
              <option value="all">All States</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
              <option value="all">All Subjects</option>
              {subjectAreas.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>

            <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
              <option value="all">All Languages</option>
              <option value="english">English</option>
              <option value="german">German</option>
              <option value="both">Both</option>
            </select>
          </div>

          {/* Secondary row */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
            <select value={selectedDegreeType} onChange={(e) => setSelectedDegreeType(e.target.value)} className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
              <option value="all">All Degrees</option>
              <option value="bachelors">Bachelor's</option>
              <option value="masters">Master's</option>
              <option value="phd">PhD</option>
            </select>

            <select value={selectedIntakeSeason} onChange={(e) => setSelectedIntakeSeason(e.target.value)} className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
              <option value="all">All Intakes</option>
              <option value="winter">Winter</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="fall">Fall</option>
            </select>

            <select value={tuitionRange} onChange={(e) => setTuitionRange(e.target.value)} className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
              <option value="all">All Tuition</option>
              <option value="0-10000">Under €10,000</option>
              <option value="10000-20000">€10,000 - €20,000</option>
              <option value="20000-30000">€20,000 - €30,000</option>
              <option value="30000+">€30,000+</option>
            </select>

            <select value={gpaRange} onChange={(e) => setGpaRange(e.target.value)} className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
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
              <select className="h-10 w-full rounded border-gray-300 text-sm px-2 bg-white ">
                <option>Ranking (Best First)</option>
                <option>Name (A to Z)</option>
                <option>Match Score</option>
                <option>Tuition (Low to High)</option>
                <option>Most Courses</option>
              </select>
            </div>
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <motion.button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "h-10 px-6 rounded-full text-sm font-medium transition-all min-w-[100px] flex items-center justify-center",
                  activeFilter === filter ? "bg-[#E08D3C] text-white shadow" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filter}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Grid */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" variants={container} initial="hidden" animate="show">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#E08D3C]" />
            <span className="ml-2 text-gray-600">Loading universities and courses...</span>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-12">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="font-bold text-xl text-[#2C3539] mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={loadData} className="bg-[#E08D3C] hover:bg-[#c77a32] text-white font-bold px-6 py-3 rounded-lg">
              Try Again
            </Button>
          </div>
        ) : filteredUniversities.length > 0 ? (
          filteredUniversities.map((university) => (
            <motion.div key={university.id} variants={item} whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
              <UniversityCard university={university} />
            </motion.div>
          ))
        ) : showFavorites ? (
          <div className="col-span-full text-center py-16">
            <div className="max-w-md mx-auto">
              <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-600 mb-4">No favorites yet</h3>
              <p className="text-gray-500 mb-8 text-lg leading-relaxed">
                Start exploring universities and save your favorites by clicking the heart icon on any university card!
              </p>
              <Button onClick={() => setShowFavorites(false)} className="bg-[#E08D3C] hover:bg-[#c77a32] text-white font-bold px-8 py-3 rounded-lg text-lg">
                Browse Universities
              </Button>
            </div>
          </div>
        ) : (
          <div className="col-span-full text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">No universities found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search criteria.</p>
            {searchQuery && <p className="text-sm text-gray-400">Searched for universities and courses matching: "{searchQuery}"</p>}
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

      {/* Footer */}
      {!showFavorites && (
        <motion.div className="text-center py-8" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
          <p className="text-muted-foreground mb-4">Can't find what you're looking for?</p>
          <Button variant="outline" className="rounded-pill">
            Get Personalized Recommendations
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}