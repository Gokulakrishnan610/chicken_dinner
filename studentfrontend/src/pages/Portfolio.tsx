import { FileText, Download, Share2, Eye, ExternalLink, Edit, Plus, Trash2, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef } from "react";

const Portfolio = () => {
  const { user } = useAuth();
  
  const [portfolioStats, setPortfolioStats] = useState({
    totalViews: 147,
    downloads: 23,
    shares: 8,
    lastUpdated: "2024-01-20",
  });

  const [portfolioSections, setPortfolioSections] = useState([
    { 
      title: "Personal Information", 
      status: "complete", 
      description: "Basic personal details and contact information",
      list: ["Name", "Email", "Phone", "Address"]
    },
    { 
      title: "Education", 
      status: "complete", 
      description: "Academic qualifications and achievements",
      list: ["University Details", "GPA", "Major"]
    },
    { 
      title: "Skills", 
      status: "incomplete", 
      description: "Technical and soft skills",
      list: ["Programming Languages", "Frameworks", "Tools"]
    },
    { 
      title: "Projects", 
      status: "incomplete", 
      description: "Personal and academic projects",
      list: []
    },
    { 
      title: "Certificates", 
      status: "complete", 
      description: "Professional certifications and courses",
      list: ["AWS Cloud Practitioner"]
    }
  ]);

  const [recentUpdates, setRecentUpdates] = useState([
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
  ]);

  // Editing state
  const [editingIndex, setEditingIndex] = useState(null);
  const [editSection, setEditSection] = useState({ 
    title: "", 
    status: "incomplete", 
    description: "", 
    list: [] 
  });

  // Portfolio generation state
  const [generating, setGenerating] = useState(false);
  const [generateMsg, setGenerateMsg] = useState("");
  const [portfolioHtml, setPortfolioHtml] = useState("");
  const timeoutRef = useRef(null);

  // Generate template-based HTML portfolio
  const handleGeneratePortfolio = async () => {
    setGenerating(true);
    setGenerateMsg("");
    try {
      // Simulate delay
      await new Promise(res => setTimeout(res, 1200));
      
      // Build HTML template
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${user ? `${user.first_name} ${user.last_name} - Portfolio` : "Professional Portfolio"}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            min-height: 100vh;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            min-height: 100vh;
        }

        /* Header Section */
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 60px 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.1;
        }

        .header-content {
            position: relative;
            z-index: 1;
        }

        .header h1 {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 10px;
            letter-spacing: -0.025em;
        }

        .header .subtitle {
            font-size: 1.25rem;
            font-weight: 400;
            opacity: 0.9;
            margin-bottom: 20px;
        }

        .contact-info {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-top: 30px;
            flex-wrap: wrap;
        }

        .contact-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.9rem;
            opacity: 0.9;
        }

        /* Main Content */
        .content {
            padding: 50px 40px;
        }

        .section {
            margin-bottom: 50px;
            padding-bottom: 30px;
            border-bottom: 1px solid #e5e7eb;
        }

        .section:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }

        .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 25px;
        }

        .section h2 {
            font-size: 1.75rem;
            font-weight: 600;
            color: #1f2937;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .section-icon {
            width: 8px;
            height: 8px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 50%;
        }

        .item-count {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 500;
            letter-spacing: 0.025em;
        }

        .section-description {
            color: #6b7280;
            font-size: 1rem;
            margin-bottom: 20px;
            font-style: italic;
        }

        .items-grid {
            display: grid;
            gap: 15px;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }

        .item {
            background: #f9fafb;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            transition: all 0.2s ease;
            position: relative;
        }

        .item:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
            border-color: #d1d5db;
        }

        .item-title {
            font-weight: 500;
            color: #374151;
            margin-bottom: 5px;
        }

        .no-items {
            text-align: center;
            color: #9ca3af;
            font-style: italic;
            padding: 40px 20px;
            background: #f9fafb;
            border-radius: 12px;
            border: 2px dashed #d1d5db;
        }

        /* Footer */
        .footer {
            background: #f8fafc;
            text-align: center;
            padding: 30px 40px;
            color: #6b7280;
            font-size: 0.9rem;
            border-top: 1px solid #e5e7eb;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .header {
                padding: 40px 20px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .section h2 {
                font-size: 1.5rem;
            }
            
            .contact-info {
                flex-direction: column;
                gap: 15px;
            }
            
            .items-grid {
                grid-template-columns: 1fr;
            }
            
            .section-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 15px;
            }
        }

        /* Print Styles */
        @media print {
            body {
                background: white;
            }
            
            .container {
                box-shadow: none;
            }
            
            .header {
                background: #667eea !important;
                -webkit-print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <div class="header-content">
                <h1>${user ? `${user.first_name} ${user.last_name}` : "John Doe"}</h1>
                <p class="subtitle">${user?.major || "Computer Science Student"}</p>
                <div class="contact-info">
                    <div class="contact-item">
                        <span>📧</span>
                        <span>${user?.email || "john.doe@email.com"}</span>
                    </div>
                    <div class="contact-item">
                        <span>📱</span>
                        <span>${user?.phone || "+1 (555) 123-4567"}</span>
                    </div>
                    <div class="contact-item">
                        <span>📍</span>
                        <span>${user?.location || "City, Country"}</span>
                    </div>
                </div>
            </div>
        </header>

        <main class="content">
            ${portfolioSections.map(section => `
                <section class="section">
                    <div class="section-header">
                        <h2>
                            <span class="section-icon"></span>
                            ${section.title}
                        </h2>
                    </div>
                    
                    ${section.description ? `<p class="section-description">${section.description}</p>` : ''}
                    
                    <div class="section-content">
                        ${section.list && section.list.length > 0 ? `
                            <div class="items-grid">
                                ${section.list.map(item => `
                                    <div class="item">
                                        <div class="item-title">${item}</div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : `
                            <div class="no-items">
                                No items added yet. Add some ${section.title.toLowerCase()} to showcase your achievements!
                            </div>
                        `}
                    </div>
                </section>
            `).join('')}
        </main>

        <footer class="footer">
            <p>Generated on ${new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}</p>
        </footer>
    </div>
</body>
</html>`;
      
      setPortfolioHtml(html);
      setGenerateMsg("Portfolio generated and updated successfully!");
      timeoutRef.current = setTimeout(() => setGenerateMsg(""), 3000);
    } catch (e) {
      setGenerateMsg("Failed to generate portfolio. Please try again.");
    }
    setGenerating(false);
  };

  // Add new section
  const handleAddSection = () => {
    setPortfolioSections([
      ...portfolioSections,
      { title: "New Section", status: "incomplete", description: "", list: [] },
    ]);
    setEditingIndex(portfolioSections.length);
    setEditSection({ title: "New Section", status: "incomplete", description: "", list: [] });
  };

  // Edit section
  const handleEditSection = (idx) => {
    setEditingIndex(idx);
    setEditSection({ ...portfolioSections[idx] });
  };

  // Save section
  const handleSaveSection = (idx) => {
    const updated = [...portfolioSections];
    updated[idx] = { ...editSection, list: editSection.list || [] };
    setPortfolioSections(updated);
    setEditingIndex(null);
    setEditSection({ title: "", status: "incomplete", description: "", list: [] });
  };

  // Remove section
  const handleRemoveSection = (idx) => {
    setPortfolioSections(portfolioSections.filter((_, i) => i !== idx));
    setEditingIndex(null);
  };

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
              <Button variant="outline" size="sm" onClick={handleAddSection}>
                <Plus className="h-4 w-4 mr-2" />
                Add Section
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
                    {editingIndex === index ? (
                      <div className="space-y-2">
                        <input
                          className="border rounded px-2 py-1 w-full mb-1"
                          value={editSection.title}
                          onChange={e => setEditSection({ ...editSection, title: e.target.value })}
                          placeholder="Section Title"
                        />
                        <input
                          className="border rounded px-2 py-1 w-full mb-1"
                          value={editSection.description}
                          onChange={e => setEditSection({ ...editSection, description: e.target.value })}
                          placeholder="Description"
                        />
                        <select
                          className="border rounded px-2 py-1 w-full mb-1"
                          value={editSection.status}
                          onChange={e => setEditSection({ ...editSection, status: e.target.value })}
                        >
                          <option value="complete">complete</option>
                          <option value="incomplete">incomplete</option>
                        </select>
                        <div className="space-y-1">
                          <label className="block text-xs font-semibold mb-1">Items</label>
                          {(editSection.list || []).map((item, i) => (
                            <div key={i} className="flex gap-2 mb-1">
                              <input
                                className="border rounded px-2 py-1 w-full"
                                value={item}
                                onChange={e => {
                                  const newList = [...editSection.list];
                                  newList[i] = e.target.value;
                                  setEditSection({ ...editSection, list: newList });
                                }}
                              />
                              <Button size="icon" variant="ghost" onClick={() => {
                                const newList = editSection.list.filter((_, idx) => idx !== i);
                                setEditSection({ ...editSection, list: newList });
                              }} title="Remove">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                          <Button size="sm" variant="outline" onClick={() => setEditSection({ ...editSection, list: [...(editSection.list || []), ""] })}>
                            <Plus className="h-4 w-4 mr-1" /> Add Item
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{section.title}</p>
                          <Badge variant="outline" className="text-xs">
                            {(section.list ? section.list.length : 0)} items
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {section.description}
                        </p>
                        {section.list && section.list.length > 0 && (
                          <ul className="list-disc pl-6 mt-1 text-xs text-muted-foreground">
                            {section.list.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                  <Badge 
                    variant={section.status === "complete" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {section.status}
                  </Badge>
                  {editingIndex === index ? (
                    <>
                      <Button size="icon" variant="outline" onClick={() => handleSaveSection(index)} title="Save">
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => handleRemoveSection(index)} title="Delete">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </>
                  ) : (
                    <Button size="icon" variant="outline" onClick={() => handleEditSection(index)} title="Edit">
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!portfolioHtml) return;
                  const preview = window.open();
                  if (preview) preview.document.write(portfolioHtml);
                }}
                disabled={!portfolioHtml}
              >
                <Eye className="h-4 w-4 mr-2" />
                Full Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!portfolioHtml) return;
                  const blob = new Blob([portfolioHtml], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'portfolio.html';
                  document.body.appendChild(a);
                  a.click();
                  setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }, 100);
                }}
                disabled={!portfolioHtml}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
          <div className="bg-muted/30 rounded-lg p-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-1">{user ? `${user.first_name} ${user.last_name}` : "John Doe"}</h2>
            <p className="text-base text-muted-foreground mb-2">{user?.major || "Computer Science Student"}</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
              Your portfolio is automatically generated based on your achievements, certificates, and profile information. Preview or download to see the full version.
            </p>
            <Button
              className="mt-2 px-8 py-3 text-base font-semibold"
              size="lg"
              onClick={handleGeneratePortfolio}
              disabled={generating}
            >
              {generating ? "Generating..." : "Generate Updated Portfolio"}
            </Button>
            {generateMsg && (
              <div className="mt-3 text-green-600 font-medium animate-fade-in">{generateMsg}</div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Portfolio;
// import { FileText, Download, Share2, Eye, ExternalLink, Edit, Plus, Trash2, Save } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { useAuth } from "@/contexts/AuthContext";
// import { useState, useRef } from "react";

// const Portfolio = () => {
//   const { user } = useAuth();
  
//   const [portfolioStats, setPortfolioStats] = useState({
//     totalViews: 147,
//     downloads: 23,
//     shares: 8,
//     lastUpdated: "2024-01-20",
//   });

//   const [portfolioSections, setPortfolioSections] = useState([
//     { 
//       title: "Personal Information", 
//       status: "complete", 
//       description: "Basic personal details and contact information",
//       list: ["Name", "Email", "Phone", "Address"]
//     },
//     { 
//       title: "Education", 
//       status: "complete", 
//       description: "Academic qualifications and achievements",
//       list: ["University Details", "GPA", "Major"]
//     },
//     { 
//       title: "Skills", 
//       status: "incomplete", 
//       description: "Technical and soft skills",
//       list: ["Programming Languages", "Frameworks", "Tools"]
//     },
//     { 
//       title: "Projects", 
//       status: "incomplete", 
//       description: "Personal and academic projects",
//       list: []
//     },
//     { 
//       title: "Certificates", 
//       status: "complete", 
//       description: "Professional certifications and courses",
//       list: ["AWS Cloud Practitioner"]
//     }
//   ]);

//   const [recentUpdates, setRecentUpdates] = useState([
//     {
//       section: "Certificates",
//       action: "Added AWS Cloud Practitioner",
//       date: "2024-01-20",
//     },
//     {
//       section: "Projects", 
//       action: "Updated E-commerce Website details",
//       date: "2024-01-18",
//     },
//     {
//       section: "Skills",
//       action: "Added React Native skill",
//       date: "2024-01-15",
//     },
//   ]);

//   // Editing state
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [editSection, setEditSection] = useState({ 
//     title: "", 
//     status: "incomplete", 
//     description: "", 
//     list: [] 
//   });

//   // Portfolio generation state
//   const [generating, setGenerating] = useState(false);
//   const [generateMsg, setGenerateMsg] = useState("");
//   const [portfolioHtml, setPortfolioHtml] = useState("");
//   const timeoutRef = useRef(null);

//   // Generate template-based HTML portfolio
//   const handleGeneratePortfolio = async () => {
//     setGenerating(true);
//     setGenerateMsg("");
//     try {
//       // Simulate delay
//       await new Promise(res => setTimeout(res, 1200));
      
//       // Build HTML template
//       const html = `
//  <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>${user ? `${user.first_name} ${user.last_name} - Portfolio` : "Professional Portfolio"}</title>
//     <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
//     <style>
//         * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//         }

//         body {
//             font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
//             line-height: 1.6;
//             color: #1f2937;
//             background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
//             min-height: 100vh;
//         }

//         .container {
//             max-width: 900px;
//             margin: 0 auto;
//             background: white;
//             box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
//             min-height: 100vh;
//         }

//         /* Header Section */
//         .header {
//             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//             color: white;
//             padding: 60px 40px;
//             text-align: center;
//             position: relative;
//             overflow: hidden;
//         }

//         .header::before {
//             content: '';
//             position: absolute;
//             top: 0;
//             left: 0;
//             right: 0;
//             bottom: 0;
//             background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
//             opacity: 0.1;
//         }

//         .header-content {
//             position: relative;
//             z-index: 1;
//         }

//         .header h1 {
//             font-size: 3rem;
//             font-weight: 700;
//             margin-bottom: 10px;
//             letter-spacing: -0.025em;
//         }

//         .header .subtitle {
//             font-size: 1.25rem;
//             font-weight: 400;
//             opacity: 0.9;
//             margin-bottom: 20px;
//         }

//         .contact-info {
//             display: flex;
//             justify-content: center;
//             gap: 30px;
//             margin-top: 30px;
//             flex-wrap: wrap;
//         }

//         .contact-item {
//             display: flex;
//             align-items: center;
//             gap: 8px;
//             font-size: 0.9rem;
//             opacity: 0.9;
//         }

//         /* Main Content */
//         .content {
//             padding: 50px 40px;
//         }

//         .section {
//             margin-bottom: 50px;
//             padding-bottom: 30px;
//             border-bottom: 1px solid #e5e7eb;
//         }

//         .section:last-child {
//             border-bottom: none;
//             margin-bottom: 0;
//         }

//         .section-header {
//             display: flex;
//             align-items: center;
//             justify-content: space-between;
//             margin-bottom: 25px;
//         }

//         .section h2 {
//             font-size: 1.75rem;
//             font-weight: 600;
//             color: #1f2937;
//             display: flex;
//             align-items: center;
//             gap: 12px;
//         }

//         .section-icon {
//             width: 8px;
//             height: 8px;
//             background: linear-gradient(135deg, #667eea, #764ba2);
//             border-radius: 50%;
//         }

//         .item-count {
//             background: linear-gradient(135deg, #667eea, #764ba2);
//             color: white;
//             padding: 4px 12px;
//             border-radius: 20px;
//             font-size: 0.75rem;
//             font-weight: 500;
//             letter-spacing: 0.025em;
//         }

//         .section-description {
//             color: #6b7280;
//             font-size: 1rem;
//             margin-bottom: 20px;
//             font-style: italic;
//         }

//         .items-grid {
//             display: grid;
//             gap: 15px;
//             grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//         }

//         .item {
//             background: #f9fafb;
//             padding: 20px;
//             border-radius: 12px;
//             border: 1px solid #e5e7eb;
//             transition: all 0.2s ease;
//             position: relative;
//         }

//         .item:hover {
//             transform: translateY(-2px);
//             box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
//             border-color: #d1d5db;
//         }

//         .item-title {
//             font-weight: 500;
//             color: #374151;
//             margin-bottom: 5px;
//         }

//         .no-items {
//             text-align: center;
//             color: #9ca3af;
//             font-style: italic;
//             padding: 40px 20px;
//             background: #f9fafb;
//             border-radius: 12px;
//             border: 2px dashed #d1d5db;
//         }

//         /* Footer */
//         .footer {
//             background: #f8fafc;
//             text-align: center;
//             padding: 30px 40px;
//             color: #6b7280;
//             font-size: 0.9rem;
//             border-top: 1px solid #e5e7eb;
//         }

//         /* Responsive Design */
//         @media (max-width: 768px) {
//             .header {
//                 padding: 40px 20px;
//             }
            
//             .header h1 {
//                 font-size: 2rem;
//             }
            
//             .content {
//                 padding: 30px 20px;
//             }
            
//             .section h2 {
//                 font-size: 1.5rem;
//             }
            
//             .contact-info {
//                 flex-direction: column;
//                 gap: 15px;
//             }
            
//             .items-grid {
//                 grid-template-columns: 1fr;
//             }
            
//             .section-header {
//                 flex-direction: column;
//                 align-items: flex-start;
//                 gap: 15px;
//             }
//         }

//         /* Print Styles */
//         @media print {
//             body {
//                 background: white;
//             }
            
//             .container {
//                 box-shadow: none;
//             }
            
//             .header {
//                 background: #667eea !important;
//                 -webkit-print-color-adjust: exact;
//             }
//         }
//     </style>
// </head>
// <body>
//     <div class="container">
//         <header class="header">
//             <div class="header-content">
//                 <h1>${user ? `${user.first_name} ${user.last_name}` : "John Doe"}</h1>
//                 <p class="subtitle">${user?.major || "Computer Science Student"}</p>
//                 <div class="contact-info">
//                     <div class="contact-item">
//                         <span>📧</span>
//                         <span>${user?.email || "john.doe@email.com"}</span>
//                     </div>
//                     <div class="contact-item">
//                         <span>📱</span>
//                         <span>${user?.phone || "+1 (555) 123-4567"}</span>
//                     </div>
//                     <div class="contact-item">
//                         <span>📍</span>
//                         <span>${user?.location || "City, Country"}</span>
//                     </div>
//                 </div>
//             </div>
//         </header>

//         <main class="content">
//             ${portfolioSections.map(section => `
//                 <section class="section">
//                     <div class="section-header">
//                         <h2>
//                             <span class="section-icon"></span>
//                             ${section.title}
//                         </h2>
                       
//                     </div>
                    
//                     ${section.description ? `<p class="section-description">${section.description}</p>` : ''}
                    
//                     <div class="section-content">
//                         ${section.list && section.list.length > 0 ? `
//                             <div class="items-grid">
//                                 ${section.list.map(item => `
//                                     <div class="item">
//                                         <div class="item-title">${item}</div>
//                                     </div>
//                                 `).join('')}
//                             </div>
//                         ` : `
//                             <div class="no-items">
//                                 No items added yet. Add some ${section.title.toLowerCase()} to showcase your achievements!
//                             </div>
//                         `}
//                     </div>
//                 </section>
//             `).join('')}
//         </main>

//         <footer class="footer">
//             <p>Generated on ${new Date().toLocaleDateString('en-US', { 
//                 year: 'numeric', 
//                 month: 'long', 
//                 day: 'numeric' 
//             })}</p>
//         </footer>
//     </div>
// </body>
// </html>
//       `;
      
//       setPortfolioHtml(html);
//       setGenerateMsg("Portfolio generated and updated successfully!");
//       timeoutRef.current = setTimeout(() => setGenerateMsg(""), 3000);
//     } catch (e) {
//       setGenerateMsg("Failed to generate portfolio. Please try again.");
//     }
//     setGenerating(false);
//   };

//   // Add new section
//   const handleAddSection = () => {
//     setPortfolioSections([
//       ...portfolioSections,
//       { title: "New Section", status: "incomplete", description: "", list: [] },
//     ]);
//     setEditingIndex(portfolioSections.length);
//     setEditSection({ title: "New Section", status: "incomplete", description: "", list: [] });
//   };

//   // Edit section
//   const handleEditSection = (idx) => {
//     setEditingIndex(idx);
//     setEditSection({ ...portfolioSections[idx] });
//   };

//   // Save section
//   const handleSaveSection = (idx) => {
//     const updated = [...portfolioSections];
//     updated[idx] = { ...editSection, list: editSection.list || [] };
//     setPortfolioSections(updated);
//     setEditingIndex(null);
//     setEditSection({ title: "", status: "incomplete", description: "", list: [] });
//   };

//   // Remove section
//   const handleRemoveSection = (idx) => {
//     setPortfolioSections(portfolioSections.filter((_, i) => i !== idx));
//     setEditingIndex(null);
//   };

//   return (
//     <div className="space-y-6 animate-fade-in">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold">Portfolio</h1>
//           <p className="text-muted-foreground">
//             Generate and manage your professional portfolio
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <Button variant="outline" className="flex items-center gap-2">
//             <Eye className="h-4 w-4" />
//             Preview
//           </Button>
//           <Button className="flex items-center gap-2">
//             <Download className="h-4 w-4" />
//             Download PDF
//           </Button>
//         </div>
//       </div>

//       {/* Stats Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <Card className="stats-card">
//           <div className="text-center space-y-2">
//             <h3 className="text-2xl font-bold text-primary">{portfolioStats.totalViews}</h3>
//             <p className="text-sm text-muted-foreground">Total Views</p>
//           </div>
//         </Card>
//         <Card className="stats-card">
//           <div className="text-center space-y-2">
//             <h3 className="text-2xl font-bold text-success">{portfolioStats.downloads}</h3>
//             <p className="text-sm text-muted-foreground">Downloads</p>
//           </div>
//         </Card>
//         <Card className="stats-card">
//           <div className="text-center space-y-2">
//             <h3 className="text-2xl font-bold text-warning">{portfolioStats.shares}</h3>
//             <p className="text-sm text-muted-foreground">Shares</p>
//           </div>
//         </Card>
//         <Card className="stats-card">
//           <div className="text-center space-y-2">
//             <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
//             <p className="text-sm font-semibold">{portfolioStats.lastUpdated}</p>
//           </div>
//         </Card>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Portfolio Sections */}
//         <Card className="portal-card p-6">
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-semibold">Portfolio Sections</h3>
//               <Button variant="outline" size="sm" onClick={handleAddSection}>
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Section
//               </Button>
//             </div>

//             <div className="space-y-3">
//               {portfolioSections.map((section, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
//                 >
//                   <div className="p-2 bg-primary/10 rounded-lg">
//                     <FileText className="h-4 w-4 text-primary" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     {editingIndex === index ? (
//                       <div className="space-y-2">
//                         <input
//                           className="border rounded px-2 py-1 w-full mb-1"
//                           value={editSection.title}
//                           onChange={e => setEditSection({ ...editSection, title: e.target.value })}
//                           placeholder="Section Title"
//                         />
//                         <input
//                           className="border rounded px-2 py-1 w-full mb-1"
//                           value={editSection.description}
//                           onChange={e => setEditSection({ ...editSection, description: e.target.value })}
//                           placeholder="Description"
//                         />
//                         <select
//                           className="border rounded px-2 py-1 w-full mb-1"
//                           value={editSection.status}
//                           onChange={e => setEditSection({ ...editSection, status: e.target.value })}
//                         >
//                           <option value="complete">complete</option>
//                           <option value="incomplete">incomplete</option>
//                         </select>
//                         <div className="space-y-1">
//                           <label className="block text-xs font-semibold mb-1">Items</label>
//                           {(editSection.list || []).map((item, i) => (
//                             <div key={i} className="flex gap-2 mb-1">
//                               <input
//                                 className="border rounded px-2 py-1 w-full"
//                                 value={item}
//                                 onChange={e => {
//                                   const newList = [...editSection.list];
//                                   newList[i] = e.target.value;
//                                   setEditSection({ ...editSection, list: newList });
//                                 }}
//                               />
//                               <Button size="icon" variant="ghost" onClick={() => {
//                                 const newList = editSection.list.filter((_, idx) => idx !== i);
//                                 setEditSection({ ...editSection, list: newList });
//                               }} title="Remove">
//                                 <Trash2 className="h-4 w-4 text-destructive" />
//                               </Button>
//                             </div>
//                           ))}
//                           <Button size="sm" variant="outline" onClick={() => setEditSection({ ...editSection, list: [...(editSection.list || []), ""] })}>
//                             <Plus className="h-4 w-4 mr-1" /> Add Item
//                           </Button>
//                         </div>
//                       </div>
//                     ) : (
//                       <div>
//                         <div className="flex items-center gap-2">
//                           <p className="font-medium">{section.title}</p>
//                           <Badge variant="outline" className="text-xs">
//                             {(section.list ? section.list.length : 0)} items
//                           </Badge>
//                         </div>
//                         <p className="text-sm text-muted-foreground">
//                           {section.description}
//                         </p>
//                         {section.list && section.list.length > 0 && (
//                           <ul className="list-disc pl-6 mt-1 text-xs text-muted-foreground">
//                             {section.list.map((item, i) => (
//                               <li key={i}>{item}</li>
//                             ))}
//                           </ul>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                   <Badge 
//                     variant={section.status === "complete" ? "default" : "secondary"}
//                     className="text-xs"
//                   >
//                     {section.status}
//                   </Badge>
//                   {editingIndex === index ? (
//                     <>
//                       <Button size="icon" variant="outline" onClick={() => handleSaveSection(index)} title="Save">
//                         <Save className="h-4 w-4" />
//                       </Button>
//                       <Button size="icon" variant="outline" onClick={() => handleRemoveSection(index)} title="Delete">
//                         <Trash2 className="h-4 w-4 text-destructive" />
//                       </Button>
//                     </>
//                   ) : (
//                     <Button size="icon" variant="outline" onClick={() => handleEditSection(index)} title="Edit">
//                       <Edit className="h-4 w-4" />
//                     </Button>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </Card>

//         {/* Recent Updates & Actions */}
//         <div className="space-y-6">
//           {/* Recent Updates */}
//           <Card className="portal-card p-6">
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold">Recent Updates</h3>
//               <div className="space-y-3">
//                 {recentUpdates.map((update, index) => (
//                   <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
//                     <div className="w-2 h-2 bg-primary rounded-full mt-2" />
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium">{update.action}</p>
//                       <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                         <span>{update.section}</span>
//                         <span>•</span>
//                         <span>{update.date}</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </Card>

//           {/* Actions */}
//           <Card className="portal-card p-6">
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold">Quick Actions</h3>
//               <div className="space-y-3">
//                 <Button variant="outline" className="w-full justify-start">
//                   <Share2 className="h-4 w-4 mr-2" />
//                   Share Portfolio Link
//                 </Button>
//                 <Button variant="outline" className="w-full justify-start">
//                   <ExternalLink className="h-4 w-4 mr-2" />
//                   View Public Portfolio
//                 </Button>
//                 <Button variant="outline" className="w-full justify-start">
//                   <Download className="h-4 w-4 mr-2" />
//                   Export as PDF
//                 </Button>
//                 <Button variant="outline" className="w-full justify-start">
//                   <Edit className="h-4 w-4 mr-2" />
//                   Customize Template
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         </div>
//       </div>

//       {/* Portfolio Preview */}
//       <Card className="portal-card p-6">
//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold">Portfolio Preview</h3>
//             <div className="flex items-center gap-2">
//               <Badge variant="secondary">Auto-saved</Badge>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => {
//                   if (!portfolioHtml) return;
//                   const preview = window.open();
//                   if (preview) preview.document.write(portfolioHtml);
//                 }}
//                 disabled={!portfolioHtml}
//               >
//                 <Eye className="h-4 w-4 mr-2" />
//                 Full Preview
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => {
//                   if (!portfolioHtml) return;
//                   const blob = new Blob([portfolioHtml], { type: 'text/html' });
//                   const url = URL.createObjectURL(blob);
//                   const a = document.createElement('a');
//                   a.href = url;
//                   a.download = 'portfolio.html';
//                   document.body.appendChild(a);
//                   a.click();
//                   setTimeout(() => {
//                     document.body.removeChild(a);
//                     URL.revokeObjectURL(url);
//                   }, 100);
//                 }}
//                 disabled={!portfolioHtml}
//               >
//                 <Download className="h-4 w-4 mr-2" />
//                 Download
//               </Button>
//             </div>
//           </div>
//           <div className="bg-muted/30 rounded-lg p-8 flex flex-col items-center text-center">
//             <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
//               <FileText className="h-10 w-10 text-primary" />
//             </div>
//             <h2 className="text-2xl font-bold mb-1">{user ? `${user.first_name} ${user.last_name}` : "John Doe"}</h2>
//             <p className="text-base text-muted-foreground mb-2">{user?.major || "Computer Science Student"}</p>
//             <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
//               Your portfolio is automatically generated based on your achievements, certificates, and profile information. Preview or download to see the full version.
//             </p>
//             <Button
//               className="mt-2 px-8 py-3 text-base font-semibold"
//               size="lg"
//               onClick={handleGeneratePortfolio}
//               disabled={generating}
//             >
//               {generating ? "Generating..." : "Generate Updated Portfolio"}
//             </Button>
//             {generateMsg && (
//               <div className="mt-3 text-green-600 font-medium animate-fade-in">{generateMsg}</div>
//             )}
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default Portfolio;