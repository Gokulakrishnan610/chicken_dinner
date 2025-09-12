import { useState } from "react";
import { 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Download, 
  Eye,
  User,
  Calendar,
  FileText,
  X
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ReviewPanelProps {
  document: any;
  onClose: () => void;
  onApprove: (id: number, comments?: string) => void;
  onReject: (id: number, comments: string) => void;
}

const ReviewPanel = ({ document, onClose, onApprove, onReject }: ReviewPanelProps) => {
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await onApprove(document.id, comments);
      toast({
        title: "Document Approved",
        description: `${document.documentType} has been approved successfully.`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!comments.trim()) {
      toast({
        title: "Comments Required",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onReject(document.id, comments);
      toast({
        title: "Document Rejected",
        description: `${document.documentType} has been rejected.`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Document Review</h2>
                <p className="text-sm text-muted-foreground">
                  Review and approve student submission
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Document Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Student</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{document.studentName}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{document.studentId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Submitted</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{document.submittedDate}</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Document Type</Label>
                <p className="font-medium mt-1">{document.documentType}</p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline">{document.category}</Badge>
                <Badge variant={document.priority === "high" ? "destructive" : "secondary"}>
                  {document.priority} priority
                </Badge>
              </div>
            </div>

            {/* Document Preview */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-muted-foreground">Document Preview</Label>
              <div className="border rounded-lg p-8 bg-muted/30 text-center min-h-[200px] flex items-center justify-center">
                <div className="space-y-3">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    Document preview would be displayed here
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Original
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-3">
            <Label htmlFor="comments">Review Comments</Label>
            <Textarea
              id="comments"
              placeholder="Add your review comments here..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              Comments are required for rejection and optional for approval.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Full Document
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="destructive"
                onClick={handleReject}
                disabled={isSubmitting}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button 
                onClick={handleApprove}
                disabled={isSubmitting}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReviewPanel;