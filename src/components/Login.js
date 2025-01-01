import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  CssBaseline,
  Box,
  Avatar,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [error, setError] = useState("");

  const handleToggle = (event, newAlignment) => {
    setIsOwner(newAlignment === "owner");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
  
    const loginSuccess = await onLogin(username, password, isOwner);
  
    if (!loginSuccess) {
      setError("Invalid username or password.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Owner Toggle */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 2,
              mb: 2,
            }}
          >
            <ToggleButtonGroup
              value={isOwner ? "owner" : "employee"}
              exclusive
              onChange={handleToggle}
              color="primary"
            >
              <ToggleButton value="employee">Employee</ToggleButton>
              <ToggleButton value="owner">Owner</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
