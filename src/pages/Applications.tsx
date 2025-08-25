import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Add this import for navigation
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
  BookOpen,
  Send,
  X,
  WifiOff,
  CreditCard,
  Shield
} from "lucide-react";

const statusConfig = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-800", icon: Circle },
  submitted: { label: "Submitted", color: "bg-blue-100 text-blue-800", icon: Clock },
  offer: { label: "Offer Received", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle },
  waitlist: { label: "Waitlisted", color: "bg-yellow-100 text-yellow-800", icon: AlertCircle }
};

// Payment Modal Component
const PaymentModal = ({ isOpen, onClose, applicationData, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState('confirm'); // 'confirm', 'processing', 'success'

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStep('processing');
    
    // Simulate Razorpay payment process
    setTimeout(() => {
      setPaymentStep('success');
      // Immediately call onSuccess after showing success for a brief moment
      setTimeout(() => {
        onSuccess();
      }, 1500); // Reduced from 2000 to 1500ms for faster redirect
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {paymentStep === 'confirm' && (
          <>
            {/* Payment Confirmation */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Payment Required</h2>
                    <p className="text-sm text-gray-500">Application submission fee</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Application Details</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>University:</strong> {applicationData?.universityName || 'Selected University'}</p>
                    <p><strong>Course:</strong> {applicationData?.courseName || 'Selected Course'}</p>
                    <p><strong>Application Fee:</strong> ₹2,500</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                      R
                    </div>
                    <span className="text-sm text-gray-600">Secure payment powered by Razorpay</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Application Fee</span>
                      <span className="font-semibold">₹2,500</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Processing Fee</span>
                      <span className="font-semibold">₹50</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Total Amount</span>
                        <span className="font-bold text-lg">₹2,550</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-xs text-blue-700">
                    <p className="font-medium mb-1">Secure Payment</p>
                    <p>Your payment information is encrypted and secure. This is a demo transaction.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
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

        {paymentStep === 'processing' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Payment</h3>
            <p className="text-gray-600">Please wait while we process your payment...</p>
            <div className="mt-4 text-xs text-gray-500">
              This is a demo payment process
            </div>
          </div>
        )}

        {paymentStep === 'success' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-4">Your application has been submitted successfully.</p>
            <div className="text-xs text-gray-500">
              Redirecting to universities page...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Applications() {
  const [selectedCountry, setSelectedCountry] = useState("DE");
  const navigate = useNavigate(); // Add navigate hook
  
  // State for applications
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  
  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState(null);

  // Mock data for when API is not available
  const getMockApplications = () => {
    const mockData = [
      {
        id: "mock-1",
        university: "1",
        course: "1",
        country: selectedCountry === "DE" ? "germany" : "united_kingdom",
        status: "draft",
        created_at: "2024-01-15T10:00:00Z",
        universityData: {
          id: "1",
          name: selectedCountry === "DE" ? "Technical University of Munich" : "University of Cambridge",
          city: selectedCountry === "DE" ? "Munich" : "Cambridge"
        },
        courseData: {
          id: "1",
          name: selectedCountry === "DE" ? "Computer Science" : "Computer Science",
          degree_type: "Bachelor's"
        },
        adminName: "Dr. Academic Admin",
        adminEmail: "admin@university.edu",
        deadline: "March 15, 2024",
        logo: "🏛️"
      },
      {
        id: "mock-2",
        university: "2",
        course: "2", 
        country: selectedCountry === "DE" ? "germany" : "united_kingdom",
        status: "submitted",
        created_at: "2024-01-10T10:00:00Z",
        universityData: {
          id: "2",
          name: selectedCountry === "DE" ? "University of Heidelberg" : "Oxford University",
          city: selectedCountry === "DE" ? "Heidelberg" : "Oxford"
        },
        courseData: {
          id: "2",
          name: "Business Administration",
          degree_type: "Master's"
        },
        adminName: "Dr. Business Admin",
        adminEmail: "admin@business.edu",
        deadline: "February 28, 2024",
        logo: "🏛️"
      },
      {
        id: "mock-3",
        university: "3",
        course: "3",
        country: selectedCountry === "DE" ? "germany" : "united_kingdom",
        status: "offer",
        created_at: "2024-01-05T10:00:00Z",
        universityData: {
          id: "3",
          name: selectedCountry === "DE" ? "Humboldt University" : "Imperial College London",
          city: selectedCountry === "DE" ? "Berlin" : "London"
        },
        courseData: {
          id: "3",
          name: "Engineering",
          degree_type: "Master's"
        },
        adminName: "Dr. Engineering Admin",
        adminEmail: "admin@engineering.edu",
        deadline: "January 31, 2024",
        logo: "🏛️"
      }
    ];
    
    return mockData;
  };

  // Load applications on mount and when country changes
  useEffect(() => {
    loadApplications();
  }, [selectedCountry]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Using mock data for demo
      setApplications(getMockApplications());
      setIsUsingMockData(false);
      
    } catch (err) {
      console.error('Error loading applications:', err);
      setApplications(getMockApplications());
      setIsUsingMockData(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitApplication = async (applicationId) => {
    const application = applications.find(app => app.id === applicationId);
    
    // Show payment modal first
    setPendingSubmission({
      applicationId,
      universityName: application.universityData.name,
      courseName: application.courseData.name
    });
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    if (!pendingSubmission) return;

    // Update application status
    setApplications(prev => 
      prev.map(app => 
        app.id === pendingSubmission.applicationId 
          ? { ...app, status: 'submitted' }
          : app
      )
    );
    
    // Clean up state
    setPendingSubmission(null);
    setShowPaymentModal(false);
    
    // Direct redirect to universities page
    navigate('/universities');
  };

  const handleNewApplication = () => {
    // Direct redirect to universities page for new applications
    navigate('/universities');
  };

  // Calculate progress based on status
  const getProgress = (status) => {
    switch (status) {
      case 'draft': return 40;
      case 'submitted': return 75;
      case 'offer': return 100;
      case 'rejected': return 100;
      case 'waitlist': return 85;
      default: return 0;
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
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#E08D3C]" />
          <span className="ml-2 text-gray-600">Loading your applications...</span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
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
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Applications</h1>
          </div>
          <p className="text-muted-foreground">
            Track and manage your university applications for {selectedCountry === "DE" ? "Germany" : "United Kingdom"}
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
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
        <motion.div 
          className="space-y-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {applications.length > 0 ? (
            applications.map((application) => {
              const StatusIcon = statusConfig[application.status].icon;
              const progress = getProgress(application.status);
              
              return (
                <motion.div
                  key={application.id}
                  variants={item}
                  whileHover={{ y: -2, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* University Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#C4DFF0] to-[#E08D3C] rounded-xl flex items-center justify-center text-white text-xl">
                          {application.logo}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1">
                            {application.universityData.name}
                          </h3>
                          <p className="text-muted-foreground mb-2">
                            {application.courseData.name}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {application.universityData.city}
                            </div>
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
                            <span className="text-xs font-medium">{progress}%</span>
                          </div>
                          <div className="w-full bg-[#2C3539] bg-opacity-20 rounded-full h-2">
                            <motion.div 
                              className="bg-[#E08D3C] h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span 
                            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig[application.status].color}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig[application.status].label}
                          </span>
                          
                          {application.status === 'draft' && (
                            <button
                              onClick={() => handleSubmitApplication(application.id)}
                              className="bg-[#2C3539] hover:bg-[#1e2529] text-white text-sm px-3 py-1 rounded-lg flex items-center gap-1"
                            >
                              <Send className="w-3 h-3" />
                              Submit
                            </button>
                          )}
                        </div>
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
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-600 mb-4">No applications yet</h3>
                <p className="text-gray-500 mb-8 text-lg leading-relaxed">
                  Start your university journey by creating your first application. Browse universities and courses to get started!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button 
                    onClick={handleNewApplication}
                    className="bg-[#E08D3C] hover:bg-[#c77a32] text-white font-bold px-8 py-3 rounded-lg text-lg flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Create Application
                  </button>
                  <button 
                    onClick={() => navigate('/universities')}
                    className="border-2 border-[#2C3539] text-[#2C3539] hover:bg-[#2C3539] hover:text-white font-bold px-8 py-3 rounded-lg text-lg flex items-center justify-center gap-2"
                  >
                    <Building2 className="w-5 h-5" />
                    Browse Universities
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Stats Footer */}
        {applications.length > 0 && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white p-4 rounded-lg shadow-md text-center border">
              <div className="text-2xl font-bold text-primary">{applications.length}</div>
              <div className="text-sm text-muted-foreground">Total Applications</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md text-center border">
              <div className="text-2xl font-bold text-green-600">
                {applications.filter(app => app.status === 'offer').length}
              </div>
              <div className="text-sm text-muted-foreground">Offers Received</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md text-center border">
              <div className="text-2xl font-bold text-blue-600">
                {applications.filter(app => app.status === 'submitted').length}
              </div>
              <div className="text-sm text-muted-foreground">Under Review</div>
            </div>
          </motion.div>
        )}

        {/* Payment Modal */}
        <PaymentModal 
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setPendingSubmission(null);
          }}
          applicationData={pendingSubmission}
          onSuccess={handlePaymentSuccess}
        />
      </motion.div>
    );
}