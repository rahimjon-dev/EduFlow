import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '../types';
import { apiClient, getToken, setToken, clearToken, loadStoredApiUrl } from '../services/apiClient';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password?: string }) => Promise<UserRole>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    try {
      const token = await getToken();
      if (!token) {
        setCurrentUser(null);
        return;
      }

      const res = await apiClient.get<any>('/auth/me');
      const profile = res?.data || res;

      if (profile && (profile.id || profile.email)) {
        const role = (profile.role || 'STUDENT') as UserRole;
        const user: User = {
          id: profile.id,
          name: profile.fullName || 'Foydalanuvchi',
          email: profile.email,
          role,
          phone: profile.phone,
          createdAt: profile.createdAt || new Date().toISOString(),
        };
        setCurrentUser(user);
        await AsyncStorage.setItem('eduflow_user_data', JSON.stringify(user));
      }
    } catch (err: any) {
      console.warn('Profile refresh error:', err?.message);
      // If unauthorized, log out
      if (err?.status === 401) {
        await logout();
      }
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await loadStoredApiUrl();
        const savedUserJson = await AsyncStorage.getItem('eduflow_user_data');
        if (savedUserJson) {
          setCurrentUser(JSON.parse(savedUserJson));
        }

        const token = await getToken();
        if (token) {
          await refreshProfile();
        }
      } catch (err) {
        console.warn('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: { email: string; password?: string }): Promise<UserRole> => {
    const email = credentials.email.trim();
    const password = credentials.password || '';

    // Direct, real HTTP call to backend PostgreSQL authentication
    const result = await apiClient.post<any>('/auth/login', {
      email,
      password,
    });

    if (result && result.token) {
      await setToken(result.token);
      const apiUser = result.user || {};
      const resolvedRole = (result.role || apiUser.role || 'STUDENT') as UserRole;

      const user: User = {
        id: apiUser.id || 'usr-active',
        name: apiUser.fullName || apiUser.name || 'Foydalanuvchi',
        email: apiUser.email || email,
        role: resolvedRole,
        phone: apiUser.phone,
        createdAt: apiUser.createdAt || new Date().toISOString(),
      };

      setCurrentUser(user);
      await AsyncStorage.setItem('eduflow_user_data', JSON.stringify(user));
      return resolvedRole;
    }

    throw new Error("Serverdan kutilmagan javob keldi yoki token olinmadi");
  };

  const logout = async (): Promise<void> => {
    setCurrentUser(null);
    await AsyncStorage.removeItem('eduflow_user_data');
    await clearToken();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
