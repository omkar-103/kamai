//app/page.jsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import AuthModal from '@/components/ui/AuthModal';
import Footer from '@/components/Footer';
import { 
  ArrowRight, Shield, TrendingUp, Users, Star, Menu, X, 
  CheckCircle, BarChart3, Zap, Target, Wallet, PieChart, 
  Code, Terminal, ChevronRight, Play, Lock, Globe, MessageSquare, 
  ScanLine, Upload, Sparkles, Send, Loader2, Bot, Check, Smartphone,
  TrendingDown, DollarSign, Calendar, FileText, Award, Clock,
  Brain, Rocket, Eye, Database, CreditCard, Bell, Settings,
  Activity, Layers, Cpu, Gem, Coins, IndianRupee
} from 'lucide-react';
import Tesseract from 'tesseract.js';

// --- PREDEFINED Q&A DATABASE ---
const predefinedResponses = {
  "who made you": "I was created by Kamai Team and the Kamai. This innovative financial platform was built with passion to help gig workers in India manage their finances better.",
  "who created you": "I was created by Kamai Team and the Kamai. This innovative financial platform was built with passion to help gig workers in India manage their finances better.",
  "who is your creator": "My creator is Kamai Team, founder of Kamai. He built Kamai to revolutionize financial management for gig economy workers.",
  "who built Kamai": "Kamai was built by Kamai Team and his company, Kamai. It's designed specifically for India's gig economy workers.",
  "company behind Kamai": "Kamai is a product of Kamai, founded by Kamai Team. We're dedicated to empowering gig workers with smart financial tools.",
  "about omkar parelkar": "Kamai Team is the visionary founder and CEO of Kamai, and the creator of Kamai. He's passionate about using AI and technology to solve real-world financial challenges for gig workers.",
  "what is Kamai": "Kamai is an AI-powered financial management platform created by Kamai specifically for gig workers in India. It helps you track earnings, save taxes, manage expenses, and build wealth.",
  "how can Kamai help me": "Kamai helps you: 1) Track earnings from multiple platforms, 2) Save up to ₹4,000+ monthly on taxes, 3) Scan and categorize receipts automatically, 4) Get AI-powered financial advice, 5) Build emergency funds with smart savings.",
  "tax savings": "Kamai can help you save ₹4,000+ monthly on taxes through: automatic expense tracking, GST compliance, receipt scanning, and smart deduction recommendations. All powered by AI.",
  "pricing": "Kamai offers three plans: Starter (Free) for basic tracking, Professional (₹299/month) with full AI features, and Fleet (₹999/month) for teams. All plans come with a 30-day free trial.",
  "supported platforms": "Kamai supports all major gig platforms including Swiggy, Zomato, Uber, Ola, Rapido, Dunzo, Amazon Flex, and 15+ other platforms. We automatically sync your earnings data.",
  "contact": "You can reach Kamai at support@Kamai.ai or visit our office in Mumbai. For immediate assistance, use the in-app chat feature.",
  "security": "Kamai uses bank-level 256-bit encryption, is RBI compliant, and never shares your data. Created by Kamai with security as our top priority.",
  "hello": "Hello! I'm Kamai assistant, created by Kamai. How can I help you manage your gig economy finances today?",
  "hi": "Hi there! I'm Kamai, built by Kamai to help gig workers like you maximize earnings and save on taxes. What would you like to know?",
  "help": "I can help you with: tax savings strategies, expense tracking, receipt scanning, platform integrations, earnings optimization, and financial planning. What specific area interests you?",
  "thanks": "You're welcome! If you have any more questions about Kamai or how Kamai can help your financial journey, feel free to ask!",
  "thank you": "My pleasure! Remember, Kamai by Kamai is here to help you achieve financial freedom. Is there anything else you'd like to know?"
};

// --- FALLBACK RESPONSES ---
const fallbackResponses = [
  "I understand you're asking about financial management. Kamai, created by Kamai, offers comprehensive tools for gig workers. Could you please be more specific about what you'd like to know?",
  "That's an interesting question! While I process that, did you know Kamai can save you ₹4,000+ monthly on taxes? Created by Kamai specifically for gig workers like you.",
  "I'm here to help with all your financial queries. Kamai by Kamai specializes in tax optimization, expense tracking, and wealth building for gig workers. What aspect would you like to explore?",
  "Great question! Kamai's AI-powered platform can help with that. We offer smart solutions for expense tracking, tax savings, and financial planning. What specific feature interests you most?",
  "Thanks for your question! Kamai, built by Kamai, is designed to address exactly these kinds of financial challenges for gig workers. Let me help you find the right solution."
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
  // Check predefined responses first
  const predefinedReply = getPredefinedResponse(userMessage);
  if (predefinedReply) {
    return predefinedReply;
  }

  // Prepare messages for API
  const apiMessages = history.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
  apiMessages.push({ role: 'user', content: userMessage });

  // Try API call
  const apiResponse = await callChatAPI(apiMessages);
  if (apiResponse) {
    return apiResponse;
  }

  // Return fallback if API fails
  return getRandomFallback();
};

// --- Receipt Text Parser ---
const parseReceiptText = (text) => {
  const lines = text.split('\n').filter(line => line.trim());
  const merchant = lines[0] || 'Unknown Merchant';

  // Extract amount
  const amountRegex = /(?:total|amount|sum)[\s:]*(?:₹|\$|rs\.?)\s*(\d+(?:\.\d{2})?)/i;
  const amountMatch = text.match(amountRegex);
  const amount = amountMatch ? `₹${amountMatch[1]}` : '₹0.00';

  // Extract date
  const dateRegex = /(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/;
  const dateMatch = text.match(dateRegex);
  const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];

  // Extract items
  const items = lines.filter(line =>
    line.length > 3 &&
    !line.toLowerCase().includes('receipt') &&
    !line.toLowerCase().includes('thank')
  ).slice(1, 6);

  // Determine category
  const textLower = text.toLowerCase();
  let category = 'General';
  if (textLower.includes('food') || textLower.includes('restaurant')) {
    category = 'Food & Dining';
  } else if (textLower.includes('uber') || textLower.includes('transport')) {
    category = 'Transport';
  } else if (textLower.includes('shop')) {
    category = 'Shopping';
  }

  // Check if tax deductible
  const tax_deductible = category === 'Transport' || textLower.includes('fuel') || textLower.includes('maintenance');

  return {
    merchant,
    amount,
    date,
    category,
    items: items.length > 0 ? items : ['See extracted text'],
    tax: 'Check details',
    tax_deductible,
    rawText: text
  };
};

// --- ANIMATED BACKGROUND COMPONENT ---
const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    
    // Initialize particles
    const particleCount = 80;
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
        color: Math.random() > 0.5 ? '#1BD4CA' : '#7B6BFF',
        pulse: Math.random() * Math.PI * 2
      });
    }
    
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', setSize);
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.x -= dx * 0.01;
          p.y -= dy * 0.01;
        }
        
        const pulseSize = Math.sin(p.pulse) * 0.3 + 1;
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color + '66';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * pulseSize, 0, Math.PI * 2);
        ctx.fill();
        
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p2 = particlesRef.current[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          
          if (dist2 < 100) {
            const opacity = (1 - dist2 / 100) * 0.2;
            ctx.strokeStyle = `rgba(123, 107, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', setSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

// --- AI MODAL COMPONENT ---
const AIModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hello! I\'m Kamai assistant, created by Kamai. Ask me about tax savings, earnings optimization, expense tracking, or anything about our platform!' 
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

  // Parse receipt text function with better patterns
  const parseReceiptText = (text) => {
    console.log('=== PARSING RECEIPT TEXT ===');
    console.log('Raw text length:', text.length);
    console.log('First 200 chars:', text.substring(0, 200));
    
    // Initialize result object
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
      console.log('Text too short or empty');
      result.error = 'Could not extract text from image. Please try with a clearer image.';
      return result;
    }

    // Clean the text
    const cleanText = text.replace(/\s+/g, ' ').trim();
    const lines = text.split('\n').filter(line => line.trim());
    console.log('Number of lines:', lines.length);

    // Extract merchant (usually first non-empty line)
    if (lines.length > 0) {
      result.merchant = lines[0].trim().substring(0, 50);
      console.log('Merchant extracted:', result.merchant);
    }

    // Amount patterns - more comprehensive
    const amountPatterns = [
      /(?:total|grand total|net total|amount|bill amount|net amount)[\s:]*(?:rs\.?|₹|inr)?\s*([0-9,]+\.?\d*)/gi,
      /(?:rs\.?|₹|inr)\s*([0-9,]+\.?\d*)/gi,
      /([0-9,]+\.?\d*)\s*(?:rs\.?|₹|inr)/gi,
      /\b([0-9]{1,}[,\d]*\.?\d{0,2})\b(?=.*(?:total|amount|due|payable))/gi
    ];

    let maxAmount = 0;
    for (const pattern of amountPatterns) {
      const matches = [...cleanText.matchAll(pattern)];
      console.log(`Pattern ${amountPatterns.indexOf(pattern)}: Found ${matches.length} matches`);
      
      for (const match of matches) {
        const amount = parseFloat(match[1].replace(/,/g, ''));
        if (!isNaN(amount) && amount > maxAmount) {
          maxAmount = amount;
          console.log('New max amount found:', amount);
        }
      }
    }

    if (maxAmount > 0) {
      result.amount = `₹${maxAmount.toFixed(2)}`;
      result.confidence = 'High';
      console.log('Final amount:', result.amount);
    }

    // Date patterns
    const datePatterns = [
      /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/g,
      /(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{2,4})/gi,
      /(\d{4}[-/]\d{1,2}[-/]\d{1,2})/g
    ];

    for (const pattern of datePatterns) {
      const dateMatch = cleanText.match(pattern);
      if (dateMatch) {
        result.date = dateMatch[0];
        console.log('Date found:', result.date);
        break;
      }
    }

    // Tax/GST extraction
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
          console.log('Tax found:', result.tax);
          break;
        }
      }
    }

    // Category detection
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
        console.log('Category detected:', category);
        break;
      }
    }

    // Items extraction
    const itemPatterns = [
      /(\d+)\s*x?\s*([a-zA-Z\s]+?)\s+(?:rs\.?|₹)?\s*([0-9,]+\.?\d*)/gi,
      /([a-zA-Z\s]+?)\s+(?:rs\.?|₹)\s*([0-9,]+\.?\d*)/gi
    ];

    const itemMatches = [...cleanText.matchAll(itemPatterns[0])];
    if (itemMatches.length > 0) {
      itemMatches.slice(0, 5).forEach(match => {
        result.items.push(`${match[1]}x ${match[2].trim()} - ₹${match[3]}`);
      });
      console.log('Items extracted:', result.items.length);
    } else {
      // Try simpler pattern
      const simpleItems = [...cleanText.matchAll(itemPatterns[1])];
      simpleItems.slice(0, 3).forEach(match => {
        result.items.push(`${match[1].trim()} - ₹${match[2]}`);
      });
    }

    if (result.items.length === 0) {
      result.items.push('Items not clearly identified');
    }

    // Tax deductible determination
    const deductibleCategories = ['Fuel', 'Transport', 'Maintenance', 'Food'];
    result.tax_deductible = deductibleCategories.includes(result.category) && maxAmount > 0;
    console.log('Tax deductible:', result.tax_deductible);

    console.log('=== PARSING COMPLETE ===');
    console.log('Final result:', result);
    
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
        content: "I apologize for the inconvenience. There seems to be a technical issue. Kamai by Kamai is committed to providing you the best service. Please try again or contact support@Kamai.ai" 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    console.log('=== IMAGE UPLOAD ===');
    console.log('File name:', file.name);
    console.log('File type:', file.type);
    console.log('File size:', file.size, 'bytes');
    
    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image under 5MB");
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log('Image loaded successfully');
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
    if (!selectedImage) {
      console.log('No image selected');
      return;
    }
    
    console.log('=== STARTING OCR SCAN ===');
    setIsScanning(true);
    setExtractedText('');
    setOcrProgress(0);

    try {
      console.log('Initializing Tesseract...');
      
      const result = await Tesseract.recognize(
        selectedImage.src,
        'eng',
        {
          logger: (m) => {
            console.log('Tesseract:', m.status);
            if (m.status === 'recognizing text') {
              const progress = Math.round(m.progress * 100);
              setOcrProgress(progress);
              console.log(`OCR Progress: ${progress}%`);
            }
          }
        }
      );

      const text = result.data.text;
      console.log('=== OCR COMPLETE ===');
      console.log('Text extracted, length:', text.length);
      console.log('First 500 characters:', text.substring(0, 500));
      
      setExtractedText(text);
      
      // Parse the text
      const parsed = parseReceiptText(text);
      setScanResult(parsed);

    } catch (error) {
      console.error('=== OCR ERROR ===');
      console.error('Error details:', error);
      
      // Provide sample data on error
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
      console.log('=== SCAN PROCESS COMPLETE ===');
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
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
              <p className="text-xs text-[#1BD4CA]">Powered by AI</p>
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
                      placeholder="Ask about taxes, earnings, expenses, or who created Kamai..."
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
                            console.log('Cleared image and results');
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

// --- SECTION DIVIDER COMPONENT ---
const SectionDivider = ({ flip = false }) => (
  <div className="relative flex items-center justify-center py-2 overflow-visible" style={{zIndex: 2}}>
    {/* Radial glow halo behind the line */}
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[60px] rounded-full"
      style={{
        background: flip
          ? 'radial-gradient(ellipse at center, rgba(123,107,255,0.18) 0%, transparent 70%)'
          : 'radial-gradient(ellipse at center, rgba(27,212,202,0.18) 0%, transparent 70%)',
        filter: 'blur(6px)',
      }}
    />
    {/* The gradient line itself */}
    <div className="relative w-full max-w-4xl mx-auto px-8">
      <div
        className="h-px w-full rounded-full"
        style={{
          background: flip
            ? 'linear-gradient(90deg, transparent 0%, rgba(123,107,255,0.08) 20%, rgba(123,107,255,0.5) 50%, rgba(27,212,202,0.5) 80%, transparent 100%)'
            : 'linear-gradient(90deg, transparent 0%, rgba(27,212,202,0.08) 20%, rgba(27,212,202,0.5) 50%, rgba(123,107,255,0.5) 80%, transparent 100%)',
        }}
      />
      {/* Shimmer overlay */}
      <div
        className="absolute inset-0 h-px animate-divider-shimmer"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
      />
    </div>
    {/* Center diamond jewel */}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div
        className="w-1.5 h-1.5 rounded-full"
        style={{
          background: flip ? '#7B6BFF' : '#1BD4CA',
          boxShadow: flip
            ? '0 0 8px 3px rgba(123,107,255,0.7), 0 0 20px 8px rgba(123,107,255,0.3)'
            : '0 0 8px 3px rgba(27,212,202,0.7), 0 0 20px 8px rgba(27,212,202,0.3)',
        }}
      />
    </div>
  </div>
);

// --- MAIN HOMEPAGE COMPONENT ---
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('driver');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (user && token) {
      window.location.href = '/dashboard';
    }

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#080715] font-sans selection:bg-[#1BD4CA]/30 relative landing-page">
      
      {/* Animated Background — fixed behind everything */}
      <AnimatedBackground />
      
      {/* Full-page ambient glow orbs — subtle atmospheric lighting */}
      <div className="fixed inset-0 pointer-events-none" style={{zIndex: 0}}>
        {/* Top */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#1BD4CA] blur-[180px] rounded-full" style={{opacity: 0.06}}></div>
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#7B6BFF] blur-[180px] rounded-full" style={{opacity: 0.06}}></div>
        {/* Middle */}
        <div className="absolute top-[40%] left-[10%] w-80 h-80 bg-[#7B6BFF] blur-[150px] rounded-full" style={{opacity: 0.04}}></div>
        <div className="absolute top-[55%] right-[10%] w-80 h-80 bg-[#1BD4CA] blur-[150px] rounded-full" style={{opacity: 0.04}}></div>
        {/* Bottom */}
        <div className="absolute bottom-[20%] left-1/3 w-96 h-96 bg-[#1BD4CA] blur-[160px] rounded-full" style={{opacity: 0.05}}></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-[#7B6BFF] blur-[160px] rounded-full" style={{opacity: 0.05}}></div>
      </div>
      
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-[#080715]/90 backdrop-blur-2xl border-b border-white/10 py-4' 
          : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] blur-xl opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] p-[1px]">
                  <div className="w-full h-full bg-[#080715] rounded-2xl flex items-center justify-center">
                    <Gem className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Kamai</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              {['Features', 'How It Works', 'Pricing', 'Reviews'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                  className="relative text-white/70 hover:text-white font-medium transition-all group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={() => setAiModalOpen(true)}
                className="relative px-5 py-2.5 rounded-xl text-white font-medium overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#1BD4CA]/20 to-[#7B6BFF]/20 backdrop-blur-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <span className="relative flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Try AI Demo
                </span>
              </button>
              <button 
                onClick={() => openAuthModal('login')}
                className="px-5 py-2.5 text-white/70 hover:text-white font-medium transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => openAuthModal('signup')}
                className="relative px-6 py-2.5 rounded-xl font-bold overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF]"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#7B6BFF] to-[#1BD4CA] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative">Get Started →</span>
              </button>
            </div>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#080715]/95 backdrop-blur-2xl border-b border-white/10 md:hidden p-4">
            <div className="flex flex-col gap-2">
              {['Features', 'How It Works', 'Pricing', 'Reviews'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                  className="p-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button 
                onClick={() => { setAiModalOpen(true); setMobileMenuOpen(false); }}
                className="p-3 bg-white/5 rounded-xl text-white flex items-center justify-center gap-2 hover:bg-white/10"
              >
                <Sparkles className="w-4 h-4" /> Try AI Demo
              </button>
              <button 
                onClick={() => openAuthModal('signup')}
                className="p-3 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] rounded-xl font-bold"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-36 pb-8 md:pt-48 md:pb-12 bg-grid-pattern">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Floating Cards (Adapted from Minimal Modern Healthcare Design) */}
          <div className="absolute inset-0 pointer-events-none z-0 hidden xl:block">
            {/* Top Left: Swiggy Earning */}
            <div className="absolute top-[-40px] left-[-80px] w-[260px] p-5 bg-[#0B0F19]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.4)] animate-[float_6s_ease-in-out_infinite]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center border border-orange-500/20">
                  <span className="text-2xl">🍔</span>
                </div>
                <div className="text-left">
                  <p className="text-white font-bold text-lg">+₹450.00</p>
                  <p className="text-white/50 text-xs">Swiggy Payout</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-green-400 bg-green-500/10 w-fit px-3 py-1.5 rounded-full font-medium">
                <TrendingUp className="w-3 h-3" /> Auto-saved ₹45
              </div>
            </div>

            {/* Top Right: Credit Score */}
            <div className="absolute top-[20px] right-[-100px] w-[260px] p-5 bg-[#0B0F19]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.4)] animate-[float_7s_ease-in-out_infinite_1s]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#1BD4CA]/20 rounded-2xl flex items-center justify-center border border-[#1BD4CA]/20">
                  <Target className="w-6 h-6 text-[#1BD4CA]" />
                </div>
                <div className="text-left">
                  <p className="text-white font-bold text-lg">Score 780</p>
                  <p className="text-[#1BD4CA] text-xs">Excellent Credit</p>
                </div>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-5">
                <div className="bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] w-[85%] h-full rounded-full"></div>
              </div>
            </div>

            {/* Center Right: Vault (Rotated) */}
            <div className="absolute top-[280px] right-[-40px] w-[180px] p-6 bg-gradient-to-br from-[#7B6BFF] to-[#1BD4CA] rounded-[32px] shadow-[0_20px_60px_rgba(123,107,255,0.3)] animate-[float_8s_ease-in-out_infinite_2s] -rotate-12">
              <Shield className="w-8 h-8 text-white mb-4" />
              <p className="text-white/90 text-[10px] font-bold uppercase tracking-widest mb-1">Smart Vault</p>
              <p className="text-white font-bold text-3xl">₹24.5k</p>
              <div className="flex gap-1.5 mt-4">
                <span className="w-1.5 h-1.5 rounded-full bg-white/50"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              </div>
            </div>

            {/* Bottom Left: Goal Pill */}
            <div className="absolute top-[320px] left-[-20px] px-7 py-4 bg-[#111111]/90 backdrop-blur-2xl rounded-full border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)] animate-[float_6s_ease-in-out_infinite_3s] flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-500/20">
                <Award className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-sm">Bike Loan Paid</p>
                <p className="text-white/50 text-xs">Goal Reached 🎯</p>
              </div>
            </div>
          </div>
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-10">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">50,000+ Active Gig Workers</span>
            <Star className="w-3 h-3 text-yellow-400" />
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="block text-white">Smart Money</span>
            <span className="block bg-gradient-to-r from-[#1BD4CA] via-[#7B6BFF] to-[#1BD4CA] bg-clip-text text-transparent bg-[size:200%] animate-gradient">
              for Gig Workers
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-white/60 mb-12 max-w-3xl mx-auto leading-relaxed">
            AI-powered financial OS that connects all your gig platforms, automates tax savings, 
            and helps you build wealth. Made for India's 75 lakh+ delivery partners by Kamai.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button 
              onClick={() => openAuthModal('signup')}
              className="group relative px-10 py-5 rounded-2xl font-bold text-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-white"></div>
             <div className="absolute inset-0 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF]"></div>

<span className="relative text-white flex items-center gap-3">
  Start Free Trial
  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
</span>

            </button>
            
            <button 
              onClick={() => setAiModalOpen(true)}
              className="px-10 py-5 rounded-2xl border-2 border-white/20 hover:border-[#1BD4CA] text-white font-bold text-lg backdrop-blur-sm hover:bg-white/5 transition-all flex items-center gap-3 group"
            >
              <Brain className="w-5 h-5 text-[#1BD4CA] group-hover:scale-110 transition-transform" />
              Try AI Assistant
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="inline-block px-8 py-6 rounded-2xl border border-[#1BD4CA] bg-gradient-to-r from-[#1BD4CA]/10 to-[#7B6BFF]/10 backdrop-blur-sm shadow-[0_0_30px_rgba(27,212,202,0.2)] animate-pulse hover:animate-none transition-all">
            <h3 className="font-bold text-white mb-3 flex items-center justify-center gap-2 text-lg">
              <Lock className="w-5 h-5 text-[#1BD4CA]" />
              Demo Account Access
            </h3>
            <div className="text-base space-y-2 text-white/90 font-mono bg-black/30 p-4 rounded-xl border border-white/10">
              <p className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-8"><span className="text-white/60">Email:</span> <span className="text-[#1BD4CA] font-bold text-sm sm:text-base">testuser1778989547962@example.com</span></p>
              <p className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-8"><span className="text-white/60">Password:</span> <span className="text-[#1BD4CA] font-bold">Password123!</span></p>
            </div>
            <p className="text-xs text-white/50 mt-4 max-w-xs mx-auto">Use these credentials to test the dashboard without signing up.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/[0.07]">
            {[
              { icon: IndianRupee, val: "₹2.5Cr+", label: "Money Managed", color: "from-[#1BD4CA]/20 to-[#1BD4CA]/5", glow: "rgba(27,212,202,0.15)" },
              { icon: Users, val: "50,000+", label: "Active Users", color: "from-[#7B6BFF]/20 to-[#7B6BFF]/5", glow: "rgba(123,107,255,0.15)" },
              { icon: Globe, val: "15+", label: "Platforms", color: "from-[#1BD4CA]/20 to-[#1BD4CA]/5", glow: "rgba(27,212,202,0.15)" },
              { icon: Star, val: "4.8★", label: "User Rating", color: "from-[#7B6BFF]/20 to-[#7B6BFF]/5", glow: "rgba(123,107,255,0.15)" }
            ].map((stat, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border border-white/[0.07] bg-gradient-to-br from-[#0B0F19]/60 to-[#080715]/40 backdrop-blur-sm px-4 py-5 text-center hover:border-white/20 transition-all duration-300"
                style={{ boxShadow: `inset 0 0 30px ${stat.glow}` }}
              >
                <stat.icon className="w-6 h-6 text-[#1BD4CA] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-2xl font-bold text-white mb-0.5">{stat.val}</div>
                <div className="text-xs text-white/50 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Features Section */}
      <section id="features" className="pt-10 pb-16 relative bg-grid-pattern overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {/* Side glows */}
          <div className="absolute top-1/2 left-0 w-[500px] h-[500px] -translate-y-1/2 bg-[#1BD4CA] opacity-[0.04] blur-[140px] rounded-full"></div>
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] -translate-y-1/2 bg-[#7B6BFF] opacity-[0.04] blur-[140px] rounded-full"></div>
          {/* Heading area bloom */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[180px] bg-[#1BD4CA] opacity-[0.05] blur-[80px] rounded-full"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-8 relative z-10">
            <div className="inline-block px-4 py-1 rounded-full bg-[#1BD4CA]/10 border border-[#1BD4CA]/30 text-[#1BD4CA] text-xs font-bold uppercase tracking-wider mb-3">
              Core Features
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">
              Everything You Need to
              <span className="block bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] bg-clip-text text-transparent">
                Maximize Earnings
              </span>
            </h2>
            <p className="text-white/60 text-sm max-w-lg mx-auto">
              Built specifically for India's gig economy workers. Connect, track, optimize, and grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Zap,
                title: "Real-Time Sync",
                desc: "Connect all platforms via API. Every rupee tracked automatically.",
                color: "from-cyan-500 to-blue-500",
                features: ["Multi-platform", "Instant updates", "Bank sync"]
              },
              {
                icon: Brain,
                title: "AI Tax Optimizer",
                desc: "AI finds every deduction. Save ₹4,000+ monthly on taxes.",
                color: "from-purple-500 to-pink-500",
                features: ["Auto categorization", "GST ready", "ITR filing"]
              },
              {
                icon: Target,
                title: "Smart Savings",
                desc: "Auto-save based on earnings. Build emergency fund effortlessly.",
                color: "from-green-500 to-emerald-500",
                features: ["Goal tracking", "Auto-transfer", "5% interest"]
              },
              {
                icon: ScanLine,
                title: "Receipt Scanner",
                desc: "Snap & forget. AI extracts data and categorizes instantly.",
                color: "from-orange-500 to-red-500",
                features: ["OCR powered", "Cloud backup", "Tax ready"]
              },
              {
                icon: Activity,
                title: "Live Heatmaps",
                desc: "See where others earn most. Real-time demand zone alerts.",
                color: "from-indigo-500 to-blue-500",
                features: ["City insights", "Peak hours", "Route optimizer"]
              },
              {
                icon: Shield,
                title: "Credit Builder",
                desc: "Track & improve CIBIL score. Get better loan rates.",
                color: "from-teal-500 to-cyan-500",
                features: ["Free reports", "Score tips", "Loan finder"]
              }
            ].map((feature, i) => (
              <div key={i} className="group relative">
                <div className="absolute -inset-px bg-gradient-to-br from-[#1BD4CA]/20 via-transparent to-[#7B6BFF]/20 opacity-0 group-hover:opacity-100 rounded-3xl transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-[#0B0F19]/80 to-[#080715] border border-white/[0.07] rounded-2xl p-6 hover:border-white/20 transition-all duration-300 backdrop-blur-sm">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} p-[1px] mb-5`}>
                    <div className="w-full h-full bg-[#080715] rounded-xl flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/60 text-sm mb-4">{feature.desc}</p>
                  <div className="space-y-1.5">
                    {feature.features.map((item, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm text-white/50">
                        <CheckCircle className="w-3.5 h-3.5 text-[#1BD4CA] shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider flip />

      {/* How It Works */}
      <section id="how-it-works" className="pt-10 pb-14 relative bg-grid-pattern overflow-hidden">
        {/* Ambient lighting */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-[#7B6BFF] opacity-[0.06] blur-[100px] rounded-full"></div>
          <div className="absolute bottom-0 left-1/4 w-[300px] h-[200px] bg-[#1BD4CA] opacity-[0.04] blur-[100px] rounded-full"></div>
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[200px] bg-[#7B6BFF] opacity-[0.04] blur-[100px] rounded-full"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Heading */}
          <div className="text-center mb-10">
            <div className="inline-block px-4 py-1 rounded-full bg-[#7B6BFF]/10 border border-[#7B6BFF]/30 text-[#7B6BFF] text-xs font-bold uppercase tracking-wider mb-3">
              Simple Process
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">
              Get Started in <span className="bg-gradient-to-r from-[#7B6BFF] to-[#1BD4CA] bg-clip-text text-transparent">Minutes</span>
            </h2>
            <p className="text-white/50 text-sm max-w-md mx-auto">
              From signup to full automation in under 5 minutes. No technical knowledge needed.
            </p>
          </div>

          {/* Step cards */}
          <div className="relative grid md:grid-cols-3 gap-5 items-stretch">

            {/* Glowing connector arrows between cards */}
            <div className="hidden md:flex absolute inset-0 items-center pointer-events-none" style={{zIndex:0}}>
              {/* Arrow 1→2 */}
              <div className="absolute left-[33%] top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center gap-1">
                <div className="w-6 h-px bg-gradient-to-r from-[#1BD4CA]/60 to-[#7B6BFF]/60"></div>
                <div className="w-0 h-0" style={{borderTop:'4px solid transparent',borderBottom:'4px solid transparent',borderLeft:'6px solid rgba(123,107,255,0.7)'}}></div>
              </div>
              {/* Arrow 2→3 */}
              <div className="absolute left-[67%] top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center gap-1">
                <div className="w-6 h-px bg-gradient-to-r from-[#7B6BFF]/60 to-[#1BD4CA]/60"></div>
                <div className="w-0 h-0" style={{borderTop:'4px solid transparent',borderBottom:'4px solid transparent',borderLeft:'6px solid rgba(27,212,202,0.7)'}}></div>
              </div>
            </div>

            {/* Step 1 — Teal */}
            <div className="group relative" style={{zIndex:1}}>
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#1BD4CA]/25 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative h-full rounded-2xl border border-[#1BD4CA]/15 bg-gradient-to-br from-[#0B0F19] to-[#080715] p-6 overflow-hidden group-hover:border-[#1BD4CA]/40 transition-all duration-300"
                style={{boxShadow:'inset 0 0 40px rgba(27,212,202,0.04)'}}>
                {/* Card inner glow top */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#1BD4CA]/50 to-transparent"></div>
                {/* Step number */}
                <div className="absolute top-4 right-4 text-4xl font-black text-[#1BD4CA] opacity-[0.12] select-none">01</div>
                {/* Icon */}
                <div className="relative w-12 h-12 mb-4">
                  <div className="absolute inset-0 bg-[#1BD4CA] opacity-20 blur-lg rounded-xl"></div>
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#1BD4CA]/20 to-[#1BD4CA]/5 border border-[#1BD4CA]/30 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-[#1BD4CA]" />
                  </div>
                </div>
                {/* Step badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1BD4CA]/10 border border-[#1BD4CA]/20 mb-3">
                  <div className="w-1 h-1 rounded-full bg-[#1BD4CA]"></div>
                  <span className="text-[#1BD4CA] text-[10px] font-bold uppercase tracking-widest">Step 01</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5">Connect Apps</h3>
                <p className="text-white/50 text-sm leading-relaxed">Link Swiggy, Zomato, Uber & banks securely in one tap.</p>
              </div>
            </div>

            {/* Step 2 — Purple (elevated) */}
            <div className="group relative md:-mt-2 md:mb-2" style={{zIndex:1}}>
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#7B6BFF]/30 to-[#1BD4CA]/10 opacity-60 blur-sm"></div>
              <div className="relative h-full rounded-2xl border border-[#7B6BFF]/30 bg-gradient-to-br from-[#0D1020] to-[#080715] p-6 overflow-hidden"
                style={{boxShadow:'0 0 40px rgba(123,107,255,0.1), inset 0 0 40px rgba(123,107,255,0.06)'}}>
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#7B6BFF]/60 to-transparent"></div>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#7B6BFF] opacity-10 blur-3xl rounded-full"></div>
                <div className="absolute top-4 right-4 text-4xl font-black text-[#7B6BFF] opacity-[0.15] select-none">02</div>
                <div className="relative w-12 h-12 mb-4">
                  <div className="absolute inset-0 bg-[#7B6BFF] opacity-25 blur-lg rounded-xl"></div>
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#7B6BFF]/25 to-[#7B6BFF]/5 border border-[#7B6BFF]/40 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-[#7B6BFF]" />
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#7B6BFF]/10 border border-[#7B6BFF]/25 mb-3">
                  <div className="w-1 h-1 rounded-full bg-[#7B6BFF]"></div>
                  <span className="text-[#7B6BFF] text-[10px] font-bold uppercase tracking-widest">Step 02</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5">AI Analyzes</h3>
                <p className="text-white/50 text-sm leading-relaxed">AI categorizes every transaction and finds tax deductions instantly.</p>
              </div>
            </div>

            {/* Step 3 — Gold/Teal */}
            <div className="group relative" style={{zIndex:1}}>
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#1BD4CA]/15 to-[#F59E0B]/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative h-full rounded-2xl border border-[#1BD4CA]/12 bg-gradient-to-br from-[#0B0F19] to-[#080715] p-6 overflow-hidden group-hover:border-[#1BD4CA]/35 transition-all duration-300"
                style={{boxShadow:'inset 0 0 40px rgba(27,212,202,0.03)'}}>
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#F59E0B]/40 to-transparent"></div>
                <div className="absolute top-4 right-4 text-4xl font-black text-[#F59E0B] opacity-[0.12] select-none">03</div>
                <div className="relative w-12 h-12 mb-4">
                  <div className="absolute inset-0 bg-[#F59E0B] opacity-15 blur-lg rounded-xl"></div>
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#F59E0B]/15 to-[#1BD4CA]/10 border border-[#F59E0B]/25 flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-[#F59E0B]" />
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 mb-3">
                  <div className="w-1 h-1 rounded-full bg-[#F59E0B]"></div>
                  <span className="text-[#F59E0B] text-[10px] font-bold uppercase tracking-widest">Step 03</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5">You Prosper</h3>
                <p className="text-white/50 text-sm leading-relaxed">Save taxes, build wealth, and achieve your financial goals.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Pricing Section */}
      <section id="pricing" className="py-20 relative bg-grid-pattern overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] bg-[#1BD4CA] opacity-[0.04] blur-[140px] rounded-full"></div>
          <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-[#7B6BFF] opacity-[0.04] blur-[140px] rounded-full"></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold uppercase tracking-wider mb-4">
              Pricing Plans
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Start Free, Upgrade Anytime
            </h2>
            <p className="text-white/60 text-base max-w-xl mx-auto">
              No credit card required. Cancel anytime. All plans include 30-day money-back guarantee.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: "Starter",
                price: "Free",
                desc: "Perfect for new gig workers",
                features: [
                  "Track 2 platforms",
                  "Basic expense tracking",
                  "Monthly reports",
                  "Community support",
                  "Mobile app"
                ],
                color: "from-gray-500 to-gray-600",
                popular: false
              },
              {
                name: "Professional",
                price: "₹299",
                period: "/month",
                desc: "For serious earners",
                features: [
                  "Unlimited platforms",
                  "AI tax optimizer",
                  "Receipt scanner",
                  "Priority support",
                  "Auto-save goals",
                  "Credit monitoring",
                  "Export to Tally"
                ],
                color: "from-[#1BD4CA] to-[#7B6BFF]",
                popular: true
              },
       {
  name: "Fleet",
  price: "₹999",
  period: "/month",
  desc: "For team leaders",
  features: [
    "Everything in Pro",
    "Manage 10 drivers",
    "Fleet analytics",
    "Bulk tax filing",
    "API access",
    "Custom reports",
    "Dedicated manager"
  ],
  color: "from-[#1BD4CA] to-[#7B6BFF]",  // changed to blue → blue
  popular: false
}

            ].map((plan, i) => (
              <div key={i} className="relative group">
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] rounded-full text-xs font-bold text-white z-10 shadow-[0_0_20px_rgba(27,212,202,0.4)]">
                    MOST POPULAR
                  </div>
                )}
                {plan.popular && <div className="absolute -inset-px bg-gradient-to-br from-[#1BD4CA]/30 to-[#7B6BFF]/30 rounded-2xl blur-sm"></div>}
                <div className={`h-full bg-gradient-to-br from-[#0B0F19]/90 to-[#080715] border ${plan.popular ? 'border-[#1BD4CA]/40' : 'border-white/[0.07] group-hover:border-white/20'} rounded-2xl p-6 relative overflow-hidden transition-all duration-300`}>
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${plan.color} opacity-10 blur-3xl`}></div>
                  <h3 className="text-xl font-bold text-white mb-1.5">{plan.name}</h3>
                  <p className="text-white/60 text-sm mb-5">{plan.desc}</p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    {plan.period && <span className="text-white/50 text-sm">{plan.period}</span>}
                  </div>
                  <ul className="space-y-2 mb-5">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#1BD4CA] shrink-0 mt-0.5" />
                        <span className="text-white/80 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    onClick={() => openAuthModal('signup')}
                    className={`w-full py-3 rounded-xl font-bold transition-all ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] text-white hover:scale-[1.02]' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {plan.price === "Free" ? "Start Free" : "Start Trial"}
                  </button>

                  
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-white/50 mb-4">All paid plans include:</p>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { icon: Shield, text: "Bank-level security" },
                { icon: Clock, text: "24/7 support" },
                { icon: CreditCard, text: "No setup fees" },
                { icon: Award, text: "30-day guarantee" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-white/70">
                  <item.icon className="w-4 h-4 text-[#1BD4CA]" />
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider flip />

      {/* Reviews Section */}
      <section id="reviews" className="pt-10 pb-14 relative bg-grid-pattern overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#7B6BFF] opacity-[0.06] blur-[100px] rounded-full"></div>
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[200px] bg-[#1BD4CA] opacity-[0.04] blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[200px] bg-[#7B6BFF] opacity-[0.04] blur-[120px] rounded-full"></div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <div className="inline-block px-4 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/25 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-3">
              Real Stories
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Loved by <span className="bg-gradient-to-r from-yellow-400 to-[#1BD4CA] bg-clip-text text-transparent">50,000+</span> Gig Workers
            </h2>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="w-px h-4 bg-white/20"></div>
              <span className="text-white font-bold text-sm">4.8</span>
              <span className="text-white/40 text-sm">/ 5 · 12,000+ reviews</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Card 1 — Green */}
            <div className="group relative">
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative h-full rounded-2xl border border-green-500/15 bg-gradient-to-br from-[#0B0F19] to-[#080715] p-5 overflow-hidden group-hover:border-green-500/35 transition-all duration-300" style={{boxShadow:'inset 0 0 40px rgba(34,197,94,0.04)'}}>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent"></div>
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-green-500/15 border border-green-500/25">
                  <span className="text-green-400 text-[10px] font-black">₹4,000/mo saved</span>
                </div>
                <div className="text-5xl font-black text-green-400 opacity-20 leading-none mb-1 select-none">“</div>
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-white/75 text-sm leading-relaxed mb-5">Game changer! Saved ₹48,000 in taxes last year. The AI categorization is magical — just snap receipts and forget. Truly understands our needs.</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-green-400 opacity-30 blur-md rounded-full"></div>
                    <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-[#1BD4CA] flex items-center justify-center text-white font-black text-xs ring-1 ring-green-400/40">RS</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold text-sm">Rahul Sharma</div>
                    <div className="text-white/40 text-xs">Swiggy Partner · Mumbai</div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                    <div className="w-1 h-1 rounded-full bg-green-400"></div>
                    <span className="text-green-400 text-[9px] font-bold uppercase">Verified</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 2 — Teal elevated */}
            <div className="group relative md:-mt-2">
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#1BD4CA]/30 to-[#7B6BFF]/15 opacity-70 blur-sm"></div>
              <div className="relative h-full rounded-2xl border border-[#1BD4CA]/30 bg-gradient-to-br from-[#0C1118] to-[#080715] p-5 overflow-hidden" style={{boxShadow:'0 0 50px rgba(27,212,202,0.08), inset 0 0 40px rgba(27,212,202,0.05)'}}>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1BD4CA]/70 to-transparent"></div>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-40 h-20 bg-[#1BD4CA] opacity-[0.08] blur-2xl rounded-full"></div>
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-[#1BD4CA]/15 border border-[#1BD4CA]/30">
                  <span className="text-[#1BD4CA] text-[10px] font-black">+30% earnings</span>
                </div>
                <div className="text-5xl font-black text-[#1BD4CA] opacity-20 leading-none mb-1 select-none">“</div>
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-5">Finally, one app for everything! Connect all platforms, track earnings, save automatically. The heatmap helped me increase earnings by 30%. Brilliant work!</p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#1BD4CA]/10">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-[#1BD4CA] opacity-30 blur-md rounded-full"></div>
                    <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] flex items-center justify-center text-white font-black text-xs ring-1 ring-[#1BD4CA]/50">PP</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold text-sm">Priya Patel</div>
                    <div className="text-white/40 text-xs">Uber Driver · Bangalore</div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1BD4CA]/10 border border-[#1BD4CA]/25">
                    <div className="w-1 h-1 rounded-full bg-[#1BD4CA]"></div>
                    <span className="text-[#1BD4CA] text-[9px] font-bold uppercase">Verified</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 3 — Purple */}
            <div className="group relative">
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#7B6BFF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative h-full rounded-2xl border border-[#7B6BFF]/15 bg-gradient-to-br from-[#0B0F19] to-[#080715] p-5 overflow-hidden group-hover:border-[#7B6BFF]/35 transition-all duration-300" style={{boxShadow:'inset 0 0 40px rgba(123,107,255,0.04)'}}>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7B6BFF]/50 to-transparent"></div>
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-[#7B6BFF]/15 border border-[#7B6BFF]/25">
                  <span className="text-[#7B6BFF] text-[10px] font-black">5 hrs/month saved</span>
                </div>
                <div className="text-5xl font-black text-[#7B6BFF] opacity-20 leading-none mb-1 select-none">“</div>
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-white/75 text-sm leading-relaxed mb-5">The receipt scanner alone is worth it. Used to lose so many bills, now everything is digital and tax-ready. Support is super responsive. Highly recommend!</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-[#7B6BFF] opacity-30 blur-md rounded-full"></div>
                    <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-[#7B6BFF] to-[#1BD4CA] flex items-center justify-center text-white font-black text-xs ring-1 ring-[#7B6BFF]/40">AK</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold text-sm">Amit Kumar</div>
                    <div className="text-white/40 text-xs">Zomato Partner · Delhi</div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#7B6BFF]/10 border border-[#7B6BFF]/20">
                    <div className="w-1 h-1 rounded-full bg-[#7B6BFF]"></div>
                    <span className="text-[#7B6BFF] text-[9px] font-bold uppercase">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button className="group relative inline-flex items-center gap-2 px-7 py-3 rounded-xl text-white text-sm font-semibold overflow-hidden transition-all duration-300 hover:scale-[1.03]">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1BD4CA]/10 to-[#7B6BFF]/10 border border-white/10 rounded-xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#1BD4CA]/20 to-[#7B6BFF]/20 opacity-0 group-hover:opacity-100 rounded-xl transition-all duration-300"></div>
              <span className="relative">Read All 12,000+ Reviews</span>
              <ArrowRight className="relative w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* FAQ Section */}
      <section className="pt-8 pb-12 relative bg-grid-pattern overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#1BD4CA] opacity-[0.04] blur-[120px] rounded-full"></div>
          <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-[#7B6BFF] opacity-[0.04] blur-[120px] rounded-full"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Heading */}
          <div className="text-center mb-5">
            <div className="inline-block px-4 py-1 rounded-full bg-[#1BD4CA]/10 border border-[#1BD4CA]/25 text-[#1BD4CA] text-xs font-bold uppercase tracking-wider mb-2">
              FAQs
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Common <span className="bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] bg-clip-text text-transparent">Questions</span>
            </h2>
          </div>

          {/* Glowing container wrapping all items */}
          <div className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0B0F19]/70 to-[#080715]/50 overflow-hidden"
            style={{boxShadow:'inset 0 0 80px rgba(27,212,202,0.04), 0 0 60px rgba(0,0,0,0.4), 0 0 1px rgba(27,212,202,0.15)'}}>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1BD4CA]/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7B6BFF]/30 to-transparent"></div>

            {/* 2-column grid: first 4 items in pairs, last item full-width */}
            <div className="grid md:grid-cols-2">
              {[
                { q: "Who created Kamai?", a: "Built by a team passionate about empowering India's gig economy workers — made for gig workers, by gig workers.", accent: "#1BD4CA", n: "01" },
                { q: "How much can I really save on taxes?", a: "Most users save ₹4,000+ monthly through expense tracking, deductions, and GST compliance. AI ensures you never miss a deduction.", accent: "#7B6BFF", n: "02" },
                { q: "Is my financial data secure?", a: "Bank-level 256-bit encryption, RBI compliant. We never share your data. Your security is our absolute top priority.", accent: "#22C55E", n: "03" },
                { q: "Which platforms do you support?", a: "15+ platforms: Swiggy, Zomato, Uber, Ola, Rapido, Dunzo, Amazon Flex, and more. New platforms added monthly.", accent: "#1BD4CA", n: "04" },
                { q: "Can I try before paying?", a: "Yes! Start with our free plan or try Professional features free for 30 days. No credit card required.", accent: "#F59E0B", n: "05", full: true },
              ].map((faq, i) => (
                <div
                  key={i}
                  className={`group relative flex gap-4 p-5 transition-all duration-200 hover:bg-white/[0.025]
                    ${faq.full ? 'md:col-span-2 md:border-t border-white/[0.06]' : ''}
                    ${i === 0 ? 'md:border-r border-white/[0.06]' : ''}
                    ${i === 1 ? '' : ''}
                    ${i === 2 ? 'border-t border-white/[0.06] md:border-r border-white/[0.06]' : ''}
                    ${i === 3 ? 'border-t border-white/[0.06]' : ''}
                  `}
                >
                  <div className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{background:`linear-gradient(to bottom,transparent,${faq.accent},transparent)`}}></div>
                  <div className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black border mt-0.5"
                    style={{color:faq.accent,borderColor:`${faq.accent}30`,background:`${faq.accent}10`}}>
                    {faq.n}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm mb-1.5" style={{lineHeight:'1.4'}}>{faq.q}</h3>
                    <p className="text-white/50 text-sm leading-relaxed group-hover:text-white/65 transition-colors">{faq.a}</p>
                  </div>
                  <div className="shrink-0 mt-1 opacity-20 group-hover:opacity-60 transition-all duration-200" style={{color:faq.accent}}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider flip />

      {/* Final CTA Section */}
      <section className="pt-8 pb-10 relative bg-grid-pattern overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#1BD4CA] opacity-[0.06] blur-[130px] rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-[#7B6BFF] opacity-[0.05] blur-[100px] rounded-full"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Outer glow border layer */}
          <div className="relative">
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-[#1BD4CA]/30 via-[#7B6BFF]/20 to-[#1BD4CA]/30 blur-sm"></div>

            {/* Main container */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0C1020] via-[#080715] to-[#0A0D18] border border-white/[0.08] p-8 md:p-12"
              style={{boxShadow:'0 0 120px rgba(27,212,202,0.06), 0 0 60px rgba(123,107,255,0.06), inset 0 0 80px rgba(27,212,202,0.03)'}}>

              {/* Corner accent lines */}
              <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none">
                <div className="absolute top-0 left-6 right-0 h-px bg-gradient-to-r from-[#1BD4CA]/60 to-transparent"></div>
                <div className="absolute top-6 left-0 bottom-0 w-px bg-gradient-to-b from-[#1BD4CA]/60 to-transparent"></div>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                <div className="absolute top-0 left-0 right-6 h-px bg-gradient-to-l from-[#7B6BFF]/60 to-transparent"></div>
                <div className="absolute top-6 right-0 bottom-0 w-px bg-gradient-to-b from-[#7B6BFF]/60 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none">
                <div className="absolute bottom-0 left-6 right-0 h-px bg-gradient-to-r from-[#7B6BFF]/40 to-transparent"></div>
                <div className="absolute bottom-6 left-0 top-0 w-px bg-gradient-to-t from-[#7B6BFF]/40 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none">
                <div className="absolute bottom-0 left-0 right-6 h-px bg-gradient-to-l from-[#1BD4CA]/40 to-transparent"></div>
                <div className="absolute bottom-6 right-0 top-0 w-px bg-gradient-to-t from-[#1BD4CA]/40 to-transparent"></div>
              </div>

              {/* Inner corner ambient blobs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#7B6BFF] opacity-[0.08] blur-[80px] rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1BD4CA] opacity-[0.08] blur-[80px] rounded-full"></div>

              {/* Heading bloom */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-24 bg-[#1BD4CA] opacity-[0.07] blur-[60px] rounded-full"></div>

              {/* Content */}
              <div className="relative text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1BD4CA]/10 border border-[#1BD4CA]/25 mb-5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1BD4CA] animate-pulse"></div>
                  <span className="text-[#1BD4CA] text-xs font-bold uppercase tracking-wider">Join 50,000+ Gig Workers</span>
                </div>

                <h2 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">
                  Ready to Take<br />
                  <span className="bg-gradient-to-r from-[#1BD4CA] via-white to-[#7B6BFF] bg-clip-text text-transparent">Financial Control?</span>
                </h2>

                <p className="text-white/55 text-sm max-w-md mx-auto mb-7 leading-relaxed">
                  AI-powered income tracking, tax automation, and wealth building — made for India's gig workers.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-7">
                  {/* Primary */}
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="group relative px-8 py-4 rounded-2xl font-bold text-base overflow-hidden hover:scale-[1.03] transition-transform duration-200"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF]"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative text-white flex items-center gap-2.5">
                      <Rocket className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      Start Free Trial — No Card Needed
                    </span>
                  </button>
                  {/* Secondary */}
                  <button
                    onClick={() => setAiModalOpen(true)}
                    className="group px-8 py-4 rounded-2xl border border-white/15 hover:border-[#1BD4CA]/50 bg-white/[0.03] hover:bg-[#1BD4CA]/5 text-white font-semibold text-base transition-all duration-200 flex items-center gap-2.5"
                  >
                    <Sparkles className="w-4 h-4 text-[#1BD4CA] group-hover:scale-110 transition-transform" />
                    Try AI Demo First
                  </button>
                </div>

                {/* Trust strip */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {['RS','PP','AK','MV'].map((init, i) => (
                        <div key={i} className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-[8px] font-black text-white"
                          style={{background:`linear-gradient(135deg, ${i%2===0?'#1BD4CA':'#7B6BFF'}, ${i%2===0?'#7B6BFF':'#1BD4CA'})`}}>
                          {init}
                        </div>
                      ))}
                    </div>
                    <span className="text-white/40 text-xs">50,000+ active users</span>
                  </div>
                  <div className="hidden sm:block w-px h-4 bg-white/10"></div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                    <span className="text-white/40 text-xs ml-1">4.8/5 · 12k reviews</span>
                  </div>
                  <div className="hidden sm:block w-px h-4 bg-white/10"></div>
                  <span className="text-white/40 text-xs flex items-center gap-1">
                    <Shield className="w-3 h-3 text-green-400" />
                    RBI Compliant · 256-bit encrypted
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* CSS for animations and patterns */}
      <style jsx>{`
        @keyframes divider-shimmer {
          0%   { background-position: -200% center; opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { background-position: 200% center; opacity: 0; }
        }
        .animate-divider-shimmer {
          animation: divider-shimmer 3.5s ease-in-out infinite;
        }
        .bg-grid-pattern {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-gradient {
          animation: gradient 5s ease infinite;
        }
        .neon-text {
          background: linear-gradient(135deg, rgba(27,212,202,0.15), rgba(123,107,255,0.15));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Modals */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        mode={authMode}
      />
      
      <AIModal 
        isOpen={aiModalOpen} 
        onClose={() => setAiModalOpen(false)} 
      />
    </div>
  );
}