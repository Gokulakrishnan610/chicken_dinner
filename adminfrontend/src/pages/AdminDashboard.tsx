import { useState } from "react";
import { 
  Users, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Download, 
  FileText,
  Settings,
  BarChart3,
  PieChart,
  Calendar,
  Filter
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsCard from "@/components/StatsCard";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

const AdminDashboard = () => {
  // Sample data for charts
  const studentEngagementData = [
    { month: 'Jan', active: 245, certificates: 89, projects: 34 },
    { month: 'Feb', active: 267, certificates: 102, projects: 41 },
    { month: 'Mar', active: 289, certificates: 118, projects: 38 },
    { month: 'Apr', active: 312, certificates: 134, projects: 45 },
    { month: 'May', active: 298, certificates: 127, projects: 52 },
    { month: 'Jun', active: 334, certificates: 156, projects: 48 },
  ];

  const skillMappingData = [
    { name: 'Programming', value: 35, color: 'hsl(var(--primary))' },
    { name: 'Web Development', value: 28, color: 'hsl(var(--success))' },
    { name: 'Data Science', value: 18, color: 'hsl(var(--warning))' },
    { name: 'Cloud Computing', value: 12, color: 'hsl(var(--accent))' },
    { name: 'Mobile Development', value: 7, color: 'hsl(var(--muted))' },
  ];

  const achievementCategoriesData = [
    { category: 'Certifications', count: 234, percentage: 45 },
    { category: 'Projects', count: 156, percentage: 30 },
    { category: 'Courses', count: 89, percentage: 17 },
    { category: 'Volunteering', count: 42, percentage: 8 },
  ];

  const users = [
    { id: 1, name: "Sarah Johnson", role: "Student", department: "Computer Science", status: "active", joinDate: "2021-09-01" },
    { id: 2, name: "Dr. Michael Smith", role: "Faculty", department: "Computer Science", status: "active", joinDate: "2018-08-15" },
    { id: 3, name: "Emily Davis", role: "Student", department: "Information Technology", status: "active", joinDate: "2022-01-10" },
    { id: 4, name: "Prof. Lisa Wang", role: "Faculty", department: "Data Science", status: "active", joinDate: "2019-03-20" },
    { id: 5, name: "Alex Rodriguez", role: "Student", department: "Computer Science", status: "inactive", joinDate: "2021-11-05" },
  ];

  const reports = [
    { name: "NAAC Accreditation Report", type: "NAAC", lastGenerated: "2024-01-15", status: "ready" },
    { name: "NIRF Ranking Data", type: "NIRF", lastGenerated: "2024-01-10", status: "ready" },
    { name: "Student Achievement Summary", type: "Custom", lastGenerated: "2024-01-20", status: "ready" },
    { name: "Faculty Performance Report", type: "Custom", lastGenerated: "2024-01-18", status: "generating" },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Student": return "default";
      case "Faculty": return "secondary";
      case "Admin": return "outline";
      default: return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "inactive": return "secondary";
      case "ready": return "default";
      case "generating": return "secondary";
      default: return "outline";
    }
  };

  const handleExportReport = (reportType: string, reportName: string) => {
    console.log("Exporting report:", reportType, reportName);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Institution-wide analytics and management console.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value="1,247"
          change="+12% this month"
          changeType="positive"
          icon={Users}
          gradient
        />
        <StatsCard
          title="Active Faculty"
          value="89"
          change="+3 new hires"
          changeType="positive"
          icon={BookOpen}
        />
        <StatsCard
          title="Certificates Issued"
          value="2,156"
          change="+234 this month"
          changeType="positive"
          icon={Award}
        />
        <StatsCard
          title="System Engagement"
          value="87%"
          change="+5% from last month"
          changeType="positive"
          icon={TrendingUp}
        />
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Engagement Chart */}
            <Card className="portal-card p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Student Engagement</h3>
                  <p className="text-sm text-muted-foreground">
                    Monthly active users and achievement submissions
                  </p>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={studentEngagementData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="month" 
                        className="text-muted-foreground"
                        fontSize={12}
                      />
                      <YAxis 
                        className="text-muted-foreground"
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Area 
                        type="monotone"
                        dataKey="active" 
                        stackId="1"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.6}
                        name="Active Users"
                      />
                      <Area 
                        type="monotone"
                        dataKey="certificates" 
                        stackId="2"
                        stroke="hsl(var(--success))"
                        fill="hsl(var(--success))"
                        fillOpacity={0.6}
                        name="Certificates"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>

            {/* Skill Mapping Chart */}
            <Card className="portal-card p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Skill Distribution</h3>
                  <p className="text-sm text-muted-foreground">
                    Popular skill categories among students
                  </p>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={skillMappingData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        stroke="none"
                      >
                        {skillMappingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {skillMappingData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="text-sm">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-muted-foreground">{item.value}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Achievement Categories */}
          <Card className="portal-card p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Achievement Categories</h3>
                <p className="text-sm text-muted-foreground">
                  Breakdown of student achievements by category
                </p>
              </div>
              <div className="grid gap-4">
                {achievementCategoriesData.map((category, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{category.category}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{category.count} items</span>
                          <Badge variant="outline">{category.percentage}%</Badge>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Reports Section */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Accreditation Reports</h3>
            <Button className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generate New Report
            </Button>
          </div>

          <div className="grid gap-4">
            {reports.map((report, index) => (
              <Card key={index} className="portal-card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-primary/10 rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{report.name}</h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Badge variant="outline">{report.type}</Badge>
                        <span>Last generated: {report.lastGenerated}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(report.status) as any}>
                      {report.status}
                    </Badge>
                    {report.status === "ready" && (
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleExportReport(report.type, report.name)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Advanced Export
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          {/* User Management */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">User Management</h3>
            <div className="flex items-center gap-2">
              <Button>
                <Users className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {users.map((user) => (
              <Card key={user.id} className="portal-card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-primary/10 rounded-lg">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{user.name}</h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Badge variant={getRoleColor(user.role) as any}>
                          {user.role}
                        </Badge>
                        <span>{user.department}</span>
                        <span>•</span>
                        <span>Joined {user.joinDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(user.status) as any}>
                      {user.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
