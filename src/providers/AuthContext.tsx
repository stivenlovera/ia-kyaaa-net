'use client';

import { createContext, useContext } from 'react';
import { User } from '../app/api/auth/_types/login';

// Define the shape of your context data
interface AuthContextType {
    user: User | null;
    signIn: (email: string, password: string) => Promise<{ success: boolean, message: string }>
    signOut: () => void;
    checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;