# 🎁 Referral System Implementation Guide

## Overview

Implement a referral program: **"Refer a friend, get 50% off your first 3-month plan"**

---

## 🎯 Referral Program Details

### Offer:

- **Referrer**: Gets 50% off first 3-month plan
- **Referee**: Gets 10% off their first month
- **Limit**: Unlimited referrals
- **Validity**: Discount valid for 90 days after signup

### How It Works:

```
User A (Referrer) → Shares unique link → User B (Referee) signs up
                                              ↓
                                    Both get discounts!
```

---

## 📊 Database Schema

### Add to Users Table (DynamoDB)

```javascript
{
  userId: "user-123",
  email: "user@example.com",

  // NEW: Referral fields
  referralCode: "JOHN2024ABC",        // Unique code for this user
  referredBy: "user-456",             // Who referred them
  referralCount: 5,                   // How many people they referred
  referralCredits: 150,               // Credits earned ($1 = 1 credit)
  referralDiscountUsed: false,        // Have they used their discount?
  referralDiscountExpiry: "2024-12-31", // When discount expires

  // Existing fields...
}
```

### New Table: Referrals

```javascript
{
  referralId: "ref-123",              // Primary key
  referrerId: "user-123",             // Who made the referral
  refereeId: "user-456",              // Who was referred
  referralCode: "JOHN2024ABC",        // Code used
  status: "completed",                // pending, completed, expired
  createdAt: "2024-11-17T...",
  completedAt: "2024-11-18T...",
  discountApplied: true,
  discountAmount: 50,                 // Percentage
  expiresAt: "2025-02-17T..."
}
```

---

## 🔧 Backend Implementation

### 1. Generate Referral Code

**File:** `server/services/referralService.js`

```javascript
const crypto = require("crypto");
const DynamoService = require("./dynamoService");

class ReferralService {
  /**
   * Generate unique referral code
   */
  static generateReferralCode(userName) {
    const prefix = userName.substring(0, 4).toUpperCase();
    const random = crypto.randomBytes(4).toString("hex").toUpperCase();
    return `${prefix}${random}`;
  }

  /**
   * Create referral code for user
   */
  static async createReferralCode(userId, userName) {
    const code = this.generateReferralCode(userName);

    await DynamoService.updateUserProfile(userId, {
      referralCode: code,
      referralCount: 0,
      referralCredits: 0,
      referralDiscountUsed: false,
    });

    return code;
  }

  /**
   * Apply referral code during signup
   */
  static async applyReferralCode(newUserId, referralCode) {
    try {
      // Find referrer by code
      const referrer = await this.getUserByReferralCode(referralCode);

      if (!referrer) {
        return { success: false, error: "Invalid referral code" };
      }

      // Calculate expiry (90 days from now)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 90);

      // Update new user (referee)
      await DynamoService.updateUserProfile(newUserId, {
        referredBy: referrer.userId,
        referralDiscountUsed: false,
        referralDiscountExpiry: expiryDate.toISOString(),
        referralDiscount: {
          percentage: 10,
          duration: 1, // months
          type: "first_month",
        },
      });

      // Update referrer
      await DynamoService.updateUserProfile(referrer.userId, {
        referralCount: (referrer.referralCount || 0) + 1,
        referralCredits: (referrer.referralCredits || 0) + 50, // $50 credit
      });

      // Create referral record
      await this.createReferralRecord({
        referrerId: referrer.userId,
        refereeId: newUserId,
        referralCode: referralCode,
        status: "completed",
      });

      return {
        success: true,
        referrer: referrer.name,
        discount: {
          percentage: 10,
          duration: 1,
        },
      };
    } catch (error) {
      console.error("Error applying referral code:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get referral stats for user
   */
  static async getReferralStats(userId) {
    const user = await DynamoService.getUserProfile(userId);

    return {
      referralCode: user.referralCode,
      referralCount: user.referralCount || 0,
      referralCredits: user.referralCredits || 0,
      referralLink: `https://yourapp.com/signup?ref=${user.referralCode}`,
      discountAvailable: !user.referralDiscountUsed,
      discountExpiry: user.referralDiscountExpiry,
    };
  }

  /**
   * Check if user can use referral discount
   */
  static async canUseReferralDiscount(userId) {
    const user = await DynamoService.getUserProfile(userId);

    if (user.referralDiscountUsed) {
      return { canUse: false, reason: "Discount already used" };
    }

    if (!user.referredBy) {
      return { canUse: false, reason: "Not referred by anyone" };
    }

    const expiry = new Date(user.referralDiscountExpiry);
    if (expiry < new Date()) {
      return { canUse: false, reason: "Discount expired" };
    }

    return {
      canUse: true,
      discount: user.referralDiscount,
    };
  }

  /**
   * Mark referral discount as used
   */
  static async markDiscountUsed(userId) {
    await DynamoService.updateUserProfile(userId, {
      referralDiscountUsed: true,
      referralDiscountUsedAt: new Date().toISOString(),
    });
  }
}

module.exports = ReferralService;
```

### 2. API Routes

**File:** `server/routes/referral.js`

```javascript
const express = require("express");
const router = express.Router();
const ReferralService = require("../services/referralService");

// Get user's referral stats
router.get("/stats/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const stats = await ReferralService.getReferralStats(userId);

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate referral code
router.post("/validate", async (req, res) => {
  try {
    const { referralCode } = req.body;
    const isValid = await ReferralService.validateReferralCode(referralCode);

    res.json({
      success: true,
      valid: isValid,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply referral code during signup
router.post("/apply", async (req, res) => {
  try {
    const { userId, referralCode } = req.body;
    const result = await ReferralService.applyReferralCode(
      userId,
      referralCode
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check if user can use discount
router.get("/can-use-discount/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await ReferralService.canUseReferralDiscount(userId);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

## 🎨 Frontend Implementation

### 1. Referral Dashboard Component

**File:** `src/components/ReferralDashboard.tsx`

```tsx
import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Gift, Users, DollarSign, Copy, Check, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ReferralStats {
  referralCode: string;
  referralCount: number;
  referralCredits: number;
  referralLink: string;
  discountAvailable: boolean;
  discountExpiry: string;
}

export function ReferralDashboard({ userId }: { userId: string }) {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchReferralStats();
  }, [userId]);

  const fetchReferralStats = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/referral/stats/${userId}`
      );
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching referral stats:", error);
    }
  };

  const copyReferralLink = () => {
    if (stats) {
      navigator.clipboard.writeText(stats.referralLink);
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareReferral = async () => {
    if (stats && navigator.share) {
      try {
        await navigator.share({
          title: "Join AI Career Agent",
          text: "Get 10% off your first month! Use my referral link:",
          url: stats.referralLink,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    }
  };

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
        <div className="flex items-center gap-3 mb-4">
          <Gift className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Referral Program</h2>
            <p className="text-sm opacity-90">
              Refer friends and get 50% off your first 3-month plan!
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs opacity-75">Referrals</span>
            </div>
            <div className="text-3xl font-bold">{stats.referralCount}</div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs opacity-75">Credits</span>
            </div>
            <div className="text-3xl font-bold">${stats.referralCredits}</div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Gift className="w-4 h-4" />
              <span className="text-xs opacity-75">Discount</span>
            </div>
            <div className="text-xl font-bold">
              {stats.discountAvailable ? "50% OFF" : "Used"}
            </div>
          </div>
        </div>
      </Card>

      {/* Referral Link */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Your Referral Link</h3>

        <div className="flex gap-2 mb-4">
          <Input value={stats.referralLink} readOnly className="flex-1" />
          <Button onClick={copyReferralLink} variant="outline">
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
          <Button onClick={shareReferral} className="bg-blue-600">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Your referral code:</strong>{" "}
            <code className="bg-blue-100 px-2 py-1 rounded">
              {stats.referralCode}
            </code>
          </p>
        </div>
      </Card>

      {/* How It Works */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">How It Works</h3>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
              1
            </div>
            <div>
              <h4 className="font-semibold">Share Your Link</h4>
              <p className="text-sm text-gray-600">
                Send your unique referral link to friends
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
              2
            </div>
            <div>
              <h4 className="font-semibold">They Sign Up</h4>
              <p className="text-sm text-gray-600">
                Your friend gets 10% off their first month
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
              3
            </div>
            <div>
              <h4 className="font-semibold">You Get Rewarded</h4>
              <p className="text-sm text-gray-600">
                Get 50% off your first 3-month plan + $50 credit
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Discount Status */}
      {stats.discountAvailable && (
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-start gap-3">
            <Gift className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-900">
                You have a 50% discount available!
              </h3>
              <p className="text-sm text-green-700 mt-1">
                Use it when upgrading to a paid plan. Expires:{" "}
                {new Date(stats.discountExpiry).toLocaleDateString()}
              </p>
              <Button className="mt-3 bg-green-600 hover:bg-green-700">
                Upgrade Now & Save 50%
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
```

### 2. Add Referral Code Input to Signup

**File:** `src/components/LoginPage.tsx` (modify)

```tsx
// Add to signup form
<div>
  <Label htmlFor="referralCode">Referral Code (Optional)</Label>
  <Input
    id="referralCode"
    value={referralCode}
    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
    placeholder="Enter referral code"
  />
  <p className="text-xs text-gray-500 mt-1">
    Have a referral code? Get 10% off your first month!
  </p>
</div>
```

---

## 📱 Social Sharing Templates

### Email Template

```html
Subject: Get 10% off AI Career Agent! 🎁 Hi [Friend's Name], I've been using AI
Career Agent to track my career journey and it's amazing! Here's what you get:
✅ AI-powered job matching ✅ Daily coding interview questions ✅ Resume
optimization ✅ Career guidance Use my referral link and get 10% off your first
month: [REFERRAL_LINK] See you inside! [Your Name]
```

### WhatsApp/SMS Template

```
Hey! 👋

Check out AI Career Agent - it's helping me with my career journey!

Use my link and get 10% off:
[REFERRAL_LINK]

You'll love it! 🚀
```

### Social Media Template

```
🎓 Just found the perfect career companion!

AI Career Agent helps with:
✅ Job search
✅ Interview prep
✅ Resume optimization
✅ Career guidance

Get 10% off with my referral link:
[REFERRAL_LINK]

#CareerGrowth #JobSearch #AITools
```

---

## 💰 Pricing Integration

### Subscription Plans with Referral Discounts

```javascript
const pricingPlans = [
  {
    name: "Free",
    price: 0,
    features: ["5 AI analyses/month", "Basic job search", "Resume tips"],
  },
  {
    name: "Pro",
    price: 19,
    referralPrice: 17.1, // 10% off for referee
    features: [
      "Unlimited AI analyses",
      "Priority support",
      "Advanced features",
    ],
  },
  {
    name: "Pro (3 months)",
    price: 57,
    referralPrice: 28.5, // 50% off for referrer
    features: ["Everything in Pro", "3-month commitment", "Best value"],
  },
];
```

---

## 📊 Analytics & Tracking

### Metrics to Track

```javascript
{
  totalReferrals: 150,
  successfulReferrals: 120,
  conversionRate: 80%, // 120/150
  averageReferralsPerUser: 2.5,
  totalDiscountsGiven: 180,
  revenueFromReferrals: 2400,
  topReferrers: [
    { userId: 'user-123', referrals: 25 },
    { userId: 'user-456', referrals: 18 }
  ]
}
```

---

## 🎯 Implementation Checklist

### Backend (2 hours)

- [ ] Create ReferralService
- [ ] Add referral fields to User schema
- [ ] Create Referrals table
- [ ] Implement API routes
- [ ] Test referral code generation
- [ ] Test referral application

### Frontend (2 hours)

- [ ] Create ReferralDashboard component
- [ ] Add referral code input to signup
- [ ] Add referral link to settings
- [ ] Implement copy/share functionality
- [ ] Add discount badge to pricing
- [ ] Test user flow

### Integration (1 hour)

- [ ] Connect to Stripe for discount application
- [ ] Test end-to-end referral flow
- [ ] Verify discount calculations
- [ ] Test expiry logic

### Marketing (1 hour)

- [ ] Create email templates
- [ ] Create social media graphics
- [ ] Write referral program page
- [ ] Add to onboarding flow

---

## 🚀 Launch Strategy

### Phase 1: Soft Launch (Week 1)

- Enable for beta users only
- Test with 10-20 users
- Gather feedback
- Fix bugs

### Phase 2: Public Launch (Week 2)

- Announce on all channels
- Email existing users
- Social media campaign
- Blog post

### Phase 3: Optimization (Week 3+)

- Analyze metrics
- A/B test messaging
- Adjust rewards if needed
- Scale up

---

## 💡 Pro Tips

1. **Make it easy**: One-click sharing
2. **Show progress**: Display referral count
3. **Remind users**: Email when discount expires
4. **Gamify**: Leaderboard for top referrers
5. **Reward both**: Referrer and referee both win
6. **Clear terms**: Explain how it works
7. **Track everything**: Analytics are key
8. **Test thoroughly**: Prevent abuse
9. **Promote**: Feature prominently in app
10. **Celebrate**: Congratulate successful referrers

---

**Ready to implement?** Start with the backend, then add the UI! 🎁
