import React from "react";

const CharacterSelector = ({
  characterOptions,
  selectedCharacter,
  setSelectedCharacter,
  isGenerating,
}) => (
  <div className="bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] p-10 mb-10">
    <h3 className="text-3xl font-extrabold text-amber-700 mb-8 text-center tracking-tight drop-shadow-sm">
      🎭 Choose Your Storyteller
    </h3>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-15">
      {Object.entries(characterOptions).map(([key, character]) => (
        <button
          key={key}
          onClick={() => !isGenerating && setSelectedCharacter(key)}
          disabled={isGenerating}
          className={`group relative overflow-hidden p-6 rounded-2xl font-semibold transition-all duration-300 transform flex flex-col items-center justify-center min-h-[130px] ${
            selectedCharacter === key
              ? `bg-gradient-to-br ${character.gradient} text-white shadow-[0_0_25px_rgba(245,158,11,0.6)] scale-105 border border-amber-300/50`
              : "bg-white/30 text-amber-800 border border-white/40 hover:bg-white/50 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] shadow-md"
          } disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100`}
        >
          <div className="text-5xl mb-3">{character.emoji}</div>
          <div className="text-base font-medium text-center leading-tight">
            {character.name.replace(character.emoji + ' ', '')}
          </div>

          {/* Subtle reflective overlay for glassmorphism */}
          {selectedCharacter === key && (
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-amber-200/10 rounded-2xl blur-md opacity-70 pointer-events-none"></div>
          )}
        </button>
      ))}
    </div>
  </div>
);

export default CharacterSelector;
