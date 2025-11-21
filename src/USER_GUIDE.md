# FitHub - Gym Facility Usage Tracker
## User Guide

**Version:** 1.0  
**Sub-Project:** 5 - Gym Facility Usage Tracker  
**Team:** Operations Team  
**Date:** November 21, 2025

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Member Features](#member-features)
4. [Staff Features](#staff-features)
5. [Real-Time Updates](#real-time-updates)
6. [Troubleshooting](#troubleshooting)
7. [FAQs](#faqs)

---

## Introduction

Welcome to FitHub's Gym Facility Usage Tracker! This system helps Peak Performance Gym members make informed decisions about when to visit the gym by providing real-time capacity information and equipment availability.

### Key Features

✅ **Live Capacity Tracking** - See how busy each gym area is in real-time  
✅ **Equipment Status** - Check if your favorite equipment is available  
✅ **Virtual Waitlist** - Join a queue for popular equipment  
✅ **Staff Controls** - Gym staff can manage capacity and equipment status

---

## Getting Started

### System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Member ID (for joining waitlists)

### Accessing the System

1. Open your web browser
2. Navigate to the FitHub portal
3. The Facility Usage Tracker is accessible from the main dashboard

### First-Time Setup

No setup required! The system is ready to use immediately.

---

## Member Features

### 1. Viewing Live Capacity

The **Live Capacity** tab shows real-time occupancy for all gym areas.

#### Understanding Capacity Indicators

| Status | Capacity | What It Means | Best Action |
|--------|----------|---------------|-------------|
| 🟢 **Quiet** | 0-30% | Very few people, lots of space | Perfect time to visit! |
| 🔵 **Moderate** | 30-60% | Comfortable amount of activity | Good time to workout |
| 🟠 **Busy** | 60-85% | Getting crowded, equipment may be limited | Consider waiting or going to quieter areas |
| 🔴 **Packed** | 85-100% | At or near capacity | Wait for capacity to decrease |

#### How to Use

1. Click on the **"Live Capacity"** tab
2. View all gym areas displayed as cards
3. Each card shows:
   - Area name (e.g., "Main Floor", "Cardio Zone")
   - Current capacity count
   - Maximum capacity
   - Status indicator (Quiet/Moderate/Busy/Packed)
   - Last updated time
   - Visual progress bar

**Example:**
```
Main Floor
🟢 Quiet
Current Capacity: 15 / 50
30% capacity
Last updated: 2m ago
```

### 2. Checking Equipment Status

The **Equipment** tab shows which equipment is available or in use.

#### How to Use

1. Click on the **"Equipment"** tab
2. Equipment is organized by category:
   - **Strength** (Squat Racks, Bench Press, etc.)
   - **Cardio** (Treadmills, Rowing Machines, etc.)
3. Each equipment item shows:
   - Equipment name
   - Availability status (Available ✅ / In Use ❌)
   - Visual color coding (green = available, red = in use)

**Tip:** Plan your workout around available equipment to avoid waiting.

### 3. Joining Equipment Waitlist

When popular equipment is in use, you can join a virtual waitlist.

#### How to Join Waitlist

1. Click on the **"Waitlist"** tab
2. Click the **"Join Waitlist"** button
3. Fill in the form:
   - **Equipment:** Select from available options (only shows equipment currently in use)
   - **Member ID:** Enter your gym member ID (e.g., M001)
   - **Your Name:** Enter your full name
4. Click **"Join Waitlist"**
5. You'll receive a confirmation toast notification

#### Understanding Your Position

- **Position #1:** You're next in line
- **Position #2+:** People ahead of you
- **Time Stamp:** Shows when you joined the queue

#### Leaving a Waitlist

1. Find your entry in the waitlist
2. Click the ❌ icon next to your name
3. You'll be removed from the queue

**Important Notes:**
- You can join multiple waitlists at once
- The system shows how many people are waiting for each equipment
- Staff will notify you when it's your turn (via Sub-Project 6 integration)

---

## Staff Features

### Accessing Staff Controls

1. Click the **"Staff View"** button in the top-right corner
2. Enter staff credentials (if required)
3. The view changes to show staff controls

### Managing Facility Capacity

#### How to Update Capacity

1. In Staff View, go to the **"Facility Capacity"** tab
2. Find the area you want to update
3. Use the control buttons:
   - **-5:** Decrease by 5 people
   - **-1:** Decrease by 1 person
   - **+1:** Increase by 1 person
   - **+5:** Increase by 5 people
4. The status updates automatically based on capacity percentage

#### Status Calculation

The system automatically calculates status:
- **Quiet:** Less than 30% capacity
- **Moderate:** 30-59% capacity
- **Busy:** 60-84% capacity
- **Packed:** 85-100% capacity

**Example Scenario:**
```
Weight Room has max capacity of 45 people
- Current: 20 people → Status: Moderate
- Current: 40 people → Status: Packed
```

### Managing Equipment Status

#### How to Toggle Equipment

1. In Staff View, go to the **"Equipment Status"** tab
2. Find the equipment you want to update
3. Click the **"Toggle"** button
4. Status switches between Available ↔ In Use

**Use Cases:**
- Mark equipment as "In Use" when a member starts using it
- Mark as "Available" when a member finishes
- Mark as "In Use" during maintenance or cleaning

### Best Practices for Staff

1. **Update Regularly:** Update capacity as members check in/out
2. **Monitor Waitlists:** Check waitlists and notify members when equipment becomes available
3. **Peak Hours:** Pay extra attention during rush hours (6-8 AM, 5-7 PM)
4. **Maintenance:** Mark equipment as unavailable during cleaning or repairs

---

## Real-Time Updates

### How It Works

The system uses **Supabase real-time subscriptions** to automatically update information across all devices.

### What Updates in Real-Time

✅ Facility capacity changes  
✅ Equipment availability  
✅ Waitlist additions/removals  
✅ Status indicators  

### Visual Indicators

- **Animated pulse:** Green/orange/red dots pulse on capacity cards
- **Toast notifications:** Pop-up messages confirm actions
- **Automatic refresh:** No need to manually refresh the page

**Example:**
When a staff member updates the Main Floor capacity, all members viewing that area will see the change within 1-2 seconds.

---

## Troubleshooting

### Common Issues

#### Issue: Data Not Loading

**Symptoms:** Empty cards or "Loading..." message persists

**Solutions:**
1. Check your internet connection
2. Refresh the page (F5 or Cmd+R)
3. Clear browser cache
4. Try a different browser

#### Issue: Can't Join Waitlist

**Symptoms:** "Join Waitlist" button disabled or error message

**Solutions:**
1. Ensure the equipment is actually in use (not available)
2. Check that you filled in all required fields
3. Verify your Member ID is correct
4. Try selecting a different piece of equipment

#### Issue: Real-Time Updates Not Working

**Symptoms:** Changes don't appear automatically

**Solutions:**
1. Check internet connection stability
2. Refresh the page to re-establish connection
3. Contact IT support if issue persists

#### Issue: Staff Controls Not Visible

**Symptoms:** Can't see staff controls after clicking "Staff View"

**Solutions:**
1. Verify you have staff credentials
2. Log out and log back in
3. Contact system administrator for permissions

### Error Messages

| Message | Meaning | Solution |
|---------|---------|----------|
| "Failed to load equipment" | Database connection issue | Refresh page, check internet |
| "Failed to join waitlist" | Submission error | Verify all fields filled, try again |
| "Failed to update capacity" | Permission or connection issue | Check staff credentials |

---

## FAQs

### General Questions

**Q: How often is the data updated?**  
A: Real-time! Updates happen within 1-2 seconds across all devices.

**Q: Can I check capacity from my phone?**  
A: Yes! The system is fully responsive and works on all devices.

**Q: Do I need to create an account?**  
A: For viewing capacity, no. For joining waitlists, you'll need to enter your Member ID.

**Q: Is the system available 24/7?**  
A: Yes! Access it anytime the gym is open.

### Capacity Questions

**Q: How accurate is the capacity count?**  
A: Staff update counts regularly at check-in points. Accuracy depends on staff diligence.

**Q: What if the displayed capacity seems wrong?**  
A: Contact gym staff to verify and update the count.

**Q: Can I see historical capacity data?**  
A: Historical data will be available in Sub-Project 8 (Reporting & Analytics).

### Waitlist Questions

**Q: Will I get notified when equipment is available?**  
A: Yes! Notifications are handled by Sub-Project 6 (Notification System) via SMS/email.

**Q: What happens if I miss my turn?**  
A: Staff will move to the next person. You may need to rejoin the waitlist.

**Q: Can I be on multiple waitlists?**  
A: Yes! Join as many as you need.

**Q: How long should I wait?**  
A: Average equipment use is 15-30 minutes. Your position shows estimated wait time.

### Staff Questions

**Q: Who can access Staff Controls?**  
A: Only authorized gym staff with proper credentials.

**Q: What if I accidentally change the wrong area?**  
A: Simply adjust it back using the +/- controls.

**Q: Can multiple staff update at once?**  
A: Yes! The system handles concurrent updates with real-time sync.

---

## Integration with Other Sub-Projects

This Facility Usage Tracker integrates with:

- **Sub-Project 2:** Member Dashboard displays capacity widget
- **Sub-Project 3:** Class booking checks capacity before allowing bookings
- **Sub-Project 6:** Sends waitlist notifications when equipment becomes available
- **Sub-Project 7:** Staff Admin Dashboard includes facility management
- **Sub-Project 8:** Provides data for popularity and usage reports

---

## Support

### Need Help?

- **Email:** support@peakperformancegym.com
- **Phone:** (555) 123-4567
- **In-Person:** Visit the front desk
- **Hours:** Mon-Fri 6AM-10PM, Sat-Sun 7AM-8PM

### Feedback

We'd love to hear your thoughts! Send feedback to: feedback@peakperformancegym.com

---

## Appendix

### Glossary

- **Capacity:** Number of members currently in a gym area
- **Waitlist:** Virtual queue for equipment
- **Real-time:** Updates that happen immediately across all devices
- **Status:** Indicator of how busy an area is (Quiet/Moderate/Busy/Packed)

### Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Nov 21, 2025 | Initial release |

---

**Thank you for using FitHub's Facility Usage Tracker!**  
*Making your gym experience better, one update at a time.* 💪
