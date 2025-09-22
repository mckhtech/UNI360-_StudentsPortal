import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Upload, FileText, CheckCircle, Calendar, Eye, Info, X, File, Check } from "lucide-react";
import documentApi from "@/services/document";

type Country = "DE" | "UK";

interface ContextType {
  selectedCountry: Country;
}

interface Document {
  id: string;      // stable unique for UI
  field: string;   // backend field key
  label: string;
  required: boolean;
  priority: "high" | "medium" | "low";
  description: string;
  status: "pending" | "uploaded" | "rejected";
  uploadDate?: string;
  fileName?: string;
  rejectionReason?: string;
}

interface OverviewApp {
  country: string;
  document_id: string;
  application_id: string;
  documents_uploaded?: boolean;
  verification_status?: string;
  admin_feedback?: string;
  uploaded_at?: string;
}

/* helpers */

const slug = (v: any) =>
  String(v ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "unknown";

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
    case "pending":  return "bg-orange-100 text-orange-800";
    case "rejected": return "bg-red-100 text-red-800";
    default:         return "bg-gray-100 text-gray-800";
  }
};

/* card */

const DocumentCard = ({
  document,
  onFileSelect,
  onUploadOne,
  onView,
  onRemoveFile,
  selectedFile,
  relevantApp,
  uploadError,
  uploading,
}: {
  document: Document;
  onFileSelect: (doc: Document, file: File) => void;
  onUploadOne: (doc: Document) => void;
  onView: (doc: Document) => void;
  onRemoveFile: (docId: string) => void;
  selectedFile?: File;
  uploadError?: string;
  relevantApp?: OverviewApp;
  uploading?: boolean;
}) => {
  const isUploaded = document.status === "uploaded";
  const isRejected = document.status === "rejected";
  const isPending  = document.status === "pending";
  const canUpload  = (isPending || isRejected) && !!selectedFile;

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
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Due: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </div>
            </div>

            <div className="flex gap-2 flex-col sm:flex-row">
              {isUploaded && relevantApp && (
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => onView(document)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              )}

              {(isPending || isRejected) && (
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer">
                    <Button size="sm" className={cn("rounded-full", isRejected ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700")} asChild>
                      <span><Upload className="w-4 h-4 mr-2" />Choose file</span>
                    </Button>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={handleFileSelect} className="hidden" />
                  </label>

                  <Button size="sm" variant="outline" disabled={!canUpload || uploading} onClick={() => onUploadOne(document)} className="rounded-full">
                    {uploading ? (<><Check className="w-4 h-4 mr-2 animate-spin" />Uploading…</>) : (<><Upload className="w-4 h-4 mr-2" />Upload</>)}
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
                    {selectedFile.name} ({documentApi.formatFileSize(selectedFile.size)})
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
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">{document.fileName}</span>
                <span className="text-xs text-green-600">Uploaded on {document.uploadDate}</span>
              </div>
            </div>
          )}

          {document.status === "rejected" && document.rejectionReason && (
            <div className="mt-4 bg-white rounded-lg p-3 border border-red-200">
              <p className="text-sm text-red-700 font-medium">Reason for rejection:</p>
              <p className="text-sm text-red-600">{document.rejectionReason}</p>
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-2">PDF, JPG, PNG, DOC, DOCX (max 10MB)</p>
        </div>
      </Card>
    </div>
  );
};

/* page */

export default function Documents() {
  const { selectedCountry } = useOutletContext<ContextType>();
  const [requirementsModal, setRequirementsModal] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({});
  const [uploadingOne, setUploadingOne] = useState<Record<string, boolean>>({});
  const [overview, setOverview] = useState<{ applications?: OverviewApp[] } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});

  const countryCode = selectedCountry === "DE" ? "germany" : "uk";
  const countryName = selectedCountry === "DE" ? "Germany" : "UK";

  const relevantApp = overview?.applications?.find((app) => (app.country || "").toLowerCase() === countryCode);

  // prefer backend field key
  const pickApiField = (t: any) =>
    t.field ?? t.field_name ?? t.key ?? t.code ?? t.slug ?? t.id ?? t.name ?? t.label ?? "document";

  // Normalize a requirement → UI Document (unique ids)
  const toUIDocument = (t: any, app: OverviewApp, idx: number): Document => {
    const perFieldStatus = t.status ?? t.verification_status;
    const appUploaded = !!app.documents_uploaded;
    const appStatus = !appUploaded ? "pending" : app.verification_status === "rejected" ? "rejected" : "uploaded";

    const status: Document["status"] =
      perFieldStatus === "rejected" ? "rejected"
      : (perFieldStatus === "approved" || perFieldStatus === "uploaded") ? "uploaded"
      : perFieldStatus === "pending" ? "pending"
      : (appStatus as Document["status"]);

    const uploadedAtField = t.uploaded_at || t.updated_at || app.uploaded_at;
    const fileNameField   = t.file_name || t.filename || (status === "uploaded" ? `${t.name || t.label || "file"}.pdf` : undefined);
    const rejectionField  = t.rejection_reason || t.admin_feedback || (status === "rejected" ? app.admin_feedback : undefined);

    const baseField = pickApiField(t);
    const stableId  = `${app.application_id}:${slug(baseField)}:${idx}`;

    return {
      id: stableId,
      field: String(baseField), // exact key sent to backend
      label: t.name || t.label || t.field_name || "Document",
      required: t.required !== false,
      priority: (t.priority as Document["priority"]) || "medium",
      description: t.description || "",
      status,
      uploadDate: uploadedAtField ? new Date(uploadedAtField).toISOString().split("T")[0] : undefined,
      fileName: fileNameField,
      rejectionReason: rejectionField,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const overviewData = await documentApi.getDocumentStatusOverview();
        setOverview(overviewData);

        const relevantAppLocal: OverviewApp | undefined = overviewData?.applications?.find(
          (app: any) => (app.country || "").toLowerCase() === countryCode
        );

        if (!relevantAppLocal) {
          setDocuments([]); setSelectedFiles({}); setUploadErrors({}); return;
        }

        const templatesRaw: any[] = await documentApi.getDocumentTemplates({ country: selectedCountry }).catch(() => []);
        const templates: any[] = Array.isArray((templatesRaw as any)?.templates)
          ? (templatesRaw as any).templates
          : Array.isArray(templatesRaw)
          ? templatesRaw
          : [];

        const mapped: Document[] = templates.map((t, idx) => toUIDocument(t, relevantAppLocal, idx));
        setDocuments(mapped);
        setSelectedFiles({});
        setUploadErrors({});
        setUploadingOne({});
      } catch (error) {
        console.error("Error fetching data:", error);
        setDocuments([]);
        setOverview({ applications: [] });
      }
    };

    fetchData();
  }, [selectedCountry, countryCode]);

  const documentsByStatus = {
    pending: documents.filter((d) => d.status === "pending"),
    uploaded: documents.filter((d) => d.status === "uploaded"),
    rejected: documents.filter((d) => d.status === "rejected"),
  };

  const handleFileSelect = (doc: Document, file: File) => {
    if (!documentApi.validateFileType(file)) {
      setUploadErrors((prev) => ({ ...prev, [doc.id]: "Invalid file type. Please upload PDF, JPG, JPEG, PNG, DOC, or DOCX files." }));
      return;
    }
    if (!documentApi.validateFileSize(file)) {
      setUploadErrors((prev) => ({ ...prev, [doc.id]: "File size too large. Maximum allowed size is 10MB." }));
      return;
    }
    setSelectedFiles((prev) => ({ ...prev, [doc.id]: file }));
    setUploadErrors((prev) => ({ ...prev, [doc.id]: "" }));
  };

  const handleRemoveFile = (docId: string) => {
    setSelectedFiles((prev) => { const next = { ...prev }; delete next[docId]; return next; });
    setUploadErrors((prev) =>  { const next = { ...prev }; delete next[docId]; return next; });
  };

  const handleDocumentView = async (doc: Document) => {
    if (!relevantApp) { alert("No application found for download."); return; }
    try {
      const blob = await documentApi.downloadDocumentById(relevantApp.document_id);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download document.");
    }
  };

  // per-card upload → always generic endpoint
  const handleUploadOne = async (doc: Document) => {
    if (!relevantApp) { alert("No application found."); return; }
    const file = selectedFiles[doc.id];
    if (!file) { alert("Please choose a file for this document."); return; }

    try {
      setUploadingOne((prev) => ({ ...prev, [doc.id]: true }));

      await documentApi.uploadDocument({
        application_id: relevantApp.application_id,
        field: doc.field,
        file,
      });

      // move this document to Uploaded immediately
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === doc.id
            ? { ...d, status: "uploaded", uploadDate: new Date().toISOString().split("T")[0], rejectionReason: undefined }
            : d
        )
      );
      handleRemoveFile(doc.id);
    } catch (e) {
      console.error("Per-document upload failed", e);
      setUploadErrors((prev) => ({ ...prev, [doc.id]: "Upload failed. Please try again." }));
    } finally {
      setUploadingOne((prev) => ({ ...prev, [doc.id]: false }));
    }
  };

  // Submit all selected → bulk endpoint
  const handleSubmitAll = async () => {
    if (!relevantApp) { alert("No application found. Please create an application first."); return; }
    const files = Object.values(selectedFiles);
    if (files.length === 0) { alert("Please select at least one file to upload."); return; }

    const missingRequired = documents.filter((d) => d.required && !selectedFiles[d.id]);
    if (missingRequired.length > 0) {
      alert(`Missing required documents: ${missingRequired.map((d) => d.label).join(", ")}`);
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const docsArray = Object.entries(selectedFiles).map(([stableId, file]) => {
        const d = documents.find((x) => x.id === stableId)!;
        return { application_id: relevantApp.application_id, field: d.field, file };
      });

      await documentApi.uploadBulkDocuments(docsArray);

      setDocuments((prev) =>
        prev.map((d) =>
          selectedFiles[d.id]
            ? { ...d, status: "uploaded", uploadDate: new Date().toISOString().split("T")[0], rejectionReason: undefined }
            : d
        )
      );
      setSelectedFiles({});
    } catch (error) {
      console.error("Upload error:", error);
      setSubmitError("Upload failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = {
    pending: documentsByStatus.pending.length,
    uploaded: documentsByStatus.uploaded.length,
    rejected: documentsByStatus.rejected.length,
    verified: documentsByStatus.uploaded.length,
  };

  const keyFor = (doc: Document, bucket: "pending" | "uploaded" | "rejected", i: number) =>
    `${doc.id}::${bucket}::${i}`;

  if (!relevantApp && documents.length === 0) {
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
          <h3 className="text-lg font-semibold mb-2">No application found</h3>
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
            <Button onClick={handleSubmitAll} disabled={isSubmitting || Object.keys(selectedFiles).length === 0} className="rounded-full bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? (<><Check className="w-4 h-4 mr-2 animate-spin" />Submitting...</>) : (<><Upload className="w-4 h-4 mr-2" />Submit All Documents</>)}
            </Button>
          )}
        </div>
      </div>

      {submitError && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{submitError}</div>}

      {/* Country Info Banner */}
      <div className="bg-white p-4 rounded-xl border">
        <div className="flex items-center gap-4">
          <div className="text-4xl">{selectedCountry === "DE" ? "🇩🇪" : "🇬🇧"}</div>
          <div>
            <h2 className="text-xl font-bold">{countryName} Student Visa</h2>
            <p className="text-muted-foreground">
              {selectedCountry === "DE" ? "Aufenthaltserlaubnis zu Studienzwecken - Processing time: 2-8 weeks" : "Tier 4 General Student Visa - Processing time: 3 weeks"}
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
                    onView={handleDocumentView}
                    onRemoveFile={handleRemoveFile}
                    selectedFile={selectedFiles[doc.id]}
                    uploadError={uploadErrors[doc.id]}
                    relevantApp={relevantApp as OverviewApp}
                    uploading={uploadingOne[doc.id]}
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
                    onView={handleDocumentView}
                    onRemoveFile={handleRemoveFile}
                    relevantApp={relevantApp as OverviewApp}
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
                    onView={handleDocumentView}
                    onRemoveFile={handleRemoveFile}
                    selectedFile={selectedFiles[doc.id]}
                    uploadError={uploadErrors[doc.id]}
                    relevantApp={relevantApp as OverviewApp}
                    uploading={uploadingOne[doc.id]}
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
              Checklist and tips for uploading your documents. This description connects screen readers to the dialog content.
            </DialogDescription>
          </DialogHeader>

          {/* (your requirements content here) */}
        </DialogContent>
      </Dialog>

      {/* @ts-ignore */}
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeInUp { animation: fadeInUp 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}
