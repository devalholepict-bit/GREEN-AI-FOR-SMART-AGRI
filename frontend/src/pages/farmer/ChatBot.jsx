import React, { useState, useRef, useEffect } from 'react';
import backendAPI from '../../api/axios';
import '../../styles/Dashboard.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([{ role:'bot', text:'Hello! I\'m your AI agriculture assistant. How can I help you today? 🌾' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef(null);

  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = input.trim(); setInput('');
    setMessages(prev => [...prev, { role:'user', text: userMsg }]);
    setLoading(true);
    try {
      const res = await backendAPI.post('/marketplace/chat', { message: userMsg });
      setMessages(prev => [...prev, { role:'bot', text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role:'bot', text: 'Sorry, I encountered an error. Please try again.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="dashboard-page">
      <div className="page-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div><h1>🤖 AI Assistant</h1><p>Ask any agriculture-related question.</p></div>
        <button className="btn btn-outline" onClick={()=>setMessages([{ role:'bot', text:'Chat cleared. How can I help?' }])}>Clear Chat</button>
      </div>
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((m,i) => <div key={i} className={`chat-bubble ${m.role}`}>{m.text}</div>)}
          {loading && <div className="chat-bubble bot"><div className="typing-dots"><span></span><span></span><span></span></div></div>}
          <div ref={messagesEnd}/>
        </div>
        <form className="chat-input-row" onSubmit={sendMessage}>
          <input placeholder="Type your question..." value={input} onChange={e=>setInput(e.target.value)}/>
          <button className="btn btn-primary" disabled={loading}>Send</button>
        </form>
      </div>
    </div>
  );
};
export default ChatBot;
