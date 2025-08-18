import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  FileText,
  GraduationCap,
  Award,
  TrendingUp,
  Plus,
  CheckCircle,
  Clock,
  Target,
  Trophy,
  Flame,
  Calendar
} from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

type Country = "DE" | "UK";

interface ContextType {
  selectedCountry: Country;
}

const progressSteps = [
  { id: 1, label: "Profile", completed: true },
  { id: 2, label: "Research", completed: true },
  { id: 3, label: "Apply", completed: false, current: true },
  { id: 4, label: "Offer", completed: false },
  { id: 5, label: "Visa", completed: false },
  { id: 6, label: "Enrollment", completed: false },
  { id: 7, label: "Arrival", completed: false },
];

const recentActivities = [
  {
    type: "application",
    title: "Application submitted to TU Munich",
    time: "2 hours ago",
    status: "success"
  },
  {
    type: "document",
    title: "Transcript uploaded",
    time: "1 day ago",
    status: "success"
  },
  {
    type: "reminder",
    title: "IELTS score expires in 30 days",
    time: "2 days ago",
    status: "warning"
  }
];

export default function Dashboard() {
  const { selectedCountry } = useOutletContext<ContextType>();
  
  const countryData = {
    DE: {
      greeting: "Guten Tag! Ready for Germany? 🇩🇪",
      stats: {
        applications: 3,
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
      greeting: "Hello! Ready for the UK? 🇬🇧",
      stats: {
        applications: 2,
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

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Welcome Banner */}
      <motion.section 
        className="relative overflow-hidden rounded-3xl bg-gradient-primary p-8 md:p-12 text-white"
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome back, Alex! 🎓
          </h1>
          <p className="text-xl opacity-90 mb-6">
            {currentData.greeting}
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              UUID: ST2024-001234
            </Badge>
            <span>Continue your journey to studying abroad</span>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-8 right-8 w-24 h-24 bg-white/10 rounded-full animate-float" />
        <div className="absolute bottom-8 right-16 w-16 h-16 bg-white/5 rounded-full animate-float" style={{ animationDelay: "1s" }} />
        </motion.section>

      {/* Overview Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="md:col-span-2 lg:col-span-1">
          <Card className="p-6 h-full flex flex-col items-center justify-center text-center">
            <ProgressRing progress={85} size="lg" className="mb-4" />
            <h3 className="font-semibold text-lg mb-2">Profile Complete</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Almost there! Complete your profile to unlock all features.
            </p>
            <Button size="sm" className="rounded-pill">
              Complete Profile
            </Button>
          </Card>
        </div>

        <StatCard
          title="Active Applications"
          value={currentData.stats.applications}
          description={`${currentData.stats.applications} applications in progress`}
          icon={FileText}
          variant="primary"
          trend={{ value: 25, label: "vs last month" }}
          className="animate-slide-in-right"
        />

        <StatCard
          title="Offers Received"
          value={currentData.stats.offers}
          description={currentData.stats.offers > 0 ? "Congratulations!" : "Applications under review"}
          icon={Award}
          variant="accent"
          className="animate-slide-in-left"
        />

        <StatCard
          title="Success Rate"
          value={`${currentData.stats.acceptance}%`}
          description="Based on your profile strength"
          icon={TrendingUp}
          trend={{ value: 12, label: "improvement" }}
          className="animate-slide-in-right"
        />
      </section>

      {/* Journey Progress */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Journey</h2>
          <Badge variant="outline" className="text-sm">
            Step 3 of 7
          </Badge>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            {progressSteps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center relative">
                {/* Step Circle */}
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-standard",
                  step.completed 
                    ? "bg-primary border-primary text-primary-foreground" 
                    : step.current
                    ? "bg-primary/10 border-primary text-primary animate-pulse-glow"
                    : "bg-muted border-border text-muted-foreground"
                )}>
                  {step.completed ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : step.current ? (
                    <Clock className="w-6 h-6" />
                  ) : (
                    <Target className="w-6 h-6" />
                  )}
                </div>

                {/* Step Label */}
                <span className={cn(
                  "text-sm font-medium mt-2 text-center",
                  step.completed || step.current ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.label}
                </span>

                {/* Connector Line */}
                {index < progressSteps.length - 1 && (
                  <div className={cn(
                    "absolute top-6 left-12 w-full h-0.5 transition-all duration-standard",
                    step.completed ? "bg-primary" : "bg-border"
                  )} />
                )}
              </div>
            ))}
          </div>

          <div className="bg-muted/50 rounded-xl p-4">
            <h3 className="font-semibold mb-2">Next Step: Submit Applications</h3>
            <p className="text-sm text-muted-foreground">
              You're ready to submit your applications! Make sure all documents are uploaded and reviewed.
            </p>
          </div>
        </Card>
      </section>

      {/* Quick Actions & Recent Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button 
              className="w-full justify-start rounded-xl h-12" 
              variant="outline"
            >
              <Plus className="w-5 h-5 mr-3" />
              Create New Application
            </Button>
            <Button 
              className="w-full justify-start rounded-xl h-12" 
              variant="outline"
            >
              <GraduationCap className="w-5 h-5 mr-3" />
              Browse Universities
            </Button>
            <Button 
              className="w-full justify-start rounded-xl h-12" 
              variant="outline"
            >
              <FileText className="w-5 h-5 mr-3" />
              Upload Documents
            </Button>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                <div className={cn(
                  "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                  activity.status === "success" ? "bg-green-500" :
                  activity.status === "warning" ? "bg-yellow-500" : "bg-blue-500"
                )} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </motion.div>
  );
}