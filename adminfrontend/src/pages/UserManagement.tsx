import { useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Shield,
  UserCheck,
  GraduationCap
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const users = [
    { 
      id: 1, 
      name: "Sarah Johnson", 
      email: "sarah.johnson@university.edu",
      role: "Student", 
      department: "Computer Science", 
      status: "active", 
      joinDate: "2021-09-01",
      lastActive: "2024-01-20"
    },
    { 
      id: 2, 
      name: "Dr. Michael Smith", 
      email: "michael.smith@university.edu",
      role: "Faculty", 
      department: "Computer Science", 
      status: "active", 
      joinDate: "2018-08-15",
      lastActive: "2024-01-19"
    },
    { 
      id: 3, 
      name: "Emily Davis", 
      email: "emily.davis@university.edu",
      role: "Student", 
      department: "Information Technology", 
      status: "active", 
      joinDate: "2022-01-10",
      lastActive: "2024-01-18"
    },
    { 
      id: 4, 
      name: "Prof. Lisa Wang", 
      email: "lisa.wang@university.edu",
      role: "Faculty", 
      department: "Data Science", 
      status: "active", 
      joinDate: "2019-03-20",
      lastActive: "2024-01-17"
    },
    { 
      id: 5, 
      name: "Alex Rodriguez", 
      email: "alex.rodriguez@university.edu",
      role: "Student", 
      department: "Computer Science", 
      status: "inactive", 
      joinDate: "2021-11-05",
      lastActive: "2023-12-15"
    },
    { 
      id: 6, 
      name: "Admin User", 
      email: "admin@university.edu",
      role: "Admin", 
      department: "Administration", 
      status: "active", 
      joinDate: "2020-01-01",
      lastActive: "2024-01-20"
    },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Student": return "default";
      case "Faculty": return "secondary";
      case "Admin": return "destructive";
      default: return "outline";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Student": return GraduationCap;
      case "Faculty": return UserCheck;
      case "Admin": return Shield;
      default: return Users;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "inactive": return "secondary";
      default: return "outline";
    }
  };

  const handleEditUser = (userId: number) => {
    console.log("Edit user:", userId);
  };

  const handleDeleteUser = (userId: number) => {
    console.log("Delete user:", userId);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">User Management</h1>
        <p className="text-muted-foreground text-lg">
          Manage users, roles, and permissions across the platform.
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Users List */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => {
          const RoleIcon = getRoleIcon(user.role);
          return (
            <Card key={user.id} className="portal-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-primary/10 rounded-lg">
                    <RoleIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{user.name}</h3>
                      <Badge variant={getRoleColor(user.role) as any}>
                        {user.role}
                      </Badge>
                      <Badge variant={getStatusColor(user.status) as any}>
                        {user.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{user.email}</span>
                      <span>•</span>
                      <span>{user.department}</span>
                      <span>•</span>
                      <span>Joined {user.joinDate}</span>
                      <span>•</span>
                      <span>Last active: {user.lastActive}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditUser(user.id)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="portal-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </div>
        </Card>
        <Card className="portal-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-success/10 rounded-lg">
              <UserCheck className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</p>
            </div>
          </div>
        </Card>
        <Card className="portal-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-warning/10 rounded-lg">
              <GraduationCap className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Students</p>
              <p className="text-2xl font-bold">{users.filter(u => u.role === 'Student').length}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;
