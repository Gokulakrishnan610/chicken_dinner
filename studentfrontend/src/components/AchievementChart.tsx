import { Card } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const monthlyData = [
  { month: 'Jan', certificates: 4, projects: 2, volunteering: 1 },
  { month: 'Feb', certificates: 3, projects: 3, volunteering: 2 },
  { month: 'Mar', certificates: 6, projects: 1, volunteering: 1 },
  { month: 'Apr', certificates: 8, projects: 4, volunteering: 3 },
  { month: 'May', certificates: 5, projects: 2, volunteering: 2 },
  { month: 'Jun', certificates: 9, projects: 5, volunteering: 4 },
];

const categoryData = [
  { name: 'Technical Skills', value: 35, color: 'hsl(var(--primary))' },
  { name: 'Certifications', value: 28, color: 'hsl(var(--success))' },
  { name: 'Projects', value: 20, color: 'hsl(var(--warning))' },
  { name: 'Volunteering', value: 17, color: 'hsl(var(--accent))' },
];

const AchievementChart = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Progress */}
      <Card className="portal-card p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Monthly Progress</h3>
            <p className="text-sm text-muted-foreground">
              Track your achievements over the past 6 months
            </p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
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
                <Bar 
                  dataKey="certificates" 
                  stackId="a" 
                  fill="hsl(var(--primary))"
                  name="Certificates"
                />
                <Bar 
                  dataKey="projects" 
                  stackId="a" 
                  fill="hsl(var(--success))"
                  name="Projects"
                />
                <Bar 
                  dataKey="volunteering" 
                  stackId="a" 
                  fill="hsl(var(--warning))"
                  name="Volunteering"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Achievement Categories */}
      <Card className="portal-card p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Achievement Categories</h3>
            <p className="text-sm text-muted-foreground">
              Distribution of your achievements by category
            </p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
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
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {categoryData.map((item, index) => (
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
  );
};

export default AchievementChart;