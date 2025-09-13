import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload, BookOpen, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useCertificateCategories } from "@/hooks/useApi";

interface CertificateUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  certificate?: any;
  onUpdate?: (id: number, data: any) => void;
}

const CertificateUploadModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  certificate, 
  onUpdate 
}: CertificateUploadModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    issuer: "",
    issue_date: "",
    expiry_date: "",
    certificate_number: "",
    points: "",
    skills: "",
    certificate_file: null as File | null,
    certificate_url: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useCertificateCategories();
  
  // Debug logging
  useEffect(() => {
    console.log('Certificate Categories:', { categoriesData, categoriesLoading, categoriesError });
  }, [categoriesData, categoriesLoading, categoriesError]);

  useEffect(() => {
    if (certificate) {
      setFormData({
        title: certificate.title || "",
        description: certificate.description || "",
        category: certificate.category?.toString() || "",
        issuer: certificate.issuer || "",
        issue_date: certificate.issue_date || "",
        expiry_date: certificate.expiry_date || "",
        certificate_number: certificate.certificate_number || "",
        points: certificate.points?.toString() || "",
        skills: certificate.skills?.join(", ") || "",
        certificate_file: null,
        certificate_url: certificate.certificate_url || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        category: "",
        issuer: "",
        issue_date: "",
        expiry_date: "",
        certificate_number: "",
        points: "",
        skills: "",
        certificate_file: null,
        certificate_url: "",
      });
    }
  }, [certificate, isOpen]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFormData(prev => ({ ...prev, certificate_file: file }));
      toast({
        title: "File selected",
        description: `${file.name} has been selected for upload.`,
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Convert skills string to array
      const skillsArray = formData.skills ? 
        formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill) : 
        [];

      const certificateData = {
        title: formData.title,
        description: formData.description,
        category: parseInt(formData.category),
        issuer: formData.issuer,
        issue_date: formData.issue_date,
        expiry_date: formData.expiry_date || undefined,
        certificate_number: formData.certificate_number || undefined,
        priority: "medium" as const,
        points: parseInt(formData.points) || 0,
        certificate_file: formData.certificate_file || undefined,
        skills_verified: skillsArray,
        tags: [],
        is_public: true,
      };

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            if (certificate && onUpdate) {
              onUpdate(certificate.id, certificateData);
            } else {
              onSubmit(certificateData);
            }
            return 0;
          }
          return prev + 10;
        });
      }, 100);

    } catch (error) {
      console.error('Error uploading certificate:', error);
      toast({
        title: "Error",
        description: "Failed to upload certificate. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, certificate_file: file }));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">
                {certificate ? "Edit Certificate" : "Upload New Certificate"}
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Certificate Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., AWS Cloud Practitioner"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuer">Issuing Organization *</Label>
                <Input
                  id="issuer"
                  value={formData.issuer}
                  onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
                  placeholder="e.g., Amazon Web Services"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesLoading ? (
                      <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                    ) : categoriesError ? (
                      <SelectItem value="error" disabled>Error loading categories</SelectItem>
                    ) : categoriesData && Array.isArray(categoriesData) && categoriesData.length > 0 ? (
                      categoriesData.map((category: any) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-categories" disabled>No categories available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="points">Points *</Label>
                <Input
                  id="points"
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData(prev => ({ ...prev, points: e.target.value }))}
                  placeholder="50"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your certificate..."
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issue_date">Issue Date *</Label>
                <Input
                  id="issue_date"
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, issue_date: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="certificate_number">Certificate Number</Label>
                <Input
                  id="certificate_number"
                  value={formData.certificate_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, certificate_number: e.target.value }))}
                  placeholder="e.g., AWS-123456"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry_date">Expiry Date</Label>
                <Input
                  id="expiry_date"
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiry_date: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                value={formData.skills}
                onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                placeholder="Cloud Computing, AWS, Infrastructure (comma separated)"
              />
            </div>

            {/* File Upload Area */}
            <div className="space-y-4">
              <Label>Certificate File *</Label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                }`}
              >
                <input {...getInputProps()} />
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Upload className={`h-6 w-6 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">
                      {isDragActive ? 'Drop your certificate here' : 'Upload Certificate File'}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Drag and drop your certificate file here, or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports PDF, JPG, PNG files up to 10MB
                    </p>
                  </div>
                  <Button type="button" variant="outline" className="mx-auto">
                    Browse Files
                  </Button>
                </div>
              </div>

              {formData.certificate_file && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{formData.certificate_file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(formData.certificate_file.size)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, certificate_file: null }))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificate_url">Certificate URL (Alternative)</Label>
              <Input
                id="certificate_url"
                value={formData.certificate_url}
                onChange={(e) => setFormData(prev => ({ ...prev, certificate_url: e.target.value }))}
                placeholder="https://example.com/certificate"
                type="url"
              />
            </div>

            {/* Upload Progress */}
            {isSubmitting && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Uploading certificate...</span>
                  <span className="font-semibold">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2.5" />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !formData.certificate_file}>
                {isSubmitting ? "Uploading..." : certificate ? "Update Certificate" : "Upload Certificate"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default CertificateUploadModal;
