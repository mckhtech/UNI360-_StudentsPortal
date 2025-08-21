import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CountryToggle } from "@/components/ui/country-toggle";
import { cn } from "@/lib/utils";
import {
  Plus,
  Clock,
  Mail,
  CheckCircle,
  AlertCircle,
  XCircle,
  Circle
} from "lucide-react";

type Country = "DE" | "UK";

interface ContextType {
  selectedCountry: Country;
}

const mockApplications = {
  DE: [
    {
      id: 1,
      university: "Technical University of Munich",
      program: "Computer Science (M.Sc.)",
      status: "submitted",
      progress: 75,
      adminName: "Dr. Sarah Mueller",
      adminEmail: "s.mueller@tum.de",
      deadline: "March 15, 2024",
      logo: "🏛️"
    },
    {
      id: 2,
      university: "RWTH Aachen University",
      program: "Mechanical Engineering (M.Sc.)",
      status: "offer",
      progress: 100,
      adminName: "Prof. Hans Weber",
      adminEmail: "h.weber@rwth-aachen.de",
      deadline: "February 28, 2024",
      logo: "🎓"
    },
    {
      id: 3,
      university: "Heidelberg University",
      program: "Data Science (M.Sc.)",
      status: "draft",
      progress: 40,
      adminName: "Dr. Anna Schmidt",
      adminEmail: "a.schmidt@uni-heidelberg.de",
      deadline: "April 1, 2024",
      logo: "📚"
    }
  ],
  UK: [
    {
      id: 4,
      university: "Imperial College London",
      program: "Computer Science (M.Sc.)",
      status: "submitted",
      progress: 60,
      adminName: "Dr. James Thompson",
      adminEmail: "j.thompson@imperial.ac.uk",
      deadline: "January 31, 2024",
      logo: "👑"
    },
    {
      id: 5,
      university: "University of Edinburgh",
      program: "Artificial Intelligence (M.Sc.)",
      status: "draft",
      progress: 25,
      adminName: "Dr. Emma Wilson",
      adminEmail: "e.wilson@ed.ac.uk",
      deadline: "March 31, 2024",
      logo: "🏰"
    }
  ]
};

const statusConfig = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-800", icon: Circle },
  submitted: { label: "Submitted", color: "bg-blue-100 text-blue-800", icon: Clock },
  offer: { label: "Offer Received", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle },
  waitlist: { label: "Waitlisted", color: "bg-yellow-100 text-yellow-800", icon: AlertCircle }
};

export default function Applications() {
  const { selectedCountry } = useOutletContext<ContextType>();
  const applications = mockApplications[selectedCountry];

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
          <h1 className="text-3xl font-bold mb-2">Applications</h1>
          <p className="text-muted-foreground">
            Track and manage your university applications for {selectedCountry === "DE" ? "Germany" : "United Kingdom"}
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button className="rounded-pill shadow-medium hover:shadow-float transition-shadow">
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
        {applications.map((application) => {
          const StatusIcon = statusConfig[application.status as keyof typeof statusConfig].icon;
          
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
                      <h3 className="font-semibold text-lg mb-1">{application.university}</h3>
                      <p className="text-muted-foreground mb-2">{application.program}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                        <span className="text-xs font-medium">{application.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-primary h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${application.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>

                    <Badge 
                      className={cn(
                        "rounded-pill",
                        statusConfig[application.status as keyof typeof statusConfig].color
                      )}
                    >
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig[application.status as keyof typeof statusConfig].label}
                    </Badge>
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
        })}
      </motion.div>

      {/* Stats Footer */}
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
    </motion.div>
  );
}