import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Typography, Box, Rating, Skeleton, CircularProgress } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import StarIcon from "@mui/icons-material/Star";
import TheatersIcon from "@mui/icons-material/Theaters";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import LanguageIcon from "@mui/icons-material/Language";
import PublicIcon from "@mui/icons-material/Public";
import GroupsIcon from "@mui/icons-material/Groups";
import DescriptionIcon from "@mui/icons-material/Description";
import MovieIcon from "@mui/icons-material/Movie";
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

const DetailsPage = () => {
  const { id, type } = useParams(); // type can be "movie" or "tv"
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/${type}/${id}`, {
          params: {
            api_key: API_KEY,
            append_to_response: "credits,videos,recommendations,images",
          },
        });
        setDetails(response.data);
        setCast(response.data.credits.cast.slice(0, 10));
        setTrailer(
          response.data.videos.results.find((vid) => vid.type === "Trailer")
        );
        setRecommendations(response.data.recommendations.results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching details: ", error);
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, type]);

  const handleDoubleClick = () => {
    setShowTrailer((prev) => !prev);
  };

  const handleRecommendationClick = (itemId) => {
    setLoading(true); // Show loading state
    setTimeout(() => {
      navigate(`/${type}/${itemId}`);
      window.scrollTo(0, 0); // Scroll to the top of the page
    }, 1000); // 1-second delay
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
      { breakpoint: 320, settings: { slidesToShow: 1 } },
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
        }}
      >
        <CircularProgress color="secondary" /> {/* Loading spinner */}
      </Box>
    );
  }

  return (
    <Container fluid className="p-0" style={{ backgroundColor: "#121212", color: "white" }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%", // 16:9 aspect ratio
          overflow: "hidden",
          animation: `${fadeIn} 1s ease-in-out`,
        }}
        onDoubleClick={handleDoubleClick}
      >
        {showTrailer && trailer ? (
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Trailer"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          ></iframe>
        ) : (
          <img
            src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
            alt={details.title || details.name}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.5)",
            }}
          />
        )}
        <Box
          sx={{
            position: "absolute",
            bottom: "5%",
            left: "50%",
            transform: "translate(-50%, 0)",
            textAlign: "center",
            width: "90%",
          }}
        >
          <Typography variant="h3" fontWeight="bold" color="white">
            {details.title || details.name}
          </Typography>
          <Typography variant="body1" color="white" mt={1}>
            {details.tagline || "No tagline available"}
          </Typography>
          <Typography variant="body2" color="gray" mt={1}>
            {details.release_date || details.first_air_date} |{" "}
            {details.runtime || details.episode_run_time?.[0]} min |{" "}
            {details.genres.map((g) => g.name).join(", ")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              mt: 2,
            }}
          >
            <Rating
              name="rating"
              value={details.vote_average / 2}
              precision={0.5}
              readOnly
              emptyIcon={<StarIcon style={{ opacity: 0.5 }} />}
            />
            <Typography variant="body2" color="gold" fontWeight="bold">
              {details.vote_average.toFixed(1)} / 10
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Details Section */}
      <Container className="my-4">
        <Row>
          {/* Poster and Basic Info */}
          <Col md={4} xs={12}>
            <Box
              onDoubleClick={handleDoubleClick}
              sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "10px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                transition: "transform 0.3s",
                ":hover": { transform: "scale(1.05)" },
              }}
            >
              {showTrailer && trailer ? (
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="Trailer"
                  style={{
                    width: "100%",
                    height: "100%",
                    aspectRatio: "2/3",
                    borderRadius: "10px",
                  }}
                ></iframe>
              ) : (
                <img
                  src={`https://image.tmdb.org/t/p/w780${details.poster_path}`}
                  alt={details.title || details.name}
                  style={{ width: "100%", borderRadius: "10px" }}
                />
              )}
            </Box>
          </Col>

          {/* Detailed Info */}
          <Col md={8} xs={12}>
            <Card
              style={{
                backgroundColor: "#1e1e1e",
                color: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                animation: `${fadeIn} 1s ease-in-out`,
              }}
            >
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                🎬 {type === "movie" ? "Movie" : "TV Show"} Details
              </Typography>

              {/* Director and Writers (for movies) */}
              {type === "movie" && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" color="gold">
                    <MovieIcon style={{ marginRight: "10px", verticalAlign: "middle" }} />
                    Director:{" "}
                    {details.credits.crew.find((c) => c.job === "Director")?.name ||
                      "N/A"}
                  </Typography>
                  <Typography variant="body1" color="gold">
                    <DescriptionIcon style={{ marginRight: "10px", verticalAlign: "middle" }} />
                    Writers:{" "}
                    {details.credits.crew
                      .filter((c) => c.job === "Writer")
                      .map((w) => w.name)
                      .join(", ") || "N/A"}
                  </Typography>
                </Box>
              )}

              {/* Budget and Box Office (for movies) */}
              {type === "movie" && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" color="gold">
                    <MonetizationOnIcon style={{ marginRight: "10px", verticalAlign: "middle" }} />
                    Budget:{" "}
                    {details.budget
                      ? `$${details.budget.toLocaleString()}`
                      : "N/A"}
                  </Typography>
                  <Typography variant="body1" color="gold">
                    <MonetizationOnIcon style={{ marginRight: "10px", verticalAlign: "middle" }} />
                    Box Office:{" "}
                    {details.revenue
                      ? `$${details.revenue.toLocaleString()}`
                      : "N/A"}
                  </Typography>
                </Box>
              )}

              {/* Technical Specs */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" color="gold">
                  <PublicIcon style={{ marginRight: "10px", verticalAlign: "middle" }} />
                  Country: {details.production_countries.map((c) => c.name).join(", ")}
                </Typography>
                <Typography variant="body1" color="gold">
                  <LanguageIcon style={{ marginRight: "10px", verticalAlign: "middle" }} />
                  Language: {details.spoken_languages.map((l) => l.name).join(", ")}
                </Typography>
                <Typography variant="body1" color="gold">
                  <TheatersIcon style={{ marginRight: "10px", verticalAlign: "middle" }} />
                  Status: {details.status}
                </Typography>
              </Box>

              {/* Storyline */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  <DescriptionIcon style={{ marginRight: "10px", verticalAlign: "middle" }} />
                  Storyline
                </Typography>
                <Typography variant="body1" color="white">
                  {details.overview || "No overview available."}
                </Typography>
              </Box>

              {/* Cast */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  <GroupsIcon style={{ marginRight: "10px", verticalAlign: "middle" }} />
                  Top Cast
                </Typography>
                <Slider {...sliderSettings}>
                  {cast.map((actor) => (
                    <div key={actor.id} style={{ padding: "0 15px" }}>
                      <img
                        src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                        alt={actor.name}
                        style={{
                          width: "100%",
                          borderRadius: "50%",
                          aspectRatio: "1/1",
                          objectFit: "cover",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                          transition: "transform 0.3s",
                          ":hover": { transform: "scale(1.1)" },
                        }}
                      />
                      <Typography variant="body2" style={{ color: "white", textAlign: "center", marginTop: "10px" }}>
                        {actor.name} as {actor.character}
                      </Typography>
                    </div>
                  ))}
                </Slider>
              </Box>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Recommendations Section */}
      <Container className="my-4">
        <Typography variant="h5" fontWeight="bold" gutterBottom style={{ color: "white" }}>
          🎥 Recommendations
        </Typography>
        <Slider {...sliderSettings}>
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              style={{ padding: "0 15px", cursor: "pointer" }}
              onClick={() => handleRecommendationClick(rec.id)}
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
                  src={`https://image.tmdb.org/t/p/w500${rec.poster_path}`}
                  alt={rec.title || rec.name}
                  style={{ width: "100%", borderRadius: "10px" }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "rgba(0, 0, 0, 0.7)",
                    padding: "5px 10px",
                    borderRadius: "5px",
                  }}
                >
                  <Rating
                    name="rating"
                    value={rec.vote_average / 2}
                    precision={0.5}
                    readOnly
                    size="small"
                    emptyIcon={<StarIcon style={{ opacity: 0.5 }} />}
                  />
                  <Typography variant="body2" color="gold" fontWeight="bold">
                    {rec.vote_average.toFixed(1)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)",
                    padding: "10px",
                  }}
                >
                  <Typography variant="body1" color="white" fontWeight="bold">
                    {rec.title || rec.name}
                  </Typography>
                </Box>
              </Box>
            </div>
          ))}
        </Slider>
      </Container>

      {/* Additional Sections */}
      <Container className="my-4">
        <Card
          style={{
            backgroundColor: "#1e1e1e",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
            animation: `${fadeIn} 1s ease-in-out`,
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            🏆 Awards
          </Typography>
          <Typography variant="body1" color="white">
            This {type === "movie" ? "movie" : "TV show"} has won 5 awards and received 10 nominations.
          </Typography>
        </Card>
      </Container>

      <Container className="my-4">
        <Card
          style={{
            backgroundColor: "#1e1e1e",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
            animation: `${fadeIn} 1s ease-in-out`,
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            🎭 Trivia
          </Typography>
          <Typography variant="body1" color="white">
            Did you know? This {type === "movie" ? "movie" : "TV show"} was filmed in over 10 different countries.
          </Typography>
        </Card>
      </Container>

      <Container className="my-4">
        <Card
          style={{
            backgroundColor: "#1e1e1e",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
            animation: `${fadeIn} 1s ease-in-out`,
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            📝 User Reviews
          </Typography>
          <Typography variant="body1" color="white">
            "This {type === "movie" ? "movie" : "TV show"} is a masterpiece!" - User123
          </Typography>
        </Card>
      </Container>
    </Container>
  );
};

export default DetailsPage;