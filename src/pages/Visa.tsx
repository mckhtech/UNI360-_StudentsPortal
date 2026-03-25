import { useState, useEffect, useCallback } from "react";
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
  AlertTriangle,
  Upload,
  Download,
  ExternalLink,
  Info,
  X,
  CreditCard,
  MapPin,
  RefreshCw,
  Loader2,
  CheckSquare,
  Square,
  TrendingUp,
} from "lucide-react";

import {
  getVisaChecklist,
  getVisaTracker,
  updateVisaTracker,
  getVisaAppointments,
} from "@/services/studentProfile.js";

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

interface ApiAppointment {
  id: string | number;
  type?: string;
  appointmentType?: string;
  date?: string;
  scheduledDate?: string;
  time?: string;
  scheduledTime?: string;
  location?: string;
  venue?: string;
  status?: string;
  country?: string;
  notes?: string;
}


const visaProcessSteps: Record<Country, VisaStep[]> = {
  DE: [
    {
      id: 4,
      title: "Health Insurance",
      description: "Obtain German health insurance coverage",
      status: "current",
      documents: ["Insurance Certificate"],
      timeline: "In Progress",
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
      appointmentDetails: {
        date: "2024-04-15",
        time: "10:30 AM",
        location: "German Consulate General, Mumbai",
      },
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
      appointmentDetails: {
        date: "2024-04-15",
        time: "10:30 AM",
        location: "UK VAC, Mumbai",
      },
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

// ── Helpers ───────────────────────────────────────────────────────────────────

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

const statusColor: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function Visa() {
  const { selectedCountry } = useOutletContext<ContextType>();

  // Process-timeline — computed after derived values are set (see below)

  // ── Checklist state ─────────────────────────────────────────────
  const [checklistItems, setChecklistItems] = useState<string[]>([]);
  const [checklistTitle, setChecklistTitle] = useState<string>("");
  const [checklistLoading, setChecklistLoading] = useState(false);

  // ── Tracker state ───────────────────────────────────────────────
  const [trackerId, setTrackerId] = useState<string | null>(null);
  const [completedItems, setCompletedItems] = useState<number[]>([]);
  const [trackerStatus, setTrackerStatus] = useState<string>("NOT_STARTED");
  const [totalItems, setTotalItems] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [trackerLoading, setTrackerLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ── Appointments state ──────────────────────────────────────────
  const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
  const [apptLoading, setApptLoading] = useState(false);

  // ── API availability flags (null = pending, false = 404, true = live) ──────
  const [checklistApiAvailable, setChecklistApiAvailable] = useState<boolean | null>(null);
  const [trackerApiAvailable, setTrackerApiAvailable]     = useState<boolean | null>(null);
  const [apptApiAvailable, setApptApiAvailable]           = useState<boolean | null>(null);

  // ── Popup ───────────────────────────────────────────────────────
  const [isDemandDraftPopupOpen, setIsDemandDraftPopupOpen] = useState(false);

  // ── Fetch helpers ───────────────────────────────────────────────

  // fetchTracker is the single source of truth:
  // it returns checklistItems + completedItems + progress all at once.
  const fetchTracker = useCallback(async () => {
    setTrackerLoading(true);
    try {
      const res = await getVisaTracker(selectedCountry);
      if (res === null) {
        // API not live yet — stay empty, API-available = false
        setTrackerApiAvailable(false);
        setTrackerId(null);
        setCompletedItems([]);
        setTrackerStatus("NOT_STARTED");
        setTotalItems(0);
        setProgressPercent(0);
        return;
      }
      const data = res?.data ?? res;
      setTrackerApiAvailable(true);
      setTrackerId(data?.trackerId ?? null);
      setCompletedItems(Array.isArray(data?.completedItems) ? data.completedItems : []);
      setTrackerStatus(data?.status ?? "NOT_STARTED");
      setTotalItems(data?.totalItems ?? 0);
      setProgressPercent(data?.progressPercent ?? 0);
      // Checklist items come from tracker (primary source)
      if (Array.isArray(data?.checklistItems)) {
        setChecklistItems(data.checklistItems);
      }
    } catch {
      setTrackerApiAvailable(false);
      setTrackerId(null);
      setCompletedItems([]);
      setTrackerStatus("NOT_STARTED");
      setTotalItems(0);
      setProgressPercent(0);
    } finally {
      setTrackerLoading(false);
    }
  }, [selectedCountry]);

  // fetchChecklist runs in parallel — provides title + overrides items if checklist API has extra data
  const fetchChecklist = useCallback(async () => {
    setChecklistLoading(true);
    try {
      const res = await getVisaChecklist(selectedCountry);
      if (res === null) {
        setChecklistApiAvailable(false);
        return; // items already set (or not) by tracker
      }
      const data = res?.data ?? res;
      setChecklistApiAvailable(true);
      // Title
      if (data?.title) setChecklistTitle(data.title);
      // Override items with checklist API if it returns them
      if (data?.items) {
        const items: string[] =
          typeof data.items === "string" ? JSON.parse(data.items) : data.items;
        if (items.length > 0) setChecklistItems(items);
      }
    } catch {
      setChecklistApiAvailable(false);
    } finally {
      setChecklistLoading(false);
    }
  }, [selectedCountry]);

  const fetchAppointments = useCallback(async () => {
    setApptLoading(true);
    try {
      const res = await getVisaAppointments();
      if (res === null) {
        setApptApiAvailable(false);
        setAppointments([]);
        return;
      }
      const data = res?.data ?? res;
      setApptApiAvailable(true);
      setAppointments(Array.isArray(data) ? data : []);
    } catch {
      setApptApiAvailable(false);
      setAppointments([]);
    } finally {
      setApptLoading(false);
    }
  }, []);

  // Re-fetch when country changes — reset all state first so no stale data flashes
  useEffect(() => {
    // Clear previous country's data
    setChecklistItems([]);
    setChecklistTitle("");
    setCompletedItems([]);
    setTrackerStatus("NOT_STARTED");
    setTotalItems(0);
    setProgressPercent(0);
    setTrackerId(null);
    setAppointments([]);
    setChecklistApiAvailable(null);
    setTrackerApiAvailable(null);
    setApptApiAvailable(null);

    fetchTracker();    // tracker first — it populates checklistItems + progress
    fetchChecklist();  // provides title override if checklist API is live
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry]);

  // ── Toggle item & auto-save ─────────────────────────────────────

  const toggleItem = async (index: number) => {
    const isChecked = completedItems.includes(index);
    const newCompleted = isChecked
      ? completedItems.filter((i) => i !== index)
      : [...completedItems, index];

    const newTotal = checklistItems.length || totalItems;
    const newPercent = newTotal > 0 ? Math.round((newCompleted.length / newTotal) * 100) : 0;
    const newStatus =
      newCompleted.length === 0
        ? "NOT_STARTED"
        : newCompleted.length >= newTotal
        ? "COMPLETED"
        : "IN_PROGRESS";

    // Optimistic update
    setCompletedItems(newCompleted);
    setProgressPercent(newPercent);
    setTrackerStatus(newStatus);

    setSaving(true);
    try {
      await updateVisaTracker({
        country: selectedCountry,
        completed_items: newCompleted,
        status: newStatus,
        notes: "",
      });
      // Re-sync from server — tracker is source of truth
      await fetchTracker();
    } catch {
      // Revert optimistic update on real failure
      setCompletedItems(completedItems);
      setProgressPercent(progressPercent);
      setTrackerStatus(trackerStatus);
    } finally {
      setSaving(false);
    }
  };

  // ── Animation variants ──────────────────────────────────────────

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariant = { hidden: { x: -20, opacity: 0 }, show: { x: 0, opacity: 1 } };

  // ── Handlers ────────────────────────────────────────────────────

  const handleGoogleMeetClick = () => {
    window.open("https://meet.google.com/bqr-dcwn-wka", "_blank", "noopener,noreferrer");
  };

  const handleDemandDraftDownload = () => {
    const link = document.createElement("a");
    link.href = "/files/dd-mumbai-data.pdf";
    link.download = "demand-draft-form.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Derived display values — all from API state
  const displayItems = checklistItems;                          // purely from API
  const displayTotal = totalItems || checklistItems.length;     // tracker.totalItems wins
  const displayCompleted = completedItems.length;
  const displayPercent =
    displayTotal > 0
      ? Math.round((displayCompleted / displayTotal) * 100)
      : progressPercent; // use server value if local total unknown

  const apiLoading = trackerLoading || checklistLoading;
  const apiAvailable = trackerApiAvailable === true || checklistApiAvailable === true;

  // ── displaySteps: driven by checklist when API is live, else static ────────
  // Status logic: completed → completed | first pending → current | rest → pending
  const firstPendingIdx = checklistItems.length > 0
    ? checklistItems.findIndex((_, idx) => !completedItems.includes(idx))
    : -1;

  const displaySteps: VisaStep[] = checklistItems.length > 0
    ? checklistItems.map((item, idx) => {
        const isCompleted = completedItems.includes(idx);
        const isCurrent   = !isCompleted && idx === firstPendingIdx;
        const status      = isCompleted ? "completed" : isCurrent ? "current" : "pending";
        return {
          id: idx,
          title: item,
          description: isCompleted
            ? "This step has been completed."
            : isCurrent
            ? "This is your current step. Mark it complete in the checklist above."
            : "This step is pending completion of previous steps.",
          status,
          documents: [],
          timeline: isCompleted ? "Completed" : isCurrent ? "In Progress" : "Pending",
        };
      })
    : visaProcessSteps[selectedCountry]; // fallback to static when API offline

  // ── Render ───────────────────────────────────────────────────────

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
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Visa Process</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track your student visa application for{" "}
            {selectedCountry === "DE" ? "Germany" : "United Kingdom"}
          </p>
        </div>
      </motion.div>

      {/* ── CHECKLIST & PROGRESS TRACKER ─────────────────────────────── */}
      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold">
            {checklistTitle || `${selectedCountry === "UK" ? "UK" : "Germany"} Student Visa Checklist`}
          </h2>
          <div className="flex items-center gap-2">
            {saving && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Loader2 className="w-3 h-3 animate-spin" /> Saving…
              </span>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => { fetchChecklist(); fetchTracker(); }}
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        {apiLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground text-sm py-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading checklist from server…
          </div>
        ) : !apiAvailable ? (
          /* Both APIs returned 404 — backend not live yet */
          <Card className="p-5 border-dashed text-center">
            <p className="text-sm text-muted-foreground">
              Checklist data is not available yet. It will appear here once your advisor configures it.
            </p>
          </Card>
        ) : (
          <>
            {/* Summary bar */}
            <Card className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Overall Progress</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-full text-xs capitalize",
                      trackerStatus === "COMPLETED"
                        ? "border-green-400 text-green-700 bg-green-50"
                        : trackerStatus === "IN_PROGRESS"
                        ? "border-blue-400 text-blue-700 bg-blue-50"
                        : "border-gray-300 text-gray-500"
                    )}
                  >
                    {trackerStatus.replace(/_/g, " ")}
                  </Badge>
                </div>
                <span className="text-sm font-semibold text-primary">
                  {displayCompleted} / {displayTotal} completed
                </span>
              </div>

              {/* Bar */}
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  className="h-2.5 rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${displayPercent}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
              <p className="text-right text-xs text-muted-foreground mt-1">{displayPercent}%</p>
            </Card>

            {/* Checklist items — 3-column responsive grid */}
            {displayItems.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {displayItems.map((item, idx) => {
                  const checked = completedItems.includes(idx);
                  return (
                    <motion.div key={idx} variants={itemVariant}>
                      <Card
                        className={cn(
                          "p-3 sm:p-4 flex items-start gap-3 cursor-pointer transition-all duration-200 hover:shadow-md h-full",
                          checked && "bg-green-50 border-green-200"
                        )}
                        onClick={() => toggleItem(idx)}
                      >
                        {checked ? (
                          <CheckSquare className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <span
                            className={cn(
                              "text-sm leading-snug block",
                              checked && "line-through text-muted-foreground"
                            )}
                          >
                            {item}
                          </span>
                          {checked && (
                            <Badge className="mt-1.5 rounded-full text-xs bg-green-100 text-green-700 border-0">
                              Done
                            </Badge>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              !apiLoading && (
                <p className="text-sm text-muted-foreground italic">
                  No checklist items returned by the server yet.
                </p>
              )
            )}
          </>
        )}
      </motion.section>

      {/* ── PROCESS TIMELINE ─────────────────────────────────────────────── */}
      <motion.section
        className="space-y-4 sm:space-y-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-semibold">Visa Process Steps</h2>
          {checklistItems.length > 0 && (
            <Badge variant="outline" className="rounded-full text-xs">
              {completedItems.length}/{checklistItems.length} done
            </Badge>
          )}
        </div>

        <motion.div
          className="space-y-3 sm:space-y-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {displaySteps.map((step, index) => {
            const StepIcon = getStepIcon(step.status);
            const isLast = index === displaySteps.length - 1;

            return (
              <motion.div key={step.id} variants={itemVariant} className="relative">
                <Card
                  className={cn(
                    "p-4 sm:p-6 transition-all duration-200",
                    step.status === "current"
                      ? "ring-2 ring-primary/20 shadow-lg"
                      : "hover:shadow-md"
                  )}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0",
                        getStepColor(step.status)
                      )}
                    >
                      <StepIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>

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
                                <span className="xs:hidden">{doc.split(" ")[0]}</span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

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
                              <li key={noteIndex} className="text-xs sm:text-sm text-blue-700 leading-relaxed">
                                • {note}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {step.appointmentDetails && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4">
                          <div className="flex items-start gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-medium text-green-800">
                              Appointment Scheduled:
                            </span>
                          </div>
                          <div className="ml-6 space-y-1">
                            <p className="text-xs sm:text-sm text-green-700">
                              <strong>Date:</strong> {step.appointmentDetails.date} at{" "}
                              {step.appointmentDetails.time}
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

                {!isLast && (
                  <div
                    className={cn(
                      "absolute left-6 sm:left-9 top-16 sm:top-20 w-0.5 h-4 sm:h-6 transition-colors",
                      step.status === "completed" ? "bg-green-200" : "bg-gray-200"
                    )}
                  />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* ── APPOINTMENTS (from API) ───────────────────────────────────── */}
      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold">Embassy Appointments</h2>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={fetchAppointments}
            title="Refresh appointments"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {apptLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading appointments…
          </div>
        ) : apptApiAvailable === false ? (
          <Card className="p-4 text-sm text-muted-foreground italic border-dashed text-center">
            Appointment data is not available yet from the server.
          </Card>
        ) : appointments.length === 0 ? (
          <Card className="p-4 text-sm text-muted-foreground italic border-dashed">
            No embassy appointments scheduled yet.
          </Card>
        ) : (
          <motion.div className="space-y-3" variants={container} initial="hidden" animate="show">
            {appointments.map((appt) => {
              const apptType = appt.type ?? appt.appointmentType ?? "Appointment";
              const apptDate = appt.date ?? appt.scheduledDate ?? "—";
              const apptTime = appt.time ?? appt.scheduledTime ?? "";
              const apptLocation = appt.location ?? appt.venue ?? "—";
              const apptStatus = (appt.status ?? "pending").toLowerCase();

              return (
                <motion.div key={appt.id} variants={itemVariant}>
                  <Card className="p-4 sm:p-5 hover:shadow-md transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm sm:text-base">{apptType}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {apptDate}
                            {apptTime ? ` · ${apptTime}` : ""}
                          </p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {apptLocation}
                          </div>
                          {appt.notes && (
                            <p className="text-xs text-muted-foreground mt-1 italic">{appt.notes}</p>
                          )}
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          "rounded-full text-xs capitalize w-fit",
                          statusColor[apptStatus] ?? "bg-gray-100 text-gray-600"
                        )}
                      >
                        {apptStatus}
                      </Badge>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.section>

      {/* ── GERMANY – Visa Appointment Fee ───────────────────────────── */}
      {selectedCountry === "DE" && (
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
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
                      <strong>Important:</strong> For German Consulate appointments, please carry a
                      demand draft for fees payment in the specified format.
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-12">
                <Button
                  className="rounded-pill"
                  onClick={() =>
                    window.open("https://india.diplo.de/in-en/ueber-uns/mumbai", "_blank")
                  }
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

      {/* ── HELP CARD ─────────────────────────────────────────────────── */}
      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
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
                  Have questions about your visa application, document requirements, or interview
                  preparation? Schedule a video consultation with our visa specialists for
                  personalised guidance.
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