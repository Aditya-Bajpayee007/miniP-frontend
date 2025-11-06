import React from "react";
import { motion } from "framer-motion";

const LoadingAnimation = ({ isGenerating, currentCharacter }) =>
  isGenerating ? (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl sticky top-0 z-50 py-8 bg-white/25 backdrop-blur-2xl border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
    >
      <div className="flex items-center justify-center space-x-5 ">
        {/* Spinner + Character Emoji */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className={`w-12 h-12 border-4 border-white/40 border-t-transparent rounded-full`}
            style={{
              backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
            }}
          ></motion.div>
          <div
            className={`absolute inset-0 flex items-center justify-center text-2xl`}
          >
            {currentCharacter.emoji}
          </div>
        </div>

        {/* Text Section */}
        <div className="text-left">
          <h4
            className={`text-xl font-bold bg-gradient-to-r ${currentCharacter.gradient} text-transparent bg-clip-text drop-shadow-sm`}
          >
            {currentCharacter.name} is creating something magical...
          </h4>
          <p className="text-gray-700 text-sm mt-1 tracking-wide">
            ✨ Generating ideas, words, and illustrations...
          </p>
        </div>
      </div>

      {/* Progress Bar Animation (Optional visual accent) */}
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className={`mt-6 h-1 bg-gradient-to-r ${currentCharacter.gradient} rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)]`}
      ></motion.div>
    </motion.div>
  ) : null;

export default LoadingAnimation;
