import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  GraduationCap, 
  BarChart3, 
  Upload, 
  User, 
  Settings,
  Bell,
  Award,
  FileText,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "./ThemeToggle";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { 
      icon: BarChart3, 
      label: "Dashboard", 
      path: "/", 
      badge: null 
    },
    { 
      icon: Upload, 
      label: "Upload Certificates", 
      path: "/upload", 
      badge: null 
    },
    { 
      icon: Award, 
      label: "Achievements", 
      path: "/achievements", 
      badge: "12" 
    },
    { 
      icon: FileText, 
      label: "Portfolio", 
      path: "/portfolio", 
      badge: null 
    },
    { 
      icon: User, 
      label: "Profile", 
      path: "/profile", 
      badge: null 
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-card"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-40 h-screen w-64 transform bg-card border-r transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-lg tracking-tight">Student Portal</h2>
              <p className="text-xs text-muted-foreground font-medium">EduPortal</p>
            </div>
          </div>
        </div>


        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`professional-nav ${
                isActive(item.path) 
                  ? 'active' 
                  : 'text-foreground/80 hover:text-foreground hover:bg-accent'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1 font-medium">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="text-xs font-medium">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-4 left-4 right-4 space-y-1">
          <div className="flex items-center justify-between mb-2">
            <ThemeToggle />
          </div>
          <Button variant="ghost" className="w-full justify-start text-sm font-medium">
            <Bell className="h-4 w-4 mr-3" />
            Notifications
            <Badge variant="destructive" className="ml-auto text-xs font-medium">3</Badge>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm font-medium">
            <Settings className="h-4 w-4 mr-3" />
            Settings
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;