'use client';
import React, { useState, useEffect, useRef } from 'react';
import AuthModal from '@/components/ui/AuthModal';
import { 
  ArrowRight, Shield, TrendingUp, Users, Star, Menu, X, 
  CheckCircle, BarChart3, Zap, Target, Wallet, PieChart, 
  Code, Terminal, ChevronRight, Play, Lock, Globe, MessageSquare, 
  ScanLine, Upload, Sparkles, Send, Loader2, Bot, Check, Smartphone,
  TrendingDown, DollarSign, Calendar, FileText, Award, Clock,
  Brain, Rocket, Eye, Database, CreditCard, Bell, Settings,
  Activity, Layers, Cpu, Gem, Coins, IndianRupee
} from 'lucide-react';

// --- API KEYS ---
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyC_nOBKKLdB8Vo55MhaytiLucnZepK17LM";
const BYTEZ_API_KEY = process.env.NEXT_PUBLIC_BYTEZ_API_KEY || "2bfad2675b771d931788f344cbf73d1a";
const GEMINI_MODEL = "gemini-1.5-flash";

// --- PREDEFINED Q&A DATABASE ---
const predefinedResponses = {
  "who made you": "I was created by Omkar Parelkar and the Kamai. This innovative financial platform was built with passion to help gig workers in India manage their finances better.",
  "who created you": "I was created by Omkar Parelkar and the Kamai. This innovative financial platform was built with passion to help gig workers in India manage their finances better.",
  "who is your creator": "My creator is Omkar Parelkar, founder of Kamai. He built Kamai to revolutionize financial management for gig economy workers.",
  "who built Kamai": "Kamai was built by Omkar Parelkar and his company, Kamai. It's designed specifically for India's gig economy workers.",
  "company behind Kamai": "Kamai is a product of Kamai, founded by Omkar Parelkar. We're dedicated to empowering gig workers with smart financial tools.",
  "about omkar parelkar": "Omkar Parelkar is the visionary founder and CEO of Kamai, and the creator of Kamai. He's passionate about using AI and technology to solve real-world financial challenges for gig workers.",
  "what is Kamai": "Kamai is an AI-powered financial management platform created by Kamai specifically for gig workers in India. It helps you track earnings, save taxes, manage expenses, and build wealth.",
  "how can Kamai help me": "Kamai helps you: 1) Track earnings from multiple platforms, 2) Save up to ₹4,000+ monthly on taxes, 3) Scan and categorize receipts automatically, 4) Get AI-powered financial advice, 5) Build emergency funds with smart savings.",
  "tax savings": "Kamai can help you save ₹4,000+ monthly on taxes through: automatic expense tracking, GST compliance, receipt scanning, and smart deduction recommendations. All powered by AI.",
  "pricing": "Kamai offers three plans: Starter (Free) for basic tracking, Professional (₹299/month) with full AI features, and Fleet (₹999/month) for teams. All plans come with a 30-day free trial.",
  "supported platforms": "Kamai supports all major gig platforms including Swiggy, Zomato, Uber, Ola, Rapido, Dunzo, Amazon Flex, and 15+ other platforms. We automatically sync your earnings data.",
  "contact": "You can reach Kamai at support@Kamai.ai or visit our office in Mumbai. For immediate assistance, use the in-app chat feature.",
  "security": "Kamai uses bank-level 256-bit encryption, is RBI compliant, and never shares your data. Created by Kamai with security as our top priority."
};

// --- BYTEZ API HELPER ---
const callBytezChat = async (userMessage) => {
  try {
    // Dynamic import for client-side only
    const Bytez = (await import('bytez.js')).default;
    const sdk = new Bytez(BYTEZ_API_KEY);
    const model = sdk.model("Qwen/Qwen3-4B-Instruct-2507");
    
    const { error, output } = await model.run([
      {
        role: "system",
        content: "You are Kamai assistant, created by Omkar Parelkar and Kamai. Help users with financial advice for gig workers in India."
      },
      {
        role: "user",
        content: userMessage
      }
    ]);
    
    if (error) {
      console.error("Bytez Error:", error);
      return null;
    }
    
    return output;
  } catch (error) {
    console.error("Bytez API Error:", error);
    return null;
  }
};

// --- GEMINI API HELPERS ---
const callGeminiChat = async (history, userMessage) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  
  const systemPrompt = "You are Kamai, created by Omkar Parelkar and Kamai. You're a dedicated financial advisor for gig workers in India (Swiggy, Zomato, Uber drivers). Keep answers concise, helpful, and focused on maximizing earnings, saving taxes, and managing expenses in INR.";
  
  const contents = [
    { role: "user", parts: [{ text: systemPrompt }] },
    ...history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    })),
    { role: "user", parts: [{ text: userMessage }] }
  ];

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to AI service.";
  }
};

const callGeminiVision = async (base64Image, mimeType) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  
  const prompt = "Analyze this receipt image. Extract: merchant, date, amount (with ₹), category (Fuel/Food/Maintenance/Personal/Other), tax_deductible (boolean). Return ONLY valid JSON.";

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType: mimeType, data: base64Image } }
          ]
        }]
      })
    });
    const data = await response.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    text = text?.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Vision Error:", error);
    return null;
  }
};

// --- INTELLIGENT CHAT HANDLER ---
const getAIResponse = async (userMessage, history) => {
  // Convert message to lowercase for matching
  const lowerMessage = userMessage.toLowerCase();
  
  // Check predefined responses first
  for (const [key, response] of Object.entries(predefinedResponses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  
  // If no predefined response, try Bytez API first (lighter model)
  const bytezResponse = await callBytezChat(userMessage);
  if (bytezResponse) {
    return bytezResponse;
  }
  
  // Fallback to Gemini API for complex queries
  const geminiResponse = await callGeminiChat(history, userMessage);
  return geminiResponse;
};

// --- ANIMATED BACKGROUND ---
const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef([]);
  
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
    const particleCount = 100;
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
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
      ctx.fillStyle = 'rgba(8, 7, 21, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach((p, i) => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;
        
        // Bounce off walls
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        // Mouse interaction
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.x -= dx * 0.02;
          p.y -= dy * 0.02;
        }
        
        // Draw particle with glow
        const pulseSize = Math.sin(p.pulse) * 0.5 + 1;
        ctx.shadowBlur = 20;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color + '88';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * pulseSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Connect nearby particles
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p2 = particlesRef.current[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          
          if (dist2 < 120) {
            const opacity = (1 - dist2 / 120) * 0.3;
            ctx.strokeStyle = `rgba(123, 107, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', setSize);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

// --- AI MODAL ---
const AIModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m Kamai assistant, created by Kamai. Ask me about tax savings, earnings optimization, expense tracking, or anything about our platform!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    // Use the intelligent response handler
    const reply = await getAIResponse(userMsg, messages);
    setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    setIsTyping(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage({
          src: reader.result,
          base64: reader.result.split(',')[1],
          type: file.type
        });
        setScanResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!selectedImage) return;
    setIsScanning(true);
    const result = await callGeminiVision(selectedImage.base64, selectedImage.type);
    setScanResult(result);
    setIsScanning(false);
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
              <p className="text-xs text-[#1BD4CA]">Powered by Gemini & Bytez AI</p>
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
                        {msg.content}
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
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask about taxes, earnings, expenses, or who created Kamai..."
                      className="w-full bg-[#0B0F19] border border-white/10 rounded-2xl py-3.5 px-5 pr-14 text-white placeholder:text-white/30 focus:border-[#1BD4CA]/50 focus:outline-none transition-all"
                    />
                    <button 
                      onClick={handleSend}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] rounded-xl hover:scale-110 transition-all"
                    >
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-3 text-xs text-white/40">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Powered by Gemini & Bytez
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
                {!selectedImage ? (
                  <div className="h-full flex flex-col items-center justify-center">
                    <div className="relative w-full max-w-md">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                      />
                      <div className="border-2 border-dashed border-[#1BD4CA]/30 rounded-3xl p-12 text-center hover:border-[#1BD4CA] hover:bg-[#1BD4CA]/5 transition-all cursor-pointer">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#1BD4CA]/20 to-[#7B6BFF]/20 flex items-center justify-center">
                          <Upload className="w-10 h-10 text-[#1BD4CA]" />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">Upload Receipt</h4>
                        <p className="text-white/60 text-sm mb-4">Click or drag to upload</p>
                        <p className="text-xs text-white/40">Supports JPG, PNG, PDF (Max 5MB)</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-8 h-full">
                    <div className="space-y-4">
                      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black">
                        <img src={selectedImage.src} alt="Receipt" className="w-full h-auto" />
                        {isScanning && (
                          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#1BD4CA]/20 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-[#1BD4CA] animate-spin" />
                              </div>
                              <p className="text-[#1BD4CA] font-mono text-sm animate-pulse">ANALYZING...</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => { setSelectedImage(null); setScanResult(null); }}
                          className="flex-1 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all font-medium"
                        >
                          Clear
                        </button>
                        <button 
                          onClick={handleScan}
                          disabled={isScanning}
                          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] text-white font-bold hover:scale-[1.02] transition-all disabled:opacity-50"
                        >
                          {isScanning ? 'Scanning...' : 'Extract Data'}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-white/60 font-mono text-xs uppercase tracking-widest">Extraction Results</h4>
                      <div className="rounded-2xl bg-[#080715] border border-white/10 p-6 min-h-[300px]">
                        {!scanResult ? (
                          <div className="h-full flex items-center justify-center text-white/30">
                            Waiting for scan...
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {Object.entries(scanResult).map(([key, value]) => (
                              <div key={key} className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                <span className="text-white/60 text-sm capitalize">{key.replace('_', ' ')}</span>
                                <span className="text-white font-medium">{value.toString()}</span>
                              </div>
                            ))}
                            {scanResult.tax_deductible && (
                              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                                <div className="flex items-center gap-2 text-green-400">
                                  <CheckCircle className="w-5 h-5" />
                                  <span className="font-medium">Tax Deductible Expense</span>
                                </div>
                                <p className="text-xs text-green-400/80 mt-1">This expense can reduce your tax liability</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
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
                        <div key={i} className="w-8 bg-gradient-to-t from-[#1BD4CA] to-[#7B6BFF] rounded-t" style={{ height: `${height}%` }}></div>
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
                        <div key={zone} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
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
                          <div className="h-full w-[75%] bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] rounded-full"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/60">New Bike</span>
                          <span className="text-white">40%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full w-[40%] bg-gradient-to-r from-[#7B6BFF] to-[#1BD4CA] rounded-full"></div>
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

// --- MAIN COMPONENT ---
export default function HomePage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <div className="min-h-screen bg-[#080715] text-white overflow-x-hidden">
      
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Gradient Overlays */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1BD4CA] opacity-10 blur-[150px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#7B6BFF] opacity-10 blur-[150px]"></div>
      </div>
      
      {/* Header */}
      <header className={`fixed top-0 w-full z-40 transition-all duration-500 ${
        scrolled 
          ? 'bg-[#080715]/90 backdrop-blur-2xl border-b border-white/10 py-4' 
          : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <section className="relative pt-40 pb-32 md:pt-56 md:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
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
              <div className="absolute inset-0 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative text-black group-hover:text-white flex items-center gap-3">
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
          <div className="inline-block p-6 rounded-2xl border border-[#1BD4CA]/20 bg-[#1BD4CA]/5 backdrop-blur-sm">
            <h3 className="font-bold text-white mb-3 flex items-center justify-center gap-2">
              <Lock className="w-4 h-4 text-[#1BD4CA]" />
              Demo Account
            </h3>
            <div className="text-sm space-y-1 text-white/70">
              <p><span className="text-white/50">Email:</span> <span className="text-[#1BD4CA]">rahul@demo.com</span></p>
              <p><span className="text-white/50">Password:</span> <span className="text-[#1BD4CA]">password123</span></p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-20 border-t border-white/10">
            {[
              { icon: IndianRupee, val: "₹2.5Cr+", label: "Money Managed" },
              { icon: Users, val: "50,000+", label: "Active Users" },
              { icon: Globe, val: "15+", label: "Platforms" },
              { icon: Star, val: "4.8★", label: "User Rating" }
            ].map((stat, i) => (
              <div key={i} className="group">
                <stat.icon className="w-8 h-8 text-[#1BD4CA] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold text-white mb-1">{stat.val}</div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative bg-black/20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-1 rounded-full bg-[#1BD4CA]/10 border border-[#1BD4CA]/30 text-[#1BD4CA] text-xs font-bold uppercase tracking-wider mb-4">
              Core Features
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Everything You Need to
              <span className="block bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] bg-clip-text text-transparent">
                Maximize Earnings
              </span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Built specifically for India's gig economy workers. Connect, track, optimize, and grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                desc: "Gemini AI finds every deduction. Save ₹4,000+ monthly on taxes.",
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
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} p-[1px] mb-6`}>
                    <div className="w-full h-full bg-[#080715] rounded-2xl flex items-center justify-center">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/60 mb-6">{feature.desc}</p>
                  <div className="space-y-2">
                    {feature.features.map((item, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm text-white/50">
                        <CheckCircle className="w-4 h-4 text-[#1BD4CA]" />
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

      {/* How It Works */}
      <section id="how-it-works" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-1 rounded-full bg-[#7B6BFF]/10 border border-[#7B6BFF]/30 text-[#7B6BFF] text-xs font-bold uppercase tracking-wider mb-4">
              Simple Process
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Get Started in Minutes
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              From signup to full automation in under 5 minutes. No technical knowledge needed.
            </p>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 hidden md:block"></div>
            
            <div className="grid md:grid-cols-3 gap-12 relative">
              {[
                {
                  step: "01",
                  title: "Connect Apps",
                  desc: "Link Swiggy, Zomato, Uber & banks securely",
                  icon: Smartphone
                },
                {
                  step: "02",
                  title: "AI Analyzes",
                  desc: "Gemini categorizes every transaction instantly",
                  icon: Brain
                },
                {
                  step: "03",
                  title: "You Prosper",
                  desc: "Save taxes, build wealth, achieve goals",
                  icon: Rocket
                }
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className="bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/10 rounded-3xl p-8 relative z-10">
                    <div className="text-6xl font-bold text-white/5 absolute top-4 right-4">{item.step}</div>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] flex items-center justify-center mb-6">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-white/60">{item.desc}</p>
                  </div>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-12 rounded-full bg-[#080715] border border-white/10 flex items-center justify-center -translate-y-1/2 z-20">
                      <ChevronRight className="w-5 h-5 text-white/50" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 relative bg-black/20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold uppercase tracking-wider mb-4">
              Simple Pricing
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Choose Your Plan
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              No hidden fees. Cancel anytime. 30-day money-back guarantee.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "₹0",
                desc: "For new gig workers",
                features: ["1 platform", "Basic tracking", "Monthly reports", "Email support"],
                cta: "Start Free",
                popular: false
              },
              {
                name: "Professional",
                price: "₹299",
                desc: "For serious earners",
                features: ["Unlimited platforms", "AI tax optimizer", "Receipt scanner", "Priority support", "Goal savings", "Credit monitoring"],
                cta: "Start Free Trial",
                popular: true
              },
              {
                name: "Fleet",
                price: "₹999",
                desc: "For teams & fleets",
                features: ["25 members", "Custom integration", "White-label", "Dedicated manager", "API access", "Training"],
                cta: "Contact Sales",
                popular: false
              }
            ].map((plan, i) => (
              <div key={i} className={`relative ${plan.popular ? 'scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] text-white text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <div className={`bg-gradient-to-br from-[#0B0F19] to-[#080715] rounded-3xl p-8 h-full flex flex-col ${
                  plan.popular ? 'border-2 border-[#1BD4CA]' : 'border border-white/10'
                }`}>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-white/60 mb-6">{plan.desc}</p>
                  <div className="mb-8">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    {plan.price !== "₹0" && <span className="text-white/60">/month</span>}
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3 text-white/80">
                        <CheckCircle className="w-5 h-5 text-[#1BD4CA] shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => openAuthModal('signup')}
                    className={`w-full py-4 rounded-xl font-bold transition-all ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] text-white hover:scale-[1.02]' 
                        : 'border border-white/20 text-white hover:bg-white/5'
                    }
                                      >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-4">
              Success Stories
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Loved by 50,000+ Workers
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Real people, real results. See how Kamai is changing lives.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Rajesh Kumar",
                role: "Swiggy Partner, Mumbai",
                quote: "Kamai saved me ₹38,000 in taxes last year! The AI advisor is incredible.",
                rating: 5,
                metric: "₹38K saved",
                avatar: "RK"
              },
              {
                name: "Priya Sharma",
                role: "Uber Driver, Bangalore",
                quote: "Connected 3 platforms, now I see exactly where to drive for max earnings.",
                rating: 5,
                metric: "+42% earnings",
                avatar: "PS"
              },
              {
                name: "Amit Patel",
                role: "Zomato Partner, Delhi",
                quote: "Receipt scanner saves me hours. Just snap and forget. Tax filing is now easy!",
                rating: 5,
                metric: "12hrs saved/mo",
                avatar: "AP"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-white/50 text-sm">{testimonial.role}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-white/80 mb-6 italic">"{testimonial.quote}"</p>
                <div className="inline-block px-4 py-2 rounded-full bg-[#1BD4CA]/10 border border-[#1BD4CA]/30 text-[#1BD4CA] text-sm font-bold">
                  {testimonial.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1BD4CA]/10 to-[#7B6BFF]/10"></div>
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Ready to Take Control of
            <span className="block bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] bg-clip-text text-transparent">
              Your Financial Future?
            </span>
          </h2>
          <p className="text-white/60 text-xl mb-12 max-w-3xl mx-auto">
            Join 50,000+ gig workers saving an average of ₹4,500/month with Kamai's AI-powered automation. Created by Kamai.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={() => openAuthModal('signup')}
              className="px-12 py-5 bg-white text-black font-bold text-lg rounded-2xl hover:scale-105 transition-all"
            >
              Start Free Trial Now
            </button>
            <button 
              onClick={() => openAuthModal('login')}
              className="px-12 py-5 border-2 border-white/20 rounded-2xl text-white font-bold text-lg hover:bg-white/5 transition-all"
            >
              Try Demo Account
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-white/50 text-sm mt-12">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>30-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#080715] pt-24 pb-12 border-t border-white/10 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1BD4CA]/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
            
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-6 group cursor-pointer">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] p-[1px]">
                    <div className="w-full h-full bg-[#080715] rounded-2xl flex items-center justify-center">
                      <Gem className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <span className="text-2xl font-bold text-white">Kamai</span>
              </div>
              <p className="text-white/50 text-sm mb-6 leading-relaxed">
                AI-powered financial automation for India's gig economy workers. Built by Kamai with ❤️
              </p>
              <div className="flex gap-4">
                {[
                  { name: 'Twitter', icon: '𝕏' },
                  { name: 'LinkedIn', icon: 'in' },
                  { name: 'Instagram', icon: 'IG' },
                  { name: 'YouTube', icon: 'YT' }
                ].map(social => (
                  <div key={social.name} className="group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-white/5 hover:bg-gradient-to-br hover:from-[#1BD4CA]/20 hover:to-[#7B6BFF]/20 border border-white/10 hover:border-[#1BD4CA]/30 flex items-center justify-center transition-all">
                      <span className="text-xs font-bold text-white/60 group-hover:text-white">{social.icon}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h4 className="text-white/40 text-xs font-bold uppercase tracking-wider mb-6">Product</h4>
              <ul className="space-y-3">
                {['Features', 'Integrations', 'Pricing', 'Changelog', 'Roadmap', 'API'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-white/60 hover:text-white text-sm transition-colors relative group inline-block">
                      {item}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] group-hover:w-full transition-all duration-300"></span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h4 className="text-white/40 text-xs font-bold uppercase tracking-wider mb-6">Resources</h4>
              <ul className="space-y-3">
                {['Documentation', 'Help Center', 'Community', 'Blog', 'Tutorials', 'Status'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-white/60 hover:text-white text-sm transition-colors relative group inline-block">
                      {item}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] group-hover:w-full transition-all duration-300"></span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-white/40 text-xs font-bold uppercase tracking-wider mb-6">Company</h4>
              <ul className="space-y-3">
                {['About', 'Careers', 'Press', 'Partners', 'Contact', 'Legal'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-white/60 hover:text-white text-sm transition-colors relative group inline-block">
                      {item}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] group-hover:w-full transition-all duration-300"></span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="py-12 border-y border-white/10 mb-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
                <p className="text-white/60">Get the latest features and updates delivered to your inbox.</p>
              </div>
              <div className="flex gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#1BD4CA]/50 focus:outline-none transition-all"
                />
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] text-white font-bold hover:scale-105 transition-all">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-white/40">
              <span>© 2024 Kamai by Kamai.</span>
              <span className="text-white/20">•</span>
              <span>All rights reserved</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-white/60 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">Cookie Policy</a>
            </div>

            <div className="flex items-center gap-4 text-xs text-white/40">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Bank-level security</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>256-bit encryption</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Elements */}
      {scrolled && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(27,212,202,0.4)] hover:shadow-[0_0_50px_rgba(123,107,255,0.6)] hover:scale-110 transition-all z-40 group"
        >
          <ChevronRight className="w-6 h-6 text-white -rotate-90 group-hover:translate-y-[-2px] transition-transform" />
        </button>
      )}

      {/* Live Chat Button */}
      <button 
        onClick={() => setAiModalOpen(true)}
        className="fixed bottom-8 left-8 w-14 h-14 bg-gradient-to-br from-[#7B6BFF] to-[#1BD4CA] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(123,107,255,0.4)] hover:shadow-[0_0_50px_rgba(27,212,202,0.6)] hover:scale-110 transition-all z-40 group"
      >
        <MessageSquare className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Notification Toast */}
      {scrolled && (
        <div className="fixed top-24 right-8 bg-[#080715]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 pr-6 shadow-2xl z-40 animate-in slide-in-from-right duration-500 max-w-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-sm mb-1">New Feature Alert!</p>
              <p className="text-white/60 text-xs">Voice-activated expense tracking now available in beta. Powered by Kamai.</p>
            </div>
            <button className="text-white/40 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        mode={authMode} 
        onSwitchMode={setAuthMode} 
      />
      
      <AIModal 
        isOpen={aiModalOpen} 
        onClose={() => setAiModalOpen(false)} 
      />

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          animation: gradient 8s ease infinite;
        }

        .animate-in {
          animation-fill-mode: both;
        }

        .fade-in {
          animation: fadeIn 0.5s ease;
        }

        .slide-in-from-bottom-4 {
          animation: slideInFromBottom4 0.5s ease;
        }

        .slide-in-from-bottom-8 {
          animation: slideInFromBottom8 0.5s ease;
        }

        .slide-in-from-right {
          animation: slideInFromRight 0.5s ease;
        }

        .zoom-in-95 {
          animation: zoomIn95 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInFromBottom4 {
          from { 
            opacity: 0;
            transform: translateY(1rem);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromBottom8 {
          from { 
            opacity: 0;
            transform: translateY(2rem);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromRight {
          from { 
            opacity: 0;
            transform: translateX(2rem);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes zoomIn95 {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #080715;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #1BD4CA, #7B6BFF);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7B6BFF, #1BD4CA);
        }
      `}</style>
    </div>
  );
}