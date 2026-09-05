import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động gắn Token trước khi gửi API
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tự động bắt lỗi nếu Token hết hạn (401/403)
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login'; // Đẩy về trang đăng nhập
    }
    return Promise.reject(error);
  }
);

export default axiosClient;