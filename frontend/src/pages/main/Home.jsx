import React, { useEffect } from "react";
import { AppBar, Toolbar, Typography, Container, Button, Box, Paper } from "@mui/material";
import Header from "../../components/components/Header";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUserInfo } from "../../redux/slices/authSlice";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();

  // Add this debug log
  console.log('Redux auth state:', userInfo);

  const handleLogout = async () => {
    try {
      // First, call the backend logout endpoint
      await axios.post('http://localhost:7000/api/logout', {}, {
        withCredentials: true
      });

      // Clear cookies with all possible path and domain combinations
      const cookiesToClear = ['token', 'refreshToken', 'jwt'];
      const paths = ['/', '/api'];
      const domains = [window.location.hostname, ''];

      cookiesToClear.forEach(cookieName => {
        paths.forEach(path => {
          domains.forEach(domain => {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}${domain ? `; domain=${domain}` : ''}; secure; samesite=strict`;
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}${domain ? `; domain=${domain}` : ''}`;
          });
        });
      });

      // Clear Redux state
      dispatch(clearUserInfo());

      // Clear localStorage
      localStorage.clear();

      // Clear sessionStorage
      sessionStorage.clear();

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear frontend state and redirect even if backend call fails
      dispatch(clearUserInfo());
      navigate("/login");
    }
  };
  const userName = userInfo?.name;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      navigate('/');
    }
  }, [userInfo, navigate]);


  return (
    <Box sx={{ background: "linear-gradient(135deg, #e4e4c1, #a2906d)", minHeight: "100vh" }}>
      <Header onLogout={handleLogout} userName={userName} />
      < Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 64px)",
          p: 2,
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={5}
            sx={{
              p: 4,
              textAlign: "center",
              backgroundColor: "#e4e4c1",
              borderRadius: 3,
              boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, color: "#684824" }}>
              Welcome to Our E-Commerce Store!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: "#856c48" }}>
              Discover the best jackets in our collection. Stylish, comfortable, and designed just for you.
            </Typography>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#684824", "&:hover": { backgroundColor: "#856c48" }, mr: 2 }}
            >
              Shop Now
            </Button>
          </Paper>
        </Container>
      </Box>
    </Box >
  );
};

export default Home;
