import { Award, Trophy, Star, Calendar, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const Achievements = () => {
  const achievements = [
    {
      id: 1,
      title: "AWS Cloud Practitioner",
      category: "Certification",
      date: "2024-01-20",
      status: "approved",
      points: 50,
      description: "Amazon Web Services Cloud Practitioner Certification",
      skills: ["Cloud Computing", "AWS", "Infrastructure"],
    },
    {
      id: 2,
      title: "React Developer Course",
      category: "Course",
      date: "2024-01-15", 
      status: "approved",
      points: 45,
      description: "Advanced React Development with Hooks and Context",
      skills: ["React", "JavaScript", "Frontend"],
    },
    {
      id: 3,
      title: "Community Cleanup Drive",
      category: "Volunteering",
      date: "2024-01-10",
      status: "pending",
      points: 25,
      description: "Organized community cleanup drive for local park",
      skills: ["Leadership", "Community Service", "Environmental"],
    },
    {
      id: 4,
      title: "E-commerce Website",
      category: "Project", 
      date: "2024-01-05",
      status: "approved",
      points: 60,
      description: "Full-stack e-commerce website with payment integration",
      skills: ["Full-stack", "Payment Integration", "Database"],
    },
    {
      id: 5,
      title: "Data Science Bootcamp",
      category: "Course",
      date: "2023-12-20",
      status: "approved", 
      points: 75,
      description: "Comprehensive data science bootcamp with machine learning",
      skills: ["Python", "Machine Learning", "Data Analysis"],
    },
    {
      id: 6,
      title: "Hackathon Winner",
      category: "Competition",
      date: "2023-12-15",
      status: "approved",
      points: 100,
      description: "First place in university-wide hackathon",
      skills: ["Innovation", "Teamwork", "Problem Solving"],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Certification":
        return <Award className="h-4 w-4" />;
      case "Competition":
        return <Trophy className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Achievements</h1>
            <p className="text-muted-foreground">
              Track and showcase all your academic and professional accomplishments
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Add Achievement
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Input 
            placeholder="Search achievements..." 
            className="max-w-sm"
          />
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid gap-6">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className="portal-card p-6 hover:scale-[1.01] transition-transform">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {getCategoryIcon(achievement.category)}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(achievement.status) as any}>
                    {achievement.status}
                  </Badge>
                  <Badge variant="outline">
                    +{achievement.points} pts
                  </Badge>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {achievement.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{achievement.category}</span>
                  <span>•</span>
                  <span>{achievement.date}</span>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Achievements;