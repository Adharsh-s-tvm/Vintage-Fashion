import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import "../../styles/auth.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../redux/slices/authSlice';

const UserSignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (firstName.length < 2) {
      toast.error("First name must be at least 2 characters long", { position: "top-center" });
      return;
    }

    if (lastName.length < 1) {
      toast.error("Last name must be at least 1 character", { position: "top-center" });
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address", { position: "top-center" });
      return;
    }

    if (!validatePassword(password)) {
      toast.error(
        "Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters", { position: "top-center" }
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { position: "top-center" });
      return;
    }

    try {
      const signupData = {
        firstname: firstName.trim(),
        lastname: lastName.trim(),
        email: email.toLowerCase(),
        password
      };

      const response = await axios.post("http://localhost:7000/api/signup", signupData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true  // Add this to handle cookies
      });

      if (response.data) {
        // Store user data in Redux and localStorage
        const userData = {
          name: `${response.data.firstname} ${response.data.lastname}`,
          email: response.data.email,
        };

        dispatch(setUserInfo(userData));
        localStorage.setItem('userInfo', JSON.stringify(userData));

        toast.success("Signup successful!", { position: "top-center" });

        // Navigate after a short delay to allow the toast to be seen
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      console.error('Signup error details:', {
        message: error.response?.data?.message,
        status: error.response?.status,
        data: error.response?.data
      });
      setError(error.response?.data?.message || "An error occurred during signup");
      toast.error(error.response?.data?.message || "Signup failed", { position: "top-center" });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-side">
        <div className="auth-form-container">
          <ToastContainer />
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
              User Signup
            </Typography>
            {/* {error && <Typography color="error">{error}</Typography>} */}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                variant="outlined"
                margin="normal"
                value={formData.firstName}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#856c48" },
                    "&:hover fieldset": { borderColor: "#a2906d" },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                variant="outlined"
                margin="normal"
                value={formData.lastName}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#856c48" },
                    "&:hover fieldset": { borderColor: "#a2906d" },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                variant="outlined"
                margin="normal"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                type="password"
                variant="outlined"
                margin="normal"
                value={formData.password}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#856c48" },
                    "&:hover fieldset": { borderColor: "#a2906d" },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                variant="outlined"
                margin="normal"
                value={formData.confirmPassword}
                onChange={handleChange}
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
                Signup
              </Button>
              <Box mt={2}>
                <Link to="/login" className="auth-link">
                  <Typography variant="body2">
                    Already have an account? Login
                  </Typography>
                </Link>
              </Box>
            </form>
          </Paper>
        </div>
      </div>

      <div className="auth-side">
        <div className="advertisement">
          <Typography variant="h4" sx={{ mb: 3 }}>
            Join Our Community
          </Typography>
          <Typography variant="body1">
            Experience the best features and connect with like-minded people.
            Sign up now to get started!
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default UserSignUp;
