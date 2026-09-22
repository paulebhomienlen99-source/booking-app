# BookHub - Referral Program System

## Database Schema Addition

```sql
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES users(id),
  referred_id UUID NOT NULL REFERENCES users(id),
  referral_code VARCHAR(50) UNIQUE NOT NULL,
  booking_id UUID REFERENCES bookings(id),
  commission_amount DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, paid
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paid_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS referral_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES users(id),
  total_earned DECIMAL(10, 2) DEFAULT 0,
  total_paid DECIMAL(10, 2) DEFAULT 0,
  pending DECIMAL(10, 2) DEFAULT 0,
  last_payout TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### 1. Get Referral Code
```
GET /api/referral/code
Response: { referralCode: "BOOKING123ABC" }
```

### 2. Track Referral
```
POST /api/referral/track
Body: { referralCode: "BOOKING123ABC", bookingId: "uuid" }
Response: { success: true, message: "Referral tracked" }
```

### 3. Get Referral Stats
```
GET /api/referral/stats
Response: {
  referralCode: "BOOKING123ABC",
  referredUsers: 5,
  totalBookings: 12,
  totalEarnings: $150.00,
  pendingEarnings: $45.00,
  completedEarnings: $105.00
}
```

### 4. Get Referral Leaderboard
```
GET /api/referral/leaderboard
Response: [
  { rank: 1, name: "John", referrals: 50, earnings: $1500 },
  { rank: 2, name: "Jane", referrals: 35, earnings: $1050 },
  ...
]
```

## Implementation (server.js additions)

```javascript
// Generate referral code for user
app.get('/api/referral/code', (req, res) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    
    // Generate unique referral code
    const referralCode = 'BOOK' + Math.random().toString(36).substring(2, 11).toUpperCase();
    
    // Update user with referral code
    client.query(
      'UPDATE users SET referral_code = $1 WHERE id = $2',
      [referralCode, userId],
      (err) => {
        if (err) {
          console.error('Error setting referral code:', err);
          return res.status(500).json({ error: 'Failed to generate code' });
        }
        res.json({ referralCode });
      }
    );
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Track referral on booking
app.post('/api/referral/track', (req, res) => {
  try {
    const { referralCode, bookingId } = req.body;
    
    if (!referralCode || !bookingId) {
      return res.status(400).json({ error: 'Missing referralCode or bookingId' });
    }
    
    // Find user with this referral code
    client.query(
      'SELECT id FROM users WHERE referral_code = $1',
      [referralCode],
      (err, result) => {
        if (err || result.rows.length === 0) {
          return res.status(404).json({ error: 'Invalid referral code' });
        }
        
        const referrerId = result.rows[0].id;
        
        // Create referral record
        const id = require('uuid').v4();
        client.query(
          'INSERT INTO referrals (id, referrer_id, booking_id, referral_code) VALUES ($1, $2, $3, $4)',
          [id, referrerId, bookingId, referralCode],
          (err) => {
            if (err) {
              console.error('Error tracking referral:', err);
              return res.status(500).json({ error: 'Failed to track referral' });
            }
            res.json({ success: true, message: 'Referral tracked' });
          }
        );
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get referral earnings
app.get('/api/referral/stats', (req, res) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    
    client.query(
      `SELECT 
        u.referral_code,
        COUNT(DISTINCT r.referred_id) as referred_users,
        COUNT(r.id) as total_referrals,
        COALESCE(SUM(r.commission_amount), 0) as total_earned,
        COALESCE(SUM(CASE WHEN r.status = 'paid' THEN r.commission_amount ELSE 0 END), 0) as paid,
        COALESCE(SUM(CASE WHEN r.status = 'pending' THEN r.commission_amount ELSE 0 END), 0) as pending
      FROM users u
      LEFT JOIN referrals r ON u.id = r.referrer_id
      WHERE u.id = $1
      GROUP BY u.id, u.referral_code`,
      [userId],
      (err, result) => {
        if (err) {
          console.error('Error fetching referral stats:', err);
          return res.status(500).json({ error: 'Failed to fetch stats' });
        }
        
        const stats = result.rows[0] || {
          referral_code: null,
          referred_users: 0,
          total_referrals: 0,
          total_earned: 0,
          paid: 0,
          pending: 0
        };
        
        res.json({
          referralCode: stats.referral_code,
          referredUsers: parseInt(stats.referred_users),
          totalReferrals: parseInt(stats.total_referrals),
          totalEarned: parseFloat(stats.total_earned),
          paidEarnings: parseFloat(stats.paid),
          pendingEarnings: parseFloat(stats.pending)
        });
      }
    );
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Referral leaderboard (top 50 referrers)
app.get('/api/referral/leaderboard', (req, res) => {
  try {
    client.query(
      `SELECT 
        u.username,
        COUNT(DISTINCT r.id) as total_referrals,
        COALESCE(SUM(r.commission_amount), 0) as total_earned,
        ROW_NUMBER() OVER (ORDER BY SUM(r.commission_amount) DESC) as rank
      FROM users u
      LEFT JOIN referrals r ON u.id = r.referrer_id
      WHERE u.referral_code IS NOT NULL
      GROUP BY u.id, u.username
      ORDER BY total_earned DESC
      LIMIT 50`,
      (err, result) => {
        if (err) {
          console.error('Error fetching leaderboard:', err);
          return res.status(500).json({ error: 'Failed to fetch leaderboard' });
        }
        
        const leaderboard = result.rows.map(row => ({
          rank: parseInt(row.rank),
          username: row.username,
          referrals: parseInt(row.total_referrals),
          earnings: parseFloat(row.total_earned)
        }));
        
        res.json(leaderboard);
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

## Frontend Integration (index.html additions)

```html
<!-- Add to dashboard section -->
<div class="card">
  <h3>🎁 Referral Program</h3>
  <p>Share your referral code and earn 10-15% commission on every booking!</p>
  
  <div style="background: #f0f4ff; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
    <p style="color: #666; margin-bottom: 10px;">Your Referral Code:</p>
    <div style="display: flex; gap: 10px;">
      <input type="text" id="referralCode" readonly style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
      <button onclick="copyReferralCode()" style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Copy</button>
    </div>
  </div>
  
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
    <div style="background: #fff3cd; padding: 15px; border-radius: 5px;">
      <p style="color: #856404; font-size: 0.9em; margin: 0;">Referred Users</p>
      <p style="color: #000; font-size: 1.5em; font-weight: bold; margin: 5px 0 0 0;" id="referredCount">0</p>
    </div>
    <div style="background: #d4edda; padding: 15px; border-radius: 5px;">
      <p style="color: #155724; font-size: 0.9em; margin: 0;">Referral Earnings</p>
      <p style="color: #000; font-size: 1.5em; font-weight: bold; margin: 5px 0 0 0;" id="referralEarnings">$0</p>
    </div>
  </div>
  
  <h4>Share Your Link:</h4>
  <p style="color: #666; font-size: 0.9em;">Share this: https://booking-app-paulebhomienlen-646825d168bf.herokuapp.com/?ref=YOURCODE</p>
</div>
```

```javascript
function loadReferralStats() {
  const token = localStorage.getItem('token');
  fetch('/api/referral/stats', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById('referralCode').value = data.referralCode || 'N/A';
      document.getElementById('referredCount').textContent = data.referredUsers;
      document.getElementById('referralEarnings').textContent = '$' + data.pendingEarnings.toFixed(2);
    })
    .catch(err => console.error('Error loading referral stats:', err));
}

function copyReferralCode() {
  const code = document.getElementById('referralCode').value;
  navigator.clipboard.writeText(code);
  alert('Referral code copied!');
}

// Call loadReferralStats() on dashboard load
```

