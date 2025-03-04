import React, { useEffect, useState } from "react";
import { Container, TextField, Button, Typography, Box, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from 'axios';
import { CSSTransition } from "react-transition-group";
import "../../styles/auth.css";
import { ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo } from '../../redux/slices/authSlice';

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo, isAuthenticated } = useSelector((state) => state.auth);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields", { position: "top-center" });
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address", { position: "top-center" });
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long", { position: "top-center" });
      return;
    }

    try {
      const response = await axios.post('http://localhost:7000/api/login', {
        email,
        password
      }, {
        withCredentials: true
      });

      console.log('Login response data:', response.data);

      if (response.data) {
        console.log('response.data:', response.data);

        const userData = {
          name: response.data.username || `${response.data.firstname} ${response.data.lastname}`,
          email: response.data.email,
        };

        console.log('Constructed userData:', userData);

        dispatch(setUserInfo(userData));
        localStorage.setItem('userInfo', JSON.stringify(userData));
        toast.success('Login successful!', { position: "top-center" });
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'User not registered or invalid credentials';
      toast.error(errorMessage, { position: "top-center" });
      setError(errorMessage);
    }
  };
  useEffect(() => {
    if (userInfo) {
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-side">
        <div className="advertisement">
          <Typography variant="h4" sx={{ mb: 3 }}>
            Welcome to Our Platform
          </Typography>
          <Typography variant="body1">
            Discover amazing features and benefits when you join our community.
            Start your journey with us today!
          </Typography>
        </div>
      </div>

      <div className="auth-side">
        <div className="auth-form-container">
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
            <Typography variant="h5" sx={{ mb: 2, color: "#684824" }}>
              User Login
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#856c48" },
                    "&:hover fieldset": { borderColor: "#a2906d" },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#856c48" },
                    "&:hover fieldset": { borderColor: "#a2906d" },
                  },
                }}
              />
              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{
                  mt: 2,
                  backgroundColor: "#684824",
                  "&:hover": { backgroundColor: "#856c48" },
                }}
              >
                Login
              </Button>
              <Box mt={2}>
                <Link to="/signup" className="auth-link">
                  <Typography variant="body2">
                    New user? Create an account
                  </Typography>
                </Link>
              </Box>
            </form>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
