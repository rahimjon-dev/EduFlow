import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import type { User, UserRole, LoginCredentials } from '../types';

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
      } catch (e) {
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
    const targetRole: UserRole = credentials.role || 'ADMIN';
    const roleNames: Record<UserRole, string> = {
      ADMIN: 'Director Eleanor Vance',
      TEACHER: 'Prof. Marcus Chen',
      STUDENT: 'Alexander Wright',
      PARENT: 'Robert Wright (Parent)',
    };

    const newUser: User = {
      id: `usr-${targetRole.toLowerCase()}`,
      name: roleNames[targetRole],
      email: credentials.email || `${targetRole.toLowerCase()}@eduflow.edu`,
      role: targetRole,
      avatar:
        targetRole === 'STUDENT'
          ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
          : targetRole === 'TEACHER'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: '2023-01-01',
    };

    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('eduflow_mock_user');
  };

  const setRole = (role: UserRole) => {
    if (!currentUser) return;
    const roleNames: Record<UserRole, string> = {
      ADMIN: 'Director Eleanor Vance',
      TEACHER: 'Prof. Marcus Chen',
      STUDENT: 'Alexander Wright',
      PARENT: 'Robert Wright (Parent)',
    };

    setCurrentUser({
      ...currentUser,
      role,
      name: roleNames[role],
    });
  };

  return (
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
