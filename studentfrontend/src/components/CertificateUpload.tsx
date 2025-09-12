import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Eye
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: "pending" | "approved" | "rejected";
  uploadDate: string;
  previewUrl?: string;
}

const CertificateUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: "1",
      name: "React_Certificate.pdf",
      size: 1024 * 1024 * 2.5, // 2.5MB
      status: "approved",
      uploadDate: "2024-01-15",
    },
    {
      id: "2", 
      name: "AWS_Cloud_Practitioner.pdf",
      size: 1024 * 1024 * 1.8,
      status: "pending",
      uploadDate: "2024-01-20",
    },
    {
      id: "3",
      name: "Python_Course_Certificate.pdf", 
      size: 1024 * 1024 * 3.2,
      status: "rejected",
      uploadDate: "2024-01-18",
    },
  ]);
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(uploadInterval);
            setIsUploading(false);
            
            // Add to uploaded files
            const newFile: UploadedFile = {
              id: Date.now().toString(),
              name: file.name,
              size: file.size,
              status: "pending",
              uploadDate: new Date().toISOString().split('T')[0],
            };
            
            setUploadedFiles(prev => [newFile, ...prev]);
            
            toast({
              title: "Certificate uploaded successfully",
              description: `${file.name} has been uploaded and is pending review.`,
            });
            
            return 0;
          }
          return prev + 10;
        });
      }, 200);
    });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
    toast({
      title: "File removed",
      description: "The certificate has been removed from your uploads.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card className="portal-card p-8 bg-gradient-to-br from-card to-muted/20">
        <div
          {...getRootProps()}
          className={`upload-zone ${
            isDragActive ? 'border-primary bg-primary/5' : ''
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="mx-auto w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
              <Upload className={`h-6 w-6 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold tracking-tight">
                {isDragActive ? 'Drop your certificates here' : 'Upload Certificates'}
              </h3>
              <p className="text-muted-foreground text-sm">
                Drag and drop your certificate files here, or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                Supports PDF, JPG, PNG files up to 10MB
              </p>
            </div>
            <Button variant="outline" className="mx-auto font-medium">
              Browse Files
            </Button>
          </div>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Uploading...</span>
              <span className="font-semibold">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2.5" />
          </div>
        )}
      </Card>

      {/* Uploaded Files */}
      <Card className="portal-card p-6 bg-gradient-to-br from-card to-muted/20">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold tracking-tight">Uploaded Certificates</h3>
            <Badge variant="secondary" className="font-medium">
              {uploadedFiles.length} files
            </Badge>
          </div>

          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/60 transition-all duration-200 hover:shadow-sm"
              >
                <div className="p-2.5 bg-primary/10 rounded-lg">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{file.name}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span>Uploaded {file.uploadDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge 
                    variant={getStatusColor(file.status) as any}
                    className="flex items-center gap-1 font-medium"
                  >
                    {getStatusIcon(file.status)}
                    {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                  </Badge>

                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => removeFile(file.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CertificateUpload;