const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to handle errors
const handleErrors = (response) => {
  if (!response.ok) {
    throw new Error("An error occurred while fetching data");
  }
  return response.json();
};

// Chat APIs

// Sends a message and retrieves a response from the chatbot
export const sendMessage = async (userId, message) => {
  const response = await fetch(`${API_BASE_URL}/chat/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, message }),
  });
  return handleErrors(response);
};

// Retrieves chat history for a specific user
export const getChatHistory = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/chat/history?userId=${userId}`);
  return handleErrors(response);
};

// Knowledge Base APIs

// Knowledge Base APIs

// Fetches Q&A pairs for a specific chatbot
export const getQAPairs = async (chatbotId) => {
  const response = await fetch(`${API_BASE_URL}/knowledge-base?chatbotId=${chatbotId}`);
  const data = await handleErrors(response);
  return data; // Ensure this is an array
};
export const uploadQAPair = async (chatbotId, type, data) => {
  const body = { chatbotId, type, ...data };

  console.log("uploadQAPair data: ", data);
  
  const response = await fetch(`${API_BASE_URL}/knowledge-base/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return handleErrors(response);
};
// Updates a specific Q&A pair
export const updateQAPair = async (id, type, data) => {
  const body = { type, ...data }; // Include type to distinguish what is being updated

  const response = await fetch(`${API_BASE_URL}/knowledge-base/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  
  return handleErrors(response);
};
// Deletes a specific Q&A pair
export const deleteQAPair = async (id) => {
  const response = await fetch(`${API_BASE_URL}/knowledge-base/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return handleErrors(response);
};

// Creates a new chatbot
export const createChatbot = async (name, description) => {
  const response = await fetch(`${API_BASE_URL}/chatbots`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, description }),
  });
  return handleErrors(response);
};

// Fetches a list of all chatbots
export const getChatbots = async () => {
  const response = await fetch(`${API_BASE_URL}/chatbots`);
  return handleErrors(response);
};

// Fetches details of a specific chatbot
export const getChatbotById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/chatbots/${id}`);
  return handleErrors(response);
};

export const deleteChatbot = async (id) => {
  const response = await fetch(`${API_BASE_URL}/chatbots/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return handleErrors(response);
};

// Renames a chatbot
export const renameChatbot = async (id, name, description) => {
  const response = await fetch(`${API_BASE_URL}/chatbots/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, description }),
  });
  return handleErrors(response);
};

// User Profile APIs

// Fetches the profile of the current user
export const getUserProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/user/profile`);
  return handleErrors(response);
};

// Updates the profile of the current user
export const updateUserProfile = async (username, email, notifications) => {
  const response = await fetch(`${API_BASE_URL}/user/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, notifications }),
  });
  return handleErrors(response);
};

// **This is the missing function you need to add**

// Updates the user profile based on the provided information
export const updateProfile = async (userId, { username, email, notifications }) => {
  const response = await fetch(`${API_BASE_URL}/user/profile/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, notifications }),
  });
  return handleErrors(response);
};

// Integration APIs

// Fetches integration settings for a specific chatbot
export const getIntegrationSettings = async (chatbotId) => {
  const response = await fetch(`${API_BASE_URL}/integrations/${chatbotId}`);
  return handleErrors(response);
};

// Updates integration settings for a specific chatbot
export const updateIntegrationSettings = async (chatbotId, settings) => {
  const response = await fetch(`${API_BASE_URL}/integrations/${chatbotId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  });
  return handleErrors(response);
};

// Authentication APIs

// Logs in the user
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return handleErrors(response);
};

// Signs up a new user
export const signupUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return handleErrors(response);
};

// Logs out the user
export const logoutUser = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return handleErrors(response);
};
