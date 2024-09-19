import React from 'react';
import RegisterForm from './register';

function App() {
  const goToLogin = () => {
    alert('Navigating to Login Page...');
    // Logic to navigate to login page can be added here, e.g.:
    // navigate('/login');
  };

  return (
    <div className="App">
      <RegisterForm onLogin={goToLogin} />
    </div>
  );
}

export default App;
