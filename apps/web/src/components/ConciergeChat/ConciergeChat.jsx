import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { sendConciergeMessage } from '../../services/gemini';
import styles from './ConciergeChat.module.css';

const INTRO = {
  role: 'assistant',
  text: "Hi, I'm Glitch! Ask me anything about queues, games, or your stats.",
};

export default function ConciergeChat() {
  const [messages, setMessages] = useState([INTRO]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  async function handleSend() {
    const text = input.trim();
    if (!text) return;
    const next = [...messages, { role: 'user', text }];
    setMessages(next);
    setInput('');
    setTyping(true);

    const history = next.map((m) => ({ role: m.role === 'user' ? 'user' : 'model', text: m.text }));
    const reply = await sendConciergeMessage(text, history);

    setTyping(false);
    setMessages((curr) => [...curr, { role: 'assistant', text: reply }]);
  }

  return (
    <div className={styles.chat}>
      <div className={styles.messages} ref={listRef}>
        {messages.map((m, i) => (
          <div
            key={i}
            className={[styles.bubbleRow, m.role === 'user' ? styles.fromUser : styles.fromAssistant].join(' ')}
          >
            <div className={styles.bubble}>{m.text}</div>
          </div>
        ))}
        {typing && (
          <div className={[styles.bubbleRow, styles.fromAssistant].join(' ')}>
            <div className={[styles.bubble, styles.typing].join(' ')}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
          </div>
        )}
      </div>
      <div className={styles.inputBar}>
        <input
          className={styles.input}
          value={input}
          placeholder="Ask Glitch..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={typing}
        />
        <button
          className={styles.sendButton}
          onClick={handleSend}
          disabled={!input.trim() || typing}
          aria-label="Send"
        >
          <Send size={18} color={input.trim() ? 'var(--color-accent)' : 'var(--color-text-muted)'} />
        </button>
      </div>
    </div>
  );
}
