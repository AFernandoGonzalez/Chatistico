

import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signup(email, password);
      alert('Signup successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error signing up:', error);
      setError(error.message);
    }
  };

  return (
    <div className="fixed top-10 w-screen min-h-screen md:top-0 bg-background flex items-center justify-center px-4">
      <form onSubmit={handleSignup} className="w-full max-w-md p-6 md:p-8 bg-white shadow-xl rounded-lg">
        <h1 className="text-3xl md:text-4xl font-bold text-primary text-center mb-6">Create Your Account</h1>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          required
        />

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-full font-semibold shadow-lg hover:bg-primary-dark transition-all"
        >
          Sign Up
        </button>

        <p className="text-center text-gray-600 mt-4">
          Already have an account? <a href="/login" className="text-secondary hover:text-secondary-dark">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
