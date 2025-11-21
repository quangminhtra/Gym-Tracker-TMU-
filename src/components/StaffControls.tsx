import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Settings, Plus, Minus, RefreshCw } from 'lucide-react';
import { supabase, type FacilityStatus, type Equipment } from '../lib/supabase';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function StaffControls() {
  const [facilities, setFacilities] = useState<FacilityStatus[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [facilitiesData, equipmentData] = await Promise.all([
      supabase.from('facility_status').select('*').order('area_name'),
      supabase.from('equipment').select('*').order('name')
    ]);

    if (facilitiesData.data) setFacilities(facilitiesData.data);
    if (equipmentData.data) setEquipment(equipmentData.data);
  };

  const updateCapacity = async (id: number, change: number) => {
    const facility = facilities.find(f => f.id === id);
    if (!facility) return;

    const newCapacity = Math.max(0, Math.min(facility.max_capacity, facility.current_capacity + change));
    const percentage = (newCapacity / facility.max_capacity) * 100;
    
    let status: 'Quiet' | 'Moderate' | 'Busy' | 'Packed';
    if (percentage < 30) status = 'Quiet';
    else if (percentage < 60) status = 'Moderate';
    else if (percentage < 85) status = 'Busy';
    else status = 'Packed';

    const { error } = await supabase
      .from('facility_status')
      .update({
        current_capacity: newCapacity,
        status,
        last_updated: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update capacity');
    } else {
      fetchData();
      toast.success(`Updated ${facility.area_name} capacity`);
    }
  };

  const toggleEquipment = async (id: number) => {
    const eq = equipment.find(e => e.id === id);
    if (!eq) return;

    const { error } = await supabase
      .from('equipment')
      .update({
        is_available: !eq.is_available,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update equipment');
    } else {
      fetchData();
      toast.success(`${eq.name} is now ${eq.is_available ? 'in use' : 'available'}`);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5" />
        <h2 className="font-semibold">Staff Controls</h2>
        <Badge variant="outline" className="ml-auto">Admin Only</Badge>
      </div>

      <Tabs defaultValue="capacity">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="capacity">Facility Capacity</TabsTrigger>
          <TabsTrigger value="equipment">Equipment Status</TabsTrigger>
        </TabsList>

        <TabsContent value="capacity" className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground mb-4">
            Manually adjust current capacity for each facility area
          </p>
          {facilities.map((facility) => (
            <div key={facility.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium">{facility.area_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {facility.current_capacity} / {facility.max_capacity} people
                  </p>
                </div>
                <Badge>{facility.status}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateCapacity(facility.id, -5)}
                  disabled={facility.current_capacity === 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateCapacity(facility.id, -1)}
                  disabled={facility.current_capacity === 0}
                >
                  -1
                </Button>
                <div className="flex-1 text-center font-medium">
                  {facility.current_capacity}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateCapacity(facility.id, 1)}
                  disabled={facility.current_capacity >= facility.max_capacity}
                >
                  +1
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateCapacity(facility.id, 5)}
                  disabled={facility.current_capacity >= facility.max_capacity}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="equipment" className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground mb-4">
            Toggle equipment availability status
          </p>
          <div className="grid gap-3">
            {equipment.map((eq) => (
              <div
                key={eq.id}
                className="flex items-center justify-between border rounded-lg p-4"
              >
                <div>
                  <h3 className="font-medium">{eq.name}</h3>
                  <p className="text-sm text-muted-foreground">{eq.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={eq.is_available ? 'default' : 'destructive'}>
                    {eq.is_available ? 'Available' : 'In Use'}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleEquipment(eq.id)}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Toggle
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
