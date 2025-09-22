import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Plus,
  Clock,
  Mail,
  CheckCircle,
  AlertCircle,
  XCircle,
  Circle,
  Loader2,
  Building2,
  MapPin,
  Send,
  X,
  CreditCard,
  Shield
} from "lucide-react";

import { getApplications, submitApplication, createApplication } from "../services/auth.js";
import { universityAPI, courseAPI } from "../services/api.js";

/* ---------------- helpers ---------------- */

type CountryTab = "DE" | "UK";

// Normalize backend country values to one of our two API values
const normalizeApiCountry = (val?: string) => {
  const s = (val || "").toLowerCase().replace(/\s+/g, "_");
  if (["de", "ger", "germany"].includes(s)) return "germany";
  if (["uk", "gb", "united_kingdom", "unitedkingdom", "great_britain"].includes(s))
    return "united_kingdom";
  // best effort: if it looks like "germanâ€¦" pick germany, else UK
  if (s.includes("german")) return "germany";
  if (s.includes("kingdom") || s.includes("brit")) return "united_kingdom";
  return ""; // unknown
};

const toTabCountry = (apiCountry?: string): CountryTab =>
  normalizeApiCountry(apiCountry) === "germany" ? "DE" : "UK";

const toApiCountryFromTab = (tab: CountryTab) =>
  tab === "DE" ? "germany" : "united_kingdom";

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ComponentType<any> }
> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-800", icon: Circle },
  submitted: { label: "Submitted", color: "bg-blue-100 text-blue-800", icon: Clock },
  offer: { label: "Offer Received", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle },
  waitlist: { label: "Waitlisted", color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
};

const getProgress = (status?: string) => {
  const s = (status || "draft").toLowerCase();
  if (s === "submitted") return 66;
  if (s === "offer" || s === "rejected" || s === "waitlist") return 100;
  return 33; // draft
};

/* ---------------- Payment modal ---------------- */

const PaymentModal = ({
  isOpen,
  onClose,
  applicationData,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  applicationData?: { universityName: string; courseName: string };
  onSuccess: () => void;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<"confirm" | "processing" | "success">("confirm");

  const handlePayment = async () => {
    setIsProcessing(true);
    setStep("processing");
    setTimeout(() => {
      setStep("success");
      setTimeout(onSuccess, 1200);
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {step === "confirm" && (
          <>
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Payment Required</h2>
                    <p className="text-gray-600 text-sm">
                      Submit application to{" "}
                      <span className="font-medium">{applicationData?.universityName}</span> (
                      {applicationData?.courseName})
                    </p>
                  </div>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Application Fee</span>
                    <span className="font-semibold">₹2,550</span>
                  </div>
                  <p className="text-xs text-gray-500">Includes processing & service charges</p>
                </div>

                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <Shield className="w-4 h-4 mt-0.5" />
                  <div className="text-xs text-blue-700">
                    <p className="font-medium mb-1">Secure Payment</p>
                    <p>Your payment information is encrypted (demo flow).</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 font-medium"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  disabled={isProcessing}
                >
                  Pay ₹2,550
                </button>
              </div>
            </div>
          </>
        )}

        {step === "processing" && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
            <p className="text-gray-600">Please wait…</p>
          </div>
        )}

        {step === "success" && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Payment Successful</h3>
            <p className="text-gray-600">Your application has been submitted.</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------------- main page ---------------- */

export default function Applications() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedCountry, setSelectedCountry] = useState<CountryTab>("DE");
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState<{
    applicationId: string;
    universityName: string;
    courseName: string;
  } | null>(null);

  // Use ref to track if we've already processed the navigation state
  const hasProcessedNavState = useRef(false);

  // Load apps on mount / when tab changes
  useEffect(() => {
    loadApplications();
  }, [selectedCountry]);

  // Handle navigation state only once
  useEffect(() => {
    const state: any = location.state;
    if (!state || hasProcessedNavState.current) return;

    // Mark as processed immediately to prevent duplicate runs
    hasProcessedNavState.current = true;

    (async () => {
      try {
        const tab = toTabCountry(state.country || state.university?.country);
        if (tab) setSelectedCountry(tab);

        if (state.university && state.course) {
          const apiCountry =
            state.country ||
            normalizeApiCountry(state.university?.country) ||
            toApiCountryFromTab(tab || "DE");

          await createApplication({
            university: state.university.id,
            course: state.course.id,
            country: apiCountry,
          });

          await loadApplications();
        }
      } catch (e: any) {
        console.error("Auto-create application failed:", e);
        setError(e?.message || "Failed to create application");
      }
    })();
  }, []); // Empty dependency array - only run once

  const loadApplications = async () => {
    setLoading(true);
    setError("");

    try {
      const apps = await getApplications();

      const want = toApiCountryFromTab(selectedCountry);
      const filtered = (Array.isArray(apps) ? apps : []).filter((a: any) => {
        const norm = normalizeApiCountry(a?.country);
        return !norm || norm === want; // show if unknown OR matches selected tab
      });

      const enriched = await Promise.all(
        filtered.map(async (app: any) => {
          const [universityData, courseData] = await Promise.all([
            universityAPI.getUniversityById(app.university),
            courseAPI.getCourseById(app.course),
          ]);

          return {
            ...app,
            universityData,
            courseData,
            adminName: "Admissions Office",
            adminEmail: "admissions@example.edu",
            deadline: courseData?.deadline ?? "TBA",
            logo: "🏛️",
          };
        })
      );

      setApplications(enriched);
    } catch (err) {
      console.error("Error loading applications:", err);
      setError("Failed to load applications. Please check your connection or login.");
    } finally {
      setLoading(false);
    }
  };

  /* ------------ actions ------------ */

  const handleSubmitApplication = async (applicationId: string) => {
    const application = applications.find((a) => a.id === applicationId);
    if (!application) return;

    setPendingSubmission({
      applicationId,
      universityName: application.universityData?.name ?? "University",
      courseName: application.courseData?.name ?? "Course",
    });
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    if (!pendingSubmission) return;

    try {
      await submitApplication(pendingSubmission.applicationId);
      await loadApplications();
    } catch (err) {
      console.error("Error submitting application:", err);
    }

    setPendingSubmission(null);
    setShowPaymentModal(false);
    navigate("/universities");
  };

  const handleNewApplication = () => {
    navigate("/universities");
  };

  /* ------------ UI states ------------ */

  if (loading) {
    return (
      <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#E08D3C]" />
          <span className="ml-2 text-gray-600">Loading your applications.</span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="font-bold text-xl text-[#2C3539] mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadApplications}
            className="bg-[#E08D3C] hover:bg-[#c77a32] text-white font-bold px-6 py-3 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } };

  return (
    <>
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        applicationData={
          pendingSubmission
            ? { universityName: pendingSubmission.universityName, courseName: pendingSubmission.courseName }
            : undefined
        }
        onSuccess={handlePaymentSuccess}
      />

      <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">Applications</h1>
            </div>
            <p className="text-muted-foreground">
              Track and manage your university applications for{" "}
              {selectedCountry === "DE" ? "Germany" : "United Kingdom"}
            </p>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <button
              className="bg-[#E08D3C] hover:bg-[#c77a32] text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              onClick={handleNewApplication}
            >
              <Plus className="w-4 h-4" />
              New Application
            </button>
          </motion.div>
        </motion.div>

        {/* Applications List */}
        <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
          {applications.length > 0 ? (
            applications.map((application) => {
              const key = (application.status || "draft").toLowerCase();
              const conf = statusConfig[key] || statusConfig["draft"];
              const IconComp = conf.icon;
              const progress = getProgress(key);

              return (
                <motion.div key={application.id} variants={item} whileHover={{ y: -2, scale: 1.01 }}>
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* University Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#C4DFF0] to-[#E08D3C] rounded-xl flex items-center justify-center text-white text-xl">
                          {"🏛️"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1">{application.universityData?.name}</h3>
                          <p className="text-muted-foreground mb-2">{application.courseData?.name}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {application.universityData?.city}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Due: {application.deadline}
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {application.adminEmail}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${conf.color}`}>
                          <div className="inline-flex items-center gap-1">
                            <IconComp className="w-3 h-3" />
                            {conf.label}
                          </div>
                        </span>

                        {key === "draft" && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSubmitApplication(application.id)}
                              className="px-4 py-2 bg-[#2C3539] text-white rounded-lg hover:bg-[#1e2529] text-sm font-medium flex items-center gap-2"
                            >
                              <Send className="w-4 h-4" />
                              Submit
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-4">
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-[#E08D3C] h-2 rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Draft</span>
                        <span>Submitted</span>
                        <span>Decision</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="border border-dashed rounded-lg p-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Building2 className="w-6 h-6 text-gray-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">No applications yet</h3>
              <p className="text-sm text-gray-600 mb-4">Start by browsing universities and choosing a course.</p>
              <button
                onClick={handleNewApplication}
                className="px-4 py-2 bg-[#E08D3C] text-white rounded-lg hover:bg-[#c77a32] text-sm font-medium"
              >
                Find Universities
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}