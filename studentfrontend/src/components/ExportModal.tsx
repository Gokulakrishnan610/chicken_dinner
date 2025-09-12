import { useState } from "react";
import { 
  Download, 
  FileText, 
  Table, 
  File,
  Calendar,
  Filter,
  X,
  CheckCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: string;
  reportName: string;
}

const ExportModal = ({ isOpen, onClose, reportType, reportName }: ExportModalProps) => {
  const [selectedFormat, setSelectedFormat] = useState("");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);
  const { toast } = useToast();

  const formatOptions = [
    { 
      value: "pdf", 
      label: "PDF Document", 
      icon: FileText,
      description: "Professional formatted report"
    },
    { 
      value: "excel", 
      label: "Excel Spreadsheet", 
      icon: Table,
      description: "Editable data with charts"
    },
    { 
      value: "csv", 
      label: "CSV File", 
      icon: File,
      description: "Raw data for analysis"
    }
  ];

  const fieldOptions = [
    { value: "student-info", label: "Student Information" },
    { value: "achievements", label: "Achievements & Certifications" },
    { value: "projects", label: "Projects & Portfolio" },
    { value: "skills", label: "Skills & Competencies" },
    { value: "performance", label: "Performance Metrics" },
    { value: "engagement", label: "Engagement Statistics" },
    { value: "timestamps", label: "Date & Time Information" }
  ];

  const handleFieldToggle = (field: string, checked: boolean) => {
    setSelectedFields(prev => 
      checked 
        ? [...prev, field]
        : prev.filter(f => f !== field)
    );
  };

  const handleExport = async () => {
    if (!selectedFormat) {
      toast({
        title: "Format Required",
        description: "Please select an export format.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const progressInterval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setExportComplete(true);
          setIsExporting(false);
          toast({
            title: "Export Complete",
            description: `${reportName} has been exported successfully.`,
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleDownload = () => {
    // Simulate download
    toast({
      title: "Download Started",
      description: "Your file is being downloaded.",
    });
    
    // Reset modal state
    setTimeout(() => {
      setExportComplete(false);
      setExportProgress(0);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Export Report</h2>
              <p className="text-sm text-muted-foreground">{reportName}</p>
            </div>
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {!exportComplete ? (
            <>
              {/* Format Selection */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Export Format</Label>
                <div className="grid gap-3">
                  {formatOptions.map((format) => (
                    <div
                      key={format.value}
                      className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedFormat === format.value 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:bg-accent/50'
                      }`}
                      onClick={() => setSelectedFormat(format.value)}
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <format.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{format.label}</h4>
                        <p className="text-sm text-muted-foreground">{format.description}</p>
                      </div>
                      <div className="w-4 h-4 border-2 rounded-full flex items-center justify-center">
                        {selectedFormat === format.value && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="quarter">Last Quarter</SelectItem>
                    <SelectItem value="semester">Current Semester</SelectItem>
                    <SelectItem value="year">Academic Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Field Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Include Fields</Label>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedFields(fieldOptions.map(f => f.value))}
                  >
                    Select All
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {fieldOptions.map(field => (
                    <div key={field.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={field.value}
                        checked={selectedFields.includes(field.value)}
                        onCheckedChange={(checked) => 
                          handleFieldToggle(field.value, checked as boolean)
                        }
                      />
                      <Label htmlFor={field.value} className="text-sm">
                        {field.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Progress */}
              {isExporting && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Generating report...</span>
                    <span className="font-semibold">{exportProgress}%</span>
                  </div>
                  <Progress value={exportProgress} className="h-2.5" />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={onClose} disabled={isExporting}>
                  Cancel
                </Button>
                <Button onClick={handleExport} disabled={isExporting || !selectedFormat}>
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? "Exporting..." : "Export Report"}
                </Button>
              </div>
            </>
          ) : (
            /* Export Complete */
            <div className="text-center space-y-6 py-8">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Export Complete!</h3>
                <p className="text-muted-foreground">
                  Your {reportName} has been generated successfully.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Button onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download File
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ExportModal;