import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Tabs,
  Tab,
  Pagination,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import StarIcon from "@mui/icons-material/Star";
import TheatersIcon from "@mui/icons-material/Theaters";
import TvIcon from "@mui/icons-material/Tv";
import PeopleIcon from "@mui/icons-material/People";
import SearchIcon from "@mui/icons-material/Search";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import MovieIcon from "@mui/icons-material/Movie";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import { useNavigate } from "react-router-dom";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

// Reusable SectionTitle Component
const SectionTitle = ({ title, isSmallScreen }) => {
  return (
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
  );
};

const TrendingPage = () => {
  const [trendingData, setTrendingData] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [topTVShows, setTopTVShows] = useState([]);
  const [mediaType, setMediaType] = useState("all");
  const [timeWindow, setTimeWindow] = useState("day");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect mobile devices
  const isSmallScreen = useMediaQuery("(max-width:280px)"); // Detect screens <= 280px

  // Fetch trending data
  useEffect(() => {
    const fetchTrendingData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.themoviedb.org/3/trending/${mediaType}/${timeWindow}?api_key=${API_KEY}&page=${page}`
        );
        setTrendingData(response.data.results);
        setTotalPages(response.data.total_pages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trending data: ", error);
        setError("Failed to fetch trending data. Please try again later.");
        setLoading(false);
      }
    };

    fetchTrendingData();
  }, [mediaType, timeWindow, page]);

  // Fetch top 10 movies
  useEffect(() => {
    const fetchTopMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&page=1`
        );
        setTopMovies(response.data.results.slice(0, 10));
      } catch (error) {
        console.error("Error fetching top movies: ", error);
      }
    };

    fetchTopMovies();
  }, []);

  // Fetch top 10 TV shows
  useEffect(() => {
    const fetchTopTVShows = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}&page=1`
        );
        setTopTVShows(response.data.results.slice(0, 10));
      } catch (error) {
        console.error("Error fetching top TV shows: ", error);
      }
    };

    fetchTopTVShows();
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setMediaType(newValue);
    setPage(1); // Reset page when switching tabs
  };

  // Handle pagination
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Handle search
  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${searchQuery}&page=${page}`
      );
      setTrendingData(response.data.results);
      setTotalPages(response.data.total_pages);
      setLoading(false);
    } catch (error) {
      console.error("Error searching: ", error);
      setError("Failed to search. Please try again later.");
      setLoading(false);
    }
  };

  // Handle card click
  const handleCardClick = (id, mediaType) => {
    if (mediaType === "movie") {
      navigate(`/movie/${id}`); // Navigate to movie details page
    } else if (mediaType === "tv") {
      navigate(`/tvshow/${id}`); // Navigate to TV show details page
    } else if (mediaType === "person") {
      navigate(`/person/${id}`); // Navigate to person details page
    }
  };

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isSmallScreen ? 1 : isMobile ? 2 : 5, // Adjust for small screens
    slidesToScroll: isSmallScreen ? 1 : isMobile ? 1 : 2,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

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

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 2,
          backgroundColor: "#121212",
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "#121212",
        color: "white",
        minHeight: "100vh",
        paddingTop: 4,
        overflowX: "hidden", // Prevent horizontal overflow
      }}
    >
      <Container>
        {/* Search Bar */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 4,
            flexDirection: isSmallScreen ? "column" : "row", // Stack on small screens
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search movies, TV shows, or people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: "white" }} />,
              sx: { backgroundColor: "#1e1e1e", color: "white" },
            }}
          />
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </Box>

        {/* Tabs for Media Type */}
        <Tabs
          value={mediaType}
          onChange={handleTabChange}
          sx={{ mb: 4 }}
          indicatorColor="secondary"
          textColor="secondary"
          variant={isSmallScreen ? "scrollable" : "standard"} // Scrollable tabs for small screens
        >
          <Tab
            label="All"
            value="all"
            icon={<WhatshotIcon sx={{ color: "white" }} />}
            sx={{ color: "white", minWidth: "auto", fontSize: "0.7rem" }} // Smaller button size
          />
          <Tab
            label="Movies"
            value="movie"
            icon={<MovieIcon sx={{ color: "white" }} />}
            sx={{ color: "white", minWidth: "auto", fontSize: "0.7rem" }} // Smaller button size
          />
          <Tab
            label="TV Shows"
            value="tv"
            icon={<LiveTvIcon sx={{ color: "white" }} />}
            sx={{ color: "white", minWidth: "auto", fontSize: "0.7rem" }} // Smaller button size
          />
          <Tab
            label="People"
            value="person"
            icon={<PeopleIcon sx={{ color: "white" }} />}
            sx={{ color: "white", minWidth: "auto", fontSize: "0.7rem" }} // Smaller button size
          />
        </Tabs>

        {/* Time Window Toggle */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            gap: 2,
            flexDirection: isSmallScreen ? "column" : "row", // Stack on small screens
          }}
        >
          <Button
            variant={timeWindow === "day" ? "contained" : "outlined"}
            onClick={() => setTimeWindow("day")}
            sx={{ color: timeWindow === "day" ? "white" : "secondary" }}
          >
            Today
          </Button>
          <Button
            variant={timeWindow === "week" ? "contained" : "outlined"}
            onClick={() => setTimeWindow("week")}
            sx={{ color: timeWindow === "week" ? "white" : "secondary" }}
          >
            This Week
          </Button>
        </Box>

        {/* Trending Slider */}
        <SectionTitle
          title={`Trending ${
            mediaType === "all"
              ? "Movies & TV Shows"
              : mediaType === "movie"
              ? "Movies"
              : mediaType === "tv"
              ? "TV Shows"
              : "People"
          }`}
          isSmallScreen={isSmallScreen}
        />
        <Slider {...sliderSettings}>
          {trendingData.map((item) => (
            <div key={item.id} style={{ padding: "0 10px" }}>
              <Card
                sx={{
                  backgroundColor: "#1e1e1e",
                  color: "white",
                  borderRadius: "10px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                  transition: "transform 0.3s",
                  ":hover": { transform: "scale(1.05)", cursor: "pointer" },
                }}
                onClick={() => handleCardClick(item.id, item.media_type)} // Handle card click
              >
                <CardMedia
                  component="img"
                  image={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title || item.name}
                  sx={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "10px 10px 0 0",
                  }}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {item.title || item.name}
                  </Typography>
                  <Typography variant="body2" color="gray">
                    {item.media_type === "movie" ? "Movie" : "TV Show"}
                  </Typography>
                  {item.vote_average && (
                    <Typography variant="body2" color="gold" fontWeight="bold">
                      <StarIcon
                        sx={{ verticalAlign: "middle", fontSize: "1rem" }}
                      />{" "}
                      {item.vote_average.toFixed(1)} / 10
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </Slider>

        {/* Top 10 Movies */}
        <SectionTitle title="Top 10 Movies" isSmallScreen={isSmallScreen} />
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {topMovies.map((movie, index) => (
            <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  backgroundColor: "#1e1e1e",
                  color: "white",
                  borderRadius: "10px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                  transition: "transform 0.3s",
                  ":hover": { transform: "scale(1.05)", cursor: "pointer" },
                }}
                onClick={() => handleCardClick(movie.id, "movie")} // Handle card click
              >
                <CardMedia
                  component="img"
                  image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  sx={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "10px 10px 0 0",
                  }}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    #{index + 1} {movie.title}
                  </Typography>
                  <Typography variant="body2" color="gold" fontWeight="bold">
                    <StarIcon
                      sx={{ verticalAlign: "middle", fontSize: "1rem" }}
                    />{" "}
                    {movie.vote_average.toFixed(1)} / 10
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Top 10 TV Shows */}
        <SectionTitle title="Top 10 TV Shows" isSmallScreen={isSmallScreen} />
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {topTVShows.map((show, index) => (
            <Grid item key={show.id} xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  backgroundColor: "#1e1e1e",
                  color: "white",
                  borderRadius: "10px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                  transition: "transform 0.3s",
                  ":hover": { transform: "scale(1.05)", cursor: "pointer" },
                }}
                onClick={() => handleCardClick(show.id, "tv")} // Handle card click
              >
                <CardMedia
                  component="img"
                  image={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                  alt={show.name}
                  sx={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "10px 10px 0 0",
                  }}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    #{index + 1} {show.name}
                  </Typography>
                  <Typography variant="body2" color="gold" fontWeight="bold">
                    <StarIcon
                      sx={{ verticalAlign: "middle", fontSize: "1rem" }}
                    />{" "}
                    {show.vote_average.toFixed(1)} / 10
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Pagination (Conditional Rendering) */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="secondary"
              sx={{ "& .MuiPaginationItem-root": { color: "white" } }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default TrendingPage;