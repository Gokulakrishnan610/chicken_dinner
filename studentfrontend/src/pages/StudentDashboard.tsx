import { useState } from "react";
import { Award, BookOpen, Trophy, TrendingUp, Calendar, Users } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import AchievementChart from "@/components/AchievementChart";
import VolunteeringModal from "@/components/VolunteeringModal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const StudentDashboard = () => {
  const [isVolunteeringModalOpen, setIsVolunteeringModalOpen] = useState(false);
  const { toast } = useToast();

  const recentAchievements = [
    {
      id: 1,
      title: "AWS Cloud Practitioner",
      type: "Certification",
      date: "2024-01-20",
      status: "approved",
      points: 50,
    },
    {
      id: 2,
      title: "React Developer Course",
      type: "Course",
      date: "2024-01-15",
      status: "approved", 
      points: 45,
    },
    {
      id: 3,
      title: "Community Cleanup Drive",
      type: "Volunteering",
      date: "2024-01-10",
      status: "pending",
      points: 25,
    },
    {
      id: 4,
      title: "E-commerce Website",
      type: "Project",
      date: "2024-01-05",
      status: "approved",
      points: 60,
    },
  ];

  const upcomingDeadlines = [
    { title: "Python Course Final Project", dueDate: "2024-02-01", priority: "high" },
    { title: "Data Science Certification", dueDate: "2024-02-05", priority: "medium" },
    { title: "Portfolio Website Update", dueDate: "2024-02-10", priority: "low" },
  ];

  const handleLogVolunteering = (data: any) => {
    // Here you would typically send the data to your backend
    console.log("Volunteering data:", data);
    
    // For now, we'll just show a success message
    toast({
      title: "Volunteering Activity Logged",
      description: `${data.title} has been successfully added to your achievements.`,
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back, Sarah!</h1>
        <p className="text-muted-foreground text-lg">
          Track your academic achievements and build your professional portfolio.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Certificates"
          value="24"
          change="+3 this month"
          changeType="positive"
          icon={Award}
          gradient
        />
        <StatsCard
          title="Projects Completed"
          value="12"
          change="+2 this week"
          changeType="positive"
          icon={BookOpen}
        />
        <StatsCard
          title="Achievement Score"
          value="1,247"
          change="+125 points"
          changeType="positive"
          icon={Trophy}
        />
        <StatsCard
          title="Portfolio Views"
          value="89"
          change="+12% this month"
          changeType="positive"
          icon={TrendingUp}
        />
      </div>

      {/* Charts Section */}
      <AchievementChart />

      {/* Recent Activity & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Achievements */}
        <Card className="portal-card p-6 bg-gradient-to-br from-card to-muted/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight">Recent Achievements</h3>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {recentAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/60 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="p-2.5 bg-primary/10 rounded-lg">
                    <Award className="h-4 w-4 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-tight">{achievement.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{achievement.type}</span>
                      <span>•</span>
                      <span>{achievement.date}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <Badge 
                      variant={achievement.status === "approved" ? "default" : "secondary"}
                      className="text-xs font-medium"
                    >
                      +{achievement.points} pts
                    </Badge>
                    <Badge 
                      variant={achievement.status === "approved" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {achievement.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="portal-card p-6 bg-gradient-to-br from-card to-muted/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight">Upcoming Deadlines</h3>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="space-y-3">
              {upcomingDeadlines.map((deadline, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/40 transition-colors"
                >
                  <div className={`w-3 h-3 rounded-full ${
                    deadline.priority === "high" 
                      ? 'bg-destructive' 
                      : deadline.priority === "medium"
                      ? 'bg-warning'
                      : 'bg-success'
                  }`} />
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-tight">{deadline.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">Due {deadline.dueDate}</p>
                  </div>

                  <Badge 
                    variant={
                      deadline.priority === "high" 
                        ? "destructive"
                        : deadline.priority === "medium"
                        ? "secondary"
                        : "outline"
                    }
                    className="text-xs mt-1"
                  >
                    {deadline.priority}
                  </Badge>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="portal-card p-6 bg-gradient-to-r from-card to-muted/30">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold tracking-tight">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Button className="flex items-center gap-2 font-medium">
              <Award className="h-4 w-4" />
              Upload Certificate
            </Button>
            <Button variant="outline" className="flex items-center gap-2 font-medium">
              <BookOpen className="h-4 w-4" />
              Add Project
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 font-medium"
              onClick={() => setIsVolunteeringModalOpen(true)}
            >
              <Users className="h-4 w-4" />
              Log Volunteering
            </Button>
            <Button variant="outline" className="flex items-center gap-2 font-medium">
              <TrendingUp className="h-4 w-4" />
              Generate Portfolio
            </Button>
          </div>
        </div>
      </Card>

      {/* Volunteering Modal */}
      <VolunteeringModal
        isOpen={isVolunteeringModalOpen}
        onClose={() => setIsVolunteeringModalOpen(false)}
        onLogVolunteering={handleLogVolunteering}
      />
    </div>
  );
};

export default StudentDashboard;