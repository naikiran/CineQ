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
import MovieCard from "../components/MovieCard"; // Reusable MovieCard component
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const navigate = useNavigate();

  // Fetch movies data
  const fetchMovies = async (pageNumber = 1, searchQuery = "", genreId = null) => {
    try {
      setLoading(true);
      let response;
      if (searchQuery) {
        // Fetch movies by search query
        response = await axios.get(
          `https://api.themoviedb.org/3/search/movie`,
          {
            params: {
              api_key: API_KEY,
              page: pageNumber,
              query: searchQuery,
            },
          }
        );
      } else {
        // Fetch movies by genre or popular movies
        response = await axios.get(
          `https://api.themoviedb.org/3/discover/movie`,
          {
            params: {
              api_key: API_KEY,
              page: pageNumber,
              with_genres: genreId,
            },
          }
        );
      }
      // Append new movies to the existing list
      if (pageNumber === 1) {
        setMovies(response.data.results); // Reset the list for the first page
      } else {
        setMovies((prevMovies) => [...prevMovies, ...response.data.results]); // Append new movies
      }
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch genres
  const fetchGenres = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/genre/movie/list`,
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

  // Fetch movies on page load or search
  useEffect(() => {
    fetchMovies(page, searchTerm, selectedGenre);
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

  // Handle "Load More" button click
  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1); // Load the next page
    }
  };

  // Handle movie click
  const handleMovieClick = (id) => {
    navigate(`/movie/${id}`);
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
          Movies 🎬
        </Typography>

        {/* Search Bar */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for movies..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              style: { color: "white", backgroundColor: "#1e1e1e" },
              endAdornment: (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => fetchMovies(1, searchTerm, selectedGenre)}
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

        {/* Movie Grid */}
        {loading && page === 1 ? (
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
              {movies.map((movie) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                  <MovieCard
                    movie={movie}
                    onClick={() => handleMovieClick(movie.id)}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Load More Button */}
            {page < totalPages && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Load More"}
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default MoviesPage;