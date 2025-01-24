import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Grid, Paper } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; 
import { setUser } from '../../redux/slices/userSlice';
import {API_URL} from '../../Config'

const LoginPageWrapper = styled(Box)({
  backgroundImage: 'url("https://images.pexels.com/photos/7964513/pexels-photo-7964513.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  height: '100vh',
  width: '100vw',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: 0,
  padding: 0,
  position: 'absolute',
  top: 0,
  left: 0,
});


const PaperWrapper = styled(Paper)({
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
  maxWidth: '400px',
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
});

const Login = ({onLogin}) => {
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize Redux dispatch

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/users/login`,
        {
          loginValue,  // email or username
          password,
        }
      );
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token); // Store the token
        localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user data
        dispatch(setUser(response.data.user)); // Dispatch user data to Redux
        
        alert('Login successful!');
        onLogin(); // Update the app's login state
        navigate('/dashboard');
      } else {
        setErrorMessage('Invalid credentials or no token returned.');
      }
    } catch (error) {
      console.error('Error during login:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.error || 'Login failed.');
    }
  };

  return (
    <LoginPageWrapper>
      <PaperWrapper>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Login
        </Typography>
        <form noValidate onSubmit={handleLogin}>
          <TextField
            label="Email or Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={loginValue}
            onChange={(e) => setLoginValue(e.target.value)}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              marginTop: '16px',
              '&:hover': {
                backgroundColor: '#1976d2',
              },
            }}
          >
            Login
          </Button>
        </form>
        {errorMessage && (
          <Typography color="error" sx={{ marginTop: '10px', textAlign: 'center' }}>
            {errorMessage}
          </Typography>
        )}
          
      </PaperWrapper>
    </LoginPageWrapper>
  );
};

export default Login;
