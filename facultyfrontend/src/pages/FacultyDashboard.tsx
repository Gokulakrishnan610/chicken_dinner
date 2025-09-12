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
  Award
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsCard from "@/components/StatsCard";

const FacultyDashboard = () => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);

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
      fileUrl: "/documents/aws-cert.pdf"
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
      fileUrl: "/documents/react-course.pdf"
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
      fileUrl: "/documents/volunteer-cert.pdf"
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
      fileUrl: "/documents/ml-project.pdf"
    }
  ];

  const recentApprovals = [
    {
      id: 5,
      studentName: "Lisa Wang",
      studentId: "CS2021005",
      documentType: "Python Certification",
      reviewedDate: "2024-01-16",
      status: "approved",
      reviewedBy: "Dr. Smith"
    },
    {
      id: 6,
      studentName: "David Brown",
      studentId: "CS2021006",
      documentType: "Web Development Portfolio",
      reviewedDate: "2024-01-15",
      status: "rejected",
      reviewedBy: "Prof. Johnson",
      comments: "Portfolio needs more detailed project descriptions"
    }
  ];

  const handleApprove = (documentId: number) => {
    console.log("Approved document:", documentId);
  };

  const handleReject = (documentId: number) => {
    console.log("Rejected document:", documentId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "default";
      case "rejected": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Faculty Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Review and approve student achievements and certifications.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Pending Reviews"
          value="12"
          change="+3 today"
          changeType="neutral"
          icon={Clock}
          gradient
        />
        <StatsCard
          title="Approved Today"
          value="8"
          change="+2 from yesterday"
          changeType="positive"
          icon={CheckCircle}
        />
        <StatsCard
          title="Total Reviews"
          value="156"
          change="+24 this week"
          changeType="positive"
          icon={FileText}
        />
        <StatsCard
          title="Average Review Time"
          value="2.3 hrs"
          change="-0.5 hrs"
          changeType="positive"
          icon={Award}
        />
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
          <TabsTrigger value="history">Review History</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          {/* Pending Approvals List */}
          <div className="grid gap-4">
            {pendingApprovals.map((item) => (
              <Card key={item.id} className="portal-card p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-2.5 bg-primary/10 rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{item.documentType}</h3>
                        <Badge variant={getPriorityColor(item.priority) as any}>
                          {item.priority} priority
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{item.studentName} ({item.studentId})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Submitted {item.submittedDate}</span>
                        </div>
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowDocumentViewer(true)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedDocument(item)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleApprove(item.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleReject(item.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Review History */}
          <div className="grid gap-4">
            {recentApprovals.map((item) => (
              <Card key={item.id} className="portal-card p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-2.5 bg-muted rounded-lg">
                      {item.status === "approved" ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                    
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{item.documentType}</h3>
                        <Badge variant={getStatusColor(item.status) as any}>
                          {item.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{item.studentName} ({item.studentId})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Reviewed {item.reviewedDate}</span>
                        </div>
                        <span>by {item.reviewedBy}</span>
                      </div>

                      {item.comments && (
                        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                          <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <p className="text-sm">{item.comments}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Document Viewer Modal */}
      {showDocumentViewer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-6xl h-[90vh] bg-card rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Document Preview</h3>
              <Button variant="outline" onClick={() => setShowDocumentViewer(false)}>
                Close
              </Button>
            </div>
            <div className="h-full bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Document preview would be displayed here</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
