import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Clock, Users, CheckCircle2, XCircle, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { supabase, type Equipment, type WaitlistEntry } from '../lib/supabase';
import { toast } from 'sonner@2.0.3';

export function EquipmentWaitlist() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberId, setMemberId] = useState('');

  useEffect(() => {
    fetchEquipment();
    fetchWaitlist();

    // Subscribe to real-time updates
    const equipmentSubscription = supabase
      .channel('equipment_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'equipment' }, () => {
        fetchEquipment();
      })
      .subscribe();

    const waitlistSubscription = supabase
      .channel('waitlist_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'equipment_waitlist' }, () => {
        fetchWaitlist();
      })
      .subscribe();

    return () => {
      equipmentSubscription.unsubscribe();
      waitlistSubscription.unsubscribe();
    };
  }, []);

  const fetchEquipment = async () => {
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .order('category', { ascending: true });
    
    if (error) {
      console.error('Error fetching equipment:', error);
      toast.error('Failed to load equipment');
    } else {
      setEquipment(data || []);
    }
  };

  const fetchWaitlist = async () => {
    const { data, error } = await supabase
      .from('equipment_waitlist')
      .select('*')
      .eq('status', 'waiting')
      .order('equipment_name', { ascending: true })
      .order('position', { ascending: true });
    
    if (error) {
      console.error('Error fetching waitlist:', error);
    } else {
      setWaitlist(data || []);
    }
  };

  const joinWaitlist = async () => {
    if (!selectedEquipment || !memberName || !memberId) {
      toast.error('Please fill in all fields');
      return;
    }

    // Get current position
    const { data: existingEntries } = await supabase
      .from('equipment_waitlist')
      .select('position')
      .eq('equipment_name', selectedEquipment)
      .eq('status', 'waiting')
      .order('position', { ascending: false })
      .limit(1);

    const nextPosition = existingEntries && existingEntries.length > 0 
      ? existingEntries[0].position + 1 
      : 1;

    const { error } = await supabase
      .from('equipment_waitlist')
      .insert({
        equipment_name: selectedEquipment,
        member_id: memberId,
        member_name: memberName,
        position: nextPosition,
        status: 'waiting'
      });

    if (error) {
      console.error('Error joining waitlist:', error);
      toast.error('Failed to join waitlist');
    } else {
      toast.success(`Added to waitlist for ${selectedEquipment}`);
      setIsOpen(false);
      setSelectedEquipment('');
      setMemberName('');
      setMemberId('');
    }
  };

  const leaveWaitlist = async (id: number, equipmentName: string) => {
    const { error } = await supabase
      .from('equipment_waitlist')
      .update({ status: 'cancelled' })
      .eq('id', id);

    if (error) {
      console.error('Error leaving waitlist:', error);
      toast.error('Failed to leave waitlist');
    } else {
      toast.success(`Removed from waitlist for ${equipmentName}`);
    }
  };

  const unavailableEquipment = equipment.filter(eq => !eq.is_available);
  const waitlistByEquipment = waitlist.reduce((acc, entry) => {
    if (!acc[entry.equipment_name]) {
      acc[entry.equipment_name] = [];
    }
    acc[entry.equipment_name].push(entry);
    return acc;
  }, {} as Record<string, WaitlistEntry[]>);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-semibold mb-1">Equipment Waitlist</h2>
          <p className="text-sm text-muted-foreground">
            Join the queue for popular equipment
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Join Waitlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join Equipment Waitlist</DialogTitle>
              <DialogDescription>
                Add yourself to the queue for equipment that's currently in use.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="equipment">Equipment</Label>
                <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                  <SelectTrigger id="equipment">
                    <SelectValue placeholder="Select equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    {unavailableEquipment.map((eq) => (
                      <SelectItem key={eq.id} value={eq.name}>
                        {eq.name} ({eq.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="memberId">Member ID</Label>
                <Input
                  id="memberId"
                  placeholder="e.g., M001"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="memberName">Your Name</Label>
                <Input
                  id="memberName"
                  placeholder="Enter your name"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={joinWaitlist}>Join Waitlist</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {unavailableEquipment.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
            <p>All equipment is currently available!</p>
          </div>
        ) : (
          unavailableEquipment.map((eq) => {
            const queueForEquipment = waitlistByEquipment[eq.name] || [];
            return (
              <div key={eq.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium">{eq.name}</h3>
                    <p className="text-sm text-muted-foreground">{eq.category}</p>
                  </div>
                  <Badge variant="destructive">In Use</Badge>
                </div>

                {queueForEquipment.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Users className="w-4 h-4" />
                      <span>{queueForEquipment.length} people waiting</span>
                    </div>
                    {queueForEquipment.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between bg-muted/50 rounded p-3"
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">#{entry.position}</Badge>
                          <div>
                            <p className="text-sm font-medium">{entry.member_name}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>
                                {new Date(entry.joined_at).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => leaveWaitlist(entry.id, entry.equipment_name)}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No one in queue yet</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
