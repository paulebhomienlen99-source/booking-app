# BookHub - Analytics & Tracking Setup

## Analytics Tools to Install

### 1. Google Analytics 4
**Why:** Free, comprehensive website analytics

**Setup:**
1. Create Google Analytics account (https://analytics.google.com)
2. Create property for BookHub
3. Get tracking ID
4. Add to index.html in <head>:

```html
<!-- Google Analytics -->
<script async src=\"https://www.googletagmanager.com/gtag/js?id=GA_ID\"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

**Key Metrics to Track:**
- Users (daily/monthly)
- Sessions
- Bounce rate
- Conversion rate (sign-up → booking)
- Traffic sources
- Device type
- Geographic location

### 2. Google Search Console
**Why:** Monitor search performance, track keywords

**Setup:**
1. Go to https://search.google.com/search-console
2. Add property
3. Verify site ownership
4. Submit XML sitemap

**Key Metrics:**
- Search impressions
- Click-through rate
- Keyword rankings
- Mobile usability
- Indexed pages

### 3. Mixpanel
**Why:** User behavior analytics, funnels, retention

**Setup:**
1. Create account at https://mixpanel.com
2. Create project
3. Install SDK in your app

```javascript
// In index.html before </head>
<script src=\"https://cdn.mxpnl.com/libs/mixpanel-latest.min.js\"></script>
<script>
  mixpanel.init('PROJECT_TOKEN');
  
  // Track sign-up
  mixpanel.track('User Signup', {
    'source': 'organic',
    'referral_code': referralCode
  });
  
  // Track booking
  mixpanel.track('Booking Created', {
    'service': serviceName,
    'city': cityName,
    'price': price,
    'has_gps': hasGPS
  });
  
  // Track cancel
  mixpanel.track('Booking Cancelled', {
    'booking_id': bookingId
  });
end
```

**Key Metrics:**
- User funnel (browse → sign-up → book)
- Retention (% returning users)
- Feature usage (GPS clicks, etc.)
- User segments
- Cohort analysis

### 4. Segment
**Why:** Centralized customer data platform

**Setup:**
```javascript
analytics.track('Sign Up', {
  email: userEmail,
  referral_code: referralCode
});

analytics.track('Service Booked', {
  service_name: serviceName,
  price: price,
  city: city
});
```

## Custom Dashboard

Create a simple admin dashboard to view metrics:

```javascript
// Add to server.js

app.get('/api/admin/analytics', async (req, res) => {
  try {
    // Total users
    const users = await client.query('SELECT COUNT(*) as total FROM users');
    
    // Total bookings
    const bookings = await client.query('SELECT COUNT(*) as total FROM bookings');
    
    // Total revenue
    const revenue = await client.query(
      'SELECT SUM(price * 0.2) as total FROM bookings JOIN services ON bookings.service_id = services.id'
    );
    
    // Bookings last 7 days
    const weekBookings = await client.query(
      'SELECT COUNT(*) as total FROM bookings WHERE created_at > NOW() - INTERVAL 7 DAY'
    );
    
    // Top services
    const topServices = await client.query(
      'SELECT services.name, COUNT(*) as bookings FROM bookings JOIN services ON bookings.service_id = services.id GROUP BY services.name ORDER BY bookings DESC LIMIT 10'
    );
    
    // Top cities
    const topCities = await client.query(
      'SELECT city, COUNT(*) as bookings FROM bookings GROUP BY city ORDER BY bookings DESC LIMIT 10'
    );
    
    res.json({
      totalUsers: users.rows[0].total,
      totalBookings: bookings.rows[0].total,
      totalRevenue: revenue.rows[0].total,
      bookingsLastWeek: weekBookings.rows[0].total,
      topServices: topServices.rows,
      topCities: topCities.rows
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});
```

## Key Performance Indicators (KPIs)

### Growth Metrics
| Metric | Target | Tracking |
|--------|--------|----------|
| Monthly Users | +50% MoM | Analytics |
| Monthly Bookings | +40% MoM | Analytics |
| Monthly Revenue | +50% MoM | DB Query |
| Services Added | +50/month | DB Query |
| Cities Added | +5/month | DB Query |

### Engagement Metrics
| Metric | Target | Tracking |
|--------|--------|----------|
| Booking Conversion | 15-20% | Analytics/Mixpanel |
| Return User Rate | 30%+ | Analytics |
| Avg Bookings/User | 3+ | DB Query |
| GPS Feature Usage | 70%+ | Mixpanel |
| Session Duration | 5+ min | Analytics |

### Business Metrics
| Metric | Target | Tracking |
|--------|--------|----------|
| Revenue/User | $50+ | DB Query |
| Customer Acquisition Cost | < $5 | Analytics |
| Lifetime Value | $200+ | DB Query |
| Service Provider Earnings | $1,000+ | DB Query |
| Monthly Recurring Revenue | $10K+ | DB Query |

## Weekly Review

Every Sunday:
1. Check Google Analytics for traffic sources
2. Review Mixpanel for user behavior
3. Check top services and cities
4. Calculate CAC vs LTV
5. Review referral program performance
6. Identify drop-off points
7. Adjust marketing strategy

## Monthly Review

Every 30 days:
1. Overall growth rate
2. Revenue trends
3. Service provider feedback
4. Customer satisfaction (via reviews)
5. Competitive analysis
6. Marketing ROI by channel
7. Set targets for next month

## Dashboard Metrics to Display

**Homepage/Admin:**
```
Total Users: 1,234
Total Bookings: 5,678
Total Revenue: $113,560
This Week: +15% bookings
Monthly Growth: +45%

Top Services:
1. Haircut (234 bookings)
2. Tutoring (187 bookings)
3. Photography (156 bookings)

Top Cities:
1. New York (456 bookings)
2. Los Angeles (234 bookings)
3. London (189 bookings)

Referral Program:
Total Referrals: 234
Total Referral Revenue: $8,900
Top Referrer: John (50 referrals, $1,500)
```

## A/B Testing Framework

### Test 1: Booking Button Text
- Version A: \"Book Now\"
- Version B: \"Complete Booking\"
- Metric: Conversion rate
- Duration: 2 weeks

### Test 2: GPS Button Placement
- Version A: Top of form
- Version B: Below city select
- Metric: GPS feature usage %
- Duration: 2 weeks

### Test 3: Email Subject Lines
- Version A: \"Book services in 30 seconds\"
- Version B: \"64+ services, 1 app\"
- Metric: Open rate, click-through
- Duration: 1 week

## Attribution Tracking

Track how users discover BookHub:
- Direct
- Google Search
- Referral (friends)
- Referral code (influencers)
- Social media
- Product Hunt
- Reddit
- Email newsletter
- Word of mouth

Set UTM parameters for all links:
```
?utm_source=twitter&utm_medium=social&utm_campaign=launch
?utm_source=reddit&utm_medium=social&utm_campaign=r_sideproject
?utm_source=newsletter&utm_medium=email&utm_campaign=weekly
?utm_source=influencer&utm_medium=referral&utm_campaign=john_doe
```

## Real-Time Monitoring

**Heroku Logs:**
```bash
heroku logs --tail
```

**Database Health:**
```sql
SELECT COUNT(*) as total_bookings FROM bookings;
SELECT COUNT(*) as total_users FROM users;
SELECT SUM(commission) FROM bookings;
```

**Error Tracking:**
Set up Sentry for error monitoring:
```javascript
import * as Sentry from \"@sentry/node\";
Sentry.init({ dsn: 'YOUR_DSN' });
```

## Growth Targets (First 12 Months)

| Month | Users | Bookings | Revenue |
|-------|-------|----------|---------|
| 1 | 1,000 | 500 | $10,000 |
| 2 | 1,500 | 800 | $16,000 |
| 3 | 2,250 | 1,200 | $24,000 |
| 4 | 3,375 | 1,800 | $36,000 |
| 5 | 5,000 | 2,700 | $54,000 |
| 6 | 7,500 | 4,000 | $80,000 |
| 7 | 11,250 | 6,000 | $120,000 |
| 8 | 16,875 | 9,000 | $180,000 |
| 9 | 25,300 | 13,500 | $270,000 |
| 10 | 37,950 | 20,250 | $405,000 |
| 11 | 56,925 | 30,375 | $607,500 |
| 12 | 85,400 | 45,500 | $910,000 |

