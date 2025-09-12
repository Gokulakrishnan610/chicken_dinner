import { useState } from "react";
import { 
  Settings as SettingsIcon, 
  Shield, 
  Database, 
  Mail,
  Bell,
  Globe,
  Key,
  Users,
  Save,
  RefreshCw
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const Settings = () => {
  const [settings, setSettings] = useState({
    institution: {
      name: "University of Technology",
      email: "admin@university.edu",
      phone: "+1 (555) 123-4567",
      address: "123 University Ave, Tech City, TC 12345"
    },
    system: {
      maintenanceMode: false,
      autoBackup: true,
      backupFrequency: "daily",
      maxFileSize: "10",
      sessionTimeout: "30"
    },
    notifications: {
      emailNotifications: true,
      systemAlerts: true,
      userActivity: false,
      reportGeneration: true
    },
    security: {
      twoFactorAuth: true,
      passwordPolicy: "strong",
      sessionTimeout: "30",
      ipWhitelist: false
    }
  });

  const handleSave = () => {
    console.log("Saving settings:", settings);
  };

  const handleReset = () => {
    console.log("Resetting settings");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground text-lg">
          Configure system-wide settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="institution" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="institution">Institution</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="institution" className="space-y-6">
          <Card className="portal-card p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Institution Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Basic information about your institution
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Institution Name</label>
                  <Input
                    value={settings.institution.name}
                    onChange={(e) => setSettings({
                      ...settings,
                      institution: { ...settings.institution, name: e.target.value }
                    })}
                    placeholder="Enter institution name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Email</label>
                  <Input
                    value={settings.institution.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      institution: { ...settings.institution, email: e.target.value }
                    })}
                    placeholder="Enter contact email"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input
                    value={settings.institution.phone}
                    onChange={(e) => setSettings({
                      ...settings,
                      institution: { ...settings.institution, phone: e.target.value }
                    })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Address</label>
                  <Input
                    value={settings.institution.address}
                    onChange={(e) => setSettings({
                      ...settings,
                      institution: { ...settings.institution, address: e.target.value }
                    })}
                    placeholder="Enter full address"
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="portal-card p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">System Configuration</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure system behavior and performance
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max File Upload Size (MB)</label>
                  <Input
                    value={settings.system.maxFileSize}
                    onChange={(e) => setSettings({
                      ...settings,
                      system: { ...settings.system, maxFileSize: e.target.value }
                    })}
                    placeholder="10"
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Session Timeout (minutes)</label>
                  <Input
                    value={settings.system.sessionTimeout}
                    onChange={(e) => setSettings({
                      ...settings,
                      system: { ...settings.system, sessionTimeout: e.target.value }
                    })}
                    placeholder="30"
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Backup Frequency</label>
                  <select 
                    value={settings.system.backupFrequency}
                    onChange={(e) => setSettings({
                      ...settings,
                      system: { ...settings.system, backupFrequency: e.target.value }
                    })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Maintenance Mode</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.system.maintenanceMode}
                      onChange={(e) => setSettings({
                        ...settings,
                        system: { ...settings.system, maintenanceMode: e.target.checked }
                      })}
                      className="rounded border-input"
                    />
                    <span className="text-sm">Enable maintenance mode</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="portal-card p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Notification Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure notification preferences
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Send notifications via email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, emailNotifications: e.target.checked }
                    })}
                    className="rounded border-input"
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">System Alerts</h4>
                    <p className="text-sm text-muted-foreground">Receive system alerts and warnings</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.systemAlerts}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, systemAlerts: e.target.checked }
                    })}
                    className="rounded border-input"
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">User Activity</h4>
                    <p className="text-sm text-muted-foreground">Notifications for user activities</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.userActivity}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, userActivity: e.target.checked }
                    })}
                    className="rounded border-input"
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Report Generation</h4>
                    <p className="text-sm text-muted-foreground">Notifications when reports are generated</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.reportGeneration}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, reportGeneration: e.target.checked }
                    })}
                    className="rounded border-input"
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="portal-card p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Security Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure security policies and access controls
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.security.twoFactorAuth}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, twoFactorAuth: e.target.checked }
                    })}
                    className="rounded border-input"
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">IP Whitelist</h4>
                    <p className="text-sm text-muted-foreground">Restrict access to specific IP addresses</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.security.ipWhitelist}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, ipWhitelist: e.target.checked }
                    })}
                    className="rounded border-input"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password Policy</label>
                  <select 
                    value={settings.security.passwordPolicy}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, passwordPolicy: e.target.value }
                    })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="basic">Basic (8+ characters)</option>
                    <option value="strong">Strong (12+ chars, mixed case, numbers, symbols)</option>
                    <option value="enterprise">Enterprise (16+ chars, complex requirements)</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4">
        <Button variant="outline" onClick={handleReset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Settings;
