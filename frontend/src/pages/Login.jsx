import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Import the AuthContext

const Login = () => {
  const { login } = useContext(AuthContext); // Use login function from AuthContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password); // Call login function from context
      alert('Login successful!');
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Error logging in: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-6 bg-white shadow-md rounded-md max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Log In</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
        required
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
        Log In
      </button>
    </form>
  );
};

export default Login;
