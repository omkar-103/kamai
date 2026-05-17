// lib/responses.ts

// Remove thinking tags from AI responses
export function removeThinkTags(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
}

// Predefined responses for common questions
const predefinedResponses: { [key: string]: string } = {
  'who created you': 'I was built by the Kamai team to help gig workers and freelancers in India achieve real financial stability through intelligent automation.',
  'what can you do': 'I can help you track income across platforms, optimize tax savings, manage expenses, build your credit profile, and forecast earnings. What would you like to explore?',
  'hello': 'Hello! I\'m Kamai AI — your intelligent financial advisor built to help India\'s flexible workforce achieve financial stability. What can I help you with today?',
  'hi': 'Hi there! Ready to optimize your income and build financial resilience? Ask me about taxes, expenses, or income forecasting.',
  'how to save tax': 'Key tax-saving strategies: 1) Track all fuel/maintenance expenses 2) Claim phone/internet bills 3) Use Section 44ADA for 50% deemed expenses 4) Keep all platform payment records. Want specific calculations?',
  'best platform': 'Platform earnings vary by city and time. Generally: food delivery peaks during meals (11am-2pm, 7pm-10pm), ride-sharing during office hours. Multi-apping can increase income by 30-40%.',
  'thank you': 'You\'re welcome! Kamai is here for every step of your financial journey. Let me know if you need more help.',
  'bye': 'Goodbye! Remember to track those expenses for maximum tax savings. Kamai\'s always here when you need financial clarity.',
};

export function getPredefinedResponse(message: string): string | null {
  const msg = message.toLowerCase().trim();
  for (const [key, response] of Object.entries(predefinedResponses)) {
    if (msg.includes(key)) {
      return response;
    }
  }
  return null;
}

// Fallback responses when AI services are unavailable
const fallbackResponses = [
  "I understand you need help with your finances. Could you be more specific about what you'd like to know?",
  "Let me help you optimize your earnings and financial health. What specific area would you like to focus on — income, expenses, taxes, or credit building?",
  "I'm here to help with your financial planning. Try asking about income tracking, tax savings, or expense management.",
  "As your Kamai AI financial advisor, I can assist with platform comparisons, tax calculations, or expense tracking. What interests you?",
  "Great question! Could you provide more details so I can give you the most accurate financial guidance?",
];

export function getRandomFallback(): string {
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}
