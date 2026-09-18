/**
 * EduFlow API Client Foundation
 * 
 * Standard HTTP Request Wrapper for EduFlow REST API with JWT authorization.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

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

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

export const getToken = (): string | null => {
  return localStorage.getItem('eduflow_token') || localStorage.getItem('eduflow_auth_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('eduflow_token', token);
};

export const clearToken = (): void => {
  localStorage.removeItem('eduflow_token');
  localStorage.removeItem('eduflow_auth_token');
};

/**
 * Simulates network latency for fallback / offline mode.
 */
export const simulateLatency = (ms: number = 150): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Standard HTTP Request Wrapper for REST API integration.
 */
export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...customConfig } = options;

  let url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
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

  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(customConfig.headers as Record<string, string>),
  };

  const config: RequestInit = {
    ...customConfig,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Handle 204 No Content
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
        } else if (data.issues && Array.isArray(data.issues)) {
          errMsg = data.issues.map((i: any) => i.message).join(', ');
        }
      }
      throw new ApiError(errMsg, response.status, data);
    }

    // If API returns wrapped response { success: true, data: [...] }
    if (data && typeof data === 'object' && 'data' in data && data.success !== undefined) {
      return data.data as T;
    }

    return data as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || 'Tarmoqqa ulanishda xatolik yuz berdi', 0);
  }
}

export const apiClient = {
  get: <T>(endpoint: string, params?: Record<string, any>) => request<T>(endpoint, { method: 'GET', params }),
  post: <T>(endpoint: string, body?: any) => request<T>(endpoint, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),
  put: <T>(endpoint: string, body?: any) => request<T>(endpoint, { method: 'PUT', body: body !== undefined ? JSON.stringify(body) : undefined }),
  patch: <T>(endpoint: string, body?: any) => request<T>(endpoint, { method: 'PATCH', body: body !== undefined ? JSON.stringify(body) : undefined }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
