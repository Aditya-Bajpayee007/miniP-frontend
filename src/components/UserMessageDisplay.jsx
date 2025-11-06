import React from "react";
import { motion } from "framer-motion";

const UserMessageDisplay = ({ userMessage, isGenerating, currentCharacter }) =>
  userMessage && !isGenerating ? (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`relative bg-white/25 backdrop-blur-2xl border border-white/40 rounded-3xl p-8 mb-10 shadow-[0_8px_40px_rgba(0,0,0,0.1)] 
        hover:shadow-[0_12px_50px_rgba(0,0,0,0.15)] transition-all duration-500`}
    >
      {/* Gradient accent bar */}
      <div
        className={`absolute top-0 left-0 w-full h-1 rounded-t-3xl bg-gradient-to-r ${currentCharacter.gradient}`}
      ></div>

      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl shadow-md bg-gradient-to-r ${currentCharacter.gradient} text-white`}
        >
          ❓
        </div>
        <h4 className="text-xl font-bold text-gray-800 tracking-tight drop-shadow-sm">
          Your Question
        </h4>
      </div>

      {/* Message Box */}
      <div className="relative bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow-inner">
        <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
          {userMessage}
        </p>

        {/* Decorative quote marks */}
        <div className="absolute -top-4 -left-3 text-4xl text-amber-400 opacity-30 select-none">
          “
        </div>
        <div className="absolute -bottom-6 right-4 text-4xl text-amber-400 opacity-30 select-none">
          ”
        </div>
      </div>

      {/* Subtext */}
      <div className="text-right mt-4">
        <p className="text-sm text-gray-500 italic">
          ✨ Asked with curiosity by you
        </p>
      </div>
    </motion.div>
  ) : null;

export default UserMessageDisplay;
