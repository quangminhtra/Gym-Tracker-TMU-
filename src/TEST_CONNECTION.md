# Test Supabase Connection

## Quick Test in Supabase Dashboard

### Method 1: Test in SQL Editor

Run this query in Supabase SQL Editor:

```sql
-- Test if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('facility_status', 'equipment', 'equipment_waitlist');
```

**Expected Result:** Should show 3 rows with the table names.

**If you see 0 rows:** Tables don't exist. Run SIMPLE_SETUP.sql

---

### Method 2: Check Table Editor

1. Go to **Database** → **Tables** in Supabase
2. Look for these tables:
   - facility_status
   - equipment  
   - equipment_waitlist

**If you don't see them:** Tables weren't created. Run SIMPLE_SETUP.sql

---

### Method 3: Test Connection with Browser Console

1. Open your app in the browser
2. Press F12 to open Developer Tools
3. Go to the "Console" tab
4. Paste this code and press Enter:

```javascript
// Test Supabase connection
const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
const supabase = createClient(
  'https://kqlrbdivuzkfflmpfizn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxbHJiZGl2dXprZmZsbXBmaXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NTY2MDMsImV4cCI6MjA3OTIzMjYwM30.BNGrxKlxBZnSl9rtllESG_utcCzLNM0cwAOB0WZGmVo'
);

const { data, error } = await supabase.from('facility_status').select('*');
console.log('Data:', data);
console.log('Error:', error);
```

**Expected Result:** 
- `Data:` shows array of 6 facilities
- `Error:` shows null

**If you see error:**
- "Could not find table" = Tables don't exist, run SIMPLE_SETUP.sql
- Other error = Check error message for clues

---

## Common Issues

### Issue: "Table not found in schema cache"
**Cause:** Tables don't exist in database
**Fix:** Run SIMPLE_SETUP.sql in Supabase SQL Editor

### Issue: "Permission denied"
**Cause:** RLS policies not set up
**Fix:** Run SIMPLE_SETUP.sql (includes RLS policies)

### Issue: Tables exist but still getting errors
**Possible causes:**
1. Wrong Supabase project
2. Schema cache needs refresh
3. RLS policies blocking access

**Fix:**
1. Verify you're in the right project (check URL contains `kqlrbdivuzkfflmpfizn`)
2. Restart Supabase project: Settings → General → Pause project, then Resume
3. Re-run SIMPLE_SETUP.sql

---

## Verification Checklist

Before refreshing your app, verify:

- [ ] I logged into https://app.supabase.com
- [ ] I selected project kqlrbdivuzkfflmpfizn
- [ ] I opened SQL Editor
- [ ] I pasted the ENTIRE SIMPLE_SETUP.sql script
- [ ] I clicked RUN (or pressed Ctrl+Enter)
- [ ] I saw "Created!" with row counts
- [ ] I went to Database → Tables
- [ ] I can see facility_status, equipment, equipment_waitlist tables
- [ ] I went to Database → Replication
- [ ] I enabled replication for all 3 tables
- [ ] I waited 10 seconds
- [ ] I refreshed my app (F5)

If all checked and still not working, there may be a different issue. Check:
- Browser console for different errors
- Supabase project status (not paused?)
- Network connection
