import { useState } from "react";
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Eye, 
  MessageSquare,
  Filter,
  Search,
  Calendar,
  User,
  Award,
  Clock
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ReviewHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  const reviewHistory = [
    {
      id: 1,
      studentName: "Sarah Johnson",
      studentId: "CS2021001",
      documentType: "AWS Cloud Practitioner Certificate",
      reviewedDate: "2024-01-20",
      category: "Certification",
      status: "approved",
      reviewedBy: "Dr. Smith",
      comments: "Valid certification from AWS. Approved for credit.",
      reviewTime: "1.5 hours"
    },
    {
      id: 2,
      studentName: "Michael Chen",
      studentId: "CS2021002", 
      documentType: "React Development Course",
      reviewedDate: "2024-01-19",
      category: "Course",
      status: "approved",
      reviewedBy: "Prof. Johnson",
      comments: "Comprehensive course with practical projects. Good quality.",
      reviewTime: "2.0 hours"
    },
    {
      id: 3,
      studentName: "Emily Davis",
      studentId: "CS2021003",
      documentType: "Community Volunteer Certificate",
      reviewedDate: "2024-01-18",
      category: "Volunteering",
      status: "approved",
      reviewedBy: "Dr. Smith",
      comments: "Excellent community service. Approved for extracurricular credit.",
      reviewTime: "0.5 hours"
    },
    {
      id: 4,
      studentName: "Alex Rodriguez",
      studentId: "CS2021004",
      documentType: "Machine Learning Project",
      reviewedDate: "2024-01-17",
      category: "Project",
      status: "rejected",
      reviewedBy: "Prof. Johnson",
      comments: "Project lacks proper documentation and code quality needs improvement.",
      reviewTime: "3.0 hours"
    },
    {
      id: 5,
      studentName: "Lisa Wang",
      studentId: "CS2021005",
      documentType: "Python Certification",
      reviewedDate: "2024-01-16",
      category: "Certification",
      status: "approved",
      reviewedBy: "Dr. Smith",
      comments: "Valid Python Institute certification. Approved.",
      reviewTime: "1.0 hours"
    },
    {
      id: 6,
      studentName: "David Brown",
      studentId: "CS2021006",
      documentType: "Web Development Portfolio",
      reviewedDate: "2024-01-15",
      category: "Project",
      status: "rejected",
      reviewedBy: "Prof. Johnson",
      comments: "Portfolio needs more detailed project descriptions and better organization.",
      reviewTime: "2.5 hours"
    },
    {
      id: 7,
      studentName: "Maria Garcia",
      studentId: "CS2021007",
      documentType: "Data Science Bootcamp",
      reviewedDate: "2024-01-14",
      category: "Course",
      status: "approved",
      reviewedBy: "Dr. Smith",
      comments: "Comprehensive bootcamp with hands-on experience. Approved.",
      reviewTime: "1.8 hours"
    },
    {
      id: 8,
      studentName: "John Wilson",
      studentId: "CS2021008",
      documentType: "Open Source Contribution",
      reviewedDate: "2024-01-13",
      category: "Project",
      status: "approved",
      reviewedBy: "Prof. Johnson",
      comments: "Significant contribution to open source project. Excellent work.",
      reviewTime: "2.2 hours"
    }
  ];

  const filteredHistory = reviewHistory.filter(item => {
    const matchesSearch = item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedTab === "all") return matchesSearch;
    if (selectedTab === "approved") return matchesSearch && item.status === "approved";
    if (selectedTab === "rejected") return matchesSearch && item.status === "rejected";
    
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "default";
      case "rejected": return "destructive";
      default: return "secondary";
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

  const getStatusIcon = (status: string) => {
    return status === "approved" ? CheckCircle : XCircle;
  };

  const stats = {
    total: reviewHistory.length,
    approved: reviewHistory.filter(r => r.status === "approved").length,
    rejected: reviewHistory.filter(r => r.status === "rejected").length,
    avgReviewTime: (reviewHistory.reduce((acc, r) => acc + parseFloat(r.reviewTime), 0) / reviewHistory.length).toFixed(1)
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Review History</h1>
        <p className="text-muted-foreground text-lg">
          Track all your review activities and decisions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="portal-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Reviews</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="portal-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-success/10 rounded-lg">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold">{stats.approved}</p>
            </div>
          </div>
        </Card>
        <Card className="portal-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-destructive/10 rounded-lg">
              <XCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rejected</p>
              <p className="text-2xl font-bold">{stats.rejected}</p>
            </div>
          </div>
        </Card>
        <Card className="portal-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-warning/10 rounded-lg">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Review Time</p>
              <p className="text-2xl font-bold">{stats.avgReviewTime}h</p>
            </div>
          </div>
        </Card>
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

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="all">All Reviews</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-6">
          {/* Review History List */}
          <div className="grid gap-4">
            {filteredHistory.map((item) => {
              const CategoryIcon = getCategoryIcon(item.category);
              const StatusIcon = getStatusIcon(item.status);
              return (
                <Card key={item.id} className="portal-card p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-2.5 bg-muted rounded-lg">
                        <StatusIcon className={`h-5 w-5 ${
                          item.status === "approved" ? "text-success" : "text-destructive"
                        }`} />
                      </div>
                      
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{item.documentType}</h3>
                          <Badge variant={getStatusColor(item.status) as any}>
                            {item.status}
                          </Badge>
                          <Badge variant="outline">{item.category}</Badge>
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
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{item.reviewTime}</span>
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

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredHistory.length === 0 && (
            <Card className="portal-card p-12 text-center">
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No reviews found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? "Try adjusting your search criteria" : "No reviews match the selected filter"}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReviewHistory;
