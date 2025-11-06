import React, { useMemo } from "react";
import { motion } from "framer-motion";

const InputSection = ({
  userInput,
  setUserInput,
  handleKeyDown,
  isGenerating,
  currentCharacter,
  generate,
  stopGeneration,
  progress,
  isAnalyzingConfidence,
}) => {
  // Dynamic rotating placeholder
  const placeholders = useMemo(
    () => [
      "Explain quantum physics in simple terms",
      "Teach me recursion like I'm 10",
      "How does blockchain really work?",
      "Why does the sky appear blue?",
      "Summarize the French Revolution in 3 lines",
    ],
    []
  );

  const randomPlaceholder =
    placeholders[Math.floor(Math.random() * placeholders.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative bg-white/30 backdrop-blur-2xl rounded-3xl border shadow-[0_8px_40px_rgba(0,0,0,0.15)] p-8 mb-8 transition-all duration-500 ${
        isGenerating ? "border-yellow-400 animate-pulse" : "border-white/40"
      } hover:bg-white/40 hover:shadow-[0_12px_60px_rgba(0,0,0,0.2)]`}
    >
      {/* Header */}
      <h3 className="text-3xl font-extrabold text-amber-700 mb-8 text-center tracking-tight drop-shadow-sm transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]">
        💭 What would you like to learn about?
      </h3>


      {/* Textarea */}
      <div className="relative">
        <motion.textarea
          whileFocus={{ scale: 1.02 }}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isGenerating}
          placeholder={`Ask anything and watch the ${currentCharacter.name.toLowerCase()} explain it! (e.g. "${randomPlaceholder}")`}
          className="w-full p-6 bg-white/80 backdrop-blur-md border border-amber-200 rounded-2xl 
                     focus:ring-4 focus:ring-yellow-300 focus:border-yellow-400 
                     resize-none h-32 text-gray-800 placeholder-gray-500 
                     transition-all duration-300 text-lg shadow-inner 
                     hover:shadow-lg hover:scale-[1.01]"
        />
        {userInput && (
          <div className="absolute bottom-3 right-3 bg-gray-800/70 text-white text-xs px-3 py-1 rounded-full shadow-md">
            {userInput.length} chars
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => generate(userInput)}
          disabled={isGenerating || !userInput.trim()}
          className={`px-8 py-4 bg-gradient-to-r ${currentCharacter.gradient} 
                      text-white font-bold rounded-2xl shadow-2xl text-lg 
                      transform transition-all duration-300 
                      hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
        >
          {isGenerating ? (
            <div className="flex items-center justify-center space-x-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="flex items-center">
                Creating Magic<span className="dot-animate ml-1"></span>
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <span>{currentCharacter.emoji}</span>
              <span>Generate Story</span>
              <span>✨</span>
            </div>
          )}
        </motion.button>

        {isGenerating && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={stopGeneration}
            className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl 
                       transform hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            🛑 Stop Generation
          </motion.button>
        )}
      </div>

      {/* Progress Bar */}
      {isGenerating && (
        <div className="mt-6">
          <div className="flex justify-between text-gray-600 text-sm mb-2">
            <span>Generating your story...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${currentCharacter.gradient} 
                          transition-all duration-500 ease-out rounded-full 
                          shadow-[0_0_15px_rgba(255,255,255,0.5)]`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Confidence Analysis */}
      {isAnalyzingConfidence && (
        <div className="mt-8">
          <div className="relative flex justify-center items-center space-x-3 text-gray-600">
            <div className="absolute w-10 h-10 rounded-full border-2 border-blue-400 animate-ping"></div>
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3">Analyzing content accuracy...</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default InputSection;
