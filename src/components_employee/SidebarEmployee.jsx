import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemText,
  ListItemButton,
  Collapse,
  Divider,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TaskIcon from '@mui/icons-material/Assignment';
import ViewListIcon from '@mui/icons-material/ViewList';
import WorkIcon from '@mui/icons-material/Work';
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector } from 'react-redux';
const EmployeeSidebar = () => {
  const [openTask, setOpenTask] = useState(false);
  const [openLeave, setOpenLeave] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(true);
  const user = useSelector((state)=> state.user)
  const handleClickTask = () => {
    setOpenTask((prev) => !prev);
  };

  const handleClickLeave = () => {
    setOpenLeave((prev) => !prev);
  };

  const toggleSidebar = () => {
    setOpenSidebar((prev) => !prev);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar toggle button */}
      <IconButton
        onClick={toggleSidebar}
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 1000,
          color: '#fff',
          display: openSidebar ? 'none' : 'block',
        }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        sx={{
          width: openSidebar ? 280 : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: openSidebar ? 280 : 0,
            boxSizing: 'border-box',
            padding: '20px',
            background: 'linear-gradient(180deg, rgb(65, 56, 74), rgb(49, 52, 59))',
            color: '#fff',
            border: 'none',
            boxShadow: '2px 0px 10px rgba(0, 0, 0, 0.2)',
            transition: 'width 0.3s ease-in-out',
          },
        }}
        variant="permanent"
        anchor="left"
        open={openSidebar}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', ml: 2, mb: 3 }}>
          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold' }}>
            Hi! {user.username}
          </Typography>
        </Box>
        <Divider sx={{ my: 1, borderColor: '#fff' }} />

        <List>
          {/* Dashboard Link */}
          <ListItemButton
            component={Link}
            to="/"
            sx={{
              color: '#fff',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
              },
              paddingLeft: '15px',
              borderRadius: '8px',
              marginBottom: '10px',
            }}
          >
            <DashboardIcon sx={{ mr: 2, color: '#00e676' }} />
            <ListItemText primary="Dashboard" />
          </ListItemButton>
          <Divider sx={{ my: 1, borderColor: '#fff' }} />

          {/* Task Section */}
          <ListItemButton
            onClick={handleClickTask}
            sx={{
              color: '#fff',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
              },
              paddingLeft: '15px',
              borderRadius: '8px',
              marginBottom: '10px',
            }}
          >
            <TaskIcon sx={{ mr: 2, color: '#4caf50' }} />
            <ListItemText primary="Tasks" />
            <ArrowDropDownIcon sx={{ color: '#fff' }} />
          </ListItemButton>
          <Collapse in={openTask} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                component={Link}
                to="/task-management"
                sx={{
                  pl: 4,
                  color: '#fff',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                  },
                  borderRadius: '8px',
                }}
              >
                <ViewListIcon sx={{ mr: 2, color: '#3f51b5' }} />
                <ListItemText primary="View Tasks" />
              </ListItemButton>
            </List>
          </Collapse>
          <Divider sx={{ my: 1, borderColor: '#fff' }} />

          {/* Leave Section */}
          <ListItemButton
            onClick={handleClickLeave}
            sx={{
              color: '#fff',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
              },
              paddingLeft: '15px',
              borderRadius: '8px',
              marginBottom: '10px',
            }}
          >
            <WorkIcon sx={{ mr: 2, color: '#ff5722' }} />
            <ListItemText primary="Leaves" />
            <ArrowDropDownIcon sx={{ color: '#fff' }} />
          </ListItemButton>
          <Collapse in={openLeave} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                component={Link}
                to="/leave-management"
                sx={{
                  pl: 4,
                  color: '#fff',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                  },
                  borderRadius: '8px',
                }}
              >
                <ViewListIcon sx={{ mr: 2, color: '#009688' }} />
                <ListItemText primary="Leave Management" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Drawer>
    </Box>
  );
};

export default EmployeeSidebar;
