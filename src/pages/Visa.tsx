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
  ExternalLink,
  Info,
  CalendarDays,
  MapPinIcon,
  Building2,
  Wifi,
  WifiOff,
  RefreshCw,
} from "lucide-react";

type Country = "DE" | "UK";

interface ContextType {
  selectedCountry: Country;
}

const visaProcessSteps = {
  DE: [
    {
      id: 5,
      title: "Visa Application",
      description: "Submit complete visa application",
      status: "pending",
      documents: ["Visa Form", "Passport", "Photos"],
      timeline: "Pending",
      notes: [
        "Bring cash for visa application fee payment",
        "If you have a non-German degree, bring your original degree certificate for verification",
      ],
    },
    {
      id: 6,
      title: "Biometrics Appointment",
      description: "Attend biometrics appointment at consulate",
      status: "pending",
      documents: [],
      timeline: "Pending",
    },
    {
      id: 7,
      title: "Visa Decision",
      description: "Receive visa decision and passport",
      status: "pending",
      documents: [],
      timeline: "4-8 weeks",
    },
  ],
  UK: [
    {
      id: 2,
      title: "CAS Statement",
      description: "Obtain Confirmation of Acceptance for Studies",
      status: "completed",
      documents: ["CAS Statement"],
      timeline: "Completed",
    },
    {
      id: 3,
      title: "IHS Payment",
      description: "Pay Immigration Health Surcharge",
      status: "current",
      documents: ["IHS Payment Receipt"],
      timeline: "In Progress",
    },
    {
      id: 4,
      title: "Student Visa Application",
      description: "Submit online visa application",
      status: "pending",
      documents: ["Visa Application", "Financial Evidence"],
      timeline: "Pending",
    },
    {
      id: 5,
      title: "Biometrics Appointment",
      description: "Attend biometrics appointment",
      status: "pending",
      documents: [],
      timeline: "Pending",
    },
    {
      id: 6,
      title: "Visa Decision",
      description: "Receive visa decision and BRP collection",
      status: "pending",
      documents: [],
      timeline: "3-6 weeks",
    },
  ],
};

// VFS Global centers for appointment booking
const vfsCenters = {
  DE: [
    {
      id: 1,
      name: "VFS Global - New Delhi",
      address: "A-1, Sector 25, Noida, Uttar Pradesh 201301",
      phone: "+91-120-4135100",
      availability: "Mon-Fri: 8:00 AM - 4:00 PM",
      distance: "12 km from city center",
    },
    {
      id: 2,
      name: "VFS Global - Mumbai",
      address: "Ground Floor, Time Tower, MG Road, Mumbai 400001",
      phone: "+91-22-6704-2000",
      availability: "Mon-Fri: 8:30 AM - 4:30 PM",
      distance: "8 km from city center",
    },
  ],
  UK: [
    {
      id: 1,
      name: "VFS Global - Ahmedabad",
      address: "3rd Floor, Shivalik Plaza, 132 Feet Ring Road, Naranpura",
      phone: "+91-79-4040-1600",
      availability: "Mon-Fri: 8:00 AM - 3:30 PM",
      distance: "5 km from city center",
    },
    {
      id: 2,
      name: "VFS Global - New Delhi",
      address: "A-1, Sector 25, Noida, Uttar Pradesh 201301",
      phone: "+91-120-4135100",
      availability: "Mon-Fri: 8:00 AM - 4:00 PM",
      distance: "15 km from city center",
    },
  ],
};

const upcomingAppointments = {
  DE: [
    {
      id: 1,
      type: "Biometrics",
      date: "2024-04-15",
      time: "10:30 AM",
      location: "German Consulate, New York",
      status: "confirmed",
      reference: "VFS-DE-789123",
    },
  ],
  UK: [
    {
      id: 2,
      type: "Document Verification",
      date: "2024-04-10",
      time: "2:00 PM",
      location: "UK Visa Center, Los Angeles",
      status: "pending",
      reference: "VFS-UK-456789",
    },
  ],
};

// Dummy upcoming appointments for when API is not connected
const dummyUpcomingAppointments = {
  DE: [
    {
      id: 1,
      type: "Biometrics Collection",
      date: "2025-09-15",
      time: "11:00 AM",
      location: "VFS Global - New Delhi",
      status: "confirmed",
      reference: "VFS-DE-2025091501",
      address: "A-1, Sector 25, Noida, Uttar Pradesh 201301",
    },
    {
      id: 2,
      type: "Document Review",
      date: "2025-09-20",
      time: "2:30 PM",
      location: "German Consulate - Delhi",
      status: "pending",
      reference: "GER-DOC-789456",
      address: "No. 6/50G, Shantipath, Chanakyapuri, New Delhi",
    },
  ],
  UK: [
    {
      id: 1,
      type: "Biometrics Collection",
      date: "2025-09-12",
      time: "9:30 AM",
      location: "VFS Global - Ahmedabad",
      status: "confirmed",
      reference: "VFS-UK-2025091201",
      address: "3rd Floor, Shivalik Plaza, 132 Feet Ring Road, Naranpura",
    },
  ],
};

const advisorContacts = {
  DE: {
    name: "Hans Mueller",
    title: "Germany Education Advisor",
    email: "h.mueller@uni360.com",
    phone: "+49 89 1234 5678",
    officeHours: "Mon-Fri, 9:00 AM - 5:00 PM CET",
  },
  UK: {
    name: "Sarah Thompson",
    title: "UK Education Advisor",
    email: "s.thompson@uni360.com",
    phone: "+44 20 7123 4567",
    officeHours: "Mon-Fri, 9:00 AM - 5:00 PM GMT",
  },
};

export default function Visa() {
  const { selectedCountry } = useOutletContext<ContextType>();
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [selectedVfsCenter, setSelectedVfsCenter] = useState<number | null>(
    null
  );
  const [isBookingVfs, setIsBookingVfs] = useState(false);

  const steps = visaProcessSteps[selectedCountry];
  const centers = vfsCenters[selectedCountry];
  const advisor = advisorContacts[selectedCountry];

  // Use dummy data when API is not connected
  const appointments = isApiConnected
    ? upcomingAppointments[selectedCountry] || []
    : dummyUpcomingAppointments[selectedCountry] || [];

  const handleVfsBooking = () => {
    setIsBookingVfs(true);
    // Simulate booking process
    setTimeout(() => {
      setIsBookingVfs(false);
      // Here you would integrate with actual VFS API
      alert(
        `Booking request sent for ${centers[selectedVfsCenter || 0]?.name}`
      );
    }, 2000);
  };

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

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-400 bg-gray-100";
    }
  };

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
    hidden: { x: -20, opacity: 0 },
    show: { x: 0, opacity: 1 },
  };

  return (
    <motion.div
      className="space-y-6 sm:space-y-8 px-4 sm:px-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}>
      {/* Header */}
      <motion.div
        className="text-center sm:text-left"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Visa Process
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Track your student visa application for{" "}
              {selectedCountry === "DE" ? "Germany" : "United Kingdom"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isApiConnected ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs">
                <Wifi className="w-3 h-3" />
                Live Updates
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-xs">
                <WifiOff className="w-3 h-3" />
                Demo Mode
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* VFS Appointment Booking Card */}
      <motion.section
        className="space-y-4 sm:space-y-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}>
        <h2 className="text-xl sm:text-2xl font-semibold">
          VFS Global Appointment Booking
        </h2>

        <Card className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start gap-3 sm:gap-4 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-blue-900 mb-1">
                Book VFS Global Appointment
              </h3>
              <p className="text-sm sm:text-base text-blue-700">
                Schedule your visa application submission and biometrics
                collection
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:gap-4">
              {centers.map((center, index) => (
                <motion.div
                  key={center.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={cn(
                    "p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                    selectedVfsCenter === index
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-25"
                  )}
                  onClick={() => setSelectedVfsCenter(index)}>
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1",
                        selectedVfsCenter === index
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      )}>
                      {selectedVfsCenter === index && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">
                        {center.name}
                      </h4>
                      <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-start gap-1">
                          <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span className="break-words">{center.address}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{center.phone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{center.availability}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-green-600">
                          <MapPinIcon className="w-3 h-3" />
                          <span>{center.distance}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-row pt-4 items-center gap-3">
              <Button
                className="rounded-pill text-white px-6"
                style={{ backgroundColor: "#e28746" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#d67a3a")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e28746")
                }
                disabled={selectedVfsCenter === null || isBookingVfs}
                onClick={handleVfsBooking}>
                {isBookingVfs ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <CalendarDays className="w-4 h-4 mr-2" />
                    Book Appointment
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="rounded-pill px-6 border-slate-600 text-slate-700 hover:bg-slate-600 hover:text-white">
                <ExternalLink className="w-4 h-4 mr-2" />
                VFS Website
              </Button>
            </div>

            <div className="bg-blue-100 border border-blue-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs sm:text-sm text-blue-800">
                  <span className="font-medium">Booking Requirements:</span>
                  <ul className="mt-1 space-y-0.5 ml-4">
                    <li>• Valid passport</li>
                    <li>• Completed visa application form</li>
                    <li>• University admission letter</li>
                    <li>• Appointment fees: ₹2,500-₹3,500</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.section>

      {/* Process Timeline */}
      <motion.section
        className="space-y-4 sm:space-y-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}>
        <h2 className="text-xl sm:text-2xl font-semibold">
          Visa Process Steps
        </h2>

        <motion.div
          className="space-y-3 sm:space-y-4"
          variants={container}
          initial="hidden"
          animate="show">
          {steps.map((step, index) => {
            const StepIcon = getStepIcon(step.status);
            const isLast = index === steps.length - 1;

            return (
              <motion.div key={step.id} variants={item} className="relative">
                <Card
                  className={cn(
                    "p-4 sm:p-6 transition-all duration-standard",
                    step.status === "current"
                      ? "ring-2 ring-primary/20 shadow-medium"
                      : "hover:shadow-soft"
                  )}>
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Step Icon */}
                    <div
                      className={cn(
                        "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0",
                        getStepColor(step.status)
                      )}>
                      <StepIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-2 mb-3">
                        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                          <h3 className="font-semibold text-base sm:text-lg pr-2">
                            {step.title}
                          </h3>
                          <Badge
                            variant={
                              step.status === "completed"
                                ? "default"
                                : "outline"
                            }
                            className="rounded-pill text-xs w-fit">
                            {step.timeline}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">
                        {step.description}
                      </p>

                      {step.documents.length > 0 && (
                        <div className="space-y-2 mb-4">
                          <span className="text-xs sm:text-sm font-medium">
                            Required Documents:
                          </span>
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {step.documents.map((doc) => (
                              <Badge
                                key={doc}
                                variant="outline"
                                className="text-xs flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                <span className="hidden xs:inline">{doc}</span>
                                <span className="xs:hidden">
                                  {doc.split(" ")[0]}
                                </span>
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
                            <span className="text-xs sm:text-sm font-medium text-blue-800">
                              Important Notes:
                            </span>
                          </div>
                          <ul className="space-y-1 ml-6">
                            {step.notes.map((note, noteIndex) => (
                              <li
                                key={noteIndex}
                                className="text-xs sm:text-sm text-blue-700 leading-relaxed">
                                • {note}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {step.status === "current" && (
                        <div className="flex justify-end gap-2 mt-2">
                          <Button size="sm" className="rounded-pill text-xs">
                            <Upload className="w-3 h-3 mr-1.5" />
                            Upload
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-pill text-xs">
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
                  <div
                    className={cn(
                      "absolute left-6 sm:left-9 top-16 sm:top-20 w-0.5 h-4 sm:h-6 transition-colors",
                      step.status === "completed"
                        ? "bg-green-200"
                        : "bg-gray-200"
                    )}
                  />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* Upcoming Appointments Section - Enhanced */}
      <motion.section
        className="space-y-4 sm:space-y-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}>
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-semibold">
              Upcoming Appointments
            </h2>
            {!isApiConnected && (
              <Button
                size="sm"
                variant="ghost"
                className="rounded-pill text-xs"
                onClick={() => setIsApiConnected(!isApiConnected)}>
                <RefreshCw className="w-3 h-3 mr-1" />
                Refresh
              </Button>
            )}
          </div>
          <Button className="rounded-pill text-xs sm:text-sm w-full xs:w-auto">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Schedule New
          </Button>
        </div>

        {appointments.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {appointments.map((appointment) => (
              <motion.div
                key={appointment.id}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}>
                <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Status Icon */}
                    <div
                      className={cn(
                        "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0",
                        getAppointmentStatusColor(appointment.status)
                      )}>
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>

                    {/* Appointment Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-2 mb-3">
                        <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-base sm:text-lg pr-2 mb-1">
                              {appointment.type} Appointment
                            </h3>
                            <div className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded w-fit">
                              Ref: {appointment.reference}
                            </div>
                          </div>
                          <Badge
                            variant={
                              appointment.status === "confirmed"
                                ? "default"
                                : "outline"
                            }
                            className={cn(
                              "rounded-pill text-xs w-fit",
                              appointment.status === "confirmed"
                                ? "bg-green-600"
                                : ""
                            )}>
                            {appointment.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center gap-1 font-medium">
                            <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                            <span>
                              {appointment.date} at {appointment.time}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start gap-1 text-xs sm:text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                          <div>
                            <div className="font-medium">
                              {appointment.location}
                            </div>
                            {appointment.address && (
                              <div className="text-xs text-gray-500 mt-0.5">
                                {appointment.address}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {appointment.status === "confirmed" && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div className="text-xs sm:text-sm text-green-800">
                              <span className="font-medium">Confirmed!</span>{" "}
                              Please arrive 15 minutes early with all required
                              documents.
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap justify-end gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-pill text-xs">
                          <Download className="w-3 h-3 mr-1.5" />
                          Download Pass
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-pill text-xs">
                          <Calendar className="w-3 h-3 mr-1.5" />
                          Reschedule
                        </Button>
                        <Button size="sm" className="rounded-pill text-xs">
                          <MapPin className="w-3 h-3 mr-1.5" />
                          Get Directions
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
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              No Appointments Scheduled
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 max-w-md mx-auto">
              You'll need to book appointments for biometrics and document
              verification.
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
        transition={{ duration: 0.5, delay: 0.5 }}>
        <Card className="p-4 sm:p-6 bg-gradient-subtle">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">
            Your Education Advisor
          </h3>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <div className="flex-1 space-y-3">
              <div>
                <span className="font-semibold text-base sm:text-lg block">
                  {advisor.name}
                </span>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {advisor.title}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <a
                    href={`mailto:${advisor.email}`}
                    className="text-xs sm:text-sm break-all text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer">
                    {advisor.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <a
                    href={`tel:${advisor.phone}`}
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer">
                    {advisor.phone}
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">
                    {advisor.officeHours}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col xs:flex-row lg:flex-col gap-2 lg:w-48">
              <Button
                variant="outline"
                className="rounded-pill text-xs sm:text-sm">
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
