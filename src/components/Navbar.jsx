import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Popover,
  Tooltip, 
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/ExitToApp';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsPanel from './NotficationPanel';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Array of colors for A-Z
const letterColors = [
  '#FF5733', '#FF8D1A', '#FFC300', '#DAF7A6', '#8CFF33', '#33FF57', '#33FF8C', 
  '#33FFFF', '#338CFF', '#5733FF', '#8C33FF', '#FF33D4', '#FF339E', '#FF1A8C', 
  '#FF3376', '#F1F0F0', '#B0F1F1', '#FF5733', '#FFE133', '#F3FF33', '#33B2FF', 
  '#3380FF', '#FF3380', '#DA33FF', '#8C33FF', '#7A33FF', '#33FF76', '#1B6B00', 
  '#0DFF93', '#FF1A1A', '#33FF5C', '#FF33A2', '#FF1C9B', '#8CFF9F', '#3FFF61'
];

const getLetterColor = (letter) => {
  const index = letter.toUpperCase().charCodeAt(0) - 65; // Get the index (0-25) for A-Z
  return letterColors[index % letterColors.length]; // Use modulo to loop over the colors array if the index is greater than 25
};

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  // Assuming the user data is in the Redux store
  const user = useSelector((state) => state.user); // Modify based on your actual user store data
  const userName = user?.username || 'User'; // Default name if no user data
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isLoggedIn');
    if (onLogout) onLogout();
    navigate('/login');
  };

  const handleNavigate = () => {
    navigate('/profile');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // Extract the first letter of the user's name
  const firstLetter = userName.charAt(0).toUpperCase();
  const letterColor = getLetterColor(firstLetter); // Get the color for the first letter

  return (
    <AppBar
      position="sticky"
      sx={{ backgroundColor: '#333', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
         
        </Box>

        {/* Profile, Notification, and Logout */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Home Icon */}
          <Tooltip title="Home" placement="bottom">
            <IconButton
              onClick={handleHomeClick}
              sx={{ color: '#fff', marginRight: 2, '&:hover': { backgroundColor: '#444' } }}
            >
              <HomeIcon />
            </IconButton>
          </Tooltip>

          {/* Notification Icon */}
          <Tooltip title="Notifications" placement="bottom">
            <IconButton
              onClick={handleNotificationClick}
              sx={{ color: '#fff', marginRight: 2, '&:hover': { backgroundColor: '#444' } }}
            >
              <NotificationsIcon />
            </IconButton>
          </Tooltip>

          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleNotificationClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <NotificationsPanel
              onClick={() => navigate('/notifications')}
            />
          </Popover>

          {/* Avatar Icon */}
          <Tooltip title="Profile" placement="bottom">
            <IconButton
              onClick={handleNavigate}
              sx={{ color: '#fff', marginRight: 2, '&:hover': { backgroundColor: '#444' } }}
            >
              <Avatar sx={{ width: 30, height: 30, backgroundColor: letterColor }}>
                {firstLetter}
              </Avatar>
            </IconButton>
          </Tooltip>

          {/* Logout Icon */}
          <Tooltip title="Logout" placement="bottom">
            <IconButton
              onClick={handleLogout}
              sx={{
                color: '#fff',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
