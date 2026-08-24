import { useState, useRef, useEffect } from "react";
import { askQuestion } from "../api";

function ChatView({ docId }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleAsk = async () => {
    if (!question.trim()) return;
    const q = question;
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setQuestion("");
    setLoading(true);
    try {
      const res = await askQuestion(docId, q);
      setMessages((prev) => [...prev, { role: "assistant", text: res.data.answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Error: " + (err.response?.data?.detail || "Something went wrong") },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAsk();
  };

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-slate-50 rounded-lg">
        {messages.length === 0 && (
          <div className="text-center mt-16">
            <p className="text-3xl mb-2">💬</p>
            <p className="text-slate-400 text-sm">Ask anything about this document.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm animate-fadeIn ${
              m.role === "user"
                ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white ml-auto rounded-br-sm"
                : "bg-white text-slate-800 border border-slate-200 rounded-bl-sm"
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="bg-white text-slate-400 border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm max-w-[80%] flex gap-1">
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 mt-3">
        <input
          type="text"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          className="flex-1 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        <button
          onClick={handleAsk}
          disabled={loading || !question.trim()}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatView;