import { useState } from 'react';
import { Search, ExternalLink, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Resources', count: 17 },
    { id: 'services', label: 'Services', count: 2 },
    { id: 'guides', label: 'Study Guides', count: 6 },
    { id: 'checklists', label: 'Checklists', count: 4 },
    { id: 'scholarships', label: 'Scholarships', count: 3 },
    { id: 'visa', label: 'Visa Info', count: 2 }
  ];

  const resources = [
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
      title: 'Complete Guide to Studying in Germany',
      description: 'Comprehensive guide covering everything from applications to living in Germany',
      category: 'guides',
      type: 'Guide',
      readTime: '15 min read',
      tags: ['Germany', 'Universities', 'Student Life'],
      featured: true
    },
    {
      id: 4,
      title: 'UK Student Visa Application Checklist',
      description: 'Step-by-step checklist for UK student visa applications',
      category: 'checklists',
      type: 'Checklist',
      readTime: '5 min read',
      tags: ['UK', 'Visa', 'Documents']
    },
    {
      id: 5,
      title: 'DAAD Scholarships for International Students',
      description: 'Overview of German Academic Exchange Service scholarships',
      category: 'scholarships',
      type: 'Scholarship',
      readTime: '8 min read',
      tags: ['Germany', 'Funding', 'DAAD'],
      featured: true
    },
    {
      id: 6,
      title: 'English Language Requirements Guide',
      description: 'Understanding IELTS, TOEFL, and other English proficiency tests',
      category: 'guides',
      type: 'Guide',
      readTime: '12 min read',
      tags: ['IELTS', 'TOEFL', 'English']
    },
    {
      id: 7,
      title: 'Pre-Departure Checklist',
      description: 'Essential items and tasks before traveling to study abroad',
      category: 'checklists',
      type: 'Checklist',
      readTime: '7 min read',
      tags: ['Preparation', 'Travel', 'Essentials']
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold mb-2">Resources</h1>
        <p className="text-muted-foreground">
          Curated guides, checklists, and information to support your study abroad journey
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        className="flex flex-col md:flex-row gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        
        <button className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-xl hover:bg-card-hover transition-colors">
          <Filter className="h-5 w-5" />
          Advanced Filters
        </button>
      </motion.div>

      {/* Category Filters */}
      <motion.div 
        className="flex flex-wrap gap-2 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-pill text-sm font-medium transition-all duration-180 ${
              selectedCategory === category.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            }`}
          >
            {category.label} ({category.count})
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
          <div className="text-2xl">✨</div>
          <h2 className="text-xl font-semibold">Featured Resources</h2>
        </div>
        <p className="text-muted-foreground">
          Hand-picked resources that will help you succeed in your study abroad journey
        </p>
      </motion.div>

      {/* Resources Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        {filteredResources.map((resource, index) => (
          <motion.div
            key={resource.id}
            className={`glass rounded-2xl p-6 hover-lift ${resource.featured ? 'ring-2 ring-primary/20 bg-primary/5' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: index * 0.12 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-pill text-sm font-medium ${
                  resource.type === 'Guide' ? 'bg-primary/10 text-primary' :
                  resource.type === 'Checklist' ? 'bg-success/10 text-success' :
                  resource.type === 'Service' ? 'bg-primary/20 text-primary' :
                  'bg-gunmetal/10 text-warning'
                }`}>
                  {resource.type}
                </span>
                {resource.featured && (
                  <span className="text-lg">⭐</span>
                )}
              </div>
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{resource.description}</p>
            
            <div className="text-sm text-muted-foreground mb-4">
              {resource.readTime}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {resource.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action */}
            <button 
              onClick={() => resource.isService && resource.redirectLink ? window.open(resource.redirectLink, '_blank') : null}
              className="w-full flex items-center justify-center  gap-2 bg-primary text-primary-foreground py-3  rounded-xl hover-lift press-effect font-medium"
            >
              {resource.isService ? (
                resource.type === 'Service' && resource.title.includes('Translation') ? 'Get Translation Quote' :
                resource.type === 'Service' && resource.title.includes('Accommodation') ? 'Accommodation Assistance' :
                'Get Service'
              ) : 'Read More'}
              <ExternalLink className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}