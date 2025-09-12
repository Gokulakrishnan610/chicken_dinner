import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  gradient?: boolean;
}

const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon,
  gradient = false 
}: StatsCardProps) => {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive": return "text-green-600 dark:text-green-400";
      case "negative": return "text-red-600 dark:text-red-400";
      default: return "text-muted-foreground";
    }
  };

  return (
    <Card className={`stats-card ${gradient ? 'portal-gradient text-white' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className={`text-sm font-medium ${gradient ? 'text-white/80' : 'text-muted-foreground'}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold ${gradient ? 'text-white' : 'text-foreground'}`}>
            {value}
          </p>
          {change && (
            <p className={`text-xs ${getChangeColor()}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${gradient ? 'bg-white/20' : 'bg-primary/10'}`}>
          <Icon className={`h-6 w-6 ${gradient ? 'text-white' : 'text-primary'}`} />
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;