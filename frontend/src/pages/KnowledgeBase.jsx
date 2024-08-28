import React, { useState } from 'react';

const KnowledgeBase = () => {
  const [activeTab, setActiveTab] = useState('text');
  const [entries, setEntries] = useState([
    { id: 1, type: 'text', content: 'hi', characters: 2, status: 'Processed', dateAdded: 'August 27, 2024' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState('text');

  const handleAddEntry = (newEntry) => {
    setEntries([...entries, newEntry]);
  };

  const handleDeleteEntry = (id) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Knowledge Base</h1>
      <p className="text-gray-600 mb-6">
        Add and manage data sources that form the AI's knowledge base. These data are used by the AI to respond to user queries.
      </p>
      
      <button
        className="mb-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
        onClick={() => setShowModal(true)}
      >
        + New Data Source
      </button>
      
      <div className="flex space-x-4 mb-6">
        <button onClick={() => setActiveTab('link')} className={`px-4 py-2 ${activeTab === 'link' ? 'border-b-2 border-black' : 'text-gray-500'}`}>Link</button>
        <button onClick={() => setActiveTab('text')} className={`px-4 py-2 ${activeTab === 'text' ? 'border-b-2 border-black' : 'text-gray-500'}`}>Text</button>
        <button onClick={() => setActiveTab('faq')} className={`px-4 py-2 ${activeTab === 'faq' ? 'border-b-2 border-black' : 'text-gray-500'}`}>FAQ</button>
        <button onClick={() => setActiveTab('document')} className={`px-4 py-2 ${activeTab === 'document' ? 'border-b-2 border-black' : 'text-gray-500'}`}>Document</button>
      </div>
      
      <div className="flex space-x-4 mb-4">
        <button className="bg-gray-100 px-4 py-2 rounded-md">Filter</button>
        <button className="bg-black text-white px-4 py-2 rounded-md">Stats</button>
        <button className="bg-gray-100 px-4 py-2 rounded-md">Refresh</button>
        <input type="text" placeholder="Search texts" className="flex-grow p-2 border border-gray-300 rounded-md" />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="p-4 bg-gray-100 rounded-md">
          <p className="text-lg font-bold">1</p>
          <p className="text-sm text-gray-600">Total Sources</p>
        </div>
        <div className="p-4 bg-green-100 rounded-md">
          <p className="text-lg font-bold">1</p>
          <p className="text-sm text-gray-600">Processed</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded-md">
          <p className="text-lg font-bold">0</p>
          <p className="text-sm text-gray-600">Pending</p>
        </div>
        <div className="p-4 bg-blue-100 rounded-md">
          <p className="text-lg font-bold">0</p>
          <p className="text-sm text-gray-600">Processing</p>
        </div>
        <div className="p-4 bg-red-100 rounded-md">
          <p className="text-lg font-bold">0</p>
          <p className="text-sm text-gray-600">Error</p>
        </div>
      </div>
      
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
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td className="border-b p-4">{entry.content}</td>
              <td className="border-b p-4">{entry.characters}</td>
              <td className="border-b p-4">
                <span className={`px-2 py-1 rounded-md ${entry.status === 'Processed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {entry.status}
                </span>
              </td>
              <td className="border-b p-4">{entry.dateAdded}</td>
              <td className="border-b p-4">
                <button className="text-blue-500 hover:text-blue-700 mr-2">👁️</button>
                <button onClick={() => handleDeleteEntry(entry.id)} className="text-red-500 hover:text-red-700">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full">
            <button className="mb-4 text-gray-500" onClick={() => setShowModal(false)}>Close</button>
            <h2 className="text-xl font-bold mb-4">Add New Data Source</h2>

            <div className="flex space-x-4 mb-6">
              <button onClick={() => setSelectedType('link')} className={`px-4 py-2 ${selectedType === 'link' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Link</button>
              <button onClick={() => setSelectedType('text')} className={`px-4 py-2 ${selectedType === 'text' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Text</button>
              <button onClick={() => setSelectedType('faq')} className={`px-4 py-2 ${selectedType === 'faq' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Q&A</button>
              <button onClick={() => setSelectedType('document')} className={`px-4 py-2 ${selectedType === 'document' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Document</button>
            </div>

            {selectedType === 'text' && (
              <div>
                <textarea
                  placeholder="Enter text here..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-2"
                />
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                  Submit
                </button>
              </div>
            )}

            {selectedType === 'faq' && (
              <div>
                <input
                  type="text"
                  placeholder="Enter question"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-2"
                />
                <textarea
                  placeholder="Enter answer"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-2"
                />
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                  Submit
                </button>
              </div>
            )}

{selectedType === 'document' && (
              <div>
                <input type="file" multiple className="mb-4" />
                <p className="text-sm text-gray-500 mb-2">
                  Supported files: PDF, TXT, Microsoft Word. Max. 10 files at a time. File size: 1 MB per file (Upgrade plan to increase limit).
                </p>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                  Upload
                </button>
              </div>
            )}

            {selectedType === 'link' && (
              <div>
                <input
                  type="url"
                  placeholder="Enter URL"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-2"
                />
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                  Add Link
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
