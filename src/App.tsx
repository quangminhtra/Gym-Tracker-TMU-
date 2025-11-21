import { useState, useEffect } from 'react';
import { Activity, Users, Clock, Shield } from 'lucide-react';
import { FacilityCapacityCard } from './components/FacilityCapacityCard';
import { EquipmentWaitlist } from './components/EquipmentWaitlist';
import { EquipmentGrid } from './components/EquipmentGrid';
import { StaffControls } from './components/StaffControls';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Toaster } from './components/ui/sonner';
import { supabase, type FacilityStatus } from './lib/supabase';

export default function App() {
  const [facilities, setFacilities] = useState<FacilityStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStaffView, setIsStaffView] = useState(false);

  useEffect(() => {
    fetchFacilities();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('facility_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'facility_status' }, () => {
        fetchFacilities();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchFacilities = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('facility_status')
      .select('*')
      .order('area_name', { ascending: true });
    
    if (error) {
      console.error('Error fetching facilities:', error);
    } else {
      setFacilities(data || []);
    }
    setLoading(false);
  };

  const totalCapacity = facilities.reduce((sum, f) => sum + f.current_capacity, 0);
  const maxTotalCapacity = facilities.reduce((sum, f) => sum + f.max_capacity, 0);
  const busyAreas = facilities.filter(f => f.status === 'Busy' || f.status === 'Packed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Toaster />
      
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold">Peak Performance Gym</h1>
                <p className="text-sm text-muted-foreground">Facility Usage Tracker</p>
              </div>
            </div>
            <Button
              variant={isStaffView ? "default" : "outline"}
              onClick={() => setIsStaffView(!isStaffView)}
            >
              <Shield className="w-4 h-4 mr-2" />
              {isStaffView ? 'Member View' : 'Staff View'}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-muted-foreground">Total Occupancy</span>
            </div>
            <p className="text-2xl font-bold">{totalCapacity}</p>
            <p className="text-sm text-muted-foreground">
              of {maxTotalCapacity} max capacity
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-muted-foreground">Busy Areas</span>
            </div>
            <p className="text-2xl font-bold">{busyAreas}</p>
            <p className="text-sm text-muted-foreground">
              of {facilities.length} total areas
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="text-sm text-muted-foreground">Last Updated</span>
            </div>
            <p className="text-2xl font-bold">Live</p>
            <p className="text-sm text-muted-foreground">Real-time tracking</p>
          </div>
        </div>

        {/* Main Content */}
        {isStaffView ? (
          <div className="space-y-6">
            <StaffControls />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EquipmentGrid />
              <EquipmentWaitlist />
            </div>
          </div>
        ) : (
          <Tabs defaultValue="capacity" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="capacity">Live Capacity</TabsTrigger>
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
              <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
            </TabsList>

            <TabsContent value="capacity">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-48 bg-white rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {facilities.map((facility) => (
                    <FacilityCapacityCard
                      key={facility.id}
                      areaName={facility.area_name}
                      currentCapacity={facility.current_capacity}
                      maxCapacity={facility.max_capacity}
                      status={facility.status}
                      lastUpdated={facility.last_updated}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="equipment">
              <EquipmentGrid />
            </TabsContent>

            <TabsContent value="waitlist">
              <EquipmentWaitlist />
            </TabsContent>
          </Tabs>
        )}

        {/* Footer Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium mb-1">🟢 Quiet</p>
              <p className="text-muted-foreground">Less than 30% capacity - Great time to visit!</p>
            </div>
            <div>
              <p className="font-medium mb-1">🟡 Moderate</p>
              <p className="text-muted-foreground">30-60% capacity - Comfortable workout space</p>
            </div>
            <div>
              <p className="font-medium mb-1">🔴 Busy/Packed</p>
              <p className="text-muted-foreground">60%+ capacity - May need to wait for equipment</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
