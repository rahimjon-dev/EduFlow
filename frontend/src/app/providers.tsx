import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import type { User, UserRole, LoginCredentials } from '../types';
import { LanguageProvider } from '../i18n';

import { getToken, setToken, clearToken, apiClient, ApiError } from '../services/api/apiClient';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('eduflow_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('eduflow_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('eduflow_user');
      clearToken();
    }
  }, [currentUser]);

  // Synchronize and verify current user with backend session
  useEffect(() => {
    const token = getToken();
    if (token) {
      apiClient.get<any>('/auth/me')
        .then((profile) => {
          if (profile && profile.id) {
            const role = (profile.role || 'STUDENT') as UserRole;
            setCurrentUser((prev) => ({
              id: profile.id,
              name: profile.fullName || 'Foydalanuvchi',
              email: profile.email,
              role,
              avatar:
                prev?.avatar ||
                (role === 'STUDENT'
                  ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
                  : role === 'TEACHER'
                  ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
                  : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
              createdAt: profile.createdAt || prev?.createdAt || new Date().toISOString(),
            }));
          }
        })
        .catch(() => {
          // If token expired or invalid, keep existing cache or clear if unauthorized
        });
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    const targetEmail = credentials.email.trim();
    const targetPassword = credentials.password;

    try {
      const result = await apiClient.post<any>('/auth/login', {
        email: targetEmail,
        password: targetPassword,
      });

      if (result && result.token) {
        const { token, role, user: apiUser } = result;
        setToken(token);

        const formattedUser: User = {
          id: apiUser.id,
          name: apiUser.fullName || apiUser.name || 'Foydalanuvchi',
          email: apiUser.email,
          role: role as UserRole,
          avatar:
            role === 'STUDENT'
              ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
              : role === 'TEACHER'
              ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
              : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          createdAt: apiUser.createdAt || new Date().toISOString(),
        };

        setCurrentUser(formattedUser);
        return true;
      } else {
        throw new Error("Email yoki parol noto'g'ri");
      }
    } catch (err: any) {
      // If ApiError with 401 or specific backend message, propagate real error
      if (err instanceof ApiError && err.status !== 0) {
        throw err;
      }

      // Offline / fallback demo mode if backend is unreachable
      const role: UserRole = credentials.role || (targetEmail.toLowerCase() === 'admin' ? 'ADMIN' : 'STUDENT');
      const roleNames: Record<UserRole, string> = {
        ADMIN: 'Bosh Administrator',
        TEACHER: 'Anvar Narzullayev',
        STUDENT: 'Ali Valiyev',
        PARENT: 'Ziyoda Karimova (Ota-ona)',
      };

      if (targetEmail.toLowerCase() === 'admin' && targetPassword !== '0603') {
        throw new Error("Admin paroli noto'g'ri (parol: 0603)");
      }

      const mockUser: User = {
        id: `usr-${role.toLowerCase()}`,
        name: roleNames[role],
        email: targetEmail.includes('@') ? targetEmail : `${role.toLowerCase()}@eduflow.uz`,
        role,
        avatar:
          role === 'STUDENT'
            ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
            : role === 'TEACHER'
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        createdAt: '2026-01-01',
      };

      setCurrentUser(mockUser);
      return true;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    clearToken();
  };

  const setRole = (role: UserRole) => {
    if (!currentUser) return;
    const roleNames: Record<UserRole, string> = {
      ADMIN: 'Bosh Administrator',
      TEACHER: 'Anvar Narzullayev',
      STUDENT: 'Ali Valiyev',
      PARENT: 'Ziyoda Karimova (Ota-ona)',
    };

    setCurrentUser({
      ...currentUser,
      role,
      name: roleNames[role],
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
 * Route protection guard for strict role-based access
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
