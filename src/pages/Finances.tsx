import { motion } from "framer-motion";
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
  Send
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
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Stats Card */}
        <Card className="p-6">
          
          <div className="space-y-4 pt-6">
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-sm text-muted-foreground mb-1">pending payments</div>
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-sm text-muted-foreground mb-1">paid this month</div>
              <div className="text-2xl font-bold text-green-600">{stats.paidThisMonth}</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-muted-foreground mb-1">total paid</div>
              <div className="text-2xl font-bold text-blue-600">{stats.totalPaid}</div>
            </div>
          </div>
        </Card>

        {/* Education Loan Card with Carousel Background */}
        {/* Education Loan Card with Carousel Background */}
<Card className="relative overflow-hidden border-0 shadow-lg min-h-[400px]">
  {/* Carousel images with blur effect */}
  <div className="absolute inset-0">
    {/* Static first image to prevent blank space */}
    <div 
      className="absolute inset-0 blur-[2px]"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    />
    
    {/* Animated overlay images */}
    {[
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop", 
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&h=600&fit=crop"
    ].map((imageUrl, index) => (
      <motion.div 
        key={index}
        className="absolute inset-0 blur-[2px]"
        style={{
          backgroundImage: `url('${imageUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
        animate={{ 
          opacity: index === 0 ? [0, 0, 1, 1, 0, 0] : 
                   index === 1 ? [0, 0, 0, 0, 1, 1] :
                   [0, 1, 1, 0, 0, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear"
        }}
      />
    ))}
  </div>
  
  {/* Overlay for better text readability */}
  <div className="absolute inset-0 bg-black/40" />
  
  {/* Content - Centered */}
  <div className="relative z-10 p-8 text-white h-full flex flex-col items-center justify-center text-center">
    <div className="flex flex-col gap-6 items-center max-w-md">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-black">
          {selectedCountry === "DE" ? <Euro className="w-4 h-4" /> : <PoundSterling className="w-4 h-4" />}
        </div>
        <h3 className="font-semibold text-2xl text-white drop-shadow-lg">Education Loan</h3>
      </div>
      
      <div className="text-base text-white/90 leading-relaxed drop-shadow-md">
        Need financial assistance for your studies? Our partner institutions offer competitive 
        education loans with flexible repayment options. Get pre-approved quickly and secure 
        funding for tuition fees, living expenses, and other study-related costs.
      </div>
      
      <Button 
        size="lg"
        className="rounded-full px-8 bg-primary hover:bg-amber-700 text-white shadow-lg mt-1"
        onClick={() => window.open("https://www.credila.com/", "_blank")}
      >
        {selectedCountry === "DE" ? <Euro className="w-4 h-4 mr-2" /> : <PoundSterling className="w-4 h-4 mr-2" />}
        Apply for Education Loan
      </Button>
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
          <Card className="p-8 border-l-4 border-blue-200 bg-blue-50">
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
                <div className="flex-1 text-base text-gray-700 p-4 bg-white rounded-lg border-l-2 border-blue-300">
                  <strong>Expert Assistance Available</strong><br />
                  Our dedicated representative specializes in block account setup and can guide you through 
                  the entire process. Alternatively, you can proceed directly through Flywire's secure portal.
                </div>
                <div className="flex flex-col gap-3 lg:flex-shrink-0">
                  <Button className="rounded-pill whitespace-nowrap">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Contact Representative
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
          <Card className="p-8 border-l-4 border-green-200 bg-green-50">
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
                <div className="flex-1 text-base text-gray-700 p-4 bg-white rounded-lg border-l-2 border-green-300">
                  <strong>Secure International Transfers</strong><br />
                  Transfer funds safely to UK universities with real-time tracking, competitive rates, 
                  and dedicated support throughout the payment process.
                </div>
                <div className="flex flex-col gap-3 lg:flex-shrink-0">
                  <Button className="rounded-pill whitespace-nowrap">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Contact Representative
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
    </motion.div>
  );
}