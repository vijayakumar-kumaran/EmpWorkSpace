import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Button,
  Box,
} from "@mui/material";
import SignupModal from "../Authentications/SignupModal"; // Adjust the path based on your project structure
import SearchBar from "../../components/SearchBox"; // Ensure the path is correct
import EmployeeDetailsModal from "./EmployeeDetailsModal"; // Import the new modal
import { API_URL } from "../../Config";

const ShowAll = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [detailsModalOpen, setDetailsModalOpen] = useState(false); // State for employee details modal
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null); // Store the employee details for the modal

  useEffect(() => {
    // Fetch employees when component mounts
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${API_URL}/employees/all`);
        setEmployees(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleOpenModal = (employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEmployee(null);
    setModalOpen(false);
  };

  // Function to update employee's wsaccount status in the state after signup
  const updateEmployeeWsAccount = (updatedEmployee) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee._id === updatedEmployee._id
          ? { ...employee, wsaccount: true } // Update the specific employee's wsaccount
          : employee
      )
    );
  };

  // Filter employees based on the search query
  const filteredEmployees = employees.filter((employee) => {
    return (
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.designation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleOpenDetailsModal = (employee) => {
    setSelectedEmployeeDetails(employee); // Set employee details
    setDetailsModalOpen(true); // Open details modal
  };

  const handleCloseDetailsModal = () => {
    setSelectedEmployeeDetails(null);
    setDetailsModalOpen(false); // Close details modal
  };

  return (
    <div style={{ padding: "20px", maxWidth: "90%", margin: "auto" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Employee List
      </Typography>

      {/* Search Bar */}
      <Box mb={4}>
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </Box>

      {loading ? (
        <CircularProgress style={{ display: "block", margin: "0 auto" }} />
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table aria-label="employee table">
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Department</strong></TableCell>
                <TableCell><strong>Designation</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>See More...</strong></TableCell>
                <TableCell><strong>Work Account</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee._id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.designation}</TableCell>
                  <TableCell>{employee.status}</TableCell>
                  <TableCell>
                    <Link
                      href="#"
                      onClick={() => handleOpenDetailsModal(employee)} // Open the details modal on click
                      color="primary"
                      sx={{
                        textDecoration: "underline",
                        fontWeight: "bold",
                        cursor: "pointer",
                        "&:hover": {
                          color: "#1976d2", // Change to blue on hover
                        },
                      }}
                    >
                      See More
                    </Link>
                  </TableCell>
                  <TableCell>
                    {employee.wsaccount ? (
                      <Button variant="contained" color="secondary" disabled>
                        Created
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          padding: "4px 8px",
                          fontSize: "0.75rem",
                          minWidth: "auto",
                        }}
                        onClick={() => handleOpenModal(employee)}
                      >
                        Create Account
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Signup Modal */}
      {modalOpen && (
        <SignupModal
          open={modalOpen}  
          onClose={handleCloseModal}
          employeeDetails={selectedEmployee}
          onAccountCreated={updateEmployeeWsAccount} // Pass this prop to update employee's wsaccount
        />
      )}

      {/* Employee Details Modal */}
      {detailsModalOpen && (
        <EmployeeDetailsModal
          open={detailsModalOpen}
          onClose={handleCloseDetailsModal}
          employeeDetails={selectedEmployeeDetails} // Pass the selected employee details
        />
      )}
    </div>
  );
};

export default ShowAll;
