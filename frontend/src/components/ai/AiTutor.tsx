import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { supabase } from '../../lib/supabase';
import { api } from '../../lib/api';
import ReactMarkdown from 'react-markdown';

interface Message { role: 'user' | 'assistant'; content: string; }
interface ChatSession { id: string; title: string; updated_at: string; }

const BACKEND_URL = (import.meta as any).env?.PUBLIC_BACKEND_URL || 'http://localhost:5000';

function AiTutor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [token, setToken] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = '/login'; return; }
      setToken(session.access_token);
      const resp = await api.getChats(session.access_token);
      setChatHistory(resp.data || []);

      // Welcome message
      setMessages([{
        role: 'assistant',
        content: "👋 Hi! I'm your AI developer tutor. I can help you understand any programming concept, review your code, suggest resources, or guide you through your learning roadmap. What would you like to learn today?"
      }]);
    })();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    const userMsg = input.trim();
    setInput('');
    setSending(true);

    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    // Placeholder assistant message we'll fill in via SSE
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch(`${BACKEND_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ message: userMsg, chat_id: chatId }),
      });

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n').filter(l => l.startsWith('data: '));
        for (const line of lines) {
          try {
            const json = JSON.parse(line.slice(6));
            if (json.text) {
              fullText += json.text;
              setMessages(prev => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: 'assistant', content: fullText };
                return copy;
              });
            }
            if (json.done && json.chat_id) {
              setChatId(json.chat_id);
              // Refresh chat history
              api.getChats(token).then(r => setChatHistory(r.data || []));
            }
          } catch {}
        }
      }
    } catch (err) {
      setMessages(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: 'assistant', content: '❌ Something went wrong. Please try again.' };
        return copy;
      });
    }
    setSending(false);
  };

  const startNewChat = () => {
    setChatId(null);
    setMessages([{ role: 'assistant', content: "Starting a new conversation! What would you like to learn today? 🚀" }]);
  };

  const loadChat = async (id: string) => {
    try {
      const { data } = await api.getChat(id, token);
      setChatId(id);
      setMessages(data.messages || []);
    } catch {}
  };

  const quickPrompts = [
    'Explain async/await in JavaScript', 'How does React reconciliation work?',
    'What is Big O notation?', 'How do I improve my coding skills?'
  ];

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', background: 'var(--color-bg-primary)' }}>
      {/* Sidebar */}
      {sidebarOpen && (
        <div style={{ width: 260, background: 'var(--color-bg-secondary)', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
            <button onClick={startNewChat} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              + New Chat
            </button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
            {chatHistory.length > 0 ? (
              chatHistory.map(ch => (
                <button key={ch.id} onClick={() => loadChat(ch.id)} style={{
                  width: '100%', textAlign: 'left', padding: '0.625rem 0.75rem', borderRadius: 8,
                  background: chatId === ch.id ? 'var(--color-bg-elevated)' : 'transparent',
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '0.25rem',
                  color: 'var(--color-text-secondary)', fontSize: '0.875rem',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                  💬 {ch.title || 'Chat'}
                </button>
              ))
            ) : (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem', padding: '1rem 0.75rem', textAlign: 'center' }}>No previous chats</p>
            )}
          </div>
          <div style={{ padding: '1rem', borderTop: '1px solid var(--color-border)' }}>
            <a href="/ai/library" style={{ textDecoration: 'none' }}>
              <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>🗂 AI Library</button>
            </a>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Chat Header */}
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => setSidebarOpen(s => !s)} className="btn btn-ghost" style={{ padding: '0.375rem 0.625rem' }}>☰</button>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '1rem' }}>🤖 AI Developer Tutor</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Powered by Gemini 1.5 Flash</div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {messages.length <= 1 && !sending && (
            <div style={{ maxWidth: 600, margin: '0 auto', paddingBottom: '2rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🤖</div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>What would you like to learn?</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {quickPrompts.map(p => (
                  <button key={p} onClick={() => setInput(p)} style={{
                    padding: '0.875rem 1rem', borderRadius: 10, border: '1px solid var(--color-border)',
                    background: 'var(--color-bg-card)', color: 'var(--color-text-secondary)',
                    cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', textAlign: 'left',
                    transition: 'all 0.15s'
                  }}>{p}</button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex', gap: '0.875rem', marginBottom: '1.25rem',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              maxWidth: 820, margin: '0 auto 1.25rem'
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: msg.role === 'user' ? 'var(--color-accent)' : 'var(--color-blue)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.875rem', fontWeight: 700, color: '#fff'
              }}>
                {msg.role === 'user' ? 'Y' : '🤖'}
              </div>
              <div style={{
                flex: 1, padding: '0.875rem 1rem', borderRadius: 12,
                background: msg.role === 'user' ? 'var(--color-accent)' : 'var(--color-bg-card)',
                border: msg.role === 'user' ? 'none' : '1px solid var(--color-border)',
                color: msg.role === 'user' ? '#fff' : 'var(--color-text-primary)',
                fontSize: '0.9375rem', lineHeight: 1.6,
              }}>
                {msg.role === 'assistant' && msg.content === '' ? (
                  <span style={{ color: 'var(--color-text-muted)' }}>
                    <span style={{ animation: 'pulse 1s infinite' }}>●</span>
                    <span style={{ animation: 'pulse 1s infinite 0.2s' }}> ●</span>
                    <span style={{ animation: 'pulse 1s infinite 0.4s' }}> ●</span>
                  </span>
                ) : msg.role === 'assistant' ? (
                  <div className="markdown-body" style={{ color: 'var(--color-text-primary)' }}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : msg.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', gap: '0.75rem', maxWidth: 820, margin: '0 auto' }}>
            <input
              className="input"
              type="text"
              placeholder="Ask anything about programming, your roadmap, or career..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              style={{ flex: 1 }}
            />
            <button onClick={sendMessage} disabled={sending || !input.trim()} className="btn btn-primary" style={{ flexShrink: 0, minWidth: 80 }}>
              {sending ? '...' : 'Send →'}
            </button>
          </div>
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: '0.625rem' }}>
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}

export function mountAiTutor(el: HTMLElement) {
  const root = createRoot(el);
  root.render(<AiTutor />);
}

export default AiTutor;
