const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { auth } from "../config/firebaseConfig";

const getAuthToken = async () => {
  if (auth.currentUser) {
    return await auth.currentUser.getIdToken();
  }
  throw new Error("No user logged in");
};

const handleErrors = (response) => {
  if (!response.ok) {
    throw new Error("An error occurred while fetching data");
  }
  return response.json();
};

// Chat APIs
export const sendMessage = async (chatId, text, role_id) => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/chat/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ chatId, text, role_id }),
  });
  return handleErrors(response);
};

export const getChatHistory = async (userId, chatbotId) => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/chat/history?userId=${userId}&chatbotId=${chatbotId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return handleErrors(response);
};

// Knowledge Base APIs
export const getQAPairs = async (chatbotId) => {
  console.log("getQAPairs chatbotid", chatbotId);
  
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/knowledge-base?chatbotId=${chatbotId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleErrors(response);
};

export const uploadQAPair = async (chatbotId, type, data) => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/knowledge-base/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ chatbotId, type, ...data }),
  });
  return handleErrors(response);
};

export const updateQAPair = async (id, type, data) => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/knowledge-base/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ type, ...data }),
  });
  return handleErrors(response);
};

export const deleteQAPair = async (id) => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/knowledge-base/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleErrors(response);
};

// Chatbots APIs
export const createChatbot = async (userId, name, description) => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/chatbots`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, name, description }),
  });
  return handleErrors(response);
};

export const getChatbots = async () => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/chatbots`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleErrors(response);
};

export const getChatbotById = async (id) => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/chatbots/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleErrors(response);
};

export const deleteChatbot = async (id) => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/chatbots/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleErrors(response);
};

export const renameChatbot = async (id, name, description) => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/chatbots/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, description }),
  });
  return handleErrors(response);
};

// User Profile APIs
export const getUserProfile = async () => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleErrors(response);
};

export const updateUserProfile = async (username, email, notifications) => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/user/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username, email, notifications }),
  });
  return handleErrors(response);
};

export const updateProfile = async (userId, { username, email, notifications }) => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/user/profile/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username, email, notifications }),
  });
  return handleErrors(response);
};

// Integration APIs
export const getIntegrationSettings = async (chatbotId) => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/integrations/${chatbotId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleErrors(response);
};

export const updateIntegrationSettings = async (chatbotId, settings) => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/integrations/${chatbotId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(settings),
  });
  return handleErrors(response);
};

// Authentication APIs
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

export const logoutUser = async () => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleErrors(response);
};

// Configuration APIs
export const getConfiguration = async (chatbotId) => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/configuration?chatbotId=${chatbotId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleErrors(response);
};

export const saveConfiguration = async (chatbotId, config) => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/configuration?chatbotId=${chatbotId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(config),
  });
  return handleErrors(response);
};

// Create user in database
export const createUserInDB = async (firebaseUid, email) => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ firebaseUid, email }),
  });
  return response.json();
};
