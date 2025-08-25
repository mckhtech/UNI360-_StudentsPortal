import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  Clock,
  FileText,
  Calendar,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  Upload,
  Download,
  ExternalLink
} from "lucide-react";

type Country = "DE" | "UK";

interface ContextType {
  selectedCountry: Country;
}

const visaProcessSteps = {
  DE: [
    {
      id: 1,
      title: "University Admission",
      description: "Receive admission letter from German university",
      status: "completed",
      documents: ["Admission Letter", "Enrollment Certificate"],
      timeline: "Completed"
    },
    {
      id: 2,
      title: "APS Certificate",
      description: "Academic evaluation from APS (if required)",
      status: "completed", 
      documents: ["APS Certificate", "Academic Transcripts"],
      timeline: "Completed"
    },
    {
      id: 3,
      title: "Blocked Account",
      description: "Open blocked account with minimum €11,208",
      status: "current",
      documents: ["Bank Statement", "Blocked Account Confirmation"],
      timeline: "In Progress"
    },
    {
      id: 4,
      title: "Health Insurance",
      description: "Obtain German health insurance coverage",
      status: "pending",
      documents: ["Insurance Certificate"],
      timeline: "Pending"
    },
    {
      id: 5,
      title: "Visa Application",
      description: "Submit complete visa application",
      status: "pending",
      documents: ["Visa Form", "Passport", "Photos"],
      timeline: "Pending"
    },
    {
      id: 6,
      title: "Biometrics Appointment",
      description: "Attend biometrics appointment at consulate",
      status: "pending",
      documents: [],
      timeline: "Pending"
    },
    {
      id: 7,
      title: "Visa Decision",
      description: "Receive visa decision and passport",
      status: "pending",
      documents: [],
      timeline: "4-8 weeks"
    }
  ],
  UK: [
    {
      id: 1,
      title: "University Admission",
      description: "Receive unconditional offer from UK university",
      status: "completed",
      documents: ["Offer Letter", "CAS Number"],
      timeline: "Completed"
    },
    {
      id: 2,
      title: "CAS Statement",
      description: "Obtain Confirmation of Acceptance for Studies",
      status: "completed",
      documents: ["CAS Statement"],
      timeline: "Completed"
    },
    {
      id: 3,
      title: "IHS Payment",
      description: "Pay Immigration Health Surcharge",
      status: "current",
      documents: ["IHS Payment Receipt"],
      timeline: "In Progress"
    },
    {
      id: 4,
      title: "Student Visa Application",
      description: "Submit online visa application",
      status: "pending",
      documents: ["Visa Application", "Financial Evidence"],
      timeline: "Pending"
    },
    {
      id: 5,
      title: "Biometrics Appointment",
      description: "Attend biometrics appointment",
      status: "pending",
      documents: [],
      timeline: "Pending"
    },
    {
      id: 6,
      title: "Visa Decision",
      description: "Receive visa decision and BRP collection",
      status: "pending",
      documents: [],
      timeline: "3-6 weeks"
    }
  ]
};

const upcomingAppointments = {
  DE: [
    {
      id: 1,
      type: "Biometrics",
      date: "2024-04-15",
      time: "10:30 AM",
      location: "German Consulate, New York",
      status: "confirmed"
    }
  ],
  UK: [
    {
      id: 2,
      type: "Document Verification",
      date: "2024-04-10", 
      time: "2:00 PM",
      location: "UK Visa Center, Los Angeles",
      status: "pending"
    }
  ]
};

const advisorContacts = {
  DE: {
    name: "Hans Mueller",
    title: "Germany Education Advisor",
    email: "h.mueller@uni360.com",
    phone: "+49 89 1234 5678",
    officeHours: "Mon-Fri, 9:00 AM - 5:00 PM CET"
  },
  UK: {
    name: "Sarah Thompson", 
    title: "UK Education Advisor",
    email: "s.thompson@uni360.com",
    phone: "+44 20 7123 4567",
    officeHours: "Mon-Fri, 9:00 AM - 5:00 PM GMT"
  }
};

export default function Visa() {
  const { selectedCountry } = useOutletContext<ContextType>();
  
  const steps = visaProcessSteps[selectedCountry];
  const appointments = upcomingAppointments[selectedCountry] || [];
  const advisor = advisorContacts[selectedCountry];

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "current":
        return Clock;
      default:
        return AlertTriangle;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "current":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-400 bg-gray-100";
    }
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
    hidden: { x: -20, opacity: 0 },
    show: { x: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="space-y-6 sm:space-y-8 px-4 sm:px-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div 
        className="text-center sm:text-left"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Visa Process</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Track your student visa application for {selectedCountry === "DE" ? "Germany" : "United Kingdom"}
        </p>
      </motion.div>

      {/* Process Timeline */}
      <motion.section
        className="space-y-4 sm:space-y-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-xl sm:text-2xl font-semibold">Visa Process Steps</h2>
        
        <motion.div 
          className="space-y-3 sm:space-y-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {steps.map((step, index) => {
            const StepIcon = getStepIcon(step.status);
            const isLast = index === steps.length - 1;
            
            return (
              <motion.div
                key={step.id}
                variants={item}
                className="relative"
              >
                <Card className={cn(
                  "p-4 sm:p-6 transition-all duration-standard",
                  step.status === "current" ? "ring-2 ring-primary/20 shadow-medium" : "hover:shadow-soft"
                )}>
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Step Icon */}
                    <div className={cn(
                      "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0",
                      getStepColor(step.status)
                    )}>
                      <StepIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-2 mb-3">
                        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                          <h3 className="font-semibold text-base sm:text-lg pr-2">{step.title}</h3>
                          <Badge 
                            variant={step.status === "completed" ? "default" : "outline"} 
                            className="rounded-pill text-xs w-fit"
                          >
                            {step.timeline}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">
                        {step.description}
                      </p>
                      
                      {step.documents.length > 0 && (
                        <div className="space-y-2 mb-4">
                          <span className="text-xs sm:text-sm font-medium">Required Documents:</span>
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {step.documents.map((doc) => (
                              <Badge key={doc} variant="outline" className="text-xs flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                <span className="hidden xs:inline">{doc}</span>
                                <span className="xs:hidden">{doc.split(' ')[0]}</span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {step.status === "current" && (
                        <div className="flex flex-col xs:flex-row gap-2">
                          <Button size="sm" className="rounded-pill text-xs sm:text-sm">
                            <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            <span className="hidden xs:inline">Upload Documents</span>
                            <span className="xs:hidden">Upload</span>
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-pill text-xs sm:text-sm">
                            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            <span className="hidden xs:inline">View Requirements</span>
                            <span className="xs:hidden">View</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Connector Line */}
                {!isLast && (
                  <div className={cn(
                    "absolute left-6 sm:left-9 top-16 sm:top-20 w-0.5 h-4 sm:h-6 transition-colors",
                    step.status === "completed" ? "bg-green-200" : "bg-gray-200"
                  )} />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* Appointments Section */}
      <motion.section
        className="space-y-4 sm:space-y-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-semibold">Upcoming Appointments</h2>
          <Button className="rounded-pill text-xs sm:text-sm w-full xs:w-auto">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Book Appointment
          </Button>
        </div>

        {appointments.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {appointments.map((appointment) => (
              <motion.div
                key={appointment.id}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-base sm:text-lg">{appointment.type} Appointment</h3>
                      <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{appointment.date} at {appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="break-words">{appointment.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col xs:flex-row gap-2">
                      <Badge 
                        variant={appointment.status === "confirmed" ? "default" : "outline"}
                        className="rounded-pill text-xs w-fit"
                      >
                        {appointment.status}
                      </Badge>
                      <Button size="sm" variant="outline" className="rounded-pill text-xs w-full xs:w-auto">
                        Reschedule
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-6 sm:p-8 text-center">
            <Calendar className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">No Appointments Scheduled</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 max-w-md mx-auto">
              You'll need to book appointments for biometrics and document verification.
            </p>
            <Button className="rounded-pill text-xs sm:text-sm w-full xs:w-auto">
              Book Your First Appointment
            </Button>
          </Card>
        )}
      </motion.section>

      {/* Advisor Contact */}
      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="p-4 sm:p-6 bg-gradient-subtle">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Your Education Advisor</h3>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <div className="flex-1 space-y-3">
              <div>
                <span className="font-semibold text-base sm:text-lg block">{advisor.name}</span>
                <p className="text-sm sm:text-base text-muted-foreground">{advisor.title}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <a 
                    href={`mailto:${advisor.email}`}
                    className="text-xs sm:text-sm break-all text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer"
                  >
                    {advisor.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <a 
                    href={`tel:${advisor.phone}`}
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer"
                  >
                    {advisor.phone}
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">{advisor.officeHours}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col xs:flex-row lg:flex-col gap-2 lg:w-48">
              
              <Button variant="outline" className="rounded-pill text-xs sm:text-sm">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Book 1:1 Call
              </Button>
            </div>
          </div>
        </Card>
      </motion.section>
    </motion.div>
  );
}