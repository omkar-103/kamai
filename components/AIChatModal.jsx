// components/AIChatModal.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  X, Send, Sparkles, Brain, Mic, MicOff, Camera,
  Lightbulb, TrendingUp, FileText, RefreshCw, 
  ChevronRight, Zap, MessageSquare, Scan, BarChart3,
  Upload, Image as ImageIcon, Check, Loader2, Bot,
  User, ArrowRight, Clock, Star
} from 'lucide-react';
import { 
  AI_RESPONSES, 
  QUICK_PROMPTS, 
  AI_INSIGHTS, 
  DOCUMENT_TYPES,
  getAIResponse 
} from '@/data/aiChatData';

export default function AIChatModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      // Add welcome message if no messages
      if (messages.length === 0) {
        const welcomeMessage = {
          id: Date.now(),
          type: 'ai',
          content: "👋 Hey! I'm Kamai AI — your intelligent financial advisor. I can help you with income forecasting, taxes, savings, credit building, and more. What would you like to explore?",
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      }
    }
  }, [isOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Typing animation effect
  const typeMessage = async (content, messageId) => {
    const words = content.split(' ');
    let currentContent = '';
    
    for (let i = 0; i < words.length; i++) {
      currentContent += (i === 0 ? '' : ' ') + words[i];
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: currentContent, isTyping: i < words.length - 1 }
          : msg
      ));
      
      // Variable delay for more natural typing
      const delay = Math.random() * 30 + 20;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));

    // Get AI response
    const responseContent = getAIResponse(userMessage.content);
    
    const aiMessage = {
      id: Date.now() + 1,
      type: 'ai',
      content: '',
      timestamp: new Date(),
      isTyping: true
    };

    setMessages(prev => [...prev, aiMessage]);
    
    // Type out the message
    await typeMessage(responseContent, aiMessage.id);
    
    setIsTyping(false);
  };

  const handleQuickPrompt = (prompt) => {
    setInputValue(prompt);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      handleScanDocument(file);
    }
  };

  const handleScanDocument = async (file) => {
    setIsScanning(true);
    setScanResult(null);

    // Simulate OCR processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Mock scan result
    const mockResult = {
      type: 'receipt',
      merchant: 'HP Petrol Pump',
      amount: 1250.00,
      date: '2025-01-15',
      category: 'Fuel Expense',
      taxDeductible: true,
      confidence: 94,
      extractedText: 'Fuel Receipt - Petrol 12.5L @ ₹100/L',
      suggestions: [
        'This expense qualifies for tax deduction',
        'Add to monthly fuel expense report',
        'Track for GST input credit'
      ]
    };

    setScanResult(mockResult);
    setIsScanning(false);
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-auto md:right-6 md:bottom-6 md:w-[440px] md:h-[600px] bg-[#0A0D14] rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border border-white/10">
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#1BD4CA]/10 to-transparent pointer-events-none" />
        <div className="absolute top-4 right-20 w-20 h-20 bg-[#7B6BFF]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] p-[1px]">
                  <div className="w-full h-full bg-[#0A0D14] rounded-xl flex items-center justify-center">
                    <Brain className="w-5 h-5 text-[#1BD4CA]" />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0A0D14]" />
              </div>
              <div>
                <h3 className="font-semibold text-white flex items-center gap-2">
                  Kamai AI
                  <span className="px-1.5 py-0.5 text-[9px] bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] rounded-full font-bold uppercase">
                    Pro
                  </span>
                </h3>
                <p className="text-xs text-white/50">Always here to help</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-all"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 p-1 bg-white/5 rounded-xl">
            {[
              { id: 'chat', label: 'Chat', icon: MessageSquare },
              { id: 'insights', label: 'Insights', icon: Lightbulb },
              { id: 'scan', label: 'Scan', icon: Scan }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#1BD4CA]/20 to-[#7B6BFF]/20 text-white border border-[#1BD4CA]/30'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          
          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="h-full flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                      message.type === 'user'
                        ? 'bg-gradient-to-br from-[#7B6BFF] to-[#1BD4CA]'
                        : 'bg-gradient-to-br from-[#1BD4CA]/20 to-[#7B6BFF]/20 border border-[#1BD4CA]/30'
                    }`}>
                      {message.type === 'user' 
                        ? <User className="w-4 h-4 text-white" />
                        : <Bot className="w-4 h-4 text-[#1BD4CA]" />
                      }
                    </div>

                    {/* Message Bubble */}
                    <div className={`max-w-[80%] ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] text-white rounded-tr-md'
                          : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-md'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {message.content}
                          {message.isTyping && (
                            <span className="inline-flex ml-1">
                              <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce ml-0.5" style={{ animationDelay: '150ms' }} />
                              <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce ml-0.5" style={{ animationDelay: '300ms' }} />
                            </span>
                          )}
                        </p>
                      </div>
                      <p className={`text-[10px] text-white/30 mt-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && messages[messages.length - 1]?.type === 'user' && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1BD4CA]/20 to-[#7B6BFF]/20 border border-[#1BD4CA]/30 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-[#1BD4CA]" />
                    </div>
                    <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl rounded-tl-md">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-[#1BD4CA] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-[#1BD4CA] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-[#1BD4CA] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2">
                  <p className="text-xs text-white/40 mb-2">Quick Actions</p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_PROMPTS.slice(0, 4).map((prompt) => (
                      <button
                        key={prompt.id}
                        onClick={() => handleQuickPrompt(prompt.prompt)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#1BD4CA]/30 rounded-full text-xs text-white/70 hover:text-white transition-all"
                      >
                        <span>{prompt.icon}</span>
                        {prompt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t border-white/10 bg-[#080715]/50">
                <div className="flex items-end gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything..."
                      rows={1}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 resize-none focus:outline-none focus:border-[#1BD4CA]/50 focus:ring-1 focus:ring-[#1BD4CA]/20 transition-all"
                      style={{ minHeight: '48px', maxHeight: '120px' }}
                    />
                  </div>
                  
                  {/* Voice Button */}
                  <button
                    onClick={toggleVoiceInput}
                    className={`p-3 rounded-xl transition-all ${
                      isListening 
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                        : 'bg-white/5 text-white/60 hover:text-white border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  {/* Send Button */}
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className={`p-3 rounded-xl transition-all ${
                      inputValue.trim() && !isTyping
                        ? 'bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] text-white shadow-lg shadow-[#1BD4CA]/20'
                        : 'bg-white/5 text-white/30 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="h-full overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-white">AI-Powered Insights</h4>
                <button className="flex items-center gap-1 text-xs text-[#1BD4CA] hover:text-[#1BD4CA]/80">
                  <RefreshCw className="w-3 h-3" />
                  Refresh
                </button>
              </div>

              {AI_INSIGHTS.map((insight) => (
                <div
                  key={insight.id}
                  className={`p-4 rounded-xl bg-gradient-to-br ${insight.color} border ${insight.borderColor} hover:scale-[1.02] transition-transform cursor-pointer`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{insight.icon}</div>
                    <div className="flex-1">
                      <h5 className={`font-semibold ${insight.textColor}`}>{insight.title}</h5>
                      <p className="text-sm text-white/60 mt-1">{insight.description}</p>
                      <button className={`mt-3 flex items-center gap-1 text-xs font-medium ${insight.textColor}`}>
                        {insight.action}
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* More Actions */}
              <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <h5 className="text-sm font-medium text-white mb-3">Explore More</h5>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: BarChart3, label: 'Analytics' },
                    { icon: FileText, label: 'Reports' },
                    { icon: TrendingUp, label: 'Trends' },
                    { icon: Star, label: 'Goals' }
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <button key={i} className="flex items-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-left">
                        <Icon className="w-4 h-4 text-[#1BD4CA]" />
                        <span className="text-sm text-white/70">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Scan Tab */}
          {activeTab === 'scan' && (
            <div className="h-full overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#1BD4CA]/20 to-[#7B6BFF]/20 border border-[#1BD4CA]/30 flex items-center justify-center mb-3">
                  <Scan className="w-8 h-8 text-[#1BD4CA]" />
                </div>
                <h4 className="font-semibold text-white">Smart Document Scanner</h4>
                <p className="text-sm text-white/50 mt-1">Upload receipts, bills, or documents for instant AI analysis</p>
              </div>

              {/* Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  isScanning 
                    ? 'border-[#1BD4CA]/50 bg-[#1BD4CA]/5' 
                    : 'border-white/20 hover:border-[#1BD4CA]/30 hover:bg-white/5'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {isScanning ? (
                  <div className="space-y-3">
                    <Loader2 className="w-10 h-10 mx-auto text-[#1BD4CA] animate-spin" />
                    <p className="text-white/70">Analyzing document...</p>
                    <div className="w-48 h-1.5 mx-auto bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] rounded-full animate-pulse" style={{ width: '60%' }} />
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 mx-auto text-white/40 mb-3" />
                    <p className="text-white/70 font-medium">Drop files here or click to upload</p>
                    <p className="text-xs text-white/40 mt-1">Supports JPG, PNG, PDF up to 10MB</p>
                  </>
                )}
              </div>

              {/* Document Type Selection */}
              <div className="mt-6">
                <p className="text-xs text-white/40 mb-2">Document Type</p>
                <div className="grid grid-cols-3 gap-2">
                  {DOCUMENT_TYPES.map((type) => (
                    <button
                      key={type.id}
                      className="flex flex-col items-center gap-1 p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#1BD4CA]/30 rounded-xl transition-all"
                    >
                      <span className="text-xl">{type.icon}</span>
                      <span className="text-xs text-white/60">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scan Result */}
              {scanResult && (
                <div className="mt-6 p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <h5 className="font-semibold text-green-400">Scan Complete</h5>
                    <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                      {scanResult.confidence}% confident
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/50">Merchant</span>
                      <span className="text-white font-medium">{scanResult.merchant}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Amount</span>
                      <span className="text-white font-medium">₹{scanResult.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Category</span>
                      <span className="text-[#1BD4CA] font-medium">{scanResult.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Tax Deductible</span>
                      <span className="text-green-400 font-medium">Yes ✓</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10">
                    <p className="text-xs text-white/40 mb-2">AI Suggestions</p>
                    {scanResult.suggestions.map((suggestion, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-white/60 mb-1">
                        <Zap className="w-3 h-3 text-[#1BD4CA] mt-0.5 shrink-0" />
                        {suggestion}
                      </div>
                    ))}
                  </div>

                  <button className="w-full mt-4 py-2.5 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] rounded-xl font-medium text-white">
                    Add to Expenses
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Branding */}
        <div className="p-3 border-t border-white/5 text-center">
          <p className="text-[10px] text-white/30 flex items-center justify-center gap-1">
            Powered by <Sparkles className="w-3 h-3 text-[#1BD4CA]" /> Kamai AI
          </p>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce {
          animation: bounce 0.6s infinite;
        }
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