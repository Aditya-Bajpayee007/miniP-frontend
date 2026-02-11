import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Slides from "./pages/Slides";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyProfile from "./pages/MyProfile";
import SlideDetail from "./pages/SlideDetail";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { GenerationProvider, useGeneration } from "./context/GenerationContext";
import { PageLoadingProvider } from "./context/PageLoadingContext";
import GlobalLoader from "./components/GlobalLoader";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import { MathJaxContext } from "better-react-mathjax";

const config = {
  loader: { load: ["input/tex", "output/chtml"] },
  tex: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
  },
};

function App() {
  const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const { isGenerating } = useGeneration();

    const isProtectedPath = (path) => {
      if (!path) return false;
      if (path === "/profile" || path === "/home") return true;
      // covers /slides and /slides/:id
      if (path.startsWith("/slides")) return true;
      return false;
    };

    const onClick = () => {
      if (location.pathname === "/profile") {
        navigate("/home");
      } else {
        navigate("/profile");
      }
    };

    // Show profile button whenever the user is authenticated (next to About)
    const showProfileButton = user && !loading;

    return (
      <header className="w-full bg-gradient-to-r from-amber-50 to-orange-50 backdrop-blur-md shadow-sm z-50 border-b border-amber-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/home")}
              aria-label="Go to home"
              className="cursor-pointer text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-orange-500 to-orange-400 focus:outline-none"
            >
              Visual Learner
            </button>
            <div className="text-sm text-amber-600 italic hidden sm:block">
              Learn visually, faster
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* About button always available */}
            <button
              onClick={() =>
                location.pathname === "/" ? navigate("/home") : navigate("/")
              }
              className="px-5 py-2 rounded-md text-sm font-medium text-gray-700 hover:shadow-md cursor-pointer"
              aria-label={location.pathname === "/" ? "Home" : "About"}
            >
              {location.pathname === "/" ? "Home" : "About"}
            </button>

            {/* Show Login when the user is not authenticated */}
            {!user && !loading && (
              <button
                onClick={() => navigate("/login")}
                className="px-3 py-2 rounded-md text-sm font-medium text-amber-700 hover:bg-amber-100"
                aria-label="Login"
              >
                Login
              </button>
            )}

            {showProfileButton ? (
              <button
                onClick={onClick}
                disabled={isGenerating}
                aria-disabled={isGenerating}
                className={`px-5 py-2 rounded-md text-sm font-medium text-gray-800 hover:shadow-md cursor-pointer${
                  isGenerating ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {location.pathname === "/profile"
                  ? "Go Back"
                  : user?.firstName || user?.name || "My Profile"}
              </button>
            ) : null}
          </div>
        </div>
      </header>
    );
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <GenerationProvider>
          <PageLoadingProvider>
            <MathJaxContext config={config}>
              <Header />
              {/* <GlobalLoader /> */}
              <Routes>
                {/* Public landing/About page at root */}
                <Route path="/" element={<About />} />

                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <MyProfile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/slides/:id"
                  element={
                    <ProtectedRoute>
                      <SlideDetail />
                    </ProtectedRoute>
                  }
                />

                {/* Slides (home) is publicly accessible for generation; saving is gated in the page */}
                <Route path="/home" element={<Slides />} />
              </Routes>
            </MathJaxContext>
          </PageLoadingProvider>
        </GenerationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
