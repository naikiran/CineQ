import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const Carousal = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get("https://api.themoviedb.org/3/movie/upcoming", {
        params: {
          api_key: API_KEY,
          language: "en-US",
          page: 1,
        },
      })
      .then((response) => {
        setMovies(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching movies: ", error);
      });
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  return (
    <Box sx={{ width: "100%", position: "relative", overflow: "hidden" }}>
      <Slider {...settings}>
        {movies.map((movie) => (
          <Box key={movie.id} sx={{ position: "relative" }}>
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              style={{ width: "100%", height: "650px", objectFit: "cover" }}
            />
            {/* Dark Gradient Overlay */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.9) 100%)", // Darker shade
              }}
            />
            {/* Movie Info */}
            <Box
              sx={{
                position: "absolute",
                bottom: "50px",
                left: "50%",
                transform: "translateX(-50%)", // Center horizontally
                color: "white",
                textAlign: "center", // Center text
                maxWidth: "600px",
              }}
            >
              <Typography variant="h3" fontWeight="bold">
                {movie.title}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.8, mt: 1 }}>
                Release Date: {movie.release_date}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayArrowIcon />}
                component={Link}
                to={`/movie/${movie.id}`}
                sx={{ mt: 2 }}
              >
                Watch Trailer
              </Button>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
    
  );
};

export default Carousal;
