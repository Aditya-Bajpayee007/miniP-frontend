import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useGeneration } from "../context/GenerationContext";
import { saveSlides } from "../services/slidesService";
import { uploadBase64ToCloudinary } from "../services/uploadService";
import CharacterSelector from "../components/CharacterSelector";
import InputSection from "../components/InputSection";
import ExamplesSection from "../components/ExamplesSection";
import ErrorDisplay from "../components/ErrorDisplay";
import UserMessageDisplay from "../components/UserMessageDisplay";
import ConfidenceScoreDisplay from "../components/ConfidenceScoreDisplay";
import LoadingAnimation from "../components/LoadingAnimation";
import ResultsDisplay from "../components/ResultsDisplay";
import { marked } from "marked";
import Groq from "groq-sdk";
import { Link, useNavigate } from "react-router-dom";

const GeminiSlideshowGenerator = () => {
  const { user, accessToken } = useAuth();
  const { isGenerating, setIsGenerating } = useGeneration();
  const [savingStatus, setSavingStatus] = useState("");
  const navigate = useNavigate();
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [userInput, setUserInput] = useState("");

  const [slides, setSlides] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [error, setError] = useState("");
  const [insertedSlides, setInsertedSlides] = useState(new Set());
  const [selectedCharacter, setSelectedCharacter] = useState("minions");
  const [progress, setProgress] = useState(0);
  const [confidenceScore, setConfidenceScore] = useState(null);
  const [isAnalyzingConfidence, setIsAnalyzingConfidence] = useState(false);
  const textareaRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Your character options remain the same
  const characterOptions = {
    cats: {
      name: "🐱 Tiny Cats",
      instruction: "Use a fun story about lots of tiny cats as a metaphor.",
      emoji: "🐱",
      style:
        "in a cute, vibrant, and colorful cartoon style with soft lighting",
      gradient: "from-pink-400 via-purple-400 to-indigo-400",
    },
    minions: {
      name: "😄 Colorful Minions",
      instruction:
        "Use a fun story about lots of colorful minions as a metaphor.",
      emoji: "😄",
      style: "in a zany, humorous, 3D-animated movie style with bright colors",
      gradient: "from-yellow-400 via-orange-400 to-red-400",
    },
    comic: {
      name: "💥 Comic Book",
      instruction:
        "Explain the topic in a structured, engaging comic-style narrative that uses storytelling elements.",
      emoji: "💥",
      style:
        "refined American graphic novel style with clean lines, subtle shading, and elegant corporate-friendly colors",
      gradient: "from-red-400 via-pink-400 to-purple-400",
    },
  };

  // Function to search for images using SERPAPI and enhance with SD model
  const searchAndEnhanceImage = async (keywords) => {
    if (!keywords || keywords.length === 0) return null;

    const searchQuery = keywords.join(" ");
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    try {
      // Step 1: Get image from SERPAPI
      const res = await fetch(
        `${baseUrl.replace(/\/$/, "")}/api/image/search?q=${encodeURIComponent(
          searchQuery,
        )}`,
        { method: "GET" },
      );

      if (!res.ok) {
        console.warn("Image search returned non-OK status", res.status);
        return null;
      }

      const data = await res.json();
      console.log("Backend JSON response (image search):", data);

      const serpApiImageUrl = data.image || null;
      if (!serpApiImageUrl) {
        console.warn("No image found from SERPAPI");
        return null;
      }

      // Step 2: Enhance image with SD model via backend endpoint
      try {
        const enhancedImage = await enhanceImageWithSD(
          serpApiImageUrl,
          keywords,
          baseUrl
        );
        return enhancedImage || serpApiImageUrl; // Fallback to original if enhancement fails
      } catch (sdError) {
        console.warn("SD model enhancement failed, using original SERPAPI image:", sdError);
        return serpApiImageUrl;
      }
    } catch (error) {
      console.error("Image search failed:", error?.message || error);
      return null;
    }
  };

  // Function to enhance image using SD model via backend endpoint
  const enhanceImageWithSD = async (imageUrl, keywords, baseUrl) => {
    try {
      console.log(`Enhancing image with SD model: ${imageUrl.substring(0, 50)}...`);

      // Create a prompt for the SD model
      const enhancementPrompt = `Enhance and refine this image focusing on: ${keywords.join(
        ", ",
      )}. Make it more educational, vivid, and visually appealing. Maintain the original content while improving quality and clarity.`;

      // Call backend endpoint which proxies to SD model
      const response = await fetch(
        `${baseUrl.replace(/\/$/, "")}/api/image/enhance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image_url: imageUrl,
            prompt: enhancementPrompt,
          }),
        }
      );

      if (!response.ok) {
        console.warn(`SD enhancement returned status ${response.status}`);
        return null;
      }

      const result = await response.json();

      // Check if response contains enhanced image data
      if (result.image || result.image_url || result.enhanced_image) {
        const enhancedUrl = result.image || result.image_url || result.enhanced_image;
        console.log("SD enhancement successful");
        return enhancedUrl;
      }

      // If response is a base64 image directly
      if (result.data && typeof result.data === "string") {
        return `data:image/png;base64,${result.data}`;
      }

      console.warn("SD model did not return expected image format");
      return null;
    } catch (error) {
      console.error("SD model enhancement error:", error);
      return null;
    }
  };

  // Keep original searchImageOnWeb as fallback (for backward compatibility)
  const searchImageOnWeb = async (keywords) => {
    if (!keywords || keywords.length === 0) return null;

    const searchQuery = keywords.join(" ");
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    try {
      const res = await fetch(
        `${baseUrl.replace(/\/$/, "")}/api/image/search?q=${encodeURIComponent(
          searchQuery,
        )}`,
        { method: "GET" },
      );

      if (!res.ok) {
        console.warn("Image search returned non-OK status", res.status);
        return null;
      }

      const data = await res.json();
      console.log("Backend JSON response (image search):", data);

      return data.image || null;
    } catch (error) {
      console.error("Image search failed:", error?.message || error);
      return null;
    }
  };

  const handleInsertSlide = async (insertIndex) => {
    if (isGenerating) return;
    setIsGenerating(true);
    setError("");
    try {
      const prevText = slides[insertIndex]?.text || "";
      const nextText = slides[insertIndex + 1]?.text || "";
      const stripHtml = (html) => html.replace(/<[^>]+>/g, "");
      const prevPlain = stripHtml(prevText);
      const nextPlain = stripHtml(nextText);
      const character = characterOptions[selectedCharacter];

      // New prompt for bullet points and timeline for history
      const prompt = `You are an expert explainer. Your task is to identify and list the 3-4 most important events, facts, or transitions that logically connect the following two slides.

Previous slide content: ${prevPlain}

Next slide content: ${nextPlain}

Instructions:
- Output ONLY 3-4 bullet points (no paragraphs, no intro, no conclusion).
- If the topic is historical (contains years, dates, or historical context):
  • Each bullet must begin with the year or date, followed by a dash and the event.
  • Arrange all bullet points in chronological order.
  Example:
  - 1939 - Germany invades Poland, triggering World War II.
  - 1941 - Germany invades the Soviet Union, escalating the conflict.
- If the topic is NOT historical, simply provide 3-4 bullet points describing the logical or factual connections (no dates needed).
  Example:
  - Data is cleaned before transformation.
  - Outliers are removed to improve model accuracy.
- Do NOT include any labels like "Context" or "Timeline."
- Do NOT use any brackets or markdown formatting.
- Do NOT repeat text from either slide verbatim.
- Focus only on the logical or factual bridge between the two slides.
- Use plain text only.

Style: ${character.instruction}`;

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You generate educational slide bullet points and timelines as instructed.",
          },
          { role: "user", content: prompt },
        ],
        stream: false,
      });

      const newText = completion.choices[0]?.message?.content?.trim() || "";
      // No cleanupText: preserve bullet formatting
      const htmlText = await marked.parse(newText);

      // Create new slide without image
      const newSlide = {
        text: htmlText,
        image: null, // No image generation
        keywords: [], // Empty keywords array
      };

      // Insert the new slide
      const updatedSlides = [
        ...slides.slice(0, insertIndex + 1),
        newSlide,
        ...slides.slice(insertIndex + 1),
      ];
      setSlides(updatedSlides);

      // Mark both the original insertion point and the new boundary as used
      setInsertedSlides((prev) => {
        const newSet = new Set(prev);
        // Mark the original insertion point
        newSet.add(insertIndex);
        // Mark the new boundary created by the insertion
        newSet.add(insertIndex + 1);
        return newSet;
      });
    } catch (e) {
      setError("Failed to insert additional detail. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to clean up text content
  const cleanupText = (text) => {
    // Remove titles that follow common patterns
    return text
      .replace(
        /^(Slide \d+:?|Step \d+:?|Part \d+:?|Section \d+:?|Chapter \d+:?)\s*/i,
        "",
      )
      .replace(/^([A-Z][^.!?]*:)\s*/gm, "")
      .trim();
  };

  // Function to extract keywords from text
  const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  // Updated keyword extraction using GROQ
  const extractKeywords = async (text) => {
    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are an expert keyword extractor for educational image generation.
Extract 3-5 key visual concepts from the input text that would make excellent, concrete image prompts.
Focus on tangible objects, scenes, processes, or concepts that can be visually represented.
Avoid abstract concepts. Return as JSON format:
{
  "keywords": ["visual_concept_1", "visual_concept_2", "visual_concept_3"]
}`,
          },
          {
            role: "user",
            content: `Text to analyze: ${text}`,
          },
        ],
        temperature: 0.1,
        max_tokens: 80,
        response_format: { type: "json_object" },
        stream: false,
      });

      const responseContent = completion.choices[0]?.message?.content;

      if (responseContent) {
        const parsed = JSON.parse(responseContent);
        return Array.isArray(parsed.keywords) ? parsed.keywords : [];
      }

      return [];
    } catch (error) {
      console.warn("GROQ keyword extraction failed:", error);

      // Simple fallback extraction
      const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
      return words.slice(0, 5);
    }
  };

  // Confidence analysis function (unchanged)
  const analyzeConfidence = async (content) => {
    try {
      setIsAnalyzingConfidence(true);

      const confidencePrompt = `
Analyze the following educational content and provide a confidence score (0-100%) for its accuracy and reliability. Consider these factors:

1. Scientific accuracy of the information presented
2. Use of established facts vs speculation
3. Logical consistency of explanations
4. Coverage of key concepts without major omissions
5. Appropriateness of analogies and metaphors used

Content to analyze:
${content}

Provide your analysis in this exact format:
CONFIDENCE_SCORE: [number between 0-100]
REASONING: [brief explanation of the score in 2-3 sentences]
STRENGTHS: [list 2-3 key strengths]
AREAS_FOR_IMPROVEMENT: [list 1-2 areas that could be improved, if any]

Be objective and focus on factual accuracy rather than presentation style.`;

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are an expert educational content reviewer. Analyze the content and provide a confidence score and reasoning as instructed.",
          },
          {
            role: "user",
            content: confidencePrompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 512,
        stream: false,
      });
      const responseText = completion.choices[0]?.message?.content || "";

      const scoreMatch = responseText.match(/CONFIDENCE_SCORE:\s*(\d+)/);
      const reasoningMatch = responseText.match(
        /REASONING:\s*(.*?)(?=STRENGTHS:|$)/s,
      );
      const strengthsMatch = responseText.match(
        /STRENGTHS:\s*(.*?)(?=AREAS_FOR_IMPROVEMENT:|$)/s,
      );
      const improvementsMatch = responseText.match(
        /AREAS_FOR_IMPROVEMENT:\s*(.*?)$/s,
      );

      const confidence = {
        score: scoreMatch ? parseInt(scoreMatch[1]) : 75,
        reasoning: reasoningMatch
          ? reasoningMatch[1].trim()
          : "Analysis completed",
        strengths: strengthsMatch
          ? strengthsMatch[1].trim()
          : "Content appears factually sound",
        improvements: improvementsMatch
          ? improvementsMatch[1].trim()
          : "No major issues identified",
      };

      setConfidenceScore(confidence);
    } catch (error) {
      console.warn("Confidence analysis failed:", error);
      setConfidenceScore({
        score: 75,
        reasoning: "Unable to complete full confidence analysis",
        strengths: "Content generated from established AI model",
        improvements:
          "Manual verification recommended for critical applications",
      });
    } finally {
      setIsAnalyzingConfidence(false);
    }
  };

  const getAdditionalInstructions = useCallback(() => {
    const character = characterOptions[selectedCharacter];
    return `
  ${character.instruction}
    IMPORTANT RULES:
    - Generate exactly 7 slides explaining the topic.
    - Each slide MUST start with a heading in this format:
      Slide Heading: [Short, clear title for this slide]
    - After the heading, write 1–2 concise sentences explaining the concept.
    - Write in a clear, educational, conversational tone.
    - Avoid repeating the same sentence or phrase.
    - If the topic is technical or educational, include formulas or key expressions where appropriate.
    - Do NOT use bold text, bullet points, or special markers.
    - Do NOT repeat the slide heading inside the explanation.
    - Provide only the slide content (no numbering, no introduction, no summary).
    - Separate each slide with "---SLIDE_BREAK---".
    - Begin directly with the first slide.

    Example of correct format:
    Slide Heading: What is Photosynthesis?
    Photosynthesis is the process where plants convert sunlight into energy using chlorophyll.

    ---SLIDE_BREAK---

    Slide Heading: The Role of Chloroplasts
    Chloroplasts are cell structures that capture sunlight and convert it into chemical energy.

    Begin your explanation now:`;
  }, [selectedCharacter]);

  const parseError = (error) => {
    try {
      const regex = /{"error":(.*)}/gm;
      const m = regex.exec(error);
      if (m && m[1]) {
        const err = JSON.parse(m[1]);
        return err.message;
      }
    } catch (e) {
      // Fall back to original error
    }
    return typeof error === "string" ? error : "An unexpected error occurred";
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsGenerating(false);
    setProgress(0);
  };

  // MAIN GENERATION FUNCTION - Enhanced with SERPAPI fallback
  // Helper: fetch YouTube videos from backend (which uses SERPAPI)
  const fetchYoutubeVideos = async (query) => {
    setIsLoadingVideos(true);
    setYoutubeVideos([]);
    try {
      const res = await fetch(
        `https://mini-p-backend-jqdb.vercel.app/api/youtube/search?q=${encodeURIComponent(
          query,
        )}`,
      );
      const data = await res.json();
      // Expecting data.videos: [{title, url, thumbnail, views, likes, comments, channel, published}]
      if (Array.isArray(data.videos)) {
        // Sort by views, then likes, then comments (descending)
        const sorted = [...data.videos].sort((a, b) => {
          if (b.views !== a.views) return b.views - a.views;
          if (b.likes !== a.likes) return b.likes - a.likes;
          return (b.comments || 0) - (a.comments || 0);
        });
        setYoutubeVideos(sorted.slice(0, 3));
      } else {
        setYoutubeVideos([]);
      }
    } catch (e) {
      setYoutubeVideos([]);
    } finally {
      setIsLoadingVideos(false);
    }
  };
  const generate = async (message) => {
    if (!message || !message.trim()) {
      setError("Please enter a question or topic to explain.");
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setIsGenerating(true);
    setSlides([]);
    setUserMessage(message.trim());
    setError("");
    setUserInput("");
    setProgress(0);
    setConfidenceScore(null);
    setYoutubeVideos([]);
    setInsertedSlides(new Set()); // Reset the inserted slides tracking

    try {
      // Step 1: Generate text content only (Groq)
      setProgress(10);
      let fullTextContent = "";
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are an expert explainer for educational slides. Follow the instructions below.\n${getAdditionalInstructions()}, Always respond in the same language as the user.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.5,
        max_tokens: 1024,
        stream: false,
      });
      fullTextContent = completion.choices[0]?.message?.content || "";

      setProgress(50);

      // Step 2: Split text into slides
      const textSegments = fullTextContent
        .split("---SLIDE_BREAK---")
        .filter((segment) => segment.trim());

      setProgress(60);

      // Helper function to extract title from text segment
      const extractTitle = (text) => {
        // Try to extract title from markdown heading (# Title or ## Title)
        const headingMatch = text.match(/^#+\s+(.+)$/m);
        if (headingMatch) {
          return headingMatch[1].trim();
        }

        // Try to extract from bold text at the beginning (**Title**)
        const boldMatch = text.match(/^\*\*(.+?)\*\*/);
        if (boldMatch) {
          return boldMatch[1].trim();
        }

        // Try to extract first line if it looks like a title (short and ends with colon or is capitalized)
        const firstLine = text.split("\n")[0].trim();
        if (
          firstLine.length < 60 &&
          (firstLine.endsWith(":") || /^[A-Z]/.test(firstLine))
        ) {
          return firstLine.replace(/:$/, "").trim();
        }

        return null;
      };

      // Step 3: Generate images for each text segment
      const character = characterOptions[selectedCharacter];

      for (let i = 0; i < textSegments.length; i++) {
        if (abortControllerRef.current?.signal.aborted) {
          throw new Error("Generation cancelled");
        }

        const textSegment = textSegments[i].trim();
        const slideTitle = extractTitle(textSegment);
        const cleanedText = cleanupText(textSegment);
        const htmlText = await marked.parse(cleanedText);

        // Display the text immediately (no image yet)
        setSlides((currentSlides) => [
          ...currentSlides,
          { text: htmlText, image: null, keywords: [], title: slideTitle },
        ]);

        // Then process keywords and generate image in the background
        const keywords = await extractKeywords(textSegment);
        let imageUrl = null;

        if (keywords.length > 0) {
          // Use SERPAPI directly with SD model enhancement
          imageUrl = await searchAndEnhanceImage(keywords);
        }

        // Update slide with image (or keep text-only if image generation failed)
        setSlides((currentSlides) => {
          const updatedSlides = [...currentSlides];
          if (imageUrl) {
            updatedSlides[i] = {
              text: htmlText,
              image: imageUrl,
              keywords: keywords,
              title: slideTitle,
            };
          } else {
            // Keep text-only if image generation failed
            updatedSlides[i] = {
              text: htmlText,
              keywords: keywords,
              title: slideTitle,
            };
          }
          return updatedSlides;
        });

        setProgress(60 + (i / textSegments.length) * 30);
      }

      setProgress(100);

      // Step 4: Analyze confidence
      if (fullTextContent.trim()) {
        await analyzeConfidence(fullTextContent);
      }

      // Step 5: Fetch relevant YouTube videos for the topic
      if (message && message.trim()) {
        fetchYoutubeVideos(message.trim());
      }
    } catch (e) {
      if (e.message !== "Generation cancelled") {
        const msg = parseError(e.toString());
        setError(`Something went wrong: ${msg}`);
      }
    } finally {
      setIsGenerating(false);
      setProgress(0);
      abortControllerRef.current = null;
    }
  };

  // Rest of your component methods remain the same
  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating) {
        await generate(userInput);
      }
    }
  };

  const handleExampleClick = async (exampleText) => {
    if (!isGenerating) {
      await generate(exampleText);
    }
  };

  useEffect(() => {
    if (!isGenerating && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isGenerating]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSaveSlides = async () => {
    if (!user) {
      setSavingStatus("Please login to save slides");
      return;
    }

    if (!slides.length) {
      setSavingStatus("No slides to save");
      return;
    }

    try {
      setSavingStatus("Preparing slides for save...");

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      const slidesData = [];

      for (const slide of slides) {
        let imageUrl = "";

        // If the slide image is a data URL (base64) try to upload it to Cloudinary
        if (
          slide.image &&
          typeof slide.image === "string" &&
          slide.image.startsWith("data:image")
        ) {
          if (cloudName && uploadPreset) {
            setSavingStatus("Uploading images to Cloudinary...");
            try {
              imageUrl = await uploadBase64ToCloudinary(
                slide.image,
                cloudName,
                uploadPreset,
              );
            } catch (e) {
              console.warn("Cloudinary upload failed for one image:", e);
              // Fallback: skip image to avoid sending huge payload to backend
              imageUrl = "";
            }
          } else {
            // No cloud config available — strip image to reduce payload size
            imageUrl = "";
          }
        } else {
          // Image is already a URL or absent
          imageUrl = slide.image || "";
        }

        slidesData.push({ imageUrl, textContent: slide.text });
      }

      setSavingStatus("Saving slides...");
      await saveSlides(userMessage, slidesData, accessToken);
      setSavingStatus("Slides saved successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSavingStatus("");
      }, 3000);
    } catch (error) {
      console.error("Save slides flow error:", error);
      setSavingStatus("Failed to save slides. Please try again.");
    }
  };

  const examples = [
    "Explain how photosynthesis works",
    "How do computers process information?",
    "What is machine learning?",
    "How does the internet work?",
    "Explain quantum physics basics",
    "How do vaccines work?",
  ];

  const currentCharacter = characterOptions[selectedCharacter];

  const getConfidenceColor = (score) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceGradient = (score) => {
    if (score >= 85) return "from-green-400 to-green-600";
    if (score >= 70) return "from-yellow-400 to-orange-600";
    return "from-red-400 to-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-3/4 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-32 left-1/2 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* ...existing content... */}
        <div className="text-center mb-12">
          <div className="inline-block p-6 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl mb-6">
            <h1 className={`text-6xl md:text-7xl font-bold text-gray-800 mb-2`}>
              {currentCharacter.emoji} Visual Learner
            </h1>
            <div
              className={`w-32 h-1 bg-gradient-to-r ${currentCharacter.gradient} rounded-full mx-auto mb-4`}
            ></div>
          </div>
          <p className="text-gray-700 text-xl max-w-3xl mx-auto leading-relaxed">
            Choose your favorite characters and watch them explain complex
            topics in the most engaging way possible!
          </p>
        </div>

        <CharacterSelector
          characterOptions={characterOptions}
          selectedCharacter={selectedCharacter}
          setSelectedCharacter={setSelectedCharacter}
          isGenerating={isGenerating}
        />

        <InputSection
          userInput={userInput}
          setUserInput={setUserInput}
          handleKeyDown={handleKeyDown}
          isGenerating={isGenerating}
          currentCharacter={currentCharacter}
          generate={generate}
          stopGeneration={stopGeneration}
          progress={progress}
          isAnalyzingConfidence={isAnalyzingConfidence}
        />

        <ExamplesSection
          examples={examples}
          handleExampleClick={handleExampleClick}
          isGenerating={isGenerating}
        />

        <ErrorDisplay error={error} />

        <UserMessageDisplay
          userMessage={userMessage}
          isGenerating={isGenerating}
          currentCharacter={currentCharacter}
        />

        <ConfidenceScoreDisplay
          confidenceScore={confidenceScore}
          isGenerating={isGenerating}
          getConfidenceColor={getConfidenceColor}
          getConfidenceGradient={getConfidenceGradient}
        />

        <LoadingAnimation
          isGenerating={isGenerating}
          currentCharacter={currentCharacter}
        />

        <ResultsDisplay
          slides={slides}
          isGenerating={isGenerating}
          selectedCharacter={selectedCharacter}
          currentCharacter={currentCharacter}
          onInsertSlide={handleInsertSlide}
          insertedSlides={insertedSlides}
        />

        {/* Save Slides Button and My Profile Link */}
        {slides.length > 0 && (
          <div className="flex justify-center items-center mt-8 mb-4 space-x-4">
            <button
              onClick={handleSaveSlides}
              disabled={!user || isGenerating}
              className={`px-6 py-2 rounded-lg shadow-lg ${
                user
                  ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } transition-all duration-300 ease-in-out transform hover:scale-105`}
            >
              {user ? "Save Slides" : "Login to Save"}
            </button>
            {user && (
              <button
                onClick={() => !isGenerating && navigate("/profile")}
                disabled={isGenerating}
                className={`px-6 py-2 rounded-lg shadow-lg bg-gradient-to-r from-amber-400 to-orange-500 text-white transition-all duration-300 ease-in-out transform hover:scale-105 ${
                  isGenerating
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:from-amber-500 hover:to-orange-600"
                }`}
              >
                My Profile
              </button>
            )}
            {savingStatus && (
              <div
                className={`ml-4 py-2 ${
                  savingStatus.includes("success")
                    ? "text-green-600"
                    : savingStatus.includes("Failed")
                      ? "text-red-600"
                      : "text-blue-600"
                }`}
              >
                {savingStatus}
              </div>
            )}
          </div>
        )}

        {/* YouTube Video Recommendations Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Relevant YouTube Videos
          </h2>
          {isLoadingVideos && (
            <div className="text-center text-gray-500">Loading videos...</div>
          )}
          {!isLoadingVideos && youtubeVideos.length === 0 && userMessage && (
            <div className="text-center text-gray-400">
              No relevant videos found.
            </div>
          )}
          <div className="flex flex-wrap justify-center gap-6">
            {youtubeVideos.map((video, idx) => (
              <a
                key={video.url || idx}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-80 bg-white rounded-xl shadow-lg hover:shadow-2xl transition p-4 flex flex-col items-center border border-gray-100"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="rounded-lg w-full h-44 object-cover mb-3"
                />
                <div className="font-semibold text-lg mb-1 text-center line-clamp-2">
                  {video.title}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  {video.channel}
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-1">
                  <span>
                    Views: {video.views?.toLocaleString?.() ?? video.views}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default GeminiSlideshowGenerator;
