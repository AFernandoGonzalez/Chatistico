import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChartBar, faCommentDots, faCog, faComments, faPuzzlePiece } from '@fortawesome/free-solid-svg-icons'; // Import new icon
import { motion } from 'framer-motion';

const ChatbotSidebar = () => {
  const { id } = useParams();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="fixed top-0 left-0 h-full bg-blue-600 flex flex-col items-center z-10"
      initial={{ width: '4rem' }}
      animate={{ width: isExpanded ? '11rem' : '4rem' }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex-1 mt-6 w-full">
        <nav className="flex flex-col space-y-4 items-start">
          <NavItem icon={faArrowLeft} label="Back" isExpanded={isExpanded} to="/dashboard" />
          <NavItem icon={faChartBar} label="Overview" isExpanded={isExpanded} to={`/dashboard/chatbot/${id}/overview`} />
          <NavItem icon={faComments} label="Knowledge Base" isExpanded={isExpanded} to={`/dashboard/chatbot/${id}/knowledge-base`} />
          <NavItem icon={faCog} label="Configuration" isExpanded={isExpanded} to={`/dashboard/chatbot/${id}/configuration`} />
          <NavItem icon={faCommentDots} label="Chat" isExpanded={isExpanded} to={`/dashboard/chatbot/${id}/chat`} />
          <NavItem icon={faPuzzlePiece} label="Integration" isExpanded={isExpanded} to={`/dashboard/chatbot/${id}/integration`} /> {/* New item */}

        </nav>
      </div>
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

export default ChatbotSidebar;
