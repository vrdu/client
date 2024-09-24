import React, { useState } from 'react';
import { Button, TextField, Container, Box, Alert, AlertTitle } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import User from '../models/user';
import {api } from '../helpers/api';
import '../styling/register.css';

function LoginForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alertStatus, setAlertStatus] = useState(false);
    const [validCredentials, setValidCredentials] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    const checkValid = () => {
      // check valid email
      if (!email.includes('@') || !email.includes('.') || email.length < 2) {
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

  const Login = async (e) => {
    e.preventDefault(); 
    checkValid();
    if (validCredentials === false) {
      raiseError("Invalid email or password")
    }
    else{
      try {
        console.log("here")
        const requestBody = JSON.stringify({email, password});
        const response = await api(false).post('/users/login', requestBody,{
          withCredentials: true
        });
        console.log("response:")
        console.log(response)
        // Get the returned user and update a new object.
        const user = new User(response.data);
        console.log("made it")
        // Store the token into the local storage.
        sessionStorage.setItem('username', user.username);
      console.log('Register:', { email, password });
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
    <div className="container">
    <Container maxWidth="sm" >
      <Box component="h4" sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
      Login
      </Box>
      <form onSubmit={Login} className="form">
      <div className="inputContainer">  
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
        <div className="inputContainer">
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
        <div className="buttonContainer">
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
        <div className="register popup-message">
                {alertStatus && (
                    <Alert severity="error"
                           onClose={handleClose}>
                        <AlertTitle>Login Failed - <strong>{errorMessage}</strong></AlertTitle> 
                    </Alert>
                )}
            </div>
      </form>
    </Container>
    </div>
  );
}



export default LoginForm;
