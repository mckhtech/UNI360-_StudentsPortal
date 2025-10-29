import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  Download,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  Receipt,
  ExternalLink,
  Shield,
  AlertCircle,
  Euro,
  PoundSterling,
  Send,
  X,
  ArrowRight
} from "lucide-react";

type Country = "DE" | "UK";

interface ContextType {
  selectedCountry: Country;
}

const mockPayments = {
  DE: {
    pending: [
      {
        id: 1,
        description: "Application Fee - TU Munich",
        amount: "€75",
        dueDate: "2024-04-15",
        priority: "high"
      },
      {
        id: 2,
        description: "Visa Appointment Fee",
        amount: "€80",
        dueDate: "2024-04-20",
        priority: "medium",
        note: "For German Consulate appointments, please carry a demand draft for fees payment in the specified format."
      },
      {
        id: 5,
        description: "Health Insurance",
        amount: "€110/month",
        dueDate: "2024-04-25",
        priority: "high"
      },
      {
        id: 6,
        description: "Matriculation & Registration Fees",
        amount: "€350",
        dueDate: "2024-05-01",
        priority: "medium"
      }
    ],
    completed: [
      {
        id: 3,
        description: "University Application Fee",
        amount: "€150",
        paidDate: "2024-03-10",
        method: "Credit Card",
        status: "completed"
      },
      {
        id: 4,
        description: "Document Verification",
        amount: "€25",
        paidDate: "2024-03-05",
        method: "PayPal",
        status: "completed"
      }
    ]
  },
  UK: {
    pending: [
      {
        id: 1,
        description: "Application Fee - University of Oxford",
        amount: "£85",
        dueDate: "2024-04-15",
        priority: "high"
      },
      {
        id: 2,
        description: "Visa Appointment Fee",
        amount: "£95",
        dueDate: "2024-04-20",
        priority: "medium"
      },
      {
        id: 5,
        description: "Health Insurance",
        amount: "£130/month",
        dueDate: "2024-04-25",
        priority: "high"
      },
      {
        id: 6,
        description: "Matriculation & Registration Fees",
        amount: "£420",
        dueDate: "2024-05-01",
        priority: "medium"
      }
    ],
    completed: [
      {
        id: 3,
        description: "University Application Fee",
        amount: "£180",
        paidDate: "2024-03-10",
        method: "Credit Card",
        status: "completed"
      },
      {
        id: 4,
        description: "Document Verification",
        amount: "£30",
        paidDate: "2024-03-05",
        method: "PayPal",
        status: "completed"
      }
    ]
  }
};

const statsData = {
  DE: {
    pending: "€615",
    paidThisMonth: "€175",
    totalPaid: "€330"
  },
  UK: {
    pending: "£730",
    paidThisMonth: "£210",
    totalPaid: "£395"
  }
};

export default function Finances() {
  const { selectedCountry } = useOutletContext<ContextType>();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoanPopupOpen, setIsLoanPopupOpen] = useState(false);
  const [isLoanDetailsOpen, setIsLoanDetailsOpen] = useState(false);
  const payments = mockPayments[selectedCountry];
  const stats = statsData[selectedCountry];
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const handleFlywireRedirect = () => {
    window.open("https://www.flywire.com/?utm_source=google&utm_medium=cpc&utm_campaign=brand&utm_adgroup=brand&gad_source=1&gad_campaignid=9553510736&gbraid=0AAAAACqDb0JfO77WZx6tRTuL9t7Rg5mfF&gclid=Cj0KCQjw8KrFBhDUARIsAMvIApb5ZEXhs8SfRn_rvB8AEZgYgpMD-0SrRwfrAVuirZVGNj_zCeC5EUgaAnZLEALw_wcB", "_blank");
  };

  const handleDemandDraftDownload = () => {
    // Direct download using the PDF file path
    const link = document.createElement('a');
    link.href = '/files/dd-mumbai-data.pdf';
    link.download = 'demand-draft-form.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWhatsAppClick = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleOpenWhatsAppBusiness = () => {
    window.open('https://wa.me/1234567890?text=Hello!%20I%20need%20help%20with%20my%20financial%20payments', '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Finances</h1>
          <p className="text-muted-foreground">Manage payments and financial documents</p>
        </div>
      </motion.div>

      {/* Stats and Education Loan Combined */}
      <motion.div 
        className="grid grid-cols-1 gap-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Stats */}
        <div className="flex flex-row gap-4">
          <div className="flex-1 p-4 bg-orange-50 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">pending payments</div>
            <div className="text-2xl font-bold text-red-600">{stats.pending}</div>
          </div>
          <div className="flex-1 p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">paid this month</div>
            <div className="text-2xl font-bold text-green-600">{stats.paidThisMonth}</div>
          </div>
          <div className="flex-1 p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">total paid</div>
            <div className="text-2xl font-bold text-blue-600">{stats.totalPaid}</div>
          </div>
        </div>

        {/* Education Loan Card */}
        <Card className="p-8 bg-amber-50">
          <div className="flex flex-col gap-6">
            {/* Title with icon */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                {selectedCountry === "DE" ? <Euro className="w-8 h-8" /> : <PoundSterling className="w-8 h-8" />}
              </div>
              <h3 className="font-semibold text-2xl">Education Loan</h3>
            </div>
            
            {/* Description */}
            <div className="text-base text-muted-foreground leading-relaxed">
              Need financial assistance for your studies? Our partner institutions offer competitive 
              education loans with flexible repayment options. Get pre-approved quickly and secure 
              funding for tuition fees, living expenses, and other study-related costs.
            </div>
            
            {/* Expert assistance section with buttons */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div className="flex-1 text-base text-gray-700 p-4 bg-white rounded-lg">
                <strong>Expert Assistance Available</strong><br />
                Our dedicated representative specializes in education loan setup and can guide you through 
                the entire process. Alternatively, you can proceed directly through our secure portal.
              </div>
              <div className="flex flex-col gap-3 lg:flex-shrink-0">
                <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-pill whitespace-nowrap" onClick={() => setIsLoanPopupOpen(true)}>
                  Contact Representative
                </Button>
                <Button variant="outline" className="rounded-pill whitespace-nowrap" onClick={() => setIsLoanDetailsOpen(true)}>
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Block Account Card (DE) / Money Transfer Card (UK) */}
      <motion.section
        className="space-y-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {selectedCountry === "DE" ? (
          <Card className="p-8 bg-blue-50">
            <div className="flex flex-col gap-6">
              {/* Title with icon */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-2xl">Block Account</h3>
              </div>
              
              {/* Description */}
              <div className="text-base text-muted-foreground leading-relaxed">
                A blocked account is a special German bank account required for your student visa application. 
                This account ensures you have sufficient funds (currently €11,208 per year) to cover your living 
                expenses in Germany. The funds are blocked and released monthly during your studies.
              </div>
              
              {/* Expert assistance section with buttons */}
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="flex-1 text-base text-gray-700 p-4 bg-white rounded-lg">
                  <strong>Expert Assistance Available</strong><br />
                  Our dedicated representative specializes in block account setup and can guide you through 
                  the entire process. Alternatively, you can proceed directly through Flywire's secure portal.
                </div>
                <div className="flex flex-col gap-3 lg:flex-shrink-0">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-pill whitespace-nowrap" onClick={() => setIsPopupOpen(true)}>
                    Explore Here
                  </Button>
                  <Button variant="outline" className="rounded-pill whitespace-nowrap" onClick={handleFlywireRedirect}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Go to Flywire Portal
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-8 bg-green-50">
            <div className="flex flex-col gap-6">
              {/* Title with icon */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                  <Send className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-2xl">Money Transfer / Fees Payment</h3>
              </div>
              
              {/* Description */}
              <div className="text-base text-muted-foreground leading-relaxed">
                Simplify your UK education payments with secure money transfer services. Pay tuition fees, 
                accommodation costs, and other university expenses directly to UK institutions with competitive 
                exchange rates and low transfer fees.
              </div>
              
              {/* Expert assistance section with buttons */}
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="flex-1 text-base text-gray-700 p-4 bg-white rounded-lg">
                  <strong>Secure International Transfers</strong><br />
                  Transfer funds safely to UK universities with real-time tracking, competitive rates, 
                  and dedicated support throughout the payment process.
                </div>
                <div className="flex flex-col gap-3 lg:flex-shrink-0">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-pill whitespace-nowrap">
                  
                    Apply Now
                  </Button>
                  <Button variant="outline" className="rounded-pill whitespace-nowrap" onClick={handleFlywireRedirect}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Go to Flywire Portal
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </motion.section>

      {/* Pending Payments */}
      <motion.section
        className="space-y-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-2xl font-semibold">Pending Payments</h2>
        {payments.pending.map((payment) => (
          <motion.div key={payment.id} variants={item}>
            <Card className="p-6 border-l-4 border-orange-200 bg-orange-50">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{payment.description}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Due: {payment.dueDate}
                    </div>
                    <div className="text-xl font-bold text-primary">{payment.amount}</div>
                  </div>
                  {payment.note && selectedCountry === "DE" && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-amber-800">
                          <strong>Important:</strong> {payment.note}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 mt-12">
                  <Button className="rounded-pill">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay Now
                  </Button>
                  {payment.note && selectedCountry === "DE" && (
                    <Button 
                      variant="outline"
                      className="rounded-pill"
                      onClick={handleDemandDraftDownload}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Demand Draft Form
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      {/* Completed Payments */}
      <motion.section
        className="space-y-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-2xl font-semibold">Payment History</h2>
        {payments.completed.map((payment) => (
          <motion.div key={payment.id} variants={item}>
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{payment.description}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Paid: {payment.paidDate}</span>
                      <span>Method: {payment.method}</span>
                      <span className="text-lg font-bold text-green-600">{payment.amount}</span>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="rounded-pill">
                  <Download className="w-4 h-4 mr-2" />
                  Receipt
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
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
                <div className="flex-1 overflow-hidden mb-4">
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
                        <p className="text-gray-600 text-xs leading-relaxed mb-2">I'm here to help you with your payment process. How can I assist you today?</p>
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

      {/* Blocked Account Providers Popup */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setIsPopupOpen(false)}
          >
            <div 
              className="bg-white p-6 rounded-lg max-w-4xl w-full m-4 overflow-y-auto max-h-[80vh]" 
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">Blocked Account Providers</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Fintiba Card */}
                <Card className="p-4">
                  <img src="/fintiba-landscape.svg" alt="Fintiba" className="h-8 mb-4" />
                  <h3 className="font-semibold mb-2">Fintiba</h3>
                  <p className="text-sm mb-4">Fintiba provides a digital platform designed to assist international students in Germany.</p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center text-sm"><CheckCircle className="w-4 h-4 mr-2 text-primary" /> No City Registration Required</li>
                    <li className="flex items-center text-sm"><CheckCircle className="w-4 h-4 mr-2 text-primary" /> Initial Set-Up Fee: 89€</li>
                    <li className="flex items-center text-sm"><CheckCircle className="w-4 h-4 mr-2 text-primary" /> Service Fee: 4,90€ / month</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mb-4">Subject to change. Based on the price for a 12-month blocked account. As of 01/25.</p>
                  <Button className="w-full" onClick={() => window.open("https://fintiba.com/", "_blank")}>Find Out More</Button>
                </Card>

                {/* Coracle Card */}
                <Card className="p-4">
                  <img src="/coracle-dark.svg" alt="Coracle" className="h-8 mb-4" />
                  <h3 className="font-semibold mb-2">Coracle</h3>
                  <p className="text-sm mb-4">Coracle specializes in personalized solutions for international students and expats.</p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center text-sm"><CheckCircle className="w-4 h-4 mr-2 text-primary" /> No City Registration Required</li>
                    <li className="flex items-center text-sm"><CheckCircle className="w-4 h-4 mr-2 text-primary" /> Initial Set-Up Fee: 99€</li>
                    <li className="flex items-center text-sm"><CheckCircle className="w-4 h-4 mr-2 text-primary" /> No Monthly Service Fee</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mb-4">Subject to change. Based on the price for a 12-month blocked account. As of 01/25.</p>
                  <Button className="w-full" onClick={() => window.open("https://www.coracle.de/en", "_blank")}>Find Out More</Button>
                </Card>

                {/* Expatrio Card */}
                <Card className="p-4">
                  <img src="/expatrio-landscape.svg" alt="Expatrio" className="h-8 mb-4" />
                  <h3 className="font-semibold mb-2">Expatrio</h3>
                  <p className="text-sm mb-4">Expatrio offers a straightforward, user-friendly experience tailored for international students.</p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center text-sm"><CheckCircle className="w-4 h-4 mr-2 text-primary" /> City Registration Required</li>
                    <li className="flex items-center text-sm"><CheckCircle className="w-4 h-4 mr-2 text-primary" /> Initial Set-Up Fee: 69€</li>
                    <li className="flex items-center text-sm"><CheckCircle className="w-4 h-4 mr-2 text-primary" /> Service Fee: 5€ / month</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mb-4">Subject to change. Based on the price for a 12-month blocked account. As of 01/25.</p>
                  <Button className="w-full" onClick={() => window.open("https://www.expatrio.com/", "_blank")}>Find Out More</Button>
                </Card>
              </div>
              <div className="mt-6 flex justify-end">
                <Button variant="ghost" onClick={() => setIsPopupOpen(false)}>Close</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Education Loan Contact Popup */}
      <AnimatePresence>
        {isLoanPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setIsLoanPopupOpen(false)}
          >
            <div 
              className="bg-white p-6 rounded-lg max-w-md w-full m-4" 
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">Contact Representative</h2>
              <div className="mb-4 space-y-2">
                <p className="text-gray-600">Contact this person for education loan assistance:</p>
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="font-semibold text-gray-800 mb-1">Representative Name</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('+91 88663 34670');
                    }}
                    className="text-amber-600 hover:text-amber-700 font-medium cursor-pointer hover:underline"
                  >
                    +91 88663 34670
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="ghost" onClick={() => setIsLoanPopupOpen(false)}>Close</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Education Loan Details Popup */}
      <AnimatePresence>
        {isLoanDetailsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsLoanDetailsOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" 
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-amber-50 border-b border-amber-200 p-4 rounded-t-2xl z-10">
                <h2 className="text-2xl font-bold mb-1 text-gray-800">Education Loan Details</h2>
                <p className="text-sm text-gray-600">Comprehensive coverage for your study abroad journey</p>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Key Features Section */}
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-gray-800 flex items-center gap-2">
                      <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-4 h-4 text-amber-600" />
                      </div>
                      Key Features
                    </h3>
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border-b border-gray-200 p-2 text-left font-semibold text-gray-700">Feature</th>
                            <th className="border-b border-gray-200 p-2 text-left font-semibold text-gray-700">Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="border-b border-gray-200 p-2 font-medium text-gray-700">Loan Coverage</td>
                            <td className="border-b border-gray-200 p-2 text-gray-600">Tuition, housing, travel, materials, laptop, insurance</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="border-b border-gray-200 p-2 font-medium text-gray-700">Loan Amount</td>
                            <td className="border-b border-gray-200 p-2 text-gray-600">₹5 lakh to ₹3 crore</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="border-b border-gray-200 p-2 font-medium text-gray-700">Interest Rate</td>
                            <td className="border-b border-gray-200 p-2 text-gray-600">8.5% to 16%</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="border-b border-gray-200 p-2 font-medium text-gray-700">Collateral</td>
                            <td className="border-b border-gray-200 p-2 text-gray-600">Required for secured loans only</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="border-b border-gray-200 p-2 font-medium text-gray-700">Repayment</td>
                            <td className="border-b border-gray-200 p-2 text-gray-600">10 to 15 years</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="border-b border-gray-200 p-2 font-medium text-gray-700">Moratorium</td>
                            <td className="border-b border-gray-200 p-2 text-gray-600">Course + 6–12 months</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="border-b border-gray-200 p-2 font-medium text-gray-700">Processing Fee</td>
                            <td className="border-b border-gray-200 p-2 text-gray-600">0.5% to 2% + taxes</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="border-b border-gray-200 p-2 font-medium text-gray-700">Eligibility</td>
                            <td className="border-b border-gray-200 p-2 text-gray-600">University admission required</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="border-b border-gray-200 p-2 font-medium text-gray-700">Flexibility</td>
                            <td className="border-b border-gray-200 p-2 text-gray-600">EMIs or post-study plans</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="border-b border-gray-200 p-2 font-medium text-gray-700">Disbursal</td>
                            <td className="border-b border-gray-200 p-2 text-gray-600">Foreign currency available</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Covered Expenses Section */}
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-gray-800 flex items-center gap-2">
                      <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      Covered Expenses
                    </h3>
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border-b border-gray-200 p-2 text-left font-semibold text-gray-700">Category</th>
                            <th className="border-b border-gray-200 p-2 text-left font-semibold text-gray-700">Covered Expenses</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="border-b border-gray-200 p-2 font-medium text-gray-700">Tuition Fees</td>
                            <td className="border-b border-gray-200 p-2 text-gray-600">Full course fee per invoice</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="border-b border-gray-200 p-2 font-medium text-gray-700">Living Expenses</td>
                            <td className="border-b border-gray-200 p-2 text-gray-600">Rent, food, utilities, essentials</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="border-b border-gray-200 p-2 font-medium text-gray-700">Travel Costs</td>
                            <td className="border-b border-gray-200 p-2 text-gray-600">Airfare to/from study country</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="border-b border-gray-200 p-2 font-medium text-gray-700">Health Insurance</td>
                            <td className="border-b border-gray-200 p-2 text-gray-600">Mandatory student coverage</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="border-b border-gray-200 p-2 font-medium text-gray-700">Study Materials</td>
                            <td className="border-b border-gray-200 p-2 text-gray-600">Books, supplies, software</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="border-b border-gray-200 p-2 font-medium text-gray-700">Laptop/Equipment</td>
                            <td className="border-b border-gray-200 p-2 text-gray-600">Essential electronics</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="border-b border-gray-200 p-2 font-medium text-gray-700">Visa & Application</td>
                            <td className="border-b border-gray-200 p-2 text-gray-600">Visa, university, test fees</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="border-b border-gray-200 p-2 font-medium text-gray-700">Caution Deposit</td>
                            <td className="border-b border-gray-200 p-2 text-gray-600">University/housing deposit</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="border-b border-gray-200 p-2 font-medium text-gray-700">Examination Fees</td>
                            <td className="border-b border-gray-200 p-2 text-gray-600">Semester & exam costs</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="border-b border-gray-200 p-2 font-medium text-gray-700">Transportation</td>
                            <td className="border-b border-gray-200 p-2 text-gray-600">Public transport costs</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="border-b border-gray-200 p-2 font-medium text-gray-700">Miscellaneous</td>
                            <td className="border-b border-gray-200 p-2 text-gray-600">Approved academic costs</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 mt-4 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setIsLoanDetailsOpen(false)}
                  >
                    Close
                  </Button>
                  <Button 
                    className="flex-1 bg-amber-500 hover:bg-amber-600"
                    onClick={() => {
                      setIsLoanDetailsOpen(false);
                      setIsLoanPopupOpen(true);
                    }}
                  >
                    Contact Representative
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}