import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:3000', // Base URL of your backend server
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get new tokens using the refresh token
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await api.post('/api/auth/refresh-token', { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    return accessToken;
  } catch (error) {
    console.error('Failed to refresh token', error);
    // Handle refresh token failure (e.g., logout the user)
    throw error;
  }
};

// Add a request interceptor to attach the access token to each request
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 403 errors and refresh tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await refreshToken();
      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default api;