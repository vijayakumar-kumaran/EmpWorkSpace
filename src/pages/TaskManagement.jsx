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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import axios from 'axios';
import {API_URL} from '../Config'

const TaskManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [employees, setEmployees] = useState({});
  const navigate = useNavigate();

  // Fetch tasks and employees when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksResponse = await axios.get(`${API_URL}/tasks/all`);
        const employeesResponse = await axios.get(`${API_URL}/employees/all`);
        
        // Set tasks data
        setTasks(tasksResponse.data);
        
        // Set employees data
        const employeeData = employeesResponse.data.reduce((acc, employee) => {
          acc[employee._id] = employee; // Store employees by their ID
          return acc;
        }, {});
        setEmployees(employeeData);
        
        setLoading(false);
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

  // Open modal with task details
  const handleOpenModal = (task) => {
    setSelectedTask(task);
    setOpenModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTask(null);
  };

  // Get employee name by ID
  const getEmployeeName = (id) => {
    if (employees[id]) {
      return employees[id].name; // Return employee name based on ID
    }
    return 'Unknown'; // Return 'Unknown' if employee is not found
  };

  const cardData = [
    {
      title: 'Show All Tasks',
      icon: <AssignmentIcon style={{ fontSize: 50, color: 'white' }} />,
      backgroundColor: '#3f51b5',
      route: '/Show-all-tasks',
    },
    {
      title: 'Edit a Task',
      icon: <EditIcon style={{ fontSize: 50, color: 'white' }} />,
      backgroundColor: '#f44336',
      route: '/update-task',
    },
    {
      title: 'Pending Tasks',
      icon: <AccessTimeIcon style={{ fontSize: 50, color: 'white' }} />,
      backgroundColor: '#FF9800', // Orange for pending
      route: '/pending-tasks',
    },
    {
      title: 'Completed Tasks',
      icon: <CheckCircleIcon style={{ fontSize: 50, color: 'white' }} />,
      backgroundColor: '#4CAF50', // Green for completed
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

      {/* Show cards if searchQuery is empty or less than 2 characters */}
      {searchQuery.length < 2 ? (
        <Grid container spacing={3}>
          {cardData.map((card, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
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
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : loading ? (
        <CircularProgress style={{ display: 'block', margin: '0 auto' }} />
      ) : (
        // Show tasks matching the search query (if search length >= 2)
        <Grid container spacing={3}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <Grid item xs={12} sm={6} md={6} key={task._id}>
                <Card
                  style={{ backgroundColor: '#e3f2fd', cursor: 'pointer' }}
                  onClick={() => handleOpenModal(task)}
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
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="h6" align="center">
                No results found.
              </Typography>
            </Grid>
          )}
        </Grid>
      )}

      {/* Modal for Task Details */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>Task Details</DialogTitle>
        <DialogContent>
          {selectedTask && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Field</strong></TableCell>
                    <TableCell><strong>Details</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell><strong>Title</strong></TableCell>
                    <TableCell>{selectedTask.title}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Description</strong></TableCell>
                    <TableCell>{selectedTask.description}</TableCell>
                  </TableRow>
                  <TableRow>
                  <TableCell><strong>Assigned To</strong></TableCell>
                    <TableCell style={{ color: '#1E90FF', fontWeight: 'bold' }}>
                      {getEmployeeName(selectedTask.assignedTo)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell
                    style={{
                      fontWeight: 'bold',
                      color:
                        selectedTask.status === 'Pending'
                          ? '#FFA500' // Orange for pending
                          : selectedTask.status === 'Progress'
                          ? '#1E90FF' // Blue for in progress
                          : '#32CD32', // Green for completed
                    }}
                  >
                    {selectedTask.status}
                  </TableCell>
                </TableRow>
                <TableRow>
                <TableCell><strong>Due Date</strong></TableCell>
                <TableCell>
                  {new Date(selectedTask.dueDate).toLocaleDateString()}{' '}
                  {new Date(selectedTask.dueDate) < new Date() ? (
                    <span style={{ color: 'red', fontWeight: 'bold' }}>Expired</span>
                  ) : (
                    ''
                  )}
                </TableCell>
              </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TaskManagement;
