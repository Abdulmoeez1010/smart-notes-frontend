import { useState, useEffect } from "react";
import { getSummary } from "../api";

function SummaryView({ docId }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getSummary(docId)
      .then((res) => setSummary(res.data.summary))
      .catch((err) => setError(err.response?.data?.detail || "Something went wrong"))
      .finally(() => setLoading(false));
  }, [docId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <span className="w-6 h-6 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Generating summary...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-sm text-center bg-red-50 rounded-lg py-3 px-4">{error}</p>;
  }

  return (
    <div className="prose prose-sm max-w-none bg-slate-50 rounded-lg p-6 max-h-[500px] overflow-y-auto whitespace-pre-wrap text-slate-800 leading-relaxed animate-fadeIn">
      {summary}
    </div>
  );
}

export default SummaryView;