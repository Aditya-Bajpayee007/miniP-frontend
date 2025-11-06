import { usePageLoading } from "../context/PageLoadingContext";
import { useGeneration } from "../context/GenerationContext";

const GlobalLoader = () => {
  const { pageLoading } = usePageLoading();
  const { isGenerating } = useGeneration();

  // Avoid showing the global page loader while a generation-specific
  // loading animation is active to prevent two stacked loaders.
  if (!pageLoading || isGenerating) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white/90 p-6 rounded-xl shadow-lg flex items-center gap-3">
        <svg
          className="animate-spin h-8 w-8 text-indigo-600"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <div className="text-gray-800 font-medium">Loading…</div>
      </div>
    </div>
  );
};

export default GlobalLoader;
