import { useState, useEffect } from 'react';
import { Search, ExternalLink, Filter, CreditCard, Lock, Smartphone, QrCode, X, Check, BookMarked } from 'lucide-react';
import { motion } from 'framer-motion';
import React from 'react';

/* ---------- Types ---------- */
type ResourceCategory = 'language' | 'services' | 'guides' | 'checklists' | 'scholarships' | 'calculators';
type ResourceType = 'Service' | 'Guide' | 'Checklist' | 'Scholarship' | 'Language Course' | 'Calculator';

interface Resource {
  id: number;
  title: string;
  description: string;
  category: ResourceCategory;
  type: ResourceType;
  readTime: string;
  tags: string[];
  featured?: boolean;
  isService?: boolean;
  isPremium?: boolean;
  isCalculator?: boolean;
  redirectLink?: string;
  price?: string; // for premium items
  isInterviewPrep?: boolean;
}

interface PaymentMethod {
  id: 'card' | 'upi' | 'wallet' | (string & {});
  label: string;
  icon: React.ComponentType<any>;
  popular?: boolean;
}

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Resource | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod['id']>('card');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);
  const [selectedCalculator, setSelectedCalculator] = useState<Resource | null>(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<'germany' | 'uk' | null>(null);
  const [showInterviewQuestions, setShowInterviewQuestions] = useState(false);
  const [showInterviewPayment, setShowInterviewPayment] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showFlightModal, setShowFlightModal] = useState(false);

  // Advanced filter states
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  const categories = [
    { id: 'all', label: 'All Resources', count: 24 },
    { id: 'language', label: 'Language Prep', count: 3 },
    { id: 'services', label: 'Services', count: 4 },
    { id: 'guides', label: 'Study Guides', count: 6 },
    { id: 'checklists', label: 'Checklists', count: 4 },
    { id: 'scholarships', label: 'Scholarships', count: 3 },
    { id: 'calculators', label: 'Calculators', count: 3 }
  ];

  const resources: Resource[] = [
    {
      id: 1,
      title: 'Document Translation Services',
      description: 'Professional translation services for academic documents, certificates, and official papers required for study abroad applications. Get certified translations for your university applications.',
      category: 'services',
      type: 'Service',
      readTime: 'Quick service',
      tags: ['Translation', 'Documents', 'Certified'],
      featured: true,
      isService: true,
      redirectLink: '#'
    },
    {
      id: 2,
      title: 'Accommodation Assistance',
      description: 'We provide accommodation help to find suitable housing in Germany and UK for international students. Find verified student-friendly accommodations near your university.',
      category: 'services',
      type: 'Service',
      readTime: 'Personalized help',
      tags: ['Germany', 'UK', 'Housing', 'Student'],
      featured: true,
      isService: true,
      redirectLink: '#'
    },
    {
      id: 3,
      title: 'APS Eligibility Checker',
      description: 'Check your eligibility for APS (Academic Procedure for Students) certification required for studying in Germany. Quick assessment tool to determine if you meet the requirements.',
      category: 'services',
      type: 'Service',
      readTime: 'Quick check',
      tags: ['Germany', 'APS', 'Eligibility', 'Assessment'],
      featured: true,
      isService: true,
      redirectLink: 'https://aps-india.de/aps-quiz/'
    },
    {
      id: 4,
      title: 'Complete Guide to Studying in Germany',
      description: 'Comprehensive guide covering everything from applications to living in Germany',
      category: 'guides',
      type: 'Guide',
      readTime: '15 min read',
      tags: ['Germany', 'Universities', 'Student Life'],
      featured: true
    },
    {
      id: 5,
      title: 'UK Student Visa Application Checklist',
      description: 'Step-by-step checklist for UK student visa applications',
      category: 'checklists',
      type: 'Checklist',
      readTime: '5 min read',
      tags: ['UK', 'Visa', 'Documents']
    },
    {
      id: 6,
      title: 'DAAD Scholarships for International Students',
      description: 'Overview of German Academic Exchange Service scholarships',
      category: 'scholarships',
      type: 'Scholarship',
      readTime: '8 min read',
      tags: ['Germany', 'Funding', 'DAAD'],
      featured: true
    },
    {
      id: 7,
      title: 'English Language Requirements Guide',
      description: 'Understanding IELTS, TOEFL, and other English proficiency tests',
      category: 'guides',
      type: 'Guide',
      readTime: '12 min read',
      tags: ['IELTS', 'TOEFL', 'English']
    },
    {
      id: 8,
      title: 'Pre-Departure Checklist',
      description: 'Essential items and tasks before traveling to study abroad',
      category: 'checklists',
      type: 'Checklist',
      readTime: '7 min read',
      tags: ['Preparation', 'Travel', 'Essentials']
    },
    {
      id: 9,
      title: 'IELTS Preparation Course',
      description: 'Comprehensive IELTS preparation with practice tests, speaking sessions, and expert guidance. Boost your band score with our structured learning approach.',
      category: 'language',
      type: 'Language Course',
      readTime: 'Course Access',
      tags: ['IELTS', 'Test Prep', 'English', 'Premium'],
      featured: true,
      isPremium: true,
      price: '₹2,999',
      redirectLink: 'http://elearning.uni360degree.com'
    },
    {
      id: 10,
      title: 'Spoken English Mastery',
      description: 'Improve your spoken English skills with interactive sessions, pronunciation practice, and confidence-building exercises. Perfect for international students.',
      category: 'language',
      type: 'Language Course',
      readTime: 'Course Access',
      tags: ['Speaking', 'English', 'Communication', 'Premium'],
      featured: true,
      isPremium: true,
      price: '₹2,999',
      redirectLink: 'http://elearning.uni360degree.com'
    },
    {
      id: 11,
      title: 'German Language Learning',
      description: 'Learn German from basics to intermediate level. Essential for students planning to study in Germany. Includes grammar, vocabulary, and conversation practice.',
      category: 'language',
      type: 'Language Course',
      readTime: 'Course Access',
      tags: ['German', 'Language', 'A1-B1', 'Premium'],
      featured: true,
      isPremium: true,
      price: '₹2,999',
      redirectLink: 'http://elearning.uni360degree.com'
    },
    {
      id: 12,
      title: 'IELTS Band Calculator',
      description: 'Accurately calculate your IELTS band score based on raw scores for listening, reading, and provided bands for writing and speaking.',
      category: 'calculators',
      type: 'Calculator',
      readTime: 'Instant Calculation',
      tags: ['IELTS', 'Score', 'English'],
      featured: true,
      isCalculator: true,
      redirectLink: '/ielts-calculator'
    },
    {
      id: 13,
      title: 'ECTS Credit Calculator',
      description: 'Convert your weekly lecture and self-study hours into ECTS credits for European universities.',
      category: 'calculators',
      type: 'Calculator',
      readTime: 'Instant Calculation',
      tags: ['ECTS', 'Credits', 'Europe'],
      featured: true,
      isCalculator: true,
      redirectLink: '/ects-calculator'
    },
    {
      id: 14,
      title: 'German Grade Calculator',
      description: 'Convert your grades from other systems to the German grading scale using the modified Bavarian formula.',
      category: 'calculators',
      type: 'Calculator',
      readTime: 'Instant Calculation',
      tags: ['Germany', 'Grades', 'Conversion'],
      featured: true,
      isCalculator: true,
      redirectLink: '/german-grade-calculator'
    },
    {
      id: 15,
      title: 'Visa Interview Preparation',
      description: 'Comprehensive preparation for student visa interviews with commonly asked questions, expert answers, and country-specific guidance for Germany and UK applications.',
      category: 'services',
      type: 'Service',
      readTime: 'Interactive prep',
      tags: ['Interview', 'Visa', 'Germany', 'UK', 'Preparation'],
      featured: true,
      isService: true,
      isInterviewPrep: true,
      redirectLink: '#'
    },
    {
      id: 16,
      title: 'Flight Booking Assistance',
      description: 'Get help with booking affordable flights for your study abroad journey. We assist you in finding the best flight deals and routes to your destination country.',
      category: 'services',
      type: 'Service',
      readTime: 'Quick service',
      tags: ['Flight', 'Travel', 'Booking', 'International'],
      featured: true,
      isService: true,
      redirectLink: 'https://your-flight-booking-link.com'
    }
    
  ];

  const paymentMethods: PaymentMethod[] = [
    { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, popular: true },
    { id: 'upi', label: 'UPI Payment', icon: Smartphone },
    { id: 'wallet', label: 'Digital Wallets', icon: QrCode }
  ];

  // Get all unique types and tags for filter options
  const uniqueTypes = ['all', ...Array.from(new Set(resources.map(r => r.type)))];
  const allTags = Array.from(new Set(resources.flatMap(r => r.tags)));

  const filteredResources = resources.filter(resource => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === (selectedCategory as ResourceCategory);
    const matchesType = selectedType === 'all' || resource.type === (selectedType as ResourceType);
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => resource.tags.includes(tag));
    const matchesFeatured = !showFeaturedOnly || !!resource.featured;
    const matchesPremium = !showPremiumOnly || !!resource.isPremium;

    return matchesSearch && matchesCategory && matchesType && matchesTags && matchesFeatured && matchesPremium;
  });

  const handleCourseAccess = (resource: Resource) => {
    if (resource.isPremium) {
      setSelectedCourse(resource);
      setShowPaymentModal(true);
    } else if (resource.isInterviewPrep) {
      setShowInterviewModal(true);
    } else if (resource.isService && resource.redirectLink) {
      if (resource.id === 16) {
        setShowFlightModal(true);
      } else {
        window.open(resource.redirectLink, '_blank');
      }
    } else if (resource.isCalculator) {
      setSelectedCalculator(resource);
      setShowCalculatorModal(true);
    }
  };

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setShowPaymentModal(false);
      if (selectedCourse?.redirectLink) {
        window.open(selectedCourse.redirectLink, '_blank');
      }
      setSelectedCourse(null);
    }, 1000);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => (prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]));
  };

  const clearAllFilters = () => {
    setSelectedType('all');
    setSelectedTags([]);
    setShowFeaturedOnly(false);
    setShowPremiumOnly(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowAdvancedFilters(false);
    }
  };

  const interviewQuestions = {
    germany: [
      {
        question: "Why do you want to study in Germany?",
        answer: "I want to study in Germany because of its excellent education system, particularly strong engineering programs, and the opportunity to learn German language and culture. Germany offers high-quality education with relatively low tuition fees and great research opportunities."
      },
      {
        question: "How will you finance your studies?",
        answer: "I have sufficient funds through my family savings, education loan from [Bank Name], and I've also applied for scholarships. I have shown blocked account of €11,208 as proof of financial support."
      },
      {
        question: "What are your plans after graduation?",
        answer: "After graduation, I plan to gain some work experience in Germany using the 18-month job search visa, and then return to my home country to contribute to its development using the knowledge and skills I've gained."
      }
    ],
    uk: [
      {
        question: "Why did you choose to study in the UK?",
        answer: "The UK has world-renowned universities with excellent academic standards. The education system emphasizes critical thinking and practical application, which aligns with my career goals. Additionally, the multicultural environment will enhance my global perspective."
      },
      {
        question: "How do you plan to fund your studies?",
        answer: "My studies will be funded through a combination of family savings, an education loan, and potentially part-time work (up to 20 hours per week as permitted). I have demonstrated sufficient funds to cover tuition and living expenses."
      },
      {
        question: "What will you do after your studies?",
        answer: "I plan to return to my home country after completing my studies to apply the knowledge and skills I've gained to contribute to my country's development in my chosen field."
      }
    ]
  };

  // New Advanced Filters Modal - completely rewritten
 // New Advanced Filters Modal - Truly Compact with NO Scrolling
const NewAdvancedFiltersModal = () => {
  if (!showAdvancedFilters) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleOverlayClick}
      />
      
      {/* Modal Content - Fixed size, no overflow */}
      <div className="relative glass rounded-2xl w-full max-w-lg shadow-2xl border border-border bg-card/95 backdrop-blur-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Advanced Filters
          </h3>
          <button 
            onClick={() => setShowAdvancedFilters(false)}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content - All visible without scrolling */}
        <div className="p-4 space-y-4">
          
          {/* Resource Type Filter */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">
              Resource Type
            </h4>
            <div className="grid grid-cols-3 gap-1.5">
              {uniqueTypes.slice(0, 6).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`px-2 py-1.5 rounded text-xs font-medium transition-all truncate ${
                    selectedType === type 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                  }`}
                >
                  {type === 'all' ? 'All' : type}
                </button>
              ))}
            </div>
          </div>

          {/* Tags Filter - Limited to most important */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">
              Popular Tags
            </h4>
            <div className="grid grid-cols-4 gap-1">
              {allTags.slice(0, 8).map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all truncate ${
                    selectedTags.includes(tag)
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Special Filters */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">
              Special Filters
            </h4>
            <div className="grid grid-cols-2 gap-2">
              
              {/* Featured Toggle */}
              <button 
                type="button"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-left"
                onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                  showFeaturedOnly 
                    ? 'bg-primary border-primary' 
                    : 'border-muted-foreground/30'
                }`}>
                  {showFeaturedOnly && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                </div>
                <span className="text-xs text-foreground">
                  Featured only
                </span>
              </button>

              {/* Premium Toggle */}
              <button 
                type="button"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-left"
                onClick={() => setShowPremiumOnly(!showPremiumOnly)}
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                  showPremiumOnly 
                    ? 'bg-primary border-primary' 
                    : 'border-muted-foreground/30'
                }`}>
                  {showPremiumOnly && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                </div>
                <span className="text-xs text-foreground">
                  Premium only
                </span>
              </button>
              
            </div>
          </div>

          {/* Results Count */}
          <div className="text-center text-sm text-muted-foreground py-2 border-t border-border">
            {filteredResources.length} resources found
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2 p-4 border-t border-border bg-muted/10">
          <button 
            type="button"
            onClick={clearAllFilters}
            className="flex-1 py-2.5 px-3 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium text-sm"
          >
            Clear All
          </button>
          <button 
            type="button"
            onClick={() => setShowAdvancedFilters(false)}
            className="flex-1 py-2.5 px-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

  /* ---------- Payment Modal ---------- */
  /* ---------- Payment Modal ---------- */
  // Payment Modal Component
  const PaymentModal = () => {
    if (!showPaymentModal || !selectedCourse) return null;

    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)} />
        
        <motion.div
          className="relative bg-card rounded-xl w-full max-w-xs shadow-2xl border border-border"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
        >
          <div className="p-4">
            {/* Header */}
            <div className="text-center mb-3">
              <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-1">
                <Lock className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-base font-semibold mb-1">Access Premium Course</h3>
              <p className="text-muted-foreground text-xs">{selectedCourse.title}</p>
            </div>

            {/* Pricing */}
            <div className="text-center mb-3">
              <div className="text-lg font-bold text-primary">₹2,999</div>
              <div className="text-xs text-muted-foreground line-through">₹4,999</div>
              <div className="text-xs text-green-600 font-medium">Save 40%</div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-3">
              <h4 className="text-xs font-medium mb-2">Choose Payment Method</h4>
              <div className="space-y-1.5">
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <label
                      key={method.id}
                      className={`relative flex items-center p-2 border rounded-lg cursor-pointer transition-all ${
                        selectedPaymentMethod === method.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedPaymentMethod === method.id}
                        onChange={() => setSelectedPaymentMethod(method.id)}
                        className="sr-only"
                      />
                      <IconComponent className="h-3.5 w-3.5 text-muted-foreground mr-2" />
                      <span className="text-xs font-medium flex-1">{method.label}</span>
                      {method.popular && (
                        <span className="text-xs bg-green-100 text-green-700 px-1 py-0.5 rounded-full mr-1">Popular</span>
                      )}
                      <div className={`w-3 h-3 rounded-full border-2 ${
                        selectedPaymentMethod === method.id
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground/30'
                      }`}>
                        {selectedPaymentMethod === method.id && (
                          <div className="w-1 h-1 bg-white rounded-full mx-auto mt-0.5"></div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Payment Form */}
            {selectedPaymentMethod === 'card' && (
              <div className="space-y-2 mb-3">
                <input
                  type="text"
                  placeholder="Card Number"
                  className="w-full p-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full p-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    maxLength={3}
                    className="w-full p-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs"
                  />
                </div>
              </div>
            )}

            {selectedPaymentMethod === 'upi' && (
              <div className="space-y-2 mb-3">
                <input
                  type="text"
                  placeholder="UPI ID (e.g., yourname@paytm)"
                  className="w-full p-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs"
                />
              </div>
            )}

            {selectedPaymentMethod === 'wallet' && (
              <div className="mb-3">
                <div className="grid grid-cols-2 gap-1.5">
                  <button className="p-1.5 border border-border rounded-lg hover:border-primary/50 text-xs font-medium transition-colors">
                    Paytm
                  </button>
                  <button className="p-1.5 border border-border rounded-lg hover:border-primary/50 text-xs font-medium transition-colors">
                    PhonePe
                  </button>
                  <button className="p-1.5 border border-border rounded-lg hover:border-primary/50 text-xs font-medium transition-colors">
                    GPay
                  </button>
                  <button className="p-1.5 border border-border rounded-lg hover:border-primary/50 text-xs font-medium transition-colors">
                    Amazon
                  </button>
                </div>
              </div>
            )}

            {/* Security notice */}
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-3">
              <Lock className="h-2.5 w-2.5" />
              <span>Secured with SSL</span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-2 px-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 py-2 px-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-xs flex items-center justify-center gap-1"
              >
                Pay ₹2,999
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  /* ---------- Calculator Modal ---------- */
  const CalculatorModal = () => {
    if (!showCalculatorModal || !selectedCalculator) return null;

    let CalculatorComponent: React.ComponentType<{ isModal?: boolean }>;
    switch (selectedCalculator.id) {
      case 12:
        CalculatorComponent = IeltsCalculator;
        break;
      case 13:
        CalculatorComponent = EctsCalculator;
        break;
      case 14:
        CalculatorComponent = GermanGradeCalculatorComponent;
        break;
      default:
        return null;
    }

    return (
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCalculatorModal(false)} />

<motion.div
          className="relative bg-card rounded-xl w-full max-w-5xl shadow-2xl border border-border max-h-[90vh] overflow-y-auto hide-scrollbar"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.3 }}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-primary">{selectedCalculator.title}</h3>
              <button type="button" onClick={() => setShowCalculatorModal(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-6">{selectedCalculator.description}</p>
            <CalculatorComponent isModal={true} />
          </div>
        </motion.div>
      </motion.div>
    );
  };

  /* ---------- Interview Preparation Modals ---------- */
const InterviewCountryModal = () => {
  if (!showInterviewModal) return null;

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowInterviewModal(false)} />
      
      <motion.div
        className="relative bg-card rounded-xl w-full max-w-md shadow-2xl border border-border"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.3 }}
      >
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">Choose Your Destination</h3>
            <p className="text-muted-foreground text-sm">Select the country for visa interview preparation</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setSelectedCountry('germany');
                setShowInterviewModal(false);
                setShowInterviewQuestions(true);
              }}
              className="w-full p-4 border border-border rounded-lg hover:border-primary/50 transition-all text-left"
            >
              <div className="font-medium">Germany</div>
              <div className="text-sm text-muted-foreground">Student visa interview preparation</div>
            </button>
            
            <button
              onClick={() => {
                setSelectedCountry('uk');
                setShowInterviewModal(false);
                setShowInterviewQuestions(true);
              }}
              className="w-full p-4 border border-border rounded-lg hover:border-primary/50 transition-all text-left"
            >
              <div className="font-medium">United Kingdom</div>
              <div className="text-sm text-muted-foreground">Student visa interview preparation</div>
            </button>
          </div>

          <button
            onClick={() => setShowInterviewModal(false)}
            className="w-full mt-4 py-2 px-4 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const InterviewQuestionsModal = () => {
  if (!showInterviewQuestions || !selectedCountry) return null;

  const questions = interviewQuestions[selectedCountry];

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => {
        setShowInterviewQuestions(false);
        setSelectedCountry(null);
      }} />
      
      <motion.div
        className="relative bg-card rounded-xl w-full max-w-4xl shadow-2xl border border-border max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.3 }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-primary">
                {selectedCountry === 'germany' ? 'Germany' : 'UK'} Visa Interview Questions
              </h3>
              <p className="text-muted-foreground text-sm">Common questions and sample answers</p>
            </div>
            <button 
              onClick={() => {
                setShowInterviewQuestions(false);
                setSelectedCountry(null);
              }}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-6 mb-8">
            {questions.map((qa, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Q{index + 1}. {qa.question}</h4>
                <p className="text-muted-foreground">{qa.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center p-6 bg-primary/5 rounded-lg border border-primary/20">
            <h4 className="font-semibold mb-2">Want More Questions & Expert Templates?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get access to 50+ interview questions, country-specific templates, and expert guidance
            </p>
            <button
              onClick={() => {
                setShowInterviewQuestions(false);
                setShowInterviewPayment(true);
              }}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Download Premium Templates - ₹1,999
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const InterviewPaymentModal = () => {
  if (!showInterviewPayment || !selectedCountry) return null;

  const handleInterviewPayment = () => {
    setTimeout(() => {
      setShowInterviewPayment(false);
      setShowDownloadModal(true);
    }, 1000);
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowInterviewPayment(false)} />
      
      <motion.div
        className="relative bg-card rounded-xl w-full max-w-xs shadow-2xl border border-border"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.3 }}
      >
        <div className="p-4">
          <div className="text-center mb-3">
            <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-1">
              <Lock className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-base font-semibold mb-1">Premium Interview Templates</h3>
            <p className="text-muted-foreground text-xs">
              {selectedCountry === 'germany' ? 'Germany' : 'UK'} Visa Interview Preparation
            </p>
          </div>

          <div className="text-center mb-3">
            <div className="text-lg font-bold text-primary">₹1,999</div>
            <div className="text-xs text-muted-foreground line-through">₹2,999</div>
            <div className="text-xs text-green-600 font-medium">Save 33%</div>
          </div>

          <div className="space-y-2 mb-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-3 w-3 text-green-600" />
              50+ Interview Questions & Answers
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-3 w-3 text-green-600" />
              Country-specific Templates
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-3 w-3 text-green-600" />
              Expert Tips & Guidance
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowInterviewPayment(false)}
              className="flex-1 py-2 px-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleInterviewPayment}
              className="flex-1 py-2 px-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-xs"
            >
              Pay ₹1,999
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const DownloadTemplatesModal = () => {
  if (!showDownloadModal || !selectedCountry) return null;

  const templates = selectedCountry === 'germany' ? [
    { name: 'Germany Visa Interview Template 1', link: '/templates/germany/template1.pdf' },
    { name: 'Germany Visa Interview Template 2', link: '/templates/germany/template2.pdf' },
    { name: 'Germany Visa Interview Template 3', link: '/templates/germany/template3.pdf' },
    { name: 'Germany Visa Interview Template 4', link: '/templates/germany/template4.pdf' },
  ] : [
    { name: 'UK Visa Interview Template 1', link: '/templates/uk/template1.pdf' },
    { name: 'UK Visa Interview Template 2', link: '/templates/uk/template2.pdf' },
    { name: 'UK Visa Interview Template 3', link: '/templates/uk/template3.pdf' },
    { name: 'UK Visa Interview Template 4', link: '/templates/uk/template4.pdf' },
  ];

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => {
        setShowDownloadModal(false);
        setSelectedCountry(null);
      }} />
      
      <motion.div
        className="relative bg-card rounded-xl w-full max-w-md shadow-2xl border border-border"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.3 }}
      >
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">Download Your Templates</h3>
            <p className="text-muted-foreground text-sm">Click below to download the templates</p>
          </div>

          <div className="space-y-3">
            {templates.map((template, index) => (
              <a
                key={index}
                href={template.link}
                download
                className="block w-full p-4 border border-border rounded-lg hover:border-primary/50 transition-all text-left"
              >
                <div className="font-medium">{template.name}</div>
              </a>
            ))}
          </div>

          <button
            onClick={() => {
              setShowDownloadModal(false);
              setSelectedCountry(null);
            }}
            className="w-full mt-4 py-2 px-4 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FlightBookingModal = () => {
  if (!showFlightModal) return null;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tripType: 'ONEWAY',
    travelClass: 'ECONOMY',
    adult: '1',
    childCount: '0',
    childAges: '',
    fromAirport: '',
    toAirport: '',
    departureDate: '',
    returnDate: '',
    reason: '',
    approverName: '',
    approverEmail: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const childAgesArray = formData.childAges.split(',').map(age => parseInt(age.trim())).filter(age => !isNaN(age));

    const journeyDetails = [
      {
        from: {
          airportCode: formData.fromAirport.toUpperCase(),
          cityName: '',
          countryCode: 'IN',
          countryName: 'India',
        },
        to: {
          airportCode: formData.toAirport.toUpperCase(),
          cityName: '',
          countryCode: 'IN',
          countryName: 'India',
        },
        departureDate: new Date(formData.departureDate).getTime(),
        arrivalDate: 0,
      },
    ];

    if (formData.tripType === 'ROUND_TRIP' && formData.returnDate) {
      journeyDetails.push({
        from: {
          airportCode: formData.toAirport.toUpperCase(),
          cityName: '',
          countryCode: 'IN',
          countryName: 'India',
        },
        to: {
          airportCode: formData.fromAirport.toUpperCase(),
          cityName: '',
          countryCode: 'IN',
          countryName: 'India',
        },
        departureDate: new Date(formData.returnDate).getTime(),
        arrivalDate: 0,
      });
    }

    const payload = {
      deviceDetails: {
        version: '1.0',
        platform: 'DESKTOP',
      },
      travellerDetails: {
        paxDetails: [
          {
            name: formData.name,
            email: formData.email,
            isPrimaryPax: true,
          },
        ],
      },
      services: {
        FLIGHT: [
          {
            serviceId: Date.now().toString(),
            tripType: formData.tripType,
            travelClass: formData.travelClass,
            paxDetails: {
              adult: parseInt(formData.adult),
              child: {
                count: parseInt(formData.childCount),
                age: childAgesArray,
              },
              infant: 0,
            },
            journeyDetails,
          },
        ],
        HOTEL: [],
      },
      reasonForTravel: {
        reason: formData.reason,
      },
      approvalDetails: {
        approvalRequired: true,
        approverDetails: [
          {
            approvalLevel: 1,
            name: formData.approverName,
            emailId: formData.approverEmail,
          },
        ],
      },
      trfId: Date.now().toString(),
    };

    try {
      const response = await fetch('/corporate/v1/create/partner/travel-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'partner-apikey': 'YOUR_PARTNER_API_KEY', // Replace with actual key shared by myBiz team
          'client-code': 'YOUR_CLIENT_CODE', // Replace with actual code shared by myBiz team
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.status === 'success' && data.travelRequestUrl) {
        window.open(data.travelRequestUrl, '_blank');
      }
      setShowFlightModal(false);
    } catch (error) {
      console.error('Error submitting travel request:', error);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowFlightModal(false)} />
      <motion.div
        className="relative bg-card rounded-xl w-full max-w-md shadow-2xl border border-border overflow-y-auto max-h-[90vh]"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', duration: 0.3 }}
      >
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Flight Booking Request</h3>
          <div className="space-y-4">
            <input name="name" onChange={handleChange} value={formData.name} placeholder="Full Name" className="w-full p-2 border rounded" />
            <input name="email" onChange={handleChange} value={formData.email} placeholder="Email" className="w-full p-2 border rounded" />
            <select name="tripType" onChange={handleChange} value={formData.tripType} className="w-full p-2 border rounded">
              <option value="ONEWAY">One Way</option>
              <option value="ROUND_TRIP">Round Trip</option>
              <option value="MULTICITY">Multi City</option>
            </select>
            <select name="travelClass" onChange={handleChange} value={formData.travelClass} className="w-full p-2 border rounded">
              <option value="ECONOMY">Economy</option>
              <option value="PREMIUM_ECONOMY">Premium Economy</option>
              <option value="BUSINESS">Business</option>
            </select>
            <input name="adult" type="number" min="1" onChange={handleChange} value={formData.adult} placeholder="Number of Adults" className="w-full p-2 border rounded" />
            <input name="childCount" type="number" min="0" onChange={handleChange} value={formData.childCount} placeholder="Number of Children" className="w-full p-2 border rounded" />
            <input name="childAges" onChange={handleChange} value={formData.childAges} placeholder="Child Ages (comma separated)" className="w-full p-2 border rounded" />
            <input name="fromAirport" onChange={handleChange} value={formData.fromAirport} placeholder="From Airport Code (e.g., BLR)" className="w-full p-2 border rounded" />
            <input name="toAirport" onChange={handleChange} value={formData.toAirport} placeholder="To Airport Code (e.g., HYD)" className="w-full p-2 border rounded" />
            <input name="departureDate" type="date" onChange={handleChange} value={formData.departureDate} className="w-full p-2 border rounded" />
            {formData.tripType === 'ROUND_TRIP' && (
              <input name="returnDate" type="date" onChange={handleChange} value={formData.returnDate} className="w-full p-2 border rounded" />
            )}
            <input name="reason" onChange={handleChange} value={formData.reason} placeholder="Reason for Travel" className="w-full p-2 border rounded" />
            <input name="approverName" onChange={handleChange} value={formData.approverName} placeholder="Approver Name" className="w-full p-2 border rounded" />
            <input name="approverEmail" onChange={handleChange} value={formData.approverEmail} placeholder="Approver Email" className="w-full p-2 border rounded" />
            <div className="flex gap-2">
              <button onClick={() => setShowFlightModal(false)} className="flex-1 py-2 bg-muted rounded">Cancel</button>
              <button onClick={handleSubmit} className="flex-1 py-2 bg-primary text-white rounded">Submit Request</button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold mb-2">Resources</h1>
        <p className="text-muted-foreground">Curated guides, checklists, and information to support your study abroad journey</p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div className="flex flex-col md:flex-row gap-4 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowAdvancedFilters(true)}
          className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-xl hover:bg-card-hover transition-colors"
        >
          <Filter className="h-5 w-5" />
          Advanced Filters
        </button>
      </motion.div>

      {/* Category Filters */}
      <motion.div className="flex flex-wrap gap-2 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
        {categories.map(category => (
          <button
            key={category.id}
            type="button"
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-pill text-sm font-medium transition-all duration-180 ${
              selectedCategory === category.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            }`}
          >
            {category.label}
          </button>
        ))}
      </motion.div>

      {/* Featured Resources Banner */}
      <motion.div
        className="glass rounded-2xl p-6 mb-8 bg-gradient-to-r from-primary/5 to-accent/5"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="text-2xl text-primary">
            <BookMarked />
          </div>
          <h2 className="text-xl font-semibold">Featured Resources</h2>
        </div>
        <p className="text-muted-foreground">Hand-picked resources that will help you succeed in your study abroad journey</p>
      </motion.div>

      {/* Resources Grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.4 }}>
        {filteredResources.map((resource, index) => (
          <motion.div
            key={resource.id}
            className="glass rounded-2xl p-6 hover-lift ring-2 ring-primary/20 bg-primary/5 flex flex-col relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: index * 0.12 }}
          >
            {/* Premium Badge placeholder (optional) */}
            {resource.isPremium && <div className="absolute -top-2 -right-2" />}

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-pill text-sm font-medium ${
                    ['Guide', 'Language Course', 'Scholarship', 'Checklist'].includes(resource.type)
                      ? 'bg-primary/10 text-primary'
                      : resource.type === 'Service' || resource.type === 'Calculator'
                      ? 'bg-primary/20 text-primary'
                      : 'bg-gunmetal/10 text-warning'
                  }`}
                >
                  {resource.type}
                </span>
              </div>
              {resource.isPremium && (
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">{resource.price}</div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-grow">
              <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{resource.description}</p>

              <div className="text-sm text-muted-foreground mb-4">
                {resource.readTime}
                {resource.isPremium && resource.price && <span className="ml-2 text-primary font-semibold">• {resource.price}</span>}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {resource.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action */}
            <button
              type="button"
              onClick={() => handleCourseAccess(resource)}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl hover-lift press-effect font-medium"
            >
              {resource.isPremium ? (
                <>
                  <Lock className="h-4 w-4" />
                  Access Course
                </>
              ) : resource.isService ? (
                <>
                  {resource.title.includes('Translation') ? 'Get Translation Quote' : 
     resource.title.includes('Accommodation') ? 'Accommodation Assistance' : 
     resource.title.includes('APS') ? 'Check APS Eligibility' :
     resource.title.includes('Interview') ? 'Start Interview Prep' :
     'Get Service'}
                  <ExternalLink className="h-4 w-4" />
                </>
              ) : resource.isCalculator ? (
                <>
                  Open Calculator
                  <ExternalLink className="h-4 w-4" />
                </>
              ) : (
                <>
                  Read More
                  <ExternalLink className="h-4 w-4" />
                </>
              )}
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* Modals */}
      <NewAdvancedFiltersModal />
      <PaymentModal />
      <CalculatorModal />
      <InterviewCountryModal />
      <InterviewQuestionsModal />
      <InterviewPaymentModal />
      <DownloadTemplatesModal />
      <FlightBookingModal />

      {/* Replace styled-jsx with standard style tag */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

/* ===================== Calculators ===================== */

// IELTS Calculator Component
class IELTSBandCalculator {
  calculateOverallBand(listening: number, reading: number, writing: number, speaking: number) {
    const average = (listening + reading + writing + speaking) / 4;
    return this.roundToHalfBand(average);
  }

  private roundToHalfBand(score: number) {
    const decimal = score % 1;
    const wholeNumber = Math.floor(score);

    if (decimal < 0.25) return wholeNumber;
    if (decimal < 0.75) return wholeNumber + 0.5;
    return wholeNumber + 1;
  }

  private interpretBand(bandScore: number) {
    const interpretations: Record<number, { level: string; description: string }> = {
      9.0: { level: 'Expert User', description: 'Near-native proficiency' },
      8.5: { level: 'Very Good User', description: 'Very high proficiency' },
      8.0: { level: 'Very Good User', description: 'High proficiency' },
      7.5: { level: 'Good User', description: 'Upper-intermediate+' },
      7.0: { level: 'Good User', description: 'Upper-intermediate proficiency' },
      6.5: { level: 'Competent User', description: 'Intermediate+' },
      6.0: { level: 'Competent User', description: 'Intermediate proficiency' },
      5.5: { level: 'Modest User', description: 'Basic+' },
      5.0: { level: 'Modest User', description: 'Basic proficiency' },
      4.5: { level: 'Limited User', description: 'Very basic+' },
      4.0: { level: 'Limited User', description: 'Very basic proficiency' },
      3.5: { level: 'Extremely Limited User', description: 'Minimal+' },
      3.0: { level: 'Extremely Limited User', description: 'Minimal proficiency' },
      2.5: { level: 'Intermittent User', description: 'Extremely limited+' },
      2.0: { level: 'Intermittent User', description: 'Extremely limited' },
      1.0: { level: 'Non-user', description: 'Virtually no proficiency' },
      0: { level: 'Did not attempt', description: 'No attempt' }
    };
    return interpretations[bandScore] || interpretations[0];
  }

  calculate(listeningBand: number, readingBand: number, writingBand: number, speakingBand: number) {
    const overallBand = this.calculateOverallBand(listeningBand, readingBand, writingBand, speakingBand);
    return {
      listening: listeningBand,
      reading: readingBand,
      writing: writingBand,
      speaking: speakingBand,
      overall: overallBand,
      interpretation: this.interpretBand(overallBand)
    };
  }
}

export function IeltsCalculator({ isModal = false }: { isModal?: boolean }) {
  const [scores, setScores] = useState({ listening: '', reading: '', writing: '', speaking: '' });
  const [result, setResult] = useState<any>(null);
  const calculator = new IELTSBandCalculator();

  const handleScoreChange = (section: keyof typeof scores, value: string) => {
    const next = { ...scores, [section]: value };
    setScores(next);
    calculateOverall(next);
  };

  const calculateOverall = (currentScores: typeof scores) => {
    const l = parseFloat(currentScores.listening) || 0;
    const r = parseFloat(currentScores.reading) || 0;
    const w = parseFloat(currentScores.writing) || 0;
    const s = parseFloat(currentScores.speaking) || 0;
    
    if (currentScores.listening === '' || currentScores.reading === '' || currentScores.writing === '' || currentScores.speaking === '') {
      setResult(null);
      return;
    }
    
    if ([l, r, w, s].some(v => v < 0 || v > 9)) {
      setResult(null);
      return;
    }
    
    const calcResult = calculator.calculate(l, r, w, s);
    setResult(calcResult);
  };

  return (
    <div className="space-y-6">
      {!isModal && (
        <>
          <button type="button" onClick={() => window.history.back()} className="mb-4 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
            Back to Resources
          </button>
          <h1 className="text-3xl font-bold mb-4 text-primary">IELTS Band Calculator</h1>
        </>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Enter Your Scores</h3>
          {(['listening', 'reading', 'writing', 'speaking'] as const).map(key => (
            <div className="space-y-2" key={key}>
              <label className="block text-sm font-medium text-foreground">{`${key[0].toUpperCase()}${key.slice(1)} Score (0-9)`}</label>
              <input
                type="number"
                step="0.5"
                placeholder={`${key[0].toUpperCase()}${key.slice(1)} Score`}
                className="w-full p-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                value={scores[key]}
                onChange={e => handleScoreChange(key, e.target.value)}
                min={0}
                max={9}
              />
            </div>
          ))}
        </div>

        <div className="p-4 bg-card rounded-xl border border-border">
          {result ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <h3 className="text-lg font-semibold mb-4 text-primary">Your IELTS Results</h3>
              <div className="space-y-3 mb-4">
                {(['listening', 'reading', 'writing', 'speaking'] as const).map(key => (
                  <div className="flex justify-between items-center p-2 bg-muted/50 rounded-lg" key={key}>
                    <span className="text-sm text-muted-foreground">{key[0].toUpperCase() + key.slice(1)}</span>
                    <span className="font-bold">{result[key]}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-primary/10 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Overall Band Score</span>
                  <span className="text-2xl font-bold text-primary">{result.overall}</span>
                </div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium mb-1">{result.interpretation.level}</p>
                <p className="text-sm text-muted-foreground">{result.interpretation.description}</p>
              </div>
            </motion.div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <p>Enter all scores to see results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- ECTS Calculator ---------- */
class ECTSCalculator {
  readonly HOURS_PER_ECTS: number = 30;

  calculate(lectureHoursPerWeek: string | number, selfStudyHoursPerWeek: string | number, weeksInSemester: string | number) {
    try {
      const lectureHours = parseFloat(String(lectureHoursPerWeek)) || 0;
      const selfStudyHours = parseFloat(String(selfStudyHoursPerWeek)) || 0;
      const weeks = parseInt(String(weeksInSemester)) || 0;

      this.validateInputs(lectureHours, selfStudyHours, weeks);

      const result = this.performCalculation(lectureHours, selfStudyHours, weeks);

      return {
        success: true,
        data: result,
        message: `Successfully calculated ${result.result.ectsCredits} ECTS credits`
      };
    } catch (error: any) {
      return { success: false, data: null, message: error.message };
    }
  }

  private validateInputs(lectureHours: number, selfStudyHours: number, weeks: number) {
    if (lectureHours < 0) throw new Error('Lecture hours cannot be negative');
    if (selfStudyHours < 0) throw new Error('Self-study hours cannot be negative');
    if (weeks <= 0 || weeks > 52) throw new Error('Weeks must be between 1 and 52');
    if (lectureHours === 0 && selfStudyHours === 0) throw new Error('At least one of lecture or self-study hours must be greater than 0');
  }

  private performCalculation(lectureHours: number, selfStudyHours: number, weeks: number) {
    const totalHoursPerWeek = lectureHours + selfStudyHours;
    const totalLectureHours = lectureHours * weeks;
    const totalSelfStudyHours = selfStudyHours * weeks;
    const totalStudyHours = totalHoursPerWeek * weeks;

    const ectsCredits = totalStudyHours / this.HOURS_PER_ECTS;

    return {
      inputs: {
        lectureHoursPerWeek: lectureHours,
        selfStudyHoursPerWeek: selfStudyHours,
        weeksInSemester: weeks
      },
      calculations: {
        totalHoursPerWeek,
        totalLectureHours,
        totalSelfStudyHours,
        totalStudyHours
      },
      result: {
        ectsCredits: Math.round(ectsCredits * 100) / 100,
        ectsCreditsRounded: Math.round(ectsCredits)
      }
    };
  }

  getECTSFromTotalHours(totalHours: number) {
    return totalHours / this.HOURS_PER_ECTS;
  }
  getTotalHoursFromECTS(ectsCredits: number) {
    return ectsCredits * this.HOURS_PER_ECTS;
  }
  suggestStudyDistribution(ectsCredits: number, weeks: number) {
    const totalHours = ectsCredits * this.HOURS_PER_ECTS;
    const hoursPerWeek = totalHours / weeks;
    const suggestedLectureHours = Math.round(hoursPerWeek * 0.35 * 10) / 10;
    const suggestedSelfStudyHours = Math.round(hoursPerWeek * 0.65 * 10) / 10;

    return {
      totalHoursPerWeek: hoursPerWeek,
      suggestedLectureHours,
      suggestedSelfStudyHours,
      distribution: '35% lecture, 65% self-study (typical)'
    };
  }
}

export function EctsCalculator({ isModal = false }: { isModal?: boolean }) {
  const [lectureHours, setLectureHours] = useState('');
  const [selfStudyHours, setSelfStudyHours] = useState('');
  const [weeks, setWeeks] = useState('');
  const [result, setResult] = useState<any>(null);
  const calculator = new ECTSCalculator();

  const handleCalculate = () => {
    if (lectureHours === '' || selfStudyHours === '' || weeks === '') {
      setResult(null);
      return;
    }
    
    const calcResult = calculator.calculate(lectureHours, selfStudyHours, weeks);
    if (calcResult.success) setResult(calcResult.data);
    else {
      setResult(null);
    }
  };

  useEffect(() => {
    handleCalculate();
  }, [lectureHours, selfStudyHours, weeks]);

  return (
    <div className="space-y-6">
      {!isModal && (
        <>
          <button type="button" onClick={() => window.history.back()} className="mb-4 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
            Back to Resources
          </button>
          <h1 className="text-3xl font-bold mb-4 text-primary">ECTS Credit Calculator</h1>
        </>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Enter Study Hours</h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Lecture Hours per Week</label>
            <input
              type="number"
              value={lectureHours}
              onChange={e => setLectureHours(e.target.value)}
              min={0}
              step="0.5"
              className="w-full p-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Self-Study Hours per Week</label>
            <input
              type="number"
              value={selfStudyHours}
              onChange={e => setSelfStudyHours(e.target.value)}
              min={0}
              step="0.5"
              className="w-full p-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Weeks in Semester (1-52)</label>
            <input
              type="number"
              value={weeks}
              onChange={e => setWeeks(e.target.value)}
              min={1}
              max={52}
              className="w-full p-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <div className="p-4 bg-card rounded-xl border border-border">
          {result ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <h3 className="text-lg font-semibold mb-4 text-primary">Calculation Results</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Lecture Hours:</span>
                  <span className="font-medium">{result.calculations.totalLectureHours}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Self-Study Hours:</span>
                  <span className="font-medium">{result.calculations.totalSelfStudyHours}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Study Hours:</span>
                  <span className="font-medium">{result.calculations.totalStudyHours}</span>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">ECTS Credits:</span>
                  <span className="text-2xl font-bold text-primary">{result.result.ectsCredits}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Rounded ECTS:</span>
                <span className="font-medium">{result.result.ectsCreditsRounded}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-4">Note: Based on 30 hours per ECTS credit standard.</p>
            </motion.div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <p>Enter all values to see results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- German Grade Calculator ---------- */
class GermanGradeCalculator {
  gradeRanges: Record<string, { min: number; max: number; german: string }>;

  constructor() {
    this.gradeRanges = {
      very_good: { min: 1.0, max: 1.5, german: 'Sehr gut' },
      good: { min: 1.6, max: 2.5, german: 'Gut' },
      satisfactory: { min: 2.6, max: 3.5, german: 'Befriedigend' },
      sufficient: { min: 3.6, max: 4.0, german: 'Ausreichend' },
      failed: { min: 4.1, max: 6.0, german: 'Nicht ausreichend' }
    };
  }

  calculate(inputScore: number, maxPossible: number, minPassing: number) {
    if (inputScore < minPassing || inputScore > maxPossible) throw new Error('Invalid input score - must be between minimum passing and maximum possible');
    const germanGrade = 1 + (3 * (maxPossible - inputScore)) / (maxPossible - minPassing);
    const roundedGrade = Math.round(germanGrade * 10) / 10;
    const classification = this.classifyGrade(roundedGrade);
    return { germanGrade: roundedGrade, classification, isPassing: roundedGrade <= 4.0 };
  }

  private classifyGrade(germanGrade: number) {
    if (germanGrade >= 1.0 && germanGrade <= 1.5) return { category: 'Very Good', german: 'Sehr gut', color: 'text-green-600', description: 'Outstanding performance' };
    if (germanGrade >= 1.6 && germanGrade <= 2.5) return { category: 'Good', german: 'Gut', color: 'text-lime-600', description: 'Performance considerably above average' };
    if (germanGrade >= 2.6 && germanGrade <= 3.5) return { category: 'Satisfactory', german: 'Befriedigend', color: 'text-yellow-600', description: 'Performance meets average requirements' };
    if (germanGrade >= 3.6 && germanGrade <= 4.0) return { category: 'Sufficient', german: 'Ausreichend', color: 'text-orange-600', description: 'Performance meets minimum requirements' };
    return { category: 'Not Sufficient/Failed', german: 'Nicht ausreichend', color: 'text-red-600', description: 'Performance does not meet requirements' };
  }
}

export function GermanGradeCalculatorComponent({ isModal = false }: { isModal?: boolean }) {
  const [inputScore, setInputScore] = useState('');
  const [maxPossible, setMaxPossible] = useState('100');
  const [minPassing, setMinPassing] = useState('50');
  const [result, setResult] = useState<any>(null);
  const calculator = new GermanGradeCalculator();

  const handleCalculate = () => {
    if (inputScore === '' || maxPossible === '' || minPassing === '') {
      setResult(null);
      return;
    }
    
    try {
      const is = parseFloat(inputScore) || 0;
      const mp = parseFloat(maxPossible) || 100;
      const mps = parseFloat(minPassing) || 50;
      const calcResult = calculator.calculate(is, mp, mps);
      setResult(calcResult);
    } catch (error: any) {
      setResult(null);
    }
  };

  useEffect(() => {
    handleCalculate();
  }, [inputScore, maxPossible, minPassing]);

  return (
    <div className="space-y-6">
      {!isModal && (
        <>
          <button type="button" onClick={() => window.history.back()} className="mb-4 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
            Back to Resources
          </button>
          <h1 className="text-3xl font-bold mb-4 text-primary">German Grade Calculator</h1>
        </>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Enter Your Grades</h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Your Score</label>
            <input
              type="number"
              value={inputScore}
              onChange={e => setInputScore(e.target.value)}
              step="0.01"
              className="w-full p-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Maximum Possible Score</label>
            <input
              type="number"
              value={maxPossible}
              onChange={e => setMaxPossible(e.target.value)}
              step="0.01"
              className="w-full p-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Minimum Passing Score</label>
            <input
              type="number"
              value={minPassing}
              onChange={e => setMinPassing(e.target.value)}
              step="0.01"
              className="w-full p-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <div className="p-4 bg-card rounded-xl border border-border">
          {result ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <h3 className="text-lg font-semibold mb-4 text-primary">Conversion Results</h3>
              <div className="p-3 bg-primary/10 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">German Grade:</span>
                  <span className="text-2xl font-bold text-primary">{result.germanGrade}</span>
                </div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg mb-4">
                <p className={`font-medium ${result.classification.color}`}>{result.classification.category} ({result.classification.german})</p>
                <p className="text-sm text-muted-foreground mt-1">{result.classification.description}</p>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Passing:</span>
                <span className={`font-medium ${result.isPassing ? 'text-green-600' : 'text-red-600'}`}>{result.isPassing ? 'Yes' : 'No'}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-4">Note: Based on the modified Bavarian formula used by German universities.</p>
            </motion.div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <p>Enter all values to see results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}