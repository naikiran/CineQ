import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Grid,
  TextField,
  Button,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const TvShowsPage = () => {
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const navigate = useNavigate();

  // Fetch TV shows data
  const fetchTvShows = async (pageNumber = 1, searchQuery = "", genreId = null) => {
    try {
      setLoading(true);
      let response;
      if (searchQuery) {
        // Fetch TV shows by search query
        response = await axios.get(
          `https://api.themoviedb.org/3/search/tv`,
          {
            params: {
              api_key: API_KEY,
              page: pageNumber,
              query: searchQuery,
            },
          }
        );
      } else {
        // Fetch TV shows by genre or popular TV shows
        response = await axios.get(
          `https://api.themoviedb.org/3/discover/tv`,
          {
            params: {
              api_key: API_KEY,
              page: pageNumber,
              with_genres: genreId,
            },
          }
        );
      }
      setTvShows(response.data.results); // Replace the current TV shows with the new set
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching TV shows:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch TV show genres
  const fetchGenres = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/genre/tv/list`,
        {
          params: {
            api_key: API_KEY,
          },
        }
      );
      setGenres(response.data.genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  // Fetch TV shows on page load or search
  useEffect(() => {
    fetchTvShows(page, searchTerm, selectedGenre);
  }, [page, searchTerm, selectedGenre]);

  // Fetch genres on page load
  useEffect(() => {
    fetchGenres();
  }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to the first page when searching
  };

  // Handle genre filter click
  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId);
    setPage(1); // Reset to the first page when filtering
  };

  // Handle "Previous" button click
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  // Handle "Next" button click
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Handle TV show click
  const handleTvShowClick = (id) => {
    navigate(`/tvshow/${id}`);
  };

  return (
    <Box
      fluid
      className="p-0"
      style={{ backgroundColor: "#121212", color: "white", padding: "20px" }}
    >
      <Container>
        {/* Page Title */}
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          TV Shows 📺
        </Typography>

        {/* Search Bar */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for TV shows..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              style: { color: "white", backgroundColor: "#1e1e1e" },
              endAdornment: (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => fetchTvShows(1, searchTerm, selectedGenre)}
                >
                  Search
                </Button>
              ),
            }}
          />
        </Box>

        {/* Genre Filters */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Filter by Genre
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {genres.map((genre) => (
              <Chip
                key={genre.id}
                label={genre.name}
                clickable
                color={selectedGenre === genre.id ? "primary" : "default"}
                sx={{
                  backgroundColor:
                    selectedGenre === genre.id ? "primary.main" : "#333",
                  color: "white",
                  "&:hover": {
                    backgroundColor:
                      selectedGenre === genre.id ? "primary.dark" : "#444",
                  },
                }}
                onClick={() => handleGenreClick(genre.id)}
              />
            ))}
          </Box>
        </Box>

        {/* TV Shows Grid */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <>
            <Grid container spacing={4}>
              {tvShows.map((tvShow) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={tvShow.id}>
                  <Box
                    sx={{
                      backgroundColor: "#1e1e1e",
                      borderRadius: "10px",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                      overflow: "hidden",
                      transition: "transform 0.3s",
                      ":hover": { transform: "scale(1.05)" },
                    }}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                      alt={tvShow.name}
                      style={{ width: "100%", height: "400px", objectFit: "cover" }}
                    />
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {tvShow.name}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: "5px", mb: 2 }}>
                        <StarIcon style={{ color: "gold", fontSize: "16px" }} />
                        <Typography variant="body2" color="gold">
                          {tvShow.vote_average ? tvShow.vote_average.toFixed(1) : "N/A"}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => handleTvShowClick(tvShow.id)}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                disabled={page === 1 || loading}
                onClick={handlePreviousPage}
                startIcon={<ArrowBackIcon />}
              >
                Previous
              </Button>
              <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                Page {page} of {totalPages}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                disabled={page === totalPages || loading}
                onClick={handleNextPage}
                endIcon={<ArrowForwardIcon />}
              >
                Next
              </Button>
            </Box>
          </>
        )}
      </Container>
      <br /><br /><br />
    </Box>
  );
};

export default TvShowsPage;