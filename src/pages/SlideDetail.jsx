import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getSlideById } from "../services/slidesService";
import ResultsDisplay from "../components/ResultsDisplay";
import { usePageLoading } from "../context/PageLoadingContext";
import { ArrowLeft, Loader2, AlertCircle, BookOpen, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";

const SlideDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [slide, setSlide] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const { setPageLoading } = usePageLoading();

  React.useEffect(() => {
    const fetchSlide = async () => {
      try {
        setPageLoading(true);
        const data = await getSlideById(id);
        if (data && data.slidesData && Array.isArray(data.slidesData)) {
          const transformed = data.slidesData.map((s) => ({
            image: s.imageUrl || s.image || "",
            text: s.textContent || s.text || "",
            title: s.title || null,
          }));
          setSlide({ ...data, slidesData: transformed });
        } else {
          setSlide(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setPageLoading(false);
      }
    };

    fetchSlide();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-16 h-16 text-amber-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-700 text-xl font-semibold">Loading presentation...</p>
          <p className="text-gray-600 text-sm mt-2">Please wait while we fetch your content</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Oops! Something Went Wrong</h2>
          <p className="text-red-600 mb-6 text-lg">{error}</p>
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-amber-500 hover:to-orange-600 transition duration-200 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Profile
          </Link>
        </motion.div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* Back Button: use Link so browser/assistive behavior is native and pointer appears reliably */}
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-amber-600 font-medium mb-6 duration-200 cursor-pointer"
            aria-label="Back to My Presentations"
          >
            <ArrowLeft className="w-5 h-5 -translate-x-0 hover:-translate-x-1 transition-transform duration-200" />
            Back to My Presentations
          </Link>

          {/* Title Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white/50 p-8">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 break-words">
                    {slide.topic}
                  </h1>
                </div>
                
                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 mt-4 text-gray-600">
                  {slide.slidesData && (
                    <div className="inline-flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full">
                      <BookOpen className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-semibold">
                        {slide.slidesData.length} {slide.slidesData.length === 1 ? 'Slide' : 'Slides'}
                      </span>
                    </div>
                  )}
                  
                  {slide.createdAt && (
                    <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full">
                      <Calendar className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-semibold">
                        {formatDate(slide.createdAt)}
                      </span>
                    </div>
                  )}
                  
                  {slide.slidesData && (
                    <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold">
                        {Math.ceil(slide.slidesData.length * 2)} min read
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="mt-6 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 rounded-full shadow-md"></div>
          </div>
        </motion.div>

        {/* Slides Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <ResultsDisplay slides={slide.slidesData} />
        </motion.div>

        {/* Footer Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xl text-gray-700 font-semibold py-4 px-8 rounded-full hover:bg-white transition-all duration-200 shadow-xl hover:shadow-2xl border-2 border-white/50"
          >
            <ArrowLeft className="w-5 h-5" />
            View All My Presentations
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default SlideDetail;