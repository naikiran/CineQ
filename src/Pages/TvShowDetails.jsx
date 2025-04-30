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
  CardMedia,
  CardContent,
  useMediaQuery,
  Modal,
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import StarIcon from "@mui/icons-material/Star";
import TheatersIcon from "@mui/icons-material/Theaters";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LanguageIcon from "@mui/icons-material/Language";
import GroupsIcon from "@mui/icons-material/Groups";
import DescriptionIcon from "@mui/icons-material/Description";
import TvIcon from "@mui/icons-material/Tv";
import PublicIcon from "@mui/icons-material/Public";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { keyframes } from "@emotion/react";
import { Row, Col, Card } from "react-bootstrap";

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

const TvShowDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tvShow, setTvShow] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [similarShows, setSimilarShows] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [watchProviders, setWatchProviders] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [expandedSeason, setExpandedSeason] = useState(null);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const isSmallScreen = useMediaQuery("(max-width: 480px)");

  // Handle season click
  const handleSeasonClick = (seasonId) => {
    setExpandedSeason(seasonId === expandedSeason ? null : seasonId);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}`,
          {
            params: {
              api_key: API_KEY,
              append_to_response:
                "credits,videos,recommendations,similar,external_ids,content_ratings,keywords,watch/providers,reviews,seasons",
            },
          }
        );
        setTvShow(response.data);
        setCast(response.data.credits.cast.slice(0, 10));
        setCrew(response.data.credits.crew.slice(0, 5));
        setTrailer(
          response.data.videos.results.find((vid) => vid.type === "Trailer")
        );
        setRecommendations(response.data.recommendations.results);
        setSimilarShows(response.data.similar.results);
        setReviews(response.data.reviews.results);
        setKeywords(response.data.keywords.results);
        setWatchProviders(
          response.data["watch/providers"].results?.US?.flatrate || []
        );
        setSeasons(response.data.seasons);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching TV show details: ", error);
        setError("Failed to fetch TV show details. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleTrailerToggle = () => {
    setShowTrailer((prev) => !prev);
  };

  const handleRecommendationClick = (tvShowId) => {
    setLoading(true);
    setTimeout(() => {
      navigate(`/tvshow/${tvShowId}`);
      window.scrollTo(0, 0);
    }, 1000);
  };

  // Slider settings with dynamic slidesToShow based on isMobile
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
        sx={{
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 1000,
          color: "white",
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Hero Section */}
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
                  title="TV Show Trailer"
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
                  src={`https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`}
                  alt={tvShow.name}
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
                  {tvShow.name}
                </Typography>
                <Typography variant="body1" color="white" mt={1}>
                  {tvShow.tagline || "No tagline available"}
                </Typography>
                <Typography variant="body2" color="gray" mt={1}>
                  {tvShow.first_air_date} | {tvShow.episode_run_time[0]} min |{" "}
                  {tvShow.genres.map((g) => g.name).join(", ")}
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
                    name="tvshow-rating"
                    value={tvShow.vote_average / 2}
                    precision={0.5}
                    readOnly
                    emptyIcon={<StarIcon style={{ opacity: 0.5 }} />}
                  />
                  <Typography variant="body2" color="gold" fontWeight="bold">
                    {tvShow.vote_average.toFixed(1)} / 10
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
                src={`https://image.tmdb.org/t/p/w780${tvShow.poster_path}`}
                alt={tvShow.name}
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
                  {tvShow.name}
                </Typography>
                <Typography variant="body1" color="white" mt={1}>
                  {tvShow.tagline || "No tagline available"}
                </Typography>
                <Typography variant="body2" color="gray" mt={1}>
                  {tvShow.first_air_date} | {tvShow.episode_run_time[0]} min |{" "}
                  {tvShow.genres.map((g) => g.name).join(", ")}
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
                    name="tvshow-rating"
                    value={tvShow.vote_average / 2}
                    precision={0.5}
                    readOnly
                    emptyIcon={<StarIcon style={{ opacity: 0.5 }} />}
                  />
                  <Typography variant="body2" color="gold" fontWeight="bold">
                    {tvShow.vote_average.toFixed(1)} / 10
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
              title="TV Show Trailer"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          )}
        </Box>
      </Modal>
      {/* Main Details Section */}
      <Container className="my-4">
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={400} />
        ) : (
          <Row>
            {/* Poster and Basic Info */}
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
                  src={`https://image.tmdb.org/t/p/w780${tvShow.poster_path}`}
                  alt={tvShow.name}
                  style={{ width: "100%", borderRadius: "10px" }}
                />
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
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  fontWeight="bold"
                  gutterBottom
                >
                  📺 TV Show Details
                </Typography>

                {/* Creators */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant={isMobile ? "body2" : "body1"}
                    color="gold"
                  >
                    <TvIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Creators:{" "}
                    {tvShow.created_by
                      ?.map((creator) => creator.name)
                      .join(", ") || "N/A"}
                  </Typography>
                </Box>

                {/* Seasons and Episodes */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant={isMobile ? "body2" : "body1"}
                    color="gold"
                  >
                    <AccessTimeIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Seasons: {tvShow.number_of_seasons}
                  </Typography>
                  <Typography
                    variant={isMobile ? "body2" : "body1"}
                    color="gold"
                  >
                    <AccessTimeIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Episodes: {tvShow.number_of_episodes}
                  </Typography>
                </Box>

                {/* Technical Specs */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant={isMobile ? "body2" : "body1"}
                    color="gold"
                  >
                    <PublicIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Country: {tvShow.origin_country?.join(", ") || "N/A"}
                  </Typography>
                  <Typography
                    variant={isMobile ? "body2" : "body1"}
                    color="gold"
                  >
                    <LanguageIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Language: {tvShow.original_language}
                  </Typography>
                  <Typography
                    variant={isMobile ? "body2" : "body1"}
                    color="gold"
                  >
                    <TheatersIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Status: {tvShow.status}
                  </Typography>
                </Box>

                {/* Storyline */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    fontWeight="bold"
                    gutterBottom
                  >
                    <DescriptionIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Storyline
                  </Typography>
                  <Typography
                    variant={isMobile ? "body2" : "body1"}
                    color="white"
                  >
                    {tvShow.overview || "No overview available."}
                  </Typography>
                </Box>

                {/* Cast */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    fontWeight="bold"
                    gutterBottom
                  >
                    <GroupsIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Top Cast
                  </Typography>
                  <Slider {...sliderSettings}>
                    {cast.map((actor) => (
                      <div key={actor.id} style={{ padding: "0 10px" }}>
                        <Card
                          sx={{
                            backgroundColor: "#1e1e1e",
                            borderRadius: "10px",
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                            transition: "transform 0.3s",
                            ":hover": { transform: "scale(1.05)" },
                            textAlign: "center",
                            padding: "10px",
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={
                              actor.profile_path
                                ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                                : "path_to_fallback_image.jpg" // Add a fallback image if no profile image exists
                            }
                            alt={actor.name}
                            sx={{
                              width: "100px",
                              height: "100px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              margin: "0 auto 10px auto",
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: "white",
                              fontWeight: "bold",
                              marginBottom: "5px",
                            }}
                          >
                            {actor.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "gray",
                              fontStyle: "italic",
                            }}
                          >
                            as {actor.character}
                          </Typography>
                        </Card>
                      </div>
                    ))}
                  </Slider>
                </Box>
              </Card>
            </Col>
          </Row>
        )}
      </Container>

      {/* Seasons Section */}
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
          <Typography
            variant={isMobile ? "h6" : "h5"}
            fontWeight="bold"
            gutterBottom
          >
            📺 Seasons
          </Typography>
          {seasons.map((season) => (
            <Accordion
              key={season.id}
              expanded={expandedSeason === season.id}
              onChange={() => handleSeasonClick(season.id)}
              sx={{ backgroundColor: "#1e1e1e", color: "white" }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
                <Typography variant={isMobile ? "body2" : "body1"}>
                  {season.name} ({season.episode_count} episodes)
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant={isMobile ? "body2" : "body1"}>
                  {season.overview || "No overview available."}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Card>
      </Container>

      {/* Recommendations Section */}
      <Container className="my-4">
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={200} />
        ) : (
          <>
            <Typography
              variant={isMobile ? "h6" : "h5"}
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
                      alt={rec.name}
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
                        name="tvshow-rating"
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
                        variant={isMobile ? "body2" : "body1"}
                        color="white"
                        fontWeight="bold"
                      >
                        {rec.name}
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

export default TvShowDetails;
