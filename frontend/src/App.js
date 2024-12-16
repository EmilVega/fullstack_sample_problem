import React, { useState } from 'react';
import SignIn from './SignIn';  // Import the SignIn component
import DataVisualization from './DataVisualization';  // Import the DataVisualization component
import Button from '@mui/material/Button';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track the authentication status
  const [role, setRole] = useState('none'); // Track the authentication status

  // Function to handle successful login
  const handleLoginSuccess = (role) => {
    setIsAuthenticated(true); // Mark the user as authenticated
    console.log('role user', role);  // Print the role of the user
    setRole(role); // Set the role of user
  };

  // Function to handle logout and call the logout endpoint
  const handleLogout = async () => {
    try {
      // Make a fetch request to the logout endpoint
      const response = await fetch('/api/logout', {
        method: 'GET',  
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies if needed
      });

      if (response.ok) {
        setIsAuthenticated(false); // Mark the user as logged out
        setRole('none');  // Optionally reset the role
        console.log('Logged out successfully');
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="App">
      {!isAuthenticated ? (
        <SignIn onLoginSuccess={handleLoginSuccess} />  // Pass handleLoginSuccess to SignIn component
      ) : (
        <div className='logoutbutton'>
          <Button variant="contained" color="primary" onClick={handleLogout}>
            Logout
          </Button>
          <DataVisualization role={role} />  {/* Pass the role to DataVisualization */}
        </div>
      )}
    </div>
  );
}

export default App;