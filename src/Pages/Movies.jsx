import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Rating,
  Skeleton,
  CircularProgress,
  Chip,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  Grid,
  Link,
  Divider,
  useMediaQuery,
  Modal,
} from "@mui/material";
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Row, Col, Card } from "react-bootstrap";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

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

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [watchProviders, setWatchProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const isSmallScreen = useMediaQuery("(max-width: 480px)");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
          params: {
            api_key: API_KEY,
            append_to_response:
              "credits,videos,recommendations,similar,reviews,keywords,watch/providers",
          },
        });
        setMovie(response.data);
        setCast(response.data.credits.cast.slice(0, 10));
        setCrew(response.data.credits.crew.slice(0, 5));
        setTrailer(
          response.data.videos.results.find((vid) => vid.type === "Trailer")
        );
        setRecommendations(response.data.recommendations.results);
        setSimilarMovies(response.data.similar.results);
        setReviews(response.data.reviews.results);
        setKeywords(response.data.keywords.keywords);
        setWatchProviders(response.data["watch/providers"].results?.US?.flatrate || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie details: ", error);
        setError("Failed to fetch movie details. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleTrailerToggle = () => {
    setShowTrailer((prev) => !prev);
  };

  const handleRecommendationClick = (movieId) => {
    setLoading(true);
    setTimeout(() => {
      navigate(`/movie/${movieId}`);
      window.scrollTo(0, 0);
    }, 1000);
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 3 : 5,
    slidesToScroll: isMobile ? 1 : 2,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

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
      fluid
      className="p-0"
      style={{ backgroundColor: "#121212", color: "white" }}
    >
      {/* Back Button */}
      <IconButton
        onClick={() => navigate(-1)}
        sx={{ position: "fixed", top: 20, left: 20, zIndex: 1000, color: "white" }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Hero Section */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
          }}
        >
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        <>
          {/* Horizontal Poster (Hidden on Mobile) */}
          {!isMobile && (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                paddingTop: "56.25%", // 16:9 aspect ratio
                overflow: "hidden",
                animation: `${fadeIn} 1s ease-in-out`,
              }}
            >
              {showTrailer && trailer ? (
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="Movie Trailer"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                />
              ) : (
                <img
                  src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                  alt={movie.title}
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
                <Typography
                  variant={isSmallScreen ? "h4" : "h3"}
                  fontWeight="bold"
                  color="white"
                >
                  {movie.title}
                </Typography>
                <Typography variant="body1" color="white" mt={1}>
                  {movie.tagline || "No tagline available"}
                </Typography>
                <Typography variant="body2" color="gray" mt={1}>
                  {movie.release_date} | {movie.runtime} min |{" "}
                  {movie.genres.map((g) => g.name).join(", ")}
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
                    name="movie-rating"
                    value={movie.vote_average / 2}
                    precision={0.5}
                    readOnly
                    emptyIcon={<StarIcon style={{ opacity: 0.5 }} />}
                  />
                  <Typography variant="body2" color="gold" fontWeight="bold">
                    {movie.vote_average.toFixed(1)} / 10
                  </Typography>
                </Box>
                <Tooltip title="Play Trailer">
                  <IconButton onClick={handleTrailerToggle} color="primary">
                    <PlayCircleOutlineIcon fontSize="large" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          )}

          {/* Vertical Poster (Visible on Mobile) */}
          {isMobile && (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                paddingTop: "150%", // Adjust for vertical poster aspect ratio
                overflow: "hidden",
                animation: `${fadeIn} 1s ease-in-out`,
              }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                alt={movie.title}
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
                <Typography
                  variant={isSmallScreen ? "h5" : "h4"}
                  fontWeight="bold"
                  color="white"
                >
                  {movie.title}
                </Typography>
                <Typography variant="body1" color="white" mt={1}>
                  {movie.tagline || "No tagline available"}
                </Typography>
                <Typography variant="body2" color="gray" mt={1}>
                  {movie.release_date} | {movie.runtime} min |{" "}
                  {movie.genres.map((g) => g.name).join(", ")}
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
                    name="movie-rating"
                    value={movie.vote_average / 2}
                    precision={0.5}
                    readOnly
                    emptyIcon={<StarIcon style={{ opacity: 0.5 }} />}
                  />
                  <Typography variant="body2" color="gold" fontWeight="bold">
                    {movie.vote_average.toFixed(1)} / 10
                  </Typography>
                </Box>
                <Tooltip title="Play Trailer">
                  <IconButton onClick={handleTrailerToggle} color="primary">
                    <PlayCircleOutlineIcon fontSize="large" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          )}
        </>
      )}

      {/* Trailer Modal for Mobile */}
      <Modal
        open={showTrailer && isMobile}
        onClose={handleTrailerToggle}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "90%",
            height: isSmallScreen ? "40%" : "50%",
            backgroundColor: "#121212",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          {trailer && (
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Movie Trailer"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          )}
        </Box>
      </Modal>

      {/* Movie Details Section */}
      <Container className="my-4">
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={400} />
        ) : (
          <Row>
            {/* Poster and Basic Info */}
            {!isMobile && ( // Only show vertical poster in details section on desktop
              <Col md={4} xs={12}>
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
                    src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                    alt={movie.title}
                    style={{ width: "100%", borderRadius: "10px" }}
                  />
                </Box>
              </Col>
            )}

            {/* Detailed Info */}
            <Col md={isMobile ? 12 : 8} xs={12}>
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
                <Typography
                  variant={isSmallScreen ? "h6" : "h5"}
                  fontWeight="bold"
                  gutterBottom
                >
                  🎬 Movie Details
                </Typography>

                {/* Director and Writers */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant={isSmallScreen ? "body2" : "body1"} color="gold">
                    <MovieIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Director:{" "}
                    {movie.credits.crew.find((c) => c.job === "Director")?.name ||
                      "N/A"}
                  </Typography>
                  <Typography variant={isSmallScreen ? "body2" : "body1"} color="gold">
                    <DescriptionIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Writers:{" "}
                    {movie.credits.crew
                      .filter((c) => c.job === "Writer")
                      .map((w) => w.name)
                      .join(", ") || "N/A"}
                  </Typography>
                </Box>

                {/* Budget and Box Office */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant={isSmallScreen ? "body2" : "body1"} color="gold">
                    <MonetizationOnIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Budget:{" "}
                    {movie.budget
                      ? `$${movie.budget.toLocaleString()}`
                      : "N/A"}
                  </Typography>
                  <Typography variant={isSmallScreen ? "body2" : "body1"} color="gold">
                    <MonetizationOnIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Box Office:{" "}
                    {movie.revenue
                      ? `$${movie.revenue.toLocaleString()}`
                      : "N/A"}
                  </Typography>
                </Box>

                {/* Technical Specs */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant={isSmallScreen ? "body2" : "body1"} color="gold">
                    <PublicIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Country: {movie.production_countries.map((c) => c.name).join(", ")}
                  </Typography>
                  <Typography variant={isSmallScreen ? "body2" : "body1"} color="gold">
                    <LanguageIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Language: {movie.spoken_languages.map((l) => l.name).join(", ")}
                  </Typography>
                  <Typography variant={isSmallScreen ? "body2" : "body1"} color="gold">
                    <TheatersIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Status: {movie.status}
                  </Typography>
                </Box>


                {/* Storyline */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    <DescriptionIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Storyline
                  </Typography>
                  <Typography variant="body1" color="white">
                    {movie.overview || "No overview available."}
                  </Typography>
                </Box>

                {/* Cast */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    <GroupsIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Top Cast
                  </Typography>
                  <Slider {...sliderSettings}>
                    {cast.map((actor) => (
                      <div key={actor.id} style={{ padding: "0 15px" }}>
                        <img
                          src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`} // Higher quality images
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
                        <Typography
                          variant="body2"
                          style={{
                            color: "white",
                            textAlign: "center",
                            marginTop: "10px",
                          }}
                        >
                          {actor.name} as {actor.character}
                        </Typography>
                      </div>
                    ))}
                  </Slider>
                </Box>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
      {/* Production Companies Section */}
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
            🏢 Production Companies
          </Typography>
          {loading ? (
            <CircularProgress color="secondary" />
          ) : movie && movie.production_companies ? (
            <Grid container spacing={2}>
              {movie.production_companies.map((company) => (
                <Grid item key={company.id} xs={6} sm={4} md={3}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {company.logo_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                        alt={company.name}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "contain",
                          borderRadius: "10px",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: "100px",
                          height: "100px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#333",
                          borderRadius: "10px",
                        }}
                      >
                        <Typography variant="body2" color="white" align="center">
                          No Logo
                        </Typography>
                      </Box>
                    )}
                    <Typography variant="body2" color="white" align="center">
                      {company.name}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" color="white">
              No production companies available.
            </Typography>
          )}
        </Card>
      </Container>

      {/* Watch Providers Section */}
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
            📺 Where to Watch
          </Typography>
          {loading ? (
            <CircularProgress color="secondary" />
          ) : watchProviders && watchProviders.length > 0 ? (
            <Grid container spacing={2}>
              {watchProviders.map((provider) => (
                <Grid item key={provider.provider_id} xs={6} sm={4} md={3}>
                  <Link
                    href={`https://www.themoviedb.org/movie/${movie.id}/watch?locale=US`} // TMDB watch link
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                        cursor: "pointer",
                        transition: "transform 0.3s",
                        ":hover": { transform: "scale(1.1)" },
                      }}
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w200${provider.logo_path}`}
                        alt={provider.provider_name}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "contain",
                          borderRadius: "10px",
                        }}
                      />
                      <Typography variant="body2" color="white" align="center">
                        {provider.provider_name}
                      </Typography>
                    </Box>
                  </Link>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" color="white">
              No streaming information available.
            </Typography>
          )}
        </Card>
      </Container>

      {/* Keywords Section */}
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
            🔑 Keywords
          </Typography>
          {loading ? (
            <CircularProgress color="secondary" />
          ) : keywords && keywords.length > 0 ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {keywords.map((keyword) => (
                <Chip
                  key={keyword.id}
                  label={keyword.name}
                  style={{ backgroundColor: "#333", color: "white" }}
                />
              ))}
            </Box>
          ) : (
            <Typography variant="body1" color="white">
              No keywords available.
            </Typography>
          )}
        </Card>
      </Container>

      {/* User Reviews Section */}
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
          {loading ? (
            <CircularProgress color="secondary" />
          ) : reviews && reviews.length > 0 ? (
            <Box>
              {reviews.slice(0, 3).map((review) => (
                <Box key={review.id} sx={{ mb: 3 }}>
                  <Typography variant="body1" color="white">
                    "{review.content}"
                  </Typography>
                  <Typography variant="body2" color="gray" mt={1}>
                    - {review.author}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body1" color="white">
              No reviews available.
            </Typography>
          )}
        </Card>
      </Container>

      {/* Awards Section */}
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
            This movie has won 5 awards and received 10 nominations.
          </Typography>
        </Card>
      </Container>

      {/* Trivia Section */}
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
            Did you know? This movie was filmed in over 10 different countries.
          </Typography>
        </Card>
      </Container>

      {/* Similar Movies Section */}
      <Container className="my-4">
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={200} />
        ) : (
          <>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              style={{ color: "white" }}
            >
              🎬 Similar Movies
            </Typography>
            <Slider {...sliderSettings}>
              {similarMovies.map((movie) => (
                <div
                  key={movie.id}
                  style={{ padding: "0 15px", cursor: "pointer" }}
                  onClick={() => handleRecommendationClick(movie.id)}
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
                      alt={movie.title}
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
                        name="movie-rating"
                        value={movie.vote_average / 2}
                        precision={0.5}
                        readOnly
                        size="small"
                        emptyIcon={<StarIcon style={{ opacity: 0.5 }} />}
                      />
                      <Typography
                        variant="body2"
                        color="gold"
                        fontWeight="bold"
                      >
                        {movie.vote_average.toFixed(1)}
                      </Typography>
                    </Box>
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
                        variant="body1"
                        color="white"
                        fontWeight="bold"
                      >
                        {movie.title}
                      </Typography>
                    </Box>
                  </Box>
                </div>
              ))}
            </Slider>
          </>
        )}
      </Container>

      {/* Recommendations Section */}
      <Container className="my-4" style={{marginBottom:"-19px"}}>
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={200} />
        ) : (
          <>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              style={{ color: "white" }}
            >
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
                      alt={rec.title}
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
                        name="movie-rating"
                        value={rec.vote_average / 2}
                        precision={0.5}
                        readOnly
                        size="small"
                        emptyIcon={<StarIcon style={{ opacity: 0.5 }} />}
                      />
                      <Typography
                        variant="body2"
                        color="gold"
                        fontWeight="bold"
                      >
                        {rec.vote_average.toFixed(1)}
                      </Typography>
                    </Box>
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
                        variant="body1"
                        color="white"
                        fontWeight="bold"
                      >
                        {rec.title}
                      </Typography>
                    </Box>
                  </Box>
                </div>
              ))}
            </Slider>
          </>
        )}
      </Container>

      <br />
      <br />
      <br />
    </Box>
  );
};

export default MovieDetails;