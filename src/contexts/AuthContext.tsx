
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Define user types and interfaces
interface User {
  username: string;
  isAdmin: boolean;
}

type UserCredentials = {
  username: string;
  password: string;
};

// Mock user data - in a real app this would come from Supabase
const initialUsers: UserCredentials[] = [
  { username: 'admin', password: 'cabintrip' },
  { username: 'user1', password: 'password' },
  { username: 'user2', password: 'password' },
];

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addUser: (username: string, password: string, isAdmin?: boolean) => boolean;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
  addUser: () => false,
  isAdmin: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserCredentials[]>(() => {
    const savedUsers = localStorage.getItem('cabin-users');
    return savedUsers ? JSON.parse(savedUsers) : initialUsers;
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('cabin-current-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAuthenticated = currentUser !== null;
  const isAdmin = currentUser?.isAdmin || false;

  useEffect(() => {
    // Save users to localStorage when they change
    localStorage.setItem('cabin-users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    // Save current user to localStorage when it changes
    if (currentUser) {
      localStorage.setItem('cabin-current-user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cabin-current-user');
    }
  }, [currentUser]);

  const login = (username: string, password: string): boolean => {
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      const isUserAdmin = username === 'admin'; // Simple admin check
      setCurrentUser({ username, isAdmin: isUserAdmin });
      toast.success(`Welcome back, ${username}!`);
      return true;
    }
    
    toast.error('Invalid username or password');
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    toast.info('You have been logged out');
  };

  const addUser = (username: string, password: string, isAdmin: boolean = false): boolean => {
    // Check if user already exists
    if (users.some(u => u.username === username)) {
      toast.error('Username already exists');
      return false;
    }

    // Add new user
    setUsers([...users, { username, password }]);
    toast.success(`User ${username} added successfully`);
    return true;
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isAuthenticated, 
      login, 
      logout, 
      addUser,
      isAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
