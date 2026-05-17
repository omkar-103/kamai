// app/api/chat/route.js
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import connectDB from '@/lib/mongodb';
import ChatMessage from '@/lib/models/ChatMessage';
import User from '@/lib/models/User';
import Income from '@/lib/models/Income';

// Environment variables
const DEBUG = process.env.DEBUG === 'true';
const BYTEZ_API_KEY = process.env.BYTEZ_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const BYTEZ_API_URL = process.env.BYTEZ_API_URL || 'https://api.bytez.com/models/v2/openai/v1';
const GEMINI_API_URL = process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// System prompt for AI
const SYSTEM_PROMPT = "You are Kamai AI, an intelligent financial stability advisor for India's gig workers, freelancers, and people with irregular income. IMPORTANT: Keep responses concise (2-3 sentences max) unless asked for details. Focus on income forecasting, tax optimization, expense management, credit building, and long-term financial growth in INR. You represent Kamai — a serious India-first fintech startup. Never mention FlexFlow or Team Invisible No More.";

// Logging functions
function log(...args) {
    if (DEBUG) {
        console.log('[CHAT API]', new Date().toISOString(), ...args);
    }
}

function logError(...args) {
    console.error('[CHAT API ERROR]', new Date().toISOString(), ...args);
}

// Intent classification with proper agent types
function classifyIntent(message) {
  const msg = message.toLowerCase();
  
  if (msg.includes('income') || msg.includes('earning') || msg.includes('forecast') || msg.includes('salary')) {
    return { intent: 'income_query', agent: 'income' };
  }
  if (msg.includes('expense') || msg.includes('spending') || msg.includes('budget') || msg.includes('cost')) {
    return { intent: 'expense_query', agent: 'defense' };
  }
  if (msg.includes('credit') || msg.includes('loan') || msg.includes('score') || msg.includes('emi')) {
    return { intent: 'credit_query', agent: 'credit' };
  }
  if (msg.includes('save') || msg.includes('vault') || msg.includes('savings') || msg.includes('deposit')) {
    return { intent: 'savings_query', agent: 'defense' };
  }
  if (msg.includes('grow') || msg.includes('platform') || msg.includes('skill') || msg.includes('improve')) {
    return { intent: 'growth_query', agent: 'growth' };
  }
  
  return { intent: 'general', agent: 'general' };
}

// Generate database-based response with enhanced data
async function generateDatabaseResponse(userId, intent, agent, message) {
  try {
    const user = await User.findById(userId).lean();
    
    if (!user) {
      log('User not found, using default responses');
    }
    
    switch (intent) {
      case 'income_query': {
        const recentIncome = await Income.find({
          userId,
          date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }).lean();
        
        const total = recentIncome.reduce((sum, i) => sum + i.amount, 0);
        const platformBreakdown = recentIncome.reduce((acc, i) => {
          acc[i.source] = (acc[i.source] || 0) + i.amount;
          return acc;
        }, {});
        
        const topPlatform = Object.entries(platformBreakdown)
          .sort(([,a], [,b]) => b - a)[0];
        
        if (total > 0) {
          return `Last 7 days earnings: ₹${total.toLocaleString('en-IN')}. Daily average: ₹${Math.round(total / 7).toLocaleString('en-IN')}. ${topPlatform ? `${topPlatform[0]} is your top earner with ₹${topPlatform[1].toLocaleString('en-IN')}.` : ''} Need tips to increase earnings?`;
        } else {
          return `No recent income recorded. Start tracking your earnings to get insights. Your monthly income target is ₹${user?.monthlyIncome?.toLocaleString('en-IN') || '25,000'}. Want help setting up tracking?`;
        }
      }
      
      case 'credit_query': {
        const score = user?.creditScore || 650;
        let advice = '';
        if (score < 700) {
          advice = 'Regular income tracking and timely bill payments can improve your score.';
        } else if (score < 750) {
          advice = 'Good score! Consider a secured credit card to boost it further.';
        } else {
          advice = 'Excellent score! You may qualify for pre-approved loans.';
        }
        return `Your credit score is ${score}. ${advice} Need specific tips?`;
      }
      
      case 'savings_query': {
        const vaultBalance = user?.vaultBalance || 0;
        const totalSavings = user?.totalSavings || 0;
        const monthlyIncome = user?.monthlyIncome || 25000;
        const savingsRate = monthlyIncome > 0 ? (vaultBalance / monthlyIncome * 100).toFixed(1) : 0;
        
        return `Vault balance: ₹${vaultBalance.toLocaleString('en-IN')} (${savingsRate}% of monthly income). Total lifetime savings: ₹${totalSavings.toLocaleString('en-IN')}. ${vaultBalance < monthlyIncome * 0.2 ? 'Tip: Try to save 20% for emergencies.' : 'Great job maintaining emergency funds!'}`;
      }
      
      case 'growth_query': {
        const platforms = user?.workDetails?.platforms || [];
        const currentPlatforms = platforms.length || 0;
        
        let suggestion = '';
        if (currentPlatforms === 0) {
          suggestion = 'Start with Swiggy or Zomato during peak meal hours for best earnings.';
        } else if (currentPlatforms === 1) {
          suggestion = 'Adding a second platform can increase income by 30-40%. Consider Uber for non-meal hours.';
        } else {
          suggestion = 'You\'re multi-apping well! Focus on peak hours: 11am-2pm and 7pm-10pm for food delivery.';
        }
        
        return `Active on ${currentPlatforms} platform(s): ${platforms.join(', ') || 'None tracked'}. ${suggestion}`;
      }
      
      case 'expense_query': {
        const monthlyIncome = user?.monthlyIncome || 25000;
        const estimatedExpenses = monthlyIncome * 0.6; // Assuming 60% expense ratio
        
        return `Estimated monthly expenses: ₹${estimatedExpenses.toLocaleString('en-IN')}. Track fuel, phone bills, and maintenance for tax deductions up to 50% under Section 44ADA. Need expense tracking help?`;
      }
      
      default:
        return null; // Let AI handle general queries
    }
  } catch (error) {
    logError('Database response error:', error);
    return null; // Fallback to AI
  }
}

function removeThinkTags(text) {
  if (!text || typeof text !== "string") return text;

  // Only remove if the tag exists
  if (text.includes("<think>")) {
    return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  }

  return text.trim();
}

// Predefined responses
const predefinedResponses = {
  'who created you': 'I was built by the Kamai team to help India\'s flexible workforce achieve real financial stability through intelligent AI.',
  'what can you do': 'I can track your income across platforms, optimize tax savings, manage expenses, build your credit profile, and forecast earnings. What would you like to explore?',
  'hello': 'Hello! I\'m Kamai AI — your intelligent financial advisor. Ready to help you achieve financial stability. How can I assist?',
  'hi': 'Hi there! I\'m your Kamai AI financial advisor. Ask me about income, taxes, credit building, or savings.',
  'how to save tax': 'Key tax-saving strategies: Track fuel/maintenance (deductible), use Section 44ADA for 50% deemed expenses, keep platform payment records, claim phone/internet bills. Want calculations?',
  'best platform': 'Platform earnings vary: Food delivery peaks 11am-2pm & 7pm-10pm. Ride-sharing best during office hours. Weekend surge pricing can boost income 20-30%.',
  'thank you': 'You\'re welcome! Kamai is here for every step of your financial journey. Anything else?',
  'thanks': 'Happy to help! Remember to update your income daily for accurate insights and better credit tracking.',
  'bye': 'Goodbye! Don\'t forget to log today\'s earnings. Kamai is always here for your financial clarity.',
  'help': 'I can help with: 1) Income tracking & forecasting 2) Tax-saving strategies 3) Expense management 4) Credit profile building 5) Platform optimization. What interests you?'
};

function getPredefinedResponse(message) {
  const msg = message.toLowerCase().trim();
  for (const [key, response] of Object.entries(predefinedResponses)) {
    if (msg.includes(key)) {
      return response;
    }
  }
  return null;
}

// Try Bytez API
async function tryBytez(messages) {
  const startTime = Date.now();
  log('🔵 Attempting Bytez API...');

  if (!BYTEZ_API_KEY) {
    throw new Error('BYTEZ_API_KEY not configured');
  }

  const client = new OpenAI({
    apiKey: BYTEZ_API_KEY,
    baseURL: BYTEZ_API_URL,
    timeout: 10000,
  });

  try {
    const messagesWithSystem = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];

    const response = await client.chat.completions.create({
      model: 'Qwen/Qwen3-4B',
      messages: messagesWithSystem,
      max_tokens: 800,
      temperature: 0.7,
    });

    const reply = response.choices[0]?.message?.content;
    if (!reply) throw new Error('Empty response from Bytez');

    const endTime = Date.now();
    log(`✅ Bytez succeeded in ${endTime - startTime}ms`);
    return removeThinkTags(reply);
  } catch (error) {
    const endTime = Date.now();
    logError(`❌ Bytez failed in ${endTime - startTime}ms:`, error.message);
    throw error;
  }
}

// Try Gemini API
async function tryGemini(messages) {
  const startTime = Date.now();
  log('🟢 Attempting Gemini API...');

  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  try {
    const messagesWithSystem = [...messages];
    if (messagesWithSystem.length > 0 && messagesWithSystem[0].role === 'user') {
      messagesWithSystem[0] = {
        ...messagesWithSystem[0],
        content: SYSTEM_PROMPT + '\n\n' + messagesWithSystem[0].content
      };
    }

    const contents = messagesWithSystem
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!reply) throw new Error('Empty response from Gemini');

    const endTime = Date.now();
    log(`✅ Gemini succeeded in ${endTime - startTime}ms`);
    return removeThinkTags(reply);
  } catch (error) {
    const endTime = Date.now();
    logError(`❌ Gemini failed in ${endTime - startTime}ms:`, error.message);
    throw error;
  }
}

// Fallback responses
const fallbackResponses = [
  "I can help you track income, save on taxes, and build your credit profile. What specific area interests you?",
  "Let me assist with your financial journey. Try asking about income forecasting, tax optimization, or credit building.",
  "I'm Kamai AI — your intelligent financial advisor. Ask me about income stability, tax savings, or expense tracking.",
  "Need help? I can analyze your earnings, suggest tax deductions, or guide your financial growth strategy.",
];

function getRandomFallback() {
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

// GET endpoint - fetch chat history
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || '674d9a1e5f8c2a001234abcd';
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const messages = await ChatMessage.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    
    return NextResponse.json({ 
      success: true, 
      data: messages.reverse() 
    });
  } catch (error) {
    logError('Error fetching chat messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages', details: DEBUG ? error.message : undefined },
      { status: 500 }
    );
  }
}

// POST endpoint - handle chat
export async function POST(request) {
  const requestStartTime = Date.now();
  log('📨 Received chat request');

  try {
    await connectDB();
    
    const body = await request.json();
    const { messages, userId = '674d9a1e5f8c2a001234abcd', content } = body;

    // Handle both formats
    let userContent;
    let messageHistory;
    
    if (content) {
      // Legacy format with single content
      userContent = content;
      messageHistory = [{ role: 'user', content }];
    } else if (messages && Array.isArray(messages) && messages.length > 0) {
      // New format with message history
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role !== 'user') {
        return NextResponse.json(
          { error: 'Last message must be from user' },
          { status: 400 }
        );
      }
      userContent = lastMessage.content;
      messageHistory = messages;
    } else {
      return NextResponse.json(
        { error: 'Invalid request: messages or content required' },
        { status: 400 }
      );
    }

    log(`Processing message for user: ${userId}`);
    log(`User message: "${userContent.substring(0, 100)}..."`);

    // Classify intent
    const { intent, agent } = classifyIntent(userContent);
    log(`Intent: ${intent}, Agent: ${agent}`);

    // Create context object for tracking
    const context = {
      timestamp: new Date(),
      platform: 'web',
      sessionId: Math.random().toString(36).substring(7)
    };

    // Save user message to database
    const userMessage = await ChatMessage.create({
      userId,
      role: 'user',
      content: userContent,
      intent,
      agentType: agent,
      context
    });

    let reply;
    let provider = 'unknown';

    // Response generation pipeline
    try {
      // 1. Check predefined responses
      const predefinedReply = getPredefinedResponse(userContent);
      if (predefinedReply) {
        log('✅ Using predefined response');
        reply = predefinedReply;
        provider = 'predefined';
      } else {
        // 2. Try database response for specific queries
        const dbResponse = await generateDatabaseResponse(userId, intent, agent, userContent);
        
        if (dbResponse) {
          log('✅ Using database response');
          reply = dbResponse;
          provider = 'database';
        } else {
          // 3. Try AI APIs for general queries
          try {
            reply = await tryBytez(messageHistory);
            provider = 'bytez';
          } catch (bytezError) {
            log('⚠️  Bytez failed, trying Gemini...');
            
            try {
              reply = await tryGemini(messageHistory);
              provider = 'gemini';
            } catch (geminiError) {
              logError('❌ All AI services failed');
              reply = getRandomFallback();
              provider = 'fallback';
            }
          }
        }
      }
    } catch (unexpectedError) {
      logError('Unexpected error in response generation:', unexpectedError);
      reply = getRandomFallback();
      provider = 'fallback';
    }

    // Save assistant message to database
    const assistantMessage = await ChatMessage.create({
      userId,
      role: 'assistant',
      content: reply,
      intent,
      agentType: agent,
      context: { ...context, provider }
    });

    const requestEndTime = Date.now();
    log(`✅ Request completed in ${requestEndTime - requestStartTime}ms using ${provider}`);

    // Return response
    return NextResponse.json({
      success: true,
      reply,
      provider,
      data: {
        userMessage: {
          _id: userMessage._id,
          content: userMessage.content,
          role: userMessage.role,
          createdAt: userMessage.createdAt
        },
        assistantMessage: {
          _id: assistantMessage._id,
          content: assistantMessage.content,
          role: assistantMessage.role,
          createdAt: assistantMessage.createdAt
        }
      }
    });

  } catch (error) {
    const requestEndTime = Date.now();
    logError(`💥 Fatal error in ${requestEndTime - requestStartTime}ms:`, error);

    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred',
        details: DEBUG ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}