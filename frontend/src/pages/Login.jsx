// src/components/Login.js

import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login, authError, user } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div>
      <h2>Login</h2>
      {authError && <p style={{ color: 'red' }}>{authError}</p>}
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit">Login</button>
      </form>
      {user && <p>Welcome, {user.email}!</p>}
    </div>
  );
};

export default Login;
