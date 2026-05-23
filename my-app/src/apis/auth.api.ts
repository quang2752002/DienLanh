import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7015/api";

export const authApi = {
  login: async (data: { username?: string; password?: string; recaptchaToken?: string }) => {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    return response.data;
  },

  googleLogin: async (data: { idToken: string }) => {
    const response = await axios.post(`${API_URL}/auth/google-login`, data);
    return response.data;
  }
};
