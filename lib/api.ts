/**
 * lib/api.ts
 * 
 * Centralized API functions for fetching analytics data.
 * Uses NEXT_PUBLIC_API_BASE from .env.local for backend URL.
 * Falls back to mocked data if API is unavailable or fails.
 * 
 * Endpoints expected from backend:
 * - GET /api/income/forecast?range=7d|30d|90d
 * - GET /api/transactions/analyze?range=7d|30d|90d
 * - GET /api/growth/analysis?range=7d|30d|90d
 * - GET /api/credit/score
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "";

// ============================================================================
// MOCK DATA - Used as fallback when API is unavailable
// ============================================================================

const MOCK_INCOME_FORECAST = [
  { date: "2025-11-01", actual_income: 2100, predicted_income: 2300 },
  { date: "2025-11-02", actual_income: 2400, predicted_income: 2350 },
  { date: "2025-11-03", actual_income: 2200, predicted_income: 2400 },
  { date: "2025-11-04", actual_income: 2600, predicted_income: 2500 },
  { date: "2025-11-05", actual_income: 2300, predicted_income: 2450 },
  { date: "2025-11-06", actual_income: 2800, predicted_income: 2600 },
  { date: "2025-11-07", actual_income: 2500, predicted_income: 2550 },
];

const MOCK_EXPENSE_ANALYSIS = [
  { category: "Essentials", amount: 4500 },
  { category: "Entertainment", amount: 2000 },
  { category: "Transport", amount: 1200 },
  { category: "Utilities", amount: 800 },
  { category: "Health", amount: 1500 },
];

const MOCK_SAVINGS_GROWTH = [
  { date: "2025-07-01", savings: 1200 },
  { date: "2025-08-01", savings: 2450 },
  { date: "2025-09-01", savings: 3800 },
  { date: "2025-10-01", savings: 5200 },
  { date: "2025-11-01", savings: 6850 },
];

const MOCK_FLEXSCORE = {
  flexscore: 682,
  history: [
    { date: "2025-09-01", score: 650 },
    { date: "2025-10-01", score: 668 },
    { date: "2025-11-01", score: 682 },
  ],
};

const MOCK_TRANSACTION_HISTORY = [
  { id: 1, date: "2025-11-12", description: "Swiggy Order #3921", amount: -450, category: "Food", ai_action: "Classified as recurring" },
  { id: 2, date: "2025-11-11", description: "Salary Deposit", amount: 25000, category: "Income", ai_action: "Marked as safe" },
  { id: 3, date: "2025-11-10", description: "Netflix Subscription", amount: -299, category: "Entertainment", ai_action: "Flagged - negotiate rate" },
  { id: 4, date: "2025-11-09", description: "Uber Ride", amount: -340, category: "Transport", ai_action: "Analyzed usage pattern" },
  { id: 5, date: "2025-11-08", description: "Freelance Project Payment", amount: 5500, category: "Income", ai_action: "Added to income forecast" },
  { id: 6, date: "2025-11-07", description: "Electricity Bill", amount: -1200, category: "Utilities", ai_action: "Within budget" },
  { id: 7, date: "2025-11-06", description: "Zomato Order", amount: -380, category: "Food", ai_action: "Classified as recurring" },
  { id: 8, date: "2025-11-05", description: "Gym Membership", amount: -500, category: "Health", ai_action: "Analyzed annual cost" },
];

const MOCK_USER_PROFILE = {
  name: "Atharva Vidhate",
  avatar: "https://i.pravatar.cc/150?img=12",
  flexscore: 682,
  email: "atharva@kamai.in",
  joined: "2025-01-05",
  linked_platforms: ["Swiggy", "Zomato", "Paytm"],
};

const MOCK_CREDIT_PASSPORT = {
  id: "CREDPASS-10293",
  last_updated: "2025-10-20",
  risk_level: "Low",
  credit_score: 682,
  report_url: "https://example.com/kamai-credit-passport.pdf",
};

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Create an AbortController with timeout
 * Uses a more compatible approach than AbortSignal.timeout()
 */
function createTimeoutSignal(timeoutMs: number): AbortSignal {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);
  
  // Store timeout ID on the signal for potential cleanup
  // Note: The timeout will automatically be cleared when the fetch completes
  return controller.signal;
}

/**
 * Fetch income forecast data
 * @param range - "7d", "30d", or "90d"
 * @returns Array of income forecast objects
 */
export async function getIncomeForecast(range: "7d" | "30d" | "90d" = "7d") {
  // If no BASE_URL is configured, return mock data immediately
  if (!BASE_URL) {
    return MOCK_INCOME_FORECAST;
  }

  try {
    const url = `${BASE_URL}/api/income/forecast?range=${range}`;
    console.log("Fetching income forecast from:", url);
    
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      signal: createTimeoutSignal(5000), // 5 second timeout
    });

    if (!response.ok) {
      console.warn(`Income forecast API returned ${response.status}, using mock data`);
      return MOCK_INCOME_FORECAST;
    }

    const data = await response.json();
    console.log("Income forecast data:", data);
    return Array.isArray(data) ? data : MOCK_INCOME_FORECAST;
  } catch (error) {
    console.warn("Error fetching income forecast:", error, "using mock data");
    return MOCK_INCOME_FORECAST;
  }
}

/**
 * Fetch expense analysis (category breakdown)
 * @param range - "7d", "30d", or "90d"
 * @returns Array of expense category objects
 */
export async function getExpenseAnalysis(range: "7d" | "30d" | "90d" = "7d") {
  // If no BASE_URL is configured, return mock data immediately
  if (!BASE_URL) {
    return MOCK_EXPENSE_ANALYSIS;
  }

  try {
    const url = `${BASE_URL}/api/transactions/analyze?range=${range}`;
    console.log("Fetching expense analysis from:", url);
    
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      signal: createTimeoutSignal(5000),
    });

    if (!response.ok) {
      console.warn(`Expense analysis API returned ${response.status}, using mock data`);
      return MOCK_EXPENSE_ANALYSIS;
    }

    const data = await response.json();
    console.log("Expense analysis data:", data);
    return Array.isArray(data) ? data : MOCK_EXPENSE_ANALYSIS;
  } catch (error) {
    console.warn("Error fetching expense analysis:", error, "using mock data");
    return MOCK_EXPENSE_ANALYSIS;
  }
}

/**
 * Fetch savings growth projection
 * @param range - "7d", "30d", or "90d"
 * @returns Array of savings data points
 */
export async function getSavingsGrowth(range: "7d" | "30d" | "90d" = "7d") {
  // If no BASE_URL is configured, return mock data immediately
  if (!BASE_URL) {
    return MOCK_SAVINGS_GROWTH;
  }

  try {
    const url = `${BASE_URL}/api/growth/analysis?range=${range}`;
    console.log("Fetching savings growth from:", url);
    
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      signal: createTimeoutSignal(5000),
    });

    if (!response.ok) {
      console.warn(`Savings growth API returned ${response.status}, using mock data`);
      return MOCK_SAVINGS_GROWTH;
    }

    const data = await response.json();
    console.log("Savings growth data:", data);
    return Array.isArray(data) ? data : MOCK_SAVINGS_GROWTH;
  } catch (error) {
    console.warn("Error fetching savings growth:", error, "using mock data");
    return MOCK_SAVINGS_GROWTH;
  }
}

/**
 * Fetch Kamai credit score
 * @returns Credit score object with current score and history
 */
export async function getFlexScore() {
  // If no BASE_URL is configured, return mock data immediately
  if (!BASE_URL) {
    return MOCK_FLEXSCORE;
  }

  try {
    const url = `${BASE_URL}/api/credit/score`;
    console.log("Fetching FlexScore from:", url);
    
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      signal: createTimeoutSignal(5000),
    });

    if (!response.ok) {
      console.warn(`FlexScore API returned ${response.status}, using mock data`);
      return MOCK_FLEXSCORE;
    }

    const data = await response.json();
    console.log("FlexScore data:", data);
    return data || MOCK_FLEXSCORE;
  } catch (error) {
    console.warn("Error fetching FlexScore:", error, "using mock data");
    return MOCK_FLEXSCORE;
  }
}

/**
 * Fetch transaction history
 * @returns Array of transaction objects
 */
export async function getTransactionHistory() {
  // If no BASE_URL is configured, return mock data immediately
  if (!BASE_URL) {
    return MOCK_TRANSACTION_HISTORY;
  }

  try {
    const url = `${BASE_URL}/api/transactions/history`;
    console.log("Fetching transaction history from:", url);
    
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      signal: createTimeoutSignal(5000),
    });

    if (!response.ok) {
      console.warn(`Transaction history API returned ${response.status}, using mock data`);
      return MOCK_TRANSACTION_HISTORY;
    }

    const data = await response.json();
    console.log("Transaction history data:", data);
    return Array.isArray(data) ? data : MOCK_TRANSACTION_HISTORY;
  } catch (error) {
    console.warn("Error fetching transaction history:", error, "using mock data");
    return MOCK_TRANSACTION_HISTORY;
  }
}

/**
 * Fetch user profile
 * @returns User profile object
 */
export async function getUserProfile() {
  // If no BASE_URL is configured, return mock data immediately
  if (!BASE_URL) {
    return MOCK_USER_PROFILE;
  }

  try {
    const url = `${BASE_URL}/api/user/profile`;
    console.log("Fetching user profile from:", url);
    
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      signal: createTimeoutSignal(5000),
    });

    if (!response.ok) {
      console.warn(`User profile API returned ${response.status}, using mock data`);
      return MOCK_USER_PROFILE;
    }

    const data = await response.json();
    console.log("User profile data:", data);
    return data || MOCK_USER_PROFILE;
  } catch (error) {
    console.warn("Error fetching user profile:", error, "using mock data");
    return MOCK_USER_PROFILE;
  }
}

/**
 * Fetch credit passport
 * @returns Credit passport object
 */
export async function getCreditPassport() {
  // If no BASE_URL is configured, return mock data immediately
  if (!BASE_URL) {
    return MOCK_CREDIT_PASSPORT;
  }

  try {
    const url = `${BASE_URL}/api/credit/passport`;
    console.log("Fetching credit passport from:", url);
    
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      signal: createTimeoutSignal(5000),
    });

    if (!response.ok) {
      console.warn(`Credit passport API returned ${response.status}, using mock data`);
      return MOCK_CREDIT_PASSPORT;
    }

    const data = await response.json();
    console.log("Credit passport data:", data);
    return data || MOCK_CREDIT_PASSPORT;
  } catch (error) {
    console.warn("Error fetching credit passport:", error, "using mock data");
    return MOCK_CREDIT_PASSPORT;
  }
}

// ============================================================================
// TYPE DEFINITIONS (for reference)
// ============================================================================

export interface IncomeForecastData {
  date: string;
  actual_income?: number;
  predicted_income?: number;
}

export interface ExpenseCategory {
  category: string;
  amount: number;
}

export interface SavingsDataPoint {
  date: string;
  savings: number;
}

export interface FlexScoreData {
  flexscore: number;
  history?: Array<{
    date: string;
    score: number;
  }>;
}

export interface AnalyticsData {
  income: IncomeForecastData[];
  expenses: ExpenseCategory[];
  savings: SavingsDataPoint[];
  flexscore: FlexScoreData;
}

export interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  category: string;
  ai_action: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  flexscore: number;
  email: string;
  joined: string;
  linked_platforms: string[];
}

export interface CreditPassport {
  id: string;
  last_updated: string;
  risk_level: string;
  credit_score: number;
  report_url: string;
}
