'use client';

import React, { useState, useContext, createContext, useEffect } from 'react';

import AuthContext from './AuthContext';
import { useAuth } from '../common/useAuth';
import { IAuth } from '../app/types/user.type';

export const AuthProvider = ({ children, auth }: { children: React.ReactNode, auth: IAuth | null }) => {
    const { user, login, logout, checkAuth, setAuth } = useAuth(auth);
    const signIn = async (email: string, password: string) => {
        return await login(email, password)
    }

    const signOut = async () => {
        return await logout()
    }

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};