import { useOutletContext, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  { step: 1, title: "Profile Creation", completed: true, current: false },
  { step: 2, title: "Document Upload", completed: true, current: false },
  { step: 3, title: "University Research", completed: true, current: false },
  { step: 4, title: "Applications", completed: false, current: true },
  { step: 5, title: "Interviews", completed: false, current: false },
  { step: 6, title: "Offers & Decisions", completed: false, current: false },
  { step: 7, title: "Visa Processing", completed: false, current: false },
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
  const navigate = useNavigate();
  
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
  const currentStepIndex = progressSteps.findIndex(step => step.current);
  const overallProgress = ((currentStepIndex + 1) / progressSteps.length) * 100;

  return (
    <motion.div 
      className="space-y-8 px-4 sm:px-0"
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm">
            <Badge variant="secondary" className="bg-secondary text-white border-white/30">
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
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Your Journey Progress</h2>
          <p className="text-muted-foreground">Step {currentStepIndex + 1} of {progressSteps.length} - You're {Math.round(overallProgress)}% through your university journey!</p>
        </div>
        
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Overall Progress</span>
              <span className="text-primary font-semibold">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-6">
              {progressSteps.map((step) => (
                <div
                  key={step.step}
                  className={`text-center p-3 rounded-lg border-2 transition-all ${
                    step.completed
                      ? "border-success bg-success/5 text-success"
                      : step.current
                      ? "border-primary bg-primary/5 text-primary animate-pulse"
                      : "border-border bg-muted/50 text-muted-foreground"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-bold ${
                    step.completed
                      ? "bg-success text-success-foreground"
                      : step.current
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {step.completed ? "✓" : step.step}
                  </div>
                  <p className="text-xs font-medium">{step.title}</p>
                </div>
              ))}
            </div>
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
              onClick={() => navigate('/applications')}
            >
              <Plus className="w-5 h-5 mr-3" />
              Create New Application
            </Button>
            <Button 
              className="w-full justify-start rounded-xl h-12" 
              variant="outline"
              onClick={() => navigate('/universities')}
            >
              <GraduationCap className="w-5 h-5 mr-3" />
              Browse Universities
            </Button>
            <Button 
              className="w-full justify-start rounded-xl h-12" 
              variant="outline"
              onClick={() => navigate('/documents')}
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