# FitHub - Gym Facility Usage Tracker
## SQL Scripts Reference

**Version:** 1.0  
**Database:** PostgreSQL (via Supabase)  
**Date:** November 21, 2025

---

## Quick Start

Copy and paste these scripts into your Supabase SQL Editor in order.

---

## Script 1: Create Database Schema

```sql
-- ============================================
-- FitHub Facility Usage Tracker Database Schema
-- Created: November 21, 2025
-- ============================================

-- ============================================
-- TABLE CREATION
-- ============================================

-- Table 1: Facility Status
-- Stores real-time capacity information for gym areas
CREATE TABLE IF NOT EXISTS facility_status (
  id BIGSERIAL PRIMARY KEY,
  area_name TEXT NOT NULL UNIQUE,
  current_capacity INT NOT NULL DEFAULT 0 CHECK (current_capacity >= 0),
  max_capacity INT NOT NULL CHECK (max_capacity > 0),
  status TEXT NOT NULL CHECK (status IN ('Quiet', 'Moderate', 'Busy', 'Packed')),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE facility_status IS 'Stores real-time capacity data for different gym areas';
COMMENT ON COLUMN facility_status.area_name IS 'Unique name of the gym area';
COMMENT ON COLUMN facility_status.current_capacity IS 'Current number of people in the area';
COMMENT ON COLUMN facility_status.max_capacity IS 'Maximum allowed capacity for the area';
COMMENT ON COLUMN facility_status.status IS 'Current status: Quiet (<30%), Moderate (30-60%), Busy (60-85%), Packed (>85%)';

-- Table 2: Equipment
-- Tracks individual equipment items and their availability
CREATE TABLE IF NOT EXISTS equipment (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('Strength', 'Cardio', 'Flexibility', 'Other')),
  is_available BOOLEAN DEFAULT true,
  current_user TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE equipment IS 'Tracks individual equipment items and their availability status';
COMMENT ON COLUMN equipment.name IS 'Unique name/identifier for the equipment';
COMMENT ON COLUMN equipment.category IS 'Type of equipment: Strength, Cardio, Flexibility, or Other';
COMMENT ON COLUMN equipment.is_available IS 'TRUE if available, FALSE if in use';
COMMENT ON COLUMN equipment.current_user IS 'Member ID of current user (NULL if available)';

-- Table 3: Equipment Waitlist
-- Manages virtual queues for equipment
CREATE TABLE IF NOT EXISTS equipment_waitlist (
  id BIGSERIAL PRIMARY KEY,
  equipment_name TEXT NOT NULL,
  member_id TEXT NOT NULL,
  member_name TEXT NOT NULL,
  position INT NOT NULL CHECK (position > 0),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'notified', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE equipment_waitlist IS 'Manages virtual waiting queues for equipment in use';
COMMENT ON COLUMN equipment_waitlist.equipment_name IS 'Name of equipment being waited for';
COMMENT ON COLUMN equipment_waitlist.member_id IS 'Unique identifier for gym member';
COMMENT ON COLUMN equipment_waitlist.position IS 'Position in queue (1 = next in line)';
COMMENT ON COLUMN equipment_waitlist.status IS 'Current status: waiting, notified, completed, or cancelled';

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Facility Status Indexes
CREATE INDEX IF NOT EXISTS idx_facility_status_name 
  ON facility_status(area_name);

CREATE INDEX IF NOT EXISTS idx_facility_status_updated 
  ON facility_status(last_updated DESC);

-- Equipment Indexes
CREATE INDEX IF NOT EXISTS idx_equipment_available 
  ON equipment(is_available);

CREATE INDEX IF NOT EXISTS idx_equipment_category 
  ON equipment(category);

CREATE INDEX IF NOT EXISTS idx_equipment_category_available 
  ON equipment(category, is_available);

-- Waitlist Indexes
CREATE INDEX IF NOT EXISTS idx_waitlist_equipment 
  ON equipment_waitlist(equipment_name);

CREATE INDEX IF NOT EXISTS idx_waitlist_status 
  ON equipment_waitlist(status);

CREATE INDEX IF NOT EXISTS idx_waitlist_member 
  ON equipment_waitlist(member_id);

CREATE INDEX IF NOT EXISTS idx_waitlist_equipment_status_position 
  ON equipment_waitlist(equipment_name, status, position);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE facility_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_waitlist ENABLE ROW LEVEL SECURITY;

-- Policies for facility_status
DROP POLICY IF EXISTS "Allow public read access to facility status" ON facility_status;
CREATE POLICY "Allow public read access to facility status"
  ON facility_status FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public insert to facility status" ON facility_status;
CREATE POLICY "Allow public insert to facility status"
  ON facility_status FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update to facility status" ON facility_status;
CREATE POLICY "Allow public update to facility status"
  ON facility_status FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Allow public delete from facility status" ON facility_status;
CREATE POLICY "Allow public delete from facility status"
  ON facility_status FOR DELETE
  USING (true);

-- Policies for equipment
DROP POLICY IF EXISTS "Allow public read access to equipment" ON equipment;
CREATE POLICY "Allow public read access to equipment"
  ON equipment FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public insert to equipment" ON equipment;
CREATE POLICY "Allow public insert to equipment"
  ON equipment FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update to equipment" ON equipment;
CREATE POLICY "Allow public update to equipment"
  ON equipment FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Allow public delete from equipment" ON equipment;
CREATE POLICY "Allow public delete from equipment"
  ON equipment FOR DELETE
  USING (true);

-- Policies for equipment_waitlist
DROP POLICY IF EXISTS "Allow public read access to waitlist" ON equipment_waitlist;
CREATE POLICY "Allow public read access to waitlist"
  ON equipment_waitlist FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public insert to waitlist" ON equipment_waitlist;
CREATE POLICY "Allow public insert to waitlist"
  ON equipment_waitlist FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update to waitlist" ON equipment_waitlist;
CREATE POLICY "Allow public update to waitlist"
  ON equipment_waitlist FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Allow public delete from waitlist" ON equipment_waitlist;
CREATE POLICY "Allow public delete from waitlist"
  ON equipment_waitlist FOR DELETE
  USING (true);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for equipment table
DROP TRIGGER IF EXISTS update_equipment_timestamp ON equipment;
CREATE TRIGGER update_equipment_timestamp
BEFORE UPDATE ON equipment
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION
-- ============================================

-- Verify tables were created
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('facility_status', 'equipment', 'equipment_waitlist')
ORDER BY table_name;
```

---

## Script 2: Insert Sample Data

```sql
-- ============================================
-- Sample Data for FitHub Facility Tracker
-- This data is for development and testing
-- ============================================

-- ============================================
-- FACILITY STATUS DATA
-- ============================================

INSERT INTO facility_status (area_name, current_capacity, max_capacity, status) VALUES
('Main Floor', 15, 50, 'Quiet'),
('Cardio Zone', 28, 40, 'Busy'),
('Weight Room', 35, 45, 'Busy'),
('Yoga Studio', 8, 25, 'Quiet'),
('Spin Room', 18, 20, 'Packed'),
('Pool Area', 12, 30, 'Moderate')
ON CONFLICT (area_name) DO NOTHING;

-- ============================================
-- EQUIPMENT DATA - STRENGTH
-- ============================================

INSERT INTO equipment (name, category, is_available, current_user) VALUES
-- Squat Racks
('Squat Rack 1', 'Strength', false, 'M012'),
('Squat Rack 2', 'Strength', true, null),
('Squat Rack 3', 'Strength', true, null),

-- Bench Press
('Bench Press 1', 'Strength', false, 'M034'),
('Bench Press 2', 'Strength', true, null),
('Bench Press 3', 'Strength', false, 'M056'),

-- Other Strength Equipment
('Deadlift Platform 1', 'Strength', true, null),
('Deadlift Platform 2', 'Strength', true, null),
('Cable Machine 1', 'Strength', true, null),
('Cable Machine 2', 'Strength', false, 'M078'),
('Leg Press', 'Strength', false, 'M090'),
('Smith Machine', 'Strength', true, null),
('Pull-up Bar', 'Strength', true, null),
('Dip Station', 'Strength', true, null),
('Lat Pulldown', 'Strength', true, null),
('Seated Row', 'Strength', false, 'M091')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- EQUIPMENT DATA - CARDIO
-- ============================================

INSERT INTO equipment (name, category, is_available, current_user) VALUES
-- Treadmills
('Treadmill 1', 'Cardio', false, 'M101'),
('Treadmill 2', 'Cardio', true, null),
('Treadmill 3', 'Cardio', false, 'M102'),
('Treadmill 4', 'Cardio', true, null),
('Treadmill 5', 'Cardio', true, null),

-- Rowing Machines
('Rowing Machine 1', 'Cardio', true, null),
('Rowing Machine 2', 'Cardio', false, 'M103'),

-- Bikes
('Stationary Bike 1', 'Cardio', true, null),
('Stationary Bike 2', 'Cardio', true, null),
('Spin Bike 1', 'Cardio', false, 'M104'),

-- Other Cardio
('Elliptical 1', 'Cardio', false, 'M105'),
('Elliptical 2', 'Cardio', true, null),
('Stair Climber', 'Cardio', true, null)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- WAITLIST DATA
-- ============================================

INSERT INTO equipment_waitlist (equipment_name, member_id, member_name, position, status) VALUES
-- Squat Rack 1 - 3 people waiting
('Squat Rack 1', 'M001', 'John Smith', 1, 'waiting'),
('Squat Rack 1', 'M002', 'Sarah Johnson', 2, 'waiting'),
('Squat Rack 1', 'M003', 'Mike Wilson', 3, 'waiting'),

-- Bench Press 1 - 2 people waiting
('Bench Press 1', 'M004', 'Emily Davis', 1, 'waiting'),
('Bench Press 1', 'M005', 'Chris Brown', 2, 'waiting'),

-- Leg Press - 1 person waiting
('Leg Press', 'M006', 'Jessica Lee', 1, 'waiting'),

-- Treadmill 1 - 1 person waiting
('Treadmill 1', 'M007', 'David Martinez', 1, 'waiting'),

-- Elliptical 1 - 2 people waiting
('Elliptical 1', 'M008', 'Amanda Garcia', 1, 'waiting'),
('Elliptical 1', 'M009', 'Robert Taylor', 2, 'waiting');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Count records in each table
SELECT 
  'facility_status' as table_name, 
  COUNT(*) as row_count 
FROM facility_status
UNION ALL
SELECT 
  'equipment', 
  COUNT(*) 
FROM equipment
UNION ALL
SELECT 
  'equipment_waitlist', 
  COUNT(*) 
FROM equipment_waitlist;

-- Show facility status summary
SELECT 
  status,
  COUNT(*) as area_count,
  SUM(current_capacity) as total_people,
  SUM(max_capacity) as total_capacity
FROM facility_status
GROUP BY status
ORDER BY 
  CASE status
    WHEN 'Quiet' THEN 1
    WHEN 'Moderate' THEN 2
    WHEN 'Busy' THEN 3
    WHEN 'Packed' THEN 4
  END;

-- Show equipment availability by category
SELECT 
  category,
  COUNT(*) as total_equipment,
  SUM(CASE WHEN is_available THEN 1 ELSE 0 END) as available,
  SUM(CASE WHEN NOT is_available THEN 1 ELSE 0 END) as in_use
FROM equipment
GROUP BY category
ORDER BY category;

-- Show waitlist summary
SELECT 
  equipment_name,
  COUNT(*) as people_waiting,
  MIN(position) as first_position,
  MAX(position) as last_position
FROM equipment_waitlist
WHERE status = 'waiting'
GROUP BY equipment_name
ORDER BY people_waiting DESC;
```

---

## Script 3: Useful Queries for Management

```sql
-- ============================================
-- MANAGEMENT & REPORTING QUERIES
-- ============================================

-- Query 1: Current gym overview
SELECT 
  SUM(current_capacity) as total_occupancy,
  SUM(max_capacity) as total_capacity,
  ROUND(100.0 * SUM(current_capacity) / SUM(max_capacity), 1) as occupancy_percentage,
  COUNT(*) FILTER (WHERE status IN ('Busy', 'Packed')) as busy_areas,
  COUNT(*) as total_areas
FROM facility_status;

-- Query 2: Busiest areas right now
SELECT 
  area_name,
  current_capacity,
  max_capacity,
  status,
  ROUND(100.0 * current_capacity / max_capacity, 1) as percentage,
  last_updated
FROM facility_status
ORDER BY current_capacity DESC
LIMIT 5;

-- Query 3: Equipment with longest waitlists
SELECT 
  equipment_name,
  COUNT(*) as queue_length,
  MIN(joined_at) as longest_wait_started,
  NOW() - MIN(joined_at) as longest_wait_duration
FROM equipment_waitlist
WHERE status = 'waiting'
GROUP BY equipment_name
HAVING COUNT(*) > 0
ORDER BY queue_length DESC;

-- Query 4: Member waitlist history
SELECT 
  member_name,
  COUNT(*) as total_waits,
  COUNT(*) FILTER (WHERE status = 'completed') as completed,
  COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
  COUNT(*) FILTER (WHERE status = 'waiting') as currently_waiting
FROM equipment_waitlist
GROUP BY member_id, member_name
ORDER BY total_waits DESC
LIMIT 10;

-- Query 5: Equipment utilization rate
SELECT 
  category,
  name,
  CASE WHEN is_available THEN 'Available' ELSE 'In Use' END as status,
  current_user,
  updated_at
FROM equipment
ORDER BY category, name;

-- Query 6: Peak hours analysis (requires historical data)
-- This is a template for future use when you have time-series data
SELECT 
  EXTRACT(HOUR FROM last_updated) as hour_of_day,
  AVG(current_capacity) as avg_capacity,
  MAX(current_capacity) as peak_capacity
FROM facility_status
WHERE last_updated > NOW() - INTERVAL '7 days'
GROUP BY EXTRACT(HOUR FROM last_updated)
ORDER BY hour_of_day;
```

---

## Script 4: Maintenance & Cleanup

```sql
-- ============================================
-- MAINTENANCE QUERIES
-- ============================================

-- Clean up old completed/cancelled waitlist entries (older than 7 days)
DELETE FROM equipment_waitlist
WHERE status IN ('completed', 'cancelled')
  AND created_at < NOW() - INTERVAL '7 days';

-- Reset positions in waitlist (reorder after cancellations)
WITH ordered_waitlist AS (
  SELECT 
    id,
    equipment_name,
    ROW_NUMBER() OVER (PARTITION BY equipment_name ORDER BY position) as new_position
  FROM equipment_waitlist
  WHERE status = 'waiting'
)
UPDATE equipment_waitlist
SET position = ordered_waitlist.new_position
FROM ordered_waitlist
WHERE equipment_waitlist.id = ordered_waitlist.id;

-- Find orphaned waitlist entries (equipment that doesn't exist)
SELECT DISTINCT w.equipment_name
FROM equipment_waitlist w
LEFT JOIN equipment e ON w.equipment_name = e.name
WHERE e.name IS NULL
  AND w.status = 'waiting';

-- Update timestamps for stale facility data
UPDATE facility_status
SET last_updated = NOW()
WHERE last_updated < NOW() - INTERVAL '1 hour';

-- Vacuum tables for performance (run periodically)
VACUUM ANALYZE facility_status;
VACUUM ANALYZE equipment;
VACUUM ANALYZE equipment_waitlist;
```

---

## Script 5: Reset Database (Use with Caution!)

```sql
-- ============================================
-- RESET DATABASE
-- WARNING: This will delete ALL data!
-- Only use in development/testing
-- ============================================

-- Disable triggers temporarily
SET session_replication_role = 'replica';

-- Delete all data
TRUNCATE TABLE equipment_waitlist CASCADE;
TRUNCATE TABLE equipment CASCADE;
TRUNCATE TABLE facility_status CASCADE;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- Reset sequences
ALTER SEQUENCE facility_status_id_seq RESTART WITH 1;
ALTER SEQUENCE equipment_id_seq RESTART WITH 1;
ALTER SEQUENCE equipment_waitlist_id_seq RESTART WITH 1;

-- Verify all tables are empty
SELECT 'facility_status' as table_name, COUNT(*) FROM facility_status
UNION ALL
SELECT 'equipment', COUNT(*) FROM equipment
UNION ALL
SELECT 'equipment_waitlist', COUNT(*) FROM equipment_waitlist;

-- Now re-run Script 2 to insert sample data
```

---

## Script 6: Database Health Check

```sql
-- ============================================
-- DATABASE HEALTH CHECK
-- ============================================

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('facility_status', 'equipment', 'equipment_waitlist')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND tablename IN ('facility_status', 'equipment', 'equipment_waitlist')
ORDER BY tablename, indexname;

-- Check for missing indexes (slow queries)
SELECT 
  schemaname,
  tablename,
  attname as column_name,
  n_distinct,
  correlation
FROM pg_stats
WHERE schemaname = 'public'
  AND tablename IN ('facility_status', 'equipment', 'equipment_waitlist')
ORDER BY tablename, attname;

-- Check constraints
SELECT
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc 
  ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.table_name IN ('facility_status', 'equipment', 'equipment_waitlist')
ORDER BY tc.table_name, tc.constraint_type;
```

---

## Quick Reference Commands

### Enable Realtime

```sql
-- Enable Realtime replication for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE facility_status;
ALTER PUBLICATION supabase_realtime ADD TABLE equipment;
ALTER PUBLICATION supabase_realtime ADD TABLE equipment_waitlist;
```

### Backup Commands

```bash
# Backup single table (run from terminal, not SQL editor)
pg_dump -h <supabase-host> -U postgres -d postgres -t facility_status > backup_facility.sql

# Restore from backup
psql -h <supabase-host> -U postgres -d postgres < backup_facility.sql
```

### Common Troubleshooting

```sql
-- Check RLS policies
SELECT * FROM pg_policies 
WHERE tablename IN ('facility_status', 'equipment', 'equipment_waitlist');

-- Check active connections
SELECT * FROM pg_stat_activity 
WHERE datname = current_database();

-- Kill long-running queries (if needed)
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = current_database()
  AND state = 'active'
  AND query_start < NOW() - INTERVAL '5 minutes';
```

---

## Execution Order

1. **First Time Setup:**
   1. Run Script 1 (Create Schema)
   2. Run Script 2 (Insert Sample Data)
   3. Enable Realtime (Quick Reference)

2. **Regular Maintenance:**
   - Weekly: Run Script 4 (Maintenance)
   - Monthly: Run Script 6 (Health Check)

3. **Development Reset:**
   - Run Script 5 (Reset Database) - CAREFUL!
   - Run Script 2 (Insert Sample Data)

---

## Support

If you encounter any SQL errors:

1. Check the error message in Supabase SQL Editor
2. Verify table names are correct
3. Ensure you have proper permissions
4. Check if tables already exist (use DROP TABLE IF EXISTS if needed)
5. Contact: tech-support@peakperformancegym.com

---

**Document Version:** 1.0  
**Last Updated:** November 21, 2025  
**Maintained By:** Operations Team
