import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  CircularProgress,
  Box,
} from '@mui/material';
import { useSelector } from 'react-redux';
import {API_URL} from '../Config'

const CreateTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state)=> state.user)
  
  // Fetch employees for the assignedTo field
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${API_URL}/employees/role`);
        
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const useridresponse = await axios.get(`${API_URL}/employees/userid/${assignedTo}`)
    const userid = useridresponse.data._id
    const newTask = {
      title,
      description,
      assignedTo,
      assignedToNotification : userid,
      assignedFrom:user._id,
      status: 'Pending',
      dueDate,
    };

    try {
      await axios.post(`${API_URL}/tasks`, newTask);
      setLoading(false);
      alert('Task created successfully!');
      // Reset form after submission
      setTitle('');
      setDescription('');
      setAssignedTo('');
      setDueDate('');
    } catch (error) {
      setLoading(false);
      console.error('Error creating task:', error);
      alert('Error creating task');
    }
  };

  return (
    <Container maxWidth="sm" style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom textAlign="center">
        Create New Task
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          label="Task Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <FormControl fullWidth>
          <InputLabel>Assigned To</InputLabel>
          <Select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            required
          >
            {employees.map((employee) => (
              <MenuItem key={employee._id} value={employee._id}>
                {employee.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Due Date"
          variant="outlined"
          fullWidth
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Task'}
        </Button>
      </Box>
    </Container>
  );
};

export default CreateTask;
