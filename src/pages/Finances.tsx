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
  ExternalLink
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
        <Button className="rounded-pill">
          <ExternalLink className="w-4 h-4 mr-2" />
          Flywire Portal
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">€155</div>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{payment.description}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Due: {payment.dueDate}
                    </div>
                    <div className="text-xl font-bold text-primary">{payment.amount}</div>
                  </div>
                </div>
                <Button className="rounded-pill">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay Now
                </Button>
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