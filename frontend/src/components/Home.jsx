import React, { useState } from 'react';
import Scene3D from './Scene3D';
import { ArrowRight, MessageSquare, ShieldCheck, Zap, Sun, Moon } from 'lucide-react';

export default function Home({ onNavigate }) {
  const [feedback, setFeedback] = useState({ name: '', email: '', message: '' });
  const [feedbackStatus, setFeedbackStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedbackStatus(null);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback),
      });
      if (!res.ok) throw new Error('Failed to submit feedback');
      setFeedbackStatus({ type: 'success', text: 'Thank you for your feedback!' });
      setFeedback({ name: '', email: '', message: '' });
    } catch (err) {
      setFeedbackStatus({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setFeedbackStatus(null), 5000);
    }
  };

  return (
    <div className={`min-h-screen bg-bg-base text-text-primary overflow-x-hidden font-inter relative ${isDarkMode ? '' : 'light'}`}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-br from-brand-cyan to-brand-purple rounded-full filter blur-[150px] opacity-10 pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#080c14cc] backdrop-blur-md border-b border-border-subtle px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-[32px] h-[32px] rounded-[8px] bg-gradient-to-br from-brand-cyan to-brand-purple flex items-center justify-center text-[16px] font-extrabold text-white shadow-[0_0_20px_rgba(0,212,255,0.2)]">O</div>
          <span className="text-[1.1rem] font-bold text-gradient-brand tracking-tight">OpsMind AI</span>
        </div>
        <div className="flex items-center gap-6 text-[0.85rem] font-medium text-text-secondary">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-[rgba(255,255,255,0.1)] transition-colors text-text-secondary hover:text-white"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a href="#about" className="hover:text-white transition-colors">About Us</a>
          <a href="#feedback" className="hover:text-white transition-colors">Feedback</a>
          <button 
            onClick={() => onNavigate('login')}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-[rgba(0,212,255,0.1)] to-[rgba(139,92,246,0.1)] border border-[rgba(0,212,255,0.2)] hover:border-brand-cyan text-brand-cyan transition-all"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-8 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center min-h-[90vh]">
        <div className="flex flex-col gap-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] text-brand-emerald text-[0.75rem] font-bold tracking-wider uppercase w-fit">
            <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse-dot" />
            System Online
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
            Enterprise <br/>
            <span className="text-gradient-brand">SOP Intelligence</span>
          </h1>
          <p className="text-[1.1rem] text-text-secondary leading-relaxed max-w-[500px]">
            Transform your static documents into an interactive AI agent. Get precise, cited answers instantly from your organizational knowledge base using advanced RAG architecture.
          </p>
          <div className="flex gap-4 mt-4">
            <button 
              onClick={() => onNavigate('login')}
              className="px-8 py-4 rounded-[14px] bg-gradient-to-br from-brand-cyan to-brand-purple text-white font-semibold flex items-center gap-2 shadow-[0_4px_24px_rgba(0,212,255,0.25)] hover:scale-105 transition-all"
            >
              Go to Workspace <ArrowRight size={18} />
            </button>
          </div>
        </div>
        <div className="h-[500px] w-full relative z-0">
          <Scene3D />
        </div>
      </main>

      {/* About Section */}
      <section id="about" className="py-24 px-8 bg-bg-surface border-y border-border-subtle relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why OpsMind AI?</h2>
            <p className="text-text-secondary max-w-2xl mx-auto text-[1.05rem]">
              Built for modern enterprises, OpsMind AI eliminates the time spent searching through hundreds of pages of procedures and manuals.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[24px] bg-bg-glass border border-border-subtle hover:border-[rgba(0,212,255,0.3)] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[rgba(0,212,255,0.1)] flex items-center justify-center text-brand-cyan mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Retrieval</h3>
              <p className="text-text-secondary text-[0.9rem] leading-relaxed">Powered by Google Gemini and Vector Search, get accurate answers in milliseconds rather than minutes.</p>
            </div>
            <div className="p-8 rounded-[24px] bg-bg-glass border border-border-subtle hover:border-[rgba(139,92,246,0.3)] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[rgba(139,92,246,0.1)] flex items-center justify-center text-brand-purple mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">100% Cited Truth</h3>
              <p className="text-text-secondary text-[0.9rem] leading-relaxed">Zero hallucinations. Every answer includes a direct citation and page reference to your uploaded SOP document.</p>
            </div>
            <div className="p-8 rounded-[24px] bg-bg-glass border border-border-subtle hover:border-[rgba(16,185,129,0.3)] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[rgba(16,185,129,0.1)] flex items-center justify-center text-brand-emerald mb-6">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Seamless Interface</h3>
              <p className="text-text-secondary text-[0.9rem] leading-relaxed">A beautiful, dark-mode first workspace that feels native and responsive to your every workflow need.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section id="feedback" className="py-24 px-8 max-w-3xl mx-auto relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-purple rounded-full filter blur-[150px] opacity-[0.07] pointer-events-none" />
        <div className="bg-bg-glass backdrop-blur-xl border border-border-subtle rounded-[32px] p-10 md:p-14 shadow-2xl relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Send us Feedback</h2>
            <p className="text-text-secondary text-[0.95rem]">Have ideas or found a bug? We'd love to hear from you.</p>
          </div>
          
          <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[0.8rem] font-semibold text-text-primary">Name</label>
                <input 
                  type="text" 
                  className="bg-[rgba(0,0,0,0.3)] border border-border-subtle rounded-xl p-3.5 text-[0.9rem] outline-none focus:border-brand-purple focus:bg-[rgba(139,92,246,0.05)] transition-all"
                  placeholder="John Doe"
                  value={feedback.name}
                  onChange={(e) => setFeedback({...feedback, name: e.target.value})}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.8rem] font-semibold text-text-primary">Email</label>
                <input 
                  type="email" 
                  className="bg-[rgba(0,0,0,0.3)] border border-border-subtle rounded-xl p-3.5 text-[0.9rem] outline-none focus:border-brand-purple focus:bg-[rgba(139,92,246,0.05)] transition-all"
                  placeholder="john@example.com"
                  value={feedback.email}
                  onChange={(e) => setFeedback({...feedback, email: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[0.8rem] font-semibold text-text-primary">Message</label>
              <textarea 
                className="bg-[rgba(0,0,0,0.3)] border border-border-subtle rounded-xl p-3.5 text-[0.9rem] outline-none focus:border-brand-purple focus:bg-[rgba(139,92,246,0.05)] transition-all resize-none h-32"
                placeholder="Your thoughts..."
                value={feedback.message}
                onChange={(e) => setFeedback({...feedback, message: e.target.value})}
                required
              />
            </div>

            {feedbackStatus && (
              <div className={`p-3 rounded-xl text-center text-[0.85rem] ${feedbackStatus.type === 'error' ? 'bg-[rgba(244,63,94,0.1)] text-brand-rose border border-[rgba(244,63,94,0.2)]' : 'bg-[rgba(16,185,129,0.1)] text-brand-emerald border border-[rgba(16,185,129,0.2)]'}`}>
                {feedbackStatus.text}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="mt-2 py-4 rounded-xl bg-text-primary text-bg-base font-bold text-[0.95rem] hover:bg-white transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-8 text-center text-text-muted text-[0.8rem]">
        <p>© 2026 OpsMind AI. Enterprise SOP Agent.</p>
      </footer>
    </div>
  );
}
