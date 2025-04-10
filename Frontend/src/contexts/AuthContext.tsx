import React, { useEffect, useState, createContext, useContext } from 'react';
interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  githubLogin: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}
const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  // Mock authentication functions - these would connect to your Spring Boot backend
  const login = async (email: string, password: string) => {
    try {
      // This would be a real API call in production
      console.log('Logging in with:', email, password);
      // Mock successful login
      const mockUser = {
        id: '123',
        name: 'Test User',
        email: email,
        avatarUrl: 'https://i.pravatar.cc/150?u=' + email
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };
  const googleLogin = async () => {
    try {
      // This would trigger OAuth flow with Google in production
      console.log('Logging in with Google');
      // Mock successful login
      const mockUser = {
        id: '456',
        name: 'Google User',
        email: 'google@example.com',
        avatarUrl: 'https://i.pravatar.cc/150?u=google'
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  };
  const githubLogin = async () => {
    try {
      // This would trigger OAuth flow with GitHub in production
      console.log('Logging in with GitHub');
      // Mock successful login
      const mockUser = {
        id: '789',
        name: 'GitHub User',
        email: 'github@example.com',
        avatarUrl: 'https://i.pravatar.cc/150?u=github'
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('GitHub login failed:', error);
      throw error;
    }
  };
  const register = async (name: string, email: string, password: string) => {
    try {
      // This would be a real API call in production
      console.log('Registering:', name, email, password);
      // Mock successful registration
      const mockUser = {
        id: '123',
        name: name,
        email: email,
        avatarUrl: 'https://i.pravatar.cc/150?u=' + email
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = {
        ...user,
        ...userData
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };
  const value = {
    user,
    loading,
    login,
    googleLogin,
    githubLogin,
    register,
    logout,
    updateUser
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};