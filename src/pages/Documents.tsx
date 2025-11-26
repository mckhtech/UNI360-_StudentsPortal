import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Upload, FileText, CheckCircle, Calendar, Eye, Info, X, File, Loader2, AlertCircle } from "lucide-react";
import { makeAuthenticatedRequest } from "@/services/tokenService";
import { Trash2, ExternalLink } from "lucide-react";


type Country = "DE" | "UK";

interface ContextType {
  selectedCountry: Country;
}

interface Document {
  id: string;
  field: string;
  label: string;
  required: boolean;
  priority: "high" | "medium" | "low";
  description: string;
  status: "pending" | "uploaded" | "rejected";
  uploadDate?: string;
  fileName?: string;
  rejectionReason?: string;
  uploadedId?: string;
  acceptedFormats?: string[];
  maxFileSize?: string;
  daysUntilDeadline?: number;
  submissionDeadline?: string;
  // New fields from API
  workflowId?: string;
  fileSize?: number;
  verificationStatus?: string;
  reviewStatus?: string;
  statusDisplay?: string;
  reviewedAt?: string;
  viewUrlAvailable?: boolean;
  canDelete?: boolean;
}

interface OverviewSummary {
  total_required: number;
  uploaded_count: number;
  verified_count: number;
  pending_review_count: number;
  rejected_count: number;
  overall_status: string;
  total_pending?: number;
  total_uploaded?: number;
}

/* helpers */

const getPriorityColor = (priority: Document["priority"]) => {
  switch (priority) {
    case "high": return "border-red-200 bg-red-50";
    case "medium": return "border-yellow-200 bg-yellow-50";
    default: return "border-green-200 bg-green-50";
  }
};

const getStatusColor = (status: Document["status"]) => {
  switch (status) {
    case "uploaded": return "bg-green-100 text-green-800";
    case "pending": return "bg-orange-100 text-orange-800";
    case "rejected": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const validateFileType = (file: File) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  return allowedTypes.includes(file.type);
};

const validateFileSize = (file: File, maxSizeMB: number = 10) => {
  return file.size <= maxSizeMB * 1024 * 1024;
};

const normalizeApiCountry = (val?: string) => {
  const s = (val || "").toLowerCase().replace(/\s+/g, "_");
  if (["de", "ger", "germany"].includes(s)) return "germany";
  if (["uk", "gb", "united_kingdom", "unitedkingdom", "great_britain"].includes(s))
    return "united_kingdom";
  if (s.includes("german")) return "germany";
  if (s.includes("kingdom") || s.includes("brit")) return "united_kingdom";
  return "";
};

/* card */

const DocumentCard = ({
  document,
  onFileSelect,
  onUploadOne,
  onView,
  onRemoveFile,
  onDelete,
  selectedFile,
  uploadError,
  uploading,
  s3Health,
}: {
  document: Document;
  onFileSelect: (doc: Document, file: File) => void;
  onUploadOne: (doc: Document) => void;
  onView: (doc: Document) => void;
  onRemoveFile: (docId: string) => void;
  onDelete: (doc: Document) => void;
  selectedFile?: File;
  uploadError?: string;
  uploading?: boolean;
  s3Health?: boolean | null;
}) => {
  const isUploaded = document.status === "uploaded";
  const isRejected = document.status === "rejected";
  const isPending = document.status === "pending";
  const canUpload = (isPending || isRejected) && !!selectedFile;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(document, file);
  };

  return (
    <div className="opacity-0 translate-y-5 animate-fadeInUp">
      <Card className={cn("border-l-4 transition-all duration-200 hover:shadow-md", getPriorityColor(document.priority))}>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className="font-semibold text-lg">{document.label}</h3>
                <Badge className={cn("rounded-full text-xs", getStatusColor(document.status))}>{document.status}</Badge>
                <Badge className={cn("rounded-full text-xs", document.required ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800")}>
                  {document.required ? "Required" : "Optional"}
                </Badge>
                <Badge variant="outline" className={cn("rounded-full text-xs",
                  document.priority === "high" ? "border-red-300 text-red-700"
                  : document.priority === "medium" ? "border-yellow-300 text-yellow-700"
                  : "border-green-300 text-green-700"
                )}>
                  {document.priority} priority
                </Badge>
              </div>
              <p className="text-muted-foreground mb-2">{document.description}</p>
              {document.submissionDeadline && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Due: {new Date(document.submissionDeadline).toLocaleDateString()} ({document.daysUntilDeadline} days left)
                </div>
              )}
            </div>

            <div className="flex gap-2 flex-col sm:flex-row">
  

              {(isPending || isRejected) && (
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer">
                    <Button size="sm" className={cn("rounded-full", isRejected ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700")} asChild>
                      <span><Upload className="w-4 h-4 mr-2" />Choose file</span>
                    </Button>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={handleFileSelect} className="hidden" />
                  </label>

                  <Button size="sm" variant="outline" disabled={!canUpload || uploading} onClick={() => onUploadOne(document)} className="rounded-full" title={s3Health === false ? "Storage service unavailable" : ""}>
                    {uploading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading...</>) : (<><Upload className="w-4 h-4 mr-2" />Upload</>)}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {uploadError && <div className="mt-4 text-xs text-red-600 bg-red-50 p-2 rounded">{uploadError}</div>}

          {selectedFile && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <File className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </span>
                </div>
                <Button size="sm" variant="outline" className="text-destructive hover:bg-red-50" onClick={() => onRemoveFile(document.id)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {isUploaded && document.fileName && (
  <div className="mt-4 p-3 bg-green-50 rounded-lg">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 flex-1">
        <CheckCircle className="w-4 h-4 text-green-600" />
        <span className="text-sm font-medium text-green-800">{document.fileName}</span>
        {document.uploadDate && <span className="text-xs text-green-600">Uploaded on {document.uploadDate}</span>}
      </div>
      <div className="flex items-center gap-2">
        {document.statusDisplay && (
          <Badge variant="outline" className="text-xs">
            {document.statusDisplay}
          </Badge>
        )}
        {/* Ã¢Å“â€¦ ADD THIS VIEW BUTTON */}
        {document.uploadedId && document.viewUrlAvailable !== false && (
  <Button 
    size="sm" 
    variant="outline" 
    onClick={() => onView(document)}
    className="rounded-full text-blue-600 hover:bg-blue-50"
    title="View document"
  >
    <Eye className="w-4 h-4 mr-1" />
    View
  </Button>
)}
      </div>
    </div>
    {document.fileSize && document.fileSize > 0 && (
      <div className="text-xs text-green-600 mt-1">
        Size: {formatFileSize(document.fileSize)}
      </div>
    )}
  </div>
)}

          {document.status === "rejected" && document.rejectionReason && (
            <div className="mt-4 bg-white rounded-lg p-3 border border-red-200">
              <p className="text-sm text-red-700 font-medium">Reason for rejection:</p>
              <p className="text-sm text-red-600">{document.rejectionReason}</p>
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-2">
            {document.acceptedFormats?.join(", ") || "PDF, JPG, PNG, DOC, DOCX"} (max {document.maxFileSize || "10MB"})
          </p>
        </div>
      </Card>
    </div>
  );
};

/* page */

export default function Documents() {
  const { selectedCountry } = useOutletContext<ContextType>();
  const [requirementsModal, setRequirementsModal] = useState(false);
  const [viewerModal, setViewerModal] = useState(false);
  const [viewerUrl, setViewerUrl] = useState<string>("");
  const [viewerLoading, setViewerLoading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({});
  const [uploadingOne, setUploadingOne] = useState<Record<string, boolean>>({});
  const [overviewSummary, setOverviewSummary] = useState<OverviewSummary | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const [s3Health, setS3Health] = useState<boolean | null>(null);
const [s3HealthChecked, setS3HealthChecked] = useState(false);
  
  // NEW: Application selection state
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [loadingApplications, setLoadingApplications] = useState(false);

  const countryName = selectedCountry === "DE" ? "Germany" : "UK";

  // NEW: Fetch applications on component mount and country change
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoadingApplications(true);
        console.log('[Documents] Fetching applications...');
        
        const response = await makeAuthenticatedRequest('/api/v1/students/applications', {
          method: 'GET',
        });
        
        console.log('[Documents] Applications response:', response);
        
        let apps = [];
        if (response?.data?.applications) {
          apps = response.data.applications;
        } else if (Array.isArray(response?.data)) {
          apps = response.data;
        } else if (Array.isArray(response)) {
          apps = response;
        } else if (response?.applications) {
          apps = response.applications;
        }
        
        console.log('[Documents] Parsed applications:', apps);
        setApplications(apps);
        
        // Auto-select application based on selected country
        if (apps.length > 0) {
          const targetCountry = selectedCountry === 'DE' ? 'germany' : 'united_kingdom';
          const matchingApp = apps.find(app => {
            const appCountry = normalizeApiCountry(app.country || app.universityData?.country);
            return appCountry === targetCountry;
          });
          
          // Use matching app or fallback to first app
          const appToSelect = matchingApp || apps[0];
          console.log('[Documents] Auto-selecting application:', appToSelect);
          setSelectedApplication(appToSelect.id);
        }
      } catch (error) {
        console.error('[Documents] Error fetching applications:', error);
        setApplications([]);
      } finally {
        setLoadingApplications(false);
      }
    };

    fetchApplications();
  }, [selectedCountry]);

  // Check S3 health on mount
useEffect(() => {
  const checkS3Health = async () => {
    try {
      const response = await makeAuthenticatedRequest('/api/v1/documents/s3-health', {
        method: 'GET',
      });
      
      console.log('[Documents] S3 Health response:', response);
      
      if (response.success) {
        setS3Health(response.s3_health);
      } else {
        setS3Health(false);
      }
    } catch (error) {
      console.error('[Documents] S3 health check failed:', error);
      setS3Health(false);
    } finally {
      setS3HealthChecked(true);
    }
  };

  checkS3Health();
}, []);

 // âœ… Enhanced logging in the useEffect that fetches documents
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [pendingResponse, uploadedResponse, myDocsResponse, overviewResponse] = await Promise.all([
        makeAuthenticatedRequest('/api/v1/students/documents/pending', { method: 'GET' }),
        makeAuthenticatedRequest('/api/v1/students/documents/uploaded', { method: 'GET' }),
        makeAuthenticatedRequest('/api/v1/documents/my', { method: 'GET' }),
        makeAuthenticatedRequest('/api/v1/students/documents/overview', { method: 'GET' }).catch(() => null)
      ]);
      
      console.log("[Documents] Pending response:", pendingResponse);
      console.log("[Documents] Uploaded response:", uploadedResponse);
      console.log("[Documents] My documents response:", myDocsResponse);
      
      // Create a map of filename to document ID from /my endpoint
      const filenameToIdMap = new Map();
      if (myDocsResponse?.documents) {
        myDocsResponse.documents.forEach((doc: any) => {
          filenameToIdMap.set(doc.original_filename, doc.id);
        });
      }
      
      console.log("[Documents] ðŸ—ºï¸ Filename to ID map:", Array.from(filenameToIdMap.entries()));
      
      // Map pending documents
      const pendingMapped: Document[] = (pendingResponse?.pending_documents || []).map((doc: any, idx: number) => ({
        id: `pending-${doc.document_type}-${idx}`,
        field: doc.document_type,
        label: doc.display_name,
        required: doc.is_required,
        priority: (doc.priority_level?.toLowerCase() || "medium") as Document["priority"],
        description: doc.description,
        status: "pending" as const,
        acceptedFormats: doc.accepted_formats,
        maxFileSize: doc.max_file_size,
        daysUntilDeadline: doc.days_until_deadline,
        submissionDeadline: doc.submission_deadline,
      }));

      // âœ… Map uploaded documents and match with /my documents to get correct IDs
      const uploadedMapped: Document[] = (uploadedResponse?.uploaded_documents || []).map((doc: any, idx: number) => {
        const isRejected = doc.review_status === 'REJECTED' || doc.verification_status === 'REJECTED';
        
        // âœ… Try to find matching document ID from /my endpoint
        let documentId = filenameToIdMap.get(doc.file_name);
        
        // Fallback to upload_id if not found
        if (!documentId) {
          documentId = doc.upload_id || doc.document_id || doc.id;
        }
        
        console.log(`[Documents] ðŸ“„ Mapping document: ${doc.document_type}`, {
          file_name: doc.file_name,
          matched_id: documentId,
          from_my_endpoint: filenameToIdMap.has(doc.file_name)
        });
        
        return {
          id: `uploaded-${doc.document_type}-${idx}`,
          field: doc.document_type,
          label: doc.display_name || doc.document_type,
          required: false,
          priority: "medium" as const,
          description: doc.description || "",
          status: isRejected ? "rejected" : "uploaded" as const,
          uploadDate: doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : undefined,
          fileName: doc.file_name,
          uploadedId: documentId,  // âœ… ID from /my endpoint
          workflowId: doc.workflow_id,
          fileSize: doc.file_size,
          verificationStatus: doc.verification_status,
          reviewStatus: doc.review_status,
          statusDisplay: doc.status_display,
          reviewedAt: doc.reviewed_at,
          viewUrlAvailable: doc.view_url_available !== false,
          canDelete: doc.can_delete,
          rejectionReason: isRejected ? "Document rejected. Please re-upload." : undefined,
        };
      });

      const allDocs = [...pendingMapped, ...uploadedMapped];
      console.log("[Documents] ðŸ“Š Final mapped documents:", allDocs);
      setDocuments(allDocs);
      
      // ... rest of overview summary code stays the same ...
      
    } catch (error) {
      console.error("[Documents] Error fetching data:", error);
      setSubmitError("Failed to load documents. Please try again.");
      setDocuments([]);
      setOverviewSummary(null);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [selectedCountry]);

  const documentsByStatus = {
    pending: documents.filter((d) => d.status === "pending"),
    uploaded: documents.filter((d) => d.status === "uploaded"),
    rejected: documents.filter((d) => d.status === "rejected"),
  };

  const handleFileSelect = (doc: Document, file: File) => {
    if (!validateFileType(file)) {
      setUploadErrors((prev) => ({ ...prev, [doc.id]: "Invalid file type. Please upload PDF, JPG, JPEG, PNG, DOC, or DOCX files." }));
      return;
    }
    if (!validateFileSize(file)) {
      setUploadErrors((prev) => ({ ...prev, [doc.id]: "File size too large. Maximum allowed size is 10MB." }));
      return;
    }
    setSelectedFiles((prev) => ({ ...prev, [doc.id]: file }));
    setUploadErrors((prev) => ({ ...prev, [doc.id]: "" }));
  };

  const handleRemoveFile = (docId: string) => {
    setSelectedFiles((prev) => { const next = { ...prev }; delete next[docId]; return next; });
    setUploadErrors((prev) => { const next = { ...prev }; delete next[docId]; return next; });
  };

  const handleViewDocument = async (doc: Document) => {
  console.log("[Documents] ðŸ” VIEW DOCUMENT CALLED:");
  console.log("  Document object:", doc);
  console.log("  uploadedId:", doc.uploadedId);
  
  if (!doc.uploadedId) {
    console.error("[Documents] âŒ No document ID available");
    alert("Document ID not available. Cannot view document.");
    return;
  }

  const apiUrl = `/api/v1/documents/${doc.uploadedId}/view-url`;
  console.log(`[Documents] ðŸ“¡ Making request to: ${apiUrl}`);

  try {
    setViewerLoading(true);
    setViewerModal(true); // âœ… Open modal immediately
    
    const response = await makeAuthenticatedRequest(apiUrl, { method: 'GET' });
    console.log('[Documents] âœ… View URL response:', response);

    const viewUrl = response.view_url || response.url || response.data?.view_url;

    if (viewUrl) {
      console.log('[Documents] âœ… Setting viewer URL:', viewUrl);
      setViewerUrl(viewUrl);
    } else {
      console.error('[Documents] âŒ No view_url in response:', response);
      setViewerModal(false);
      alert("Unable to generate view URL. Please try again.");
    }
  } catch (error: any) {
    console.error('[Documents] âŒ Failed to get view URL:', error);
    setViewerModal(false);
    alert(`Failed to view document: ${error.message || 'Please try again or contact support'}`);
  } finally {
    setViewerLoading(false);
  }
};
  // Upload single document - UPDATED with application_id
 const handleUploadOne = async (doc: Document) => {
  if (s3Health === false) {
    alert("Document storage service is currently unavailable. Please try again later.");
    return;
  }

  const file = selectedFiles[doc.id];
  if (!file) {
    alert("Please choose a file for this document.");
    return;
  }

  if (!selectedApplication) {
    alert("Please select an application first.");
    return;
  }

  try {
    setUploadingOne(prev => ({ ...prev, [doc.id]: true }));
    setUploadErrors(prev => ({ ...prev, [doc.id]: "" }));

    const formData = new FormData();
    formData.append("application_id", selectedApplication);
    formData.append("document_type", doc.field);
    formData.append("file", file);

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem("uni360_access_token");

    console.log("[Documents] Uploading document:", {
      application_id: selectedApplication,
      document_type: doc.field,
      file_name: file.name
    });

    const response = await fetch(`${BASE_URL}/api/v1/students/documents/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const uploadResponse = await response.json();
    console.log("[Documents] âœ… Upload response:", uploadResponse);

    // âœ… NOW fetch /api/v1/documents/my to get the actual document ID
    console.log("[Documents] ðŸ” Fetching all documents to find uploaded document ID...");
    
    const myDocsResponse = await makeAuthenticatedRequest('/api/v1/documents/my', {
      method: 'GET'
    });
    
    console.log("[Documents] ðŸ“‹ My documents response:", myDocsResponse);

    // âœ… Find the document we just uploaded by matching filename
    const uploadedDoc = myDocsResponse.documents?.find((d: any) => 
      d.original_filename === file.name || 
      d.original_filename.includes(file.name.split('.')[0])
    );

    if (!uploadedDoc) {
      console.error("[Documents] âŒ Could not find uploaded document in /my response");
      console.error("[Documents] Looking for filename:", file.name);
      console.error("[Documents] Available documents:", myDocsResponse.documents?.map((d: any) => d.original_filename));
      
      // Still mark as uploaded
      setDocuments(prev =>
        prev.map(d =>
          d.id === doc.id
            ? {
                ...d,
                status: "uploaded",
                fileName: file.name,
                uploadDate: new Date().toLocaleDateString(),
                rejectionReason: undefined,
              }
            : d
        )
      );
      
      handleRemoveFile(doc.id);
      alert("Document uploaded but ID not found. Please refresh the page to view it.");
      return;
    }

    // âœ… Extract the document ID from /my response
    const documentId = uploadedDoc.id;
    console.log("[Documents] âœ… Found document ID for viewing:", documentId);
    console.log("[Documents] Document details:", {
      id: documentId,
      filename: uploadedDoc.original_filename,
      file_url: uploadedDoc.file_url,
      upload_purpose: uploadedDoc.upload_purpose
    });

    // âœ… Update document with the correct ID for viewing
    setDocuments(prev =>
      prev.map(d =>
        d.id === doc.id
          ? {
              ...d,
              status: "uploaded",
              uploadedId: documentId,  // âœ… This is the ID from /my endpoint
              fileName: file.name,
              uploadDate: new Date().toLocaleDateString(),
              rejectionReason: undefined,
            }
          : d
      )
    );

    handleRemoveFile(doc.id);
    alert("Document uploaded successfully! You can now view it.");
    
  } catch (e: any) {
    console.error("[Documents] âŒ Upload failed:", e);
    setUploadErrors(prev => ({
      ...prev,
      [doc.id]: e.message || "Upload failed. Please try again.",
    }));
  } finally {
    setUploadingOne(prev => ({ ...prev, [doc.id]: false }));
  }
};

  

  // Submit all selected documents - UPDATED with application_id
  const handleSubmitAll = async () => {
    if (s3Health === false) {
    alert("Document storage service is currently unavailable. Please try again later.");
    return;
  }
    const files = Object.values(selectedFiles);
    if (files.length === 0) {
      alert("Please select at least one file to upload.");
      return;
    }

    // VALIDATION: Check if application is selected
    if (!selectedApplication) {
      alert("Please select an application first.");
      return;
    }

    const missingRequired = documents.filter((d) => d.required && d.status === "pending" && !selectedFiles[d.id]);
    if (missingRequired.length > 0) {
      alert(`Missing required documents: ${missingRequired.map((d) => d.label).join(", ")}`);
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem('uni360_access_token');

      console.log('[Documents] Submitting all documents for application:', selectedApplication);

      const uploadPromises = Object.entries(selectedFiles).map(async ([docId, file]) => {
        const doc = documents.find((d) => d.id === docId);
        if (!doc) return;

        const formData = new FormData();
        formData.append('application_id', selectedApplication!); // âœ… CRITICAL FIX
        formData.append('document_type', doc.field);
        formData.append('file', file);

        const response = await fetch(`${BASE_URL}/api/v1/students/documents/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to upload ${doc.label}`);
        }

        return response.json();
      });

      await Promise.all(uploadPromises);

      setDocuments((prev) =>
        prev.map((d) =>
          selectedFiles[d.id]
            ? { ...d, status: "uploaded", uploadDate: new Date().toLocaleDateString(), rejectionReason: undefined }
            : d
        )
      );
      
      setSelectedFiles({});
      alert("All documents uploaded successfully!");
    } catch (error: any) {
      console.error("[Documents] Upload error:", error);
      setSubmitError(error.message || "Upload failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = {
  pending: overviewSummary?.total_pending || documentsByStatus.pending.length,
  uploaded: overviewSummary?.total_uploaded || documentsByStatus.uploaded.length,
  rejected: overviewSummary?.rejected_count || documentsByStatus.rejected.length,
  verified: overviewSummary?.verified_count || 0,
};

  const keyFor = (doc: Document, bucket: "pending" | "uploaded" | "rejected", i: number) =>
    `${doc.id}::${bucket}::${i}`;

  if (loading || loadingApplications) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading documents...</span>
      </div>
    );
  }

  if (!overviewSummary && documents.length === 0) {
    return (
      <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Documents</h1>
            <p className="text-muted-foreground">Upload and manage your {countryName} visa application documents</p>
          </div>
        </div>
        <Card className="p-8 text-center bg-white">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No documents available</h3>
          <p className="text-muted-foreground">Please create a {countryName} visa application first to manage documents.</p>
        </Card>
      </div>
    );
  }

  

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Documents</h1>
          <p className="text-muted-foreground">Upload and manage your {countryName} visa application documents</p>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setRequirementsModal(true)} className="rounded-full">
            <Info className="w-4 h-4 mr-2" />
            Requirements
          </Button>
          {(documentsByStatus.pending.length > 0 || documentsByStatus.rejected.length > 0) && (
            <Button onClick={handleSubmitAll} disabled={isSubmitting || Object.keys(selectedFiles).length === 0 || !selectedApplication || s3Health === false} className="rounded-full bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</>) : (<><Upload className="w-4 h-4 mr-2" />Submit All Documents</>)}
            </Button>
          )}
        </div>
      </div>

      {/* S3 Health Status Banner */}
{s3HealthChecked && s3Health === false && (
  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
    <div className="flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
      <div>
        <h4 className="font-semibold text-red-900 mb-1">Storage Service Unavailable</h4>
        <p className="text-sm text-red-700">
          The document storage service is currently unavailable. Please try again later or contact support if the issue persists.
        </p>
      </div>
    </div>
  </div>
)}

{s3HealthChecked && s3Health === true && (
  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
    <div className="flex items-center gap-2">
      <CheckCircle className="w-4 h-4 text-green-600" />
      <p className="text-sm text-green-700 font-medium">
        Document storage is operational
      </p>
    </div>
  </div>
)}

      {submitError && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{submitError}</div>}

      {/* NEW: Application Selector */}
      {applications.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <label className="text-sm font-semibold text-blue-900 block mb-2">
                Select Application for Document Upload:
              </label>
              <select
                value={selectedApplication || ''}
                onChange={(e) => setSelectedApplication(e.target.value)}
                className="w-full px-4 py-2.5 border border-blue-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium"
              >
                <option value="">-- Select an application --</option>
                {applications.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.universityName || app.university || 'University'} - {app.programName || app.course || 'Program'} 
                    {app.intakeTerm && ` (${app.intakeTerm})`}
                    {app.referenceNumber && ` - Ref: ${app.referenceNumber}`}
                  </option>
                ))}
              </select>
              <p className="text-xs text-blue-700 mt-2">
                Documents will be linked to the selected application. Make sure to choose the correct one.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Warning if no application selected */}
      {applications.length > 0 && !selectedApplication && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-900 mb-1">No Application Selected</h4>
              <p className="text-sm text-yellow-700">
                Please select an application above before uploading documents. Documents must be linked to an application.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* No applications warning */}
      {applications.length === 0 && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900 mb-1">No Applications Found</h4>
              <p className="text-sm text-red-700">
                You need to create an application first before uploading documents. Please go to the Applications page to create one.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Country Info Banner */}
      <div className="bg-white p-4 rounded-xl border">
        <div className="flex items-center gap-4">
          <div className="text-4xl">{selectedCountry === "DE" }</div>
          <div>
            <h2 className="text-xl font-bold">{countryName} Student Visa</h2>
            <p className="text-muted-foreground">
              {overviewSummary && (
                <span>Status: {overviewSummary.overall_status} | {overviewSummary.uploaded_count}/{overviewSummary.total_required} documents uploaded</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center bg-white"><div className="text-2xl font-bold text-orange-600">{stats.pending}</div><div className="text-sm text-muted-foreground">Pending Upload</div></Card>
        <Card className="p-4 text-center bg-white"><div className="text-2xl font-bold text-green-600">{stats.uploaded}</div><div className="text-sm text-muted-foreground">Uploaded</div></Card>
        <Card className="p-4 text-center bg-white"><div className="text-2xl font-bold text-red-600">{stats.rejected}</div><div className="text-sm text-muted-foreground">Re-upload Needed</div></Card>
        <Card className="p-4 text-center bg-white"><div className="text-2xl font-bold text-blue-600">{stats.verified}</div><div className="text-sm text-muted-foreground">Verified</div></Card>
      </div>

      {/* Documents Tabs */}
      <div>
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white">
            <TabsTrigger value="pending" className="rounded-xl">Pending ({documentsByStatus.pending.length})</TabsTrigger>
            <TabsTrigger value="uploaded" className="rounded-xl">Uploaded ({documentsByStatus.uploaded.length})</TabsTrigger>
            <TabsTrigger value="rejected" className="rounded-xl">Re-upload ({documentsByStatus.rejected.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="space-y-4">
              {documentsByStatus.pending.length === 0 ? (
                <Card className="p-8 text-center bg-white">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All documents uploaded!</h3>
                  <p className="text-muted-foreground">You have no pending document uploads for {countryName}.</p>
                </Card>
              ) : (
                documentsByStatus.pending.map((doc, i) => (
                  <DocumentCard
  key={keyFor(doc, "pending", i)}
  document={doc}
  onFileSelect={handleFileSelect}
  onUploadOne={handleUploadOne}
  onView={handleViewDocument}  // Ã¢Å“â€¦ ADD THIS
  onRemoveFile={handleRemoveFile}
  selectedFile={selectedFiles[doc.id]}
  uploadError={uploadErrors[doc.id]}
  uploading={uploadingOne[doc.id]}
  s3Health={s3Health}
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
                  <p className="text-muted-foreground">Upload your {countryName} documents to see them here.</p>
                </Card>
              ) : (
                documentsByStatus.uploaded.map((doc, i) => (
<DocumentCard
  key={keyFor(doc, "uploaded", i)}
  document={doc}
  onFileSelect={handleFileSelect}
  onUploadOne={handleUploadOne}
  onView={handleViewDocument}   // âœ… FIX ADDED
  onRemoveFile={handleRemoveFile}
  s3Health={s3Health}
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
                  <p className="text-muted-foreground">All your {countryName} documents have been approved.</p>
                </Card>
              ) : (
                documentsByStatus.rejected.map((doc, i) => (
                  <DocumentCard
  key={keyFor(doc, "rejected", i)}
  document={doc}
  onFileSelect={handleFileSelect}
  onUploadOne={handleUploadOne}
  onView={handleViewDocument}    // âœ… FIX ADDED
  onRemoveFile={handleRemoveFile}
  selectedFile={selectedFiles[doc.id]}
  uploadError={uploadErrors[doc.id]}
  uploading={uploadingOne[doc.id]}
  s3Health={s3Health}
/>

                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={requirementsModal} onOpenChange={setRequirementsModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              {countryName} Student Visa Requirements
            </DialogTitle>
            <DialogDescription>
              Important information about document requirements and submission guidelines.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Document Guidelines:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>All documents must be clear and legible</li>
                <li>Accepted formats: PDF, JPG, PNG, DOC, DOCX</li>
                <li>Maximum file size: 10MB per document</li>
                <li>Documents should be in English or officially translated</li>
                <li>Each document must be linked to an active application</li>
              </ul>
            </div>
            
            {overviewSummary && (
              <div>
                <h4 className="font-semibold mb-2">Your Progress:</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Total Required: {overviewSummary.total_required}</p>
                  <p>Uploaded: {overviewSummary.uploaded_count}</p>
                  <p>Verified: {overviewSummary.verified_count}</p>
                  <p>Pending Review: {overviewSummary.pending_review_count}</p>
                  <p>Rejected: {overviewSummary.rejected_count}</p>
                </div>
              </div>
            )}

            {selectedApplication && applications.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-2 text-blue-900">Current Application:</h4>
                <div className="text-sm text-blue-700">
                  {(() => {
                    const app = applications.find(a => a.id === selectedApplication);
                    if (app) {
                      return (
                        <div>
                          <p className="font-medium">{app.universityName || app.university || 'University'}</p>
                          <p>{app.programName || app.course || 'Program'}</p>
                          {app.referenceNumber && <p className="text-xs mt-1">Ref: {app.referenceNumber}</p>}
                        </div>
                      );
                    }
                    return <p>No application selected</p>;
                  })()}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Viewer Modal */}
      <Dialog open={viewerModal} onOpenChange={setViewerModal}>
  <DialogContent className="max-w-6xl h-[90vh] p-0 flex flex-col">
    <DialogHeader className="p-4 pb-3 border-b flex-shrink-0">
      <DialogTitle className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Document Viewer
        </span>
        
      </DialogTitle>
    </DialogHeader>
    
    <div className="flex-1 overflow-hidden p-4">
            {viewerLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading document...</span>
              </div>
            ) : viewerUrl ? (
              <iframe
  src={viewerUrl}
  className="w-full h-full border-0 rounded-lg"
  title="Document Viewer"
  onError={() => {
    alert("Failed to load document. Please try opening in a new tab.");
  }}
/>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Failed to load document</h3>
                  <p className="text-muted-foreground">Please try again or open in a new tab.</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeInUp { animation: fadeInUp 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}