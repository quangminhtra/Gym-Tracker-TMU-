# FitHub - Gym Facility Usage Tracker
## Installation & Setup Guide

**Sub-Project:** 5 - Gym Facility Usage Tracker  
**Team:** Operations Team  
**Version:** 1.0  
**Date:** November 21, 2025

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Application Installation](#application-installation)
4. [Configuration](#configuration)
5. [Database Setup](#database-setup)
6. [Deployment](#deployment)
7. [Verification](#verification)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements

#### For Development
- **Node.js:** v18.x or higher
- **npm:** v9.x or higher (comes with Node.js)
- **Modern Web Browser:** Chrome, Firefox, Safari, or Edge (latest version)
- **Code Editor:** VS Code recommended
- **Git:** For version control

#### For Production
- **Hosting Platform:** Vercel, Netlify, or similar
- **SSL Certificate:** Automatic with most hosting platforms
- **Domain Name:** Optional but recommended

### Required Accounts
- [Supabase Account](https://supabase.com) - Free tier is sufficient
- [GitHub Account](https://github.com) - For deployment
- [Vercel Account](https://vercel.com) - For hosting (optional)

### Check Your Installation

Open terminal/command prompt and run:

```bash
# Check Node.js version
node --version
# Should output: v18.x.x or higher

# Check npm version
npm --version
# Should output: v9.x.x or higher

# Check Git
git --version
# Should output: git version 2.x.x or higher
```

If any command fails, install the required software first.

---

## Supabase Setup

### Step 1: Create Supabase Project

1. **Go to [https://supabase.com](https://supabase.com)**
2. **Sign up or log in** to your account
3. **Click "New Project"**
4. **Fill in project details:**
   - **Name:** FitHub-Facility-Tracker (or your preferred name)
   - **Database Password:** Create a strong password (save this!)
   - **Region:** Choose closest to your location
   - **Pricing Plan:** Free (sufficient for this project)
5. **Click "Create new project"**
6. **Wait 2-3 minutes** for project to initialize

### Step 2: Get Your Credentials

1. **Go to Project Settings** (gear icon in sidebar)
2. **Click "API" section**
3. **Copy and save:**
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **Anon/Public Key** (long string starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

⚠️ **Important:** Keep these credentials secure! Don't share them publicly.

### Step 3: Database Schema Creation

1. **Go to SQL Editor** (in left sidebar)
2. **Click "New query"**
3. **Copy and paste the following SQL script:**

```sql
-- ============================================
-- FitHub Facility Usage Tracker Database Schema
-- ============================================

-- Table 1: Facility Status
-- Stores real-time capacity information for gym areas
CREATE TABLE facility_status (
  id BIGSERIAL PRIMARY KEY,
  area_name TEXT NOT NULL UNIQUE,
  current_capacity INT NOT NULL DEFAULT 0 CHECK (current_capacity >= 0),
  max_capacity INT NOT NULL CHECK (max_capacity > 0),
  status TEXT NOT NULL CHECK (status IN ('Quiet', 'Moderate', 'Busy', 'Packed')),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table 2: Equipment
-- Tracks individual equipment items and their availability
CREATE TABLE equipment (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('Strength', 'Cardio', 'Flexibility', 'Other')),
  is_available BOOLEAN DEFAULT true,
  current_user TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table 3: Equipment Waitlist
-- Manages virtual queues for equipment
CREATE TABLE equipment_waitlist (
  id BIGSERIAL PRIMARY KEY,
  equipment_name TEXT NOT NULL,
  member_id TEXT NOT NULL,
  member_name TEXT NOT NULL,
  position INT NOT NULL CHECK (position > 0),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'notified', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Indexes for Performance
-- ============================================

CREATE INDEX idx_facility_status_name ON facility_status(area_name);
CREATE INDEX idx_equipment_available ON equipment(is_available);
CREATE INDEX idx_equipment_category ON equipment(category);
CREATE INDEX idx_waitlist_equipment ON equipment_waitlist(equipment_name);
CREATE INDEX idx_waitlist_status ON equipment_waitlist(status);
CREATE INDEX idx_waitlist_member ON equipment_waitlist(member_id);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE facility_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_waitlist ENABLE ROW LEVEL SECURITY;

-- Policies for facility_status
CREATE POLICY "Allow public read access to facility status"
  ON facility_status FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to facility status"
  ON facility_status FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to facility status"
  ON facility_status FOR UPDATE
  USING (true);

-- Policies for equipment
CREATE POLICY "Allow public read access to equipment"
  ON equipment FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to equipment"
  ON equipment FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to equipment"
  ON equipment FOR UPDATE
  USING (true);

-- Policies for equipment_waitlist
CREATE POLICY "Allow public read access to waitlist"
  ON equipment_waitlist FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to waitlist"
  ON equipment_waitlist FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to waitlist"
  ON equipment_waitlist FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete from waitlist"
  ON equipment_waitlist FOR DELETE
  USING (true);

-- ============================================
-- Functions and Triggers
-- ============================================

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for equipment table
CREATE TRIGGER update_equipment_timestamp
BEFORE UPDATE ON equipment
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Comments for Documentation
-- ============================================

COMMENT ON TABLE facility_status IS 'Stores real-time capacity data for different gym areas';
COMMENT ON TABLE equipment IS 'Tracks individual equipment items and their availability status';
COMMENT ON TABLE equipment_waitlist IS 'Manages virtual waiting queues for equipment in use';
```

4. **Click "Run"** button (or press Ctrl+Enter / Cmd+Enter)
5. **Verify:** You should see "Success. No rows returned"

### Step 4: Insert Sample Data

1. **Create another new query**
2. **Copy and paste the following:**

```sql
-- ============================================
-- Sample Data for FitHub Facility Tracker
-- ============================================

-- Insert facility areas
INSERT INTO facility_status (area_name, current_capacity, max_capacity, status) VALUES
('Main Floor', 15, 50, 'Quiet'),
('Cardio Zone', 28, 40, 'Busy'),
('Weight Room', 35, 45, 'Busy'),
('Yoga Studio', 8, 25, 'Quiet'),
('Spin Room', 18, 20, 'Packed'),
('Pool Area', 12, 30, 'Moderate');

-- Insert strength equipment
INSERT INTO equipment (name, category, is_available, current_user) VALUES
('Squat Rack 1', 'Strength', false, 'M012'),
('Squat Rack 2', 'Strength', true, null),
('Squat Rack 3', 'Strength', true, null),
('Bench Press 1', 'Strength', false, 'M034'),
('Bench Press 2', 'Strength', true, null),
('Bench Press 3', 'Strength', false, 'M056'),
('Deadlift Platform 1', 'Strength', true, null),
('Deadlift Platform 2', 'Strength', true, null),
('Cable Machine 1', 'Strength', true, null),
('Cable Machine 2', 'Strength', false, 'M078'),
('Leg Press', 'Strength', false, 'M090'),
('Smith Machine', 'Strength', true, null),
('Pull-up Bar', 'Strength', true, null),
('Dip Station', 'Strength', true, null);

-- Insert cardio equipment
INSERT INTO equipment (name, category, is_available, current_user) VALUES
('Treadmill 1', 'Cardio', false, 'M101'),
('Treadmill 2', 'Cardio', true, null),
('Treadmill 3', 'Cardio', false, 'M102'),
('Treadmill 4', 'Cardio', true, null),
('Treadmill 5', 'Cardio', true, null),
('Rowing Machine 1', 'Cardio', true, null),
('Rowing Machine 2', 'Cardio', false, 'M103'),
('Stationary Bike 1', 'Cardio', true, null),
('Stationary Bike 2', 'Cardio', true, null),
('Elliptical 1', 'Cardio', false, 'M104'),
('Elliptical 2', 'Cardio', true, null),
('Stair Climber', 'Cardio', true, null);

-- Insert waitlist entries
INSERT INTO equipment_waitlist (equipment_name, member_id, member_name, position, status) VALUES
('Squat Rack 1', 'M001', 'John Smith', 1, 'waiting'),
('Squat Rack 1', 'M002', 'Sarah Johnson', 2, 'waiting'),
('Squat Rack 1', 'M003', 'Mike Wilson', 3, 'waiting'),
('Bench Press 1', 'M004', 'Emily Davis', 1, 'waiting'),
('Bench Press 1', 'M005', 'Chris Brown', 2, 'waiting'),
('Leg Press', 'M006', 'Jessica Lee', 1, 'waiting'),
('Treadmill 1', 'M007', 'David Martinez', 1, 'waiting');
```

3. **Click "Run"**
4. **Verify:** You should see "Success. Rows added: 33"

### Step 5: Verify Database Setup

1. **Go to Table Editor** (in left sidebar)
2. **You should see 3 tables:**
   - `facility_status` (6 rows)
   - `equipment` (26 rows)
   - `equipment_waitlist` (7 rows)
3. **Click on each table** to verify data is present

---

## Application Installation

### Option 1: Using Figma Make (Current Environment)

✅ **You're already here!** The application is already set up in your current environment.

**Next steps:**
1. Update the Supabase credentials in `/lib/supabase.ts`
2. Verify the application runs correctly

### Option 2: Clone from GitHub (For Local Development)

If you want to run this locally or deploy separately:

1. **Open Terminal/Command Prompt**

2. **Clone the repository:**
```bash
git clone <your-repo-url>
cd fithub-facility-tracker
```

3. **Install dependencies:**
```bash
npm install
```

4. **Install required packages:**
```bash
npm install @supabase/supabase-js
npm install react react-dom
npm install lucide-react
npm install sonner@2.0.3
npm install recharts
```

5. **Verify installation:**
```bash
npm list
# Should show all installed packages
```

### Option 3: Create from Scratch

If starting fresh:

1. **Create new React + TypeScript project:**
```bash
npx create-vite@latest fithub-tracker -- --template react-ts
cd fithub-tracker
```

2. **Install all dependencies:**
```bash
npm install
npm install @supabase/supabase-js
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

3. **Copy all project files** from this repository into your project

---

## Configuration

### Step 1: Update Supabase Credentials

1. **Open `/lib/supabase.ts`**

2. **Replace with your credentials:**
```typescript
const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
```

Example:
```typescript
const supabaseUrl = 'https://kqlrbdivuzkfflmpfizn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc...';
```

3. **Save the file**

### Step 2: Environment Variables (Production)

For production deployment, use environment variables:

1. **Create `.env` file** in project root:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

2. **Update `/lib/supabase.ts`:**
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

3. **Add to `.gitignore`:**
```
.env
.env.local
```

### Step 3: Configure Supabase Realtime

1. **Go to Supabase Dashboard** → Project Settings → API
2. **Scroll to "Realtime" section**
3. **Ensure "Enable Realtime" is ON**
4. **Click "Database" in sidebar** → "Replication"
5. **Enable replication for tables:**
   - `facility_status` ✅
   - `equipment` ✅
   - `equipment_waitlist` ✅

---

## Deployment

### Deploy to Vercel (Recommended)

1. **Push code to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

2. **Go to [vercel.com](https://vercel.com)**

3. **Click "New Project"**

4. **Import your GitHub repository**

5. **Configure environment variables:**
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`

6. **Click "Deploy"**

7. **Wait 2-3 minutes** for deployment

8. **Your app is live!** Vercel provides a URL like `https://your-app.vercel.app`

### Deploy to Netlify

1. **Build the project:**
```bash
npm run build
```

2. **Go to [netlify.com](https://netlify.com)**

3. **Drag and drop the `dist` folder** to Netlify

4. **Configure environment variables** in Site Settings → Environment

5. **Redeploy if needed**

### Deploy to Custom Server

1. **Build production bundle:**
```bash
npm run build
```

2. **Upload `dist` folder contents** to your web server

3. **Configure web server** (Nginx/Apache) to serve the files

4. **Set up SSL certificate** (Let's Encrypt recommended)

---

## Verification

### Test Checklist

After setup, verify everything works:

#### ✅ Database Connection
1. Open the application
2. Check browser console (F12 → Console tab)
3. Should see no Supabase connection errors

#### ✅ Data Loading
1. Live Capacity tab should show 6 facility areas
2. Equipment tab should show all equipment
3. Waitlist tab should show existing waitlist entries

#### ✅ Real-Time Updates
1. Open application in two browser windows side-by-side
2. In window 1: Switch to Staff View
3. Update any facility capacity
4. In window 2: Verify the change appears within 2 seconds

#### ✅ Interactions
1. **Join Waitlist:**
   - Fill in form with test data
   - Should see success toast
   - Entry should appear in list

2. **Leave Waitlist:**
   - Click X on any entry
   - Should disappear immediately

3. **Staff Controls:**
   - Toggle equipment status
   - Adjust facility capacity
   - Verify changes save

### Health Check Query

Run this in Supabase SQL Editor to verify data integrity:

```sql
-- Check all tables have data
SELECT 'facility_status' as table_name, COUNT(*) as row_count FROM facility_status
UNION ALL
SELECT 'equipment', COUNT(*) FROM equipment
UNION ALL
SELECT 'equipment_waitlist', COUNT(*) FROM equipment_waitlist;

-- Expected output:
-- facility_status: 6 rows
-- equipment: 26 rows
-- equipment_waitlist: 7 rows (initially)
```

---

## Troubleshooting

### Issue: "Failed to load equipment" Error

**Possible Causes:**
- Incorrect Supabase credentials
- Tables not created
- RLS policies too restrictive

**Solutions:**
1. Verify credentials in `/lib/supabase.ts`
2. Check Supabase Dashboard → Table Editor for tables
3. Verify RLS policies allow public read access

### Issue: Real-Time Updates Not Working

**Possible Causes:**
- Realtime not enabled in Supabase
- Table replication not enabled
- Browser blocking WebSocket connections

**Solutions:**
1. Enable Realtime in Supabase (see Configuration Step 3)
2. Check browser console for WebSocket errors
3. Try different browser

### Issue: Cannot Join Waitlist

**Possible Causes:**
- Form validation failing
- Database constraints violated
- Network issue

**Solutions:**
1. Fill in all required fields
2. Ensure equipment is actually "In Use"
3. Check browser console for errors

### Issue: Build Fails

**Error:** `Module not found: @supabase/supabase-js`

**Solution:**
```bash
npm install @supabase/supabase-js
```

**Error:** `Cannot find module 'sonner'`

**Solution:**
```bash
npm install sonner@2.0.3
```

### Issue: TypeScript Errors

**Solution:**
```bash
# Regenerate TypeScript definitions
npm run build
```

### Getting Help

If issues persist:

1. **Check browser console** (F12 → Console) for error messages
2. **Check Supabase logs** (Dashboard → Logs)
3. **Review database permissions** (RLS policies)
4. **Contact support:**
   - Email: support@peakperformancegym.com
   - Slack: #fithub-dev-support
   - GitHub Issues: <your-repo>/issues

---

## Next Steps

### For Development Team

1. ✅ Complete installation and verification
2. Set up development environment
3. Review codebase and architecture
4. Set up CI/CD pipeline
5. Configure monitoring and logging

### For Testing Team

1. ✅ Complete installation
2. Review test cases document (`TEST_CASES.md`)
3. Set up test environment
4. Begin functional testing
5. Report bugs in issue tracker

### For Operations Team

1. ✅ Complete installation
2. Review user guide (`USER_GUIDE.md`)
3. Train staff members
4. Configure notification system (Sub-Project 6 integration)
5. Set up monitoring dashboards

### Integration with Other Sub-Projects

Plan integration with:
- **Sub-Project 2:** Embed capacity widget in member dashboard
- **Sub-Project 3:** Check capacity before class bookings
- **Sub-Project 6:** Set up waitlist notifications
- **Sub-Project 7:** Add to staff admin panel
- **Sub-Project 8:** Connect analytics data pipeline

---

## Appendix

### Useful Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Database
npm run db:migrate       # Run migrations (if using)
npm run db:seed          # Seed test data

# Testing
npm run test             # Run tests
npm run test:coverage    # Run tests with coverage

# Maintenance
npm update               # Update dependencies
npm audit                # Check for vulnerabilities
npm audit fix            # Fix vulnerabilities
```

### File Structure

```
fithub-facility-tracker/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── ui/         # Shadcn UI components
│   │   ├── FacilityCapacityCard.tsx
│   │   ├── EquipmentGrid.tsx
│   │   ├── EquipmentWaitlist.tsx
│   │   └── StaffControls.tsx
│   ├── lib/
│   │   └── supabase.ts # Supabase client & types
│   ├── styles/
│   │   └── globals.css # Global styles
│   ├── App.tsx         # Main application
│   └── main.tsx        # Entry point
├── .env                # Environment variables
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── vite.config.ts      # Vite config
├── USER_GUIDE.md       # User documentation
├── TEST_CASES.md       # Test documentation
└── README.md           # Project overview
```

### Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

---

## Support & Maintenance

### Regular Maintenance Tasks

**Daily:**
- Monitor error logs
- Check system performance
- Verify real-time updates working

**Weekly:**
- Review and clean old waitlist entries
- Check database performance
- Update capacity thresholds if needed

**Monthly:**
- Update dependencies
- Security audit
- Backup database
- Review analytics and optimize

### Backup Strategy

**Supabase Automatic Backups:**
- Free tier: Daily backups for 7 days
- Pro tier: Point-in-time recovery

**Manual Backup:**
```bash
# From Supabase Dashboard → Database → Backups
# Click "Create backup now"
```

---

**Installation Complete!** 🎉

Your FitHub Facility Usage Tracker should now be fully operational.

**Document Version:** 1.0  
**Last Updated:** November 21, 2025  
**Maintained By:** Operations Team
