import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faChartBar, faUser, faSignOutAlt, faThLarge } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate(); 

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <motion.div
      
      className={`fixed top-0 left-0 h-full bg-primary flex flex-col items-center z-10 transition-all duration-300`}
      initial={{ width: '4rem' }}
      animate={{ width: isExpanded ? '16rem' : '4rem' }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-4 flex justify-center items-center">
        <span>Logo</span>
      </div>

      <motion.div className="flex flex-col h-full w-full">
        <nav className="flex-1 mt-6 w-full space-y-4 flex flex-col items-center">
          <NavItem icon={faChartBar} label="Dashboard" isExpanded={isExpanded} to="/dashboard" />
          <NavItem icon={faUser} label="Profile" isExpanded={isExpanded} to="/dashboard/profile" />
        </nav>

        <div className="mt-auto w-full">
          <button
            onClick={handleLogout}
            className="w-full p-3 text-white flex items-center justify-center hover:bg-primary-dark transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="" />
            <motion.span
              className="text-white"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? 'auto' : 0 }}
              transition={{ duration: 0.3 }}
              style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
            >
              Logout
            </motion.span>
          </button>
        </div>
      </motion.div>

      {/* Sidebar Toggle Button */}
      {/* <div className="fixed bottom-12 left-4 lg:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-primary-dark p-2 text-white rounded-full shadow-lg hover:bg-primary-light transition"
        >
          <FontAwesomeIcon icon={isExpanded ? faThLarge : faPlus} />
        </button>
      </div> */}
    </motion.div>
  );
};

const NavItem = ({ icon, label, isExpanded, to }) => {
  return (
    <Link
      to={to}
      className="w-full p-3 text-white flex items-center justify-center hover:bg-blue-700 transition-colors duration-300"
    >
      <FontAwesomeIcon icon={icon} className="" />
      <motion.span
        className="text-white"
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
      >
        {label}
      </motion.span>
    </Link>
  );
};

export default Sidebar;
