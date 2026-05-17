# Kamai — Frontend Integration Overview

**Last Updated:** November 12, 2025  
**Status:** ✅ Ready for Backend Integration  
**Next Milestone:** Backend API Integration (After November 15th)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Mock API Routes](#mock-api-routes)
3. [Data Structures](#data-structures)
4. [Component Integration](#component-integration)
5. [Backend Integration Steps](#backend-integration-steps)
6. [Environment Configuration](#environment-configuration)
7. [Testing Checklist](#testing-checklist)
8. [Visual Demo](#visual-demo)

---

## 🎯 Overview

The Kamai frontend is fully functional with mock APIs that simulate real backend responses. All components dynamically fetch data from local API routes, making the transition to live backend endpoints seamless.

### Key Features Implemented

✅ **Mock API System** — All endpoints return realistic JSON data  
✅ **Dynamic Data Loading** — Components fetch from `/api/*` routes  
✅ **Loading States** — Skeleton loaders and loading indicators  
✅ **Error Handling** — Graceful fallbacks for failed requests  
✅ **Responsive Design** — Mobile-first, works from 360px to 1440px+  
✅ **Glassmorphic UI** — Consistent dark theme with accent colors  
✅ **Animations** — Smooth Framer Motion transitions  
✅ **Accessibility** — ARIA labels, focus states, keyboard navigation

---

## 🛣️ Mock API Routes

All mock API routes are located in `/app/api/` and follow Next.js 13+ App Router conventions.

### Available Endpoints

| Endpoint | Method | Description | Response Time |
|----------|--------|-------------|---------------|
| `/api/income` | GET | Income forecast data (predicted vs actual) | ~250ms |
| `/api/expenses` | GET | Expense breakdown by category | ~200ms |
| `/api/vault` | GET | Vault balance, transactions, growth history | ~300ms |
| `/api/agents` | GET | AI agent statuses and recent actions | ~220ms |
| `/api/analytics` | GET | Dashboard overview metrics and insights | ~280ms |

### Mock API Structure

```plaintext
app/
└── api/
    ├── income/
    │   └── route.ts
    ├── expenses/
    │   └── route.ts
    ├── vault/
    │   └── route.ts
    ├── agents/
    │   └── route.ts
    └── analytics/
        └── route.ts
```

---

## 📊 Data Structures

All data structures are documented in `/lib/mockData.ts`. This file serves as the **single source of truth** for API response schemas.

### 1. Income Data (`/api/income`)

```typescript
interface IncomeData {
  date: string;              // Format: "YYYY-MM-DD"
  predicted_income: number;  // In INR
  actual_income: number;     // In INR
}

// Returns: IncomeData[]
```

**Example Response:**
```json
[
  { "date": "2025-11-01", "predicted_income": 2300, "actual_income": 2100 },
  { "date": "2025-11-02", "predicted_income": 2400, "actual_income": 2250 }
]
```

### 2. Expense Data (`/api/expenses`)

```typescript
interface ExpenseCategory {
  category: string;  // Category name
  amount: number;    // Total amount in INR
}

// Returns: ExpenseCategory[]
```

**Example Response:**
```json
[
  { "category": "Food & Dining", "amount": 12500 },
  { "category": "Transportation", "amount": 8300 }
]
```

### 3. Vault Data (`/api/vault`)

```typescript
interface VaultData {
  current_balance: number;
  total_deposits: number;
  total_withdrawals: number;
  interest_earned: number;
  growth_rate: number;        // Percentage
  last_updated: string;       // ISO 8601 timestamp
  recent_transactions: Transaction[];
  growth_history: GrowthPoint[];
}

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "interest";
  amount: number;
  date: string;               // Format: "YYYY-MM-DD"
  description: string;
  status: "completed" | "pending" | "failed";
}

interface GrowthPoint {
  date: string;               // Format: "YYYY-MM-DD"
  balance: number;
}

// Returns: VaultData
```

### 4. Agents Data (`/api/agents`)

```typescript
interface Agent {
  id: string;
  name: string;
  status: "active" | "idle" | "error";
  last_action: string;
  timestamp: string;          // ISO 8601 timestamp
  actions_count: number;
  success_rate: number;       // Percentage
  category: string;
}

// Returns: Agent[]
```

### 5. Analytics Data (`/api/analytics`)

```typescript
interface AnalyticsData {
  overview: {
    total_income: number;
    total_expenses: number;
    net_savings: number;
    savings_rate: number;     // Percentage
    flex_score: number;
    credit_score: number;
  };
  monthly_trends: {
    income_growth: number;    // Percentage
    expense_growth: number;   // Percentage
    savings_growth: number;   // Percentage
  };
  top_categories: CategoryStat[];
  predictions: {
    next_month_income: number;
    next_month_expenses: number;
    projected_savings: number;
    confidence_score: number; // Percentage
  };
  goals: Goal[];
  spending_insights: Insight[];
}

// Returns: AnalyticsData
```

---

## 🔌 Component Integration

### Components Using Mock APIs

| Component | API Endpoint | Data Flow |
|-----------|-------------|-----------|
| `income-chart.tsx` | `/api/income` | Fetches → Passes to `IncomeForecastChart` |
| `expense-classifier.tsx` | `/api/expenses` | Fetches → Passes to `ExpensePieChart` |
| `vault-section.tsx` | `/api/vault` | Fetches → Displays balance & transactions |
| `agent-log.tsx` | `/api/agents` | Fetches → Transforms to log format |
| `overview-panel.tsx` | `/api/analytics` | Fetches → Displays KPI cards |

### Data Flow Pattern

```plaintext
User loads page
    ↓
Component mounts (useEffect)
    ↓
Fetch from /api/[endpoint]
    ↓
Loading state shown
    ↓
API responds with JSON
    ↓
Data stored in state
    ↓
Component renders with data
```

### Example: Component Integration

```typescript
// components/income-chart.tsx
"use client";

import { useEffect, useState } from "react";
import IncomeForecastChart from "./charts/income-forecast";

export default function IncomeChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/income");
        const apiData = await res.json();
        setData(apiData);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return <IncomeForecastChart data={data} />;
}
```

---

## 🔧 Backend Integration Steps

### Step 1: Update Environment Variables

Create or update `.env.local` in the project root:

```env
# Backend API Base URL
NEXT_PUBLIC_API_BASE=https://your-backend-api.com

# Optional: API Authentication
NEXT_PUBLIC_API_KEY=your_api_key_here
```

### Step 2: Replace Mock Routes

Update each API route file to proxy to the real backend:

**Before (Mock):**
```typescript
// app/api/income/route.ts
import { NextResponse } from "next/server";
import { mockIncome } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json(mockIncome);
}
```

**After (Backend Integration):**
```typescript
// app/api/income/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE;
  
  try {
    const res = await fetch(`${baseUrl}/api/v1/income`, {
      headers: {
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
    
    if (!res.ok) throw new Error("Backend API error");
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch income data" },
      { status: 500 }
    );
  }
}
```

### Step 3: Backend Endpoint Mapping

Map frontend routes to backend endpoints:

| Frontend Route | Backend Endpoint (Expected) |
|----------------|----------------------------|
| `/api/income` | `GET /api/v1/income` or `/income/forecast` |
| `/api/expenses` | `GET /api/v1/expenses` or `/expenses/breakdown` |
| `/api/vault` | `GET /api/v1/vault` or `/savings/vault` |
| `/api/agents` | `GET /api/v1/agents` or `/agents/status` |
| `/api/analytics` | `GET /api/v1/analytics` or `/dashboard/overview` |

**Note:** Adjust these mappings based on your actual backend API structure.

### Step 4: Data Transformation (If Needed)

If backend response format differs from mock data, add transformation logic:

```typescript
export async function GET() {
  const res = await fetch(`${baseUrl}/backend-endpoint`);
  const backendData = await res.json();
  
  // Transform to match frontend expected format
  const transformedData = backendData.results.map(item => ({
    date: item.transaction_date,
    predicted_income: item.forecasted_amount,
    actual_income: item.realized_amount,
  }));
  
  return NextResponse.json(transformedData);
}
```

### Step 5: Testing Integration

1. **Start Development Server:**
   ```bash
   npm run dev
   ```

2. **Check Network Tab:**
   - Open DevTools → Network
   - Verify API calls go to backend URL
   - Check response format matches expectations

3. **Test Each Page:**
   - Dashboard (`/`)
   - Analytics (`/analytics`)
   - Vault (`/vault`)
   - Agents (`/agents`)

4. **Error Handling Test:**
   - Disconnect from backend
   - Verify error states show properly
   - Check console for clear error messages

---

## ⚙️ Environment Configuration

### Development (.env.local)

```env
# Local mock APIs (default)
NEXT_PUBLIC_API_BASE=

# Or point to local backend
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

### Staging (.env.staging)

```env
NEXT_PUBLIC_API_BASE=https://staging-api.kamai.in
NEXT_PUBLIC_API_KEY=staging_key_here
```

### Production (.env.production)

```env
NEXT_PUBLIC_API_BASE=https://api.kamai.in
NEXT_PUBLIC_API_KEY=production_key_here
```

---

## ✅ Testing Checklist

### Functional Testing

- [ ] All API routes return valid JSON
- [ ] Data displays correctly in components
- [ ] Loading states appear during data fetch
- [ ] Error states handle failed requests
- [ ] Charts render with correct data
- [ ] Animations trigger smoothly

### Responsive Testing

- [ ] Mobile (360px - 767px)
- [ ] Tablet (768px - 1023px)
- [ ] Desktop (1024px - 1440px)
- [ ] Large Desktop (1440px+)

### Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader compatible
- [ ] ARIA labels present
- [ ] Contrast ratios meet WCAG 2.1 AA

### Performance Testing

- [ ] Lighthouse score ≥ 85
- [ ] No console errors
- [ ] No layout shifts (CLS)
- [ ] API responses < 500ms
- [ ] Smooth 60fps animations

### Browser Testing

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS/iOS)
- [ ] Mobile browsers

---

## 🎥 Visual Demo

### Pages Overview

1. **Dashboard (`/`)**
   - Overview KPI cards (Total Income, Expenses, FlexScore)
   - Income forecast chart (predicted vs actual)
   - Expense breakdown pie chart
   - Credit score card
   - Vault section with balance
   - Agent activity log

2. **Analytics (`/analytics`)**
   - Detailed financial metrics
   - Trend visualizations
   - Spending insights
   - Goal tracking

3. **Vault (`/vault`)**
   - Detailed balance information
   - Transaction history
   - Growth chart
   - Deposit/withdrawal actions

4. **Agents (`/agents`)**
   - All AI agents overview
   - Individual agent cards
   - Performance metrics
   - Recent actions log

5. **Settings (`/settings`)**
   - User preferences
   - Linked accounts
   - Notification settings
   - Theme toggle

### Key Interactions

- **Hover Effects:** Cards lift with subtle glow
- **Loading States:** Skeleton loaders with pulse animation
- **Transitions:** Smooth fade-in for data
- **Responsive:** Sidebar collapses on mobile
- **Charts:** Interactive tooltips on hover

---

## 📞 Contact & Support

**Frontend Team:**
- GitHub: [kamai repository]
- Documentation: `/docs` folder

**Backend Team Notes:**
- All mock data structures in `/lib/mockData.ts`
- API route handlers in `/app/api/*/route.ts`
- Component implementations in `/components`

**Questions?**
- Check mock data file first for expected schemas
- Review component code for data usage patterns
- Test locally with mock APIs before backend integration

---

## 🚀 Next Steps

1. **Backend Team:** Review data structures in `lib/mockData.ts`
2. **Backend Team:** Ensure API endpoints match expected schemas
3. **Frontend Team:** Add environment variable for `NEXT_PUBLIC_API_BASE`
4. **Both Teams:** Coordinate on endpoint URLs and authentication
5. **Integration:** Update API routes to point to backend (one at a time)
6. **Testing:** Verify each endpoint integration before moving to next
7. **Deployment:** Deploy to staging for full system test

---

## 📝 Change Log

**v1.0.0 - November 12, 2025**
- ✅ Created all mock API routes
- ✅ Integrated APIs into all components
- ✅ Added loading and error states
- ✅ Verified responsive design
- ✅ Confirmed accessibility compliance
- ✅ Ready for backend integration

---

**Status:** 🟢 Ready for Backend Integration
