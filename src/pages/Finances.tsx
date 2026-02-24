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
  ArrowRight,
  Phone
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

  const handleGoogleMeetClick = () => {
  window.open('https://meet.google.com/bqr-dcwn-wka', '_blank', 'noopener,noreferrer');
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
        {/* Stats
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
        </div> */}

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

      {/* Google Meet Help Section */}
{/* Google Meet Help Section */}
<motion.section
  className="space-y-4"
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.5, delay: 0.4 }}
>
  <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100">
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
  <Phone className="w-8 h-8 text-blue-600" />
</div>
        <h3 className="font-semibold text-2xl">Need Help?</h3>
      
      </div>
      
      <div className="text-base text-muted-foreground leading-relaxed">
        Have questions about payments, blocked accounts, or education loans? Our financial advisors are 
        available for one-on-one video consultations to guide you through the process and answer all your questions.
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 text-base text-gray-700 p-4 bg-white rounded-lg">
          <strong>Schedule a Video Consultation</strong><br />
          Connect with our expert advisors via Google Meet for personalized assistance with your financial 
          planning, payment processes, and documentation requirements.
        </div>
        <div className="flex flex-col gap-3 lg:flex-shrink-0">
          <Button 
  size="sm"
  className="bg-blue-500 hover:bg-blue-600 text-white rounded-pill whitespace-nowrap w-fit"
  onClick={handleGoogleMeetClick}
>
  <Phone className="w-3 h-3 mr-1.5" />
  Join Video Call Now
</Button>
        </div>
      </div>
    </div>
  </Card>
</motion.section>
      

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