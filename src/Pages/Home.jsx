import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import StarIcon from "@mui/icons-material/Star";
import { keyframes } from "@emotion/react";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

// Fade-in animation
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HomePage = () => {
  const [movies, setMovies] = useState({
    trending: [],
    popular: [],
    topRated: [],
    upcoming: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery("(max-width:280px)"); // Detect screens <= 280px

  // Fetch movies data
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [trendingRes, popularRes, topRatedRes, upcomingRes] =
          await Promise.all([
            axios.get(
              `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`
            ),
            axios.get(
              `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
            ),
            axios.get(
              `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`
            ),
            axios.get(
              `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`
            ),
          ]);

        setMovies({
          trending: trendingRes.data.results,
          popular: popularRes.data.results,
          topRated: topRatedRes.data.results,
          upcoming: upcomingRes.data.results,
        });
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchMovies();
  }, []);

  // Slider settings
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: isSmallScreen ? 1 : 5, // Adjust for small screens
    slidesToScroll: isSmallScreen ? 1 : 2,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  // Handle movie click
  const handleMovieClick = (id) => {
    setLoading(true); // Show loading state
    setTimeout(() => {
      navigate(`/movie/${id}`);
    }, 500); // 0.5-second delay
  };

  // Reusable MovieSlider component
  const MovieSlider = ({ movies, title }) => {
    return (
      <Container
        className="my-5"
        style={{ animation: `${fadeIn} 1s ease-in-out` }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            mb: 4, // Add margin bottom
          }}
        >
          <Box sx={{ flex: 1, height: "2px", backgroundColor: "gold" }} />
          <Typography
            variant={isSmallScreen ? "h5" : "h4"} // Adjust font size for small screens
            fontWeight="bold"
            color="white"
          >
            {title}
          </Typography>
          <Box sx={{ flex: 1, height: "2px", backgroundColor: "gold" }} />
        </Box>
        <Slider {...sliderSettings}>
          {movies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => handleMovieClick(movie.id)}
              style={{ cursor: "pointer", padding: "0 10px" }}
            >
              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "10px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                  transition: "transform 0.3s",
                  ":hover": { transform: "scale(1.05)" },
                }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title || movie.name}
                  style={{ width: "100%", borderRadius: "10px" }}
                  loading="lazy"
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background:
                      "linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)",
                    padding: "10px",
                  }}
                >
                  <Typography
                    variant={isSmallScreen ? "body2" : "body1"} // Adjust font size for small screens
                    color="white"
                    fontWeight="bold"
                  >
                    {movie.title || movie.name}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      mt: 1,
                    }}
                  >
                    <StarIcon style={{ color: "gold", fontSize: "16px" }} />
                    <Typography variant="body2" color="gold">
                      {movie.vote_average.toFixed(1)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </div>
          ))}
        </Slider>
      </Container>
    );
  };

  // Render loading spinner if data is being fetched
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#121212",
        }}
      >
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  // Render the HomePage
  return (
    <Box
      fluid
      className="p-0"
      style={{ backgroundColor: "#121212", color: "white", overflowX: "hidden" }} // Prevent horizontal overflow
    >
      <br />
      <br />
      {/* Informative Section */}
      <Box
        sx={{
          textAlign: "center",
          padding: isSmallScreen ? "20px 10px" : "40px 20px", // Adjust padding for small screens
          backgroundColor: "#1e1e1e",
          marginBottom: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Typography
          variant={isSmallScreen ? "h4" : "h3"} // Adjust font size for small screens
          fontWeight="bold"
          gutterBottom
        >
          Welcome to CineQ 🎬
        </Typography>
        <Typography
          variant={isSmallScreen ? "h6" : "h5"} // Adjust font size for small screens
          sx={{ opacity: 0.8, mb: 3 }}
        >
          Your ultimate destination for movies and TV shows.
        </Typography>
        <Typography
          variant={isSmallScreen ? "body2" : "body1"} // Adjust font size for small screens
          sx={{ mb: 3 }}
        >
          Explore thousands of movies and TV shows, curated just for you. From
          trending hits to timeless classics, we've got it all.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size={isSmallScreen ? "medium" : "large"} // Adjust button size for small screens
          onClick={() => navigate("/movies")}
        >
          Explore Now
        </Button>
      </Box>

      {/* Movie Sliders */}
      <MovieSlider movies={movies.trending} title="Trending Now" />
      <MovieSlider movies={movies.popular} title="Popular Movies" />
      <MovieSlider movies={movies.topRated} title="Top Rated Movies" />
      <MovieSlider movies={movies.upcoming} title="Upcoming Movies" />

      <br />
      <br />
    </Box>
  );
};

export default HomePage;