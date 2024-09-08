import React, { useState, useEffect, useRef, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilter, faChartPie, faSyncAlt, faEye, faTrashAlt, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/AuthContext';
import { getQAPairs, uploadQAPair, updateQAPair, deleteQAPair } from '../services/api';
import { useParams } from 'react-router-dom';

const KnowledgeBase = () => {
  const { user } = useContext(AuthContext);
  const { id: chatbotId } = useParams(); 
  const [activeTab, setActiveTab] = useState('text');
  const [dataSources, setDataSources] = useState({
    link: { items: [] },
    text: { items: [] },
    faq: { items: [] },
    document: { items: [] },
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedType, setSelectedType] = useState('text');
  const [editingEntry, setEditingEntry] = useState(null);
  const modalRef = useRef(null);

  console.log("chatbotId..", chatbotId);
  

  useEffect(() => {
    if (user && chatbotId) {
      fetchQAPairs(chatbotId); // Fetch data with the correct chatbotId
    }
  }, [user, chatbotId]);

  const fetchQAPairs = async (chatbotId) => {
    try {
      const data = await getQAPairs(chatbotId); // Now passing chatbotId instead of user.id
      setDataSources(data);
    } catch (error) {
      console.error('Error fetching Q&A pairs:', error);
      setDataSources({
        link: { items: [] },
        text: { items: [] },
        faq: { items: [] },
        document: { items: [] },
      });
    }
  };

  const handleAddEntry = async (newEntry) => {
    try {
      await uploadQAPair(chatbotId, selectedType, newEntry); // Use chatbotId here
      fetchQAPairs(chatbotId);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error uploading Q&A pair:', error);
    }
  };

  const handleUpdateEntry = async (id, updatedEntry) => {
    try {
      await updateQAPair(id, editingEntry.type, updatedEntry);
      fetchQAPairs(chatbotId); 
      setShowEditModal(false);
      setEditingEntry(null);
    } catch (error) {
      console.error('Error updating Q&A pair:', error);
    }
  };

  const handleDeleteEntry = async (id) => {
    try {
      await deleteQAPair(id);
      fetchQAPairs(chatbotId); 
    } catch (error) {
      console.error('Error deleting Q&A pair:', error);
    }
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setShowEditModal(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowAddModal(false);
        setShowEditModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-6xl mx-auto">
      <Header setShowAddModal={setShowAddModal} />
      <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />
      <ActionButtons />
      <DataSummary dataSources={dataSources} activeTab={activeTab} />
      <EntriesTable
        dataSources={dataSources}
        activeTab={activeTab}
        handleDeleteEntry={handleDeleteEntry}
        handleEditEntry={handleEditEntry}
      />
      {showAddModal && (
        <AddModal
          setShowAddModal={setShowAddModal}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          handleAddEntry={handleAddEntry}
        />
      )}
      {showEditModal && (
        <EditModal
          setShowEditModal={setShowEditModal}
          editingEntry={editingEntry}
          handleUpdateEntry={handleUpdateEntry}
        />
      )}
    </div>
  );
};

const Header = ({ setShowAddModal }) => (
  <>
    <h1 className="text-3xl font-bold text-gray-800 mb-4">Knowledge Base</h1>
    <p className="text-gray-600 mb-6">Add and manage data sources that form the AI's knowledge base. These data are used by the AI to respond to user queries.</p>
    <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition" onClick={() => setShowAddModal(true)}>
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

const DataSummary = ({ dataSources, activeTab }) => {
  const entries = dataSources[activeTab]?.items || [];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <DataCard title="Total Sources" value={entries.length} color="bg-gray-100" />
      <DataCard title="Processed" value={entries.filter(entry => entry.status === 'processed').length} color="bg-green-100" />
      <DataCard title="Pending" value={entries.filter(entry => entry.status === 'pending').length} color="bg-yellow-100" />
      <DataCard title="Processing" value={entries.filter(entry => entry.status === 'processing').length} color="bg-blue-100" />
      <DataCard title="Error" value={entries.filter(entry => entry.status === 'error').length} color="bg-red-100" />
    </div>
  );
};

const DataCard = ({ title, value, color }) => (
  <div className={`p-4 ${color} rounded-md shadow-md`}>
    <p className="text-lg font-bold">{value}</p>
    <p className="text-sm text-gray-600">{title}</p>
  </div>
);

const EntriesTable = ({ dataSources, activeTab, handleDeleteEntry, handleEditEntry }) => {
  const filteredEntries = dataSources[activeTab]?.items || [];

  const renderTableHeaders = () => {
    switch (activeTab) {
      case 'link':
        return (
          <>
            <th className="border-b p-4">URL</th>
            <th className="border-b p-4">Title</th>
            <th className="border-b p-4">Status</th>
            <th className="border-b p-4">Date Added</th>
            <th className="border-b p-4">Actions</th>
          </>
        );
      case 'text':
        return (
          <>
            <th className="border-b p-4">HTML</th>
            <th className="border-b p-4">Characters</th>
            <th className="border-b p-4">Status</th>
            <th className="border-b p-4">Date Added</th>
            <th className="border-b p-4">Actions</th>
          </>
        );
      case 'faq':
        return (
          <>
            <th className="border-b p-4">Question</th>
            <th className="border-b p-4">Answer</th>
            <th className="border-b p-4">Status</th>
            <th className="border-b p-4">Date Added</th>
            <th className="border-b p-4">Actions</th>
          </>
        );
      case 'document':
        return (
          <>
            <th className="border-b p-4">File Name</th>
            <th className="border-b p-4">Size</th>
            <th className="border-b p-4">Status</th>
            <th className="border-b p-4">Date Added</th>
            <th className="border-b p-4">Actions</th>
          </>
        );
      default:
        return null;
    }
  };

  const renderTableRows = (entry) => {
    switch (activeTab) {
      case 'link':
        return (
          <>
            <td className="border-b p-4">{entry.url}</td>
            <td className="border-b p-4">{entry.title}</td>
            <td className="border-b p-4">
              <span className={`px-2 py-1 rounded-md ${entry.status === 'processed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {entry.status}
              </span>
            </td>
            <td className="border-b p-4">{new Date(entry.created_at).toLocaleDateString()}</td>
            <td className="border-b p-4">
              <button onClick={() => handleEditEntry(entry)} className="text-blue-500 hover:text-blue-700 mr-2">
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button onClick={() => handleDeleteEntry(entry.id)} className="text-red-500 hover:text-red-700">
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </td>
          </>
        );
      case 'text':
        return (
          <>
            <td className="border-b p-4">{entry.html}</td>
            <td className="border-b p-4">{entry.characters}</td>
            <td className="border-b p-4">
              <span className={`px-2 py-1 rounded-md ${entry.status === 'processed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {entry.status}
              </span>
            </td>
            <td className="border-b p-4">{new Date(entry.created_at).toLocaleDateString()}</td>
            <td className="border-b p-4">
              <button onClick={() => handleEditEntry(entry)} className="text-blue-500 hover:text-blue-700 mr-2">
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button onClick={() => handleDeleteEntry(entry.id)} className="text-red-500 hover:text-red-700">
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </td>
          </>
        );
      case 'faq':
        return (
          <>
            <td className="border-b p-4">{entry.question}</td>
            <td className="border-b p-4">{entry.answer}</td>
            <td className="border-b p-4">
              <span className={`px-2 py-1 rounded-md ${entry.status === 'processed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {entry.status}
              </span>
            </td>
            <td className="border-b p-4">{new Date(entry.created_at).toLocaleDateString()}</td>
            <td className="border-b p-4">
              <button onClick={() => handleEditEntry(entry)} className="text-blue-500 hover:text-blue-700 mr-2">
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button onClick={() => handleDeleteEntry(entry.id)} className="text-red-500 hover:text-red-700">
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </td>
          </>
        );
      case 'document':
        return (
          <>
            <td className="border-b p-4">{entry.file_name}</td>
            <td className="border-b p-4">{entry.file_size}</td>
            <td className="border-b p-4">
              <span className={`px-2 py-1 rounded-md ${entry.status === 'processed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {entry.status}
              </span>
            </td>
            <td className="border-b p-4">{new Date(entry.created_at).toLocaleDateString()}</td>
            <td className="border-b p-4">
              <button onClick={() => handleEditEntry(entry)} className="text-blue-500 hover:text-blue-700 mr-2">
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button onClick={() => handleDeleteEntry(entry.id)} className="text-red-500 hover:text-red-700">
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </td>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr>{renderTableHeaders()}</tr>
      </thead>
      <tbody>
        {filteredEntries.map((entry) => (
          <tr key={entry.id} className="hover:bg-gray-100 transition">
            {renderTableRows(entry)}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const AddModal = ({
  setShowAddModal,
  selectedType,
  setSelectedType,
  handleAddEntry,
}) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [html, setHtml] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    let newEntry;

    switch (selectedType) {
      case 'link':
        newEntry = { url, title, type: selectedType };
        break;
      case 'text':
        newEntry = { html, characters: html.length, type: selectedType };
        break;
      case 'faq':
        newEntry = { question, answer, type: selectedType };
        break;
      case 'document':
        newEntry = { file_name: file?.name, file_size: file?.size, type: selectedType }; 
        break;
      default:
        return;
    }

    handleAddEntry(newEntry);
    resetForm();
  };

  const resetForm = () => {
    setUrl('');
    setTitle('');
    setHtml('');
    setQuestion('');
    setAnswer('');
    setFile(null);
    setShowAddModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full">
        <button className="mb-4 text-gray-500" onClick={() => setShowAddModal(false)}>
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
        {selectedType === 'link' && (
          <LinkForm url={url} setUrl={setUrl} title={title} setTitle={setTitle} handleSubmit={handleSubmit} />
        )}
        {selectedType === 'text' && (
          <TextForm html={html} setHtml={setHtml} handleSubmit={handleSubmit} />
        )}
        {selectedType === 'faq' && (
          <FAQForm question={question} setQuestion={setQuestion} answer={answer} setAnswer={setAnswer} handleSubmit={handleSubmit} />
        )}
        {selectedType === 'document' && (
          <DocumentForm file={file} setFile={setFile} handleSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
};

const EditModal = ({
  setShowEditModal,
  editingEntry,
  handleUpdateEntry,
}) => {
  const [url, setUrl] = useState(editingEntry?.url || '');
  const [title, setTitle] = useState(editingEntry?.title || '');
  const [html, setHtml] = useState(editingEntry?.html || '');
  const [question, setQuestion] = useState(editingEntry?.question || '');
  const [answer, setAnswer] = useState(editingEntry?.answer || '');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedEntry;

    switch (editingEntry.type) {
      case 'link':
        updatedEntry = { url, title, type: editingEntry.type };
        break;
      case 'text':
        updatedEntry = { html, characters: html.length, type: editingEntry.type };
        break;
      case 'faq':
        updatedEntry = { question, answer, type: editingEntry.type };
        break;
      case 'document':
        updatedEntry = { file_name: file?.name, file_size: file?.size, type: editingEntry.type };
        break;
      default:
        return;
    }

    handleUpdateEntry(editingEntry.id, updatedEntry);
    resetForm();
  };

  const resetForm = () => {
    setUrl('');
    setTitle('');
    setHtml('');
    setQuestion('');
    setAnswer('');
    setFile(null);
    setShowEditModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full">
        <button className="mb-4 text-gray-500" onClick={() => setShowEditModal(false)}>
          <FontAwesomeIcon icon={faTimes} className="text-2xl" />
        </button>
        <h2 className="text-xl font-bold mb-4">Edit Data Source</h2>
        {editingEntry.type === 'link' && (
          <LinkForm url={url} setUrl={setUrl} title={title} setTitle={setTitle} handleSubmit={handleSubmit} />
        )}
        {editingEntry.type === 'text' && (
          <TextForm html={html} setHtml={setHtml} handleSubmit={handleSubmit} />
        )}
        {editingEntry.type === 'faq' && (
          <FAQForm question={question} setQuestion={setQuestion} answer={answer} setAnswer={setAnswer} handleSubmit={handleSubmit} />
        )}
        {editingEntry.type === 'document' && (
          <DocumentForm file={file} setFile={setFile} handleSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
};

const LinkForm = ({ url, setUrl, title, setTitle, handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <input
      type="url"
      placeholder="Enter URL"
      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-2"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
    />
    <input
      type="text"
      placeholder="Enter Title"
      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-2"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
      {handleSubmit.name === 'handleAddEntry' ? 'Add Link' : 'Update Link'}
    </button>
  </form>
);

const TextForm = ({ html, setHtml, handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <textarea
      placeholder="Enter HTML content here..."
      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-2"
      value={html}
      onChange={(e) => setHtml(e.target.value)}
    />
    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
      {handleSubmit.name === 'handleAddEntry' ? 'Add Text' : 'Update Text'}
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
      {handleSubmit.name === 'handleAddEntry' ? 'Add FAQ' : 'Update FAQ'}
    </button>
  </form>
);

const DocumentForm = ({ file, setFile, handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <input
      type="file"
      className="mb-4"
      onChange={(e) => setFile(e.target.files[0])}
    />
    <p className="text-sm text-gray-500 mb-2">
      Supported files: PDF, TXT, Microsoft Word. Max. 10 files at a time. File size: 1 MB per file (Upgrade plan to increase limit).
    </p>
    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
      {handleSubmit.name === 'handleAddEntry' ? 'Upload Document' : 'Update Document'}
    </button>
  </form>
);

export default KnowledgeBase;
