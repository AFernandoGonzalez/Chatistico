import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faChartBar, faCommentDots, faThLarge, faCog, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`fixed top-0 left-0 h-full bg-blue-600 flex flex-col items-center`}
      initial={{ width: '4rem' }}
      animate={{ width: isExpanded ? '11rem' : '4rem' }}
      transition={{ duration: 0.3 }}
    >
      <div className="mt-4">
        <button className="p-3 hover:bg-blue-700 rounded-full text-white">
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <motion.div
        className="flex-1 mt-6 w-full"
      >
        <nav className="flex flex-col space-y-4 items-start">
          <NavItem icon={faChartBar} label="Dashboard" isExpanded={isExpanded} to="/dashboard" />
          <NavItem icon={faUser} label="Profile" isExpanded={isExpanded} to="/dashboard/profile" />
          <NavItem icon={faSignOutAlt} label="Logout" isExpanded={isExpanded} to="/logout" />
        </nav>
      </motion.div>
    </motion.div>
  );
};

const NavItem = ({ icon, label, isExpanded, to }) => {
  return (
    <Link
      to={to}
      className="w-full p-3 text-white flex items-center hover:bg-blue-700 transition-colors duration-300"
    >
      <FontAwesomeIcon icon={icon} className="mr-3" />
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
