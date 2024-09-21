import React, { useState } from 'react';
import { Button, TextField, Container, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import User from '../models/user';
import {api, handleError} from '../helpers/api';

function RegisterForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alertStatus, setAlertStatus] = useState(false);
    const [validCredentials, setValidCredentials] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const checkValid = () => {
      // check valid email
      if (!email.includes('@') || !email.includes('.') || email.length < 5) {
          setValidCredentials(false);
      }
      // check valid password
      else if (password.length < 5 ) {
          setValidCredentials(false);
      }
      else {
          setValidCredentials(true);
      }
    }

  const Register = async (e) => {
    try {
      const requestBody = JSON.stringify({email, password});
      const response = await api(false, false).post('/users/create', requestBody);

      // Get the returned user and update a new object.
      const user = new user(response.data);

      // Store the token into the local storage.
      sessionStorage.setItem('username', user.username);
    console.log('Login:', { email, password });
    navigate("/home");
    } catch (error) {
    raiseError(error.response.data.message);
    }
  };
  const raiseError = (error) => {
    setAlertStatus(true);
    setErrorMessage(error)
    
}

  return (
    <Container maxWidth="sm" style={styles.container}>
      <Box component="h4" sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
      Login
      </Box>
      <form onSubmit={Register} style={styles.form}>
        <div style={styles.inputContainer}>
          <TextField
            fullWidth
            id="email"
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => {setEmail(e.target.value);
              checkValid();}
          }
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
            onChange={(e) => {setPassword(e.target.value);
              checkValid();}
            }
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
            Login
          </Button>
          <Link to="/register">
          <Button
            variant="outlined"
            color="secondary" 
          >
            Go to Register
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
