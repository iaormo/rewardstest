
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, Tier } from '../types'; // Tier might be needed for tier determination logic
import { USERS, TIERS } from '../constants'; // Mock user data and TIERS for tier logic

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (userId: string) => void;
  logout: () => void;
  updateUserPoints: (userId: string, points: number) => void;
  updateUserProfile: (userId: string, updatedData: Partial<Pick<User, 'name' | 'email' | 'phone' | 'profileImageUrl'>>) => void;
  registerUser: (name: string, email: string, phone?: string) => Promise<User>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to determine tier - can be shared or duplicated if small
const determineUserTier = (points: number): string => {
    let determinedTierId = TIERS[0].id; // Default to the first tier
    for (let i = TIERS.length - 1; i >= 0; i--) {
      if (points >= TIERS[i].minPoints) {
        determinedTierId = TIERS[i].id;
        break;
      }
    }
    return determinedTierId;
};


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Ensure date fields are correctly parsed if stored as strings
        if (parsedUser.registrationDate) {
            parsedUser.registrationDate = new Date(parsedUser.registrationDate);
        }
        return parsedUser;
      } catch (error) {
        console.error("Failed to parse stored user from localStorage:", error);
        localStorage.removeItem('currentUser');
        return null;
      }
    }
    return null;
  });

  const [users, setUsers] = useState<User[]>(() => {
     const storedUsers = localStorage.getItem('appUsers');
     try {
        const parsedUsers = storedUsers ? JSON.parse(storedUsers) : USERS;
        return parsedUsers.map((user: User) => ({
            ...user,
            registrationDate: user.registrationDate ? new Date(user.registrationDate) : undefined
        }));
     } catch(e) {
        console.error("Failed to parse appUsers from localStorage", e);
        return USERS.map(user => ({
            ...user,
            registrationDate: user.registrationDate ? new Date(user.registrationDate) : undefined
        }));
     }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      // Also update the user in the `users` list to maintain consistency
      setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? currentUser : u));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('appUsers', JSON.stringify(users));
  }, [users]);


  const login = (userId: string) => {
    const userToLogin = users.find(user => user.id === userId);
    if (userToLogin) {
      // Ensure tier is up-to-date on login
      const correctTierId = determineUserTier(userToLogin.points);
      const updatedUser = { ...userToLogin, tierId: correctTierId };
      setCurrentUser(updatedUser);
    } else {
      console.error("User not found for login");
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };
  
  const updateUserPoints = (userId: string, points: number) => {
    const newTierId = determineUserTier(points);
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, points: points, tierId: newTierId } : user
      )
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, points: points, tierId: newTierId } : null);
    }
  };

  const updateUserProfile = (userId: string, updatedData: Partial<Pick<User, 'name' | 'email' | 'phone' | 'profileImageUrl'>>) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, ...updatedData } : user
      )
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, ...updatedData } : null);
    }
  };

  const registerUser = async (name: string, email: string, phone?: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        if (users.find(user => user.email.toLowerCase() === email.toLowerCase())) {
          reject(new Error('An account with this email address already exists.'));
          return;
        }

        const newUser: User = {
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name,
          email,
          phone: phone || undefined,
          points: 0,
          tierId: determineUserTier(0), // Initial tier based on 0 points
          isAdmin: false,
          registrationDate: new Date(),
          profileImageUrl: undefined,
        };

        setUsers(prevUsers => [...prevUsers, newUser]);
        resolve(newUser);
      }, 500);
    });
  };

  return (
    <AuthContext.Provider value={{ currentUser, users, login, logout, updateUserPoints, updateUserProfile, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
};
