import { useState } from "react";
import { ingestYoutube, ingestPdf, ingestPptx } from "../api";

function DocumentInput({ onIngested }) {
  const [mode, setMode] = useState("youtube");
  const [videoUrl, setVideoUrl] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (mode === "youtube") res = await ingestYoutube(videoUrl);
      else if (mode === "pdf") res = await ingestPdf(file);
      else res = await ingestPptx(file);
      onIngested(res.data.doc_id, res.data.title);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg mb-4">
            <span className="text-white text-2xl">✦</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Smart Notes</h1>
          <p className="text-slate-500 text-sm mt-2">
            Chat, summarize, quiz, and map any video, PDF, or slide deck.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 space-y-6">
          <div className="flex gap-2 bg-slate-100 rounded-lg p-1">
            {["youtube", "pdf", "pptx"].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  mode === m
                    ? "bg-white shadow text-slate-900"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {m === "youtube" ? "YouTube" : m.toUpperCase()}
              </button>
            ))}
          </div>

          {mode === "youtube" ? (
            <input
              type="text"
              placeholder="Paste a YouTube URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          ) : (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg py-8 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition">
              <span className="text-3xl mb-2">📄</span>
              <span className="text-sm text-slate-600 font-medium">
                {file ? file.name : `Click to upload ${mode.toUpperCase()}`}
              </span>
              <input
                type="file"
                accept={mode === "pdf" ? ".pdf" : ".pptx"}
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
            </label>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || (mode === "youtube" ? !videoUrl : !file)}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {loading ? "Processing..." : "Get Started"}
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 rounded-lg py-2 px-3">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentInput;