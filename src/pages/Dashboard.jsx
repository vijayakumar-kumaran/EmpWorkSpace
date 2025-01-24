import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Card from '../components/Card';
import { cardIcons } from '../components/CardIcons';
import EmployeePerformanceChart from '../components/Charts/EmployeePerformanceChart';
import MonthlyTaskReportChart from '../components/Charts/MonthlyTaskReportChart';
import { API_URL } from '../Config';

  const Dashboard = () => {
    const [data, setData] = useState({
      totalEmployees: 0,
      completedTasks: 0,
      pendingTasks: 0,
      avgTaskCompletionTime: 0,
      monthlyTaskReport: {
        completed: 0,
        pending: 0,
      },
      performanceData: {
        withinDueDate: 0,
        overDueDate: 0,
      },
    });
    

    const user = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchData = async () => {
        try {
          const [employeesRes, tasksRes] = await Promise.all([
            axios.get(`${API_URL}/employees/all`),
            axios.get(`${API_URL}/tasks/all`),
          ]);
    
          const totalEmployees = employeesRes.data.length;
    
          const completedTasks = tasksRes.data.filter(
            (task) => task.status === 'Completed'
          );
          const completedWithinDueDate = completedTasks.filter(
            (task) => new Date(task.updatedAt) <= new Date(task.dueDate)
          ).length;
          const completedOverDueDate = completedTasks.length - completedWithinDueDate;
    
          const avgTaskCompletionTime =
            completedTasks.reduce((total, task) => {
              const completionTime =
                new Date(task.updatedAt) - new Date(task.dueDate);
              return total + Math.max(0, completionTime / (1000 * 60 * 60 * 24)); // Convert ms to days
            }, 0) / completedTasks.length || 0;
    
          // Get current month and year
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
    
          setData({
            totalEmployees,
            completedTasks: completedTasks.length,
            pendingTasks: tasksRes.data.filter((task) => task.status === 'Pending')
              .length,
            avgTaskCompletionTime: avgTaskCompletionTime.toFixed(2),
            monthlyTaskReport: {
              completed: tasksRes.data.filter(
                (task) =>
                  new Date(task.createdAt).getMonth() === currentMonth &&
                  new Date(task.createdAt).getFullYear() === currentYear &&
                  task.status === 'Completed'
              ).length,
              pending: tasksRes.data.filter(
                (task) =>
                  new Date(task.createdAt).getMonth() === currentMonth &&
                  new Date(task.createdAt).getFullYear() === currentYear &&
                  task.status === 'Pending'
              ).length,
            },
            performanceData: {
              withinDueDate: completedWithinDueDate,
              overDueDate: completedOverDueDate,
            },
          });
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
      };
    
      fetchData();
    }, []);

    const cardsData = [
      {
        title: 'Completed Tasks',
        value: data.completedTasks,
        bgColor: '#4caf50',
        icon:cardIcons.completed,
        gradientColor: '#81c784',
        onClick: () => {
          navigate('/completed-tasks')
        },
      },
      {
        title: 'Pending Tasks',
        value: data.pendingTasks,
        bgColor: '#f57c00',
        icon:cardIcons.pending,
        gradientColor: '#ffb74d',
        onClick: () => {
          navigate('/pending-tasks')
        },
      },
      {
        title: 'Total Employees',
        value: data.totalEmployees,
        icon:cardIcons.person,
        bgColor: '#2196f3',
        gradientColor: '#64b5f6',
        onClick: () => {
          navigate('/show-all')
        },
      },
    ];

    return (
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Typography variant="h4" gutterBottom textAlign="center" sx={{ fontWeight: 600 }}>
          Dashboard
        </Typography>

        {/* Metrics Section */}
        <Grid container spacing={3}>
          {cardsData.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card {...card} />
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={4} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
          <EmployeePerformanceChart
              avgTaskCompletionTime={data.avgTaskCompletionTime}
              performanceData={data.performanceData}
            />       
          </Grid>
          <Grid item xs={12} md={6}>
            <MonthlyTaskReportChart monthlyTaskReport={data.monthlyTaskReport} />
          </Grid>
        </Grid>
      </Box>
    );
  };

  export default Dashboard;
