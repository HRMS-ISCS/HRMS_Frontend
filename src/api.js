// src/api.js
const API_BASE_URL = "http://127.0.0.1:8000";

// Get the stored token
export const getToken = () => localStorage.getItem("access_token");

// Set the token in localStorage
export const setToken = (token) => localStorage.setItem("access_token", token);

// Remove the token from localStorage
export const removeToken = () => localStorage.removeItem("access_token");

// Generic API request function with authentication
export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, mergedOptions);
    
    // If the response is 401 Unauthorized, the token might be expired
    if (response.status === 401) {
      removeToken();
      window.location.href = "/";
      return null;
    }
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "API request failed");
    }
    
    return await response.json();
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};

// Login function
export const login = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append("grant_type", "password");
  formData.append("username", username);
  formData.append("password", password);
  
  const response = await fetch(`${API_BASE_URL}/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Login failed");
  }
  
  const data = await response.json();
  setToken(data.access_token);
  return data;
};

// Get current user
export const getCurrentUser = async () => {
  try {
    return await apiRequest("/auth/me");
  } catch (error) {
    // If we can't get the current user, the token is likely invalid
    removeToken();
    throw error;
  }
};

// Check if token exists and is potentially valid (without making a request)
export const hasValidToken = () => {
  const token = getToken();
  return !!token; // Simple check for now
};