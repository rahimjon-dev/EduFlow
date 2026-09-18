import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Real-time backend server
const defaultHost = 'http://192.168.1.11:5000/api';

let currentApiUrl = defaultHost;
let memoryToken: string | null = null;

export const setCustomApiUrl = async (url: string) => {
  currentApiUrl = url;
  try {
    await AsyncStorage.setItem('eduflow_api_url', url);
  } catch {}
};

export const loadStoredApiUrl = async () => {
  try {
    const saved = await AsyncStorage.getItem('eduflow_api_url');
    if (saved) currentApiUrl = saved;
  } catch {}
  return currentApiUrl;
};

export const getApiUrl = () => currentApiUrl;

export const getToken = async (): Promise<string | null> => {
  if (memoryToken) return memoryToken;
  try {
    const token = await AsyncStorage.getItem('eduflow_mobile_token');
    memoryToken = token;
    return token;
  } catch {
    return null;
  }
};

export const setToken = async (token: string): Promise<void> => {
  memoryToken = token;
  try {
    await AsyncStorage.setItem('eduflow_mobile_token', token);
  } catch {}
};

export const clearToken = async (): Promise<void> => {
  memoryToken = null;
  try {
    await AsyncStorage.removeItem('eduflow_mobile_token');
  } catch {}
};

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number = 500, data: any = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
  timeoutMs?: number;
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, timeoutMs = 8000, body, ...customConfig } = options;

  let url = endpoint.startsWith('http') ? endpoint : `${currentApiUrl}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const token = await getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(customConfig.headers || {}),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...customConfig,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 204) {
      return {} as T;
    }

    let data: any = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!response.ok) {
      let errMsg = 'API so‘rovi muvaffaqiyatsiz yakunlandi';
      if (data && typeof data === 'object') {
        if (data.error) {
          errMsg = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
        } else if (data.message) {
          errMsg = data.message;
        }
      }
      throw new ApiError(errMsg, response.status, data);
    }

    if (data && typeof data === 'object' && 'data' in data && data.success !== undefined) {
      return data.data as T;
    }

    return data as T;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || 'Serverga ulanib bo‘lmadi', 0);
  }
}

export const apiClient = {
  get: <T>(endpoint: string, params?: Record<string, any>) => request<T>(endpoint, { method: 'GET', params }),
  post: <T>(endpoint: string, body?: any) => request<T>(endpoint, { method: 'POST', body }),
  put: <T>(endpoint: string, body?: any) => request<T>(endpoint, { method: 'PUT', body }),
  patch: <T>(endpoint: string, body?: any) => request<T>(endpoint, { method: 'PATCH', body }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
