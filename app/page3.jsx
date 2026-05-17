'use client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, Shield, TrendingUp, Users, Star, Menu, X, 
  CheckCircle, BarChart3, Zap, Target, Wallet, PieChart, 
  Code, Terminal, ChevronRight, Play, Lock, Globe, MessageSquare, 
  ScanLine, Upload, Sparkles, Send, Loader2, Bot, Check, Smartphone,
  TrendingDown, DollarSign, Calendar, FileText, Award, Clock
} from 'lucide-react';

// --- GEMINI API HELPERS ---
const GEMINI_MODEL_TEXT = "gemini-2.5-flash-preview-09-2025";
const GEMINI_MODEL_VISION = "gemini-2.5-flash-preview-09-2025";

const callGeminiChat = async (history, userMessage) => {
  const apiKey = ""; // Injected at runtime
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL_TEXT}:generateContent?key=${apiKey}`;
  
  const systemPrompt = "You are Kamai, a dedicated financial advisor for gig workers in India (Swiggy, Zomato, Uber drivers). Keep answers concise, helpful, and focused on maximizing earnings, saving taxes, and managing expenses in INR.";
  
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
  const apiKey = ""; // Injected at runtime
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL_VISION}:generateContent?key=${apiKey}`;
  
  const prompt = "Analyze this receipt image. Extract the following fields and return ONLY a valid JSON object: 'merchant' (string), 'date' (string), 'amount' (string with currency symbol), 'category' (suggest one: Fuel, Food, Maintenance, Personal, Other), 'tax_deductible' (boolean). Do not use markdown formatting.";

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
    console.error("Gemini Vision Error:", error);
    return null;
  }
};

// --- PARTICLE GRID BACKGROUND ---
const ParticleGrid = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const particles = [];
    const particleCount = 80;
    const connectionDistance = 150;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
      });
    }

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 100) {
          p.x -= dx * 0.01;
          p.y -= dy * 0.01;
        }

        ctx.fillStyle = 'rgba(27, 212, 202, 0.6)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist2 < connectionDistance) {
            const opacity = (1 - dist2 / connectionDistance) * 0.3;
            ctx.strokeStyle = `rgba(123, 107, 255, ${opacity})`;
            ctx.lineWidth = 1;
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
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-40"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

// --- AI MODAL ---
const AIModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your Kamai financial assistant. Ask me about tax savings, gig earnings, or expense tracking.' }
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

    const reply = await callGeminiChat(messages, userMsg);
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative bg-[#0B0F19] border border-white/10 rounded-3xl shadow-2xl w-full max-w-4xl h-[600px] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#080715]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] flex items-center justify-center shadow-[0_0_15px_rgba(27,212,202,0.3)]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Kamai Intelligence</h3>
              <p className="text-xs text-[#1BD4CA]">Powered by Gemini 2.5</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-[#BEBEC2] hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 bg-[#080715] border-r border-white/5 p-4 hidden md:flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'chat' ? 'bg-white/10 text-white border border-white/5 shadow-lg' : 'text-[#BEBEC2] hover:bg-white/5'}`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Smart Advisor</span>
            </button>
            <button 
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'scanner' ? 'bg-white/10 text-white border border-white/5 shadow-lg' : 'text-[#BEBEC2] hover:bg-white/5'}`}
            >
              <ScanLine className="w-5 h-5" />
              <span className="font-medium">Receipt Scanner</span>
            </button>
          </div>

          <div className="flex-1 bg-[#0B0F19] relative">
            
            {activeTab === 'chat' && (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-white/10' : 'bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF]'}`}>
                        {msg.role === 'user' ? <Users className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                      </div>
                      <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-white text-black font-medium' 
                          : 'bg-[#151925] border border-white/5 text-[#BEBEC2]'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] flex items-center justify-center shrink-0">
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      </div>
                      <div className="bg-[#151925] border border-white/5 px-4 py-3 rounded-2xl">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-[#BEBEC2] rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-[#BEBEC2] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-[#BEBEC2] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="p-4 border-t border-white/5 bg-[#080715]">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask about your finances..."
                      className="w-full bg-[#0B0F19] border border-white/10 rounded-xl py-3 px-4 pr-12 text-white focus:border-[#1BD4CA] focus:ring-1 focus:ring-[#1BD4CA] outline-none transition-all placeholder:text-gray-600"
                    />
                    <button 
                onClick={() => openAuthModal('signup')}
                className="w-full py-4 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-all"
              >
                Start Free
              </button>
            </div>

            {/* Pro Plan */}
            <div className="relative rounded-3xl bg-gradient-to-br from-[#0B0F19] to-[#080715] border-2 border-[#1BD4CA] p-8 shadow-[0_0_40px_rgba(27,212,202,0.2)] transform scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
              <p className="text-[#BEBEC2] mb-6">For serious earners</p>
              <div className="mb-8">
                <span className="text-5xl font-bold text-white">₹299</span>
                <span className="text-[#BEBEC2]">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Unlimited platforms', 'AI tax optimization', 'Receipt scanner (Gemini Vision)', 'Goal-based savings', 'Priority support', 'Live earning heatmaps'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-white">
                    <div className="w-5 h-5 rounded-full bg-[#1BD4CA]/20 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#1BD4CA]" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => openAuthModal('signup')}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] text-white font-bold shadow-[0_0_30px_rgba(27,212,202,0.3)] hover:shadow-[0_0_50px_rgba(123,107,255,0.5)] hover:scale-105 transition-all"
              >
                Start Free Trial
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="relative rounded-3xl bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/5 p-8 hover:border-white/20 transition-all">
              <h3 className="text-2xl font-bold text-white mb-2">Fleet</h3>
              <p className="text-[#BEBEC2] mb-6">For teams & fleets</p>
              <div className="mb-8">
                <span className="text-5xl font-bold text-white">₹999</span>
                <span className="text-[#BEBEC2]">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Up to 25 members', 'Dedicated account manager', 'Custom integrations', 'White-label reports', 'Advanced analytics', 'API access'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-[#BEBEC2]">
                    <Check className="w-5 h-5 text-[#7B6BFF] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => openAuthModal('signup')}
                className="w-full py-4 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-all"
              >
                Contact Sales
              </button>
            </div>
          </div>

          <p className="text-center text-[#BEBEC2] mt-12">
            All plans include 30-day free trial. No credit card required.
          </p>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section id="testimonials" className="py-32 relative bg-[#0B0F19]/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-20">
            <div className="inline-block text-[#1BD4CA] font-mono text-sm mb-4 uppercase tracking-widest">Success Stories</div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Loved by 50,000+ Workers</h2>
            <p className="text-[#BEBEC2] text-lg max-w-2xl mx-auto">Real people, real results.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Rajesh Kumar',
                role: 'Swiggy Delivery Partner',
                location: 'Mumbai',
                quote: 'Kamai saved me ₹38,000 in taxes last year. The AI advisor is like having a CA in my pocket!',
                avatar: '👨',
                savings: '₹38K saved'
              },
              {
                name: 'Priya Sharma',
                role: 'Uber Driver',
                location: 'Bangalore',
                quote: 'I connected 3 platforms and now I see exactly where to drive for maximum earnings. Game changer.',
                avatar: '👩',
                savings: '+42% earnings'
              },
              {
                name: 'Amit Patel',
                role: 'Zomato & Dunzo',
                location: 'Delhi',
                quote: 'The receipt scanner alone is worth it. No more manual entry. Just snap and forget.',
                avatar: '👨‍🦱',
                savings: '12hrs saved/month'
              }
            ].map((testimonial, i) => (
              <div key={i} className="relative rounded-3xl bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/5 p-8 hover:border-[#1BD4CA]/30 transition-all group">
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-[#BEBEC2] text-sm">{testimonial.role}</p>
                    <p className="text-[#575861] text-xs">{testimonial.location}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FFD86C] text-[#FFD86C]" />
                    ))}
                  </div>
                </div>
                <p className="text-[#BEBEC2] leading-relaxed mb-6 italic">"{testimonial.quote}"</p>
                <div className="inline-block bg-[#1BD4CA]/10 border border-[#1BD4CA]/20 rounded-full px-4 py-1.5 text-[#1BD4CA] text-sm font-semibold">
                  {testimonial.savings}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- INTEGRATIONS SHOWCASE --- */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="order-2 lg:order-1">
              <div className="relative bg-[#0B0F19] border border-white/10 rounded-3xl p-10 shadow-2xl">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] p-[2px]">
                      <div className="w-full h-full bg-[#0B0F19] rounded-full flex items-center justify-center">
                        <span className="font-bold text-white text-sm">F</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-white font-bold">Kamai Core</div>
                      <div className="text-xs text-[#27C93F] flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#27C93F] animate-pulse"></div> All Systems Active
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-[#BEBEC2] font-mono">v2.4.0</div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { name: 'Swiggy Partner API', status: 'Connected', color: 'green' },
                    { name: 'Zomato Delivery', status: 'Connected', color: 'red' },
                    { name: 'Uber Driver Portal', status: 'Connected', color: 'cyan' },
                    { name: 'HDFC Bank', status: 'Syncing...', color: 'blue' }
                  ].map((integration, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[#080715] border border-white/5 hover:border-white/10 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-all">
                          <Globe className="w-5 h-5 text-[#BEBEC2]" />
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">{integration.name}</div>
                          <div className="text-xs text-[#BEBEC2]">Real-time sync</div>
                        </div>
                      </div>
                      <div className={`text-xs font-mono text-${integration.color}-500 flex items-center gap-2`}>
                        <div className={`w-2 h-2 rounded-full bg-${integration.color}-500 ${integration.status === 'Syncing...' ? 'animate-pulse' : ''}`}></div>
                        {integration.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="absolute -inset-4 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] blur-3xl opacity-10 -z-10"></div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-block text-[#7B6BFF] font-mono text-sm mb-4 uppercase tracking-widest">Seamless Integrations</div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Connect Everything<br />You Use Daily
              </h2>
              <p className="text-[#BEBEC2] text-lg mb-8 leading-relaxed">
                No manual data entry. Kamai pulls earnings and expenses directly from your gig platforms via official APIs and secure bank connections.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-10">
                {['Swiggy Partner', 'Zomato Delivery', 'Uber Driver', 'Ola', 'Rapido', 'Shadowfax', 'Dunzo', 'PhonePe'].map((app) => (
                  <div key={app} className="flex items-center gap-3 p-3 rounded-xl bg-[#0B0F19] border border-white/5 hover:border-[#1BD4CA]/30 transition-all">
                    <div className="w-2 h-2 rounded-full bg-[#27C93F] shadow-[0_0_6px_#27C93F]"></div>
                    <span className="text-sm font-medium text-white">{app}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => openAuthModal('signup')}
                className="px-8 py-4 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] text-white font-bold rounded-xl shadow-[0_0_30px_rgba(27,212,202,0.3)] hover:shadow-[0_0_50px_rgba(123,107,255,0.5)] hover:scale-105 transition-all inline-flex items-center gap-3"
              >
                View All Integrations
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-32 relative bg-[#0B0F19]/30 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-20">
            <div className="inline-block text-[#1BD4CA] font-mono text-sm mb-4 uppercase tracking-widest">Common Questions</div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">FAQ</h2>
            <p className="text-[#BEBEC2] text-lg">Everything you need to know about Kamai.</p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: 'Is my financial data secure?',
                a: 'Yes. We use bank-grade 256-bit encryption and never store your login credentials. All connections use secure OAuth protocols.'
              },
              {
                q: 'Do I need to pay for the AI features?',
                a: 'AI chat is included in all plans. Receipt scanner (Gemini Vision) is available on Pro and Fleet plans.'
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Absolutely. No contracts, no cancellation fees. You can downgrade or cancel from your dashboard anytime.'
              },
              {
                q: 'Which platforms do you support?',
                a: 'Currently: Swiggy, Zomato, Uber, Ola, Rapido, Shadowfax, Dunzo, and 8+ more. New integrations added monthly.'
              },
              {
                q: 'Do you offer refunds?',
                a: 'We offer a 30-day money-back guarantee. If you\'re not satisfied, we\'ll refund you in full—no questions asked.'
              }
            ].map((faq, i) => (
              <div key={i} className="bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1BD4CA]/10 flex items-center justify-center border border-[#1BD4CA]/20 shrink-0">
                    <span className="text-[#1BD4CA] font-bold text-sm">{i + 1}</span>
                  </div>
                  {faq.q}
                </h3>
                <p className="text-[#BEBEC2] leading-relaxed pl-11">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(27,212,202,0.15),transparent_70%)]"></div>
        <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <div className="w-[260px] h-[6px] rounded-full bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] mx-auto mb-12 shadow-[0_0_20px_rgba(27,212,202,0.3)]"></div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Ready to Maximize<br />Your Earnings?
          </h2>
          <p className="text-[#BEBEC2] text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
            Join 50,000+ gig workers who are saving an average of <span className="text-[#1BD4CA] font-bold">₹4,500/month</span> with Kamai's AI-powered financial automation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <button 
              onClick={() => openAuthModal('signup')}
              className="px-12 py-5 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] text-white font-bold text-lg rounded-2xl shadow-[0_0_40px_rgba(27,212,202,0.4)] hover:shadow-[0_0_60px_rgba(123,107,255,0.6)] hover:scale-110 transition-all"
            >
              Start Free Trial Now
            </button>
            <button 
              onClick={() => setAiModalOpen(true)}
              className="px-12 py-5 border-2 border-white/20 rounded-2xl text-white font-semibold text-lg hover:bg-white/5 hover:border-[#1BD4CA] transition-all flex items-center gap-3"
            >
              <Play className="w-5 h-5 text-[#1BD4CA]" /> Watch Demo
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-[#BEBEC2] text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-[#27C93F]" />
              <span>30-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-[#27C93F]" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-[#27C93F]" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#080715] pt-24 pb-12 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
            
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] flex items-center justify-center shadow-[0_0_15px_rgba(27,212,202,0.4)]">
                  <span className="font-bold text-white text-lg">F</span>
                </div>
                <span className="text-xl font-bold text-white">Kamai</span>
              </div>
              <p className="text-[#BEBEC2] text-sm leading-relaxed mb-6 max-w-xs">
                AI-powered financial automation for India's gig economy workers. Track, optimize, and scale your earnings effortlessly.
              </p>
              <div className="flex gap-4">
                {['Twitter', 'LinkedIn', 'Instagram'].map(social => (
                  <div key={social} className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#1BD4CA]/50 flex items-center justify-center cursor-pointer transition-all group">
                    <div className="w-4 h-4 bg-[#BEBEC2] group-hover:bg-[#1BD4CA] transition-colors"></div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[#9EA0A6] text-xs font-bold uppercase tracking-[2px] mb-6">Product</div>
              <ul className="space-y-4">
                {['Features', 'Integrations', 'Pricing', 'Changelog', 'Roadmap'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-[#BEBEC2] hover:text-white transition-colors text-sm">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-[#9EA0A6] text-xs font-bold uppercase tracking-[2px] mb-6">Resources</div>
              <ul className="space-y-4">
                {['Documentation', 'API Reference', 'Community', 'Help Center', 'Status'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-[#BEBEC2] hover:text-white transition-colors text-sm">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-[#9EA0A6] text-xs font-bold uppercase tracking-[2px] mb-6">Company</div>
              <ul className="space-y-4">
                {['About', 'Careers', 'Blog', 'Press Kit', 'Contact'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-[#BEBEC2] hover:text-white transition-colors text-sm">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-[#9EA0A6]">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] flex items-center justify-center">
                <span className="text-white font-bold text-xs">F</span>
              </div>
              <span>© 2024 Kamai Inc. All rights reserved.</span>
            </div>
            <div className="flex gap-8 text-sm">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(link => (
                <a key={link} href="#" className="text-[#BEBEC2] hover:text-white transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* --- MODALS --- */}
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

      {/* Scroll to top indicator */}
      {scrolled && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(27,212,202,0.4)] hover:shadow-[0_0_50px_rgba(123,107,255,0.6)] hover:scale-110 transition-all z-40 animate-in fade-in slide-in-from-bottom-4"
        >
          <ChevronRight className="w-6 h-6 text-white -rotate-90" />
        </button>
      )}
    </div>
  );
} 
                      onClick={handleSend}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#1BD4CA] hover:bg-[#7B6BFF] rounded-lg transition-colors text-white"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'scanner' && (
              <div className="h-full p-6 overflow-y-auto">
                {!selectedImage ? (
                  <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl bg-[#080715]/50 hover:bg-[#080715] hover:border-[#1BD4CA]/50 transition-all group cursor-pointer relative">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <div className="w-16 h-16 bg-[#1BD4CA]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#1BD4CA]/20 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-[#1BD4CA]" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Upload Receipt</h4>
                    <p className="text-[#BEBEC2]">Supports JPG, PNG (Max 5MB)</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-8 h-full">
                    <div className="flex flex-col gap-4">
                      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black aspect-[3/4] md:aspect-auto flex-1">
                        <img src={selectedImage.src} alt="Receipt" className="w-full h-full object-contain" />
                        {isScanning && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                             <div className="absolute top-0 w-full h-1 bg-[#1BD4CA] shadow-[0_0_20px_#1BD4CA] animate-pulse"></div>
                             <div className="flex flex-col items-center gap-2">
                               <Loader2 className="w-8 h-8 text-[#1BD4CA] animate-spin" />
                               <span className="text-[#1BD4CA] font-mono text-sm">ANALYZING PIXELS...</span>
                             </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => { setSelectedImage(null); setScanResult(null); }}
                          className="flex-1 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-medium"
                        >
                          Clear
                        </button>
                        <button 
                          onClick={handleScan}
                          disabled={isScanning}
                          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] text-white font-bold shadow-lg shadow-[#1BD4CA]/20 hover:scale-[1.02] transition-transform disabled:opacity-50"
                        >
                          {isScanning ? 'Scanning...' : 'Extract Data'}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <h4 className="text-[#BEBEC2] font-mono text-xs uppercase tracking-widest mb-4">Extraction Results</h4>
                      <div className="flex-1 rounded-2xl bg-[#080715] border border-white/5 p-6 font-mono text-sm relative overflow-hidden">
                        {!scanResult ? (
                          <div className="absolute inset-0 flex items-center justify-center text-[#BEBEC2]/30">
                            Waiting for analysis...
                          </div>
                        ) : (
                          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <div><span className="text-[#7B6BFF]">{"{"}</span></div>
                             {Object.entries(scanResult).map(([key, value], i) => (
                               <div key={key} className="pl-4">
                                 <span className="text-[#1BD4CA]">"{key}"</span>: <span className={
                                   typeof value === 'number' ? "text-[#C6C6FF]" : 
                                   typeof value === 'boolean' ? "text-[#FF5F56]" : "text-[#FFD86C]"
                                 }>{JSON.stringify(value)}</span>{i < Object.keys(scanResult).length - 1 ? ',' : ''}
                               </div>
                             ))}
                             <div><span className="text-[#7B6BFF]">{"}"}</span></div>
                             
                             <div className="mt-8 pt-6 border-t border-white/5">
                                <div className="flex items-center gap-2 mb-2">
                                  <CheckCircle className="w-4 h-4 text-[#27C93F]" />
                                  <span className="text-white font-sans font-bold">Expense Categorized</span>
                                </div>
                                <p className="text-[#BEBEC2] font-sans text-xs">
                                  This receipt has been automatically tagged as <span className="text-white bg-white/10 px-1 rounded">{scanResult.category}</span>
                                </p>
                             </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

// --- AUTH MODAL ---
const AuthModal = ({ isOpen, onClose, mode, onSwitchMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-[#0B0F19] border border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="absolute top-4 right-4 z-10">
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(123,107,255,0.3)]">
              <span className="text-2xl font-bold text-white">F</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              {mode === 'login' ? 'Welcome Back' : 'Join Kamai'}
            </h2>
            <p className="text-[#BEBEC2] mt-2">
              {mode === 'login' 
                ? 'Access your financial command center' 
                : 'Start automating your gig finances'}
            </p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-[#BEBEC2] uppercase tracking-wider mb-2">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl bg-[#080715] border border-white/5 text-white focus:border-[#7B6BFF] focus:ring-1 focus:ring-[#7B6BFF] outline-none transition-all placeholder:text-gray-700"
                  placeholder="John Doe"
                />
              </div>
            )}
            
            <div>
              <label className="block text-xs font-semibold text-[#BEBEC2] uppercase tracking-wider mb-2">Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 rounded-xl bg-[#080715] border border-white/5 text-white focus:border-[#7B6BFF] focus:ring-1 focus:ring-[#7B6BFF] outline-none transition-all placeholder:text-gray-700"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#BEBEC2] uppercase tracking-wider mb-2">Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 rounded-xl bg-[#080715] border border-white/5 text-white focus:border-[#7B6BFF] focus:ring-1 focus:ring-[#7B6BFF] outline-none transition-all placeholder:text-gray-700"
                placeholder="••••••••"
              />
            </div>

            <button className="w-full bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(27,212,202,0.2)] hover:shadow-[0_0_30px_rgba(123,107,255,0.4)] hover:scale-[1.02] transition-all active:scale-[0.98]">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#BEBEC2] text-sm">
              {mode === 'login' ? "New to Kamai? " : "Already a member? "}
              <button 
                onClick={() => onSwitchMode(mode === 'login' ? 'signup' : 'login')}
                className="text-[#1BD4CA] font-semibold hover:text-[#7B6BFF] transition-colors"
              >
                {mode === 'login' ? 'Start Free' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
        
        <div className="h-1 w-full bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF]"></div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function KamaiLanding() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setMobileMenuOpen(false);
        }
      });
    });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#080715] text-white selection:bg-[#1BD4CA] selection:text-black font-sans overflow-x-hidden">
      
      {/* Particle Background */}
      <ParticleGrid />
      
      {/* --- HEADER --- */}
      <header 
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          scrolled 
            ? 'bg-[#080715]/95 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] flex items-center justify-center shadow-[0_0_20px_rgba(27,212,202,0.4)] group-hover:shadow-[0_0_30px_rgba(123,107,255,0.6)] transition-all">
                <span className="font-bold text-white text-xl">F</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-[#1BD4CA] transition-colors">Kamai</span>
            </div>

            <nav className="hidden md:flex items-center space-x-10">
              {['Features', 'How It Works', 'Pricing', 'Testimonials'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s/g, '-')}`} 
                  className="text-sm font-medium text-[#BEBEC2] hover:text-white transition-colors relative group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={() => setAiModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 transition-all group"
              >
                <Sparkles className="w-4 h-4 text-[#1BD4CA] group-hover:animate-pulse" />
                <span>Try AI Demo</span>
              </button>
              <button 
                onClick={() => openAuthModal('login')}
                className="text-sm font-semibold text-white hover:text-[#1BD4CA] transition-colors"
              >
                Log In
              </button>
              <button 
                onClick={() => openAuthModal('signup')}
                className="bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(27,212,202,0.3)] hover:shadow-[0_0_30px_rgba(123,107,255,0.5)] hover:scale-105 transition-all"
              >
                Start Free →
              </button>
            </div>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#0B0F19]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl md:hidden p-4 flex flex-col gap-2 animate-in slide-in-from-top duration-200">
            <button 
              onClick={() => { setAiModalOpen(true); setMobileMenuOpen(false); }}
              className="w-full mb-2 p-3 bg-white/5 rounded-xl font-medium text-white flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[#1BD4CA]" /> AI Demo
            </button>
            {['Features', 'How It Works', 'Pricing', 'Testimonials'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                className="p-3 text-[#BEBEC2] hover:bg-white/5 rounded-xl font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <button 
              onClick={() => openAuthModal('signup')}
              className="w-full mt-2 p-3 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] text-white rounded-xl font-bold shadow-lg"
            >
              Get Started
            </button>
          </div>
        )}
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-32 md:pt-56 md:pb-40 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(27,212,202,0.15),transparent_50%)] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 bg-[#0A0B12] border border-white/10 rounded-full px-5 py-2 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 hover:border-[#1BD4CA]/50 transition-all group">
            <div className="w-2 h-2 rounded-full bg-[#1BD4CA] shadow-[0_0_8px_#1BD4CA] animate-pulse"></div>
            <span className="text-xs font-semibold text-[#BEBEC2] uppercase tracking-widest">AI-Powered Financial OS for Gig Workers</span>
            <Sparkles className="w-3 h-3 text-[#7B6BFF] group-hover:animate-spin" />
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight mb-8 leading-[1.05] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Stop Guessing.<br />
            <span className="bg-gradient-to-r from-[#1BD4CA] via-[#7B6BFF] to-[#1BD4CA] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Start Earning Smarter.
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-[#BEBEC2] mb-14 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Kamai connects all your gig platforms, tracks every rupee in real-time, and automatically optimizes your taxes. Built for Swiggy, Zomato, Uber & more.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <button 
              onClick={() => openAuthModal('signup')}
              className="group relative px-10 py-5 bg-white text-black text-lg font-bold rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(27,212,202,0.6)] transition-all hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-3">
                Start Free Trial <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
            </button>
            
            <button 
              onClick={() => setAiModalOpen(true)}
              className="px-10 py-5 bg-transparent border-2 border-white/20 text-white text-lg font-semibold rounded-2xl hover:bg-white/5 hover:border-[#1BD4CA] transition-all flex items-center gap-3 group backdrop-blur-sm"
            >
              <Sparkles className="w-5 h-5 text-[#1BD4CA] group-hover:scale-125 transition-transform" /> 
              Try AI Assistant
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-16 border-t border-white/5 pt-16 max-w-5xl mx-auto animate-in fade-in duration-700 delay-500">
             {[
               { val: "₹2.5Cr+", label: "Earnings Managed", icon: TrendingUp },
               { val: "50,000+", label: "Active Users", icon: Users },
               { val: "15+", label: "Platform Integrations", icon: Globe }
             ].map((stat, i) => (
               <div key={i} className="flex flex-col items-center px-6 group">
                 <stat.icon className="w-8 h-8 text-[#1BD4CA] mb-3 group-hover:scale-110 transition-transform" />
                 <div className="text-4xl font-bold text-white mb-2">{stat.val}</div>
                 <div className="text-xs font-semibold text-[#575861] uppercase tracking-wider">{stat.label}</div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-32 relative bg-[#0B0F19]/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-20">
            <div className="inline-block text-[#1BD4CA] font-mono text-sm mb-4 uppercase tracking-widest">Core Features</div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Everything You Need to Scale</h2>
            <p className="text-[#BEBEC2] text-lg max-w-2xl mx-auto">Full-stack financial automation designed specifically for India's gig economy workers.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* Feature 1 - Real-time Sync */}
            <div className="group relative rounded-3xl bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/5 p-10 overflow-hidden hover:border-[#1BD4CA]/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1BD4CA]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-[#1BD4CA]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#1BD4CA]/20 group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8 text-[#1BD4CA]" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Real-Time Income Sync</h3>
                <p className="text-[#BEBEC2] mb-6 leading-relaxed text-lg">
                  Connect Swiggy, Zomato, Uber, and bank accounts via secure APIs. Every rupee tracked automatically.
                </p>
                <ul className="space-y-3">
                  {['Bank-grade 256-bit encryption', 'Instant payout notifications', 'Multi-platform aggregation'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-[#BEBEC2]">
                      <div className="w-5 h-5 rounded-full bg-[#1BD4CA]/20 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-[#1BD4CA]" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Feature 2 - AI Tax Automation */}
            <div className="group relative rounded-3xl bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/5 p-10 overflow-hidden hover:border-[#7B6BFF]/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7B6BFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-[#7B6BFF]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#7B6BFF]/20 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-[#7B6BFF]" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">AI-Powered Tax Optimization</h3>
                <p className="text-[#BEBEC2] mb-6 leading-relaxed text-lg">
                  Gemini AI categorizes expenses, predicts deductions, and generates audit-proof tax reports instantly.
                </p>
                <div className="bg-[#080715] rounded-xl p-5 border border-white/5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-[#BEBEC2]">Tax Saved This Month</span>
                    <span className="text-2xl font-bold text-[#27C93F]">₹4,250</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 3 - Smart Goals */}
            <div className="group relative rounded-3xl bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/5 p-8 overflow-hidden hover:border-white/20 transition-all">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-5 border border-orange-500/20 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Goal-Based Savings</h3>
              <p className="text-[#BEBEC2] leading-relaxed">
                Set goals (bike, vacation). We auto-divert 5-10% of daily earnings into secure vaults.
              </p>
            </div>

            {/* Feature 4 - Receipt Scanner */}
            <div className="group relative rounded-3xl bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/5 p-8 overflow-hidden hover:border-white/20 transition-all">
              <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-5 border border-pink-500/20 group-hover:scale-110 transition-transform">
                <ScanLine className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Smart Receipt Scanner</h3>
              <p className="text-[#BEBEC2] leading-relaxed">
                Snap receipts with your phone. Gemini Vision extracts data & categorizes automatically.
              </p>
            </div>

            {/* Feature 5 - Community Insights */}
            <div className="group relative rounded-3xl bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/5 p-8 overflow-hidden hover:border-white/20 transition-all">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-5 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-cyan-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Live Earning Heatmaps</h3>
              <p className="text-[#BEBEC2] leading-relaxed">
                See where other workers earn most in your city. Real-time demand zone alerts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- AI SHOWCASE SECTION --- */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(123,107,255,0.15),transparent_70%)]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <div className="inline-block text-[#7B6BFF] font-mono text-sm mb-4 uppercase tracking-widest">Powered by Gemini 2.5</div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Your Personal<br />Financial AI Assistant
              </h2>
              <p className="text-[#BEBEC2] text-lg mb-8 leading-relaxed">
                Ask anything about your finances in plain English. Get instant tax advice, expense breakdowns, and earning optimization tips powered by Google's latest Gemini AI.
              </p>
              
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0B0F19] border border-white/5 hover:border-white/10 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-5 h-5 text-cyan-500" />
                  </div>
                  <span className="text-white font-medium">Natural language queries</span>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0B0F19] border border-white/5 hover:border-white/10 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
                    <ScanLine className="w-5 h-5 text-purple-500" />
                  </div>
                  <span className="text-white font-medium">Receipt scanning & OCR</span>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0B0F19] border border-white/5 hover:border-white/10 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-5 h-5 text-orange-500" />
                  </div>
                  <span className="text-white font-medium">Predictive income forecasts</span>
                </div>
              </div>

              <button 
                onClick={() => setAiModalOpen(true)}
                className="px-8 py-4 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] text-white font-bold rounded-xl shadow-[0_0_30px_rgba(123,107,255,0.3)] hover:shadow-[0_0_50px_rgba(27,212,202,0.5)] hover:scale-105 transition-all flex items-center gap-3"
              >
                <Sparkles className="w-5 h-5" />
                Try AI Demo Now
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-[#0B0F19] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-bold">Kamai</div>
                      <div className="text-xs text-[#27C93F] flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#27C93F] animate-pulse"></div> Online
                      </div>
                    </div>
                  </div>
                  <Sparkles className="w-5 h-5 text-[#7B6BFF]" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white text-black p-4 rounded-2xl rounded-tl-sm max-w-[80%]">
                      <p className="text-sm font-medium">How much can I save on taxes this month?</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-[#151925] border border-white/5 p-4 rounded-2xl rounded-tl-sm max-w-[85%]">
                      <p className="text-sm text-[#BEBEC2] mb-3">Based on your ₹48,200 earnings this month, you can save approximately <span className="text-[#27C93F] font-bold">₹4,250</span> by claiming:</p>
                      <ul className="space-y-2 text-xs text-[#BEBEC2]">
                        <li className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-[#1BD4CA]/20 flex items-center justify-center"><Check className="w-2.5 h-2.5 text-[#1BD4CA]" /></div>
                          Fuel expenses (₹2,800)
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-[#1BD4CA]/20 flex items-center justify-center"><Check className="w-2.5 h-2.5 text-[#1BD4CA]" /></div>
                          Phone & data (₹850)
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-[#1BD4CA]/20 flex items-center justify-center"><Check className="w-2.5 h-2.5 text-[#1BD4CA]" /></div>
                          Vehicle maintenance (₹600)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs text-[#BEBEC2]">
                    <Sparkles className="w-3 h-3 text-[#7B6BFF]" />
                    <span>Powered by Gemini 2.5 Flash</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute -inset-4 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] blur-3xl opacity-20 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="py-32 relative bg-[#0B0F19]/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-20">
            <div className="inline-block text-[#1BD4CA] font-mono text-sm mb-4 uppercase tracking-widest">Simple Process</div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Get Started in 3 Steps</h2>
            <p className="text-[#BEBEC2] text-lg max-w-2xl mx-auto">From signup to full automation in under 5 minutes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Smartphone,
                title: 'Connect Your Apps',
                description: 'Link Swiggy, Zomato, Uber & bank accounts with secure OAuth. No passwords shared.'
              },
              {
                step: '02',
                icon: Bot,
                title: 'AI Auto-Categorizes',
                description: 'Gemini AI analyzes every transaction, tags expenses, and predicts tax deductions.'
              },
              {
                step: '03',
                icon: TrendingUp,
                title: 'Maximize Earnings',
                description: 'Get real-time insights, auto-savings, and one-click tax reports. Scale effortlessly.'
              }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="relative z-10 bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/5 rounded-3xl p-8 hover:border-[#1BD4CA]/30 transition-all">
                  <div className="text-6xl font-bold text-white/5 mb-4">{item.step}</div>
                  <div className="w-14 h-14 bg-[#1BD4CA]/10 rounded-xl flex items-center justify-center mb-6 border border-[#1BD4CA]/20 group-hover:scale-110 transition-transform">
                    <item.icon className="w-7 h-7 text-[#1BD4CA]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-[#BEBEC2] leading-relaxed">{item.description}</p>
                </div>
                
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#1BD4CA] to-transparent z-0"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING --- */}
      <section id="pricing" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-20">
            <div className="inline-block text-[#7B6BFF] font-mono text-sm mb-4 uppercase tracking-widest">Transparent Pricing</div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Choose Your Plan</h2>
            <p className="text-[#BEBEC2] text-lg max-w-2xl mx-auto">No hidden fees. Cancel anytime. Start free for 30 days.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Free Plan */}
            <div className="relative rounded-3xl bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/5 p-8 hover:border-white/20 transition-all">
              <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
              <p className="text-[#BEBEC2] mb-6">For new gig workers</p>
              <div className="mb-8">
                <span className="text-5xl font-bold text-white">₹0</span>
                <span className="text-[#BEBEC2]">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['1 platform connection', 'Basic expense tracking', 'Monthly tax summary', 'Community access'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-[#BEBEC2]">
                    <Check className="w-5 h-5 text-[#1BD4CA] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button