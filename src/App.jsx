import React, { useState, useEffect, Suspense } from 'react';
import { CssBaseline, ThemeProvider, Box } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import {API_URL} from './Config';

// Components
import theme from './theme/theme';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import EmployeeSidebar from './components_employee/SidebarEmployee';

//Admin Role Pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Employees = React.lazy(() => import('./pages/EmployeeAddPage'));
const EmployeeManagement = React.lazy(() => import('./pages/EmployeeManagement'));
const ShowAll = React.lazy(() => import('./pages/Employee/ShowAll'));
const EditEmployee = React.lazy(() => import('./pages/Employee/EditEmployee'));
const LeaveTrack = React.lazy(() => import('./pages/leaves/leaveDetails'));
const StatusCheck = React.lazy(() => import('./pages/Employee/EmployeeStatus'));
const GrandLeave = React.lazy(() => import('./pages/leaves/grandLeave'));
const CreateTask = React.lazy(() => import('./pages/TaskAddPage'));
const TaskManagement = React.lazy(() => import('./pages/TaskManagement'));
const ShowAllTasks = React.lazy(() => import('./pages/Tasks/ShowAllTasks'));
const PendingTasks = React.lazy(() => import('./pages/Tasks/pendingTasks'));
const CompltedTaks = React.lazy(() => import('./pages/Tasks/CompletedTasks'));
const UpdateTask = React.lazy(() => import('./pages/Tasks/EditTask'));
const Profile = React.lazy(() => import('./components/Profile'));

//Authentication
const Login = React.lazy(() => import('./pages/Authentications/Login'));

//Employee Role Pages
const DashboardEmployee = React.lazy(() => import('./pages_employee/DashboardEmployee'));
const TaskManagementEmployee = React.lazy(() => import('./pages_employee/TaskManagementEmployee'));
const NewTasks = React.lazy(() => import('./pages_employee/Tasks/NewTasks'));
const ReqLeave = React.lazy(() => import('./pages_employee/Leaves/reqLeave'));
const LeaveManagement = React.lazy(() => import('./pages_employee/LeaveManagement'));
const CheckLeaveStatus = React.lazy(() => import('./pages_employee/Leaves/checkLeaveStatus'));
const PendingTasksEmp = React.lazy(()=> import('./pages_employee/Tasks/PendingTaks'));
const CompletedTasks = React.lazy(() => import('./pages_employee/Tasks/CompletedTasks'));

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { setUser, clearUser } from './redux/slices/userSlice';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    const userData = localStorage.getItem('user');

    if (loggedInStatus === 'true' && userData) {
      setIsLoggedIn(true);
      dispatch(setUser(JSON.parse(userData)));
    }
  }, [dispatch]);
  
 
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    dispatch(clearUser());
  };

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {isLoggedIn && <Navbar onLogout={handleLogout} />}
        <div style={{ display: 'flex' }}>
          {isLoggedIn && user?.role === 'admin' && <Sidebar />}
          {isLoggedIn && user?.role === 'employee' && <EmployeeSidebar />}

          <Box sx={{ flexGrow: 1, padding: 2 }}>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route
                  path="/login"
                  element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/" />}
                />

                {isLoggedIn ? (
                  <>
                    {user?.role === 'admin' && (
                      <>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/create-employee" element={<Employees />} />
                        <Route path="/employee-management" element={<EmployeeManagement />} />
                        <Route path="/show-all" element={<ShowAll />} />
                        <Route path="/edit" element={<EditEmployee />} />
                        <Route path="/status" element={<StatusCheck />} />
                        <Route path="/grand-leave" element={<GrandLeave />} />
                        <Route path="/leave-track" element={<LeaveTrack />} />
                        <Route path="/create-task" element={<CreateTask />} />
                        <Route path="/task-management" element={<TaskManagement />} />
                        <Route path="/show-all-tasks" element={<ShowAllTasks />} />
                        <Route path="/pending-tasks" element={<PendingTasks />} />
                        <Route path="/completed-tasks" element={<CompltedTaks />} />
                        <Route path="/update-task" element={<UpdateTask />} />
                        <Route path="/profile" element={<Profile />} />
                      </>
                    )}

                    {user?.role === 'employee' && (
                      <>
                        <Route path="/" element={<DashboardEmployee />} />
                        <Route path="/task-management" element={<TaskManagementEmployee />} />
                        <Route path="/new-tasks" element={<NewTasks />} />
                        <Route path="/leave-management" element={<LeaveManagement />} />
                        <Route path="/req-leave" element={<ReqLeave />} />
                        <Route path="/leave-status" element={<CheckLeaveStatus />} />
                        <Route path="/pending-tasks" element={<PendingTasksEmp />} />
                        <Route path="/completed-tasks" element={<CompletedTasks />} />
                        <Route path="/profile" element={<Profile />} />
                      </>
                    )}
                  </>
                ) : (
                  <Route path="*" element={<Navigate to="/login" />} />
                )}
              </Routes>
            </Suspense>
          </Box>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
