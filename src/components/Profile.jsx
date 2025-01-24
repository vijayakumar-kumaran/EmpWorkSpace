import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from 'react-router-dom';
import {API_URL} from '../Config'

const Profile = () => {
  const user = useSelector((state) => state.user); // Get current user data from Redux
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState({
  
    username: user.username,
    email: user.email,
    phoneNumber: user.phoneNumber,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleSave = async () => {
    if (
      profileData.newPassword &&
      profileData.newPassword !== profileData.confirmPassword
    ) {
      alert('New Password and Confirm Password must match!');
      return;
    }
  
    try {
      const response = await axios.put(`${API_URL}/users/update-profile`, {
        userId: user._id,
        username: profileData.username,
        email: profileData.email,
        phoneNumber: profileData.phoneNumber,
        currentPassword: profileData.currentPassword,
        newPassword: profileData.newPassword,
      });
  
      if (response.status === 200) {
        alert('Profile updated successfully!');
        navigate('/')
        // Update Redux state or local state if needed
      }
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Failed to update profile.');
    }
  };
  

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        
        padding: 3,
      }}
    >
      <Card sx={{ maxWidth: 600, width: '100%', borderRadius: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: '#3f51b5',
                fontSize: 32,
              }}
            >
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
          </Box>

          <Typography
            variant="h5"
            sx={{ textAlign: 'center', fontWeight: 'bold', mb: 3 }}
          >
            {editMode ? 'Edit Profile' : 'Your Profile'}
          </Typography>
          
          <Typography
            variant="h5"
            sx={{ textAlign: 'center', fontWeight: 'bold', mb: 3 }}
          >
            User Name : {profileData.username}
          </Typography>
          <Grid container spacing={2}>
            

            {/* Email */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                disabled={!editMode}
                InputProps={{
                  readOnly: !editMode,
                }}
              />
            </Grid>

            {/* Phone Number */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={profileData.phoneNumber}
                onChange={handleInputChange}
                disabled={!editMode}
                InputProps={{
                  readOnly: !editMode,
                }}
              />
            </Grid>

            {/* Password Section */}
            {editMode && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Current Password"
                    name="currentPassword"
                    autoComplete='new-password'
                    value={profileData.currentPassword}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="password"
                    label="New Password"
                    name="newPassword"
                    value={profileData.newPassword}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Confirm Password"
                    name="confirmPassword"
                    value={profileData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </Grid>
              </>
            )}
          </Grid>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 4,
              gap: 2,
            }}
          >
            {editMode ? (
              <Button
                variant="contained"
                color="success"
                startIcon={<SaveIcon />}
                onClick={handleSave}
              >
                Save
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={toggleEditMode}
              >
                Edit Profile
              </Button>
            )}

            {editMode && (
              <Button
                variant="outlined"
                color="error"
                onClick={toggleEditMode}
              >
                Cancel
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: '100%' }}
        >
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
