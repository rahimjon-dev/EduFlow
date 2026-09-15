/**
 * EduFlow API Client Foundation
 * 
 * Prepares the application for backend integration.
 * In production/real mode, calls point to VITE_API_BASE_URL.
 * In development/mock mode, service methods encapsulate async resolution
 * while maintaining the identical async interface (Promise<T>).
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.eduflow.local/v1';

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
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Simulates network latency for realistic frontend testing.
 */
export const simulateLatency = (ms: number = 250): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Standard HTTP Request Wrapper for future REST API integration.
 */
export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...customConfig } = options;

  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const token = localStorage.getItem('eduflow_auth_token');

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
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(data.message || 'API request failed', response.status, data);
    }

    return data as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || 'Network connection failed', 0);
  }
}

export const apiClient = {
  get: <T>(endpoint: string, params?: Record<string, any>) => request<T>(endpoint, { method: 'GET', params }),
  post: <T>(endpoint: string, body?: any) => request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body?: any) => request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body?: any) => request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
