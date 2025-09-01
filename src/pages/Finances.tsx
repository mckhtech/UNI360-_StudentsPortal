import { motion } from "framer-motion";
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
  AlertCircle
} from "lucide-react";

const mockPayments = {
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
};

export default function Finances() {
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

      {/* Stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">€615</div>
          <div className="text-sm text-muted-foreground">Pending Payments</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">€175</div>
          <div className="text-sm text-muted-foreground">Paid This Month</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">€330</div>
          <div className="text-sm text-muted-foreground">Total Paid</div>
        </Card>
      </motion.div>

      <motion.section
        className="space-y-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <Card className="p-8 border-l-4 border-green-200 bg-green-50">
          <div className="flex flex-col gap-6">
            {/* Title with icon */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                <DollarSign className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-2xl">Education Loan</h3>
            </div>
            
            {/* Description */}
            <div className="text-base text-muted-foreground leading-relaxed">
              Need financial assistance for your studies? Our partner institutions offer competitive 
              education loans with flexible repayment options. Get pre-approved quickly and secure 
              funding for tuition fees, living expenses, and other study-related costs.
            </div>
            
            {/* Button section */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div className="flex-1 text-base text-gray-700 p-4 bg-white rounded-lg border-l-2 border-green-300">
                <strong>Quick & Easy Process</strong><br />
                Apply online with minimal documentation. Get instant pre-approval and competitive 
                interest rates tailored for international students.
              </div>
              <div className="lg:flex-shrink-0 mt-14">
                <Button 
                  className="rounded-pill whitespace-nowrap"
                  onClick={() => window.open("https://www.credila.com/", "_blank")}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Apply for Education Loan
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.section>

      {/* Block Account Card */}
      <motion.section
        className="space-y-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
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
      </motion.section>

      {/* Pending Payments */}
      <motion.section
        className="space-y-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-2xl font-semibold">Pending Payments</h2>
        {mockPayments.pending.map((payment) => (
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
                  {payment.note && (
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
                  {payment.note && (
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
        {mockPayments.completed.map((payment) => (
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