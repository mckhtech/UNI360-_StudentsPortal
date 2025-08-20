import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  FileText,
  Zap,
  Download,
  ArrowRight,
  User,
  Briefcase,
  Wand2,
  Copy,
  RefreshCw,
  Sparkles,
  CheckCircle,
  Clock,
  Settings,
  Save,
  Eye,
  History,
  X,
  ChevronLeft,
  Menu
} from "lucide-react";

const AITools = () => {
  const [selectedTool, setSelectedTool] = useState(null);
  const [generationStep, setGenerationStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Enhanced AI tools data
  const aiTools = [
    {
      id: 'sop',
      name: "SOP Generator",
      title: 'Statement of Purpose Generator',
      description: "Create compelling Statements of Purpose tailored to your target universities",
      icon: FileText,
      features: ["University-specific customization", "Multiple tone options", "Real-time preview", "Export formats"],
      color: "bg-blue-100 text-blue-600",
      bgGradient: "from-blue-500 to-blue-600",
      usage: 1234,
      rating: 4.8
    },
    {
      id: 'lor',
      name: "LOR Generator", 
      title: 'Letter of Recommendation Assistant',
      description: "Generate professional Letters of Recommendation with proper formatting",
      icon: User,
      features: ["Academic/Professional templates", "Multiple formats", "Export to PDF/DOC", "Customizable"],
      color: "bg-green-100 text-green-600",
      bgGradient: "from-green-500 to-green-600",
      usage: 892,
      rating: 4.7
    },
    {
      id: 'cv',
      name: "CV/Resume Builder",
      title: 'CV/Resume Builder',
      description: "Build ATS-friendly resumes optimized for international applications",
      icon: Briefcase,
      features: ["ATS optimization", "Multiple templates", "Skills highlighting", "Export options"],
      color: "bg-purple-100 text-purple-600",
      bgGradient: "from-purple-500 to-purple-600",
      usage: 2341,
      rating: 4.9
    }
  ];

  // Mock generation history
  const generationHistory = [
    {
      id: '1',
      type: 'sop',
      title: 'Computer Science SOP - TU Munich',
      createdAt: '2024-02-15T10:30:00Z',
      status: 'completed',
      wordCount: 847
    },
    {
      id: '2',
      type: 'cv',
      title: 'Software Engineer CV - International',
      createdAt: '2024-02-12T14:20:00Z',
      status: 'completed',
      wordCount: 0
    },
    {
      id: '3',
      type: 'lor',
      title: 'Professor LOR Template',
      createdAt: '2024-02-10T09:15:00Z',
      status: 'draft',
      wordCount: 623
    }
  ];

  // Mock templates
  const templates = {
    sop: [
      { id: '1', name: 'Engineering Focus', description: 'For technical programs', usage: 450 },
      { id: '2', name: 'Business School', description: 'For MBA and business programs', usage: 320 },
      { id: '3', name: 'Research Oriented', description: 'For PhD and research programs', usage: 280 }
    ],
    lor: [
      { id: '1', name: 'Academic Supervisor', description: 'From professor or advisor', usage: 340 },
      { id: '2', name: 'Professional Manager', description: 'From work supervisor', usage: 290 },
      { id: '3', name: 'Research Mentor', description: 'For research-focused programs', usage: 180 }
    ],
    cv: [
      { id: '1', name: 'Modern Professional', description: 'Clean and contemporary design', usage: 890 },
      { id: '2', name: 'Academic Format', description: 'For academic positions', usage: 560 },
      { id: '3', name: 'Creative Portfolio', description: 'For design and creative fields', usage: 430 }
    ]
  };

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

  const startGeneration = (toolId) => {
    setSelectedTool(toolId);
    setGenerationStep(1);
    setIsMobileMenuOpen(false);
  };

  const simulateGeneration = () => {
    setIsGenerating(true);
    setGenerationStep(2);
    // Simulate AI generation process
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationStep(3);
    }, 3000);
  };

  const resetGeneration = () => {
    setSelectedTool(null);
    setGenerationStep(0);
    setIsGenerating(false);
  };

  const getToolIcon = (type) => {
    switch (type) {
      case 'sop': return <FileText size={16} className="text-blue-600" />;
      case 'lor': return <User size={16} className="text-green-600" />;
      case 'cv': return <Briefcase size={16} className="text-purple-600" />;
      default: return <Bot size={16} className="text-gray-600" />;
    }
  };

  const renderGenerationModal = () => {
    const currentTool = aiTools.find(tool => tool.id === selectedTool);
    if (!currentTool) return null;

    const IconComponent = currentTool.icon;

    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              resetGeneration();
            }
          }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full text-white bg-gradient-to-r ${currentTool.bgGradient}`}>
                  <IconComponent size={24} />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold">{currentTool.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Step {generationStep} of 3
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetGeneration}
                className="sm:hidden"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {generationStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">University</label>
                      <input
                        type="text"
                        placeholder="e.g., TU Munich"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Program</label>
                      <input
                        type="text"
                        placeholder="e.g., MSc Computer Science"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
                      />
                    </div>
                  </div>

                  {selectedTool === 'sop' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">Academic Background</label>
                        <textarea
                          placeholder="Describe your educational background..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Career Goals</label>
                        <textarea
                          placeholder="What are your career aspirations..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
                        />
                      </div>
                    </>
                  )}

                  {selectedTool === 'lor' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">Relationship with Recommender</label>
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800">
                          <option>Professor/Academic Advisor</option>
                          <option>Work Supervisor</option>
                          <option>Research Mentor</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Key Achievements</label>
                        <textarea
                          placeholder="List your key achievements and projects..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
                        />
                      </div>
                    </>
                  )}

                  {selectedTool === 'cv' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">Template Style</label>
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800">
                          <option>Modern Professional</option>
                          <option>Academic Format</option>
                          <option>Creative Portfolio</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Industry Focus</label>
                        <input
                          type="text"
                          placeholder="e.g., Software Engineering, Finance"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800"
                        />
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {generationStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 text-center py-8"
                >
                  <div className="flex justify-center">
                    <div className="relative">
                      <motion.div
                        className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-200 border-t-blue-500 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Bot className="text-blue-500" size={24} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {isGenerating ? 'AI is working its magic...' : 'Ready to generate!'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {isGenerating 
                        ? 'Creating your personalized content using advanced AI algorithms'
                        : 'Click the button below to start the AI generation process'}
                    </p>
                  </div>

                  {!isGenerating && (
                    <Button
                      onClick={simulateGeneration}
                      className="px-8 py-3"
                      size="lg"
                    >
                      <Wand2 size={16} className="mr-2" />
                      Generate with AI
                    </Button>
                  )}
                </motion.div>
              )}

              {generationStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-green-600 mb-4">
                    <CheckCircle size={20} />
                    <span className="font-semibold">Generation Complete!</span>
                  </div>

                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 max-h-48 sm:max-h-60 overflow-y-auto">
                    <h4 className="font-semibold mb-2">Generated Content Preview:</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {selectedTool === 'sop' && (
                        <p>
                          "My passion for computer science began during my undergraduate studies in Engineering, where I discovered the transformative power of technology in solving real-world problems. Through various projects and internships, I have developed strong analytical skills and a deep understanding of software development principles. My goal is to pursue a Master's degree in Computer Science at TU Munich to advance my knowledge in artificial intelligence and machine learning..."
                        </p>
                      )}
                      {selectedTool === 'lor' && (
                        <p>
                          "I am pleased to recommend [Student Name] for admission to your graduate program. During their time as my student in Advanced Algorithms, they consistently demonstrated exceptional analytical abilities and creative problem-solving skills. Their final project on optimization algorithms showed remarkable innovation and technical depth. [Student Name] possesses the intellectual curiosity and dedication necessary for success in graduate-level studies..."
                        </p>
                      )}
                      {selectedTool === 'cv' && (
                        <div className="space-y-2">
                          <p><strong>Software Engineer</strong></p>
                          <p>Experienced developer with 3+ years in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable solutions and leading technical initiatives.</p>
                          <p><strong>Experience:</strong> Software Developer at Tech Corp (2021-2024)</p>
                          <p><strong>Education:</strong> B.S. Computer Science, University (2021)</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                      <Copy size={14} className="mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                      <Download size={14} className="mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                      <RefreshCw size={14} className="mr-1" />
                      Regenerate
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer Actions */}
            {(generationStep === 1 || generationStep === 3) && (
              <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-3">
                  {generationStep === 1 && (
                    <>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={resetGeneration}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => setGenerationStep(2)}
                      >
                        Continue
                        <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </>
                  )}
                  {generationStep === 3 && (
                    <>
                      <Button variant="outline" className="flex-1">
                        <Save size={16} className="mr-2" />
                        Save Draft
                      </Button>
                      <Button className="flex-1" onClick={resetGeneration}>
                        <CheckCircle size={16} className="mr-2" />
                        Finalize
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderTemplates = () => (
    <AnimatePresence>
      {showTemplates && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6"
        >
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Available Templates</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTemplates(false)}
                className="sm:hidden"
              >
                <X size={16} />
              </Button>
            </div>
            <div className="space-y-6">
              {Object.entries(templates).map(([type, typeTemplates]) => (
                <div key={type}>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    {getToolIcon(type)}
                    {type.toUpperCase()} Templates
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {typeTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                      >
                        <h5 className="font-medium mb-1 text-sm sm:text-base">
                          {template.name}
                        </h5>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {template.description}
                        </p>
                        <div className="text-xs text-gray-500">
                          {template.usage} uses
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderHistory = () => (
    <AnimatePresence>
      {showHistory && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6"
        >
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <History size={20} />
                Recent Generations
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(false)}
                className="sm:hidden"
              >
                <X size={16} />
              </Button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {generationHistory.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {getToolIcon(item.type)}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm sm:text-base truncate">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mt-1">
                        <Clock size={12} />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        {item.wordCount > 0 && (
                          <>
                            <span>•</span>
                            <span className="hidden sm:inline">{item.wordCount} words</span>
                            <span className="sm:hidden">{item.wordCount}w</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.status === 'completed' ? (
                      <CheckCircle className="text-green-600" size={16} />
                    ) : (
                      <Clock className="text-yellow-600" size={16} />
                    )}
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                      <Eye size={14} className="mr-1" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <motion.div 
      className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div 
        className="text-center max-w-2xl mx-auto"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">AI-Powered Tools</h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Generate professional documents with our AI assistants
        </p>
      </motion.div>

      {/* Mobile Action Buttons */}
      <div className="flex flex-wrap gap-2 sm:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowTemplates(!showTemplates)}
        >
          <Eye size={16} className="mr-1" />
          Templates
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHistory(!showHistory)}
        >
          <History size={16} className="mr-1" />
          History
        </Button>
      </div>

      {/* Desktop Action Buttons */}
      <div className="hidden sm:flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => setShowTemplates(!showTemplates)}
        >
          <Eye size={20} className="mr-2" />
          {showTemplates ? 'Hide' : 'View'} Templates
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowHistory(!showHistory)}
        >
          <History size={20} className="mr-2" />
          {showHistory ? 'Hide' : 'View'} History
        </Button>
      </div>

      {/* AI Tools Grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {aiTools.map((tool, index) => {
          const IconComponent = tool.icon;
          return (
            <motion.div
              key={tool.id}
              variants={item}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-4 sm:p-6 h-full flex flex-col hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${tool.color}`}>
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="text-right text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Sparkles size={12} />
                      <span>{tool.rating}</span>
                    </div>
                    <div className="hidden sm:block">{tool.usage.toLocaleString()} uses</div>
                    <div className="sm:hidden">{(tool.usage / 1000).toFixed(1)}k</div>
                  </div>
                </div>
                
                <h3 className="font-bold text-lg sm:text-xl mb-2">{tool.name}</h3>
                <p className="text-muted-foreground text-sm sm:text-base mb-4 flex-1">{tool.description}</p>
                
                <div className="space-y-2 mb-4 sm:mb-6">
                  {tool.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      <span className="truncate">{feature}</span>
                    </div>
                  ))}
                  {tool.features.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{tool.features.length - 3} more features
                    </div>
                  )}
                </div>
                
                <Button 
                  className="w-full rounded-xl group"
                  onClick={() => startGeneration(tool.id)}
                >
                  Open Tool
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Templates Section */}
      {renderTemplates()}

      {/* History Section */}
      {renderHistory()}

      {/* Usage Stats */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 sm:mt-12"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-primary">12</div>
          <div className="text-xs sm:text-sm text-muted-foreground">Documents Generated</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-green-600">8</div>
          <div className="text-xs sm:text-sm text-muted-foreground">Successfully Used</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">4.8/5</div>
          <div className="text-xs sm:text-sm text-muted-foreground">Average Rating</div>
        </Card>
      </motion.div>

      {/* Generation Modal */}
      {selectedTool && renderGenerationModal()}

      {/* Mobile Bottom Navigation Spacer */}
      <div className="h-20 sm:hidden" />
    </motion.div>
  );
};

export default AITools;