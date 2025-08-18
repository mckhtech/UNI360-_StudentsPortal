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
  Bookmark
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
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search universities, programs, cities..." 
              className="pl-10 rounded-xl"
            />
          </div>
          <Button variant="outline" className="rounded-xl">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <motion.button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-4 py-2 rounded-pill text-sm font-medium transition-all duration-micro",
                activeFilter === filter
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
            <Card className="overflow-hidden hover:shadow-float transition-all duration-standard group">
              {/* Card Header */}
              <div className="relative p-6 bg-gradient-subtle">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white text-xl">
                    {university.logo}
                  </div>
                  <motion.button
                    onClick={() => toggleSave(university.id)}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart 
                      className={cn(
                        "w-5 h-5 transition-colors",
                        savedUniversities.includes(university.id)
                          ? "fill-red-500 text-red-500"
                          : "text-muted-foreground"
                      )}
                    />
                  </motion.button>
                </div>

                {/* Match Score */}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-accent text-accent-foreground rounded-pill">
                    {university.matchScore}% Match
                  </Badge>
                </div>

                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                  {university.name}
                </h3>
                <div className="flex items-center gap-1 text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{university.city}, {university.country}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {university.description}
                </p>
              </div>

              {/* Card Body */}
              <div className="p-6 pt-0">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-muted/50 rounded-xl">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold">#{university.ranking}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">World Ranking</span>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-xl">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="font-semibold">{university.acceptanceRate}%</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Acceptance</span>
                  </div>
                </div>

                {/* Key Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tuition:</span>
                    <span className="font-medium">{university.tuitionFee}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Intake:</span>
                    <span className="font-medium">{university.intakes.join(", ")}</span>
                  </div>
                </div>

                {/* Programs */}
                <div className="mb-4">
                  <span className="text-sm text-muted-foreground mb-2 block">Popular Programs:</span>
                  <div className="flex flex-wrap gap-1">
                    {university.programs.slice(0, 2).map((program) => (
                      <Badge key={program} variant="outline" className="text-xs rounded-pill">
                        {program}
                      </Badge>
                    ))}
                    {university.programs.length > 2 && (
                      <Badge variant="outline" className="text-xs rounded-pill">
                        +{university.programs.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 rounded-xl"
                    size="sm"
                  >
                    Apply Now
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="rounded-xl"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
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