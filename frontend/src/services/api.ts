import axios, { AxiosRequestConfig } from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
// const API_URL = process.env.REACT_APP_API_URL;

// Taskインターフェースを定義
export interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
}

const api = axios.create({
  baseURL: '/api', // プロキシを使用
});

api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await api.get('/tasks');
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const createTask = async (taskData: Partial<Task>): Promise<Task> => {
  try {
    const response = await api.post('/tasks', taskData);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (taskId: number, updatedData: Partial<Task>): Promise<Task> => {
  try {
    const response = await api.put(`/tasks/${taskId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (taskId: number): Promise<void> => {
  try {
    await api.delete(`/tasks/${taskId}`);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const searchTasks = async (params: any): Promise<Task[]> => {
  try {
    const response = await api.get('/tasks/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching tasks:', error);
    throw error;
  }
};