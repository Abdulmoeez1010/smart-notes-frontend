import { useState } from "react";
import DocumentInput from "./components/DocumentInput";
import ChatView from "./components/ChatView";
import SummaryView from "./components/SummaryView";
import QuizView from "./components/QuizView";
import MindmapView from "./components/MindmapView";

const TABS = [
  { key: "chat", label: "Chat", icon: "💬" },
  { key: "summary", label: "Summary", icon: "📝" },
  { key: "quiz", label: "Quiz", icon: "🧠" },
  { key: "mindmap", label: "Mindmap", icon: "🗺️" },
];

function App() {
  const [docId, setDocId] = useState(null);
  const [docTitle, setDocTitle] = useState(null);
  const [activeTab, setActiveTab] = useState("chat");
  const [darkMode, setDarkMode] = useState(false);

  const handleIngested = (id, title) => {
    setDocId(id);
    setDocTitle(title);
  };

  if (!docId) {
    return <DocumentInput onIngested={handleIngested} />;
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 py-10 px-4 transition-colors">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">✦</span>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">Smart Notes</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="text-sm text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
                title="Toggle dark mode"
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
              <button
                onClick={() => { setDocId(null); setDocTitle(null); setActiveTab("chat"); }}
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition"
              >
                + New document
              </button>
            </div>
          </div>

          <p className="text-sm text-slate-400 dark:text-slate-500 mb-4 truncate">
            {docTitle}
          </p>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-6 transition-colors">
            <div className="flex gap-2 bg-slate-100 dark:bg-slate-700 rounded-lg p-1 mb-5">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-1.5 ${
                    activeTab === tab.key
                      ? "bg-white dark:bg-slate-600 shadow text-slate-900 dark:text-white"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <div key={activeTab} className="animate-fadeIn">
              {activeTab === "chat" && <ChatView docId={docId} />}
              {activeTab === "summary" && <SummaryView docId={docId} />}
              {activeTab === "quiz" && <QuizView docId={docId} />}
              {activeTab === "mindmap" && <MindmapView docId={docId} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;