import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import type { User, UserRole, LoginCredentials } from '../types';
import { LanguageProvider } from '../i18n';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  setRole: (role: UserRole) => void;
}

const defaultUser: User = {
  id: 'usr-1',
  name: 'Eleanor Vance (Admin)',
  email: 'admin@eduflow.edu',
  role: 'ADMIN',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  createdAt: '2023-01-01',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('eduflow_mock_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultUser;
      }
    }
    return defaultUser;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('eduflow_mock_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('eduflow_mock_user');
    }
  }, [currentUser]);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    try {
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password || 'admin123',
          role: credentials.role,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || resData.message || 'Kirishda xatolik yuz berdi');
      }

      const userData = resData.data.user;
      const userRole: UserRole = resData.data.role;
      const token = resData.data.token;

      if (token) {
        localStorage.setItem('eduflow_auth_token', token);
      }

      const user: User = {
        id: userData.id,
        name: userData.fullName,
        email: userData.email,
        role: userRole,
        avatar:
          userRole === 'STUDENT'
            ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
            : userRole === 'TEACHER'
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        createdAt: userData.createdAt || '2026-01-01',
      };

      setCurrentUser(user);
      return true;
    } catch (err: any) {
      throw err;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('eduflow_mock_user');
    localStorage.removeItem('eduflow_auth_token');
  };

  const setRole = (role: UserRole) => {
    if (!currentUser) return;
    // Faqat ADMIN boshqa rollarga o'ta oladi
    if (currentUser.role !== 'ADMIN') {
      return;
    }
    const roleNames: Record<UserRole, string> = {
      ADMIN: 'Bosh Administrator',
      TEACHER: 'Anvar Narzullayev',
      STUDENT: 'Ali Valiyev',
      PARENT: 'Ziyoda Karimova (Ota-ona)',
    };

    setCurrentUser({
      ...currentUser,
      role,
      name: roleNames[role] || currentUser.name,
    });
  };

  return (
    <LanguageProvider>
      <AuthContext.Provider
        value={{
          currentUser,
          isAuthenticated: !!currentUser,
          login,
          logout,
          setRole,
        }}
      >
        {children}
      </AuthContext.Provider>
    </LanguageProvider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AppProviders context');
  }
  return context;
};

/**
 * Route protection guard for role-based access
 */
export const ProtectedRoute: React.FC<{
  allowedRoles?: UserRole[];
  children: React.ReactNode;
}> = ({ allowedRoles, children }) => {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // If authenticated but wrong role, redirect to appropriate role dashboard
    const roleRedirects: Record<UserRole, string> = {
      ADMIN: '/admin/dashboard',
      TEACHER: '/teacher/dashboard',
      STUDENT: '/student/dashboard',
      PARENT: '/parent/dashboard',
    };
    return <Navigate to={roleRedirects[currentUser.role]} replace />;
  }

  return <>{children}</>;
};
