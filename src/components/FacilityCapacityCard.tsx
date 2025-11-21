import { Users, TrendingUp, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface FacilityCapacityCardProps {
  areaName: string;
  currentCapacity: number;
  maxCapacity: number;
  status: 'Quiet' | 'Moderate' | 'Busy' | 'Packed';
  lastUpdated: string;
}

const statusConfig = {
  Quiet: { color: 'bg-green-500', badge: 'default', textColor: 'text-green-600' },
  Moderate: { color: 'bg-blue-500', badge: 'secondary', textColor: 'text-blue-600' },
  Busy: { color: 'bg-orange-500', badge: 'secondary', textColor: 'text-orange-600' },
  Packed: { color: 'bg-red-500', badge: 'destructive', textColor: 'text-red-600' },
};

export function FacilityCapacityCard({
  areaName,
  currentCapacity,
  maxCapacity,
  status,
  lastUpdated,
}: FacilityCapacityCardProps) {
  const percentage = (currentCapacity / maxCapacity) * 100;
  const config = statusConfig[status];
  
  const timeAgo = (timestamp: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${config.color} animate-pulse`} />
          <div>
            <h3 className="font-semibold">{areaName}</h3>
            <div className="flex items-center gap-1 text-muted-foreground mt-1">
              <Clock className="w-3 h-3" />
              <span className="text-xs">{timeAgo(lastUpdated)}</span>
            </div>
          </div>
        </div>
        <Badge variant={config.badge as any}>{status}</Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Current Capacity</span>
          </div>
          <span className={`font-semibold ${config.textColor}`}>
            {currentCapacity} / {maxCapacity}
          </span>
        </div>

        <Progress value={percentage} className="h-2" />

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <TrendingUp className="w-3 h-3" />
          <span>{percentage.toFixed(0)}% capacity</span>
        </div>
      </div>
    </Card>
  );
}
