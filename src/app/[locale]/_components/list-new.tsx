'use client'
import React, { useEffect, useState } from 'react'
import { IResponse } from '../../types/response';
import { IPack } from '../pack/_types/code.type';
import { Card } from './card';

export const ListNew = () => {
    const [packs, setPacks] = useState<IPack[]>([])

    //const urlImage = `/api/image-proxy?url=${process.env.URL_S3}/${pack.code}/${pack.pages[0].page_size[0].size.name}/${pack.pages[0].num}.${pack.pages[0].page_size[0].size.extension}`
    //const urlImage = `${process.env.URL_S3}/${pack.code}/${pack.pages[0].page_size[0].size.name}/${pack.pages[0].num}.${pack.pages[0].page_size[0].size.extension}`

    const fetchProtectedData = async () => {
        try {
            const response = await fetch('/api/pack/new');
            const data: IResponse<IPack[]> = await response.json();
            console.log('fetchProtectedData', data)
            setPacks(data.data)
        } catch (error) {
            console.error('Error fetching protected data:', error);
        } finally {
        }
    };

    useEffect(() => {
        fetchProtectedData()
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
                                code={pack.code}
                                name={pack.name}
                                urlImage={urlImage}
                                key={i}
                            ></Card>
                        )
                    })
                }
            </div>
        </div>
    )
}
