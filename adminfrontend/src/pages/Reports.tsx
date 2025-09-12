import { useState } from "react";
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Award,
  Clock,
  CheckCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const reports = [
    { 
      id: 1,
      name: "NAAC Accreditation Report", 
      type: "NAAC", 
      lastGenerated: "2024-01-15", 
      status: "ready",
      description: "Comprehensive report for NAAC accreditation process",
      size: "2.4 MB",
      format: "PDF"
    },
    { 
      id: 2,
      name: "NIRF Ranking Data", 
      type: "NIRF", 
      lastGenerated: "2024-01-10", 
      status: "ready",
      description: "Data compilation for NIRF ranking submission",
      size: "1.8 MB",
      format: "Excel"
    },
    { 
      id: 3,
      name: "Student Achievement Summary", 
      type: "Custom", 
      lastGenerated: "2024-01-20", 
      status: "ready",
      description: "Monthly summary of student achievements and certifications",
      size: "3.2 MB",
      format: "PDF"
    },
    { 
      id: 4,
      name: "Faculty Performance Report", 
      type: "Custom", 
      lastGenerated: "2024-01-18", 
      status: "generating",
      description: "Quarterly faculty performance and review metrics",
      size: "N/A",
      format: "PDF"
    },
    { 
      id: 5,
      name: "System Usage Analytics", 
      type: "Analytics", 
      lastGenerated: "2024-01-19", 
      status: "ready",
      description: "Platform usage statistics and user engagement metrics",
      size: "1.2 MB",
      format: "CSV"
    },
    { 
      id: 6,
      name: "Compliance Audit Report", 
      type: "Compliance", 
      lastGenerated: "2024-01-12", 
      status: "ready",
      description: "Annual compliance and audit documentation",
      size: "4.1 MB",
      format: "PDF"
    },
  ];

  const reportStats = [
    { title: "Total Reports", value: reports.length, icon: FileText, color: "text-primary" },
    { title: "Ready for Download", value: reports.filter(r => r.status === 'ready').length, icon: CheckCircle, color: "text-success" },
    { title: "In Progress", value: reports.filter(r => r.status === 'generating').length, icon: Clock, color: "text-warning" },
    { title: "This Month", value: 12, icon: Calendar, color: "text-accent" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready": return "default";
      case "generating": return "secondary";
      case "failed": return "destructive";
      default: return "outline";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "NAAC": return "destructive";
      case "NIRF": return "secondary";
      case "Custom": return "default";
      case "Analytics": return "outline";
      case "Compliance": return "secondary";
      default: return "outline";
    }
  };

  const handleDownload = (reportId: number) => {
    console.log("Downloading report:", reportId);
  };

  const handleGenerate = (reportId: number) => {
    console.log("Generating report:", reportId);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground text-lg">
          Generate and manage institutional reports for accreditation and compliance.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportStats.map((stat, index) => (
          <Card key={index} className="portal-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="accreditation">Accreditation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">All Reports</h3>
            <Button className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generate New Report
            </Button>
          </div>

          <div className="grid gap-4">
            {reports.map((report) => (
              <Card key={report.id} className="portal-card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-primary/10 rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">{report.name}</h4>
                        <Badge variant={getTypeColor(report.type) as any}>
                          {report.type}
                        </Badge>
                        <Badge variant={getStatusColor(report.status) as any}>
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Last generated: {report.lastGenerated}</span>
                        <span>•</span>
                        <span>Size: {report.size}</span>
                        <span>•</span>
                        <span>Format: {report.format}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {report.status === "ready" ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload(report.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleGenerate(report.id)}
                        disabled={report.status === "generating"}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        {report.status === "generating" ? "Generating..." : "Generate"}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="accreditation" className="space-y-6">
          <div className="grid gap-4">
            {reports.filter(r => r.type === "NAAC" || r.type === "NIRF").map((report) => (
              <Card key={report.id} className="portal-card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-primary/10 rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">{report.name}</h4>
                        <Badge variant={getTypeColor(report.type) as any}>
                          {report.type}
                        </Badge>
                        <Badge variant={getStatusColor(report.status) as any}>
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {report.status === "ready" ? (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        <Clock className="h-4 w-4 mr-2" />
                        Generating...
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-4">
            {reports.filter(r => r.type === "Analytics").map((report) => (
              <Card key={report.id} className="portal-card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-primary/10 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">{report.name}</h4>
                        <Badge variant={getTypeColor(report.type) as any}>
                          {report.type}
                        </Badge>
                        <Badge variant={getStatusColor(report.status) as any}>
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <div className="grid gap-4">
            {reports.filter(r => r.type === "Custom").map((report) => (
              <Card key={report.id} className="portal-card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-primary/10 rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">{report.name}</h4>
                        <Badge variant={getTypeColor(report.type) as any}>
                          {report.type}
                        </Badge>
                        <Badge variant={getStatusColor(report.status) as any}>
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {report.status === "ready" ? (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        <Clock className="h-4 w-4 mr-2" />
                        Generating...
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
