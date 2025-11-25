// src/api.js
const API_BASE_URL = "http://127.0.0.1:8000";

// Get stored token
export const getToken = () => localStorage.getItem("access_token");
// Set token in localStorage
export const setToken = (token) => localStorage.setItem("access_token", token);
// Remove the token from localStorage
export const removeToken = () => localStorage.removeItem("access_token");

// Generic API request function with authentication
export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      // Don't set Content-Type by default, let the browser set it
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
  
  // If the body is FormData, don't set Content-Type header
  // The browser will set it automatically with the proper boundary
  if (mergedOptions.body instanceof FormData) {
    delete mergedOptions.headers['Content-Type'];
  } else {
    // Only set Content-Type for non-FormData requests
    mergedOptions.headers['Content-Type'] = 'application/json';
  }
  
  try {
    const response = await fetch(url, mergedOptions);
    
    // If the response is 401 Unauthorized, the token might be expired
    if (response.status === 401) {
      // Only remove token if it's actually a 401 error
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

// // Get current user - using the correct endpoint
// export const getCurrentUser = async () => {
//   try {
//     return await apiRequest("/db/Current_user/Profile");
//   } catch (error) {
//     // Only remove token if it's a 401 error (invalid token)
//     // Don't remove token for network errors or other issues
//     if (error.message && error.message.includes("401")) {
//       removeToken();
//     }
//     throw error;
//   }
// };
// Get current user - using the correct endpoint
export const getCurrentUser = async () => {
  try {
    // First check if we have a token before making the request
    if (!hasValidToken()) {
      throw new Error("No valid token found");
    }
    return await apiRequest("/db/Current_user/Profile");
  } catch (error) {
    // Only remove token if it's a 401 error (invalid token)
    // Don't remove token for network errors or other issues
    if (error.message && error.message.includes("401")) {
      removeToken();
    }
    throw error;
  }
};

// Check if token exists and is potentially valid (without making a request)
export const hasValidToken = () => {
  const token = getToken();
  return !!token; // Simple check for now
};

// Safely decode JWT token
export const decodeToken = (token) => {
  try {
    if (!token) return null;
    
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Decode the payload
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Check if token is expired by decoding it
export const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;
  
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    // Add a 5-minute buffer to handle clock differences
    return decoded.exp < (currentTime - 300);
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true; // Assume expired if we can't decode
  }
};