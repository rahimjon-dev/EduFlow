import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '../types';
import { apiClient, getToken, setToken, clearToken, loadStoredApiUrl, ApiError } from '../services/apiClient';

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

      // If this is a demo session, preserve local user without making remote call
      if (token.startsWith('demo-token')) {
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
      // If server explicitly returned 401 Unauthorized, log out
      if (err instanceof ApiError && err.status === 401) {
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

    try {
      // 1. Attempt real API authentication with backend
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
    } catch (err: any) {
      // If server explicitly returns 401 (wrong password on live server), throw error
      if (err instanceof ApiError && err.status === 401) {
        throw new Error("Email yoki parol noto'g'ri");
      }

      // 2. Offline / Demo Fallback Mode (when backend is unavailable or during demo testing)
      console.log('Using Offline Demo Authentication fallback:', err?.message);

      const searchEmail = email.toLowerCase();
      const isAdmin = searchEmail === 'admin' || searchEmail === 'admin@eduflow.uz';

      if (isAdmin && password !== '0603' && password !== 'admin123') {
        throw new Error("Admin paroli noto'g'ri (parol: 0603)");
      }

      let resolvedRole: UserRole = 'STUDENT';
      let resolvedName = 'Ali Valiyev';

      if (isAdmin) {
        resolvedRole = 'ADMIN';
        resolvedName = 'Bosh Administrator';
      } else if (searchEmail.includes('teacher')) {
        resolvedRole = 'TEACHER';
        resolvedName = 'Anvar Narzullayev';
      } else if (searchEmail.includes('parent')) {
        resolvedRole = 'PARENT';
        resolvedName = 'Ziyoda Karimova (Ota-ona)';
      } else {
        resolvedRole = 'STUDENT';
        resolvedName = email.split('@')[0] || 'Talaba';
      }

      const demoUser: User = {
        id: `demo-${resolvedRole.toLowerCase()}`,
        name: resolvedName,
        email: email.includes('@') ? email : `${resolvedRole.toLowerCase()}@eduflow.uz`,
        role: resolvedRole,
        phone: '+998 90 123 45 67',
        createdAt: new Date().toISOString(),
      };

      await setToken(`demo-token-${Date.now()}`);
      setCurrentUser(demoUser);
      await AsyncStorage.setItem('eduflow_user_data', JSON.stringify(demoUser));
      return resolvedRole;
    }

    throw new Error("Tizimga kirishda xatolik yuz berdi");
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
