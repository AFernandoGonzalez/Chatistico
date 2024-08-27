import React, { useState } from 'react';
import axios from 'axios';

const UploadQAPair = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://your-backend-url.com/api/knowledge-base/upload', {
        question,
        answer,
      });
      alert('Q&A pair uploaded successfully!');
      setQuestion('');
      setAnswer('');
    } catch (error) {
      console.error('Error uploading Q&A pair:', error);
    }
  };

  return (
    <div className="p-4 bg-gray-50 shadow-md rounded-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Upload Q&A Pair</h2>
      <form onSubmit={handleUpload} className="flex flex-col gap-4">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Question"
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          required
        />
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Answer"
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Upload Q&A
        </button>
      </form>
    </div>
  );
};

export default UploadQAPair;
