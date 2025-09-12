import { useState } from "react";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  MessageSquare,
  Filter,
  Search,
  Calendar,
  User,
  Award,
  AlertTriangle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const PendingReviews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewComments, setReviewComments] = useState("");

  const pendingApprovals = [
    {
      id: 1,
      studentName: "Sarah Johnson",
      studentId: "CS2021001",
      documentType: "AWS Cloud Practitioner Certificate",
      submittedDate: "2024-01-20",
      category: "Certification",
      status: "pending",
      priority: "high",
      fileUrl: "/documents/aws-cert.pdf",
      description: "Official AWS Cloud Practitioner certification obtained through AWS training program"
    },
    {
      id: 2,
      studentName: "Michael Chen",
      studentId: "CS2021002", 
      documentType: "React Development Course",
      submittedDate: "2024-01-19",
      category: "Course",
      status: "pending",
      priority: "medium",
      fileUrl: "/documents/react-course.pdf",
      description: "Completed comprehensive React development course with hands-on projects"
    },
    {
      id: 3,
      studentName: "Emily Davis",
      studentId: "CS2021003",
      documentType: "Community Volunteer Certificate",
      submittedDate: "2024-01-18",
      category: "Volunteering",
      status: "pending",
      priority: "low",
      fileUrl: "/documents/volunteer-cert.pdf",
      description: "Volunteered 50+ hours at local community center teaching coding to children"
    },
    {
      id: 4,
      studentName: "Alex Rodriguez",
      studentId: "CS2021004",
      documentType: "Machine Learning Project",
      submittedDate: "2024-01-17",
      category: "Project",
      status: "pending",
      priority: "high",
      fileUrl: "/documents/ml-project.pdf",
      description: "Developed a machine learning model for predicting student performance"
    },
    {
      id: 5,
      studentName: "Lisa Wang",
      studentId: "CS2021005",
      documentType: "Python Certification",
      submittedDate: "2024-01-16",
      category: "Certification",
      status: "pending",
      priority: "medium",
      fileUrl: "/documents/python-cert.pdf",
      description: "Python Institute PCAP certification"
    },
    {
      id: 6,
      studentName: "David Brown",
      studentId: "CS2021006",
      documentType: "Web Development Portfolio",
      submittedDate: "2024-01-15",
      category: "Project",
      status: "pending",
      priority: "low",
      fileUrl: "/documents/portfolio.pdf",
      description: "Personal portfolio showcasing web development projects and skills"
    }
  ];

  const filteredApprovals = pendingApprovals.filter(item =>
    item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      default: return "outline";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Certification": return Award;
      case "Course": return FileText;
      case "Project": return FileText;
      case "Volunteering": return User;
      default: return FileText;
    }
  };

  const handleReview = (document: any) => {
    setSelectedDocument(document);
    setShowReviewModal(true);
  };

  const handleApprove = () => {
    console.log("Approved document:", selectedDocument.id, reviewComments);
    setShowReviewModal(false);
    setSelectedDocument(null);
    setReviewComments("");
  };

  const handleReject = () => {
    if (!reviewComments.trim()) {
      alert("Please provide comments for rejection");
      return;
    }
    console.log("Rejected document:", selectedDocument.id, reviewComments);
    setShowReviewModal(false);
    setSelectedDocument(null);
    setReviewComments("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Pending Reviews</h1>
        <p className="text-muted-foreground text-lg">
          Review and approve student achievements and certifications.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by student name, document type, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="portal-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-warning/10 rounded-lg">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Pending</p>
              <p className="text-2xl font-bold">{pendingApprovals.length}</p>
            </div>
          </div>
        </Card>
        <Card className="portal-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-destructive/10 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">High Priority</p>
              <p className="text-2xl font-bold">{pendingApprovals.filter(p => p.priority === 'high').length}</p>
            </div>
          </div>
        </Card>
        <Card className="portal-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Certifications</p>
              <p className="text-2xl font-bold">{pendingApprovals.filter(p => p.category === 'Certification').length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Approvals List */}
      <div className="grid gap-4">
        {filteredApprovals.map((item) => {
          const CategoryIcon = getCategoryIcon(item.category);
          return (
            <Card key={item.id} className="portal-card p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-2.5 bg-primary/10 rounded-lg">
                    <CategoryIcon className="h-5 w-5 text-primary" />
                  </div>
                  
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{item.documentType}</h3>
                      <Badge variant={getPriorityColor(item.priority) as any}>
                        {item.priority} priority
                      </Badge>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{item.studentName} ({item.studentId})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Submitted {item.submittedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleReview(item)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleReview(item)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Review
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl bg-card rounded-lg p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Review Document</h3>
                <Button variant="outline" onClick={() => setShowReviewModal(false)}>
                  Close
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">{selectedDocument.documentType}</h4>
                  <p className="text-sm text-muted-foreground">
                    Submitted by {selectedDocument.studentName} ({selectedDocument.studentId})
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedDocument.description}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">Review Comments</label>
                  <Textarea
                    placeholder="Add your review comments here..."
                    value={reviewComments}
                    onChange={(e) => setReviewComments(e.target.value)}
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button 
                  variant="destructive" 
                  onClick={handleReject}
                  disabled={!reviewComments.trim()}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button onClick={handleApprove}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingReviews;
