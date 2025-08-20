
import { useState, useEffect, useMemo } from "react";
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
  Building2,
  ChevronLeft,
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
      description:
        "Leading technical university with strong industry connections",
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
      description: "Excellence in engineering and natural sciences",
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
      description: "Germany's oldest university with cutting-edge research",
    },
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
      description: "World-class science, engineering and medicine",
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
      description: "Historic university with innovative AI research",
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
      description:
        "One of the world's oldest and most prestigious universities",
    },
  ],
};

const filters = [
  "All",
  "Top 50",
  "High Match",
  "Low Tuition",
  "High Acceptance",
];

export default function Universities() {
  const { selectedCountry } = useOutletContext<ContextType>();
  const [activeFilter, setActiveFilter] = useState("All");
  
  // Wishlist states - no authentication required
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  const universities = mockUniversities[selectedCountry];

  // Load favorites from localStorage on component mount
  useEffect(() => {
    loadFavorites();
  }, []);

  // Load favorites from localStorage
  const loadFavorites = () => {
    try {
      const savedFavorites = localStorage.getItem('universityFavorites');
      if (savedFavorites) {
        const favoriteIds = JSON.parse(savedFavorites);
        const favoriteUniversities = [
          ...mockUniversities.DE,
          ...mockUniversities.UK
        ].filter(uni => favoriteIds.includes(uni.id));
        setFavorites(favoriteUniversities);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  // Save favorites to localStorage
  const saveFavorites = (newFavorites) => {
    try {
      const favoriteIds = newFavorites.map(fav => fav.id);
      localStorage.setItem('universityFavorites', JSON.stringify(favoriteIds));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  // Add to favorites
  const addToFavorites = (universityId) => {
    const university = [
      ...mockUniversities.DE,
      ...mockUniversities.UK
    ].find(uni => uni.id === universityId);
    
    if (university && !favorites.some(fav => fav.id === universityId)) {
      const newFavorites = [...favorites, university];
      setFavorites(newFavorites);
      saveFavorites(newFavorites);
    }
  };

  // Remove from favorites
  const removeFromFavorites = (universityId) => {
    const newFavorites = favorites.filter(fav => fav.id !== universityId);
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  // Check if university is in favorites
  const isFavorite = (universityId) => {
    return favorites.some(fav => fav.id === universityId);
  };

  // Get filtered universities based on current view
  const filteredUniversities = useMemo(() => {
    return showFavorites ? favorites : universities;
  }, [showFavorites, favorites, universities]);

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

  // Compact University Card Component with wishlist functionality
  const UniversityCard = ({ university }) => {
    const [heartLoading, setHeartLoading] = useState(false);

    const handleHeartClick = async () => {
      if (heartLoading) return;
      
      setHeartLoading(true);
      try {
        // Add small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 200));
        
        if (isFavorite(university.id)) {
          removeFromFavorites(university.id);
        } else {
          addToFavorites(university.id);
        }
      } finally {
        setHeartLoading(false);
      }
    };

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#E08D3C] bg-white h-80 w-full aspect-square flex flex-col">
        <div className="p-4 flex flex-col h-full">
          {/* Header with logo and basic info */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                <div className="w-full h-full bg-gradient-to-r from-[#C4DFF0] to-[#E08D3C] flex items-center justify-center">
                  <span className="text-white text-lg">{university.logo}</span>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-sm group-hover:text-[#E08D3C] transition-colors duration-200 line-clamp-2 leading-tight">
                  {university.name}
                </h3>
                <p className="text-xs text-[#2C3539] flex items-center mt-1">
                  <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{university.city}</span>
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
            <span className="bg-[#C4DFF0] text-[#2C3539] text-xs px-2 py-1 rounded-full font-semibold">
              #{university.ranking}
            </span>
            <span className="bg-[#E08D3C] text-white text-xs px-2 py-1 rounded-full font-semibold">
              {university.matchScore}% Match
            </span>
          </div>

          {/* Key stats */}
          <div className="space-y-2 mb-3 flex-1">
            <div className="flex justify-between text-xs text-[#2C3539]">
              <span>Acceptance Rate:</span>
              <span className="font-medium">{university.acceptanceRate}%</span>
            </div>
            <div className="flex justify-between text-xs text-[#2C3539]">
              <span>Intake:</span>
              <span className="font-medium">{university.intakes.join(", ")}</span>
            </div>
            <p className="text-gray-700 text-xs line-clamp-2 leading-relaxed">
              {university.description}
            </p>
          </div>

          {/* Footer with tuition and buttons */}
          <div className="pt-3 border-t border-gray-100 mt-auto">
            <div className="text-center mb-3">
              <span className="font-bold text-[#E08D3C] text-sm">
                {university.tuitionFee}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-[#E08D3C] text-[#E08D3C] hover:bg-[#E08D3C] hover:text-white font-medium px-3 py-2 rounded-lg transition-colors duration-200 text-xs"
              >
                Learn More
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-[#2C3539] hover:bg-[#1e2529] text-white font-medium px-3 py-2 rounded-lg transition-colors duration-200 text-xs"
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
            <h1 className="text-3xl font-bold mb-2">
              {showFavorites ? 'Your Wishlist' : 'Universities'}
            </h1>
            <p className="text-muted-foreground">
              {showFavorites 
                ? 'Your saved universities'
                : `Discover universities in ${selectedCountry === "DE" ? "Germany" : "United Kingdom"} matched to your profile`
              }
            </p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className={`rounded-pill transition-all duration-200 ${
            showFavorites 
              ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
              : 'hover:bg-[#E08D3C] hover:text-white hover:border-[#E08D3C]'
          }`}
          onClick={() => setShowFavorites(!showFavorites)}
        >
          <Heart className={`w-4 h-4 mr-2 ${showFavorites ? 'fill-current' : ''}`} />
          {showFavorites ? 'View All Universities' : `Wishlist (${favorites.length})`}
        </Button>
      </motion.div>

      {/* Search and Filters - Only show when not in favorites view */}
      {!showFavorites && (
        <motion.div
          className="space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Primary Filters - Fixed sizing */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
            <div className="relative xs:col-span-2 sm:col-span-3 lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search universities..."
                className="pl-10 h-10 rounded-lg border-gray-300 focus:border-[#E08D3C] focus:ring-[#E08D3C] text-sm"
              />
            </div>

            <select className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
              <option>All Cities</option>
              <option>Munich</option>
              <option>Berlin</option>
              <option>London</option>
              <option>Edinburgh</option>
            </select>

            <select className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
              <option>All States</option>
              <option>Bavaria</option>
              <option>England</option>
              <option>Scotland</option>
            </select>

            <select className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
              <option>All Subjects</option>
              <option>Computer Science</option>
              <option>Engineering</option>
              <option>Medicine</option>
              <option>Business</option>
            </select>

            <select className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
              <option>All Languages</option>
              <option>English</option>
              <option>German</option>
              <option>Both</option>
            </select>
          </div>

          {/* Secondary Filters Row - Fixed sizing */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
            <select className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
              <option>All Intakes</option>
              <option>Winter</option>
              <option>Summer</option>
              <option>Both</option>
            </select>

            <select className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
              <option>All Types</option>
              <option>Public</option>
              <option>Private</option>
            </select>

            <select className="h-10 rounded-lg border-gray-300 text-sm px-3 bg-white">
              <option>All Universities</option>
              <option>Partner Universities</option>
              <option>Non-Partner</option>
            </select>

            <div className="xs:col-span-2 lg:col-span-2 flex flex-col xs:flex-row items-start xs:items-center justify-between space-y-2 xs:space-y-0 xs:space-x-4">
              <span className="text-sm text-[#2C3539] font-medium whitespace-nowrap">
                Showing {filteredUniversities.length} universities
              </span>
              <div className="flex items-center space-x-4 w-full xs:w-auto">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-[#2C3539]">Sort:</span>
                </div>
                <select className="h-10 w-full xs:w-48 rounded-lg border-gray-300 text-sm px-3 bg-white">
                  <option>Ranking (Best First)</option>
                  <option>Name (A to Z)</option>
                  <option>Match Score</option>
                  <option>Tuition (Low to High)</option>
                </select>
              </div>
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
                whileTap={{ scale: 0.95 }}
              >
                {filter}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Universities Grid - Wider square cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {filteredUniversities.length > 0 ? (
          filteredUniversities.map((university) => (
            <motion.div
              key={university.id}
              variants={item}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
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
              <Button 
                onClick={() => setShowFavorites(false)}
                className="bg-[#E08D3C] hover:bg-[#c77a32] text-white font-bold px-8 py-3 rounded-lg text-lg"
              >
                Browse Universities
              </Button>
            </div>
          </div>
        ) : (
          <div className="col-span-full text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">No universities found</h3>
            <p className="text-gray-500">Try adjusting your search criteria.</p>
          </div>
        )}
      </motion.div>

      {/* Recommendations Footer - Only show when not in favorites view */}
      {!showFavorites && (
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
      )}
    </motion.div>
  );
}
