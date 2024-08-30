import React, { useState, useEffect, useRef, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilter, faChartPie, faSyncAlt, faEye, faTrashAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/AuthContext'; // Import the AuthContext
import { getQAPairs, uploadQAPair, updateQAPair, deleteQAPair } from '../services/api'; // Import API functions

const KnowledgeBase = () => {
  const { user } = useContext(AuthContext); // Use AuthContext to get the current user
  const [activeTab, setActiveTab] = useState('text');
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState('text');
  const modalRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchQAPairs();
    }
  }, [user]);

  const fetchQAPairs = async () => {
    try {
      const data = await getQAPairs(user.id);
      setEntries(data);
    } catch (error) {
      console.error('Error fetching Q&A pairs:', error);
    }
  };

  const handleAddEntry = async (newEntry) => {
    try {
      await uploadQAPair(user.id, newEntry.question, newEntry.answer);
      fetchQAPairs(); // Refresh the entries
      setShowModal(false);
    } catch (error) {
      console.error('Error uploading Q&A pair:', error);
    }
  };

  const handleDeleteEntry = async (id) => {
    try {
      await deleteQAPair(id);
      fetchQAPairs(); // Refresh the entries
    } catch (error) {
      console.error('Error deleting Q&A pair:', error);
    }
  };

  const handleViewEntry = (id) => {
    alert(`Viewing details for entry ${id}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-6xl mx-auto">
      <Header setShowModal={setShowModal} />
      <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />
      <ActionButtons />
      <DataSummary entries={entries} />
      <EntriesTable entries={entries} activeTab={activeTab} handleDeleteEntry={handleDeleteEntry} handleViewEntry={handleViewEntry} />
      {showModal && <Modal modalRef={modalRef} setShowModal={setShowModal} selectedType={selectedType} setSelectedType={setSelectedType} handleAddEntry={handleAddEntry} />}
    </div>
  );
};

const Header = ({ setShowModal }) => (
  <>
    <h1 className="text-3xl font-bold text-gray-800 mb-4">Knowledge Base</h1>
    <p className="text-gray-600 mb-6">Add and manage data sources that form the AI's knowledge base. These data are used by the AI to respond to user queries.</p>
    <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition" onClick={() => setShowModal(true)}>
      <FontAwesomeIcon icon={faPlus} className="mr-2" /> New Data Source
    </button>
  </>
);

const TabSelector = ({ activeTab, setActiveTab }) => (
  <div className="flex space-x-4 mb-6">
    {['link', 'text', 'faq', 'document'].map((type) => (
      <button key={type} onClick={() => setActiveTab(type)} className={`px-4 py-2 ${activeTab === type ? 'border-b-2 border-blue-500 text-blue-600 font-bold' : 'text-gray-500'}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </button>
    ))}
  </div>
);

const ActionButtons = () => (
  <div className="flex space-x-4 mb-4">
    <button className="flex items-center bg-gray-100 px-4 py-2 rounded-md"><FontAwesomeIcon icon={faFilter} className="mr-2" /> Filter</button>
    <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"><FontAwesomeIcon icon={faChartPie} className="mr-2" /> Stats</button>
    <button className="flex items-center bg-gray-100 px-4 py-2 rounded-md"><FontAwesomeIcon icon={faSyncAlt} className="mr-2" /> Refresh</button>
    <input type="text" placeholder="Search texts" className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
  </div>
);

const DataSummary = ({ entries }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
    <DataCard title="Total Sources" value={entries.length} color="bg-gray-100" />
    <DataCard title="Processed" value={entries.filter(entry => entry.status === 'Processed').length} color="bg-green-100" />
    <DataCard title="Pending" value={entries.filter(entry => entry.status === 'Pending').length} color="bg-yellow-100" />
    <DataCard title="Processing" value={entries.filter(entry => entry.status === 'Processing').length} color="bg-blue-100" />
    <DataCard title="Error" value={entries.filter(entry => entry.status === 'Error').length} color="bg-red-100" />
  </div>
);

const DataCard = ({ title, value, color }) => (
  <div className={`p-4 ${color} rounded-md shadow-md`}>
    <p className="text-lg font-bold">{value}</p>
    <p className="text-sm text-gray-600">{title}</p>
  </div>
);

const EntriesTable = ({ entries, activeTab, handleDeleteEntry, handleViewEntry }) => {
  const filteredEntries = entries.filter(entry => entry.type === activeTab);

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr>
          <th className="border-b p-4">Text</th>
          <th className="border-b p-4">Characters</th>
          <th className="border-b p-4">Status</th>
          <th className="border-b p-4">Date Added</th>
          <th className="border-b p-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredEntries.map((entry) => (
          <tr key={entry.id} className="hover:bg-gray-100 transition">
            <td className="border-b p-4">{entry.content}</td>
            <td className="border-b p-4">{entry.characters}</td>
            <td className="border-b p-4">
              <span className={`px-2 py-1 rounded-md ${entry.status === 'Processed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {entry.status}
              </span>
            </td>
            <td className="border-b p-4">{entry.dateAdded}</td>
            <td className="border-b p-4">
              <button onClick={() => handleViewEntry(entry.id)} className="text-blue-500 hover:text-blue-700 mr-2">
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button onClick={() => handleDeleteEntry(entry.id)} className="text-red-500 hover:text-red-700">
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Modal = ({ modalRef, setShowModal, selectedType, setSelectedType, handleAddEntry }) => {
  const [content, setContent] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    let newEntry;
    if (selectedType === 'text') {
      newEntry = { id: Math.random(), type: selectedType, content, characters: content.length, status: 'Pending', dateAdded: new Date().toLocaleDateString() };
    } else if (selectedType === 'faq') {
      newEntry = { id: Math.random(), type: selectedType, content: question, characters: question.length + answer.length, status: 'Pending', dateAdded: new Date().toLocaleDateString() };
    } else if (selectedType === 'link') {
      newEntry = { id: Math.random(), type: selectedType, content: url, characters: url.length, status: 'Pending', dateAdded: new Date().toLocaleDateString() };
    } else if (selectedType === 'document') {
      newEntry = { id: Math.random(), type: selectedType, content: 'Document entry', characters: 0, status: 'Pending', dateAdded: new Date().toLocaleDateString() };
    }
    handleAddEntry(newEntry);
    setContent('');
    setQuestion('');
    setAnswer('');
    setUrl('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div ref={modalRef} className="bg-white p-6 rounded-md shadow-md max-w-md w-full">
        <button className="mb-4 text-gray-500" onClick={() => setShowModal(false)}>
          <FontAwesomeIcon icon={faTimes} className="text-2xl" />
        </button>
        <h2 className="text-xl font-bold mb-4">Add New Data Source</h2>
        <div className="flex space-x-4 mb-6">
          {['link', 'text', 'faq', 'document'].map((type) => (
            <button key={type} onClick={() => setSelectedType(type)} className={`px-4 py-2 ${selectedType === type ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        {selectedType === 'text' && (
          <TextForm content={content} setContent={setContent} handleSubmit={handleSubmit} />
        )}
        {selectedType === 'faq' && (
          <FAQForm question={question} setQuestion={setQuestion} answer={answer} setAnswer={setAnswer} handleSubmit={handleSubmit} />
        )}
        {selectedType === 'link' && (
          <LinkForm url={url} setUrl={setUrl} handleSubmit={handleSubmit} />
        )}
        {selectedType === 'document' && (
          <DocumentForm handleSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
};

const TextForm = ({ content, setContent, handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <textarea
      placeholder="Enter text here..."
      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-2"
      value={content}
      onChange={(e) => setContent(e.target.value)}
    />
    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
      Submit
    </button>
  </form>
);

const FAQForm = ({ question, setQuestion, answer, setAnswer, handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <input
      type="text"
      placeholder="Enter question"
      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-2"
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
    />
    <textarea
      placeholder="Enter answer"
      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-2"
      value={answer}
      onChange={(e) => setAnswer(e.target.value)}
    />
    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
      Submit
    </button>
  </form>
);

const LinkForm = ({ url, setUrl, handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <input
      type="url"
      placeholder="Enter URL"
      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-2"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
    />
    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
      Add Link
    </button>
  </form>
);

const DocumentForm = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <input type="file" multiple className="mb-4" />
    <p className="text-sm text-gray-500 mb-2">
      Supported files: PDF, TXT, Microsoft Word. Max. 10 files at a time. File size: 1 MB per file (Upgrade plan to increase limit).
    </p>
    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
      Upload
    </button>
  </form>
);

export default KnowledgeBase;
