import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Dumbbell, Activity, CheckCircle2, XCircle } from 'lucide-react';
import { supabase, type Equipment } from '../lib/supabase';

export function EquipmentGrid() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipment();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('equipment_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'equipment' }, () => {
        fetchEquipment();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchEquipment = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching equipment:', error);
    } else {
      setEquipment(data || []);
    }
    setLoading(false);
  };

  const groupedEquipment = equipment.reduce((acc, eq) => {
    if (!acc[eq.category]) {
      acc[eq.category] = [];
    }
    acc[eq.category].push(eq);
    return acc;
  }, {} as Record<string, Equipment[]>);

  const getCategoryIcon = (category: string) => {
    return category === 'Cardio' ? Activity : Dumbbell;
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/4" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="font-semibold mb-4">Equipment Status</h2>
      
      <div className="space-y-6">
        {Object.entries(groupedEquipment).map(([category, items]) => {
          const Icon = getCategoryIcon(category);
          const availableCount = items.filter(eq => eq.is_available).length;
          
          return (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground">
                  {category}
                </h3>
                <Badge variant="secondary" className="ml-auto">
                  {availableCount}/{items.length} Available
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {items.map((eq) => (
                  <div
                    key={eq.id}
                    className={`border rounded-lg p-3 transition-all ${
                      eq.is_available
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium">{eq.name}</p>
                      {eq.is_available ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                      )}
                    </div>
                    <Badge
                      variant={eq.is_available ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {eq.is_available ? 'Available' : 'In Use'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
