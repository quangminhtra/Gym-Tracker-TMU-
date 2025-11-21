# FitHub - Gym Facility Usage Tracker
## Test Case Document

**Project:** Peak Performance Gym - FitHub  
**Sub-Project:** 5 - Gym Facility Usage Tracker  
**Team:** Operations Team  
**Version:** 1.0  
**Date:** November 21, 2025

---

## Table of Contents

1. [Test Environment Setup](#test-environment-setup)
2. [Functional Test Cases](#functional-test-cases)
3. [Integration Test Cases](#integration-test-cases)
4. [Performance Test Cases](#performance-test-cases)
5. [Security Test Cases](#security-test-cases)
6. [User Acceptance Test Cases](#user-acceptance-test-cases)
7. [Test Data](#test-data)
8. [Test Results Template](#test-results-template)

---

## Test Environment Setup

### Prerequisites

- ✅ Supabase account created
- ✅ Database tables created (facility_status, equipment, equipment_waitlist)
- ✅ Sample data inserted
- ✅ Application deployed and accessible
- ✅ Test user accounts created

### Test Browsers

- Chrome (latest version)
- Firefox (latest version)
- Safari (latest version)
- Edge (latest version)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Test User Roles

| Role | Username | Member ID | Purpose |
|------|----------|-----------|---------|
| Member 1 | John Smith | M001 | Standard member testing |
| Member 2 | Sarah Johnson | M002 | Concurrent user testing |
| Staff 1 | Admin User | STAFF001 | Staff controls testing |

---

## Functional Test Cases

### FC-001: View Live Facility Capacity

**Priority:** High  
**Module:** Live Capacity Display

| Test ID | Test Description | Preconditions | Test Steps | Expected Result | Status |
|---------|------------------|---------------|------------|-----------------|--------|
| FC-001-01 | Display all facility areas | User logged in, navigated to app | 1. Open application<br>2. View Live Capacity tab | All 6 facility areas displayed with capacity cards | |
| FC-001-02 | Show correct capacity data | Sample data loaded | 1. View Main Floor card<br>2. Check displayed data | Shows: area name, current/max capacity, status, timestamp | |
| FC-001-03 | Display correct status colors | Various capacity levels exist | 1. View all cards<br>2. Check status indicators | Quiet=green, Moderate=blue, Busy=orange, Packed=red | |
| FC-001-04 | Show progress bars | Capacity data available | 1. View capacity cards<br>2. Check progress bars | Progress bars accurately reflect capacity percentage | |
| FC-001-05 | Display timestamp | Data has last_updated field | 1. Check any capacity card<br>2. View timestamp | Shows relative time (e.g., "2m ago", "Just now") | |

### FC-002: View Equipment Status

**Priority:** High  
**Module:** Equipment Grid

| Test ID | Test Description | Preconditions | Test Steps | Expected Result | Status |
|---------|------------------|---------------|------------|-----------------|--------|
| FC-002-01 | Display all equipment | Equipment data loaded | 1. Click Equipment tab<br>2. View equipment grid | All equipment items displayed | |
| FC-002-02 | Group by category | Equipment has categories | 1. View equipment grid | Equipment grouped by Strength/Cardio categories | |
| FC-002-03 | Show availability status | Mixed availability exists | 1. Check equipment items | Green background for available, red for in use | |
| FC-002-04 | Display category summary | Multiple items per category | 1. View category headers | Shows "X/Y Available" badge | |
| FC-002-05 | Responsive grid layout | Various screen sizes | 1. Resize browser window<br>2. Check on mobile | Grid adjusts: 2 cols mobile, 3 tablet, 4 desktop | |

### FC-003: Join Equipment Waitlist

**Priority:** High  
**Module:** Equipment Waitlist

| Test ID | Test Description | Preconditions | Test Steps | Expected Result | Status |
|---------|------------------|---------------|------------|-----------------|--------|
| FC-003-01 | Open join waitlist dialog | At least one equipment in use | 1. Click Waitlist tab<br>2. Click "Join Waitlist" button | Dialog opens with form | |
| FC-003-02 | Select equipment | Dialog open | 1. Click equipment dropdown | Only shows equipment currently in use | |
| FC-003-03 | Enter member details | Dialog open | 1. Enter Member ID: M001<br>2. Enter Name: John Smith<br>3. Select equipment | All fields accept input | |
| FC-003-04 | Submit valid waitlist entry | All fields filled | 1. Complete form<br>2. Click "Join Waitlist" | Success toast appears, dialog closes, entry shown in list | |
| FC-003-05 | Validation - empty fields | Dialog open | 1. Click "Join Waitlist" without filling fields | Error message: "Please fill in all fields" | |
| FC-003-06 | Show position in queue | Multiple people in waitlist | 1. Join waitlist<br>2. Check position | Shows position badge (#1, #2, etc.) | |
| FC-003-07 | Display join timestamp | Waitlist entry exists | 1. View waitlist entry | Shows time joined in HH:MM format | |

### FC-004: Leave Equipment Waitlist

**Priority:** Medium  
**Module:** Equipment Waitlist

| Test ID | Test Description | Preconditions | Test Steps | Expected Result | Status |
|---------|------------------|---------------|------------|-----------------|--------|
| FC-004-01 | Remove from waitlist | User in waitlist | 1. Find your entry<br>2. Click X button | Entry removed, success toast shown | |
| FC-004-02 | Update positions | Multiple entries exist, one removed | 1. Remove middle entry<br>2. Check remaining entries | Positions update automatically | |
| FC-004-03 | Empty waitlist state | No entries for equipment | 1. View equipment with no waitlist | Shows "No one in queue yet" message | |

### FC-005: Staff - Update Facility Capacity

**Priority:** High  
**Module:** Staff Controls

| Test ID | Test Description | Preconditions | Test Steps | Expected Result | Status |
|---------|------------------|---------------|------------|-----------------|--------|
| FC-005-01 | Access staff view | Staff logged in | 1. Click "Staff View" button | View changes to staff controls | |
| FC-005-02 | Increase capacity by 1 | Staff view active | 1. Find Main Floor<br>2. Click "+1" button | Capacity increases by 1, toast confirms | |
| FC-005-03 | Increase capacity by 5 | Staff view active | 1. Find Main Floor<br>2. Click "+5" button | Capacity increases by 5, toast confirms | |
| FC-005-04 | Decrease capacity by 1 | Current capacity > 0 | 1. Find area with people<br>2. Click "-1" button | Capacity decreases by 1, toast confirms | |
| FC-005-05 | Decrease capacity by 5 | Current capacity >= 5 | 1. Find area with 5+ people<br>2. Click "-5" button | Capacity decreases by 5, toast confirms | |
| FC-005-06 | Prevent negative capacity | Current capacity = 0 | 1. Try to decrease at 0 | Buttons disabled, no change possible | |
| FC-005-07 | Prevent exceeding max | At max capacity | 1. Try to increase beyond max | Buttons disabled, no change possible | |
| FC-005-08 | Auto-update status | Change capacity across thresholds | 1. Increase from 10 to 40 (in 50 max) | Status changes: Quiet→Moderate→Busy as appropriate | |

### FC-006: Staff - Toggle Equipment Status

**Priority:** High  
**Module:** Staff Controls

| Test ID | Test Description | Preconditions | Test Steps | Expected Result | Status |
|---------|------------------|---------------|------------|-----------------|--------|
| FC-006-01 | Mark available as in use | Equipment available | 1. Go to Equipment Status tab<br>2. Find available equipment<br>3. Click "Toggle" | Status changes to "In Use", badge turns red | |
| FC-006-02 | Mark in use as available | Equipment in use | 1. Find equipment in use<br>2. Click "Toggle" | Status changes to "Available", badge turns green | |
| FC-006-03 | Multiple toggles | Any equipment | 1. Toggle equipment<br>2. Toggle again immediately | Changes reflected correctly both times | |

### FC-007: View Switching

**Priority:** Medium  
**Module:** Navigation

| Test ID | Test Description | Preconditions | Test Steps | Expected Result | Status |
|---------|------------------|---------------|------------|-----------------|--------|
| FC-007-01 | Switch to staff view | Member view active | 1. Click "Staff View" button | View changes, staff controls visible | |
| FC-007-02 | Return to member view | Staff view active | 1. Click "Member View" button | View changes back to member tabs | |
| FC-007-03 | Tab navigation | Member view | 1. Click each tab (Capacity, Equipment, Waitlist) | Each tab displays correct content | |
| FC-007-04 | Staff tab navigation | Staff view | 1. Click between Facility/Equipment tabs | Each tab displays correct controls | |

---

## Integration Test Cases

### INT-001: Real-Time Updates

**Priority:** Critical  
**Integration:** Supabase Real-time

| Test ID | Test Description | Preconditions | Test Steps | Expected Result | Status |
|---------|------------------|---------------|------------|-----------------|--------|
| INT-001-01 | Capacity updates sync | Two browsers open same page | 1. Browser A: Update capacity<br>2. Browser B: Observe | Browser B shows update within 2 seconds | |
| INT-001-02 | Equipment status syncs | Two devices viewing equipment | 1. Device A: Toggle equipment<br>2. Device B: Observe | Device B shows new status immediately | |
| INT-001-03 | Waitlist updates sync | Two users viewing waitlist | 1. User A: Join waitlist<br>2. User B: Observe | User B sees new entry appear | |
| INT-001-04 | Multiple concurrent updates | Multiple staff updating | 1. Staff A: Update area 1<br>2. Staff B: Update area 2<br>3. Check both areas | Both updates reflected correctly | |

### INT-002: Database Operations

**Priority:** High  
**Integration:** Supabase Database

| Test ID | Test Description | Preconditions | Test Steps | Expected Result | Status |
|---------|------------------|---------------|------------|-----------------|--------|
| INT-002-01 | Fetch facility data | Database has data | 1. Load application | All facility data loads from DB | |
| INT-002-02 | Insert waitlist entry | Form submitted | 1. Join waitlist<br>2. Check Supabase dashboard | New row in equipment_waitlist table | |
| INT-002-03 | Update capacity | Staff changes capacity | 1. Update facility<br>2. Check database | facility_status row updated with new values | |
| INT-002-04 | Update equipment | Staff toggles equipment | 1. Toggle status<br>2. Check database | equipment row updated with new availability | |
| INT-002-05 | Delete waitlist entry | User leaves waitlist | 1. Leave waitlist<br>2. Check database | Status changed to 'cancelled' in DB | |

### INT-003: Cross-Sub-Project Integration

**Priority:** Medium  
**Integration:** Other FitHub Sub-projects

| Test ID | Test Description | Preconditions | Test Steps | Expected Result | Status |
|---------|------------------|---------------|------------|-----------------|--------|
| INT-003-01 | Dashboard widget | Sub-project 2 integrated | 1. View member dashboard | Capacity widget shows current status | |
| INT-003-02 | Class booking check | Sub-project 3 integrated | 1. Try booking class in packed area | Warning shown about capacity | |
| INT-003-03 | Waitlist notification | Sub-project 6 integrated | 1. Equipment becomes available<br>2. Check email/SMS | Notification sent to next person | |
| INT-003-04 | Staff admin access | Sub-project 7 integrated | 1. Access from admin dashboard | Facility controls accessible | |
| INT-003-05 | Analytics data | Sub-project 8 integrated | 1. Generate report<br>2. Check data source | Usage data pulled correctly | |

---

## Performance Test Cases

### PERF-001: Load Time

**Priority:** High

| Test ID | Test Description | Acceptance Criteria | Test Steps | Expected Result | Status |
|---------|------------------|-------------------|------------|-----------------|--------|
| PERF-001-01 | Initial page load | < 3 seconds | 1. Clear cache<br>2. Load application<br>3. Measure time to interactive | Page fully loaded in under 3 seconds | |
| PERF-001-02 | Data fetch time | < 1 second | 1. Load page<br>2. Measure API response time | Facility data loads within 1 second | |
| PERF-001-03 | Tab switching | < 500ms | 1. Switch between tabs<br>2. Measure render time | Content appears within 500ms | |

### PERF-002: Concurrent Users

**Priority:** High

| Test ID | Test Description | Acceptance Criteria | Test Steps | Expected Result | Status |
|---------|------------------|-------------------|------------|-----------------|--------|
| PERF-002-01 | 50 concurrent viewers | No degradation | 1. Simulate 50 users<br>2. All view capacity | All users see data, no errors | |
| PERF-002-02 | 10 concurrent staff updates | All sync correctly | 1. 10 staff update different areas<br>2. Check all updates | All updates reflected in DB | |
| PERF-002-03 | Peak hour simulation | 100+ users | 1. Load test with 100 users<br>2. Monitor performance | System remains responsive | |

### PERF-003: Real-Time Performance

**Priority:** Medium

| Test ID | Test Description | Acceptance Criteria | Test Steps | Expected Result | Status |
|---------|------------------|-------------------|------------|-----------------|--------|
| PERF-003-01 | Update propagation time | < 2 seconds | 1. Make update<br>2. Measure time to other clients | Updates received within 2 seconds | |
| PERF-003-02 | Subscription overhead | Minimal impact | 1. Open multiple subscriptions<br>2. Measure performance | No noticeable lag | |

---

## Security Test Cases

### SEC-001: Access Control

**Priority:** High

| Test ID | Test Description | Preconditions | Test Steps | Expected Result | Status |
|---------|------------------|---------------|------------|-----------------|--------|
| SEC-001-01 | Member cannot access staff controls | Logged in as member | 1. Try to access staff features<br>2. Inspect network requests | Staff controls require authentication | |
| SEC-001-02 | Unauthorized database access | No credentials | 1. Try direct database access | Row-level security blocks unauthorized access | |
| SEC-001-03 | XSS prevention | Malicious input | 1. Enter `<script>alert('XSS')</script>` in name field | Input sanitized, no script execution | |

### SEC-002: Data Validation

**Priority:** Medium

| Test ID | Test Description | Preconditions | Test Steps | Expected Result | Status |
|---------|------------------|---------------|------------|-----------------|--------|
| SEC-002-01 | Validate capacity boundaries | Staff mode | 1. Try setting capacity to -10<br>2. Try setting to 1000 | Rejected, stays within 0 to max_capacity | |
| SEC-002-02 | SQL injection attempt | Waitlist form | 1. Enter `'; DROP TABLE equipment_waitlist;--` | Input treated as string, no execution | |
| SEC-002-03 | Required field validation | Join waitlist form | 1. Submit with empty fields | Form validation prevents submission | |

---

## User Acceptance Test Cases

### UAT-001: Member Scenarios

**Priority:** High  
**User Type:** Gym Member

| Test ID | Scenario | Steps | Success Criteria | Status |
|---------|----------|-------|------------------|--------|
| UAT-001-01 | Check gym before visiting | 1. Member opens app at home<br>2. Checks Main Floor capacity<br>3. Sees it's Packed<br>4. Decides to wait 30min | Member makes informed decision based on capacity | |
| UAT-001-02 | Join waitlist for squat rack | 1. Arrives at gym<br>2. Sees squat racks in use<br>3. Joins waitlist via app<br>4. Continues other exercises<br>5. Gets notified when available | Successful waitlist join and notification | |
| UAT-001-03 | Plan workout around availability | 1. Views equipment tab<br>2. Sees 3 treadmills available<br>3. Goes to cardio zone<br>4. Completes cardio workout | Equipment availability helps planning | |

### UAT-002: Staff Scenarios

**Priority:** High  
**User Type:** Gym Staff

| Test ID | Scenario | Steps | Success Criteria | Status |
|---------|----------|-------|------------------|--------|
| UAT-002-01 | Update capacity during rush hour | 1. Staff member at front desk<br>2. Members checking in<br>3. Updates capacity after each check-in<br>4. Members see live updates | Quick updates keep members informed | |
| UAT-002-02 | Manage equipment during maintenance | 1. Bench press needs cleaning<br>2. Staff marks as in use<br>3. Cleans equipment<br>4. Marks as available | Equipment correctly unavailable during maintenance | |
| UAT-002-03 | Help member with waitlist | 1. Member asks about squat rack<br>2. Staff checks waitlist<br>3. Sees 2 people ahead<br>4. Estimates 30min wait<br>5. Helps member join waitlist | Staff can effectively manage queues | |

---

## Test Data

### Sample Facility Data

```javascript
{
  "Main Floor": { current: 15, max: 50, status: "Quiet" },
  "Cardio Zone": { current: 28, max: 40, status: "Busy" },
  "Weight Room": { current: 35, max: 45, status: "Busy" },
  "Yoga Studio": { current: 8, max: 25, status: "Quiet" },
  "Spin Room": { current: 18, max: 20, status: "Packed" },
  "Pool Area": { current: 12, max: 30, status: "Moderate" }
}
```

### Sample Equipment Data

```javascript
{
  strength: [
    { name: "Squat Rack 1", available: false },
    { name: "Squat Rack 2", available: true },
    { name: "Bench Press 1", available: false },
    { name: "Bench Press 2", available: true }
  ],
  cardio: [
    { name: "Treadmill 1", available: false },
    { name: "Treadmill 2", available: true },
    { name: "Rowing Machine 1", available: true }
  ]
}
```

### Sample Waitlist Entries

```javascript
[
  {
    equipment: "Squat Rack 1",
    member_id: "M001",
    member_name: "John Smith",
    position: 1,
    joined_at: "2025-11-21T10:30:00Z"
  },
  {
    equipment: "Squat Rack 1",
    member_id: "M002",
    member_name: "Sarah Johnson",
    position: 2,
    joined_at: "2025-11-21T10:35:00Z"
  }
]
```

---

## Test Results Template

### Test Execution Summary

**Test Date:** _______________  
**Tester Name:** _______________  
**Build Version:** _______________  
**Environment:** _______________

| Category | Total Tests | Passed | Failed | Blocked | Pass Rate |
|----------|-------------|--------|--------|---------|-----------|
| Functional | | | | | |
| Integration | | | | | |
| Performance | | | | | |
| Security | | | | | |
| UAT | | | | | |
| **TOTAL** | | | | | |

### Failed Test Details

| Test ID | Description | Failure Reason | Severity | Assigned To | Due Date |
|---------|-------------|----------------|----------|-------------|----------|
| | | | | | |

### Severity Levels

- **Critical:** System unusable, blocking all testing
- **High:** Major feature broken, workaround exists
- **Medium:** Feature partially broken, minor impact
- **Low:** Cosmetic issue, no functional impact

### Notes and Observations

_Use this section for any additional observations, unexpected behavior, or recommendations._

---

## Test Schedule

### Week 9: Integration & Testing Week

| Day | Testing Focus | Responsible Team |
|-----|---------------|------------------|
| Monday | Functional testing (FC-001 to FC-007) | QA Team |
| Tuesday | Integration testing (INT-001 to INT-003) | Dev Team + QA |
| Wednesday | Performance testing (PERF-001 to PERF-003) | DevOps + QA |
| Thursday | Security testing (SEC-001 to SEC-002) | Security Team |
| Friday | User acceptance testing (UAT-001 to UAT-002) | Operations Team + Members |

---

## Bug Report Template

### Bug ID: [BUG-XXX]

**Title:** _Brief description_

**Severity:** [ ] Critical [ ] High [ ] Medium [ ] Low

**Priority:** [ ] P0 [ ] P1 [ ] P2 [ ] P3

**Environment:**
- Browser: _______________
- OS: _______________
- Device: _______________

**Preconditions:**
_What state should the system be in?_

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:**
_What should happen?_

**Actual Result:**
_What actually happened?_

**Screenshots/Videos:**
_Attach if applicable_

**Additional Notes:**
_Any other relevant information_

---

## Test Automation Recommendations

### High Priority for Automation

1. **Smoke Tests**
   - Basic page load
   - Data fetching
   - Tab navigation

2. **Regression Tests**
   - Capacity updates
   - Equipment toggles
   - Waitlist operations

3. **API Tests**
   - All Supabase CRUD operations
   - Real-time subscriptions
   - Error handling

### Tools Recommended

- **E2E Testing:** Playwright or Cypress
- **API Testing:** Postman or REST Client
- **Load Testing:** k6 or Apache JMeter
- **Monitoring:** Supabase built-in monitoring

---

## Approval Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| QA Lead | | | |
| Operations Team Lead | | | |
| Project Manager | | | |
| Product Owner | | | |

---

**Document Version:** 1.0  
**Last Updated:** November 21, 2025  
**Next Review Date:** December 21, 2025
