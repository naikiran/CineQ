import React from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const MovieCard = ({ movie, onClick }) => {
  return (
    <Card
      sx={{
        backgroundColor: "#1e1e1e",
        color: "white",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
        transition: "transform 0.3s",
        ":hover": { transform: "scale(1.05)" },
      }}
    >
      <CardMedia
        component="img"
        image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        sx={{ height: "400px", objectFit: "cover" }}
      />
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {movie.title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "5px", mb: 2 }}>
          <StarIcon style={{ color: "gold", fontSize: "16px" }} />
          <Typography variant="body2" color="gold">
            {movie.vote_average.toFixed(1)}
          </Typography>
        </Box>
        <Button variant="contained" color="primary" fullWidth onClick={onClick}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
