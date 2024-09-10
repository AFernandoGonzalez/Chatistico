import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login, authError, user } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="fixed top-10 w-screen min-h-screen bg-background flex items-center justify-center px-4 md:top-0">
      <form onSubmit={handleLogin} className="w-full max-w-md p-6 md:p-8 bg-white shadow-xl rounded-lg">
        <h1 className="text-3xl md:text-4xl font-bold text-primary text-center mb-6">Login to Your Account</h1>

        {authError && (
          <div className="text-red-500 text-center mb-4">
            {authError}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          required
        />

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-full font-semibold shadow-lg hover:bg-primary-dark transition-all"
        >
          Login
        </button>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account? <a href="/signup" className="text-secondary hover:text-secondary-dark">Sign Up</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
