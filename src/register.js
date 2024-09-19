import { hover } from '@testing-library/user-event/dist/hover';
import React, { useState } from 'react';
import { night } from './index.css';

function RegisterForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    // Here you would typically send the username and password to your backend for registration.
    console.log('Registering:', { username, password });
    alert(`User ${username} registered!`);
  };

  const handleLogin = () => {
    // This would navigate to your login page or trigger login logic
    onLogin();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Register</h2>
      <form onSubmit={handleRegister} style={styles.form}>
        <div style={styles.inputContainer}>
          <label htmlFor="username" style={styles.label}>Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <label htmlFor="password" style={styles.label}>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.buttonContainer}>
          <button type="submit" style={styles.registerButton}>Register</button>
          <button type="button" onClick={handleLogin} style={styles.loginButton}>Go to Login</button>
        </div>
      </form>
    </div>
  );
  
}
const styles = {
  container: {
    width: '350px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: night,
    textAlign: 'center',
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputContainer: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    color: '#555',
    textAlign: 'left',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s',
    outline: 'none',
  },
  inputFocus: {
    borderColor: '#6c63ff',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  registerButton: {
    backgroundColor: '#6c63ff',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  loginButton: {
    backgroundColor: '#fff',
    color: '#6c63ff',
    padding: '10px 20px',
    border: '2px solid #6c63ff',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  registerButtonHover: {
    backgroundColor: '#000000',
  },
  loginButtonHover: {
    backgroundColor: '#00000',
  },
};


export default RegisterForm;
