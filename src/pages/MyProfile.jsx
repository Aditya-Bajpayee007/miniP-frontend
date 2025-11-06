import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import userService from "../services/userService";
import { usePageLoading } from "../context/PageLoadingContext";
import { User, Mail, FileText, ExternalLink, Loader2, AlertCircle } from "lucide-react";

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setPageLoading } = usePageLoading();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setPageLoading(true);
        const response = await userService.getProfile();
        setProfile(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setPageLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Profile</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-amber-500 hover:to-orange-600 transition duration-200 shadow-lg hover:shadow-xl"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account and view your presentations</p>
        </div>

        {profile && (
          <div className="space-y-6">
            {/* Profile Info Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mr-4 shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Account Information</h2>
                  <p className="text-gray-600">Your personal details</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center p-4 bg-amber-50 rounded-lg">
                  <User className="w-5 h-5 text-amber-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="text-lg font-semibold text-gray-800">{profile.name}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-orange-50 rounded-lg">
                  <Mail className="w-5 h-5 text-orange-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="text-lg font-semibold text-gray-800">{profile.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Slides Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg mr-4 shadow-md">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">My Presentations</h2>
                    <p className="text-gray-600">
                      {profile.slides && profile.slides.length > 0
                        ? `${profile.slides.length} presentation${profile.slides.length === 1 ? '' : 's'}`
                        : 'No presentations yet'}
                    </p>
                  </div>
                </div>
              </div>

              {profile.slides && profile.slides.length > 0 ? (
                <div className="grid gap-4">
                  {profile.slides.slice().reverse().map((slide, index) => (
                    <Link
                      key={slide._id}
                      to={`/slides/${slide._id}`}
                      className="group p-5 border-2 border-gray-200 rounded-xl hover:border-amber-400 hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-amber-50/30"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg mr-4 text-white font-bold shadow-md">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-amber-600 transition duration-200">
                              {slide.topic}
                            </h3>
                            <p className="text-sm text-gray-600">Click to view presentation</p>
                          </div>
                        </div>
                        <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition duration-200" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Presentations Yet</h3>
                  <p className="text-gray-600 mb-6">Start creating your first presentation to see it here</p>
                  <Link
                    to="/create"
                    className="inline-block bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-amber-500 hover:to-orange-600 transition duration-200 shadow-lg hover:shadow-xl"
                  >
                    Create Presentation
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;