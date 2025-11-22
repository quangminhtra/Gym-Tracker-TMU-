
-- FitHub Facility Usage Tracker Database for Supabase using SQL

-- Table 1: Facility Status
CREATE TABLE IF NOT EXISTS facility_status (
  id BIGSERIAL PRIMARY KEY,
  area_name TEXT NOT NULL UNIQUE,
  current_capacity INT NOT NULL DEFAULT 0 CHECK (current_capacity >= 0),
  max_capacity INT NOT NULL CHECK (max_capacity > 0),
  status TEXT NOT NULL CHECK (status IN ('Quiet', 'Moderate', 'Busy', 'Packed')),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table 2: Equipment
CREATE TABLE IF NOT EXISTS equipment (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('Strength', 'Cardio', 'Flexibility', 'Other')),
  is_available BOOLEAN DEFAULT true,
  current_user TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table 3: Equipment Waitlist
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_facility_status_name ON facility_status(area_name);
CREATE INDEX IF NOT EXISTS idx_equipment_available ON equipment(is_available);
CREATE INDEX IF NOT EXISTS idx_equipment_category ON equipment(category);
CREATE INDEX IF NOT EXISTS idx_waitlist_equipment ON equipment_waitlist(equipment_name);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON equipment_waitlist(status);


ALTER TABLE facility_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_waitlist ENABLE ROW LEVEL SECURITY;

-- Policies (allow all for demo)
DROP POLICY IF EXISTS "Allow public read" ON facility_status;
CREATE POLICY "Allow public read" ON facility_status FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert" ON facility_status;
CREATE POLICY "Allow public insert" ON facility_status FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update" ON facility_status;
CREATE POLICY "Allow public update" ON facility_status FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public read" ON equipment;
CREATE POLICY "Allow public read" ON equipment FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert" ON equipment;
CREATE POLICY "Allow public insert" ON equipment FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update" ON equipment;
CREATE POLICY "Allow public update" ON equipment FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public read" ON equipment_waitlist;
CREATE POLICY "Allow public read" ON equipment_waitlist FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert" ON equipment_waitlist;
CREATE POLICY "Allow public insert" ON equipment_waitlist FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update" ON equipment_waitlist;
CREATE POLICY "Allow public update" ON equipment_waitlist FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow public delete" ON equipment_waitlist;
CREATE POLICY "Allow public delete" ON equipment_waitlist FOR DELETE USING (true);

-- Insert Sample Data for real time situatuion
INSERT INTO facility_status (area_name, current_capacity, max_capacity, status) VALUES
('Main Floor', 15, 50, 'Quiet'),
('Cardio Zone', 28, 40, 'Busy'),
('Weight Room', 35, 45, 'Busy'),
('Yoga Studio', 8, 25, 'Quiet'),
('Spin Room', 18, 20, 'Packed'),
('Pool Area', 12, 30, 'Moderate')
ON CONFLICT (area_name) DO NOTHING;

INSERT INTO equipment (name, category, is_available, current_user) VALUES
('Squat Rack 1', 'Strength', false, 'M012'),
('Squat Rack 2', 'Strength', true, null),
('Bench Press 1', 'Strength', false, 'M034'),
('Bench Press 2', 'Strength', true, null),
('Leg Press', 'Strength', false, 'M090'),
('Smith Machine', 'Strength', true, null),
('Treadmill 1', 'Cardio', false, 'M101'),
('Treadmill 2', 'Cardio', true, null),
('Treadmill 3', 'Cardio', false, 'M102'),
('Rowing Machine 1', 'Cardio', true, null),
('Elliptical 1', 'Cardio', false, 'M104'),
('Elliptical 2', 'Cardio', true, null)
ON CONFLICT (name) DO NOTHING;

INSERT INTO equipment_waitlist (equipment_name, member_id, member_name, position, status) VALUES
('Squat Rack 1', 'M001', 'John Smith', 1, 'waiting'),
('Squat Rack 1', 'M002', 'Sarah Johnson', 2, 'waiting'),
('Bench Press 1', 'M003', 'Mike Wilson', 1, 'waiting'),
('Treadmill 1', 'M004', 'Emily Davis', 1, 'waiting');

-- Verify
SELECT 'facility_status' as table_name, COUNT(*) as rows FROM facility_status
UNION ALL
SELECT 'equipment', COUNT(*) FROM equipment
UNION ALL
SELECT 'equipment_waitlist', COUNT(*) FROM equipment_waitlist;
