import React from "react";
import {
  Box,
  Typography,
  Link,
  Grid,
  IconButton,
  Divider,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import logo from "../Images/CineQ2.jpeg"; // Adjust the path to your logo
import { keyframes } from "@emotion/react";

// Animation for hover effect
const bounce = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0); }
`;

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#121212",
        color: "white",
        padding: "40px 20px",
        marginTop: "auto", // Ensures footer sticks to the bottom
        fontFamily: "'Poppins', sans-serif", // Change font family
      }}
    >
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        {/* Logo and Description */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <img
              src={logo}
              alt="CineQ Logo"
              style={{ height: 50, marginBottom: 10 }}
            />
            <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif" }}>
              CineQ is your ultimate destination for movies, TV shows, and trending
              content. Explore, watch, and enjoy!
            </Typography>
          </Box>
        </Grid>

        {/* Quick Links */}
        <Grid item xs={12} md={2}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ textAlign: "center", fontFamily: "'Poppins', sans-serif" }}
          >
            Quick Links
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Link
              href="/movies"
              color="inherit"
              underline="hover"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                "&:hover": { animation: `${bounce} 0.5s` },
              }}
            >
              Movies
            </Link>
            <Link
              href="/tvshows"
              color="inherit"
              underline="hover"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                "&:hover": { animation: `${bounce} 0.5s` },
              }}
            >
              TV Shows
            </Link>
            <Link
              href="/trending"
              color="inherit"
              underline="hover"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                "&:hover": { animation: `${bounce} 0.5s` },
              }}
            >
              Trending
            </Link>
            <Link
              href="/watchlist"
              color="inherit"
              underline="hover"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                "&:hover": { animation: `${bounce} 0.5s` },
              }}
            >
              Watchlist
            </Link>
          </Box>
        </Grid>

        {/* Legal Links */}
        <Grid item xs={12} md={2}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ textAlign: "center", fontFamily: "'Poppins', sans-serif" }}
          >
            Legal
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Link
              href="/privacy-policy"
              color="inherit"
              underline="hover"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                "&:hover": { animation: `${bounce} 0.5s` },
              }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              color="inherit"
              underline="hover"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                "&:hover": { animation: `${bounce} 0.5s` },
              }}
            >
              Terms of Service
            </Link>
            <Link
              href="/faq"
              color="inherit"
              underline="hover"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                "&:hover": { animation: `${bounce} 0.5s` },
              }}
            >
              FAQ
            </Link>
          </Box>
        </Grid>

        {/* Social Media Links */}
        <Grid item xs={12} md={2}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ textAlign: "center", fontFamily: "'Poppins', sans-serif" }}
          >
            Follow Us
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <IconButton
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{
                "&:hover": { animation: `${bounce} 0.5s`, color: "#1877F2" }, // Facebook blue
              }}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{
                "&:hover": { animation: `${bounce} 0.5s`, color: "#1DA1F2" }, // Twitter blue
              }}
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{
                "&:hover": { animation: `${bounce} 0.5s`, color: "#E1306C" }, // Instagram pink
              }}
            >
              <InstagramIcon />
            </IconButton>
            <IconButton
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{
                "&:hover": { animation: `${bounce} 0.5s`, color: "#FF0000" }, // YouTube red
              }}
            >
              <YouTubeIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* Divider */}
      <Divider sx={{ backgroundColor: "#333", margin: "20px 0" }} />

      {/* Copyright */}
      <Typography
        variant="body2"
        align="center"
        sx={{ fontFamily: "'Poppins', sans-serif" }}
      >
        © {new Date().getFullYear()} CineQ. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;