import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Card from '../components/Card'; 
import { cardIcons } from '../components/CardIcons';
import { useNavigate } from 'react-router-dom';
import {API_URL} from '../Config'

const EmployeeDashboard = () => {
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [tasksPending, setTasksPending] = useState(0);
  const [leaveBalance, setLeaveBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const tasksResponse = await axios.get(`${API_URL}/tasks/all`);
        const employeeResponse = await axios.get(`${API_URL}/employees/all`);
  
        const currentEmployee = employeeResponse.data.find(emp => emp.email === user.email);
        if (!currentEmployee) {
          console.error('No employee found for the current user.');
          setLoading(false);
          return;
        }
        const empid = currentEmployee._id;  
        const completedTasks = tasksResponse.data.filter(
          task => task.status === 'Completed' && task.assignedTo === empid
        ).length;
  
        const pendingTasks = tasksResponse.data.filter(task => task.status === 'Pending' && task.assignedTo === empid).length;
        const leaveResponse = await axios.get(`${API_URL}/leaves/employee/${empid}`);
        const leaveBalance = leaveResponse.data.filter(leave => leave.status === 'Approved').length;
  
        setTasksCompleted(completedTasks);
        setTasksPending(pendingTasks);
        setLeaveBalance(leaveBalance);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchEmployeeData();
  }, [user.email]);
  

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom textAlign="center" sx={{ fontWeight: 600 }}>
        Dashboard
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4} sx={{ marginTop: 4 }}>
          {/* Completed Tasks */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              title="Completed Tasks"
              value={tasksCompleted}
              bgColor="#4caf50"
              gradientColor="#66bb6a"
              icon={cardIcons.completed}
              onClick={() => navigate('/completed-tasks')}
              
            />
          </Grid>

          {/* Pending Tasks */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              title="Pending Tasks"
              value={tasksPending}
              bgColor="#ff9800"
              gradientColor="#ffb74d"
              icon={cardIcons.pending}
              onClick={() => navigate('/pending-tasks')}
            />
          </Grid>

          {/* Leave Balance */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              title="Leave Balance"
              value={leaveBalance}
              bgColor="#2196f3"
              gradientColor="#64b5f6"
              icon={cardIcons.leave}
              onClick={() => navigate('/leave-status')}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default EmployeeDashboard;
