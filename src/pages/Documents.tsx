import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Upload,
  Download,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Trash2,
  Eye,
  Plus,
  Info,
  X,
  File,
  Check
} from "lucide-react";

// Import real API functions from document.js
import {
  getDocumentStatusOverview,
  getDocumentNotifications,
  getDocumentTemplates,
  uploadGermanyDocuments,
  uploadUKDocuments,
  downloadDocument,
  validateFileType,
  validateFileSize,
  transformDocumentStatusForUI
} from '../services/document.js';

// Document field configurations for different countries
const getDocumentFields = (country) => {
  const baseFields = [
    { key: 'visa_application_form', label: 'Visa Application Form', required: true, priority: 'high' },
    { key: 'passport', label: 'Passport', required: true, priority: 'high' },
    { key: 'photographs', label: 'Photographs', required: true, priority: 'medium' },
    { key: 'proof_of_accommodation', label: 'Proof of Accommodation', required: true, priority: 'medium' },
    { key: 'proof_of_financial_means', label: 'Proof of Financial Means', required: true, priority: 'high' }
  ];

  if (country?.toLowerCase() === 'uk') {
    return baseFields;
  } else if (country?.toLowerCase() === 'germany') {
    return [
      ...baseFields,
      { key: 'flight_reservation', label: 'Flight Reservation', required: true, priority: 'medium' },
      { key: 'travel_insurance', label: 'Travel Insurance', required: true, priority: 'low' }
    ];
  }
  return baseFields;
};

// Document type mapping for UI consistency
const documentTypes = [
  { name: "Academic", color: "bg-blue-100 text-blue-800" },
  { name: "Identity", color: "bg-green-100 text-green-800" },
  { name: "Financial", color: "bg-yellow-100 text-yellow-800" },
  { name: "Language", color: "bg-purple-100 text-purple-800" },
  { name: "Application", color: "bg-pink-100 text-pink-800" },
  { name: "Visa", color: "bg-indigo-100 text-indigo-800" },
  { name: "Travel", color: "bg-teal-100 text-teal-800" }
];

const getDocumentTypeColor = (type) => {
  const docType = documentTypes.find(dt => dt.name === type);
  return docType?.color || "bg-gray-100 text-gray-800";
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "border-red-200 bg-red-50";
    case "medium":
      return "border-yellow-200 bg-yellow-50";
    default:
      return "border-green-200 bg-green-50";
  }
};

// Individual Document Card Component
const DocumentCard = ({ 
  document, 
  onUpload, 
  onView, 
  onRemove, 
  uploadState,
  uploadProgress, 
  uploadError,
  uploadedFile 
}) => {
  const isUploading = uploadState === 'uploading';
  const isUploaded = uploadState === 'uploaded' || uploadedFile;
  const isRejected = uploadState === 'rejected';
  const isPending = uploadState === 'pending' || !uploadState;

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("border-l-4", getPriorityColor(document.priority))}>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg">{document.label}</h3>
                <Badge 
                  className={cn("rounded-pill text-xs", getDocumentTypeColor("Visa"))}
                >
                  {document.required ? 'Required' : 'Optional'}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "rounded-pill text-xs",
                    document.priority === "high" ? "border-red-300 text-red-700" : 
                    document.priority === "medium" ? "border-yellow-300 text-yellow-700" : 
                    "border-green-300 text-green-700"
                  )}
                >
                  {document.priority} priority
                </Badge>
              </div>
              <p className="text-muted-foreground mb-2">
                {document.description || `Upload your ${document.label.toLowerCase()} document`}
              </p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Due: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </div>
            </div>
            
            <div className="flex gap-2">
              {/* Upload Progress */}
              {isUploading && (
                <div className="flex items-center gap-2 min-w-32">
                  <Progress value={uploadProgress || 0} className="h-2 flex-1" />
                  <span className="text-xs text-muted-foreground">{uploadProgress || 0}%</span>
                </div>
              )}

              {/* Success State - View and Remove */}
              {isUploaded && (
                <>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="rounded-pill"
                    onClick={() => onView(document)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="rounded-pill text-destructive"
                    onClick={() => onRemove(document)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}

              {/* Pending/Rejected State - Upload */}
              {(isPending || isRejected) && (
                <label>
                  <Button
                    size="sm"
                    className={cn(
                      "rounded-pill",
                      isRejected ? "bg-red-600 hover:bg-red-700" : ""
                    )}
                    disabled={isUploading}
                    asChild
                  >
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      {isRejected ? 'Re-upload' : isUploading ? 'Uploading...' : 'Upload'}
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Upload Error */}
          {uploadError && (
            <div className="mt-4 text-xs text-red-600 bg-red-50 p-2 rounded">
              {uploadError}
            </div>
          )}

          {/* File Info */}
          {isUploaded && uploadedFile && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  {uploadedFile.name}
                </span>
                <span className="text-xs text-green-600">
                  ({(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>
            </div>
          )}

          {/* Rejection Reason */}
          {isRejected && document.rejectionReason && (
            <div className="mt-4 bg-white rounded-lg p-3 border border-red-200">
              <p className="text-sm text-red-700 font-medium">Reason for rejection:</p>
              <p className="text-sm text-red-600">{document.rejectionReason}</p>
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-2">
            PDF, JPG, PNG (max 10MB)
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default function Documents() {
  const [loading, setLoading] = useState(true);
  const [documentData, setDocumentData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [applications, setApplications] = useState([]);
  
  // Requirements modal state
  const [requirementsModal, setRequirementsModal] = useState(false);
  const [selectedCountryTemplates, setSelectedCountryTemplates] = useState([]);
  const [expandedTemplate, setExpandedTemplate] = useState(null);
  
  // Upload states for individual documents
  const [documentStates, setDocumentStates] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching document data...');
        
        // Fetch all data from real APIs
        const [statusData, notificationData, templatesData] = await Promise.all([
          getDocumentStatusOverview(),
          getDocumentNotifications(),
          getDocumentTemplates()
        ]);
        
        console.log('Document Status Data:', statusData);
        console.log('Notifications Data:', notificationData);
        console.log('Templates Data:', templatesData);
        
        setDocumentData(statusData);
        setNotifications(notificationData);
        setTemplates(templatesData);
        
        // Transform applications data from API response
        if (statusData && statusData.applications) {
          const transformedApplications = statusData.applications.map(app => ({
            id: app.application_id,
            universityName: app.university_name,
            country: app.country,
            status: app.documents_uploaded ? 'uploaded' : 'pending',
            verification_status: app.verification_status,
            document_id: app.document_id
          }));
          setApplications(transformedApplications);
          console.log('Transformed Applications:', transformedApplications);
        }
        
      } catch (err) {
        console.error('Error fetching document data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch document data');
        
        // Set empty fallback data to prevent app crashes
        setDocumentData({
          applications: [],
          summary: {
            total_applications: 0,
            documents_uploaded: 0,
            pending_verification: 0,
            approved_documents: 0,
            rejected_documents: 0,
            not_uploaded: 0
          }
        });
        setApplications([]);
        setNotifications([]);
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate individual document cards from applications
  const generateDocumentCards = () => {
    const cards = {
      pending: [],
      uploaded: [],
      reupload: []
    };

    applications.forEach(app => {
      const fields = getDocumentFields(app.country);
      
      fields.forEach(field => {
        const cardId = `${app.id}_${field.key}`;
        const card = {
          id: cardId,
          applicationId: app.id,
          universityName: app.universityName,
          country: app.country,
          document_id: app.document_id,
          ...field,
          description: field.description || `Upload your ${field.label.toLowerCase()} for ${app.universityName}`,
          uploadDate: new Date().toLocaleDateString(),
          size: '2.1 MB'
        };

        // Determine card status based on document state
        const docState = documentStates[cardId];
        if (docState === 'uploaded' || uploadedFiles[cardId]) {
          cards.uploaded.push(card);
        } else if (docState === 'rejected') {
          cards.reupload.push({...card, rejectionReason: 'Document quality needs improvement'});
        } else {
          cards.pending.push(card);
        }
      });
    });

    return cards;
  };

  const documentCards = generateDocumentCards();

  // Handle individual document upload
  const handleDocumentUpload = async (card, file) => {
    const cardId = card.id;
    
    try {
      setDocumentStates(prev => ({ ...prev, [cardId]: 'uploading' }));
      setUploadProgress(prev => ({ ...prev, [cardId]: 0 }));
      setUploadErrors(prev => ({ ...prev, [cardId]: '' }));

      // Validate file using real API functions
      if (!validateFileType(file)) {
        throw new Error('Invalid file type. Please upload PDF, JPG, JPEG, or PNG files.');
      }

      if (!validateFileSize(file)) {
        throw new Error('File size too large. Maximum allowed size is 10MB.');
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev[cardId] || 0;
          if (current >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, [cardId]: current + 15 };
        });
      }, 300);

      // Create form data for single document upload
      const documentsData = {
        application_id: card.applicationId,
        [card.key]: file
      };

      console.log('Uploading document:', {
        cardId,
        applicationId: card.applicationId,
        country: card.country,
        documentKey: card.key,
        fileName: file.name
      });

      let response;
      if (card.country.toLowerCase() === "uk") {
        response = await uploadUKDocuments(documentsData);
      } else if (card.country.toLowerCase() === "germany") {
        response = await uploadGermanyDocuments(documentsData);
      } else {
        throw new Error("Invalid country specified");
      }

      console.log('Upload response:', response);

      clearInterval(progressInterval);
      setUploadProgress(prev => ({ ...prev, [cardId]: 100 }));
      setUploadedFiles(prev => ({ ...prev, [cardId]: file }));
      setDocumentStates(prev => ({ ...prev, [cardId]: 'uploaded' }));

      // Reset progress after success
      setTimeout(() => {
        setUploadProgress(prev => ({ ...prev, [cardId]: 0 }));
      }, 2000);

      // Refresh document data after successful upload
      try {
        const updatedStatusData = await getDocumentStatusOverview();
        setDocumentData(updatedStatusData);
        
        if (updatedStatusData && updatedStatusData.applications) {
          const transformedApplications = updatedStatusData.applications.map(app => ({
            id: app.application_id,
            universityName: app.university_name,
            country: app.country,
            status: app.documents_uploaded ? 'uploaded' : 'pending',
            verification_status: app.verification_status,
            document_id: app.document_id
          }));
          setApplications(transformedApplications);
        }
      } catch (refreshErr) {
        console.warn('Failed to refresh data after upload:', refreshErr);
      }

    } catch (err) {
      console.error('Document upload error:', err);
      setDocumentStates(prev => ({ ...prev, [cardId]: 'pending' }));
      setUploadErrors(prev => ({ 
        ...prev, 
        [cardId]: err instanceof Error ? err.message : 'Upload failed' 
      }));
      setUploadProgress(prev => ({ ...prev, [cardId]: 0 }));
    }
  };

  const handleDocumentView = async (card) => {
    try {
      console.log('Attempting to view document:', card);
      const result = await downloadDocument(card.document_id, card.key, card.country);
      if (result && result.file_url) {
        window.open(result.file_url, '_blank');
      } else {
        throw new Error('No file URL returned from server');
      }
    } catch (err) {
      console.error('View document failed:', err);
      alert(`Failed to view document: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleDocumentRemove = (card) => {
    const cardId = card.id;
    setDocumentStates(prev => ({ ...prev, [cardId]: 'pending' }));
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[cardId];
      return newFiles;
    });
    setUploadErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[cardId];
      return newErrors;
    });
  };

  // Handle Requirements button click
  const handleRequirementsClick = () => {
    setSelectedCountryTemplates(templates);
    setRequirementsModal(true);
  };

  // Calculate stats from real data
  const getStats = () => {
    const stats = {
      pending: documentCards.pending.length,
      uploaded: documentCards.uploaded.length,
      reupload: documentCards.reupload.length,
      verified: documentData?.summary?.approved_documents || 0
    };
    
    // If we have real API data, use it
    if (documentData && documentData.summary) {
      stats.verified = documentData.summary.approved_documents;
    }
    
    return stats;
  };

  const stats = getStats();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Error loading documents</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
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
          <h1 className="text-3xl font-bold mb-2">Documents</h1>
          <p className="text-muted-foreground">
            Upload and manage your application documents individually
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRequirementsClick}
          className="rounded-pill"
        >
          <Info className="w-4 h-4 mr-2" />
          View All Requirements
        </Button>
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.uploaded}</div>
          <div className="text-sm text-muted-foreground">Uploaded</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.reupload}</div>
          <div className="text-sm text-muted-foreground">Re-upload Needed</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.verified}</div>
          <div className="text-sm text-muted-foreground">Verified</div>
        </Card>
      </motion.div>

      {/* Documents Tabs */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending" className="rounded-xl">
              Pending ({documentCards.pending.length})
            </TabsTrigger>
            <TabsTrigger value="uploaded" className="rounded-xl">
              Uploaded ({documentCards.uploaded.length})
            </TabsTrigger>
            <TabsTrigger value="reupload" className="rounded-xl">
              Re-upload ({documentCards.reupload.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <motion.div 
              className="space-y-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {documentCards.pending.length === 0 ? (
                <Card className="p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All documents uploaded!</h3>
                  <p className="text-muted-foreground">You have no pending document uploads.</p>
                </Card>
              ) : (
                documentCards.pending.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onUpload={(file) => handleDocumentUpload(doc, file)}
                    onView={(doc) => handleDocumentView(doc)}
                    onRemove={(doc) => handleDocumentRemove(doc)}
                    uploadState={documentStates[doc.id] || 'pending'}
                    uploadProgress={uploadProgress[doc.id]}
                    uploadError={uploadErrors[doc.id]}
                    uploadedFile={uploadedFiles[doc.id]}
                  />
                ))
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="uploaded">
            <motion.div 
              className="space-y-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {documentCards.uploaded.length === 0 ? (
                <Card className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No documents uploaded yet</h3>
                  <p className="text-muted-foreground">Upload your documents to see them here.</p>
                </Card>
              ) : (
                documentCards.uploaded.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onUpload={(file) => handleDocumentUpload(doc, file)}
                    onView={(doc) => handleDocumentView(doc)}
                    onRemove={(doc) => handleDocumentRemove(doc)}
                    uploadState="uploaded"
                    uploadedFile={uploadedFiles[doc.id] || { name: `${doc.label}.pdf`, size: 2.1 * 1024 * 1024 }}
                  />
                ))
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="reupload">
            <motion.div 
              className="space-y-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {documentCards.reupload.length === 0 ? (
                <Card className="p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No re-uploads needed!</h3>
                  <p className="text-muted-foreground">All your documents have been approved.</p>
                </Card>
              ) : (
                documentCards.reupload.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onUpload={(file) => handleDocumentUpload(doc, file)}
                    onView={(doc) => handleDocumentView(doc)}
                    onRemove={(doc) => handleDocumentRemove(doc)}
                    uploadState="rejected"
                    uploadProgress={uploadProgress[doc.id]}
                    uploadError={uploadErrors[doc.id]}
                  />
                ))
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Requirements Modal */}
      <Dialog open={requirementsModal} onOpenChange={setRequirementsModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Document Requirements
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedCountryTemplates.length === 0 ? (
              <Card className="p-6 text-center">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-muted-foreground">No document templates available</p>
              </Card>
            ) : (
              selectedCountryTemplates.map((template) => (
                <Card key={template.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{template.name}</h3>
                      <div className="flex gap-2">
                        {template.is_required && (
                          <Badge className="bg-red-100 text-red-800 text-xs">Required</Badge>
                        )}
                        <Badge variant="outline" className="text-xs capitalize">
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-auto p-2 text-xs justify-start"
                        onClick={() => setExpandedTemplate(expandedTemplate === template.id ? null : template.id)}
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Formats
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-auto p-2 text-xs justify-start"
                      >
                        <File className="w-3 h-3 mr-1" />
                        Size: {template.max_file_size_mb}MB
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-auto p-2 text-xs justify-start capitalize"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        {template.course_level}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-auto p-2 text-xs justify-start capitalize"
                      >
                        <Info className="w-3 h-3 mr-1" />
                        Details
                      </Button>
                    </div>

                    {expandedTemplate === template.id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50 rounded-lg p-3 space-y-2"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-700">Description:</p>
                          <p className="text-sm text-gray-600">{template.description || 'No description available'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Allowed Formats:</p>
                          <p className="text-sm text-gray-600">{template.file_format_allowed}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">University Type:</p>
                            <p className="text-sm text-gray-600 capitalize">{template.university_type}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Country:</p>
                            <p className="text-sm text-gray-600 capitalize">{template.country}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}