import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I'm the Sports Council assistant. Ask me about clubs, events, achievements, or anything sports-related at SRM!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);

    try {
      const history = messages.slice(-10).map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.reply || data.error || "Sorry, I couldn't process that." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-srm text-white shadow-lg shadow-brand-srm/30 hover:bg-brand-srm/90 transition-all focus:outline-none focus:ring-2 focus:ring-brand-srm focus:ring-offset-2 focus:ring-offset-background"
        aria-label="Toggle chat"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 flex w-80 flex-col rounded-2xl border border-border bg-card shadow-2xl sm:w-96"
            style={{ maxHeight: "calc(100vh - 160px)" }}
          >
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-srm">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Sports Council AI</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Ask me anything</p>
              </div>
            </div>

            <div ref={listRef} className="flex-1 overflow-y-auto space-y-3 px-5 py-4" style={{ minHeight: 200 }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex max-w-[85%] gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${msg.role === "user" ? "bg-brand-srm" : "bg-muted"}`}>
                      {msg.role === "user" ? <User size={12} className="text-white" /> : <Bot size={12} className="text-foreground" />}
                    </div>
                    <div className={`rounded-xl px-3 py-2 text-sm leading-relaxed ${
                      msg.role === "user" ? "bg-brand-srm text-white" : "bg-background text-foreground border border-border"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex max-w-[85%] gap-2">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Bot size={12} className="text-foreground" />
                    </div>
                    <div className="rounded-xl bg-background px-4 py-2 text-sm text-muted border border-border">
                      <span className="inline-block animate-pulse">Thinking</span>
                      <span className="inline-block animate-pulse" style={{ animationDelay: "0.2s" }}>.</span>
                      <span className="inline-block animate-pulse" style={{ animationDelay: "0.4s" }}>.</span>
                      <span className="inline-block animate-pulse" style={{ animationDelay: "0.6s" }}>.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Type your question..."
                  className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
                />
                <button
                  onClick={send}
                  disabled={loading || !input.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-srm text-white hover:bg-brand-srm/90 focus:outline-none focus:ring-2 focus:ring-brand-srm focus:ring-offset-2 focus:ring-offset-card transition-all disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
