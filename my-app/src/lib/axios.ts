import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7015/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho Request (Để tiêm token xác thực trong tương lai)
api.interceptors.request.use(
  (config) => {
    // Ví dụ: Lấy JWT Token từ localStorage nếu chạy ở client-side
    // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho Response (Xử lý lỗi tập trung)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // API Backend có phản hồi lỗi (4xx, 5xx)
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          console.error('Lỗi dữ liệu (400):', data.message || 'Dữ liệu yêu cầu không hợp lệ.');
          break;
        case 401:
          console.error('Chưa đăng nhập (401): Vui lòng đăng nhập lại.');
          break;
        case 403:
          console.error('Không có quyền (403): Bạn không có quyền thực hiện hành động này.');
          break;
        case 404:
          console.error('Không tìm thấy (404): Tài nguyên yêu cầu không tồn tại.');
          break;
        case 500:
          console.error('Lỗi hệ thống (500): Lỗi máy chủ Backend.');
          break;
        default:
          console.error(`Lỗi API (${status}):`, data.message || 'Đã xảy ra lỗi không xác định.');
      }
      
      return Promise.reject(data || error);
    } else if (error.request) {
      // Yêu cầu đã được gửi nhưng không nhận được phản hồi (Lỗi mạng/API sập)
      console.error('Lỗi kết nối mạng: Không nhận được phản hồi từ API Backend.');
      return Promise.reject({ message: 'Không thể kết nối đến máy chủ Backend. Vui lòng bật API Backend và thử lại.' });
    } else {
      // Lỗi thiết lập request
      console.error('Lỗi cấu hình yêu cầu:', error.message);
      return Promise.reject(error);
    }
  }
);

export default api;
