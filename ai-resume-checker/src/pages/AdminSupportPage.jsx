import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, CheckCircle2, X, MessageCircle, Clock, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminSupportPage() {
  const { isAdmin } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/support/admin/tickets');
      setTickets(res.data);
    } catch (err) {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      setSubmitting(true);
      await api.post(`/support/admin/tickets/${selectedTicket.id}/reply`, {
        reply_message: replyText
      });
      toast.success('Reply sent successfully!');
      setReplyText('');
      setSelectedTicket(null);
      fetchTickets();
    } catch (err) {
      toast.error('Failed to send reply');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col gap-8 pt-24">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-accent-purple/20 flex items-center justify-center border border-accent-purple/30">
          <Shield className="text-accent-purple" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin Support Portal</h1>
          <p className="text-gray-400">Manage and reply to user support tickets.</p>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-accent-purple/30 border-t-accent-purple rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          
          {/* Ticket List */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <h2 className="font-semibold text-white mb-2">Recent Tickets</h2>
            {tickets.length === 0 ? (
              <div className="p-8 text-center glass-card border-dashed">
                <CheckCircle2 className="mx-auto text-emerald-400 mb-2" size={32} />
                <p className="text-white font-medium">All caught up!</p>
                <p className="text-gray-400 text-sm">No support tickets found.</p>
              </div>
            ) : (
              tickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                    selectedTicket?.id === ticket.id
                      ? 'bg-accent-purple/10 border-accent-purple/50 shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                      : 'bg-black/40 border-white/10 hover:bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      ticket.status === 'Open' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {ticket.status}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-medium text-white truncate mb-1">{ticket.subject}</h3>
                  <p className="text-sm text-gray-400 truncate">{ticket.user_email}</p>
                </button>
              ))
            )}
          </div>

          {/* Ticket Detail / Reply View */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selectedTicket ? (
                <motion.div
                  key="ticket-detail"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass-card flex flex-col h-full max-h-[800px] overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-white/10 flex items-start justify-between bg-black/20">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">{selectedTicket.subject}</h2>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Mail size={14} />
                          {selectedTicket.user_email}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span>{selectedTicket.user_name}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedTicket(null)}
                      className="text-gray-400 hover:text-white bg-white/5 p-2 rounded-xl"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Conversation */}
                  <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                    {/* User Message */}
                    <div className="flex flex-col gap-2 max-w-[85%]">
                      <div className="flex items-center gap-2 text-sm text-gray-400 ml-1">
                        <span className="font-medium text-gray-300">{selectedTicket.user_name}</span>
                        <span>•</span>
                        <span>{new Date(selectedTicket.created_at).toLocaleString()}</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 text-gray-300 whitespace-pre-wrap">
                        {selectedTicket.message}
                      </div>
                    </div>

                    {/* Admin Reply (if closed) */}
                    {selectedTicket.admin_reply && (
                      <div className="flex flex-col gap-2 max-w-[85%] self-end">
                        <div className="flex items-center gap-2 text-sm text-gray-400 mr-1 justify-end">
                          <span>Admin (You)</span>
                        </div>
                        <div className="bg-accent-purple/20 border border-accent-purple/30 rounded-2xl rounded-tr-sm p-4 text-white whitespace-pre-wrap shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                          {selectedTicket.admin_reply}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reply Box (only if Open) */}
                  {selectedTicket.status === 'Open' && (
                    <div className="p-6 border-t border-white/10 bg-black/20">
                      <form onSubmit={handleReply} className="flex flex-col gap-4">
                        <textarea
                          placeholder="Type your reply here... (This will send an email and an in-app notification)"
                          rows={4}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple transition-colors resize-none input-glow"
                        />
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={submitting || !replyText.trim()}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-accent-purple hover:bg-accent-purple/90 transition-colors disabled:opacity-50 shadow-lg shadow-accent-purple/25"
                          >
                            {submitting ? (
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                <Send size={18} />
                                Send Reply
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 glass-card border-dashed"
                >
                  <MessageCircle className="text-gray-600 mb-4" size={48} />
                  <h3 className="text-xl font-bold text-white mb-2">Select a Ticket</h3>
                  <p className="text-gray-400 max-w-md">
                    Choose a support ticket from the list to view its details and send a reply to the user.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
