import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/Login';
import BillingPage from './components/BillingPage';
import KitchenView from './components/KitchenView';

const theme = createTheme();

// Define users with roles
const users = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'employee', password: 'emp123', role: 'employee' },
  { username: 'kitchen', password: 'kitchen123', role: 'kitchen' },
];

function App() {
  const [user, setUser] = useState(null);

  // Check localStorage for an existing session
  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse and set the user
    }
  }, []);

  const handleLogin = (username, password) => {
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('loggedInUser', JSON.stringify(foundUser)); // Store user in localStorage
    } else {
      alert('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('loggedInUser'); // Clear localStorage on logout
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        {user ? (
          user.role === 'kitchen' ? (
            <KitchenView user={user} onLogout={handleLogout} />
          ) : (
            <BillingPage user={user} onLogout={handleLogout} />
          )
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
