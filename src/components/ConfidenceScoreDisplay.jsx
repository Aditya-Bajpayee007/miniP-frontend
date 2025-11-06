import React from "react";
import { motion } from "framer-motion";

const ConfidenceScoreDisplay = ({
  confidenceScore,
  isGenerating,
  getConfidenceColor,
  getConfidenceGradient,
}) =>
  confidenceScore && !isGenerating ? (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white/25 backdrop-blur-2xl rounded-3xl border border-white/40 shadow-[0_8px_40px_rgba(0,0,0,0.1)] p-10 mb-10 hover:bg-white/30 transition-all duration-500"
    >
      {/* Heading */}
      <h3 className="text-3xl font-extrabold text-amber-700 mb-10 text-center tracking-tight drop-shadow-sm">
        🎯 Information Confidence Score
      </h3>

      {/* Score and Emoji */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
        <div
          className={`text-7xl font-extrabold ${getConfidenceColor(
            confidenceScore.score
          )} drop-shadow-md`}
        >
          {confidenceScore.score}%
        </div>

        <div
          className={`w-20 h-20 rounded-full bg-gradient-to-r ${getConfidenceGradient(
            confidenceScore.score
          )} flex items-center justify-center shadow-[0_0_25px_rgba(0,0,0,0.2)]`}
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="text-4xl"
          >
            {confidenceScore.score >= 85
              ? "✅"
              : confidenceScore.score >= 70
              ? "⚡"
              : "⚠️"}
          </motion.span>
        </div>
      </div>

      {/* Confidence Level and Description */}
      <div className="text-center mb-12">
        <div
          className={`text-2xl font-semibold ${getConfidenceColor(
            confidenceScore.score
          )} mb-3`}
        >
          {confidenceScore.score >= 85
            ? "High Confidence"
            : confidenceScore.score >= 70
            ? "Good Confidence"
            : "Moderate Confidence"}
        </div>
        <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed text-lg">
          {confidenceScore.reasoning}
        </p>
      </div>

      {/* Strengths & Considerations Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strengths */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-2xl p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 shadow-inner"
        >
          <h4 className="text-xl font-bold text-green-800 mb-3 flex items-center">
            <span className="text-2xl mr-2">💪</span>
            Strengths
          </h4>
          <p className="text-green-700 leading-relaxed text-md">
            {confidenceScore.strengths}
          </p>
        </motion.div>

        {/* Considerations */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-2xl p-6 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 shadow-inner"
        >
          <h4 className="text-xl font-bold text-amber-800 mb-3 flex items-center">
            <span className="text-2xl mr-2">🔍</span>
            Considerations
          </h4>
          <p className="text-amber-700 leading-relaxed text-md">
            {confidenceScore.improvements}
          </p>
        </motion.div>
      </div>
    </motion.div>
  ) : null;

export default ConfidenceScoreDisplay;
