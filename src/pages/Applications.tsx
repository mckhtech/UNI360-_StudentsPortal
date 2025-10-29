import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Circle,
  Loader2,
  Building2,
  MapPin,
  Mail,
  Calendar,
  FileText,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Eye,
  Edit,
  Send,
  Download,
  ChevronRight,
  Package,
  AlertTriangle,
} from "lucide-react";

import { 
  getStudentApplications, 
  getApplicationById,
  updateApplication,
  submitApplication,
  getApplicationProgress 
} from "../services/studentProfile";
import { universityAPI } from "../services/api";

type CountryTab = "DE" | "UK" | "ALL";

const normalizeApiCountry = (val?: string) => {
  const s = (val || "").toLowerCase().replace(/\s+/g, "_");
  if (["de", "ger", "germany"].includes(s)) return "germany";
  if (["uk", "gb", "united_kingdom", "unitedkingdom", "great_britain"].includes(s))
    return "united_kingdom";
  if (s.includes("german")) return "germany";
  if (s.includes("kingdom") || s.includes("brit")) return "united_kingdom";
  return "";
};

const toTabCountry = (apiCountry?: string): CountryTab => {
  const normalized = normalizeApiCountry(apiCountry);
  if (normalized === "germany") return "DE";
  if (normalized === "united_kingdom") return "UK";
  return "ALL";
};

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ComponentType<any> }
> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-800", icon: Circle },
  submitted: { label: "Submitted", color: "bg-blue-100 text-blue-800", icon: Clock },
  in_workflow: { label: "In Progress", color: "bg-blue-100 text-blue-800", icon: Clock },
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  under_review: { label: "Under Review", color: "bg-purple-100 text-purple-800", icon: AlertCircle },
  offer: { label: "Offer Received", color: "bg-green-100 text-green-800", icon: CheckCircle },
  accepted: { label: "Accepted", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle },
  waitlist: { label: "Waitlisted", color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
  withdrawn: { label: "Withdrawn", color: "bg-gray-100 text-gray-800", icon: XCircle },
  claim_pending: { label: "Claim Pending", color: "bg-orange-100 text-orange-800", icon: AlertCircle },
};

const getProgress = (status?: string, completionPercentage?: number) => {
  if (completionPercentage !== undefined && completionPercentage !== null) {
    return completionPercentage;
  }
  
  const s = (status || "draft").toLowerCase();
  if (s === "submitted" || s === "in_workflow" || s === "claim_pending") return 66;
  if (s === "offer" || s === "rejected" || s === "waitlist" || s === "accepted") return 100;
  return 33;
};

// Application Details Modal Component
const ApplicationDetailsModal = ({ application, isOpen, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && application) {
      loadProgress();
    }
  }, [isOpen, application]);

  const loadProgress = async () => {
    try {
      setLoading(true);
      setError("");
      const progressData = await getApplicationProgress(application.id);
      console.log('Application progress:', progressData);
      setProgress(progressData?.data || progressData);
    } catch (err) {
      console.error('Error loading progress:', err);
      setError('Failed to load application progress');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#C4DFF0] to-[#E08D3C]">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-white bg-opacity-20 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{application.universityName}</h2>
                <p className="text-white text-opacity-90">{application.programName}</p>
                <p className="text-sm text-white text-opacity-80 mt-1">
                  Reference: {application.referenceNumber}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#E08D3C]" />
              <span className="ml-2 text-gray-600">Loading details...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-gray-600">{error}</p>
            </div>
          ) : (
            <>
              {/* Application Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Status</label>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const key = (application.status || "draft").toLowerCase();
                      const conf = statusConfig[key] || statusConfig["draft"];
                      const IconComp = conf.icon;
                      return (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${conf.color}`}>
                          <div className="inline-flex items-center gap-1">
                            <IconComp className="w-4 h-4" />
                            {conf.label}
                          </div>
                        </span>
                      );
                    })()}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Intake</label>
                  <p className="text-gray-900">{application.intakeTerm || 'Not specified'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Submitted Date</label>
                  <p className="text-gray-900">
                    {application.submittedAt 
                      ? new Date(application.submittedAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : 'Not submitted yet'}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Deadline</label>
                  <p className="text-gray-900">{application.deadline || 'TBA'}</p>
                </div>
              </div>

              {/* Progress Section */}
              {progress && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#2C3539] flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#E08D3C]" />
                    Application Progress
                  </h3>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 font-medium">Overall Completion</span>
                      <span className="text-[#E08D3C] font-bold">
                        {progress.completionPercentage || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-[#E08D3C] to-[#C4DFF0] h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${progress.completionPercentage || 0}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      {progress.stepsCompleted || 0} of {progress.totalSteps || 0} steps completed
                    </p>
                  </div>

                  {/* Document Progress */}
                  {progress.documentProgress && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Document Status
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-blue-700">Academic Documents:</span>
                          <p className="font-medium text-blue-900">
                            {progress.documentProgress.academicDocuments || 'Not Submitted'}
                          </p>
                        </div>
                        <div>
                          <span className="text-blue-700">English Proficiency:</span>
                          <p className="font-medium text-blue-900">
                            {progress.documentProgress.englishProficiency || 'Not Submitted'}
                          </p>
                        </div>
                        <div>
                          <span className="text-blue-700">Financial Documents:</span>
                          <p className="font-medium text-blue-900">
                            {progress.documentProgress.financialDocuments || 'Not Submitted'}
                          </p>
                        </div>
                        <div>
                          <span className="text-blue-700">Personal Documents:</span>
                          <p className="font-medium text-blue-900">
                            {progress.documentProgress.personalDocuments || 'Not Submitted'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stage Progress */}
                  {progress.stageProgress && progress.stageProgress.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Workflow Stages</h4>
                      {progress.stageProgress.map((stage, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                stage.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                stage.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {index + 1}
                              </span>
                              <div>
                                <h5 className="font-semibold text-gray-900">{stage.stageName}</h5>
                                <p className="text-xs text-gray-600">{stage.stageInstructions}</p>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              stage.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                              stage.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {stage.status?.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Tasks: {stage.completedTasks || 0} / {stage.totalTasks || 0} completed
                          </div>
                          {stage.startedAt && (
                            <div className="text-xs text-gray-500 mt-1">
                              Started: {new Date(stage.startedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Required Alert */}
                  {progress.requiresStudentAction && (
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-yellow-900 mb-1">Action Required</h4>
                          <p className="text-sm text-yellow-700">
                            Your attention is needed to proceed with this application.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* University Contact Info */}
              {application.adminEmail && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${application.adminEmail}`} className="text-[#E08D3C] hover:underline">
                      {application.adminEmail}
                    </a>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            Close
          </button>
          <div className="flex gap-2">
            <button
              onClick={loadProgress}
              className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            {application.status?.toLowerCase() === 'draft' && (
              <button
                onClick={() => {
                  onClose();
                  // Navigate to edit
                }}
                className="px-6 py-2 bg-[#E08D3C] text-white rounded-lg hover:bg-[#c77a32] transition-colors flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Continue Application
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Applications() {
  const navigate = useNavigate();

  const [selectedCountry, setSelectedCountry] = useState<CountryTab>("ALL");
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  // Auto-refresh every 30 seconds to catch new applications
  useEffect(() => {
    const interval = setInterval(() => {
      loadApplications(true);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadApplications = async (silent = false) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    setError("");

    try {
      console.log('=== FETCHING APPLICATIONS FROM API ===');
      const response = await getStudentApplications();
      console.log('Raw applications response:', response);
      
      let apps = [];
      
      // Handle different response structures
      if (response?.data?.applications) {
        apps = response.data.applications;
      } else if (Array.isArray(response?.data)) {
        apps = response.data;
      } else if (Array.isArray(response)) {
        apps = response;
      } else if (response?.applications) {
        apps = response.applications;
      }

      console.log('Parsed applications:', apps);
      console.log('Total applications found:', apps.length);

      // Enrich applications with university data
      const enriched = await Promise.all(
        apps.map(async (app: any) => {
          const universityId = app.targetUniversityId || app.target_university_id || app.university;
          
          console.log(`Enriching application ${app.id}:`, { universityId });
          
          try {
            const universityData = universityId 
              ? await universityAPI.getUniversityById(universityId).catch(err => {
                  console.warn('Failed to fetch university:', err);
                  return null;
                }) 
              : null;

            // Format intake term
            let formattedIntake = app.intakeTerm || '';
            if (formattedIntake) {
              const parts = formattedIntake.split('_');
              if (parts.length === 2) {
                formattedIntake = `${parts[0].charAt(0) + parts[0].slice(1).toLowerCase()} ${parts[1]}`;
              }
            }

            // Format deadline
            let formattedDeadline = "TBA";
            if (app.workflowProgress?.estimatedCompletion) {
              try {
                const date = new Date(app.workflowProgress.estimatedCompletion);
                formattedDeadline = date.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                });
              } catch (e) {
                console.warn('Error parsing deadline:', e);
              }
            } else if (app.deadline) {
              try {
                const date = new Date(app.deadline);
                formattedDeadline = date.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                });
              } catch (e) {
                console.warn('Error parsing deadline:', e);
              }
            }

            return {
              ...app,
              id: app.id,
              universityName: app.universityName || universityData?.name || "University",
              programName: app.programName || app.targetCourseName || "Program",
              intakeTerm: formattedIntake,
              status: (app.status || 'DRAFT').toLowerCase(),
              completionPercentage: app.completionPercentage || app.completion_percentage || 0,
              referenceNumber: app.referenceNumber || app.reference_number,
              universityData,
              adminName: "Admissions Office",
              adminEmail: universityData?.contact_email || "admissions@university.edu",
              deadline: formattedDeadline,
              submittedAt: app.submittedAt || app.submitted_at,
              city: universityData?.city || "",
              country: universityData?.country || "",
              workflowProgress: app.workflowProgress || {
                estimatedCompletion: app.deadline,
                pendingTasks: 0,
                requiresStudentAction: false,
              },
            };
          } catch (enrichErr) {
            console.warn('Error enriching application:', enrichErr);
            return {
              ...app,
              id: app.id,
              universityName: app.universityName || "University",
              programName: app.programName || "Program",
              status: (app.status || 'DRAFT').toLowerCase(),
              completionPercentage: app.completionPercentage || 0,
              universityData: null,
              adminName: "Admissions Office",
              adminEmail: "admissions@university.edu",
              deadline: "TBA",
              city: "",
              country: "",
            };
          }
        })
      );

      console.log('✅ Enriched applications:', enriched);
      setApplications(enriched);
      
    } catch (err) {
      console.error("❌ Error loading applications:", err);
      setError("Failed to load applications. Please check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleNewApplication = () => {
    navigate("/universities");
  };

  const handleViewDetails = async (applicationId: string) => {
    try {
      console.log("Loading details for application:", applicationId);
      
      // Find application in current state first
      const app = applications.find(a => a.id === applicationId);
      if (app) {
        setSelectedApplication(app);
        setIsDetailsModalOpen(true);
      } else {
        // Fetch fresh data if not found
        const appData = await getApplicationById(applicationId);
        setSelectedApplication(appData?.data || appData);
        setIsDetailsModalOpen(true);
      }
    } catch (error) {
      console.error('Error loading application details:', error);
      alert('Failed to load application details');
    }
  };

  const handleRefresh = () => {
    loadApplications(false);
  };

  // Filter applications by selected country
  const filteredApplications = selectedCountry === "ALL" 
    ? applications 
    : applications.filter(app => {
        const appCountry = normalizeApiCountry(app.country || app.universityData?.country);
        const targetCountry = selectedCountry === "DE" ? "germany" : "united_kingdom";
        return appCountry === targetCountry;
      });

  if (loading && !refreshing) {
    return (
      <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#E08D3C]" />
          <span className="ml-2 text-gray-600">Loading your applications...</span>
        </div>
      </motion.div>
    );
  }

  if (error && applications.length === 0) {
    return (
      <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="font-bold text-xl text-[#2C3539] mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-[#E08D3C] hover:bg-[#c77a32] text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 mx-auto">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  const container = { 
    hidden: { opacity: 0 }, 
    show: { opacity: 1, transition: { staggerChildren: 0.1 } } 
  };
  
  const item = { 
    hidden: { y: 20, opacity: 0 }, 
    show: { y: 0, opacity: 1 } 
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">My Applications</h1>
            {applications.length > 0 && (
              <span className="bg-[#E08D3C] text-white px-3 py-1 rounded-full text-sm font-semibold">
                {applications.length}
              </span>
            )}
            {refreshing && (
              <Loader2 className="w-5 h-5 animate-spin text-[#E08D3C]" />
            )}
          </div>
          <p className="text-muted-foreground">
            Track and manage your university applications
          </p>
        </div>

        <div className="flex gap-2">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <button
              className="bg-white border-2 border-[#E08D3C] text-[#E08D3C] px-4 py-2 rounded-lg font-medium hover:bg-[#E08D3C] hover:text-white transition-all duration-200 flex items-center gap-2"
              onClick={handleRefresh}
              disabled={refreshing}>
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <button
              className="bg-[#E08D3C] hover:bg-[#c77a32] text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              onClick={handleNewApplication}>
              <Plus className="w-4 h-4" />
              New Application
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Country Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setSelectedCountry("ALL")}
          className={`px-6 py-3 font-medium transition-all ${
            selectedCountry === "ALL"
              ? "border-b-2 border-[#E08D3C] text-[#E08D3C]"
              : "text-gray-600 hover:text-[#E08D3C]"
          }`}>
          All Countries
          <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full">
            {applications.length}
          </span>
        </button>
        <button
          onClick={() => setSelectedCountry("DE")}
          className={`px-6 py-3 font-medium transition-all ${
            selectedCountry === "DE"
              ? "border-b-2 border-[#E08D3C] text-[#E08D3C]"
              : "text-gray-600 hover:text-[#E08D3C]"
          }`}>
          Germany
          <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full">
            {applications.filter(a => 
              normalizeApiCountry(a.country || a.universityData?.country) === "germany"
            ).length}
          </span>
        </button>
        <button
          onClick={() => setSelectedCountry("UK")}
          className={`px-6 py-3 font-medium transition-all ${
            selectedCountry === "UK"
              ? "border-b-2 border-[#E08D3C] text-[#E08D3C]"
              : "text-gray-600 hover:text-[#E08D3C]"
          }`}>
          United Kingdom
          <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full">
            {applications.filter(a => 
              normalizeApiCountry(a.country || a.universityData?.country) === "united_kingdom"
            ).length}
          </span>
        </button>
      </div>

      {/* Applications List */}
      <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((application) => {
            const key = (application.status || "draft").toLowerCase();
            const conf = statusConfig[key] || statusConfig["draft"];
            const IconComp = conf.icon;
            const progress = getProgress(key, application.completionPercentage);

            return (
              <motion.div key={application.id} variants={item} whileHover={{ y: -2, scale: 1.01 }}>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* University Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#C4DFF0] to-[#E08D3C] rounded-xl flex items-center justify-center text-white text-2xl flex-shrink-0">
                        {application.universityData?.image_url ? (
                          <img 
                            src={application.universityData.image_url} 
                            alt={application.universityName}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <Building2 className="w-8 h-8" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <h3 className="font-bold text-xl mb-1 text-[#2C3539]">
                              {application.universityName}
                            </h3>
                            <p className="text-gray-700 font-medium mb-2">
                              {application.programName}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${conf.color}`}>
                            <div className="inline-flex items-center gap-1">
                              <IconComp className="w-3 h-3" />
                              {conf.label}
                            </div>
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#E08D3C]" />
                            <span>{application.city || "Location TBA"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#E08D3C]" />
                            <span>Intake: {application.intakeTerm || "TBA"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#E08D3C]" />
                            <span>Deadline: {application.deadline}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#E08D3C]" />
                            <span>Ref: {application.referenceNumber || "Pending"}</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-600 font-medium">
                              Application Progress
                            </span>
                            <span className="text-[#E08D3C] font-bold">
                              {progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div 
                              className="bg-gradient-to-r from-[#E08D3C] to-[#C4DFF0] h-2.5 rounded-full transition-all duration-500" 
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Draft</span>
                            <span>In Review</span>
                            <span>Decision</span>
                          </div>
                        </div>

                        {/* Workflow Info */}
                        {application.workflowProgress && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex items-start gap-2">
                              <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
                              <div className="flex-1 text-xs">
                                <p className="text-blue-900 font-medium mb-1">Workflow Status</p>
                                <div className="space-y-1 text-blue-700">
                                  {application.workflowProgress.requiresStudentAction && (
                                    <p className="font-medium">⚠️ Action required from your side</p>
                                  )}
                                  <p>
                                    Pending tasks: {application.workflowProgress.pendingTasks || 0}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:w-40">
                      <button
                        onClick={() => handleViewDetails(application.id)}
                        className="px-4 py-2 bg-white border-2 border-[#2C3539] text-[#2C3539] rounded-lg hover:bg-[#2C3539] hover:text-white text-sm font-medium flex items-center justify-center gap-2 transition-all">
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      
                      {key === "draft" && (
                        <button
                          onClick={() => navigate("/universities")}
                          className="px-4 py-2 bg-[#E08D3C] text-white rounded-lg hover:bg-[#c77a32] text-sm font-medium flex items-center justify-center gap-2 transition-all">
                          Complete
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}

                      {application.workflowProgress?.requiresStudentAction && (
                        <button
                          className="px-4 py-2 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-lg hover:bg-yellow-200 text-sm font-medium flex items-center justify-center gap-2 transition-all">
                          <AlertCircle className="w-4 h-4" />
                          Action Needed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-[#C4DFF0] to-[#E08D3C] flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">
              {selectedCountry === "ALL" 
                ? "No applications yet" 
                : `No applications for ${selectedCountry === "DE" ? "Germany" : "United Kingdom"}`}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {selectedCountry === "ALL"
                ? "Start your journey by browsing universities and programs that match your profile."
                : `Browse universities in ${selectedCountry === "DE" ? "Germany" : "United Kingdom"} to start applying.`}
            </p>
            <button
              onClick={handleNewApplication}
              className="px-6 py-3 bg-[#E08D3C] text-white rounded-lg hover:bg-[#c77a32] font-medium inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Browse Universities
            </button>
          </div>
        )}
      </motion.div>

      {/* Summary Stats */}
      {applications.length > 0 && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-900">
                  {applications.filter(a => 
                    a.status === "draft" || 
                    a.status === "submitted" || 
                    a.status === "in_workflow" ||
                    a.status === "claim_pending"
                  ).length}
                </p>
                <p className="text-sm text-blue-700">In Progress</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-900">
                  {applications.filter(a => a.status === "offer" || a.status === "accepted").length}
                </p>
                <p className="text-sm text-green-700">Offers</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-900">
                  {applications.filter(a => a.workflowProgress?.requiresStudentAction).length}
                </p>
                <p className="text-sm text-yellow-700">Need Action</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-900">
                  {applications.length}
                </p>
                <p className="text-sm text-purple-700">Total Applications</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Application Details Modal */}
      <ApplicationDetailsModal
        application={selectedApplication}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedApplication(null);
        }}
        onRefresh={handleRefresh}
      />
    </motion.div>
  );
}