import React from "react";
import { motion } from "framer-motion";
import { MathJax } from "better-react-mathjax";

const ResultsDisplay = ({
  slides,
  isGenerating,
  selectedCharacter,
  currentCharacter,
  onInsertSlide,
  onImageError, // (index) => void - called when an image fails to load
  insertedSlides = new Set(), // Provide a default empty Set
}) => {
  if (slides.length === 0) return null;

  // Define a default character for when it's not provided (e.g., on SlideDetail page)
  const defaultCharacter = {
    name: "Default",
    emoji: "📚",
    // use a colorful default gradient so read-only pages don't look monochrome
    gradient: "from-amber-500 to-yellow-500",
  };

  const currentDisplayCharacter = currentCharacter || defaultCharacter;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div
          className={`inline-block p-6 bg-gradient-to-r ${currentDisplayCharacter.gradient} bg-opacity-20 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl mb-8`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Your{" "}
            {currentDisplayCharacter.name
              .replace(currentDisplayCharacter.emoji, "")
              .trim()}{" "}
            {selectedCharacter === "comic" ? "Comic Page" : "Story"}
          </h2>
          <div
            className={`w-32 h-1 bg-gradient-to-r ${currentDisplayCharacter.gradient} rounded-full mx-auto`}
          ></div>
        </div>
      </div>
      <div className="space-y-0">
        {slides.map((slide, index) => {
          return (
            <React.Fragment key={index}>
              <motion.div
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.45 }}
                className="group bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 overflow-hidden transform transition-all duration-500 shadow-2xl mb-8"
              >
                <div
                  className={`flex flex-col ${
                    slide.image ? "lg:flex-row" : ""
                  } min-h-[200px]`}
                >
                  {/* Only render image section if image exists */}
                  {slide.image && (
                    <div className="lg:w-1/2 p-8 bg-gradient-to-br from-white/30 to-white/50 flex flex-col">
                      <div className="max-w-lg mx-auto flex-1 flex items-center">
                        <img
                          src={slide.image}
                          alt={`Slide ${index + 1}`}
                          className="w-full h-auto rounded-2xl shadow-2xl border-4 border-white/50 group-hover:shadow-3xl transition-shadow duration-500"
                          loading="lazy"
                          onError={() => {
                            // Notify parent to attempt fallback if provided
                            try {
                              onImageError && onImageError(index);
                            } catch (e) {
                              // swallow errors from callback
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {/* Text section takes full width when no image */}
                  <div
                    className={`${
                      slide.image ? "lg:w-1/2" : "w-full"
                    } p-8 flex items-center`}
                  >
                    <div className="w-full">
                      {/* Slide heading shown only when image exists */}
                      {slide.image && slide.title && (
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                          {slide.title.replace("Slide Heading:", "")}
                        </h3>
                      )}

                      <div className="flex items-center mb-6">
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${currentDisplayCharacter.gradient} rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 shadow-lg`}
                        >
                          {index + 1}
                        </div>
                        <div
                          className={`h-1 bg-gradient-to-r ${currentDisplayCharacter.gradient} flex-1 rounded-full`}
                        ></div>
                      </div>
                      <MathJax dynamic>
                        <div className="prose prose-xl max-w-none text-gray-700 leading-relaxed">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: (slide.text || "").includes("<ul>")
                                ? (slide.text || "").replace(
                                    /<ul>([\s\S]*?)<\/ul>/g,
                                    (match) => {
                                      return match.replace(
                                        /<li>([\s\S]*?)<\/li>/g,
                                        (liMatch, liContent) =>
                                          `<li style='display:flex;align-items:flex-start;gap:0.75em;margin-bottom:0.5em;'><span style='display:inline-block;width:0.85em;height:0.85em;background:linear-gradient(90deg,#6366f1,#ec4899);border-radius:50%;margin-top:0.45em;flex-shrink:0;'></span><span style='flex:1;'>${liContent}</span></li>`
                                      );
                                    }
                                  )
                                : slide.text,
                            }}
                          />
                        </div>
                      </MathJax>
                    </div>
                  </div>
                </div>
              </motion.div>
              {/* PLUS button between slides, except after last slide.
          Render only when an onInsertSlide handler is provided (read-only pages won't pass it). */}
              {typeof onInsertSlide === "function" &&
                index < slides.length - 1 &&
                !insertedSlides.has(index) && (
                  <div className="flex justify-center my-2">
                    <button
                      className={`rounded-full bg-gradient-to-r ${
                        isGenerating
                          ? "from-gray-400 to-gray-500"
                          : "from-green-400 to-blue-500"
                      } text-white w-12 h-12 flex items-center justify-center text-3xl shadow-lg border-4 border-white hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                      onClick={() => onInsertSlide(index)}
                      disabled={isGenerating}
                      aria-label={
                        isGenerating
                          ? "Generating content..."
                          : "Add detail between slides"
                      }
                    >
                      {isGenerating ? (
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "+"
                      )}
                    </button>
                  </div>
                )}
            </React.Fragment>
          );
        })}
      </div>
      {!isGenerating && (
        <div className="text-center py-12">
          <div
            className={`inline-flex items-center space-x-4 bg-gradient-to-r ${currentDisplayCharacter.gradient} text-white px-12 py-6 rounded-full font-bold text-xl shadow-2xl transform hover:scale-105 transition-all duration-300`}
          >
            <span className="text-2xl">🎉</span>
            <span>Story Complete!</span>
            <span className="text-2xl">🎉</span>
          </div>
          <p className="text-gray-600 mt-4 text-lg">
            Hope you enjoyed learning with the{" "}
            {currentDisplayCharacter.name.toLowerCase()}!
          </p>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
