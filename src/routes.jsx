import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmployeeAddPage from './pages/EmployeeAddPage';  // Import your Employee Add Page component

const Routes = ()=> {
  return (
    <Router>
      <Routes>
        <Route path="/add-employee" element={<EmployeeAddPage />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default Routes;