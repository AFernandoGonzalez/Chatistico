import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Import the AuthContext

const Signup = () => {
  const { signup } = useContext(AuthContext); // Use signup function from AuthContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password); // Call signup function from context
      alert('Signup successful!');
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Error signing up: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSignup} className="p-6 bg-white shadow-md rounded-md max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
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
        Sign Up
      </button>
    </form>
  );
};

export default Signup;
