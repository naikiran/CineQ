import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Carousal from "./components/Carousal";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MovieDetails from "./Pages/Movies";
import MoviesPage from "./Pages/Movie";
import TrendingPage from "./Pages/Trending";

// Lazy-loaded components
const Home = lazy(() => import("./Pages/Home"));
const Movies = lazy(() => import("./Pages/Movies"));
const TVShows = lazy(() => import("./Pages/TvShow"));
const TvShowDetails = lazy(() => import("./Pages/TvShowDetails"));
const Login = lazy(() => import("./Pages/Login"));
const Signup = lazy(() => import("./Pages/Signup"));
const NotFound = lazy(() => import("./components/NotFound"));

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  // Define routes where Header and Footer should not be displayed
  const noHeaderFooterRoutes = ["/login", "/signup"];

  // Check if the current route is in the noHeaderFooterRoutes array
  const shouldShowHeaderFooter = !noHeaderFooterRoutes.includes(
    location.pathname
  );

  return (
    <>
      {/* Conditionally render Header */}
      {shouldShowHeaderFooter && <Header />}

      {/* Conditionally render Carousal only on the home page */}
      {location.pathname === "/" && <Carousal />}

      {/* Routes */}
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/tvshow/:id" element={<TvShowDetails />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/tvshows" element={<TVShows />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} /> {/* 404 Page */}
        </Routes>
      </Suspense>

      {/* Conditionally render Footer */}
      {shouldShowHeaderFooter && <Footer />}
    </>
  );
}

// Loading Spinner Component
const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#121212",
    }}
  >
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

export default App;
