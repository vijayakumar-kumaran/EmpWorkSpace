import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  CircularProgress,
  IconButton
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import axios from 'axios';
import {API_URL} from '../Config'

const TaskManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);  // To store tasks created today
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch tasks when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksResponse = await axios.get(`${API_URL}/tasks/all`);
        setTasks(tasksResponse.data);
        setLoading(false);

        // Filter tasks created today
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to midnight
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); // Set to next day

        const todayTasks = tasksResponse.data.filter((task) => {
          const createdAt = new Date(task.createdAt);
          return createdAt >= today && createdAt < tomorrow;
        });
        setTodayTasks(todayTasks);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter tasks based on search query
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const result = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTasks(result);
    } else {
      setFilteredTasks([]);
    }
  }, [searchQuery, tasks]);

  // Categorize tasks by status
  const categorizedTasks = {
    new: tasks.filter((task) => task.status === 'New'),
    pending: tasks.filter((task) => task.status === 'Pending'),
    completed: tasks.filter((task) => task.status === 'Completed'),
  };

  const cardData = [
    {
      title: `New Tasks (Today: ${todayTasks.length})`,  // Show today's new task count
      icon: <AssignmentIcon style={{ fontSize: 50, color: 'white' }} />,
      backgroundColor: '#3f51b5', // Blue for new tasks
      tasks: categorizedTasks.new,
      route: '/new-tasks',
    },
    {
      title: 'Pending Tasks',
      icon: <AccessTimeIcon style={{ fontSize: 50, color: 'white' }} />,
      backgroundColor: '#FF9800', // Orange for pending
      tasks: categorizedTasks.pending,
      route: '/pending-tasks',
    },
    {
      title: 'Completed Tasks',
      icon: <CheckCircleIcon style={{ fontSize: 50, color: 'white' }} />,
      backgroundColor: '#4CAF50', // Green for completed
      tasks: categorizedTasks.completed,
      route: '/completed-tasks',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={2}>
        <Typography variant="h4" align="center" gutterBottom>
          Task Management
        </Typography>
      </Box>

      <Box mb={4}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search Tasks"
          label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      {loading ? (
        <CircularProgress style={{ display: 'block', margin: '0 auto' }} />
      ) : (
        <Grid container spacing={3}>
          {cardData.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                style={{ backgroundColor: card.backgroundColor, cursor: 'pointer' }}
                onClick={() => navigate(card.route)}
              >
                <CardContent>
                  <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                    <IconButton>{card.icon}</IconButton>
                    <Typography variant="h6" style={{ color: 'white' }}>
                      {card.title}
                    </Typography>
                    <Typography variant="body2" style={{ color: 'white' }}>
                      {card.tasks.length} tasks
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Display tasks if searchQuery length is greater than 2 */}
      {searchQuery.length >= 2 && !loading && filteredTasks.length > 0 && (
        <Grid container spacing={3}>
          {filteredTasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task._id}>
              <Card
                style={{ backgroundColor: '#e3f2fd', cursor: 'pointer' }}
                onClick={() => navigate(`/task-details/${task._id}`)}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{task.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {task.status}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default TaskManagement;
