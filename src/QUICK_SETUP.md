# Quick Setup Guide - Fix Database Errors

## The Problem
You're seeing these errors because the database tables don't exist yet:
- "Could not find the table 'public.facility_status'"
- "Could not find the table 'public.equipment'"
- "Could not find the table 'public.equipment_waitlist'"

## The Solution (5 Minutes)

### Step 1: Create Database Tables

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Click on your project: `kqlrbdivuzkfflmpfizn`

2. **Open SQL Editor**
   - Click **"SQL Editor"** in the left sidebar
   - Click **"New query"** button

3. **Run the SQL Script**
   - Open the file `CREATE_TABLES.sql` in this project
   - Copy ALL the content
   - Paste it into the SQL Editor
   - Click **"RUN"** (or press Ctrl+Enter)

4. **Verify Success**
   - You should see "Success" message
   - You should see a table showing:
     - facility_status: 6 rows
     - equipment: 12 rows
     - equipment_waitlist: 4 rows

### Step 2: Enable Real-Time

1. In Supabase Dashboard, click **"Database"** → **"Replication"**
2. Find and toggle ON these tables:
   - ✅ `facility_status`
   - ✅ `equipment`
   - ✅ `equipment_waitlist`
3. Wait 10 seconds for replication to activate

### Step 3: Refresh Your Application

1. Go back to your Figma Make app
2. **Refresh the page** (F5 or Cmd+R)
3. You should now see:
   - 6 facility areas in "Live Capacity" tab
   - Equipment list in "Equipment" tab
   - Waitlist entries in "Waitlist" tab

## Verification Checklist

After setup, verify:
- [ ] No error messages in browser console
- [ ] 6 facility cards display with data
- [ ] Equipment tab shows 12 items
- [ ] Waitlist tab shows 4 entries
- [ ] Staff View button works
- [ ] Can update capacity in Staff View
- [ ] Can toggle equipment status

## Test Real-Time Sync

1. Open app in TWO browser windows side-by-side
2. Window 1: Click "Staff View"
3. Window 1: Update any capacity (+1 button)
4. Window 2: Watch it update automatically within 1 second!

## Still Having Issues?

### Issue: Tables not showing in Supabase
**Solution:** Make sure you ran the ENTIRE SQL script, not just part of it.

### Issue: "Could not find table" still appearing
**Solution:** 
1. Clear browser cache
2. Refresh Supabase dashboard
3. Verify tables exist: Go to Database → Tables
4. Re-run the SQL script if tables are missing

### Issue: Real-time not working
**Solution:**
1. Go to Database → Replication
2. Make sure all 3 tables are toggled ON (green)
3. Wait 30 seconds and try again

### Issue: Permission denied errors
**Solution:**
1. Check that RLS policies were created (they're in the SQL script)
2. Go to Database → Policies and verify policies exist
3. Re-run the SQL script if policies are missing

## What the SQL Script Does

1. **Creates 3 tables:**
   - `facility_status` - Stores gym area capacity
   - `equipment` - Tracks equipment availability
   - `equipment_waitlist` - Manages virtual queues

2. **Adds indexes** for fast queries

3. **Enables Row Level Security (RLS)** for data protection

4. **Creates policies** to allow public access (for demo purposes)

5. **Inserts sample data:**
   - 6 gym areas with various capacity levels
   - 12 equipment items (mix of available and in-use)
   - 4 waitlist entries for testing

## Next Steps After Setup

1. ✅ Test all features work
2. ✅ Try the real-time sync test
3. ✅ Review the USER_GUIDE.md for full feature walkthrough
4. ✅ Practice your demo for presentation

## Quick Commands Reference

**View all tables:**
```sql
SELECT * FROM facility_status;
SELECT * FROM equipment;
SELECT * FROM equipment_waitlist;
```

**Check row counts:**
```sql
SELECT 'facility_status' as table, COUNT(*) FROM facility_status
UNION ALL
SELECT 'equipment', COUNT(*) FROM equipment
UNION ALL
SELECT 'equipment_waitlist', COUNT(*) FROM equipment_waitlist;
```

**Reset everything (if needed):**
```sql
DROP TABLE IF EXISTS equipment_waitlist CASCADE;
DROP TABLE IF EXISTS equipment CASCADE;
DROP TABLE IF EXISTS facility_status CASCADE;
-- Then re-run CREATE_TABLES.sql
```

## Support

If you're still stuck after following these steps:
1. Check browser console for specific error messages
2. Verify your Supabase credentials in `/lib/supabase.ts`
3. Make sure you're using the correct Supabase project

---

**Once setup is complete, your app should work perfectly!** 🎉
