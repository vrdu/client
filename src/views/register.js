import React, { useState } from 'react';
import { Button, TextField, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function RegisterForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Registering:', { username, password });
    alert(`User ${username} registered!`);
  };

  return (
    <Container maxWidth="sm" style={styles.container}>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleRegister} style={styles.form}>
        <div style={styles.inputContainer}>
          <TextField
            fullWidth
            id="username"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            sx={{
              label: {
                color: 'text.primary',  // Apply text color to the label
              }
            }}
          />
        </div>
        <div style={styles.inputContainer}>
          <TextField
            fullWidth
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{
              label: {
                color: 'text.primary',  // Apply text color to the label
              }
            }}
          />
        </div>
        <div style={styles.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
          >
            Register
          </Button>
          <Link to="/login">
          <Button
            variant="outlined"
            color="secondary" 
          >
            Go to Login
          </Button>
          </Link>
        </div>
      </form>
    </Container>
  );
}

const styles = {
  container: {
    marginTop: '50px',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'background',
    textAlign: 'center',
    textcolor: "text.primary",
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15  px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '100px',
    marginTop: '20px',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
};

export default RegisterForm;
