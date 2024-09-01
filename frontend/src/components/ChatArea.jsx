// import React from 'react';
// import ChatHistory from './ChatHistory';

// const ChatArea = ({ selectedChatbot, onConfigure }) => {
//   return (
//     <div className="flex-grow p-4">
//       {selectedChatbot ? (
//         <div className="flex h-full">
//           {/* User conversations on the left */}
//           <div className="w-1/2 bg-white shadow-md p-4 mr-2">
//             <h2 className="text-xl font-semibold mb-4">User Conversations</h2>
//             {/* Placeholder for user conversation list */}
//             <div className="h-full overflow-y-auto">
//               <p>Select a conversation to view details.</p>
//               {/* Placeholder for conversation items */}
//             </div>
//           </div>

//           {/* Chat history on the right */}
//           <div className="w-1/2 bg-white shadow-md p-4 ml-2">
//             <ChatHistory userId={selectedChatbot.id} />
//           </div>
//         </div>
//       ) : (
//         <div className="text-center text-gray-500">
//           <p>Select a chatbot to view its conversations and history.</p>
//         </div>
//       )}

//       {/* Configure button */}
//       {selectedChatbot && (
//         <button
//           className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
//           onClick={onConfigure}
//         >
//           Configure Chatbot
//         </button>
//       )}
//     </div>
//   );
// };

// export default ChatArea;
