'use client'
import React, { useEffect, useState } from 'react'
import { IResponse } from '../../types/response';
import { IAuthUser } from '../../_types/user.type';
import API from '@/src/providers/api';

export const Welcome = () => {
    const [name, setName] = useState<string | null>(null);
    //const { signOut } = useAuth()

    const fetchProtectedData = async () => {
        try {
            const response = await API.get<IResponse<IAuthUser>>('/api/auth/protected')
            if (response.status === 200) {
                setName(response.data.data.user.name);
            }

            /* const response = await fetch('/api/auth/protected');
            const data: IResponse<IAuthUser> = await response.json();
            console.log('fetchProtectedData', data)
            if (data.success) {
                setName(data.data.user.name);
            }
            if (response.status === 401) {
                signOut()
            } */
        } catch (error) {
            //console.error('Error fetching protected data:', error);
        } finally {
        }
    };

    useEffect(() => {
        //fetchProtectedData();
    }, []);

    return (
        <div>welcome {name}</div>
    )
}
