import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faChartBar, faCommentDots, faThLarge, faCog, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`fixed top-0 left-0 h-full transition-all duration-300 ${isExpanded ? 'w-44' : 'w-16'} bg-blue-600 flex flex-col items-center`}
    >
      <div className="mt-4">
        <button className="p-3 hover:bg-blue-700 rounded-full text-white">
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <div className={`flex-1 mt-6 ${isExpanded ? 'w-full' : ''}`}>
        <nav className="flex flex-col space-y-4 items-start">
          <NavItem icon={faChartBar} label="Dashboard" isExpanded={isExpanded} to="/dashboard" />
          <NavItem icon={faCommentDots} label="Knowledge Base" isExpanded={isExpanded} to="/dashboard/knowledge-base" />
          <NavItem icon={faThLarge} label="Configuration" isExpanded={isExpanded} to="/dashboard/configuration" />
          <NavItem icon={faCog} label="Settings" isExpanded={isExpanded} to="/dashboard/settings" />
          <NavItem icon={faUser} label="Profile" isExpanded={isExpanded} to="/dashboard/profile" />
          <NavItem icon={faSignOutAlt} label="Logout" isExpanded={isExpanded} to="/logout" />
        </nav>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, isExpanded, to }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `p-3 hover:bg-blue-700 rounded-full text-white flex items-center ${isActive ? 'bg-blue-700' : ''
        }`
      }
    >
      <FontAwesomeIcon icon={icon} className="mr-3" />
      {isExpanded && <span className="text-white">{label}</span>}
    </NavLink>
  );
};

export default Sidebar;
