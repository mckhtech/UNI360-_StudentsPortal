import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Plus
} from "lucide-react";

// Import the documents API service from services directory
import documentsAPI from '../services/document.js';

// Types for API responses
interface DocumentTemplate {
  id: number;
  name: string;
  country: string;
  created_at: string;
}

interface ApplicationDocument {
  application_id: string;
  university_name: string;
  country: string;
  documents_uploaded: boolean;
  verification_status: 'pending' | 'verified' | 'rejected';
  uploaded_at: string;
  verified_at: string | null;
  admin_feedback: string | null;
  document_type: string;
  document_id: number;
}

interface DocumentStatusResponse {
  applications: ApplicationDocument[];
  summary: {
    total_applications: number;
    documents_uploaded: number;
    pending_verification: number;
    approved_documents: number;
    rejected_documents: number;
    not_uploaded: number;
  };
}

interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  type?: string;
}

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

const getDocumentTypeColor = (type: string) => {
  const docType = documentTypes.find(dt => dt.name === type);
  return docType?.color || "bg-gray-100 text-gray-800";
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "border-red-200 bg-red-50";
    case "medium":
      return "border-yellow-200 bg-yellow-50";
    default:
      return "border-green-200 bg-green-50";
  }
};

export default function Documents() {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [documentData, setDocumentData] = useState<DocumentStatusResponse | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statusData, notificationData] = await Promise.all([
          documentsAPI.getDocumentStatusOverview(),
          documentsAPI.getDocumentNotifications()
        ]);
        
        setDocumentData(statusData);
        setNotifications(notificationData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Transform API data using the utility function from documents API
  const transformedData = documentData ? documentsAPI.transformDocumentStatusForUI(documentData) : {
    pending: [],
    uploaded: [],
    reupload: [],
    stats: { pending: 0, uploaded: 0, reupload: 0, verified: 0 }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle file drop logic here
  };

  const handleDownload = async (documentId: number, field: string, country: string) => {
    try {
      const result = await documentsAPI.downloadDocument(documentId, field, country);
      // Open download URL
      window.open(result.file_url, '_blank');
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download document');
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
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
            Manage and track all your application documents
          </p>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{transformedData.stats.pending}</div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{transformedData.stats.uploaded}</div>
          <div className="text-sm text-muted-foreground">Uploaded</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{transformedData.stats.reupload}</div>
          <div className="text-sm text-muted-foreground">Re-upload Needed</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{transformedData.stats.verified}</div>
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
              Pending ({transformedData.stats.pending})
            </TabsTrigger>
            <TabsTrigger value="uploaded" className="rounded-xl">
              Uploaded ({transformedData.stats.uploaded})
            </TabsTrigger>
            <TabsTrigger value="reupload" className="rounded-xl">
              Re-upload ({transformedData.stats.reupload})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <motion.div 
              className="space-y-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {transformedData.pending.length === 0 ? (
                <Card className="p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All documents uploaded!</h3>
                  <p className="text-muted-foreground">You have no pending document uploads.</p>
                </Card>
              ) : (
                transformedData.pending.map((doc: any) => (
                  <motion.div key={doc.id} variants={item}>
                    <Card className={cn("p-6 border-l-4", getPriorityColor(doc.priority))}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{doc.name}</h3>
                            <Badge 
                              className={cn("rounded-pill text-xs", getDocumentTypeColor(doc.type))}
                            >
                              {doc.type}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "rounded-pill text-xs",
                                doc.priority === "high" ? "border-red-300 text-red-700" : 
                                doc.priority === "medium" ? "border-yellow-300 text-yellow-700" : 
                                "border-green-300 text-green-700"
                              )}
                            >
                              {doc.priority} priority
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-2">{doc.description}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            Due: {doc.dueDate}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="rounded-pill">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-pill">
                            Requirements
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
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
              {transformedData.uploaded.length === 0 ? (
                <Card className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No documents uploaded yet</h3>
                  <p className="text-muted-foreground">Upload your documents to see them here.</p>
                </Card>
              ) : (
                transformedData.uploaded.map((doc: any) => (
                  <motion.div key={doc.id} variants={item}>
                    <Card className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{doc.name}</h3>
                              <Badge 
                                className={cn("rounded-pill text-xs", getDocumentTypeColor(doc.type))}
                              >
                                {doc.type}
                              </Badge>
                              {doc.status === "verified" && (
                                <Badge className="rounded-pill text-xs bg-green-100 text-green-800">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                              {doc.status === "pending" && (
                                <Badge className="rounded-pill text-xs bg-yellow-100 text-yellow-800">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Pending
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Uploaded: {doc.uploadDate}</span>
                              <span>Size: {doc.size}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="rounded-pill">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="rounded-pill"
                            onClick={() => handleDownload(doc.id, 'passport', doc.country)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-pill text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
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
              {transformedData.reupload.length === 0 ? (
                <Card className="p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No re-uploads needed!</h3>
                  <p className="text-muted-foreground">All your documents have been approved.</p>
                </Card>
              ) : (
                transformedData.reupload.map((doc: any) => (
                  <motion.div key={doc.id} variants={item}>
                    <Card className="p-6 border-l-4 border-red-200 bg-red-50">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                            <AlertTriangle className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{doc.name}</h3>
                              <Badge 
                                className={cn("rounded-pill text-xs", getDocumentTypeColor(doc.type))}
                              >
                                {doc.type}
                              </Badge>
                              <Badge className="rounded-pill text-xs bg-red-100 text-red-800">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Action Required
                              </Badge>
                            </div>
                            <div className="bg-white rounded-lg p-3 mb-2">
                              <p className="text-sm text-red-700 font-medium">Reason for rejection:</p>
                              <p className="text-sm text-red-600">{doc.reason}</p>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Last uploaded: {doc.uploadDate}</span>
                              <span>Size: {doc.size}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="rounded-pill">
                            <Upload className="w-4 h-4 mr-2" />
                            Re-upload
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-pill">
                            <Eye className="w-4 h-4 mr-2" />
                            View Original
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}