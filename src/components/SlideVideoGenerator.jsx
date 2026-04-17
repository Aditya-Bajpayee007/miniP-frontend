import React from "react";
import { useParams } from "react-router-dom";

const SlideVideoGenerator = () => {
  const { id: slideId } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [videoUrl, setVideoUrl] = React.useState(null);
  const [error, setError] = React.useState(null);

  const handleGenerateVideo = async () => {
    setError(null);
    setVideoUrl(null);
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.accessToken : null;

    if (!token) {
      setError("No access token found. Please log in.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://mini-p-backend-jqdb.vercel.app/api/video/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ slideId }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to generate video");
      }

      const data = await res.json();
      console.debug('video generate response:', data);
      const returnedUrl = data && (data.videoUrl || data.url || data.video || data.video_url);
      if (returnedUrl) {
        setVideoUrl(returnedUrl);
      } else {
        throw new Error("No video URL returned from server");
      }
    } catch (err) {
      setError(err.message || "An error occurred while generating the video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Presentation Video</h3>
        <p className="text-sm text-gray-600 mb-4">Generate a narrated video for this presentation.</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateVideo}
            disabled={loading}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white shadow-sm transition-colors duration-150 ${
              loading ? "bg-amber-300 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-600"
            }`}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                Generating...
              </span>
            ) : (
              "Generate Video"
            )}
          </button>

          {videoUrl && (
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-white border border-gray-200 text-gray-800 hover:bg-gray-50"
            >
              Download
            </a>
          )}
        </div>

        {videoUrl && (
          <div className="mt-6">
            <video
              src={videoUrl}
              controls
              className="w-full h-auto max-h-[480px] rounded-lg shadow-inner bg-black"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SlideVideoGenerator;
