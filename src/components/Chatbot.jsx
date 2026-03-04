import React, { useState, useRef, useEffect, useContext } from 'react';
import AppContext from '../context/AppContext';

const QUICK_REPLIES = [
    'What paints do you sell?',
    'How do I track my order?',
    'What are your business hours?',
    'Do you offer home delivery?',
    'How to choose the right paint?',
];

const BOT_AVATAR = '🎨';

const TypingIndicator = () => (
    <div className="chat-msg bot">
        <div className="chat-avatar">{BOT_AVATAR}</div>
        <div className="chat-bubble typing-bubble">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
        </div>
    </div>
);

const Chatbot = () => {
    const { url, token } = useContext(AppContext);
    console.log(url);
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            from: 'bot',
            text: "Hi! 👋 I'm the Ajmera Paints assistant. I can help you with product queries, order info, paint recommendations, and more. How can I help you today?",
            time: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [unread, setUnread] = useState(0);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (open) {
            setUnread(0);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const sendMessage = async (text) => {
        const trimmed = (text || input).trim();
        if (!trimmed || loading) return;

        const userMsg = { id: Date.now(), from: 'user', text: trimmed, time: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch(`https://paintstore.onrender.com/api/chat/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Auth: token } : {}),
                },
                credentials: 'include',
                body: JSON.stringify({ message: trimmed }),
            });

            const data = await res.json();
            const botMsg = {
                id: Date.now() + 1,
                from: 'bot',
                text: data.reply || "Sorry, I couldn't understand that. Please try again.",
                time: new Date(),
            };
            setMessages(prev => [...prev, botMsg]);
            if (!open) setUnread(u => u + 1);
        } catch {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                from: 'bot',
                text: "I'm having trouble connecting right now. Please try again in a moment.",
                time: new Date(),
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (date) =>
        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const clearChat = () => {
        setMessages([{
            id: Date.now(),
            from: 'bot',
            text: "Chat cleared! How can I help you?",
            time: new Date(),
        }]);
    };

    return (
        <>
            <button
                className={`chatbot-fab ${open ? 'fab-open' : ''}`}
                onClick={() => setOpen(o => !o)}
                aria-label="Open chat"
            >
                {open ? (
                    <span className="material-symbols-outlined" style={{ fontSize: '1.4rem' }}>close</span>
                ) : (
                    <>
                        <span className="fab-icon">💬</span>
                        {unread > 0 && <span className="fab-badge">{unread}</span>}
                    </>
                )}
            </button>

            {open && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="chatbot-header-info">
                            <div className="chatbot-avatar-wrap">
                                <span className="chatbot-header-avatar">{BOT_AVATAR}</span>
                                <span className="chatbot-online-dot"></span>
                            </div>
                            <div>
                                <div className="chatbot-header-name">Ajmera Assistant</div>
                                <div className="chatbot-header-status">Online · Replies instantly</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button className="chatbot-header-btn" onClick={clearChat} title="Clear chat">
                                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>delete_sweep</span>
                            </button>
                            <button className="chatbot-header-btn" onClick={() => setOpen(false)} title="Close">
                                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>close</span>
                            </button>
                        </div>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`chat-msg ${msg.from}`}>
                                {msg.from === 'bot' && (
                                    <div className="chat-avatar">{BOT_AVATAR}</div>
                                )}
                                <div className="chat-bubble-wrap">
                                    <div className="chat-bubble">{msg.text}</div>
                                    <div className="chat-time">{formatTime(msg.time)}</div>
                                </div>
                            </div>
                        ))}
                        {loading && <TypingIndicator />}
                        <div ref={bottomRef} />
                    </div>

                    {messages.length === 1 && (
                        <div className="chatbot-quick-replies">
                            {QUICK_REPLIES.map((q) => (
                                <button
                                    key={q}
                                    className="quick-reply-btn"
                                    onClick={() => sendMessage(q)}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="chatbot-input-row">
                        <textarea
                            ref={inputRef}
                            className="chatbot-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKey}
                            placeholder="Type a message..."
                            rows={1}
                            disabled={loading}
                        />
                        <button
                            className={`chatbot-send-btn ${input.trim() ? 'active' : ''}`}
                            onClick={() => sendMessage()}
                            disabled={!input.trim() || loading}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '1.15rem' }}>send</span>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;