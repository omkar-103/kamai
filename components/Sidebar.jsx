// components/Sidebar.jsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, BarChart3, Brain, Clock, User, Settings,
  X, ChevronLeft, ChevronRight, TrendingUp, Shield, PiggyBank,
  Sparkles, Gem, Star, Activity, Zap, Bell, HelpCircle,
  LogOut, Moon, Sun, IndianRupee, Award, Target, MessageSquare,
  ScanLine, Upload, Loader2, Bot, Users, Lock, CheckCircle, Send
} from 'lucide-react';
import Tesseract from 'tesseract.js';

// --- PREDEFINED Q&A DATABASE ---
const predefinedResponses = {
  "who made you": "I was created by the Kamai team to help gig workers and freelancers in India manage their finances smarter and achieve financial stability.",
  "who created you": "I was built by the Kamai team — a group of engineers and designers passionate about financial inclusion for India's flexible workforce.",
  "who is your creator": "Kamai was founded by Omkar Parelkar and the core team. I'm the embedded AI assistant built to help you navigate your financial journey.",
  "who built kamai": "Kamai was built by a passionate team focused on solving real financial challenges for India's 77M+ gig workers, freelancers, and independent professionals.",
  "company behind kamai": "Kamai is an AI-first fintech startup built for India's flexible workforce — gig workers, freelancers, and anyone with irregular income seeking financial stability.",
  "about kamai": "Kamai is an AI-powered financial stability platform that helps India's flexible workforce predict income, manage spending, build creditworthiness, and achieve long-term financial growth.",
  "what is kamai": "Kamai is an AI-powered financial stability platform created for India's gig workers and freelancers. It helps you predict income, control expenses, build credit, and grow your wealth.",
  "how can kamai help me": "Kamai helps you: 1) Predict and track earnings across platforms, 2) Save on taxes with smart deduction tracking, 3) Automatically scan and categorize receipts, 4) Get AI-powered financial insights, 5) Build an emergency fund and credit profile.",
  "tax savings": "Kamai can help you save significantly on taxes through automatic expense tracking, GST compliance, receipt scanning, and smart deduction recommendations — all AI-powered.",
  "pricing": "Kamai offers flexible plans: Starter (Free) for essential tracking, Growth (₹299/month) with full AI features, and Pro (₹999/month) for teams. All plans include a 30-day free trial.",
  "supported platforms": "Kamai integrates with all major gig platforms including Swiggy, Zomato, Uber, Ola, Rapido, Dunzo, Amazon Flex, Blinkit, and 15+ other platforms. Earnings data syncs automatically.",
  "contact": "You can reach the Kamai team at support@kamai.in. For immediate help, use this in-app chat assistant.",
  "security": "Kamai uses bank-level 256-bit encryption, is RBI-compliant, and follows strict data privacy standards. Your financial data is never sold or shared.",
  "hello": "Hello! I'm Kamai's AI assistant. How can I help you optimize your income, reduce expenses, or build your financial profile today?",
  "hi": "Hi there! I'm Kamai AI — built to help gig workers and freelancers like you maximize earnings and achieve financial stability. What would you like to explore?",
  "help": "I can help you with: tax savings strategies, expense tracking, receipt scanning, platform integrations, income forecasting, credit building, and financial planning. What would you like to know?",
  "thanks": "You're welcome! Kamai is here to support every step of your financial journey. Feel free to ask anything.",
  "thank you": "My pleasure! Kamai's mission is to help you achieve real financial stability. Is there anything else you'd like to explore?"
};

// --- FALLBACK RESPONSES ---
const fallbackResponses = [
  "I understand you're looking for financial guidance. Kamai offers comprehensive tools for gig workers and freelancers. Could you be more specific about what you'd like to know?",
  "Great question! Kamai's AI can help with income forecasting, tax optimization, expense categorization, and credit building. What area would you like to explore?",
  "I'm here to help with all your financial queries. Kamai specializes in income stability, tax savings, and wealth building for India's flexible workforce. What would you like to know more about?",
  "Kamai's intelligent platform is built to address exactly these kinds of financial challenges. Let me help you find the right solution.",
  "Thanks for your question! As your Kamai AI advisor, I'm designed to give you the most accurate and actionable financial guidance. Could you share a bit more context?"
];

// --- Helper function to get predefined response ---
const getPredefinedResponse = (message) => {
  const lowerMessage = message.toLowerCase().trim();
  for (const [key, response] of Object.entries(predefinedResponses)) {
    if (lowerMessage.includes(key) || lowerMessage === key) {
      return response;
    }
  }
  return null;
};

// --- Helper function to get random fallback ---
const getRandomFallback = () => {
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
};

// --- API call to backend chat endpoint ---
const callChatAPI = async (messages) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to get response');
    }

    return data.reply;
  } catch (error) {
    console.error('Chat API error:', error);
    return null;
  }
};

// --- INTELLIGENT CHAT HANDLER ---
const getAIResponse = async (userMessage, history) => {
  const predefinedReply = getPredefinedResponse(userMessage);
  if (predefinedReply) {
    return predefinedReply;
  }

  const apiMessages = history.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
  apiMessages.push({ role: 'user', content: userMessage });

  const apiResponse = await callChatAPI(apiMessages);
  if (apiResponse) {
    return apiResponse;
  }

  return getRandomFallback();
};

// --- AI MODAL COMPONENT ---
const AIModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hello! I\'m Kamai\'s AI advisor — your intelligent financial co-pilot. Ask me about income forecasting, tax savings, expense tracking, or anything about your financial journey!' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ESC key handler
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Parse receipt text function
  const parseReceiptText = (text) => {
    const result = {
      merchant: 'Unknown Merchant',
      amount: '₹0.00',
      date: new Date().toLocaleDateString(),
      category: 'Other',
      items: [],
      tax: '₹0.00',
      tax_deductible: false,
      confidence: 'Low'
    };

    if (!text || text.length < 10) {
      result.error = 'Could not extract text from image. Please try with a clearer image.';
      return result;
    }

    const cleanText = text.replace(/\s+/g, ' ').trim();
    const lines = text.split('\n').filter(line => line.trim());

    if (lines.length > 0) {
      result.merchant = lines[0].trim().substring(0, 50);
    }

    const amountPatterns = [
      /(?:total|grand total|net total|amount|bill amount|net amount)[\s:]*(?:rs\.?|₹|inr)?\s*([0-9,]+\.?\d*)/gi,
      /(?:rs\.?|₹|inr)\s*([0-9,]+\.?\d*)/gi,
      /([0-9,]+\.?\d*)\s*(?:rs\.?|₹|inr)/gi,
      /\b([0-9]{1,}[,\d]*\.?\d{0,2})\b(?=.*(?:total|amount|due|payable))/gi
    ];

    let maxAmount = 0;
    for (const pattern of amountPatterns) {
      const matches = [...cleanText.matchAll(pattern)];
      for (const match of matches) {
        const amount = parseFloat(match[1].replace(/,/g, ''));
        if (!isNaN(amount) && amount > maxAmount) {
          maxAmount = amount;
        }
      }
    }

    if (maxAmount > 0) {
      result.amount = `₹${maxAmount.toFixed(2)}`;
      result.confidence = 'High';
    }

    const datePatterns = [
      /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/g,
      /(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{2,4})/gi,
      /(\d{4}[-/]\d{1,2}[-/]\d{1,2})/g
    ];

    for (const pattern of datePatterns) {
      const dateMatch = cleanText.match(pattern);
      if (dateMatch) {
        result.date = dateMatch[0];
        break;
      }
    }

    const taxPatterns = [
      /(?:gst|cgst|sgst|igst|tax)[\s:]*(?:rs\.?|₹)?\s*([0-9,]+\.?\d*)/gi,
      /tax[\s:]*([0-9,]+\.?\d*)%/gi
    ];

    for (const pattern of taxPatterns) {
      const taxMatch = cleanText.match(pattern);
      if (taxMatch) {
        const taxAmount = parseFloat(taxMatch[1].replace(/,/g, ''));
        if (!isNaN(taxAmount)) {
          result.tax = `₹${taxAmount.toFixed(2)}`;
          break;
        }
      }
    }

    const categoryKeywords = {
      'Food': ['food', 'restaurant', 'cafe', 'pizza', 'burger', 'meal', 'dining', 'swiggy', 'zomato', 'uber eats'],
      'Fuel': ['fuel', 'petrol', 'diesel', 'gas', 'cng', 'hp', 'bharat', 'indian oil', 'shell'],
      'Transport': ['uber', 'ola', 'rapido', 'taxi', 'cab', 'auto', 'transport'],
      'Shopping': ['amazon', 'flipkart', 'myntra', 'mall', 'store', 'market', 'mart'],
      'Maintenance': ['repair', 'service', 'maintenance', 'spare', 'parts']
    };

    const lowerText = cleanText.toLowerCase();
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        result.category = category;
        break;
      }
    }

    const itemPatterns = [
      /(\d+)\s*x?\s*([a-zA-Z\s]+?)\s+(?:rs\.?|₹)?\s*([0-9,]+\.?\d*)/gi,
      /([a-zA-Z\s]+?)\s+(?:rs\.?|₹)\s*([0-9,]+\.?\d*)/gi
    ];

    const itemMatches = [...cleanText.matchAll(itemPatterns[0])];
    if (itemMatches.length > 0) {
      itemMatches.slice(0, 5).forEach(match => {
        result.items.push(`${match[1]}x ${match[2].trim()} - ₹${match[3]}`);
      });
    } else {
      const simpleItems = [...cleanText.matchAll(itemPatterns[1])];
      simpleItems.slice(0, 3).forEach(match => {
        result.items.push(`${match[1].trim()} - ₹${match[2]}`);
      });
    }

    if (result.items.length === 0) {
      result.items.push('Items not clearly identified');
    }

    const deductibleCategories = ['Fuel', 'Transport', 'Maintenance', 'Food'];
    result.tax_deductible = deductibleCategories.includes(result.category) && maxAmount > 0;

    return result;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const reply = await getAIResponse(userMsg, messages);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      console.error("Error getting response:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I apologize for the inconvenience. There seems to be a technical issue. Kamai is committed to providing you the best financial guidance. Please try again or contact support@kamai.in" 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image under 5MB");
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage({
        src: reader.result,
        base64: reader.result.split(',')[1],
        type: file.type
      });
      setScanResult(null);
      setExtractedText('');
      setOcrProgress(0);
    };
    reader.readAsDataURL(file);
  };

  const handleScan = async () => {
    if (!selectedImage) return;
    
    setIsScanning(true);
    setExtractedText('');
    setOcrProgress(0);

    try {
      const result = await Tesseract.recognize(
        selectedImage.src,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              const progress = Math.round(m.progress * 100);
              setOcrProgress(progress);
            }
          }
        }
      );

      const text = result.data.text;
      setExtractedText(text);
      const parsed = parseReceiptText(text);
      setScanResult(parsed);

    } catch (error) {
      console.error('OCR Error:', error);
      setScanResult({
        merchant: 'Sample Store (OCR Failed)',
        amount: '₹250.00',
        date: new Date().toLocaleDateString(),
        category: 'Food',
        items: ['Unable to extract items', 'Please try with better lighting'],
        tax: '₹25.00',
        tax_deductible: true,
        error: 'OCR failed. This is sample data. Please try with a clearer image or better lighting.',
        confidence: 'Low'
      });
      setExtractedText('OCR failed to extract text. Please ensure the image is clear and well-lit.');
    } finally {
      setIsScanning(false);
      setOcrProgress(0);
    }
  };

  const discussWithAI = () => {
    if (!scanResult) return;
    
    const receiptMessage = `I scanned a receipt from ${scanResult.merchant} for ${scanResult.amount} dated ${scanResult.date}. Category: ${scanResult.category}. ${scanResult.tax_deductible ? 'This appears to be tax deductible.' : ''} Can you help me understand how this affects my taxes?`;
    
    setActiveTab('chat');
    setMessages(prev => [...prev, { role: 'user', content: receiptMessage }]);
    setIsTyping(true);
    
    setTimeout(() => {
      const aiResponse = `Great! I've analyzed your receipt from ${scanResult.merchant}. ${scanResult.tax_deductible ? 
        `This ${scanResult.category} expense for ${scanResult.amount} is tax deductible! You can claim this to reduce your taxable income. Make sure to keep this receipt for filing.` :
        `This ${scanResult.category} expense of ${scanResult.amount} is recorded. While not directly tax deductible, tracking all expenses helps with financial planning.`
      } Would you like me to explain more about maximizing your tax deductions?`;
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative bg-gradient-to-br from-[#0B0F19] via-[#080715] to-[#0B0F19] border border-white/10 rounded-3xl shadow-[0_0_100px_rgba(123,107,255,0.3)] w-full max-w-5xl h-[700px] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#080715]/80 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] p-[1px]">
              <div className="w-full h-full bg-[#080715] rounded-2xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Kamai Intelligence</h3>
              <p className="text-xs text-[#1BD4CA]">Powered by AI • Press ESC to close</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all">
            <X className="w-6 h-6 text-white/60 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-[#080715]/50 border-r border-white/10 p-4 hidden md:flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                activeTab === 'chat' 
                  ? 'bg-gradient-to-r from-[#1BD4CA]/20 to-[#7B6BFF]/20 border border-[#1BD4CA]/30 text-white' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">AI Assistant</span>
            </button>
            <button 
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                activeTab === 'scanner' 
                  ? 'bg-gradient-to-r from-[#1BD4CA]/20 to-[#7B6BFF]/20 border border-[#1BD4CA]/30 text-white' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <ScanLine className="w-5 h-5" />
              <span className="font-medium">Receipt Scanner</span>
            </button>
            <button 
              onClick={() => setActiveTab('insights')}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                activeTab === 'insights' 
                  ? 'bg-gradient-to-r from-[#1BD4CA]/20 to-[#7B6BFF]/20 border border-[#1BD4CA]/30 text-white' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity className="w-5 h-5" />
              <span className="font-medium">Live Insights</span>
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 relative">
            
            {/* Mobile Tab Buttons */}
            <div className="md:hidden flex gap-2 p-4 border-b border-white/10">
              <button 
                onClick={() => setActiveTab('chat')}
                className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-xl transition-all text-sm ${
                  activeTab === 'chat' 
                    ? 'bg-gradient-to-r from-[#1BD4CA]/20 to-[#7B6BFF]/20 border border-[#1BD4CA]/30 text-white' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Chat
              </button>
              <button 
                onClick={() => setActiveTab('scanner')}
                className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-xl transition-all text-sm ${
                  activeTab === 'scanner' 
                    ? 'bg-gradient-to-r from-[#1BD4CA]/20 to-[#7B6BFF]/20 border border-[#1BD4CA]/30 text-white' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <ScanLine className="w-4 h-4" />
                Scanner
              </button>
              <button 
                onClick={() => setActiveTab('insights')}
                className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-xl transition-all text-sm ${
                  activeTab === 'insights' 
                    ? 'bg-gradient-to-r from-[#1BD4CA]/20 to-[#7B6BFF]/20 border border-[#1BD4CA]/30 text-white' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Activity className="w-4 h-4" />
                Insights
              </button>
            </div>

            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        msg.role === 'user' 
                          ? 'bg-white/10 border border-white/20' 
                          : 'bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] shadow-lg'
                      }`}>
                        {msg.role === 'user' ? <Users className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                      </div>
                      <div className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-r from-[#1BD4CA]/20 to-[#7B6BFF]/20 border border-[#1BD4CA]/30 text-white' 
                          : 'bg-[#151925]/80 border border-white/5 text-white/90'
                      }`}>
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      </div>
                      <div className="bg-[#151925]/80 border border-white/5 px-4 py-3 rounded-2xl">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-[#1BD4CA] rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-[#7B6BFF] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-[#1BD4CA] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="p-4 border-t border-white/10 bg-[#080715]/80 backdrop-blur-xl">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                      placeholder="Ask about income, taxes, credit building, or how Kamai works..."
                      className="w-full bg-[#0B0F19] border border-white/10 rounded-2xl py-3.5 px-5 pr-14 text-white placeholder:text-white/30 focus:border-[#1BD4CA]/50 focus:outline-none transition-all"
                      disabled={isTyping}
                    />
                    <button 
                      onClick={handleSend}
                      disabled={isTyping || !input.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] rounded-xl hover:scale-110 transition-all disabled:opacity-50 disabled:hover:scale-100"
                    >
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-3 text-xs text-white/40">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Powered by AI
                    </span>
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      End-to-end encrypted
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Scanner Tab */}
            {activeTab === 'scanner' && (
              <div className="h-full p-6 overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-8 h-full">
                  {/* Left: Upload/Preview */}
                  <div className="space-y-4">
                    {!selectedImage ? (
                      <div className="relative">
                        <input 
                          ref={fileInputRef}
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                          className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full" 
                        />
                        <div className="border-2 border-dashed border-[#1BD4CA]/30 rounded-3xl p-12 text-center hover:border-[#1BD4CA] hover:bg-[#1BD4CA]/5 transition-all cursor-pointer h-[400px] flex flex-col items-center justify-center">
                          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#1BD4CA]/20 to-[#7B6BFF]/20 flex items-center justify-center">
                            <Upload className="w-10 h-10 text-[#1BD4CA]" />
                          </div>
                          <h4 className="text-xl font-bold text-white mb-2">Upload Receipt</h4>
                          <p className="text-white/60 text-sm mb-4">Click or drag to upload</p>
                          <p className="text-xs text-white/40">Supports JPG, PNG (Max 5MB)</p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black h-[400px]">
                        <img src={selectedImage.src} alt="Receipt" className="w-full h-full object-contain" />
                        {isScanning && (
                          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#1BD4CA]/20 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-[#1BD4CA] animate-spin" />
                              </div>
                              <p className="text-[#1BD4CA] font-mono text-sm animate-pulse">ANALYZING... {ocrProgress}%</p>
                              <div className="w-48 h-2 bg-white/10 rounded-full mt-3 mx-auto overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] rounded-full transition-all duration-300"
                                  style={{ width: `${ocrProgress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {selectedImage && (
                      <div className="flex gap-3">
                        <button 
                          onClick={() => { 
                            setSelectedImage(null); 
                            setScanResult(null); 
                            setExtractedText(''); 
                          }}
                          className="flex-1 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all font-medium"
                        >
                          Clear
                        </button>
                        <button 
                          onClick={handleScan}
                          disabled={isScanning}
                          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] text-white font-bold hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isScanning ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Scanning...
                            </>
                          ) : (
                            'Extract Data'
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right: Results */}
                  <div className="space-y-4">
                    <h4 className="text-white/60 font-mono text-xs uppercase tracking-widest">Extraction Results</h4>
                    <div className="rounded-2xl bg-[#080715] border border-white/10 p-6 min-h-[400px]">
                      {!scanResult ? (
                        <div className="h-full flex items-center justify-center text-white/30">
                          {isScanning ? "Processing image with OCR..." : "Waiting for scan..."}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {scanResult.error && (
                            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                              <p className="text-yellow-400 text-sm">{scanResult.error}</p>
                            </div>
                          )}
                          
                          <div className="space-y-3">
                            {[
                              { label: 'Merchant', value: scanResult.merchant },
                              { label: 'Amount', value: scanResult.amount },
                              { label: 'Date', value: scanResult.date },
                              { label: 'Category', value: scanResult.category },
                              { label: 'Tax', value: scanResult.tax },
                              { label: 'Confidence', value: scanResult.confidence }
                            ].map((field) => (
                              <div key={field.label} className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                <span className="text-white/60 text-sm">{field.label}</span>
                                <span className={`font-medium ${
                                  field.label === 'Confidence' 
                                    ? field.value === 'High' ? 'text-green-400' : 'text-yellow-400'
                                    : 'text-white'
                                }`}>
                                  {field.value}
                                </span>
                              </div>
                            ))}
                            
                            <div className="p-3 bg-white/5 rounded-xl">
                              <span className="text-white/60 text-sm block mb-2">Items</span>
                              <ul className="space-y-1">
                                {scanResult.items.map((item, i) => (
                                  <li key={i} className="text-white text-sm flex items-start gap-2">
                                    <span className="text-[#1BD4CA]">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          {scanResult.tax_deductible && (
                            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                              <div className="flex items-center gap-2 text-green-400">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-medium">Tax Deductible Expense</span>
                              </div>
                              <p className="text-xs text-green-400/80 mt-1">This expense can reduce your tax liability</p>
                            </div>
                          )}
                          
                          {extractedText && (
                            <details className="mt-4">
                              <summary className="text-white/50 text-sm cursor-pointer hover:text-white/70 transition-colors">
                                View raw extracted text ({extractedText.length} chars) →
                              </summary>
                              <pre className="mt-2 p-3 bg-black/50 rounded-xl text-xs text-white/40 overflow-auto max-h-32">
                                {extractedText || 'No text extracted'}
                              </pre>
                            </details>
                          )}
                          
                          <button 
                            onClick={discussWithAI}
                            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-[#7B6BFF] to-[#1BD4CA] text-white font-bold hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                          >
                            <MessageSquare className="w-5 h-5" />
                            Discuss with AI
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Insights Tab */}
            {activeTab === 'insights' && (
              <div className="h-full p-6 overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Earnings Trend */}
                  <div className="bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-bold">Weekly Earnings</h4>
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">₹48,250</div>
                    <div className="text-sm text-green-400">+12% from last week</div>
                    <div className="mt-4 h-32 bg-white/5 rounded-xl flex items-end justify-around p-2">
                      {[40, 65, 45, 80, 95, 75, 85].map((height, i) => (
                        <div key={i} className="w-8 bg-gradient-to-t from-[#1BD4CA] to-[#7B6BFF] rounded-t transition-all hover:opacity-80" style={{ height: `${height}%` }}></div>
                      ))}
                    </div>
                  </div>

                  {/* Tax Savings */}
                  <div className="bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-bold">Tax Savings</h4>
                      <Shield className="w-5 h-5 text-[#7B6BFF]" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">₹4,250</div>
                    <div className="text-sm text-[#7B6BFF]">This month's savings</div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Fuel</span>
                        <span className="text-white">₹2,800</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Phone</span>
                        <span className="text-white">₹850</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Maintenance</span>
                        <span className="text-white">₹600</span>
                      </div>
                    </div>
                  </div>

                  {/* Hot Zones */}
                  <div className="bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-bold">Hot Zones Now</h4>
                      <Activity className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="space-y-3">
                      {['Koramangala', 'Indiranagar', 'Whitefield'].map((zone, i) => (
                        <div key={zone} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                          <span className="text-white/90">{zone}</span>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                              {[...Array(3)].map((_, j) => (
                                <div key={j} className={`w-2 h-2 rounded-full ${j <= i ? 'bg-orange-400' : 'bg-white/20'}`}></div>
                              ))}
                            </div>
                            <span className="text-xs text-orange-400">+{25 - i * 5}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Goals Progress */}
                  <div className="bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-bold">Savings Goals</h4>
                      <Target className="w-5 h-5 text-[#1BD4CA]" />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/60">Emergency Fund</span>
                          <span className="text-white">75%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full w-[75%] bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] rounded-full transition-all"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/60">New Bike</span>
                          <span className="text-white">40%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full w-[40%] bg-gradient-to-r from-[#7B6BFF] to-[#1BD4CA] rounded-full transition-all"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN SIDEBAR COMPONENT ---
export default function Sidebar({ isOpen, onClose, user }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [aiModalOpen, setAiModalOpen] = useState(false);

  // Auto-collapse on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setIsCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    if (onClose) {
      onClose();
    }
    
    router.push('/');
  };

  // Open AI Modal handler
  const handleOpenAI = () => {
    setAiModalOpen(true);
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      badge: null,
      color: 'from-[#1BD4CA] to-[#7B6BFF]'
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      badge: 'Live',
      badgeColor: 'bg-green-500',
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'AI Agents',
      href: '/agents',
      icon: Brain,
      badge: 'New',
      badgeColor: 'bg-[#7B6BFF]',
      color: 'from-[#7B6BFF] to-purple-600'
    },
    {
      name: 'History',
      href: '/history',
      icon: Clock,
      badge: null,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
      badge: null,
      color: 'from-pink-500 to-rose-500'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      badge: '3',
      badgeColor: 'bg-red-500',
      color: 'from-gray-500 to-gray-600'
    }
  ];

  const quickActions = [
    { icon: Bell, label: 'Notifications', count: 5, action: () => router.push('/notifications') },
    { icon: HelpCircle, label: 'Help Center', action: () => router.push('/help') },
    { icon: Moon, label: 'Dark Mode', toggle: true, action: () => setTheme(theme === 'dark' ? 'light' : 'dark') }
  ];

  const stats = [
    { 
      label: 'Credit Score', 
      value: user?.creditScore || 750, 
      icon: Shield,
      color: 'text-green-400',
      bgColor: 'from-green-500/20 to-emerald-500/20'
    },
    { 
      label: 'Monthly Income', 
      value: `₹${(user?.monthlyIncome || 68000).toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-[#1BD4CA]',
      bgColor: 'from-[#1BD4CA]/20 to-cyan-500/20'
    },
    { 
      label: 'Total Savings', 
      value: `₹${(user?.totalSavings || 245000).toLocaleString()}`,
      icon: PiggyBank,
      color: 'text-[#7B6BFF]',
      bgColor: 'from-[#7B6BFF]/20 to-purple-500/20'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop with Blur */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full bg-[#080715]/95 backdrop-blur-2xl
        border-r border-white/10 shadow-2xl shadow-black/50
        transform transition-all duration-500 ease-out
        lg:sticky lg:top-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-20' : 'w-72'}
      `}>
        
        {/* Gradient Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-40 h-40 bg-[#1BD4CA] opacity-10 blur-[100px]"></div>
          <div className="absolute bottom-20 -right-20 w-40 h-40 bg-[#7B6BFF] opacity-10 blur-[100px]"></div>
        </div>

        {/* Header */}
        <div className="relative p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <div className={`flex items-center gap-3 transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="relative group cursor-pointer" onClick={() => router.push('/dashboard')}>
                <div className="absolute inset-0 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] p-[1px]">
                  <div className="w-full h-full bg-[#080715] rounded-xl flex items-center justify-center">
                    <Gem className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <h2 className="text-lg font-bold text-white">Kamai</h2>
                  <p className="text-xs text-[#1BD4CA]">AI Finance</p>
                </div>
              )}
            </div>

            {/* Collapse/Close Buttons */}
            <div className="flex items-center gap-1">
              {/* Desktop Collapse Button */}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex p-2 hover:bg-white/10 rounded-lg transition-colors group"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-white/60 group-hover:text-white" />
                ) : (
                  <ChevronLeft className="w-4 h-4 text-white/60 group-hover:text-white" />
                )}
              </button>

              {/* Mobile Close Button */}
              <button
                onClick={onClose}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors group"
                aria-label="Close sidebar"
              >
                <X className="w-4 h-4 text-white/60 group-hover:text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        {!isCollapsed && (
          <div className="p-4 border-b border-white/10">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] p-[1px]">
                    <div className="w-full h-full bg-[#080715] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {user?.name?.charAt(0) || 'R'}
                      </span>
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#080715]"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{user?.name || 'Rahul Kumar'}</p>
                  <p className="text-xs text-white/40">Premium Member</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-[#1BD4CA]" />
                <span className="text-sm text-white/80 font-medium">
                  ₹{(user?.vaultBalance || 245000).toLocaleString()}
                </span>
                <span className="text-xs text-white/40">in vault</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="p-4">
            {!isCollapsed && (
              <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">
                Main Menu
              </p>
            )}
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <li key={item.name} className="relative">
                    <Link
                      href={item.href}
                      onClick={() => {
                        if (window.innerWidth < 1024 && onClose) {
                          onClose();
                        }
                      }}
                      onMouseEnter={() => isCollapsed && setActiveTooltip(item.name)}
                      onMouseLeave={() => setActiveTooltip(null)}
                      className={`
                        relative flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm
                        transition-all duration-200 group overflow-hidden
                        ${isActive 
                          ? 'bg-gradient-to-r from-[#1BD4CA]/20 to-[#7B6BFF]/20 text-white border border-[#1BD4CA]/30' 
                          : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                        }
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                    >
                      {/* Active Indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#1BD4CA] to-[#7B6BFF] rounded-r-full"></div>
                      )}
                      
                      {/* Icon with gradient on active/hover */}
                      <div className={`relative z-10 ${isCollapsed ? '' : 'ml-1'}`}>
                        <Icon className={`w-5 h-5 ${isActive ? 'text-[#1BD4CA]' : ''}`} />
                      </div>
                      
                      {/* Label */}
                      {!isCollapsed && (
                        <>
                          <span className="relative z-10 flex-1">{item.name}</span>
                          
                          {/* Badge */}
                          {item.badge && (
                            <span className={`
                              px-2 py-0.5 text-xs font-semibold text-white rounded-full
                              ${item.badgeColor || 'bg-white/20'}
                            `}>
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}

                      {/* Tooltip for collapsed state */}
                      {isCollapsed && activeTooltip === item.name && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-[#080715] border border-white/10 rounded-lg shadow-xl z-50 whitespace-nowrap">
                          <span className="text-xs text-white">{item.name}</span>
                          {item.badge && (
                            <span className={`ml-2 px-2 py-0.5 text-xs font-semibold text-white rounded-full ${item.badgeColor || 'bg-white/20'}`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Hover effect gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

                    {/* Quick Stats */}
          {!isCollapsed && (
            <div className="p-4">
              <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">
                Quick Stats
              </p>
              <div className="space-y-3">
                {stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="group cursor-pointer">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur border border-white/10 hover:border-white/20 transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.bgColor} flex items-center justify-center`}>
                              <Icon className={`w-4 h-4 ${stat.color}`} />
                            </div>
                            <span className="text-xs text-white/60">{stat.label}</span>
                          </div>
                          <Activity className="w-3 h-3 text-white/30" />
                        </div>
                        <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Assistant Prompt */}
          {!isCollapsed && (
            <div className="p-4">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1BD4CA]/10 to-[#7B6BFF]/10 backdrop-blur border border-white/10 p-4">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#7B6BFF] opacity-20 blur-3xl"></div>
                <div className="relative flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm mb-1">AI Assistant</p>
                    <p className="text-white/60 text-xs leading-relaxed">Get instant help with your finances</p>
                    <button 
                      onClick={handleOpenAI}
                      className="mt-2 text-[#1BD4CA] text-xs font-medium hover:text-[#7B6BFF] transition-colors"
                    >
                      Ask AI →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Collapsed AI Button */}
          {isCollapsed && (
            <div className="p-4 flex justify-center">
              <button
                onClick={handleOpenAI}
                onMouseEnter={() => setActiveTooltip('ai')}
                onMouseLeave={() => setActiveTooltip(null)}
                className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Sparkles className="w-5 h-5 text-white" />
                {activeTooltip === 'ai' && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-[#080715] border border-white/10 rounded-lg shadow-xl z-50 whitespace-nowrap">
                    <span className="text-xs text-white">Ask AI</span>
                  </div>
                )}
              </button>
            </div>
          )}
        </nav>

        {/* Bottom Actions */}
        <div className={`p-4 border-t border-white/10 ${isCollapsed ? 'flex justify-center' : ''}`}>
          {!isCollapsed ? (
            <div className="space-y-2">
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <button
                    key={i}
                    onClick={action.action}
                    className="w-full flex items-center justify-between p-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{action.label}</span>
                    </div>
                    {action.count && (
                      <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                        {action.count}
                      </span>
                    )}
                    {action.toggle && (
                      <div className="w-10 h-5 bg-white/20 rounded-full relative">
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                          theme === 'dark' ? 'left-0.5' : 'left-5'
                        }`}></div>
                      </div>
                    )}
                  </button>
                );
              })}
              
              {/* Logout Button - Full Width */}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all group"
              >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          ) : (
            /* Logout Button - Collapsed State */
            <button 
              onClick={handleLogout}
              onMouseEnter={() => setActiveTooltip('logout')}
              onMouseLeave={() => setActiveTooltip(null)}
              className="relative p-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all group"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              
              {/* Tooltip for collapsed state */}
              {activeTooltip === 'logout' && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-[#080715] border border-white/10 rounded-lg shadow-xl z-50 whitespace-nowrap">
                  <span className="text-xs text-white">Logout</span>
                </div>
              )}
            </button>
          )}
        </div>
      </aside>

      {/* AI Modal */}
      <AIModal 
        isOpen={aiModalOpen} 
        onClose={() => setAiModalOpen(false)} 
      />

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        .scrollbar-thumb-white\\/10::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background-color: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
      `}</style>
    </>
  );
}