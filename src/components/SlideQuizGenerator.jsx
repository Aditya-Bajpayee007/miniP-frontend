import React from "react";
import { useParams } from "react-router-dom";
import { generateSlideQuiz } from "../services/slidesService";
import {
  Brain,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Loader2,
  Trophy,
} from "lucide-react";

const DIFFICULTIES = [
  {
    id: "easy",
    label: "Easy",
    desc: "Core definitions & basic recall",
    activeClass:
      "bg-emerald-500 text-white border-emerald-600 shadow-md",
    idleClass:
      "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  },
  {
    id: "medium",
    label: "Medium",
    desc: "Concepts & connections",
    activeClass:
      "bg-amber-500 text-white border-amber-600 shadow-md",
    idleClass:
      "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  },
  {
    id: "hard",
    label: "Hard",
    desc: "Deep analysis & application",
    activeClass:
      "bg-rose-500 text-white border-rose-600 shadow-md",
    idleClass:
      "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
  },
];

const OPTION_LETTERS = ["A", "B", "C", "D"];

const SlideQuizGenerator = ({ topic }) => {
  const { id: slideId } = useParams();
  const [difficulty, setDifficulty] = React.useState("medium");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [quiz, setQuiz] = React.useState(null);
  const [answers, setAnswers] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);

  const handleGenerateQuiz = async () => {
    setError(null);
    setLoading(true);
    setSubmitted(false);
    setAnswers({});

    try {
      const data = await generateSlideQuiz(slideId, difficulty);
      setQuiz(data);
    } catch (err) {
      setError(err.message || "Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionIndex, optionIndex) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    if (!quiz?.questions?.length) return;
    setSubmitted(true);
  };

  const handleRetake = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const totalQuestions = quiz?.questions?.length || 0;
  const answeredCount = Object.keys(answers).length;
  const score = submitted
    ? quiz.questions.reduce(
        (acc, q, idx) => (answers[idx] === q.correctIndex ? acc + 1 : acc),
        0
      )
    : 0;

  return (
    <div className="mt-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 max-w-4xl mx-auto">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                7-Question Knowledge Quiz
              </h3>
              <p className="text-sm text-gray-600">
                Test your understanding of{" "}
                <span className="font-medium text-gray-800">
                  {topic || "this presentation"}
                </span>
              </p>
            </div>
          </div>

          {quiz && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-amber-100 text-amber-800">
              {quiz.difficulty} level
            </span>
          )}
        </div>

        {/* Difficulty Selector */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Difficulty
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {DIFFICULTIES.map((level) => {
              const isSelected = difficulty === level.id;
              return (
                <button
                  key={level.id}
                  type="button"
                  disabled={loading}
                  onClick={() => setDifficulty(level.id)}
                  className={`text-left px-4 py-3 rounded-xl border transition-all duration-150 cursor-pointer ${
                    isSelected ? level.activeClass : level.idleClass
                  } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <div className="font-semibold text-sm">{level.label}</div>
                  <div
                    className={`text-xs mt-0.5 ${
                      isSelected ? "text-white/90" : "opacity-80"
                    }`}
                  >
                    {level.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleGenerateQuiz}
            disabled={loading}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white shadow-sm transition-colors duration-150 cursor-pointer ${
              loading
                ? "bg-amber-300 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating 7 Questions...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {quiz ? "Regenerate Quiz" : "Generate 7-Question Quiz"}
              </>
            )}
          </button>

          {quiz && submitted && (
            <button
              type="button"
              onClick={handleRetake}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </button>
          )}
        </div>

        {/* Quiz Questions */}
        {quiz && quiz.questions?.length > 0 && (
          <div className="mt-6 pt-6 border-t border-amber-100 space-y-6">
            {/* Score Summary Banner */}
            {submitted && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-amber-500 text-white flex items-center justify-center shadow">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-800">
                      Your Score: {score} / {totalQuestions} (
                      {Math.round((score / totalQuestions) * 100)}%)
                    </div>
                    <div className="text-sm text-gray-600">
                      {score === totalQuestions
                        ? "Perfect score! You mastered this presentation."
                        : score >= Math.ceil(totalQuestions * 0.7)
                          ? "Great job! Review any missed explanations below."
                          : "Good effort! Check the explanations below and try again."}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {quiz.questions.map((q, qIdx) => {
              const selectedOpt = answers[qIdx];
              return (
                <div
                  key={qIdx}
                  className="p-5 rounded-xl bg-white border border-gray-100 shadow-sm"
                >
                  <p className="font-semibold text-gray-800 mb-3">
                    <span className="text-amber-600 mr-2">Q{qIdx + 1}.</span>
                    {q.question}
                  </p>

                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = selectedOpt === oIdx;
                      const isCorrect = q.correctIndex === oIdx;

                      let optionStyle =
                        "bg-gray-50 border-gray-200 text-gray-800 hover:bg-amber-50 hover:border-amber-300";

                      if (!submitted && isSelected) {
                        optionStyle =
                          "bg-amber-100 border-amber-500 text-amber-900 font-medium";
                      } else if (submitted) {
                        if (isCorrect) {
                          optionStyle =
                            "bg-emerald-50 border-emerald-500 text-emerald-900 font-medium";
                        } else if (isSelected && !isCorrect) {
                          optionStyle =
                            "bg-rose-50 border-rose-400 text-rose-900";
                        } else {
                          optionStyle =
                            "bg-gray-50 border-gray-200 text-gray-500";
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          disabled={submitted}
                          onClick={() => handleSelectOption(qIdx, oIdx)}
                          className={`w-full text-left px-4 py-2.5 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                            submitted ? "cursor-default" : "cursor-pointer"
                          } ${optionStyle}`}
                        >
                          <span className="flex items-center gap-3">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-white border border-current/20 shrink-0">
                              {OPTION_LETTERS[oIdx] || oIdx + 1}
                            </span>
                            <span>{opt}</span>
                          </span>

                          {submitted && isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          )}
                          {submitted && isSelected && !isCorrect && (
                            <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {submitted && q.explanation && (
                    <div className="mt-3 p-3 rounded-lg bg-amber-50/70 border border-amber-100 text-sm text-gray-700">
                      <span className="font-semibold text-amber-800">
                        Explanation:{" "}
                      </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}

            {!submitted && (
              <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
                <span className="text-sm text-gray-600">
                  {answeredCount} of {totalQuestions} questions answered
                </span>
                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  disabled={answeredCount < totalQuestions}
                  className={`px-6 py-2.5 rounded-lg font-semibold text-white shadow-sm transition-colors ${
                    answeredCount < totalQuestions
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 cursor-pointer"
                  }`}
                >
                  {answeredCount < totalQuestions
                    ? `Answer all ${totalQuestions} questions to submit`
                    : "Submit Quiz"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SlideQuizGenerator;
