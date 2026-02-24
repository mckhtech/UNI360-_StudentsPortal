import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Headset,
  AlertTriangle,
  Upload,
  Download,
  ExternalLink,
  Info,
  MessageCircle,
  X,
  ArrowRight,
  CreditCard
} from "lucide-react";

type Country = "DE" | "UK";

interface ContextType {
  selectedCountry: Country;
}

interface AppointmentDetails {
  date: string;
  time: string;
  location: string;
}

interface VisaStep {
  id: number;
  title: string;
  description: string;
  status: string;
  documents: string[];
  timeline: string;
  notes?: string[];
  appointmentDetails?: AppointmentDetails;
}

const visaProcessSteps = {
  DE: [
    // {
    //   id: 3,
    //   title: "Blocked Account",
    //   description: "Open blocked account with minimum €11,208",
    //   status: "current",
    //   documents: ["Bank Statement", "Blocked Account Confirmation"],
    //   timeline: "In Progress"
    // },
    {
  id: 4,
  title: "Health Insurance",
  description: "Obtain German health insurance coverage",
  status: "current",
  documents: ["Insurance Certificate"],
  timeline: "In Progress"
},
    {
      id: 5,
      title: "Visa Application",
      description: "Submit complete visa application",
      status: "pending",
      documents: ["Visa Form", "Passport", "Photos"],
      timeline: "Pending",
      notes: [
        "Bring cash for visa application fee payment",
        "If you have a non-German degree, bring your original degree certificate for verification"
      ]
    },
    {
      id: 6,
      title: "Biometrics Appointment",
      description: "Attend biometrics appointment at consulate",
      status: "pending",
      documents: [],
      timeline: "Pending",
      appointmentDetails: {
    date: "2024-04-15",
    time: "10:30 AM",
    location: "German Consulate General, Mumbai"
  }
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
      timeline: "Pending",
      appointmentDetails: {
    date: "2024-04-15",
    time: "10:30 AM",
    location: "German Consulate General, Mumbai"
  }
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
    officeHours: "Mon-Fri, 9:00 AM - 5:00 PM CET",
    meetLink: "https://meet.google.com/abc-defg-hij"
  },
  UK: {
    name: "Sarah Thompson", 
    title: "UK Education Advisor",
    email: "s.thompson@uni360.com",
    phone: "+44 20 7123 4567",
    officeHours: "Mon-Fri, 9:00 AM - 5:00 PM GMT",
    meetLink: "https://meet.google.com/xyz-uvwx-rst"
  }
};

export default function Visa() {
  const { selectedCountry } = useOutletContext<ContextType>();
  
  
  const steps = visaProcessSteps[selectedCountry];
  const appointments = upcomingAppointments[selectedCountry] || [];
  const advisor = advisorContacts[selectedCountry];
  const [isDemandDraftPopupOpen, setIsDemandDraftPopupOpen] = useState(false);

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

  const handleGoogleMeetClick = () => {
  window.open('https://meet.google.com/bqr-dcwn-wka', '_blank', 'noopener,noreferrer');
};
  
const handleDemandDraftDownload = () => {
  const link = document.createElement('a');
  link.href = '/files/dd-mumbai-data.pdf';
  link.download = 'demand-draft-form.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
      {/* Header - No local toggle buttons, controlled by navbar */}
      <motion.div 
        className="text-center sm:text-left"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Visa Process</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track your student visa application for {selectedCountry === "DE" ? "Germany" : "United Kingdom"}
          </p>
        </div>
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
                  "p-4 sm:p-6 transition-all duration-200",
                  step.status === "current" ? "ring-2 ring-primary/20 shadow-lg" : "hover:shadow-md"
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
                            className="rounded-full text-xs w-fit"
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

                      {/* Important Notes Section */}
                      {step.notes && step.notes.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4">
                          <div className="flex items-start gap-2 mb-2">
                            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-medium text-blue-800">Important Notes:</span>
                          </div>
                          <ul className="space-y-1 ml-6">
                            {step.notes.map((note, noteIndex) => (
                              <li key={noteIndex} className="text-xs sm:text-sm text-blue-700 leading-relaxed">
                                • {note}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Appointment Details */}
                      {step.appointmentDetails && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4">
                          <div className="flex items-start gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-medium text-green-800">Appointment Scheduled:</span>
                          </div>
                          <div className="ml-6 space-y-1">
                            <p className="text-xs sm:text-sm text-green-700">
                              <strong>Date:</strong> {step.appointmentDetails.date} at {step.appointmentDetails.time}
                            </p>
                            <p className="text-xs sm:text-sm text-green-700">
                              <strong>Location:</strong> {step.appointmentDetails.location}
                            </p>
                          </div>
                        </div>
                      )}

                      {step.status === "current" && (
                        <div className="flex justify-end gap-2 mt-2">
                          <Button size="sm" className="rounded-full text-xs">
                            <Upload className="w-3 h-3 mr-1.5" />
                            Upload
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-full text-xs">
                            <ExternalLink className="w-3 h-3 mr-1.5" />
                            View Details
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
      {/* Visa Appointment Fee Card - Only for Germany */}
{/* Visa Appointment Fee Card - Only for Germany */}
      {selectedCountry === "DE" && (
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6 border-l-4 border-orange-200 bg-orange-50">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Visa Appointment Fee</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Due: 2024-04-20
                  </div>
                  <div className="text-xl font-bold text-primary">€80</div>
                </div>
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                      <strong>Important:</strong> For German Consulate appointments, please carry a demand draft for fees payment in the specified format.
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-12">
                <Button 
  className="rounded-pill"
  onClick={() => window.open('https://india.diplo.de/in-en/ueber-uns/mumbai', '_blank')}
>
  <CreditCard className="w-4 h-4 mr-2" />
  Pay Now
</Button>
                <Button 
                  variant="outline"
                  className="rounded-pill"
                  onClick={handleDemandDraftDownload}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Demand Draft Form
                </Button>
              </div>
            </div>
          </Card>
        </motion.section>
      )}
      
      


      {/* Google Meet Help Section */}
<motion.section
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.5, delay: 0.6 }}
>
  <Card className="p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-100">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-start gap-3 flex-1">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-base sm:text-lg mb-2">Need Visa Assistance?</h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Have questions about your visa application, document requirements, or interview preparation? 
            Schedule a video consultation with our visa specialists for personalized guidance.
          </p>
        </div>
      </div>
      
      <Button 
        size="sm"
        className="bg-green-500 hover:bg-green-600 text-white rounded-full text-xs w-fit"
        onClick={handleGoogleMeetClick}
      >
        <Phone className="w-3 h-3 mr-1.5" />
        Join Video Call Now
      </Button>
    </div>
  </Card>
</motion.section>
      
    </motion.div>
  );
}