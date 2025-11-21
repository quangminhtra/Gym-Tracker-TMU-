-- COPY EVERYTHING BELOW AND PASTE INTO SUPABASE SQL EDITOR
-- Then click RUN

-- Create Tables
CREATE TABLE facility_status (
  id BIGSERIAL PRIMARY KEY,
  area_name TEXT NOT NULL UNIQUE,
  current_capacity INT NOT NULL DEFAULT 0,
  max_capacity INT NOT NULL,
  status TEXT NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE equipment (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  is_available BOOLEAN DEFAULT true,
  current_user_id TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE equipment_waitlist (
  id BIGSERIAL PRIMARY KEY,
  equipment_name TEXT NOT NULL,
  member_id TEXT NOT NULL,
  member_name TEXT NOT NULL,
  position INT NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'waiting'
);

-- Enable RLS
ALTER TABLE facility_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_waitlist ENABLE ROW LEVEL SECURITY;

-- Allow Everyone to Read/Write (for demo)
CREATE POLICY "public_all" ON facility_status FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON equipment FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON equipment_waitlist FOR ALL USING (true) WITH CHECK (true);

-- Add Sample Data
INSERT INTO facility_status (area_name, current_capacity, max_capacity, status) VALUES
('Main Floor', 15, 50, 'Quiet'),
('Cardio Zone', 28, 40, 'Busy'),
('Weight Room', 35, 45, 'Busy'),
('Yoga Studio', 8, 25, 'Quiet'),
('Spin Room', 18, 20, 'Packed'),
('Pool Area', 12, 30, 'Moderate');

INSERT INTO equipment (name, category, is_available, current_user_id) VALUES
('Squat Rack 1', 'Strength', false, 'M012'),
('Squat Rack 2', 'Strength', true, null),
('Bench Press 1', 'Strength', false, 'M034'),
('Bench Press 2', 'Strength', true, null),
('Leg Press', 'Strength', false, 'M090'),
('Smith Machine', 'Strength', true, null),
('Treadmill 1', 'Cardio', false, 'M101'),
('Treadmill 2', 'Cardio', true, null),
('Rowing Machine', 'Cardio', true, null),
('Elliptical 1', 'Cardio', false, 'M104');

INSERT INTO equipment_waitlist (equipment_name, member_id, member_name, position, status) VALUES
('Squat Rack 1', 'M001', 'John Smith', 1, 'waiting'),
('Squat Rack 1', 'M002', 'Sarah Johnson', 2, 'waiting'),
('Bench Press 1', 'M003', 'Mike Wilson', 1, 'waiting');

-- Check Results
SELECT 'Created!' as status, 
  (SELECT COUNT(*) FROM facility_status) as facilities,
  (SELECT COUNT(*) FROM equipment) as equipment,
  (SELECT COUNT(*) FROM equipment_waitlist) as waitlist;