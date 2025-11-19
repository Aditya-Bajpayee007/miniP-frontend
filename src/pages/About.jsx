import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

// --- Floating Background Blob Component ---
const FloatingBlob = ({ color, top, left, size, delay, duration }) => {
  return (
    <motion.div
      className={`absolute rounded-full mix-blend-multiply filter blur-3xl opacity-40 ${color}`}
      style={{ top, left, width: size, height: size, zIndex: 0 }}
      animate={{
        y: [0, -50, 0],
        x: [0, 30, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: "reverse",
        delay: delay,
        ease: "easeInOut",
      }}
    />
  );
};

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } },
};

// --- Vibe images data ---
const VIBE_IMAGES = [
  {
    key: "minion",
    label: "Minion Mode",
    tag: "Chaotic & Fun",
    desc: "Playful minion-style explanations to keep you hooked.",
    img: "https://res.cloudinary.com/dturzqo8m/image/upload/v1761816164/slides/690265079d34062f5ec4f98f/xtnb2sibazlhjiiaeamx.png",
  },
  {
    key: "cats",
    label: "Tiny Cats Mode",
    tag: "Soft & Cozy",
    desc: "Gentle, stress-free learning with tiny cat vibes.",
    img: "https://res.cloudinary.com/dturzqo8m/image/upload/v1761768143/slides/690265079d34062f5ec4f98f/r9wxenekbsaqumzlc9xd.png",
  },
  {
    key: "comic",
    label: "Comic Style",
    tag: "Story-Driven",
    desc: "Comic panels that turn complex topics into stories.",
    img: "https://res.cloudinary.com/dturzqo8m/image/upload/v1761765025/slides/690265079d34062f5ec4f98f/qpq6awqvi4ieuglv9xqu.png",
  },
];

const About = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeVibeIndex, setActiveVibeIndex] = useState(0);
  const activeVibe = VIBE_IMAGES[activeVibeIndex];

  const goToHome = () => {
    if (user) navigate("/home");
  };

  // Auto-cycle vibes
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVibeIndex((prev) => (prev + 1) % VIBE_IMAGES.length);
    }, 4000); // 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-orange-50 selection:bg-orange-200 font-sans">
      {/* --- FLUID BACKGROUND ANIMATION --- */}
      <div className="absolute inset-0 overflow-hidden w-full h-full pointer-events-none">
        <FloatingBlob
          color="bg-amber-300"
          top="-10%"
          left="-10%"
          size="500px"
          delay={0}
          duration={10}
        />
        <FloatingBlob
          color="bg-orange-300"
          top="40%"
          left="80%"
          size="400px"
          delay={2}
          duration={12}
        />
        <FloatingBlob
          color="bg-yellow-200"
          top="80%"
          left="20%"
          size="600px"
          delay={4}
          duration={15}
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      </div>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* --- HERO HEADER --- */}
        <motion.div
          variants={itemVariants}
          className="text-center max-w-4xl mb-10"
        >
          <div className="inline-block px-6 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/50 shadow-sm mb-6">
            <span className="text-orange-600 font-bold tracking-wide uppercase text-sm">
              Revolutionizing Education
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-gray-900 leading-tight">
            Turn Complexity into <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-orange-500 to-red-500">
              Visual Clarity
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 font-light leading-relaxed max-w-3xl mx-auto">
            Visual Learner is an AI-powered platform that instantly converts
            text prompts into <strong>engaging slideshows</strong>,{" "}
            <strong>custom illustrations</strong>, and{" "}
            <strong>curated videos</strong>.
          </p>
        </motion.div>

        {/* --- CTA BUTTON (ABOVE HOW IT WORKS) --- */}
        <motion.div
          variants={itemVariants}
          className="mb-16 w-full flex justify-center"
        >
          <motion.button
            onClick={user ? goToHome : () => navigate("/home")}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 25px rgba(245, 158, 11, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xl font-bold shadow-xl border-2 border-transparent hover:border-white/20 transition-all backdrop-blur-sm"
          >
            {user ? "Start Creating Now" : "Try Visual Learner Free"}
          </motion.button>
        </motion.div>

        {/* --- HOW IT WORKS SECTION --- */}
        <motion.div variants={itemVariants} className="w-full mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">How It Works</h2>
            <p className="text-gray-600">
              Three simple steps to master any topic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "💭",
                title: "1. Enter a Topic",
                desc: "Type in any concept from 'Quantum Physics' to 'How Coffee is Made'.",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: "🎨",
                title: "2. Choose a Vibe",
                desc: "Select a persona: Minions for fun, Cats for cute, or Comics for storytelling.",
                color: "bg-orange-100 text-orange-600",
              },
              {
                icon: "✨",
                title: "3. Learn Instantly",
                desc: "Get 7 perfectly structured slides with AI images and video suggestions.",
                color: "bg-green-100 text-green-600",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="bg-white/60 backdrop-blur-xl border border-white/60 p-8 rounded-3xl shadow-lg flex flex-col items-center text-center"
              >
                <div
                  className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center text-3xl mb-6 shadow-inner`}
                >
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* --- THE "VIBE" SECTION --- */}
        <motion.div
          variants={itemVariants}
          className="w-full mb-20 bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-xl rounded-[3rem] p-10 border border-white/50 shadow-xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text & Modes */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Learning Doesn't Have To Be Boring
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Textbooks are dry. We inject personality into learning. By using
                <span className="font-bold text-orange-600">
                  {" "}
                  unique characters
                </span>
                , we create metaphors that make difficult concepts stick.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 p-3 bg-white/50 rounded-xl shadow-sm">
                  <span className="text-2xl">😄</span>
                  <div>
                    <span className="font-bold text-gray-800 block">
                      Minion Mode
                    </span>
                    <span className="text-sm text-gray-600">
                      Explains topics using chaotic, colorful fun.
                    </span>
                  </div>
                </li>
                <li className="flex items-center gap-4 p-3 bg-white/50 rounded-xl shadow-sm">
                  <span className="text-2xl">🐱</span>
                  <div>
                    <span className="font-bold text-gray-800 block">
                      Tiny Cats Mode
                    </span>
                    <span className="text-sm text-gray-600">
                      Soft, cute analogies for stress-free learning.
                    </span>
                  </div>
                </li>
                <li className="flex items-center gap-4 p-3 bg-white/50 rounded-xl shadow-sm">
                  <span className="text-2xl">💥</span>
                  <div>
                    <span className="font-bold text-gray-800 block">
                      Comic Style
                    </span>
                    <span className="text-sm text-gray-600">
                      Graphic novel narratives for visual thinkers.
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Right: Auto-cycling image */}
            <div className="relative w-full h-80 md:h-full bg-gradient-to-tr from-amber-200 to-orange-300 rounded-3xl shadow-inner overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10" />
              <div className="relative z-10 w-full h-full flex flex-col">
                {/* Image area */}
                <div className="flex-1 flex items-center justify-center p-4">
                  <motion.img
                    key={activeVibe.key}
                    src={activeVibe.img}
                    alt={activeVibe.label}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-h-full max-w-full drop-shadow-2xl"
                  />
                </div>

                {/* Caption */}
                

                {/* Dots indicator */}
                
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- TECH STACK GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-20">
          {/* Tech Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="p-8 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-100 rounded-xl text-2xl">⚡</div>
              <h2 className="text-2xl font-bold text-gray-800">
                Powering the Platform
              </h2>
            </div>
            <ul className="space-y-4 text-gray-700 text-lg">
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1 font-bold">•</span>
                <span>
                  <strong className="text-gray-900">Google Gemini 2.0:</strong>{" "}
                  The brain that structures complex thoughts into clear slides.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1 font-bold">•</span>
                <span>
                  <strong className="text-gray-900">Groq SDK:</strong> Ensures
                  near-instant generation speed.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1 font-bold">•</span>
                <span>
                  <strong className="text-gray-900">SERPAPI:</strong> Fetches
                  real-world context and images.
                </span>
              </li>
            </ul>
          </motion.div>

          {/* Benefits Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="p-8 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-100 rounded-xl text-2xl">🚀</div>
              <h2 className="text-2xl font-bold text-gray-800">
                Who Is This For?
              </h2>
            </div>
            <ul className="space-y-4 text-gray-700 text-lg">
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1 font-bold">•</span>
                <span>
                  <strong className="text-gray-900">Students:</strong> Cramming
                  for exams? Get summaries in seconds.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1 font-bold">•</span>
                <span>
                  <strong className="text-gray-900">Educators:</strong> Create
                  lesson outlines and engaging visuals instantly.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1 font-bold">•</span>
                <span>
                  <strong className="text-gray-900">Curious Minds:</strong>{" "}
                  Understand "How the Internet Works" or "Black Holes" simply.
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* --- TEAM SECTION --- */}
        <motion.div variants={itemVariants} className="w-full text-center">
          <h2 className="text-4xl font-bold mb-12 text-gray-800">
            Meet The Minds
          </h2>

          {/* Mentor Spotlight */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative mx-auto w-full max-w-md bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 mb-12 overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-amber-400 to-orange-500 opacity-80" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="relative p-1 rounded-full bg-white shadow-lg -mt-4 mb-4">
                <img
                  src="https://res.cloudinary.com/dturzqo8m/image/upload/v1763544323/dr-nishant-gupta_msgkkf.jpg"
                  alt="Dr. Nishant Gupta"
                  className="w-40 h-40 rounded-full object-cover border-4 border-orange-50"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Nishant Gupta
              </h3>
              <p className="text-orange-600 font-bold uppercase tracking-wider text-sm mt-1">
                Project Mentor
              </p>
              <p className="text-gray-600 mt-4 italic">
                "Visionary guidance transforming ideas into reality."
              </p>
            </div>
          </motion.div>

          {/* Mentees Row */}
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            {["Gagan Sharma", "Aditya Bajpayee"].map((name, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8 }}
                className="w-full sm:w-72 bg-white/50 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/40 flex flex-col items-center"
              >
                <div className="w-20 h-20 mb-4 rounded-full bg-gradient-to-tr from-orange-200 to-amber-200 flex items-center justify-center text-3xl shadow-inner">
                  👨‍💻
                </div>
                <h3 className="text-xl font-bold text-gray-800">{name}</h3>
                <p className="text-gray-500 text-sm font-medium uppercase mb-2">
                  Full Stack Developer
                </p>
                <div className="w-10 h-1 bg-orange-300 rounded-full" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer Spacing */}
        <div className="h-20" />
      </motion.div>
    </div>
  );
};

export default About;
