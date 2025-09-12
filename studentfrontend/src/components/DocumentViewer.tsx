import { useState } from "react";
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  Maximize2,
  X,
  FileText,
  Image as ImageIcon
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DocumentViewerProps {
  documentUrl: string;
  documentName: string;
  documentType: string;
  onClose?: () => void;
}

const DocumentViewer = ({ documentUrl, documentName, documentType, onClose }: DocumentViewerProps) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const isPDF = documentType.toLowerCase().includes('pdf');
  const isImage = ['jpg', 'jpeg', 'png', 'gif'].some(ext => 
    documentType.toLowerCase().includes(ext)
  );

  return (
    <Card className="w-full h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            {isPDF ? (
              <FileText className="h-5 w-5 text-primary" />
            ) : (
              <ImageIcon className="h-5 w-5 text-primary" />
            )}
          </div>
          <div>
            <h3 className="font-semibold">{documentName}</h3>
            <p className="text-sm text-muted-foreground">{documentType}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center">
            {zoom}%
          </span>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleRotate}>
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Maximize2 className="h-4 w-4" />
          </Button>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Document Display */}
      <div className="flex-1 overflow-auto bg-muted/20 p-4">
        <div className="flex items-center justify-center min-h-full">
          {isPDF ? (
            <div 
              className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-200"
              style={{ 
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center'
              }}
            >
              <div className="w-[600px] h-[800px] bg-white border flex items-center justify-center">
                <div className="text-center space-y-4">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
                  <div>
                    <p className="font-medium">PDF Document Preview</p>
                    <p className="text-sm text-muted-foreground">
                      {documentName}
                    </p>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download to View
                  </Button>
                </div>
              </div>
            </div>
          ) : isImage ? (
            <div 
              className="transition-transform duration-200"
              style={{ 
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center'
              }}
            >
              <img 
                src="/placeholder-document.jpg" 
                alt={documentName}
                className="max-w-full max-h-full object-contain shadow-lg rounded-lg"
              />
            </div>
          ) : (
            <div className="text-center space-y-4">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
              <div>
                <p className="font-medium">Document Preview Not Available</p>
                <p className="text-sm text-muted-foreground">
                  {documentType} files cannot be previewed
                </p>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Document
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DocumentViewer;