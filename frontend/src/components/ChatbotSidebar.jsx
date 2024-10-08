import React, { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChartBar, faCommentDots, faCog, faComments, faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

const ChatbotSidebar = () => {
  const { id } = useParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation(); 

  return (
    <motion.div
      className="fixed top-0 left-0 h-full bg-primary flex flex-col items-center z-10 transition-all duration-300"
      initial={{ width: '4rem' }}
      animate={{ width: isExpanded ? '16rem' : '4rem' }}
      transition={{ duration: 0.2 }}
    >
      {/* Sidebar Header */}
      <div className="p-4 flex justify-center items-center text-white">
        <span>Chatbot</span>
      </div>

      {/* Navigation Items */}
      <motion.div className="flex flex-col h-full w-full">
        <nav className="flex-1 mt-6 w-full space-y-4 flex flex-col items-center">
          <NavItem
            icon={faArrowLeft}
            label="Back"
            isExpanded={isExpanded}
            to="/dashboard"
            isActive={location.pathname === "/dashboard"}
          />
          <NavItem
            icon={faChartBar}
            label="Overview"
            isExpanded={isExpanded}
            to={`/dashboard/chatbot/${id}/overview`}
            isActive={location.pathname === `/dashboard/chatbot/${id}/overview`}
          />
          <NavItem
            icon={faComments}
            label="Knowledge Base"
            isExpanded={isExpanded}
            to={`/dashboard/chatbot/${id}/knowledge-base`}
            isActive={location.pathname === `/dashboard/chatbot/${id}/knowledge-base`}
          />
          <NavItem
            icon={faCog}
            label="Configuration"
            isExpanded={isExpanded}
            to={`/dashboard/chatbot/${id}/configuration`}
            isActive={location.pathname === `/dashboard/chatbot/${id}/configuration`}
          />
          <NavItem
            icon={faCommentDots}
            label="Chat"
            isExpanded={isExpanded}
            to={`/dashboard/chatbot/${id}/chat`}
            isActive={location.pathname === `/dashboard/chatbot/${id}/chat`}
          />
          <NavItem
            icon={faPuzzlePiece}
            label="Integration"
            isExpanded={isExpanded}
            to={`/dashboard/chatbot/${id}/integration`}
            isActive={location.pathname === `/dashboard/chatbot/${id}/integration`}
          />
        </nav>
      </motion.div>
    </motion.div>
  );
};

const NavItem = ({ icon, label, isExpanded, to, isActive }) => {
  return (
    <Link
      to={to}
      className={`w-full p-3 flex items-center justify-center transition-colors duration-300 ${
        isActive ? 'bg-secondary-dark' : 'hover:bg-primary-dark'
      }`}
    >
      <FontAwesomeIcon icon={icon} className="text-white" />
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

export default ChatbotSidebar;
