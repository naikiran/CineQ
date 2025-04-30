import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  InputBase,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import MovieIcon from "@mui/icons-material/Movie";
import TvIcon from "@mui/icons-material/Tv";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import logo from "../Images/CineQ2.jpeg";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    if (searchTerm.length > 2) {
      axios
        .get(`https://api.themoviedb.org/3/search/movie`, {
          params: { api_key: API_KEY, query: searchTerm },
        })
        .then((response) => setSearchResults(response.data.results))
        .catch((error) => console.error("Error fetching search results: ", error));
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleSearchSelect = (movieId) => {
    navigate(`/movie/${movieId}`);
    setSearchTerm("");
    setSearchResults([]);
  };

  const drawer = (
    <Box sx={{ width: 250 }} onClick={handleDrawerToggle}>
      <List>
        {[{ name: "Movies", icon: <MovieIcon />, path: "/movies" },
          { name: "TV Shows", icon: <TvIcon />, path: "/tvshows" },
          { name: "Trending", icon: <TrendingUpIcon />, path: "/trending" },
          { name: "Watchlist", icon: <BookmarkIcon />, path: "/watchlist" }].map((item) => (
          <ListItem button key={item.name} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
        {!user && (
          <>
            <ListItem button component={Link} to="/login">
              <ListItemIcon><LoginIcon /></ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} to="/signup">
              <ListItemIcon><PersonAddIcon /></ListItemIcon>
              <ListItemText primary="Sign Up" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: "#121212" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Link to="/">
            <img src={logo} alt="CineQ Logo" style={{ height: 40 }} />
          </Link>
        </Box>
        
        {/* Navigation Links */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          {[{ name: "Movies", icon: <MovieIcon />, path: "/movies" },
            { name: "TV Shows", icon: <TvIcon />, path: "/tvshows" },
            { name: "Trending", icon: <TrendingUpIcon />, path: "/trending" }].map((item) => (
            <Button key={item.name} color="inherit" component={Link} to={item.path}>
              {item.icon}&nbsp;{item.name}
            </Button>
          ))}
        </Box>
        
        {/* Search Bar */}
        <Box sx={{ position: "relative", display: "flex", alignItems: "center", backgroundColor: "#333", padding: "5px 10px", borderRadius: 2 }}>
          <SearchIcon sx={{ color: "white" }} />
          <InputBase 
            placeholder="Search..."
            sx={{ color: "white", marginLeft: 1 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchResults.length > 0 && (
            <Box sx={{ position: "absolute", top: "40px", left: 0, width: "100%", backgroundColor: "#222", color: "white", borderRadius: "4px", zIndex: 10 }}>
              {searchResults.slice(0, 5).map((movie) => (
                <MenuItem key={movie.id} onClick={() => handleSearchSelect(movie.id)}>
                  {movie.title}
                </MenuItem>
              ))}
            </Box>
          )}
        </Box>
        
        {/* User Authentication Buttons */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
          {!user ? (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button variant="contained" color="primary" component={Link} to="/signup">Sign Up</Button>
            </>
          ) : (
            <Button color="inherit" onClick={handleLogout}>
              <LogoutIcon /> Logout
            </Button>
          )}
        </Box>
        
        {/* Mobile Menu Icon */}
        <IconButton edge="end" color="inherit" onClick={handleDrawerToggle} sx={{ display: { md: "none" } }}>
          <MenuIcon />
        </IconButton>
      </Toolbar>
      
      {/* Sidebar Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;
