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
        window.location.href = "/login";
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


// ================= FORGOT PASSWORD =================
export const forgotPassword = async (email) => {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to send reset email");
  }

  return await response.json();
};

// ================= RESET PASSWORD =================
export const resetPassword = async (token, newPassword, confirmNewPassword) => {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token,
      new_password: newPassword,
      confirm_new_password: confirmNewPassword,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to reset password");
  }

  return await response.json();
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
