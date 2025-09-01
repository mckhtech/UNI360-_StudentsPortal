import { useState } from "react";
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

// Static document configurations for different countries
const getStaticDocuments = (country) => {
  if (country === 'germany') {
    return [
      { 
        id: 'ger_visa_app', 
        label: 'Visa Application Form', 
        required: true, 
        priority: 'high',
        description: 'Completed German student visa application form',
        status: 'pending'
      },
      { 
        id: 'ger_passport', 
        label: 'Passport', 
        required: true, 
        priority: 'high',
        description: 'Valid passport with at least 6 months validity',
        status: 'pending'
      },
      { 
        id: 'ger_photos', 
        label: 'Biometric Photographs', 
        required: true, 
        priority: 'medium',
        description: 'Two recent biometric passport photos (35mm x 45mm)',
        status: 'uploaded',
        uploadDate: '2025-08-25',
        fileName: 'passport_photos.jpg'
      },
      { 
        id: 'ger_accommodation', 
        label: 'Proof of Accommodation', 
        required: true, 
        priority: 'medium',
        description: 'Rental agreement or university housing confirmation',
        status: 'pending'
      },
      { 
        id: 'ger_financial', 
        label: 'Proof of Financial Means', 
        required: true, 
        priority: 'high',
        description: 'Bank statements or blocked account confirmation (€11,208)',
        status: 'rejected',
        rejectionReason: 'Bank statement is older than 3 months. Please provide recent statements.'
      },
      { 
        id: 'ger_flight', 
        label: 'Flight Reservation', 
        required: true, 
        priority: 'medium',
        description: 'Round-trip flight booking confirmation',
        status: 'pending'
      },
      { 
        id: 'ger_insurance', 
        label: 'Travel Insurance', 
        required: true, 
        priority: 'low',
        description: 'Health insurance covering €30,000 minimum',
        status: 'uploaded',
        uploadDate: '2025-08-20',
        fileName: 'travel_insurance.pdf'
      },
      { 
        id: 'ger_letter', 
        label: 'University Admission Letter', 
        required: true, 
        priority: 'high',
        description: 'Official admission letter from German university',
        status: 'pending'
      }
    ];
  } else {
    // UK documents
    return [
      { 
        id: 'uk_visa_app', 
        label: 'Visa Application Form', 
        required: true, 
        priority: 'high',
        description: 'Completed UK student visa application (online form)',
        status: 'pending'
      },
      { 
        id: 'uk_passport', 
        label: 'Passport', 
        required: true, 
        priority: 'high',
        description: 'Valid passport with blank pages for visa',
        status: 'uploaded',
        uploadDate: '2025-08-22',
        fileName: 'passport_copy.pdf'
      },
      { 
        id: 'uk_photos', 
        label: 'Passport Photographs', 
        required: true, 
        priority: 'medium',
        description: 'Recent passport-style photographs (45mm x 35mm)',
        status: 'pending'
      },
      { 
        id: 'uk_accommodation', 
        label: 'Proof of Accommodation', 
        required: true, 
        priority: 'medium',
        description: 'University accommodation offer or private rental agreement',
        status: 'uploaded',
        uploadDate: '2025-08-23',
        fileName: 'accommodation_letter.pdf'
      },
      { 
        id: 'uk_financial', 
        label: 'Proof of Financial Means', 
        required: true, 
        priority: 'high',
        description: 'Bank statements showing £1,334/month maintenance funds',
        status: 'pending'
      },
      { 
        id: 'uk_cas', 
        label: 'CAS (Confirmation of Acceptance)', 
        required: true, 
        priority: 'high',
        description: 'CAS letter from your UK university sponsor',
        status: 'rejected',
        rejectionReason: 'CAS number not clearly visible. Please provide a clearer scan.'
      },
      { 
        id: 'uk_ielts', 
        label: 'English Language Test', 
        required: true, 
        priority: 'medium',
        description: 'IELTS, TOEFL, or accepted English proficiency certificate',
        status: 'uploaded',
        uploadDate: '2025-08-18',
        fileName: 'ielts_certificate.pdf'
      }
    ];
  }
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

const getStatusColor = (status) => {
  switch (status) {
    case "uploaded":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-orange-100 text-orange-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
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
  const isUploaded = document.status === 'uploaded';
  const isRejected = document.status === 'rejected';
  const isPending = document.status === 'pending';

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="opacity-0 translate-y-5 animate-fadeInUp">
      <Card className={cn("border-l-4 transition-all duration-200 hover:shadow-md", getPriorityColor(document.priority))}>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className="font-semibold text-lg">{document.label}</h3>
                <Badge 
                  className={cn("rounded-full text-xs", getStatusColor(document.status))}
                >
                  {document.status}
                </Badge>
                <Badge 
                  className={cn("rounded-full text-xs", document.required ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800")}
                >
                  {document.required ? 'Required' : 'Optional'}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "rounded-full text-xs",
                    document.priority === "high" ? "border-red-300 text-red-700" : 
                    document.priority === "medium" ? "border-yellow-300 text-yellow-700" : 
                    "border-green-300 text-green-700"
                  )}
                >
                  {document.priority} priority
                </Badge>
              </div>
              <p className="text-muted-foreground mb-2">
                {document.description}
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
                    className="rounded-full"
                    onClick={() => onView(document)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="rounded-full text-destructive hover:bg-red-50"
                    onClick={() => onRemove(document)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}

              {/* Pending/Rejected State - Upload */}
              {(isPending || isRejected) && (
                <label className="cursor-pointer">
                  <Button
                    size="sm"
                    className={cn(
                      "rounded-full",
                      isRejected ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
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

          {/* File Info for uploaded documents */}
          {isUploaded && document.fileName && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  {document.fileName}
                </span>
                <span className="text-xs text-green-600">
                  Uploaded on {document.uploadDate}
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
            PDF, JPG, PNG, DOC, DOCX (max 10MB)
          </p>
        </div>
      </Card>
    </div>
  );
};

export default function Documents() {
  const [selectedCountry, setSelectedCountry] = useState('uk');
  const [requirementsModal, setRequirementsModal] = useState(false);
  
  // Upload states for individual documents
  const [documentStates, setDocumentStates] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});

  // Get documents based on selected country
  const documents = getStaticDocuments(selectedCountry);

  // Organize documents by status
  const documentsByStatus = {
    pending: documents.filter(doc => doc.status === 'pending'),
    uploaded: documents.filter(doc => doc.status === 'uploaded'),
    rejected: documents.filter(doc => doc.status === 'rejected')
  };

  // Handle individual document upload simulation
  const handleDocumentUpload = async (document, file) => {
    const docId = document.id;
    
    try {
      setDocumentStates(prev => ({ ...prev, [docId]: 'uploading' }));
      setUploadProgress(prev => ({ ...prev, [docId]: 0 }));
      setUploadErrors(prev => ({ ...prev, [docId]: '' }));

      // Validate file
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size too large. Maximum allowed size is 10MB.');
      }

      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload PDF, JPG, JPEG, PNG, DOC, or DOCX files.');
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev[docId] || 0;
          if (current >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, [docId]: current + 15 };
        });
      }, 300);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      clearInterval(progressInterval);
      setUploadProgress(prev => ({ ...prev, [docId]: 100 }));
      setUploadedFiles(prev => ({ ...prev, [docId]: file }));
      setDocumentStates(prev => ({ ...prev, [docId]: 'uploaded' }));

      // Reset progress after success
      setTimeout(() => {
        setUploadProgress(prev => ({ ...prev, [docId]: 0 }));
      }, 2000);

    } catch (err) {
      console.error('Document upload error:', err);
      setDocumentStates(prev => ({ ...prev, [docId]: 'pending' }));
      setUploadErrors(prev => ({ 
        ...prev, 
        [docId]: err instanceof Error ? err.message : 'Upload failed' 
      }));
      setUploadProgress(prev => ({ ...prev, [docId]: 0 }));
    }
  };

  const handleDocumentView = (document) => {
    alert(`Viewing ${document.label} - ${document.fileName || 'document.pdf'}`);
  };

  const handleDocumentRemove = (document) => {
    const docId = document.id;
    setDocumentStates(prev => ({ ...prev, [docId]: 'pending' }));
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[docId];
      return newFiles;
    });
    setUploadErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[docId];
      return newErrors;
    });
  };

  // Calculate stats
  const stats = {
    pending: documentsByStatus.pending.length,
    uploaded: documentsByStatus.uploaded.length,
    rejected: documentsByStatus.rejected.length,
    verified: documentsByStatus.uploaded.length
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header with Country Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Documents</h1>
          <p className="text-muted-foreground">
            Upload and manage your {selectedCountry.toUpperCase()} visa application documents
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Country Toggle */}
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border">
            <button
              onClick={() => setSelectedCountry('uk')}
              className={cn(
                "px-3 py-1 rounded-lg text-sm font-medium transition-colors",
                selectedCountry === 'uk' ? "bg-blue-100 text-blue-800" : "text-gray-600 hover:text-gray-800"
              )}
            >
              🇬🇧 UK
            </button>
            <div className="w-px h-6 bg-gray-300"></div>
            <button
              onClick={() => setSelectedCountry('germany')}
              className={cn(
                "px-3 py-1 rounded-lg text-sm font-medium transition-colors",
                selectedCountry === 'germany' ? "bg-blue-100 text-blue-800" : "text-gray-600 hover:text-gray-800"
              )}
            >
              🇩🇪 Germany
            </button>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setRequirementsModal(true)}
            className="rounded-full"
          >
            <Info className="w-4 h-4 mr-2" />
            Requirements
          </Button>
        </div>
      </div>

      {/* Country Info Banner */}
      <div className="bg-white p-4 rounded-xl border">
        <div className="flex items-center gap-4">
          <div className="text-4xl">
            {selectedCountry === 'germany' ? '🇩🇪' : '🇬🇧'}
          </div>
          <div>
            <h2 className="text-xl font-bold">
              {selectedCountry === 'germany' ? 'Germany Student Visa' : 'United Kingdom Student Visa'}
            </h2>
            <p className="text-muted-foreground">
              {selectedCountry === 'germany' 
                ? 'Aufenthaltserlaubnis zu Studienzwecken - Processing time: 2-8 weeks' 
                : 'Tier 4 General Student Visa - Processing time: 3 weeks'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center bg-white">
          <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          <div className="text-sm text-muted-foreground">Pending Upload</div>
        </Card>
        <Card className="p-4 text-center bg-white">
          <div className="text-2xl font-bold text-green-600">{stats.uploaded}</div>
          <div className="text-sm text-muted-foreground">Uploaded</div>
        </Card>
        <Card className="p-4 text-center bg-white">
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          <div className="text-sm text-muted-foreground">Re-upload Needed</div>
        </Card>
        <Card className="p-4 text-center bg-white">
          <div className="text-2xl font-bold text-blue-600">{stats.verified}</div>
          <div className="text-sm text-muted-foreground">Verified</div>
        </Card>
      </div>

      {/* Documents Tabs */}
      <div>
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white">
            <TabsTrigger value="pending" className="rounded-xl">
              Pending ({documentsByStatus.pending.length})
            </TabsTrigger>
            <TabsTrigger value="uploaded" className="rounded-xl">
              Uploaded ({documentsByStatus.uploaded.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="rounded-xl">
              Re-upload ({documentsByStatus.rejected.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="space-y-4">
              {documentsByStatus.pending.length === 0 ? (
                <Card className="p-8 text-center bg-white">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All documents uploaded!</h3>
                  <p className="text-muted-foreground">You have no pending document uploads for {selectedCountry.toUpperCase()}.</p>
                </Card>
              ) : (
                documentsByStatus.pending.map((doc) => (
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
            </div>
          </TabsContent>

          <TabsContent value="uploaded">
            <div className="space-y-4">
              {documentsByStatus.uploaded.length === 0 ? (
                <Card className="p-8 text-center bg-white">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No documents uploaded yet</h3>
                  <p className="text-muted-foreground">Upload your {selectedCountry.toUpperCase()} documents to see them here.</p>
                </Card>
              ) : (
                documentsByStatus.uploaded.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onUpload={(file) => handleDocumentUpload(doc, file)}
                    onView={(doc) => handleDocumentView(doc)}
                    onRemove={(doc) => handleDocumentRemove(doc)}
                    uploadState="uploaded"
                    uploadedFile={{ name: doc.fileName, size: 2.1 * 1024 * 1024 }}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="rejected">
            <div className="space-y-4">
              {documentsByStatus.rejected.length === 0 ? (
                <Card className="p-8 text-center bg-white">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No re-uploads needed!</h3>
                  <p className="text-muted-foreground">All your {selectedCountry.toUpperCase()} documents have been approved.</p>
                </Card>
              ) : (
                documentsByStatus.rejected.map((doc) => (
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
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Requirements Modal */}
      <Dialog open={requirementsModal} onOpenChange={setRequirementsModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              {selectedCountry === 'germany' ? 'Germany' : 'UK'} Student Visa Requirements
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* General Requirements */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">General Requirements</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                {selectedCountry === 'germany' ? (
                  <>
                    <li>• Valid passport with at least 6 months validity</li>
                    <li>• Proof of admission to a German university</li>
                    <li>• Financial proof of €11,208 for living expenses</li>
                    <li>• Health insurance coverage (minimum €30,000)</li>
                    <li>• Clean criminal background check</li>
                  </>
                ) : (
                  <>
                    <li>• Valid passport with blank pages for visa</li>
                    <li>• CAS (Confirmation of Acceptance for Studies)</li>
                    <li>• Financial maintenance funds (£1,334/month)</li>
                    <li>• English language proficiency proof</li>
                    <li>• Academic qualifications and transcripts</li>
                  </>
                )}
              </ul>
            </div>

            {/* Document List */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Required Documents</h3>
              <div className="grid gap-3">
                {documents.map((doc) => (
                  <Card key={doc.id} className={cn("p-4 border-l-4", getPriorityColor(doc.priority))}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-medium">{doc.label}</h4>
                          <Badge className={cn("text-xs", doc.required ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800")}>
                            {doc.required ? 'Required' : 'Optional'}
                          </Badge>
                          <Badge variant="outline" className={cn(
                            "text-xs",
                            doc.priority === "high" ? "border-red-300 text-red-700" : 
                            doc.priority === "medium" ? "border-yellow-300 text-yellow-700" : 
                            "border-green-300 text-green-700"
                          )}>
                            {doc.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{doc.description}</p>
                      </div>
                      <div className="ml-4">
                        <Badge className={cn("text-xs", getStatusColor(doc.status))}>
                          {doc.status}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">Important Notes</h3>
              <ul className="space-y-1 text-sm text-yellow-800">
                {selectedCountry === 'germany' ? (
                  <>
                    <li>• All documents must be translated into German by certified translators</li>
                    <li>• Financial proof must show funds available for at least 1 year</li>
                    <li>• Processing time: 2-8 weeks depending on embassy workload</li>
                    <li>• Biometric appointment required at German consulate</li>
                  </>
                ) : (
                  <>
                    <li>• All documents must be in English or officially translated</li>
                    <li>• Financial maintenance must cover full course duration</li>
                    <li>• CAS must be used within 6 months of issue date</li>
                    <li>• Processing time: 3 weeks (standard) or 5 days (priority)</li>
                    <li>• Biometric enrollment required at visa application center</li>
                  </>
                )}
              </ul>
            </div>

            {/* Processing Timeline */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Processing Timeline</h3>
              <div className="space-y-2 text-sm text-green-800">
                {selectedCountry === 'germany' ? (
                  <>
                    <div className="flex justify-between">
                      <span>Document submission</span>
                      <span className="font-medium">Day 1</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Initial review</span>
                      <span className="font-medium">Day 3-7</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Biometric appointment</span>
                      <span className="font-medium">Day 10-14</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Decision notification</span>
                      <span className="font-medium">Day 14-56</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span>Document submission</span>
                      <span className="font-medium">Day 1</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Biometric enrollment</span>
                      <span className="font-medium">Day 1-5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Application processing</span>
                      <span className="font-medium">Day 5-15</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Decision notification</span>
                      <span className="font-medium">Day 15-21</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Key Differences */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">Key Differences for {selectedCountry.toUpperCase()}</h3>
              <div className="text-sm text-purple-800">
                {selectedCountry === 'germany' ? (
                  <div className="space-y-2">
                    <p><strong>Financial Requirements:</strong> €11,208 blocked account or equivalent proof</p>
                    <p><strong>Insurance:</strong> Mandatory health insurance with €30,000 minimum coverage</p>
                    <p><strong>Language:</strong> German proficiency may be required depending on course</p>
                    <p><strong>Work Rights:</strong> 120 full days or 240 half days per year</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p><strong>Financial Requirements:</strong> £1,334 per month maintenance funds</p>
                    <p><strong>CAS Requirement:</strong> Must have valid CAS from licensed sponsor</p>
                    <p><strong>English Language:</strong> IELTS, TOEFL, or equivalent required</p>
                    <p><strong>Work Rights:</strong> 20 hours per week during studies</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}