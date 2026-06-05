'use client';
import { useState, useEffect } from 'react';
import { IResponse } from '../app/types/response';
import { IAuth, IUserAuth } from '../app/types/user.type';
import API from '../providers/api';

export function useAuth(auth: IAuth | null) {
    const [user, setUser] = useState<IAuth | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (auth !== null) {
            setUser(auth);
        }
    }, [auth]);

    const setAuth = async (auth: IAuth | null) => {
        setUser(auth)
    };

    const checkAuth = async () => {
        try {
            const response = await API.get<IResponse<IUserAuth>>('/api/auth/protected');
            //const data:  = await response.json();
            if (response.data.success) {
                setUser(response.data.data.user);
            } else {
                setUser(null);
                //signOut()
            }
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (data.success) {
            setUser(data.user);
            return { success: true, message: data.message };
        }

        return { success: false, message: data.message };
    };

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        console.log('logout', user)
        //router.push('/login');
    };

    const refreshToken = async () => {
        try {
            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
            });

            const data = await response.json();
            return data.success;
        } catch (error) {
            return false;
        }
    };

    const validToken = async () => {
        try {
            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
            });

            const data = await response.json();
            return data.success;
        } catch (error) {
            return false;
        }
    };


    return { user, loading, login, logout, refreshToken, checkAuth, setAuth };
}