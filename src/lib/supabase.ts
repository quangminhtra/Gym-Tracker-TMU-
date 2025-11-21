import { createClient } from '@supabase/supabase-js';

// Prefer environment variables (Vite: import.meta.env). Fall back to the
// original hard-coded project for convenience during local development.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://kqlrbdivuzkfflmpfizn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxbHJiZGl2dXprZmZsbXBmaXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NTY2MDMsImV4cCI6MjA3OTIzMjYwM30.BNGrxKlxBZnSl9rtllESG_utcCzLNM0cwAOB0WZGmVo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface FacilityStatus {
  id: number;
  area_name: string;
  current_capacity: number;
  max_capacity: number;
  status: 'Quiet' | 'Moderate' | 'Busy' | 'Packed';
  last_updated: string;
}

export interface Equipment {
  id: number;
  name: string;
  category: string;
  is_available: boolean;
  current_user_id: string | null;
  updated_at: string;
}

export interface WaitlistEntry {
  id: number;
  equipment_name: string;
  member_id: string;
  member_name: string;
  position: number;
  joined_at: string;
  status: 'waiting' | 'notified' | 'completed' | 'cancelled';
}