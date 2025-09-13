import { useState } from "react";
import { BookOpen, Upload, Search, Eye, Edit, Trash2, Heart, Share2, MessageCircle, Calendar, Filter, Plus, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  useCertificates, 
  useCertificateCategories, 
  useUploadCertificate, 
  useUpdateCertificate, 
  useDeleteCertificate,
  useCertificateStats
} from "@/hooks/useApi";
import { isDemoAccount } from "@/utils/demoUtils";
import CertificateUploadModal from "@/components/CertificateUploadModal";

const Certificates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();

  // API hooks
  const { data: certificatesData, isLoading: certificatesLoading, refetch } = useCertificates({
    page: 1,
    search: searchTerm || undefined,
    category: selectedCategory !== "all" ? parseInt(selectedCategory) : undefined,
    status: selectedStatus !== "all" ? selectedStatus : undefined,
  });
  
  const { data: categoriesData } = useCertificateCategories();
  const { data: statsData } = useCertificateStats();
  
  const uploadCertificateMutation = useUploadCertificate({
    onSuccess: () => {
      toast({
        title: "Certificate Uploaded",
        description: "Your certificate has been uploaded and is pending review.",
      });
      setShowUploadModal(false);
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to upload certificate. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateCertificateMutation = useUpdateCertificate({
    onSuccess: () => {
      toast({
        title: "Certificate Updated",
        description: "Your certificate has been updated successfully.",
      });
      setShowDetailsModal(false);
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update certificate. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteCertificateMutation = useDeleteCertificate({
    onSuccess: () => {
      toast({
        title: "Certificate Deleted",
        description: "Your certificate has been deleted successfully.",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete certificate. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mock data for demo accounts
  const mockCertificates = [
    {
      id: 1,
      title: "AWS Cloud Practitioner",
      category: 1,
      category_name: "Cloud Computing",
      issuer: "Amazon Web Services",
      issue_date: "2024-01-20",
      expiry_date: "2026-01-20",
      status: "approved",
      points: 50,
      description: "Amazon Web Services Cloud Practitioner Certification",
      skills: ["Cloud Computing", "AWS", "Infrastructure"],
      created_at: "2024-01-20T10:00:00Z",
      updated_at: "2024-01-20T10:00:00Z",
      is_liked: false,
      likes_count: 12,
      comments_count: 3,
      is_expired: false,
      certificate_url: "/certificates/aws-cert.pdf",
    },
    {
      id: 2,
      title: "React Developer Course",
      category: 2,
      category_name: "Web Development",
      issuer: "Meta",
      issue_date: "2024-01-15", 
      expiry_date: null,
      status: "approved",
      points: 45,
      description: "Advanced React Development with Hooks and Context",
      skills: ["React", "JavaScript", "Frontend"],
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
      is_liked: true,
      likes_count: 8,
      comments_count: 1,
      is_expired: false,
      certificate_url: "/certificates/react-cert.pdf",
    },
    {
      id: 3,
      title: "Python Programming",
      category: 3,
      category_name: "Programming",
      issuer: "Python Institute",
      issue_date: "2024-01-10",
      expiry_date: "2025-01-10",
      status: "pending",
      points: 30,
      description: "Python Programming Fundamentals",
      skills: ["Python", "Programming", "Backend"],
      created_at: "2024-01-10T10:00:00Z",
      updated_at: "2024-01-10T10:00:00Z",
      is_liked: false,
      likes_count: 5,
      comments_count: 0,
      is_expired: false,
      certificate_url: "/certificates/python-cert.pdf",
    },
  ];

  const certificates = isDemoAccount(user) ? mockCertificates : (certificatesData?.results || []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Cloud Computing":
        return <BookOpen className="h-4 w-4" />;
      case "Web Development":
        return <BookOpen className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const handleUploadCertificate = (data: any) => {
    uploadCertificateMutation.mutate(data);
  };

  const handleUpdateCertificate = (id: number, data: any) => {
    updateCertificateMutation.mutate({ id, data });
  };

  const handleDeleteCertificate = (id: number) => {
    if (window.confirm("Are you sure you want to delete this certificate?")) {
      deleteCertificateMutation.mutate(id);
    }
  };

  const handleViewDetails = (certificate: any) => {
    setSelectedCertificate(certificate);
    setShowDetailsModal(true);
  };

  const handleEditCertificate = (certificate: any) => {
    setSelectedCertificate(certificate);
    setShowUploadModal(true);
  };

  const handleDownloadCertificate = (certificate: any) => {
    if (certificate.certificate_url) {
      window.open(certificate.certificate_url, '_blank');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Certificates</h1>
            <p className="text-muted-foreground">
              Manage and showcase your professional certificates and credentials
            </p>
          </div>
          <Button 
            className="flex items-center gap-2"
            onClick={() => setShowUploadModal(true)}
          >
            <Plus className="h-4 w-4" />
            Upload Certificate
          </Button>
        </div>

        {/* Stats Cards */}
        {statsData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Certificates</p>
                  <p className="text-2xl font-bold">{statsData.total_certificates}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Verified</p>
                  <p className="text-2xl font-bold">{statsData.verified_certificates}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Expiring Soon</p>
                  <p className="text-2xl font-bold">{statsData.expiring_soon}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">{statsData.this_month_certificates}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search certificates..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoriesData && Array.isArray(categoriesData) && categoriesData.map((category: any) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Certificate Grid */}
      <div className="grid gap-6">
        {certificatesLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading certificates...</p>
          </div>
        ) : certificates.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No certificates found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedCategory !== "all" || selectedStatus !== "all" 
                ? "Try adjusting your search or filters" 
                : "Start by uploading your first certificate"}
            </p>
            {!searchTerm && selectedCategory === "all" && selectedStatus === "all" && (
              <Button onClick={() => setShowUploadModal(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Certificate
              </Button>
            )}
          </Card>
        ) : (
          certificates.map((certificate) => (
            <Card key={certificate.id} className="portal-card p-6 hover:scale-[1.01] transition-transform">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {getCategoryIcon(certificate.category_name || certificate.category)}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">{certificate.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {certificate.issuer}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {certificate.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(certificate.status) as any}>
                      {certificate.status}
                    </Badge>
                    {certificate.is_expired && (
                      <Badge variant="destructive">
                        Expired
                      </Badge>
                    )}
                    <Badge variant="outline">
                      +{certificate.points} pts
                    </Badge>
                  </div>
                </div>

                {/* Skills */}
                {certificate.skills && certificate.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {certificate.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Social Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Heart className={`h-4 w-4 ${certificate.is_liked ? 'text-red-500 fill-red-500' : ''}`} />
                    <span>{certificate.likes_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{certificate.comments_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Issued: {new Date(certificate.issue_date || certificate.created_at).toLocaleDateString()}</span>
                    {certificate.expiry_date && (
                      <>
                        <span>•</span>
                        <span>Expires: {new Date(certificate.expiry_date).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(certificate)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownloadCertificate(certificate)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditCertificate(certificate)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteCertificate(certificate.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modals */}
      <CertificateUploadModal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setSelectedCertificate(null);
        }}
        onSubmit={handleUploadCertificate}
        certificate={selectedCertificate}
        onUpdate={handleUpdateCertificate}
      />
    </div>
  );
};

export default Certificates;
