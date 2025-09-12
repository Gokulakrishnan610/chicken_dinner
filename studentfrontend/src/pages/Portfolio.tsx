import { FileText, Download, Share2, Eye, ExternalLink, Edit } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Portfolio = () => {
  const portfolioStats = {
    totalViews: 147,
    downloads: 23,
    shares: 8,
    lastUpdated: "2024-01-20",
  };

  const portfolioSections = [
    {
      title: "Education",
      items: 3,
      status: "complete",
      description: "Academic background and qualifications",
    },
    {
      title: "Certificates",
      items: 12,
      status: "complete", 
      description: "Professional certifications and courses",
    },
    {
      title: "Projects",
      items: 8,
      status: "complete",
      description: "Technical projects and implementations",
    },
    {
      title: "Volunteering",
      items: 5,
      status: "incomplete",
      description: "Community service and volunteer work",
    },
    {
      title: "Skills",
      items: 15,
      status: "complete",
      description: "Technical and soft skills",
    },
    {
      title: "Achievements",
      items: 6,
      status: "complete",
      description: "Awards and recognitions",
    },
  ];

  const recentUpdates = [
    {
      section: "Certificates",
      action: "Added AWS Cloud Practitioner",
      date: "2024-01-20",
    },
    {
      section: "Projects", 
      action: "Updated E-commerce Website details",
      date: "2024-01-18",
    },
    {
      section: "Skills",
      action: "Added React Native skill",
      date: "2024-01-15",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground">
            Generate and manage your professional portfolio
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="stats-card">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-primary">{portfolioStats.totalViews}</h3>
            <p className="text-sm text-muted-foreground">Total Views</p>
          </div>
        </Card>
        <Card className="stats-card">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-success">{portfolioStats.downloads}</h3>
            <p className="text-sm text-muted-foreground">Downloads</p>
          </div>
        </Card>
        <Card className="stats-card">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-warning">{portfolioStats.shares}</h3>
            <p className="text-sm text-muted-foreground">Shares</p>
          </div>
        </Card>
        <Card className="stats-card">
          <div className="text-center space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
            <p className="text-sm font-semibold">{portfolioStats.lastUpdated}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Sections */}
        <Card className="portal-card p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Portfolio Sections</h3>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Sections
              </Button>
            </div>

            <div className="space-y-3">
              {portfolioSections.map((section, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{section.title}</p>
                      <Badge variant="outline" className="text-xs">
                        {section.items} items
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {section.description}
                    </p>
                  </div>

                  <Badge 
                    variant={section.status === "complete" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {section.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Recent Updates & Actions */}
        <div className="space-y-6">
          {/* Recent Updates */}
          <Card className="portal-card p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Updates</h3>
              <div className="space-y-3">
                {recentUpdates.map((update, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{update.action}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{update.section}</span>
                        <span>•</span>
                        <span>{update.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card className="portal-card p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Portfolio Link
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Public Portfolio
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="h-4 w-4 mr-2" />
                  Customize Template
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Portfolio Preview */}
      <Card className="portal-card p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Portfolio Preview</h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Auto-saved</Badge>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Full Preview
              </Button>
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-8 text-center">
            <div className="space-y-3">
              <div className="w-16 h-16 bg-primary/10 rounded-lg mx-auto flex items-center justify-center">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h4 className="text-lg font-semibold">Sarah Johnson</h4>
                <p className="text-muted-foreground">Computer Science Student</p>
              </div>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Your portfolio is automatically generated based on your achievements, 
                certificates, and profile information. Preview or download to see the full version.
              </p>
              <Button className="mt-4">
                Generate Updated Portfolio
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Portfolio;