import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  FileText,
  Zap,
  Download,
  ArrowRight
} from "lucide-react";

const aiTools = [
  {
    id: 1,
    name: "SOP Generator",
    description: "Create compelling Statements of Purpose tailored to your target universities",
    icon: FileText,
    features: ["University-specific customization", "Multiple tone options", "Real-time preview"],
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: 2,
    name: "LOR Generator", 
    description: "Generate professional Letters of Recommendation with proper formatting",
    icon: Bot,
    features: ["Academic/Professional templates", "Multiple formats", "Export to PDF/DOC"],
    color: "bg-green-100 text-green-600"
  },
  {
    id: 3,
    name: "CV/Resume Builder",
    description: "Build ATS-friendly resumes optimized for international applications",
    icon: Zap,
    features: ["ATS optimization", "Multiple templates", "Skills highlighting"],
    color: "bg-purple-100 text-purple-600"
  }
];

export default function AITools() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { scale: 0.9, opacity: 0 },
    show: { scale: 1, opacity: 1 }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div 
        className="text-center max-w-2xl mx-auto"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-4">AI-Powered Tools</h1>
        <p className="text-muted-foreground text-lg">
          Generate professional documents with our AI assistants
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {aiTools.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <motion.div
              key={tool.id}
              variants={item}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-6 h-full flex flex-col hover:shadow-float transition-all duration-standard">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${tool.color}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                
                <h3 className="font-bold text-xl mb-2">{tool.name}</h3>
                <p className="text-muted-foreground mb-4 flex-1">{tool.description}</p>
                
                <div className="space-y-2 mb-6">
                  {tool.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full rounded-xl group">
                  Open Tool
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Usage Stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">12</div>
          <div className="text-sm text-muted-foreground">Documents Generated</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">8</div>
          <div className="text-sm text-muted-foreground">Successfully Used</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">4.8/5</div>
          <div className="text-sm text-muted-foreground">Average Rating</div>
        </Card>
      </motion.div>
    </motion.div>
  );
}