import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Login from "./components/Login";
import BillingPage from "./components/BillingPage";
import KitchenView from "./components/KitchenView";

// Define theme
const theme = createTheme();

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

// Define dummy users with roles (includes owner role)
const users = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "employee", password: "emp123", role: "employee" },
  { username: "kitchen", password: "kitchen123", role: "kitchen" },
  { username: "owner", password: "owner123", role: "owner" }, // Owner role
];

function App() {
  const [user, setUser] = useState(null);

  // Check localStorage for an existing session
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse and set the user
    }
  }, []);

  // Handle login logic
  const handleLogin = (username, password, isOwner) => {
    // Determine the API endpoint based on the toggle selection
    const apiUrl = isOwner
      ? `${apiBaseUrl}/Client/GetClient/${username.trim()}`
      : `${apiBaseUrl}/Employee/${username.trim()}`;
  
    return fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Invalid username or password.");
        }
        return response.json();
      })
      .then((data) => {
        // Extract API's username and password
        const apiUsername = isOwner ? data.userid : data.userId;
        const apiPassword = data.password;
  
        // Compare API credentials with user input
        if (apiUsername === username && apiPassword === password) {
          // Save user details in state and localStorage
          const user = {
            id: data.id,
            name: data.name,
            role : isOwner
              ? "owner"
              : data.employeeTypeId === 1
              ? "admin"
              : data.employeeTypeId === 2
              ? "employee"
              : data.employeeTypeId === 3
              ? "kitchen"
              : "unknown",
            restaurantName: isOwner ? data.restaurantName : null,
            employeeTypeId: !isOwner ? data.employeeTypeId : null,
          };
          setUser(user);
          localStorage.setItem("loggedInUser", JSON.stringify(user));
          return true; // Login successful
        } else {
          throw new Error("Invalid username or password.");
        }
      })
      .catch((error) => {
        console.error("An error occurred during login:", error.message);
        return false; // Login failed
      });
  };  
  
  

  // Handle logout logic
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("loggedInUser"); // Clear localStorage on logout
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        {user ? (
          user.role === "kitchen" ? (
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
