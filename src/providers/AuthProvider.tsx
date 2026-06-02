'use client';

import React, { useState, useContext, createContext, useEffect } from 'react';

import AuthContext from './AuthContext';
import { useAuth } from '../common/useAuth';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, login, logout, checkAuth } = useAuth();
    const signIn = async (email: string, password: string) => {
        return await login(email, password)
    }

    const signOut = async () => {
        return await logout()
    }

    useEffect(() => {
    }, [user])

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};