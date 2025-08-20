import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Building2
} from "lucide-react";

type Country = "DE" | "UK";

interface ContextType {
  selectedCountry: Country;
}

const mockUniversities = {
  DE: [
    {
      id: 1,
      name: "Technical University of Munich",
      city: "Munich",
      country: "Germany",
      ranking: 50,
      tuitionFee: "€150/semester",
      matchScore: 95,
      acceptanceRate: 8,
      logo: "🏛️",
      programs: ["Computer Science", "Engineering", "Physics"],
      intakes: ["October"],
      description: "Leading technical university with strong industry connections"
    },
    {
      id: 2,
      name: "RWTH Aachen University", 
      city: "Aachen",
      country: "Germany",
      ranking: 87,
      tuitionFee: "€315/semester",
      matchScore: 89,
      acceptanceRate: 12,
      logo: "🎓",
      programs: ["Mechanical Engineering", "Computer Science", "Medicine"],
      intakes: ["October"],
      description: "Excellence in engineering and natural sciences"
    },
    {
      id: 3,
      name: "Heidelberg University",
      city: "Heidelberg", 
      country: "Germany",
      ranking: 64,
      tuitionFee: "€171/semester",
      matchScore: 82,
      acceptanceRate: 15,
      logo: "📚",
      programs: ["Medicine", "Life Sciences", "Computer Science"],
      intakes: ["October"],
      description: "Germany's oldest university with cutting-edge research"
    }
  ],
  UK: [
    {
      id: 4,
      name: "Imperial College London",
      city: "London",
      country: "United Kingdom", 
      ranking: 6,
      tuitionFee: "£37,900/year",
      matchScore: 88,
      acceptanceRate: 11,
      logo: "👑",
      programs: ["Computer Science", "Engineering", "Medicine"],
      intakes: ["September"],
      description: "World-class science, engineering and medicine"
    },
    {
      id: 5,
      name: "University of Edinburgh",
      city: "Edinburgh",
      country: "United Kingdom",
      ranking: 22,
      tuitionFee: "£34,800/year", 
      matchScore: 85,
      acceptanceRate: 18,
      logo: "🏰",
      programs: ["Artificial Intelligence", "Computer Science", "Data Science"],
      intakes: ["September"],
      description: "Historic university with innovative AI research"
    },
    {
      id: 6,
      name: "University of Cambridge",
      city: "Cambridge",
      country: "United Kingdom",
      ranking: 2,
      tuitionFee: "£37,293/year",
      matchScore: 92,
      acceptanceRate: 21,
      logo: "🎭",
      programs: ["Computer Science", "Engineering", "Mathematics"],
      intakes: ["October"],
      description: "One of the world's oldest and most prestigious universities"
    }
  ]
};

const filters = ["All", "Top 50", "High Match", "Low Tuition", "High Acceptance"];

export default function Universities() {
  const { selectedCountry } = useOutletContext<ContextType>();
  const [activeFilter, setActiveFilter] = useState("All");
  const [savedUniversities, setSavedUniversities] = useState<number[]>([]);
  
  const universities = mockUniversities[selectedCountry];

  const toggleSave = (id: number) => {
    setSavedUniversities(prev => 
      prev.includes(id) 
        ? prev.filter(savedId => savedId !== id)
        : [...prev, id]
    );
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

  // University Card Component with improved design from first file
  const UniversityCard = ({ university }) => {
    const [heartLoading, setHeartLoading] = useState(false);
    
    const handleHeartClick = async () => {
      if (heartLoading) return;
      
      setHeartLoading(true);
      try {
        toggleSave(university.id);
      } finally {
        setHeartLoading(false);
      }
    };

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#E08D3C] bg-white">
        <div className="p-3 xs:p-4 sm:p-6">
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <div className="w-8 h-5 xs:w-10 xs:h-6 sm:w-12 sm:h-8 rounded overflow-hidden shadow-sm flex-shrink-0">
                <div className="w-full h-full bg-gradient-to-r from-[#C4DFF0] to-[#E08D3C] flex items-center justify-center">
                  <span className="text-white text-lg">{university.logo}</span>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-sm xs:text-base sm:text-lg group-hover:text-[#E08D3C] transition-colors duration-200 truncate">
                  {university.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#2C3539] flex items-center truncate">
                  <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{university.city}, {university.country}</span>
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <span className="bg-[#C4DFF0] text-[#2C3539] text-xs px-2 py-1 rounded-full font-semibold">
                #{university.ranking}
              </span>
              <span className="bg-[#E08D3C] text-white text-xs px-2 py-1 rounded-full font-semibold mt-1 block">
                {university.matchScore}% Match
              </span>
            </div>
          </div>
          
          <div className="mb-3 sm:mb-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#2C3539] mb-2 flex-wrap">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">{university.acceptanceRate}% Acceptance</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">{university.intakes.join(", ")} Intake</span>
              </div>
            </div>
            <p className="text-gray-700 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 leading-relaxed">
              {university.description}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 sm:pt-4 border-t border-gray-100 space-y-3 sm:space-y-0">
            <div className="text-sm">
              <span className="font-bold text-[#E08D3C] text-sm sm:text-base">
                {university.tuitionFee}
              </span>
            </div>
            <div className="flex space-x-2 w-full sm:w-auto justify-end items-center">

              <Button
                size="sm"
                variant="ghost"
                className={`p-2 rounded-lg transition-all duration-200 ${
                  savedUniversities.includes(university.id)
                    ? 'text-red-500 hover:text-red-600 hover:bg-red-50'
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                } ${heartLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleHeartClick}
                disabled={heartLoading}
              >
                {heartLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Heart className={`w-4 h-4 ${savedUniversities.includes(university.id) ? 'fill-current' : ''}`} />
                )}
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-[#E08D3C] text-[#E08D3C] hover:bg-[#E08D3C] hover:text-white font-medium px-2 xs:px-3 py-2 rounded-lg transition-colors duration-200 flex-1 sm:flex-initial text-xs sm:text-sm"
              >
                Learn More
              </Button>
              <Button 
  size="sm" 
  className="bg-[#2C3539] hover:bg-[#1e2529] text-white font-medium px-3 xs:px-4 py-2 rounded-lg transition-colors duration-200 flex-1 sm:flex-initial text-xs sm:text-sm mr-5"
>
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
          <h1 className="text-3xl font-bold mb-2">Universities</h1>
          <p className="text-muted-foreground">
            Discover universities in {selectedCountry === "DE" ? "Germany" : "United Kingdom"} 
            matched to your profile
          </p>
        </div>
        <Button variant="outline" className="rounded-pill">
          <Bookmark className="w-4 h-4 mr-2" />
          View Wishlist ({savedUniversities.length})
        </Button>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        className="space-y-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Primary Filters */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 xs:gap-3 lg:gap-4 mb-3 xs:mb-4 lg:mb-6">
          <div className="relative xs:col-span-2 sm:col-span-3 lg:col-span-2">
            <Search className="absolute left-2 xs:left-3 top-1/2 -translate-y-1/2 w-3 xs:w-4 h-3 xs:h-4 text-gray-400" />
            <Input
              placeholder="Search universities..."
              className="pl-8 xs:pl-10 py-2 rounded-lg border-gray-300 focus:border-[#E08D3C] focus:ring-[#E08D3C] text-sm xs:text-base"
            />
          </div>

          <select className="rounded-lg border-gray-300 text-sm xs:text-base px-3 py-2">
            <option>All Cities</option>
            <option>Munich</option>
            <option>Berlin</option>
            <option>London</option>
            <option>Edinburgh</option>
          </select>

          <select className="rounded-lg border-gray-300 text-sm xs:text-base px-3 py-2">
            <option>All States</option>
            <option>Bavaria</option>
            <option>England</option>
            <option>Scotland</option>
          </select>

          <select className="rounded-lg border-gray-300 text-sm xs:text-base px-3 py-2">
            <option>All Subjects</option>
            <option>Computer Science</option>
            <option>Engineering</option>
            <option>Medicine</option>
            <option>Business</option>
          </select>

          <select className="rounded-lg border-gray-300 text-sm xs:text-base px-3 py-2">
            <option>All Languages</option>
            <option>English</option>
            <option>German</option>
            <option>Both</option>
          </select>
        </div>

        {/* Secondary Filters Row */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-2 xs:gap-3 lg:gap-4 mb-3 xs:mb-4">
          <select className="rounded-lg border-gray-300 text-sm xs:text-base px-3 py-2">
            <option>All Intakes</option>
            <option>Winter</option>
            <option>Summer</option>
            <option>Both</option>
          </select>

          <select className="rounded-lg border-gray-300 text-sm xs:text-base px-3 py-2">
            <option>All Types</option>
            <option>Public</option>
            <option>Private</option>
          </select>

          <select className="rounded-lg border-gray-300 text-sm xs:text-base px-3 py-2">
            <option>All Universities</option>
            <option>Partner Universities</option>
            <option>Non-Partner</option>
          </select>

          <div className="xs:col-span-2 lg:col-span-2 flex flex-col xs:flex-row items-start xs:items-center justify-between space-y-2 xs:space-y-0 xs:space-x-4">
            <span className="text-xs xs:text-sm text-[#2C3539] font-medium whitespace-nowrap">
              Showing {universities.length} universities
            </span>
            <div className="flex items-center space-x-2 xs:space-x-4 w-full xs:w-auto">
              <div className="flex items-center space-x-1 xs:space-x-2">
                <span className="text-xs xs:text-sm text-[#2C3539]">Sort:</span>
              </div>
              <select className="w-full xs:w-48 rounded-lg border-gray-300 text-xs xs:text-sm px-3 py-2">
                <option>Ranking (Best First)</option>
                <option>Name (A to Z)</option>
                <option>Match Score</option>
                <option>Tuition (Low to High)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
  {filters.map((filter) => (
    <motion.button
      key={filter}
      onClick={() => setActiveFilter(filter)}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium transition-all",
        activeFilter === filter
          ? "bg-[#E08D3C] text-white shadow"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {filter}
    </motion.button>
  ))}
</div>
      </motion.div>

      {/* Universities Grid */}
      <motion.div 
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
  variants={container}
  initial="hidden"
  animate="show"
>
        {universities.map((university) => (
          <motion.div
            key={university.id}
            variants={item}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <UniversityCard university={university} />
          </motion.div>
        ))}
      </motion.div>

      {/* Recommendations Footer */}
      <motion.div 
        className="text-center py-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="text-muted-foreground mb-4">
          Can't find what you're looking for?
        </p>
        <Button variant="outline" className="rounded-pill">
          Get Personalized Recommendations
        </Button>
      </motion.div>
    </motion.div>
  );
}