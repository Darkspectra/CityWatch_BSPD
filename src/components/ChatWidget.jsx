import { useState, useRef, useEffect } from "react";
import { askGemini } from "../utils/geminiApi";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm the CityWatch Assistant. Ask me anything about reporting, verifying, or how the platform works." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    const newMessages = [...messages, { role: "user", text }];
    setMessages(newMessages);
    setInput("");
    setSending(true);
    try {
      const reply = await askGemini(newMessages);
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", text: "Sorry, something went wrong reaching the assistant." }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button className="chat-fab" onClick={() => setOpen((o) => !o)} aria-label="Open chat assistant">
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div className="chat-panel">
          <div className="chat-panel-header">
            <span>CityWatch Assistant</span>
          </div>
          <div className="chat-panel-body" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={"chat-bubble " + (m.role === "user" ? "chat-bubble-user" : "chat-bubble-assistant")}>
                {m.text}
              </div>
            ))}
            {sending && <div className="chat-bubble chat-bubble-assistant chat-bubble-typing">Typing...</div>}
          </div>
          <div className="chat-panel-input-row">
            <input
              className="chat-panel-input"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
            />
            <button className="chat-panel-send" onClick={handleSend} disabled={sending}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}