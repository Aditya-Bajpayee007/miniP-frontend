import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.12, when: "beforeChildren" },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 110, damping: 14 },
  },
};

const About = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const goToHome = () => {
    if (user) navigate("/home");
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-start p-8 bg-gradient-to-b from-amber-50 via-orange-50 to-white"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.div
        variants={sectionVariants}
        className="max-w-4xl w-full bg-gradient-to-br from-white/90 to-amber-50/60 backdrop-blur-md rounded-2xl shadow-xl p-10 border border-amber-100"
      >
        <motion.h1
          variants={sectionVariants}
          className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-orange-500 to-red-400 text-center"
        >
          About Visual Learner
        </motion.h1>

        <motion.p
          variants={sectionVariants}
          className="text-gray-700 mb-6 leading-relaxed text-lg text-center"
        >
          <span className="font-semibold text-orange-600">Visual Learner</span> is an AI-powered
          slide generation platform that turns ideas into dynamic, visually captivating
          presentations. With just a prompt, users can generate complete slides bringing clarity,
          creativity, and simplicity to the learning and presenting process.
        </motion.p>

        <motion.p
          variants={sectionVariants}
          className="text-gray-700 mb-10 leading-relaxed text-center"
        >
          By combining intelligent automation with intuitive design, Visual Learner saves hours of
          manual effort. Whether you’re a student summarizing concepts, a teacher crafting lessons,
          or a professional preparing for meetings it helps you focus on{" "}
          <span className="text-orange-600 font-medium">what matters {"->"} your ideas.</span>
        </motion.p>

        {/* --- BUTTON (ABOVE TECH SECTION) --- */}
        <motion.div variants={sectionVariants} className="mb-12 flex justify-center w-full">
          {user ? (
            <motion.button
              onClick={goToHome}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-1/2 px-5 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg font-semibold shadow-md hover:shadow-lg transition-all"
            >
              Go to Home
            </motion.button>
          ) : (
            <motion.button
              onClick={() => navigate("/home")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-1/2 px-5 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg font-semibold shadow-md hover:shadow-lg transition-all"
            >
              Explore Slides
            </motion.button>
          )}
        </motion.div>

        {/* --- AI POWER SECTION --- */}
        <motion.div variants={sectionVariants} className="mt-4">
          <h2 className="text-2xl font-semibold mb-4 text-amber-700 text-center">
            The Intelligence Behind the Slides
          </h2>
          <p className="text-gray-700 leading-relaxed text-center mb-6">
            Visual Learner integrates advanced AI technologies to make your slides smart,
            context-aware, and beautifully designed:
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-orange-500 text-lg">•</span>
              <span>
                <strong>Google Gemini:</strong> Converts your ideas and prompts into structured,
                coherent slide content.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-500 text-lg">•</span>
              <span>
                <strong>Groq SDK:</strong> Ensures lightning-fast generation and intelligent text
                understanding for smoother user experiences.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-500 text-lg">•</span>
              <span>
                <strong>SERPAPI:</strong> Retrieves relevant, high-quality images when Gemini cannot
                generate one enriching slides visually.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-500 text-lg">•</span>
              <span>
                <strong>Better React MathJax:</strong> Renders complex equations cleanly for
                educators and learners dealing with math-heavy content.
              </span>
            </li>
          </ul>
        </motion.div>

        {/* --- BENEFITS SECTION --- */}
        <motion.div variants={sectionVariants} className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-amber-700 text-center">Key Benefits</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-orange-500 text-lg">•</span>
              <span>
                <strong>Empowers Learners:</strong> Converts complex topics into simple visuals,
                improving comprehension and retention.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-500 text-lg">•</span>
              <span>
                <strong>Accelerates Preparation:</strong> Builds polished presentations in seconds,
                saving hours of effort.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-500 text-lg">•</span>
              <span>
                <strong>Accessible for All:</strong> Makes professional presentation design easy for
                students, teachers, and teams.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-500 text-lg">•</span>
              <span>
                <strong>Encourages Visual Thinking:</strong> Turns abstract information into visual
                stories that stick.
              </span>
            </li>
          </ul>
        </motion.div>

        {/* --- IMPACT SECTION --- */}
        <motion.div variants={sectionVariants} className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-amber-700 text-center">
            Global Impact
          </h2>
          <motion.p className="text-gray-700 leading-relaxed text-center">
            In an age where attention spans are short and content is abundant,
            <span className="text-orange-600 font-medium"> Visual Learner</span> restores focus by
            turning learning into an interactive experience. It empowers educators to inspire,
            students to explore, and teams to communicate better.
            <br />
            <br />
            Each AI-generated slide contributes to a world where{" "}
            <span className="text-orange-600 font-medium">
              knowledge becomes visual, impactful, and universally accessible.
            </span>
          </motion.p>
        </motion.div>

        {/* --- TEAM SECTION (Mentor on top, mentees below) --- */}
        <motion.div variants={sectionVariants} className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-8 text-amber-700 text-center">Our Team</h2>

          {/* Mentor Card */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.03 }}
            className="mx-auto mb-8 p-6 rounded-xl bg-white shadow-md border border-amber-100 w-full sm:w-1/2"
          >
            <p className="font-semibold text-gray-700">Mentor</p>
            <p className="text-gray-600 mt-2 text-lg">Nishant Gupta</p>
          </motion.div>

          {/* Mentees Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center">
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.03 }}
              className="p-5 rounded-xl bg-white shadow-md border border-amber-100 w-full sm:w-3/4"
            >
              <p className="font-semibold text-gray-700">Mentee</p>
              <p className="text-gray-600 mt-2 text-lg">Gagan Sharma</p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.03 }}
              className="p-5 rounded-xl bg-white shadow-md border border-amber-100 w-full sm:w-3/4"
            >
              <p className="font-semibold text-gray-700">Mentee</p>
              <p className="text-gray-600 mt-2 text-lg">Aditya Bajpayee</p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default About;
