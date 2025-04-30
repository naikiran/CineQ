import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  CircularProgress,
  Alert,
  Paper,
  useMediaQuery
} from '@mui/material';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too short!').required('Required'),
});

export default function Login() {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const LoginHandler = async (values) => {
    try {
      setLoading(true);
      setError('');
      
      const { data } = await axios.post(
        "http://localhost:4000/users/login",
        values
      );
      
      console.log("Login successful:", data.token); // Access the token from the response
      localStorage.setItem('token', data.token); // Store the token in local storage
      navigate('/'); // Redirect after successful login
      
    } catch (error) {
      console.log("Login error:", error);
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      flexDirection: isSmallScreen ? 'column' : 'row',
      background: 'linear-gradient(to right, #121212 50%, #1e1e1e 50%)'
    }}>
      {/* Left Side - Branding */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'url(/images/movie-bg.jpg)',
        backgroundSize: 'cover',
        minHeight: isSmallScreen ? '150px' : 'auto'
      }}>
        <Typography variant={isSmallScreen ? 'h5' : 'h3'} sx={{ 
          color: 'white', 
          fontWeight: 'bold',
          textAlign: 'center',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          Welcome to CineQ
        </Typography>
      </Box>

      {/* Right Side - Form */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: isSmallScreen ? 2 : 4
      }}>
        <Paper elevation={3} sx={{
          width: '100%',
          maxWidth: 400,
          p: isSmallScreen ? 2 : 4,
          bgcolor: '#1e1e1e'
        }}>
          <Typography variant={isSmallScreen ? 'h5' : 'h4'} 
            gutterBottom sx={{ color: 'white', textAlign: 'center' }}>
            Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={LoginHandler}
          >
            {({ errors, touched }) => (
              <Form>
                <Field
                  as={TextField}
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ mb: 2, input: { color: 'white' } }}
                  InputLabelProps={{ style: { color: 'white' } }}
                />

                <Field
                  as={TextField}
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.email && errors.email}
                  sx={{ mb: 2, input: { color: 'white' } }}
                  InputLabelProps={{ style: { color: 'white' } }}
                />

                <Field
                  as={TextField}
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ mb: 2, input: { color: 'white' } }}
                  InputLabelProps={{ style: { color: 'white' } }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  sx={{ mb: 2, height: 45 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Sign In'}
                </Button>

                <Typography variant="body2" sx={{ color: 'white', textAlign: 'center' }}>
                  Don't have an account?{' '}
                  <Link href="/signup" sx={{ color: '#1976d2', cursor: 'pointer' }}>
                    Sign Up
                  </Link>
                </Typography>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    </Box>
  );
}