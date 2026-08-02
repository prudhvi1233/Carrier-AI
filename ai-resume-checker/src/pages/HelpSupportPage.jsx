import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, HelpCircle, Send, CheckCircle2, ChevronDown, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const FAQS = [
  {
    question: 'How does the AI Resume Builder work?',
    answer: 'Our AI analyzes your basic information and generates professional summaries, skill suggestions, and optimizes your bullet points to pass ATS (Applicant Tracking Systems).'
  },
  {
    question: 'Can I change my template later?',
    answer: 'Yes! You can switch between templates at any time from the Resume Builder gallery. Your content will automatically adapt to the new design.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We encrypt all personal data and never share your information with third parties. You can delete your account and all associated data at any time.'
  },
  {
    question: 'How do I download my resume?',
    answer: 'Once you are satisfied with your resume in the builder, navigate to the final "Preview & Export" step to download it as a pixel-perfect PDF or a DOCX file.'
  }
];

export default function HelpSupportPage() {
  const [activeTab, setActiveTab] = useState('submit'); // 'submit' or 'tickets'
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  
  // My tickets state
  const [myTickets, setMyTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  useEffect(() => {
    if (activeTab === 'tickets') {
      fetchMyTickets();
    }
  }, [activeTab]);

  const fetchMyTickets = async () => {
    try {
      setLoadingTickets(true);
      const res = await api.get('/support/tickets');
      setMyTickets(res.data);
    } catch (err) {
      toast.error('Failed to load your support tickets');
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/support/contact', {
        subject: formData.subject,
        message: formData.message,
        admin_email: 'prudhvibehara34@gmail.com'
      });

      setIsSuccess(true);
      setFormData({ subject: '', message: '' });
      toast.success('Your message has been sent to the admin!');
      
      setTimeout(() => setIsSuccess(false), 5000);
      
      // If we are on tickets tab, refresh
      if (activeTab === 'tickets') {
        fetchMyTickets();
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col gap-8 pt-24">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center border border-accent-blue/30 mb-2">
          <HelpCircle className="text-accent-blue" size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">Help & Support</h1>
        <p className="text-muted text-lg">
          Need assistance? We're here to help. Check out our FAQs, send a direct message, or view your past tickets.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mt-4">
        <div className="bg-black/40 border border-border rounded-2xl p-1.5 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === 'submit'
                ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-foreground shadow-lg shadow-accent-blue/20'
                : 'text-muted hover:text-foreground hover:bg-overlay'
            }`}
          >
            Submit a Ticket
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === 'tickets'
                ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-foreground shadow-lg shadow-accent-blue/20'
                : 'text-muted hover:text-foreground hover:bg-overlay'
            }`}
          >
            My Tickets
          </button>
        </div>
      </div>

      {activeTab === 'submit' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-4">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8 md:p-10 flex flex-col gap-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Mail className="text-accent-blue" size={24} />
                Contact Support
              </h2>
              <p className="text-muted text-sm">
                Send a message directly to our support team and we'll get back to you as soon as possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted">Subject</label>
                <input
                  type="text"
                  placeholder="What is your question about?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-overlay border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent-blue transition-colors input-glow"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted">Message</label>
                <textarea
                  placeholder="Describe your issue or ask a question in detail..."
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-overlay border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent-blue transition-colors resize-none input-glow"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className={`mt-2 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-foreground transition-all shadow-lg ${
                  isSuccess 
                    ? 'bg-emerald-500 shadow-emerald-500/25' 
                    : 'bg-gradient-to-r from-accent-blue to-accent-purple shadow-accent-blue/25 hover:shadow-accent-blue/40 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:pointer-events-none'
                }`}
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 size={20} />
                    Message Sent
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* FAQs */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                <MessageCircle className="text-accent-purple" size={24} />
                Frequently Asked Questions
              </h2>
              <p className="text-muted text-sm">
                Quick answers to common questions about our platform.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div 
                    key={idx}
                    className={`border border-border rounded-xl overflow-hidden transition-colors ${
                      isOpen ? 'bg-overlay border-white/20' : 'bg-secondary/40 hover:bg-white/[0.02]'
                    }`}
                  >
                    <button 
                      onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left"
                    >
                      <span className="font-medium text-foreground">{faq.question}</span>
                      <ChevronDown 
                        size={18} 
                        className={`text-muted transition-transform duration-300 ${isOpen ? 'rotate-180 text-accent-blue' : ''}`} 
                      />
                    </button>
                    <motion.div
                      initial={false}
                      animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-1 text-muted text-sm leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-auto glass-card p-6 border-accent-blue/20 bg-accent-blue/5 flex items-start gap-4">
              <FileText className="text-accent-blue shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-foreground font-semibold mb-1">Looking for documentation?</h4>
                <p className="text-muted text-sm mb-3">Check out our comprehensive guide on how to build the perfect ATS-friendly resume.</p>
                <button className="text-sm text-accent-blue font-semibold hover:text-foreground transition-colors">
                  Read the Guide →
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl mx-auto flex flex-col gap-6 mt-4"
        >
          {loadingTickets ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-accent-purple/30 border-t-accent-purple rounded-full animate-spin" />
            </div>
          ) : myTickets.length === 0 ? (
            <div className="p-12 text-center glass-card border-dashed">
              <MessageCircle className="mx-auto text-gray-500 mb-4" size={48} />
              <h3 className="text-xl font-bold text-foreground mb-2">No Tickets Yet</h3>
              <p className="text-muted max-w-md mx-auto mb-6">
                You haven't submitted any support requests. If you need help, switch to the 'Submit a Ticket' tab.
              </p>
              <button 
                onClick={() => setActiveTab('submit')}
                className="px-6 py-2.5 rounded-xl font-bold text-foreground bg-overlay-hover hover:bg-white/20 transition-colors"
              >
                Create a Ticket
              </button>
            </div>
          ) : (
            myTickets.map(ticket => (
              <div key={ticket.id} className="glass-card flex flex-col overflow-hidden">
                <div className="p-6 border-b border-border bg-overlay flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">{ticket.subject}</h3>
                    <p className="text-sm text-muted">{new Date(ticket.created_at).toLocaleString()}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wider ${
                    ticket.status === 'Open' 
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
                
                <div className="p-6 flex flex-col gap-6">
                  {/* User message */}
                  <div className="flex flex-col gap-2">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Message</div>
                    <div className="bg-overlay border border-border rounded-2xl rounded-tl-sm p-4 text-muted whitespace-pre-wrap">
                      {ticket.message}
                    </div>
                  </div>
                  
                  {/* Admin Reply */}
                  {ticket.admin_reply && (
                    <div className="flex flex-col gap-2 items-end">
                      <div className="text-xs font-bold text-accent-purple uppercase tracking-wider">Admin Reply</div>
                      <div className="bg-accent-purple/10 border border-accent-purple/20 rounded-2xl rounded-tr-sm p-4 text-foreground whitespace-pre-wrap text-right max-w-[85%]">
                        {ticket.admin_reply}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
}
