import axios from 'axios';

const API_URL = '/api'; // プロキシを使用するため、相対パスに変更

export const login = async (email: string, password: string): Promise<string> => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data.token;
};

export const signup = async (email: string, password: string): Promise<void> => {
  await axios.post(`${API_URL}/auth/signup`, { email, password });
};