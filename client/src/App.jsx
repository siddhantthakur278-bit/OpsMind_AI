import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Send, 
  Plus, 
  MessageSquare, 
  Settings, 
  ShieldCheck, 
  FileText, 
  MoreVertical,
  Cpu,
  ExternalLink,
  Bot,
  UploadCloud,
  X,
  ArrowRight,
  Database,
  Lock,
  Zap,
  Search,
  Sparkles,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- AnimatedLogo Component ---
const AnimatedLogo = ({ size = "normal" }) => {
  const containerSize = size === "large" ? "w-16 h-16" : "w-10 h-10";

  return (
    <div className={`relative flex items-center justify-center ${containerSize} rounded-[10px] shadow-[0_0_20px_rgba(110,86,207,0.3)] overflow-hidden border border-railway-accent/30`}>
      {/* Pulsing inner glow behind logo */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-railway-accent/20 rounded-full blur-md"
      />

      {/* Actual Logo Image */}
      <motion.img 
        src="/logo.png" 
        alt="OpsMind Logo"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-full h-full object-cover scale-110" // scale-110 to hide minor image borders
      />
    </div>
  );
};

const App = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const chatEndRef = useRef(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (currentView === 'chat') {
      scrollToBottom();
    }
  }, [messages, isTyping, currentView]);

  const handleSend = async (e, directQuery = null) => {
    if (e) e.preventDefault();
    const query = directQuery || input;
    if (!query.trim()) return;

    if (currentView === 'landing') {
      setCurrentView('chat');
    }

    setHasInteracted(true);
    const userMessage = { id: Date.now(), role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const assistantMessageId = Date.now() + 1;
    setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: '', sources: [] }]);

    try {
      const simulatedResponse = "Based on the Standard Operating Procedures within the knowledge base, I found that your query is directly addressed in our core workflows. In the **Refund Policy (Section 3.2)**, it specifies that all requests must be processed within 24 hours of initiation. Furthermore, if the request involves international transactions, an additional compliance check is automatically triggered via the OpsMind secure gateway.";
      const simulatedSources = [
        { title: 'Refund_Policy_2026.pdf', page: 12, text: '...requests must be processed within 24 hours...' },
        { title: 'Compliance_Guidelines.pdf', page: 4, text: '...international transactions trigger a secondary review...' }
      ];
      
      let currentText = '';
      const tokens = simulatedResponse.split(' ');
      
      for (let i = 0; i < tokens.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 30));
        currentText += (i === 0 ? '' : ' ') + tokens[i];
        
        setMessages(prev => prev.map(msg => {
          if (msg.id === assistantMessageId) {
            return {
              ...msg,
              content: currentText,
              sources: i === tokens.length - 1 ? simulatedSources : []
            };
          }
          return msg;
        }));
      }
    } catch (error) {
      console.error("Streaming error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
    if (files.length > 0) {
      setUploadedFiles(prev => [...prev, ...files.map(f => ({ name: f.name, size: (f.size / 1024 / 1024).toFixed(2) + ' MB', status: 'ready' }))]);
    }
  }, []);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
    if (files.length > 0) {
      setUploadedFiles(prev => [...prev, ...files.map(f => ({ name: f.name, size: (f.size / 1024 / 1024).toFixed(2) + ' MB', status: 'ready' }))]);
    }
  };

  const removeFile = (idx) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const processFiles = () => {
    if (uploadedFiles.length === 0) return;
    setUploadedFiles(prev => prev.map(f => ({ ...f, status: 'processing' })));
    setTimeout(() => {
      setUploadedFiles(prev => prev.map(f => ({ ...f, status: 'indexed' })));
    }, 2500);
  };

  const startNewSession = () => {
    setMessages([]);
    setHasInteracted(false);
    setCurrentView('chat');
  };

  // --- Page Variants for AnimatePresence (Slow Motion) ---
  const pageVariants = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    in: { opacity: 1, y: 0, scale: 1 },
    out: { opacity: 0, y: -30, scale: 0.95 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 1.2
  };

  const quickActions = [
    { title: "Summarize IT Policies", desc: "Get a brief overview of laptop usage and security.", icon: ShieldCheck },
    { title: "Onboarding Steps", desc: "List the 5 key tasks for new employees.", icon: Layers },
    { title: "Leave Approval Workflow", desc: "Explain the chain of command for PTO.", icon: Activity },
    { title: "Analyze Expense Reports", desc: "What are the limits on travel meals?", icon: Database },
  ];

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="relative h-screen w-full bg-[#0B0A10] text-white font-sans overflow-hidden selection:bg-railway-accent selection:text-white">
      <AnimatePresence mode="wait">
        
        {/* LANDING PAGE VIEW */}
        {currentView === 'landing' && (
          <motion.div 
            key="landing"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="absolute inset-0 flex flex-col overflow-x-hidden overflow-y-auto custom-scrollbar"
          >
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
              <motion.div 
                initial={{ scale: 1.05, opacity: 0 }}
                animate={{ 
                  scale: 1.1, 
                  opacity: 0.25,
                  x: [0, -30, 0],
                  y: [0, -30, 0]
                }}
                transition={{ 
                  scale: { duration: 2.5, ease: "easeOut" },
                  opacity: { duration: 2.5, ease: "easeOut" },
                  x: { duration: 60, repeat: Infinity, ease: "linear" },
                  y: { duration: 65, repeat: Infinity, ease: "linear" }
                }}
                className="absolute -inset-10 bg-cover bg-center bg-no-repeat mix-blend-screen"
                style={{ backgroundImage: `url('https://plus.unsplash.com/premium_photo-1682756540097-6a887bbcf9b0?q=80&w=3871&auto=format&fit=crop')` }}
              />
              <motion.div 
                animate={{ x: [0, 150, -50, 0], y: [0, 100, -100, 0], scale: [1, 1.2, 0.8, 1] }}
                transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-railway-accent/20 blur-[120px]" 
              />
              <motion.div 
                animate={{ x: [0, -150, 100, 0], y: [0, -100, 100, 0], scale: [1, 0.8, 1.2, 1] }}
                transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] rounded-full bg-indigo-500/10 blur-[150px]" 
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0B0A10]/40 via-[#0B0A10]/80 to-[#0B0A10]"></div>
              <motion.div 
                animate={{ backgroundPosition: ['0px 0px', '48px 48px'] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
              ></motion.div>
            </div>

            {/* Top Nav */}
            <nav className="relative z-20 w-full px-6 py-6 md:px-12 flex items-center justify-between shrink-0">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="flex items-center gap-4 cursor-pointer"
              >
                <AnimatedLogo />
                <h1 className="text-2xl font-serif tracking-tight font-semibold">OpsMind</h1>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                className="flex items-center gap-6"
              >
                <button 
                  onClick={() => setCurrentView('admin')}
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors hidden md:block"
                >
                  Admin Dashboard
                </button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView('chat')}
                  className="relative px-6 py-2.5 rounded-lg text-sm font-medium transition-all group overflow-hidden shadow-lg shadow-railway-accent/20"
                >
                  <div className="absolute inset-0 bg-white/10 border border-white/20 backdrop-blur-md rounded-lg"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-railway-accent/40 to-indigo-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative z-10 flex items-center gap-2 text-white/90 group-hover:text-white">
                    Launch App <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-500" />
                  </span>
                </motion.button>
              </motion.div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center w-full max-w-5xl mx-auto py-12 md:py-16 shrink-0">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }}
                className="flex flex-col items-center w-full"
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-railway-accent/30 bg-railway-accent/10 backdrop-blur-md text-xs font-mono text-railway-accent uppercase tracking-widest mb-8 cursor-default shadow-[0_0_15px_rgba(110,86,207,0.3)]"
                >
                  <Sparkles size={12} className="animate-pulse" style={{ animationDuration: '3s' }} />
                  Gemini 1.5 Powered RAG Engine
                </motion.div>
                
                <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif leading-tight tracking-tight mb-6 text-white drop-shadow-2xl font-bold max-w-4xl mx-auto">
                  Corporate Intelligence,
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-railway-accent to-purple-400 block mt-2 drop-shadow-lg">
                    Instantly Accessible.
                  </span>
                </h2>
                
                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed font-light">
                  OpsMind AI ingests your Standard Operating Procedures and turns them into a context-aware, verifiable knowledge engine. Zero hallucinations. Full transparency.
                </p>

                {/* Premium Search Bar */}
                <motion.form 
                  whileTap={{ scale: 0.995 }}
                  onSubmit={(e) => handleSend(e, input)}
                  className="w-full max-w-3xl relative flex items-center bg-[#13111C]/60 backdrop-blur-2xl p-2 rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] focus-within:border-railway-accent/50 focus-within:bg-[#13111C]/80 focus-within:shadow-[0_0_40px_rgba(110,86,207,0.3)] transition-all duration-700 group"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-railway-accent/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                  <div className="pl-6 pr-4 relative z-10">
                    <Search className="text-gray-400 group-focus-within:text-railway-accent transition-colors duration-500" size={22} />
                  </div>
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about compliance, HR policies, or IT procedures..." 
                    className="flex-1 min-w-0 bg-transparent border-none outline-none py-5 text-lg placeholder:text-gray-500 font-sans text-white relative z-10"
                  />
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={!input.trim()}
                    className="px-8 py-4 mr-1 bg-white text-[#0B0A10] hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white rounded-xl transition-colors duration-500 font-semibold flex items-center gap-2 shadow-lg relative z-10"
                  >
                    Ask <ArrowRight size={18} />
                  </motion.button>
                </motion.form>
              </motion.div>

              {/* Features Grid */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.8, delay: 0.8, ease: "easeOut" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-24 text-left relative z-10 pb-12"
              >
                {[
                  { icon: Database, title: "Vector Search", desc: "Powered by MongoDB Atlas Vector Search for semantic similarity matching against thousands of PDF chunks in milliseconds." },
                  { icon: Lock, title: "Verifiable Citations", desc: "Every response is strictly grounded in uploaded company data, providing exact page numbers and snippet citations." },
                  { icon: Zap, title: "Real-time Streaming", desc: "Utilizing Server-Sent Events (SSE) to stream Gemini 1.5 Flash tokens directly to the interface for instantaneous feedback." }
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                    className="relative p-8 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.04] transition-all duration-500 overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-railway-accent to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute -inset-24 bg-railway-accent/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                    <feature.icon className="text-railway-accent mb-5 relative z-10" size={32} />
                    <h3 className="text-xl font-serif mb-3 text-white relative z-10 font-medium">{feature.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed relative z-10">{feature.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </main>
          </motion.div>
        )}

        {/* CHAT AND ADMIN VIEWS */}
        {currentView !== 'landing' && (
          <motion.div 
            key="app-view"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="absolute inset-0 flex h-screen w-full bg-[#0B0A10]"
          >
            {/* Sidebar */}
            <aside className="w-72 border-r border-white/10 flex flex-col bg-[#13111C]/80 backdrop-blur-xl z-20 shrink-0">
              <div 
                onClick={() => setCurrentView('landing')}
                className="p-6 flex items-center gap-4 border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors duration-500 group"
              >
                <div className="group-hover:scale-110 transition-transform duration-500">
                  <AnimatedLogo size="small" />
                </div>
                <h1 className="text-2xl font-serif tracking-tight font-semibold">OpsMind</h1>
              </div>

              <div className="p-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startNewSession}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all duration-300 text-sm font-medium shadow-sm ${currentView === 'chat' && !hasInteracted ? 'bg-railway-accent/20 border-railway-accent text-white shadow-[0_0_15px_rgba(110,86,207,0.2)]' : 'border-white/10 bg-white/5 text-gray-300 hover:text-white hover:border-white/20 hover:bg-white/10'}`}
                >
                  <Plus size={16} /> Start New Query
                </motion.button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-2 mt-4">Recent Sessions</div>
                {[1, 2, 3].map(i => (
                  <button key={i} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-white/5 transition-colors duration-300 text-sm text-gray-400 hover:text-white group">
                    <MessageSquare size={14} className="opacity-50 group-hover:opacity-100 group-hover:text-railway-accent transition-colors" />
                    <span className="truncate">SOP Analysis #{i}</span>
                  </button>
                ))}
              </div>

              <div className="p-4 border-t border-white/10 space-y-1">
                <button 
                  onClick={() => setCurrentView('admin')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors duration-300 text-sm group ${currentView === 'admin' ? 'bg-railway-accent/10 text-railway-accent font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                  <ShieldCheck size={16} className={currentView === 'admin' ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'} /> Knowledge Base
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-white/5 transition-colors duration-300 text-sm text-gray-400 hover:text-white group">
                  <Settings size={16} className="opacity-50 group-hover:opacity-100" /> Settings
                </button>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-railway-accent/10 via-[#0B0A10] to-[#0B0A10] min-w-0">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

              <header className="h-16 flex items-center justify-between px-6 lg:px-8 z-10 border-b border-white/10 bg-[#0B0A10]/60 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="px-3 py-1 rounded-md border border-railway-accent/30 bg-railway-accent/10 text-[10px] font-mono text-railway-accent uppercase tracking-widest hidden sm:block">
                    {currentView === 'chat' ? 'Engine: Gemini 1.5 RAG' : 'Admin: Ingestion Pipeline'}
                  </div>
                  <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
                  <div className="text-xs text-gray-400 flex items-center gap-2 font-mono">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    System Online
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-mono px-3 py-1.5 rounded-md bg-[#13111C] border border-white/10">
                    <Database size={12} className="text-railway-accent" />
                    <span>Vectors: 14,024</span>
                  </div>
                </div>
              </header>

              {currentView === 'chat' ? (
                <div className="flex-1 flex overflow-hidden relative z-10">
                  {/* Chat Timeline */}
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 custom-scrollbar">
                      <AnimatePresence initial={false}>
                        {!hasInteracted && messages.length === 0 ? (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                            className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto mt-10 md:mt-0"
                          >
                            <AnimatedLogo size="large" />
                            <h2 className="text-3xl font-serif mt-6 mb-3">Welcome to OpsMind</h2>
                            <p className="text-gray-400 mb-10 leading-relaxed">
                              Your corporate intelligence engine is ready. I have processed and indexed your standard operating procedures. What would you like to explore?
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                              {quickActions.map((action, idx) => (
                                <motion.button
                                  key={idx}
                                  whileHover={{ scale: 1.02, y: -2 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={(e) => handleSend(e, action.title)}
                                  className="flex items-start gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-railway-accent/10 hover:border-railway-accent/50 transition-all text-left group"
                                >
                                  <div className="p-2 rounded-lg bg-[#13111C] border border-white/10 group-hover:border-railway-accent/30 group-hover:text-railway-accent transition-colors">
                                    <action.icon size={18} />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-white group-hover:text-railway-accent transition-colors">{action.title}</h4>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{action.desc}</p>
                                  </div>
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        ) : (
                          messages.map((msg) => (
                            <motion.div
                              key={msg.id}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6 }}
                              className={`flex gap-3 md:gap-4 max-w-3xl mx-auto w-full ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                              {msg.role === 'user' ? (
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border bg-[#13111C] border-white/10 text-gray-300">
                                  <div className="text-[10px] font-mono">USR</div>
                                </div>
                              ) : (
                                <div className="flex-shrink-0">
                                  <AnimatedLogo size="small" />
                                </div>
                              )}
                              
                              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[90%]`}>
                                <div className={`px-5 py-4 rounded-2xl text-[15px] leading-relaxed border shadow-sm ${
                                  msg.role === 'user' 
                                    ? 'bg-railway-accent/20 border-railway-accent/30 text-white rounded-tr-sm' 
                                    : 'bg-[#13111C]/80 border-white/10 text-white/90 backdrop-blur-sm'
                                }`}>
                                  {msg.role === 'assistant' && (
                                    <span className="font-serif text-[16px] md:text-lg leading-relaxed whitespace-pre-wrap">{msg.content}</span>
                                  )}
                                  {msg.role === 'user' && msg.content}
                                </div>
                                
                                {msg.sources?.length > 0 && (
                                  <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-3 flex flex-wrap gap-2 px-2"
                                  >
                                    <div className="w-full flex items-center gap-2 mb-1">
                                      <div className="h-px bg-white/10 flex-1"></div>
                                      <span className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">Verified Sources</span>
                                      <div className="h-px bg-white/10 flex-1"></div>
                                    </div>
                                    {msg.sources.map((s, idx) => (
                                      <motion.div 
                                        key={idx}
                                        whileHover={{ scale: 1.03 }}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs text-gray-400 hover:border-railway-accent/50 hover:bg-railway-accent/10 hover:text-railway-accent transition-all cursor-pointer group shadow-sm"
                                      >
                                        <FileText size={12} className="group-hover:text-railway-accent" />
                                        <span className="font-mono">{s.title} <span className="opacity-50">p.{s.page}</span></span>
                                        <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                      </motion.div>
                                    ))}
                                  </motion.div>
                                )}
                              </div>
                            </motion.div>
                          ))
                        )}
                      </AnimatePresence>

                      {isTyping && messages[messages.length - 1]?.role === 'user' && (
                        <div className="flex gap-3 md:gap-4 max-w-3xl mx-auto w-full">
                          <div className="flex-shrink-0 opacity-80">
                            <AnimatedLogo size="small" />
                          </div>
                          <div className="flex items-center gap-1.5 px-5 py-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-railway-accent animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-railway-accent animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-railway-accent animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} className="h-4" />
                    </div>

                    <div className="p-4 lg:p-6 pt-2 lg:pt-4 bg-gradient-to-t from-[#0B0A10] via-[#0B0A10]/95 to-transparent relative z-20">
                      <div className="max-w-3xl mx-auto w-full">
                        <AnimatePresence>
                          {!hasInteracted && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="flex gap-2 mb-3 px-2 overflow-x-auto custom-scrollbar pb-2"
                            >
                              <span className="text-xs text-gray-500 font-mono flex items-center mr-2"><Sparkles size={12} className="mr-1" /> Try asking:</span>
                              {["How to request PTO?", "IT Security Policy"].map(suggestion => (
                                <button 
                                  key={suggestion}
                                  onClick={(e) => handleSend(e, suggestion)}
                                  className="whitespace-nowrap px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-gray-300 hover:bg-railway-accent/20 hover:text-white transition-colors"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <form 
                          onSubmit={(e) => handleSend(e)}
                          className="relative flex items-center bg-[#13111C]/90 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] focus-within:border-railway-accent/50 focus-within:shadow-[0_0_20px_rgba(110,86,207,0.2)] transition-all duration-500"
                        >
                          <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about corporate policies, procedures..." 
                            className="w-full bg-transparent border-none outline-none px-4 py-3.5 text-[15px] placeholder:text-gray-500 font-sans text-white"
                          />
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="p-3 bg-white hover:bg-gray-200 disabled:opacity-50 disabled:bg-white/10 disabled:text-gray-500 text-[#0B0A10] rounded-xl transition-colors duration-300 mr-1 shadow-md"
                          >
                            <Send size={18} />
                          </motion.button>
                        </form>
                      </div>
                    </div>
                  </div>

                  {/* Right Context Panel (Desktop Only) */}
                  <aside className="hidden xl:flex w-80 border-l border-white/10 bg-[#13111C]/40 backdrop-blur-md flex-col overflow-y-auto custom-scrollbar">
                    <div className="p-6 border-b border-white/10">
                      <h3 className="text-sm font-medium text-white flex items-center gap-2">
                        <Activity size={16} className="text-railway-accent" /> System Context
                      </h3>
                    </div>
                    <div className="p-6 space-y-8">
                      <div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Model Engine</div>
                        <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">LLM</span>
                            <span className="text-sm font-medium text-white">Gemini 1.5 Pro</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Embeddings</span>
                            <span className="text-sm font-medium text-white">text-embedding-004</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Response</span>
                            <span className="text-sm font-medium text-emerald-400 flex items-center gap-1"><Zap size={12}/> Streaming</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Indexed Documents</div>
                        <div className="space-y-2">
                          {["HR_Handbook_2026.pdf", "IT_Security_Protocol.pdf", "Expense_Policy.pdf"].map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/5 hover:border-railway-accent/30 transition-colors cursor-pointer group">
                              <div className="flex items-center gap-2 overflow-hidden">
                                <FileText size={14} className="text-gray-400 group-hover:text-railway-accent flex-shrink-0" />
                                <span className="text-xs text-gray-300 truncate font-mono">{doc}</span>
                              </div>
                              <ChevronRight size={14} className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          ))}
                        </div>
                        <button onClick={() => setCurrentView('admin')} className="mt-3 text-xs text-railway-accent hover:text-white transition-colors flex items-center gap-1">
                          Manage knowledge base <ArrowRight size={10} />
                        </button>
                      </div>
                    </div>
                  </aside>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-4 lg:p-10 relative z-10 custom-scrollbar">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto w-full space-y-10"
                  >
                    <div className="space-y-3 mt-4 md:mt-0 pb-6 border-b border-white/10">
                      <h2 className="text-3xl font-serif text-white font-medium">Knowledge Base Ingestion</h2>
                      <p className="text-gray-400 text-sm">Upload standard operating procedure PDFs to parse, chunk, and embed into the MongoDB Atlas vector database.</p>
                    </div>

                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                      className={`relative border-2 border-dashed rounded-2xl p-10 md:p-16 text-center transition-all duration-500 bg-[#13111C]/50 backdrop-blur-sm ${isDragging ? 'border-railway-accent bg-railway-accent/10 shadow-[0_0_40px_rgba(110,86,207,0.3)]' : 'border-white/10 hover:border-railway-accent/50 hover:bg-[#13111C]/80'}`}
                    >
                      <input 
                        type="file" 
                        multiple 
                        accept="application/pdf"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center gap-5">
                        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-inner relative">
                          {isDragging && <div className="absolute inset-0 rounded-full bg-railway-accent/20 animate-ping"></div>}
                          <UploadCloud size={32} className={isDragging ? 'text-railway-accent animate-bounce' : 'text-gray-400'} />
                        </div>
                        <div>
                          <p className="text-white font-medium mb-1 text-lg">Drag and drop PDF files here</p>
                          <p className="text-gray-500 text-sm">or click to browse from your computer</p>
                        </div>
                      </div>
                    </motion.div>

                    {uploadedFiles.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.6 }}
                        className="bg-[#13111C]/80 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-xl"
                      >
                        <div className="px-6 py-5 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 bg-white/5">
                          <h3 className="font-medium text-sm text-white flex items-center gap-2">
                            <Database size={16} className="text-railway-accent" />
                            Files queued for ingestion ({uploadedFiles.length})
                          </h3>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={processFiles}
                            className="w-full sm:w-auto px-5 py-2.5 bg-white text-[#0B0A10] hover:bg-gray-200 rounded-lg text-sm font-bold transition-colors shadow-lg flex items-center justify-center gap-2"
                          >
                            Process & Index <Zap size={14} />
                          </motion.button>
                        </div>
                        <ul className="divide-y divide-white/5">
                          {uploadedFiles.map((file, idx) => (
                            <motion.li 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.15, duration: 0.5 }}
                              key={idx} 
                              className="px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between group hover:bg-white/5 transition-colors gap-3 sm:gap-0"
                            >
                              <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className="w-10 h-10 rounded bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                  <FileText size={18} className="text-gray-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-white font-mono truncate">{file.name}</p>
                                  <p className="text-xs text-gray-500 mt-0.5">{file.size}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 self-end sm:self-auto mt-2 sm:mt-0">
                                {file.status === 'ready' && <span className="text-[10px] sm:text-xs font-mono text-yellow-400 bg-yellow-400/10 px-2.5 py-1.5 rounded border border-yellow-400/20 whitespace-nowrap">Pending</span>}
                                {file.status === 'processing' && (
                                  <span className="text-[10px] sm:text-xs font-mono text-railway-accent bg-railway-accent/10 px-2.5 py-1.5 rounded border border-railway-accent/20 flex items-center gap-2 whitespace-nowrap">
                                    <div className="w-3 h-3 border-2 border-railway-accent border-t-transparent rounded-full animate-spin"></div>
                                    Embedding...
                                  </span>
                                )}
                                {file.status === 'indexed' && <span className="text-[10px] sm:text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2.5 py-1.5 rounded border border-emerald-400/20 whitespace-nowrap">Indexed</span>}
                                
                                {file.status === 'ready' && (
                                  <button onClick={() => removeFile(idx)} className="text-gray-500 hover:text-red-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all p-2 rounded hover:bg-white/5">
                                    <X size={16} />
                                  </button>
                                )}
                              </div>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default App;
