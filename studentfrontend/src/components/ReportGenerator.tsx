import { useState } from "react";
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  BarChart3,
  Users,
  Award,
  TrendingUp
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ReportGenerator = () => {
  const [reportType, setReportType] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const reportTypes = [
    {
      id: "naac",
      name: "NAAC Accreditation Report",
      description: "Comprehensive report for NAAC accreditation requirements",
      icon: Award,
      formats: ["PDF", "Excel"]
    },
    {
      id: "nirf",
      name: "NIRF Ranking Data",
      description: "Data compilation for NIRF ranking submission",
      icon: TrendingUp,
      formats: ["Excel", "CSV"]
    },
    {
      id: "student-achievements",
      name: "Student Achievement Summary",
      description: "Detailed analysis of student achievements and certifications",
      icon: Users,
      formats: ["PDF", "Excel", "CSV"]
    },
    {
      id: "faculty-performance",
      name: "Faculty Performance Report",
      description: "Faculty review and approval statistics",
      icon: BarChart3,
      formats: ["PDF", "Excel"]
    },
    {
      id: "institutional-analytics",
      name: "Institutional Analytics",
      description: "Overall institutional performance and engagement metrics",
      icon: BarChart3,
      formats: ["PDF", "Excel", "CSV"]
    }
  ];

  const handleGenerateReport = async (format: string) => {
    if (!reportType) {
      toast({
        title: "Report Type Required",
        description: "Please select a report type to generate.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Report Generated",
        description: `Your ${reportTypes.find(r => r.id === reportType)?.name} has been generated successfully.`,
      });
      
      // In a real implementation, this would trigger the download
      console.log(`Generating ${reportType} report in ${format} format`);
      
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedReport = reportTypes.find(r => r.id === reportType);

  return (
    <div className="space-y-6">
      {/* Report Type Selection */}
      <Card className="portal-card p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Select Report Type</h3>
            <p className="text-sm text-muted-foreground">
              Choose the type of report you want to generate
            </p>
          </div>

          <div className="grid gap-3">
            {reportTypes.map((report) => (
              <div
                key={report.id}
                className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                  reportType === report.id 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:bg-accent/50'
                }`}
                onClick={() => setReportType(report.id)}
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <report.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{report.name}</h4>
                  <p className="text-sm text-muted-foreground">{report.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {report.formats.map((format) => (
                      <Badge key={format} variant="outline" className="text-xs">
                        {format}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="w-4 h-4 border-2 rounded-full flex items-center justify-center">
                  {reportType === report.id && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Report Configuration */}
      {selectedReport && (
        <Card className="portal-card p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Report Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Configure the parameters for your {selectedReport.name}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date Range</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="last-quarter">Last Quarter</SelectItem>
                    <SelectItem value="last-semester">Last Semester</SelectItem>
                    <SelectItem value="academic-year">Academic Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Department Filter</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="it">Information Technology</SelectItem>
                    <SelectItem value="ds">Data Science</SelectItem>
                    <SelectItem value="ee">Electrical Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Generate Report */}
      {selectedReport && (
        <Card className="portal-card p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Generate Report</h3>
              <p className="text-sm text-muted-foreground">
                Choose your preferred format and generate the report
              </p>
            </div>

            <div className="flex items-center gap-3">
              {selectedReport.formats.map((format) => (
                <Button
                  key={format}
                  onClick={() => handleGenerateReport(format)}
                  disabled={isGenerating}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {isGenerating ? "Generating..." : `Download ${format}`}
                </Button>
              ))}
            </div>

            {isGenerating && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Generating report... This may take a few minutes.</span>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ReportGenerator;