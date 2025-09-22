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
  ArrowRight
} from "lucide-react";

type Country = "DE" | "UK";

interface ContextType {
  selectedCountry: Country;
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
  const [isChatOpen, setIsChatOpen] = useState(false);
  
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

  const handleGoogleMeetClick = () => {
    window.open(advisor.meetLink, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppClick = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleOpenWhatsAppBusiness = () => {
    window.open('https://wa.me/1234567890?text=Hello!%20I%20need%20help%20with%20my%20visa%20application', '_blank', 'noopener,noreferrer');
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

      {/* Appointments Section */}
      <motion.section
        className="space-y-4 sm:space-y-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold">Upcoming Appointments</h2>
          <Button className="rounded-full text-xs sm:text-sm">
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
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Status Icon */}
                    <div className={cn(
                      "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0",
                      appointment.status === "confirmed" ? "text-green-600 bg-green-100" : "text-blue-600 bg-blue-100"
                    )}>
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>

                    {/* Appointment Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-2 mb-3">
                        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                          <h3 className="font-semibold text-base sm:text-lg pr-2">{appointment.type} Appointment</h3>
                          <Badge 
                            variant={appointment.status === "confirmed" ? "default" : "outline"}
                            className="rounded-full text-xs w-fit"
                          >
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-xs sm:text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{appointment.date} at {appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="break-words">{appointment.location}</span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 mt-2">
                        <Button size="sm" className="rounded-full text-xs">
                          <Calendar className="w-3 h-3 mr-1.5" />
                          Reschedule
                        </Button>
                      </div>
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
            <Button className="rounded-full text-xs sm:text-sm w-full xs:w-auto">
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
        <Card className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
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
            <div className="flex flex-col xs:flex-row lg:flex-col gap-2">
              <Button 
                onClick={handleGoogleMeetClick}
                size="sm"
                className="rounded-full text-xs bg-primary hover:bg-primary/90 transition-all duration-200 w-fit px-3"
              >
                <Headset className="w-3 h-3 mr-1" />
                Book 1:1 Call
              </Button>
            </div>
          </div>
        </Card>
      </motion.section>

      {/* WhatsApp Chat Button - Only show when chat is closed */}
      {!isChatOpen && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleWhatsAppClick}
            className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 p-0 relative"
            title="Chat with us on WhatsApp"
          >
            <svg
              className="w-8 h-8 text-white transform scale-[1.6]"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
            </svg>
          </Button>
        </motion.div>
      )}

      {/* WhatsApp Chat Interface */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-40 w-80 max-w-[calc(100vw-2rem)]"
          >
            {/* Chat Widget */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm font-bold">WhatsApp Support</span>
                    <p className="text-xs opacity-80">Typically replies instantly</p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsChatOpen(false)}
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 p-1 h-8 w-8 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Chat Content */}
              <div className="p-4 bg-gradient-to-b from-green-50 to-white h-64 flex flex-col relative">
                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto mb-4">
                  {/* Chat Bubble */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 shadow-md">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                      </svg>
                    </div>
                    <div className="flex-1 max-w-[220px]">
                      <div className="bg-white rounded-2xl rounded-tl-md p-3 shadow-lg border border-gray-100">
                        <p className="text-gray-800 text-sm font-semibold mb-1">Hello there! 👋</p>
                        <p className="text-gray-600 text-xs leading-relaxed mb-2">I'm here to help you with your visa application process. How can I assist you today?</p>
                        <p className="text-xs text-gray-400">Just now</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Open Chat Button - Fixed at bottom */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleOpenWhatsAppBusiness}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-full px-4 py-2 text-sm flex items-center gap-2 shadow-lg"
                  >
                    Open chat
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}