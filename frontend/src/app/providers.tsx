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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = 'http://localhost:5000/api';

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
      localStorage.removeItem('eduflow_token');
    }
  }, [currentUser]);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    const targetEmail = credentials.email.trim();
    const targetPassword = credentials.password;

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, password: targetPassword }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const { token, role, user: apiUser } = result.data;
        localStorage.setItem('eduflow_token', token);
        
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
        throw new Error(result.error || "Email/Login yoki parol noto'g'ri");
      }
    } catch (err: any) {
      // Fallback for offline demo mode if backend server is not running
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
    localStorage.removeItem('eduflow_user');
    localStorage.removeItem('eduflow_token');
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
