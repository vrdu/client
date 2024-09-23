import React, { useState } from 'react';
import { Button, TextField, Container, Box, Alert, AlertTitle } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import User from '../models/user';
import {api } from '../helpers/api';


function RegisterForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validCredentials, setValidCredentials] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState(false);

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
    e.preventDefault(); 
    checkValid();
    if (validCredentials === false) {
      raiseError("Invalid email or password")
    }
    else{
      try {
        const requestBody = JSON.stringify({email, password});
        const response = await api(false).post('/users/create', requestBody,{
          withCredentials: true
        });
        // Get the returned user and update a new object.
        const user = new User(response.data);
        console.log("made it")
        // Store the token into the local storage.
        sessionStorage.setItem('username', user.username);
      navigate("/home");
      } catch (error) {
      raiseError(error.response.data.detail);
      }
    }
    
  };
  const raiseError = (error) => {
    console.log("error:")
    console.log(error);
    setAlertStatus(true);
    setErrorMessage(error)
    
  }
  const handleClose = () => {
    setAlertStatus(false);
}

  return (
    <Container maxWidth="sm" style={styles.container}>
      <Box component="h4" sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
      Register
      </Box>
      <form onSubmit={Register} style={styles.form}>
        <div style={styles.inputContainer}>
          <TextField
            fullWidth
            id="email"
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => {setEmail(e.target.value)}
            }
            required
            sx={{
              label: {
                color: 'text.primary',  
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
            onChange={(e) => {setPassword(e.target.value)}
            }
            required
            sx={{
              label: {
                color: 'text.primary', 
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
        <div className="register popup-message">
                {alertStatus && (
                    <Alert severity="error"
                           onClose={handleClose}>
                        <AlertTitle>Registration Failed - <strong>{errorMessage}</strong></AlertTitle> 
                        
                    </Alert>
                )}
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
