import { useState, useEffect } from "react";
import { getQuiz } from "../api";

function QuizView({ docId }) {
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setSubmitted(false);
    setAnswers({});
    getQuiz(docId)
      .then((res) => setQuestions(res.data.questions))
      .catch((err) => setError(err.response?.data?.detail || "Something went wrong"))
      .finally(() => setLoading(false));
  }, [docId]);

  const optionLetter = (idx) => ["A", "B", "C", "D"][idx];

  const handleSelect = (qIdx, letter) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIdx]: letter }));
  };

  const score = questions
    ? questions.filter((q, i) => answers[i] === q.correct_answer).length
    : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <span className="w-6 h-6 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Generating quiz...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-sm text-center bg-red-50 rounded-lg py-3 px-4">{error}</p>;
  }

  return (
    <div className="space-y-5 max-h-[500px] overflow-y-auto pr-1 animate-fadeIn">
      {questions.map((q, qIdx) => (
        <div key={qIdx} className="bg-slate-50 rounded-lg p-4">
          <p className="font-medium text-slate-800 text-sm mb-3">
            {qIdx + 1}. {q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, optIdx) => {
              const letter = optionLetter(optIdx);
              const selected = answers[qIdx] === letter;
              const isCorrect = letter === q.correct_answer;
              let style = "border-slate-200 hover:border-indigo-300";
              if (submitted && selected && isCorrect) style = "border-green-500 bg-green-50";
              else if (submitted && selected && !isCorrect) style = "border-red-500 bg-red-50";
              else if (submitted && isCorrect) style = "border-green-500 bg-green-50";
              else if (selected) style = "border-indigo-500 bg-indigo-50";

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelect(qIdx, letter)}
                  className={`w-full text-left border rounded-lg px-3 py-2 text-sm transition ${style}`}
                >
                  <span className="font-medium mr-2">{letter}.</span>
                  {opt}
                </button>
              );
            })}
          </div>
          {submitted && (
            <p className="text-xs text-slate-500 mt-2 italic">{q.explanation}</p>
          )}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(answers).length !== questions.length}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Submit Quiz
        </button>
      ) : (
        <p className="text-center font-semibold text-slate-800">
          Score: {score} / {questions.length}
        </p>
      )}
    </div>
  );
}

export default QuizView;