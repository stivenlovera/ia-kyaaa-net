'use client'
import React, { useEffect, useState } from 'react'
import { IResponse } from '../../types/response';
import { Card } from './card';
import { INewPacksAuth } from '../../types/pack.types';
import API from '@/src/providers/api';

export const ListNew = () => {
    const [packs, setPacks] = useState<INewPacksAuth[]>([])

    const fetchLike = async (pack_id: number) => {
        await fetchChangeLike(pack_id)
        await fetchNewList()
    }

    const fetchFavorite = async (pack_id: number) => {
        await fetchChangeFavorite(pack_id)
        await fetchNewList()
    }

    const fetchBuy = async (pack_id: number) => {
        await fetchChangeBuy(pack_id)
        await fetchNewList()
    }

    const fetchNewList = async () => {
        try {
            const response = await fetch('/api/pack/new');
            const data: IResponse<INewPacksAuth[]> = await response.json();
            setPacks(data.data)
        } catch (error) {
            console.error('Error fetching protected data:', error);
        } finally {
        }
    };

    const fetchChangeLike = async (pack_id: number) => {
        try {
            const response = await API.post<IResponse<INewPacksAuth[]>>('/api/like-pack', { pack_id });
        } catch (error) {
            console.error('Error fetching protected data:', error);
        } finally {
        }
    };

    const fetchChangeFavorite = async (pack_id: number) => {
        try {
            const response = await API.post<IResponse<INewPacksAuth[]>>('/api/favorite-pack', { pack_id });
        } catch (error) {
            console.error('Error fetching protected data:', error);
        } finally {
        }
    };

        const fetchChangeBuy = async (pack_id: number) => {
        try {
            const response = await API.post<IResponse<INewPacksAuth[]>>('/api/buy-pack', { pack_id });
        } catch (error) {
            console.error('Error fetching protected data:', error);
        } finally {
        }
    };

    useEffect(() => {
        fetchNewList()
    }, [])

    return (
        <div className="card">
            <div className="p-3 pt-0" >
                <p className="text-center text-3xl">Nuevas entradas</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-2 lg:gap-3 xl:gap-4">
                {
                    packs.map((pack, i) => {
                        const urlImage = `${process.env.NEXT_PUBLIC_PACKS_URL_S3}/${pack.code}/${pack.pages[0].page_size[0].size.name}/${pack.pages[0].num}.${pack.pages[0].page_size[0].size.extension}`
                        //const urlImage = `${process.env.URL_S3}/${pack.code}/${pack.pages[0].page_size[0].size.name}/${pack.pages[0].num}.${pack.pages[0].page_size[0].size.extension}`
                        return (
                            <Card
                                pack_id={pack.pack_id}
                                code={pack.code}
                                name={pack.name}
                                urlImage={urlImage}
                                key={i}
                                like={pack.like}
                                onLike={fetchLike}
                                favorite={pack.favorite}
                                onFavorite={fetchFavorite}
                                buy={pack.buy}
                                onBuy={fetchBuy}
                            ></Card>
                        )
                    })
                }
            </div>
        </div>
    )
}
