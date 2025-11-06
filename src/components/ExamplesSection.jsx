import React from "react";
import { motion } from "framer-motion";

const ExamplesSection = ({ examples, handleExampleClick, isGenerating }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="bg-white/25 backdrop-blur-2xl rounded-3xl border border-white/40 shadow-[0_8px_40px_rgba(0,0,0,0.1)] p-10 mb-10 hover:bg-white/30 transition-all duration-500"
  >
    {/* Heading */}
    <h3 className="text-3xl font-extrabold text-amber-700 mb-10 text-center tracking-tight drop-shadow-sm">
      🚀 Try One of These Examples
    </h3>

    {/* Example Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {examples.map((example, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleExampleClick(example)}
          disabled={isGenerating}
          className={`group relative p-6 text-left rounded-2xl border transition-all duration-300
            ${
              isGenerating
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:border-amber-300 hover:bg-white/70"
            }
            bg-white/60 border-gray-200 backdrop-blur-sm`}
        >
          {/* Floating Badge */}
          <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-pink-500 flex items-center justify-center text-white text-sm font-bold shadow-md ">
            {index + 1}
          </div>

          {/* Content */}
          <div className="flex flex-col h-full">
            <div className="font-semibold text-gray-800 mb-3 group-hover:text-amber-800 transition-colors text-lg">
              {example}
            </div>
          </div>
        </motion.button>
      ))}
    </div>

    {/* Subtext */}
    <div className="text-center mt-10">
      <p className="text-gray-600 text-sm">
        💡 Click any example to auto-fill the input and see how your AI mentor
        responds!
      </p>
    </div>
  </motion.div>
);

export default ExamplesSection;
