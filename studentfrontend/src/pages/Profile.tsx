import { User, Mail, Phone, MapPin, Calendar, Edit, Camera } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const studentInfo = {
    name: "Sarah Johnson",
    email: "sarah.johnson@university.edu",
    phone: "+1 (555) 123-4567",
    location: "Boston, MA",
    university: "MIT",
    major: "Computer Science",
    year: "Senior",
    gpa: "3.85",
    joinDate: "September 2021",
    bio: "Passionate computer science student with a focus on full-stack development and machine learning. Always eager to learn new technologies and contribute to innovative projects.",
  };

  const skills = [
    { name: "JavaScript", level: "Advanced", category: "Programming" },
    { name: "React", level: "Advanced", category: "Frontend" },
    { name: "Python", level: "Intermediate", category: "Programming" },
    { name: "AWS", level: "Intermediate", category: "Cloud" },
    { name: "Machine Learning", level: "Beginner", category: "AI/ML" },
    { name: "Node.js", level: "Intermediate", category: "Backend" },
  ];

  const interests = [
    "Web Development", "Artificial Intelligence", "Cloud Computing", 
    "Open Source", "Volunteering", "Photography", "Travel", "Reading"
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Advanced":
        return "default";
      case "Intermediate":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Button className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="portal-card p-6 lg:col-span-1">
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="/placeholder-avatar.jpg" alt={studentInfo.name} />
                  <AvatarFallback className="text-lg">
                    {studentInfo.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <h2 className="text-xl font-semibold">{studentInfo.name}</h2>
                <p className="text-muted-foreground">{studentInfo.major} Student</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{studentInfo.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{studentInfo.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{studentInfo.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {studentInfo.joinDate}</span>
              </div>
            </div>

            {/* Academic Info */}
            <div className="pt-4 border-t space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">University</p>
                  <p className="font-medium">{studentInfo.university}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Year</p>
                  <p className="font-medium">{studentInfo.year}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Major</p>
                  <p className="font-medium">{studentInfo.major}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">GPA</p>
                  <p className="font-medium">{studentInfo.gpa}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <Card className="portal-card p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">About</h3>
              <p className="text-muted-foreground leading-relaxed">
                {studentInfo.bio}
              </p>
            </div>
          </Card>

          {/* Skills */}
          <Card className="portal-card p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Skills</h3>
              <div className="grid gap-4">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{skill.name}</p>
                      <p className="text-sm text-muted-foreground">{skill.category}</p>
                    </div>
                    <Badge variant={getLevelColor(skill.level) as any}>
                      {skill.level}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full">
                Add Skill
              </Button>
            </div>
          </Card>

          {/* Interests */}
          <Card className="portal-card p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, index) => (
                  <Badge key={index} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" size="sm">
                Add Interest
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;