import { useState, useEffect } from "react";
import { getMindmap } from "../api";

function Node({ node, depth = 0 }) {
  const [open, setOpen] = useState(depth < 1);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className={depth > 0 ? "ml-4 border-l border-slate-200 pl-3" : ""}>
      <div
        onClick={() => hasChildren && setOpen(!open)}
        className={`flex items-center gap-1.5 py-1.5 text-sm ${
          hasChildren ? "cursor-pointer" : ""
        } ${depth === 0 ? "font-semibold text-slate-900" : "text-slate-700"}`}
      >
        {hasChildren && (
          <span className="text-slate-400 text-xs w-3">{open ? "▾" : "▸"}</span>
        )}
        {!hasChildren && <span className="w-3" />}
        {node.topic}
      </div>
      {hasChildren && open && (
        <div>
          {node.children.map((child, i) => (
            <Node key={i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function MindmapView({ docId }) {
  const [mindmap, setMindmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getMindmap(docId)
      .then((res) => setMindmap(res.data.mindmap))
      .catch((err) => setError(err.response?.data?.detail || "Something went wrong"))
      .finally(() => setLoading(false));
  }, [docId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <span className="w-6 h-6 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Generating mindmap...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-sm text-center bg-red-50 rounded-lg py-3 px-4">{error}</p>;
  }

  return (
    <div className="bg-slate-50 rounded-lg p-4 max-h-[500px] overflow-y-auto animate-fadeIn">
      <Node node={mindmap} />
    </div>
  );
}

export default MindmapView;