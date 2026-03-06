import React, { useState, useEffect, useRef } from 'react';

const AiChatInterface = ({ initialContext = '' }: { initialContext?: string }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [chats, setChats] = useState<any[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchChats();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchChats = async () => {
        const res = await fetch('http://localhost:5000/api/ai/chats', { credentials: 'include' });
        if (res.ok) setChats(await res.json());
    };

    const loadChat = async (id: string) => {
        setActiveChatId(id);
        const res = await fetch(`http://localhost:5000/api/ai/chat/${id}`, { credentials: 'include' });
        if (res.ok) {
            const data = await res.json();
            setMessages(data.messages);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input, chatId: activeChatId, context: initialContext }),
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to send');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let aiMsg = { role: 'model', text: '' };
            setMessages(prev => [...prev, aiMsg]);

            while (true) {
                const { done, value } = await reader!.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = JSON.parse(line.substring(6));
                        if (data.text) {
                            aiMsg.text += data.text;
                            setMessages(prev => {
                                const newMsgs = [...prev];
                                newMsgs[newMsgs.length - 1] = { ...aiMsg };
                                return newMsgs;
                            });
                        }
                        if (data.done) {
                            setActiveChatId(data.chatId);
                            fetchChats();
                        }
                    }
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', height: 'calc(100vh - 60px)', background: '#0a0a0a' }}>
            {/* Sidebar */}
            <aside style={{ borderRight: '1px solid #1f1f1f', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <button
                    onClick={() => { setActiveChatId(null); setMessages([]); }}
                    style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', background: '#16a34a', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                >
                    + New Chat
                </button>

                <div>
                    <h3 style={{ fontSize: '0.75rem', color: '#525252', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>History</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                        {chats.map(c => (
                            <button
                                key={c._id}
                                onClick={() => loadChat(c._id)}
                                style={{
                                    textAlign: 'left', padding: '0.75rem', borderRadius: '8px', background: activeChatId === c._id ? '#1c1c1c' : 'transparent',
                                    border: 'none', color: activeChatId === c._id ? '#fff' : '#737373', cursor: 'pointer', fontSize: '0.85rem',
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                }}
                            >
                                {c.title || 'Untitled Chat'}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: 'auto', borderTop: '1px solid #1f1f1f', paddingTop: '1.5rem' }}>
                    <a href="/ai/library" style={{ color: '#a3a3a3', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        📚 AI Library
                    </a>
                </div>
            </aside>

            {/* Chat Area */}
            <main style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                    {messages.length === 0 ? (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>How can I help your career today?</h2>
                            <p style={{ color: '#525252', maxWidth: '400px' }}>Ask about roadmaps, coding problems, career advice, or specific technologies.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
                            {messages.map((m, i) => (
                                <div key={i} style={{
                                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '85%',
                                    padding: '1rem 1.25rem',
                                    borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                    background: m.role === 'user' ? '#16a34a' : '#111',
                                    border: m.role === 'user' ? 'none' : '1px solid #262626',
                                    color: m.role === 'user' ? '#fff' : '#d4d4d4',
                                    fontSize: '0.95rem',
                                    lineHeight: 1.6,
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {m.text}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                <div style={{ padding: '2rem', background: '#0a0a0a', borderTop: '1px solid #1f1f1f' }}>
                    <form onSubmit={handleSend} style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '1rem' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Type your message..."
                            style={{ flex: 1, padding: '1rem', background: '#111', border: '1px solid #262626', borderRadius: '12px', color: '#fff', outline: 'none' }}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            style={{ padding: '1rem 1.5rem', borderRadius: '12px', background: '#16a34a', border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                        >
                            {loading ? '...' : 'Send'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AiChatInterface;
