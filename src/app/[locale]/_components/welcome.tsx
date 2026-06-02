'use client'
import React, { useEffect, useState } from 'react'
import { IResponse } from '../../types/response';
import API from '@/src/providers/api';
import { IUserAuth } from '../../types/user.type';

export const Welcome = () => {
    const [name, setName] = useState<string | null>(null);
    //const { signOut } = useAuth()

    const fetchProtectedData = async () => {
        try {
            const response = await API.get<IResponse<IUserAuth>>('/api/auth/protected')
            if (response.status === 200) {
                setName(response.data.data.user.name);
            }
        } catch (error) {

        } finally {
        }
    };

    useEffect(() => {
        fetchProtectedData();
    }, []);

    return (
        <div>welcome {name}</div>
    )
}
