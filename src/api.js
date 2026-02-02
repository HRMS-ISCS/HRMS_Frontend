// // src/api.js
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// // Get stored token
// export const getToken = () => localStorage.getItem("access_token");
// // Set token in localStorage
// export const setToken = (token) => localStorage.setItem("access_token", token);
// // Remove the token from localStorage
// export const removeToken = () => localStorage.removeItem("access_token");

// // Generic API request function with authentication
// export const apiRequest = async (endpoint, options = {}) => {
//   const token = getToken();
//   const url = `${API_BASE_URL}${endpoint}`;
  
//   const defaultOptions = {
//     headers: {
//       // Don't set Content-Type by default, let the browser set it
//       ...(token && { Authorization: `Bearer ${token}` }),
//     },
//   };
  
//   const mergedOptions = {
//     ...defaultOptions,
//     ...options,
//     headers: {
//       ...defaultOptions.headers,
//       ...options.headers,
//     },
//   };
  
//   // If the body is FormData, don't set Content-Type header
//   // The browser will set it automatically with the proper boundary
//   if (mergedOptions.body instanceof FormData) {
//     delete mergedOptions.headers['Content-Type'];
//   } else {
//     // Only set Content-Type for non-FormData requests
//     mergedOptions.headers['Content-Type'] = 'application/json';
//   }
  
//   try {
//     const response = await fetch(url, mergedOptions);
    
//     // If the response is 401 Unauthorized, the token might be expired
//     if (response.status === 401) {
//       // Only remove token if it's actually a 401 error
//       removeToken();
//       window.location.href = "/";
//       return null;
//     }
    
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.detail || "API request failed");
//     }
    
//     return await response.json();
//   } catch (error) {
//     console.error("API request error:", error);
//     throw error;
//   }
// };

// // Login function
// export const login = async (username, password) => {
//   const formData = new URLSearchParams();
//   formData.append("grant_type", "password");
//   formData.append("username", username);
//   formData.append("password", password);
  
//   const response = await fetch(`${API_BASE_URL}/auth/token`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body: formData,
//   });
  
//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.detail || "Login failed");
//   }
  
//   const data = await response.json();
//   setToken(data.access_token);
//   return data;
// };

// // Get current user - using the correct endpoint
// export const getCurrentUser = async () => {
//   try {
//     // First check if we have a token before making the request
//     if (!hasValidToken()) {
//       throw new Error("No valid token found");
//     }
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

// // Check if token exists and is potentially valid (without making a request)
// export const hasValidToken = () => {
//   const token = getToken();
//   return !!token; // Simple check for now
// };

// // Safely decode JWT token
// export const decodeToken = (token) => {
//   try {
//     if (!token) return null;
    
//     const parts = token.split('.');
//     if (parts.length !== 3) return null;
    
//     // Decode the payload
//     const payload = JSON.parse(atob(parts[1]));
//     return payload;
//   } catch (error) {
//     console.error("Error decoding token:", error);
//     return null;
//   }
// };

// // Check if token is expired by decoding it
// export const isTokenExpired = () => {
//   const token = getToken();
//   if (!token) return true;
  
//   try {
//     const decoded = decodeToken(token);
//     if (!decoded || !decoded.exp) return true;
    
//     const currentTime = Math.floor(Date.now() / 1000);
//     // Add a 5-minute buffer to handle clock differences
//     return decoded.exp < (currentTime - 300);
//   } catch (error) {
//     console.error("Error checking token expiration:", error);
//     return true; // Assume expired if we can't decode
//   }
// };

//api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// ================= TOKEN STORAGE =================
export const getToken = () => localStorage.getItem("access_token");
export const setToken = (token) => localStorage.setItem("access_token", token);
export const removeToken = () => localStorage.removeItem("access_token");

// 🔹 NEW (refresh token helpers)
export const getRefreshToken = () => localStorage.getItem("refresh_token");
export const setRefreshToken = (token) => localStorage.setItem("refresh_token", token);
export const removeRefreshToken = () => localStorage.removeItem("refresh_token");


// ================= GENERIC API REQUEST =================
export const apiRequest = async (endpoint, options = {}) => {
  let token = getToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions = {
    headers: {
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

  if (mergedOptions.body instanceof FormData) {
    delete mergedOptions.headers["Content-Type"];
  } else {
    mergedOptions.headers["Content-Type"] = "application/json";
  }

  try {
    let response = await fetch(url, mergedOptions);

    // 🔹 NEW — if access token expired, try refresh
    if (response.status === 401 && getRefreshToken()) {
      try {
        const newToken = await refreshAccessToken();

        response = await fetch(url, {
          ...mergedOptions,
          headers: {
            ...mergedOptions.headers,
            Authorization: `Bearer ${newToken}`,
          },
        });
      } catch (e) {
        removeToken();
        removeRefreshToken();
        window.location.href = "/";
        return null;
      }
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


// ================= LOGIN =================
export const login = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append("grant_type", "password");
  formData.append("username", username);
  formData.append("password", password);

  const response = await fetch(`${API_BASE_URL}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Login failed");
  }

  const data = await response.json();

  setToken(data.access_token);
  setRefreshToken(data.refresh_token); // 🔹 NEW

  return data;
};


// ================= REFRESH TOKEN CALL =================
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) throw new Error("Refresh failed");

  const data = await res.json();
  setToken(data.access_token);
  return data.access_token;
};


// ================= LOGOUT =================
export const logout = async () => {
  const refreshToken = getRefreshToken();

  if (refreshToken) {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  removeToken();
  removeRefreshToken();
};


// ================= CURRENT USER =================
export const getCurrentUser = async () => {
  if (!getToken()) throw new Error("No valid token found");
  return await apiRequest("/db/Current_user/Profile");
};


// ================= TOKEN HELPERS (unchanged) =================
export const hasValidToken = () => !!getToken();

export const decodeToken = (token) => {
  try {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
};

export const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;

  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime - 300;
  } catch {
    return true;
  }
};
