import React, { useState } from 'react';

const KnowledgeBase = () => {
  const [entries, setEntries] = useState([
    { id: 1, question: 'How can I reset my password?', answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page.' },
    { id: 2, question: 'What are the support hours?', answer: 'Our support team is available 24/7 to assist you with any queries.' },
  ]);

  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState(null);

  const handleAddEntry = () => {
    if (newQuestion && newAnswer) {
      const newEntry = {
        id: entries.length + 1,
        question: newQuestion,
        answer: newAnswer,
      };
      setEntries([...entries, newEntry]);
      setNewQuestion('');
      setNewAnswer('');
    }
  };

  const handleEditEntry = (id) => {
    const entry = entries.find((entry) => entry.id === id);
    if (entry) {
      setNewQuestion(entry.question);
      setNewAnswer(entry.answer);
      setIsEditing(true);
      setEditingEntryId(id);
    }
  };

  const handleSaveEdit = () => {
    setEntries(entries.map((entry) => (entry.id === editingEntryId ? { ...entry, question: newQuestion, answer: newAnswer } : entry)));
    setNewQuestion('');
    setNewAnswer('');
    setIsEditing(false);
    setEditingEntryId(null);
  };

  const handleDeleteEntry = (id) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Knowledge Base</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter question"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-2"
        />
        <textarea
          placeholder="Enter answer"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-2"
        />
        {isEditing ? (
          <button
            onClick={handleSaveEdit}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            Save Edit
          </button>
        ) : (
          <button
            onClick={handleAddEntry}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Add Entry
          </button>
        )}
      </div>
      <ul className="space-y-4">
        {entries.map((entry) => (
          <li key={entry.id} className="border-b pb-4">
            <h3 className="text-xl font-semibold text-gray-700">{entry.question}</h3>
            <p className="text-gray-600">{entry.answer}</p>
            <button
              onClick={() => handleEditEntry(entry.id)}
              className="mt-2 mr-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteEntry(entry.id)}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KnowledgeBase;
