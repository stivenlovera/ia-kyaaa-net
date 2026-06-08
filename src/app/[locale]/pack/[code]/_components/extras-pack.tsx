'use client'
import { useAuth } from '@/src/providers/AuthContext';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react'
import { FaBookmark, FaDownload, FaHeart } from 'react-icons/fa'
import { DialogRegisterNow } from './dialog-register-now';
import API from '@/src/providers/api';
import { IResponse } from '@/src/app/types/response';
import { useRouter } from 'next/navigation';

interface IExtraPackProps {
    code: string
    price: number
    pack_id: number
    user_like: boolean,
    user_favorite: boolean
    user_buy: boolean
}
export const ExtraPack = ({
    code,
    price,
    pack_id,
    user_like,
    user_favorite,
    user_buy
}: IExtraPackProps) => {
    const router = useRouter();
    const t = useTranslations('pack-info');
    const { user } = useAuth()
    const [like, setLike] = useState(user_like)
    const [favorite, setFavorite] = useState(user_favorite)
    const [loading, setLoading] = useState(false)
    const [openDialogRegisterNow, setOpenDialogRegisterNow] = useState(false)

    const handleDownload = async () => {
        try {
            setLoading(true)
            // 1. Realizar la petición a tu API de backend
            const response = await fetch('https://usc1.contabostorage.com/698352ccd113428cb40866703a92c514:static/01.jpeg', {
                method: 'GET',
                headers: {
                    // Agrega tokens de autorización si tu API lo requiere

                }
            });

            if (!response.ok) throw new Error('Error al descargar el archivo');
            // 2. Convertir la respuesta a un objeto binario (Blob)
            const blob: Blob = await response.blob();
            // 3. Crear una URL temporal en el navegador para ese Blob
            const blobUrl: string = window.URL.createObjectURL(blob);
            // 4. Crear un elemento <a> invisible para forzar la descarga
            const link: HTMLAnchorElement = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', 'nombre_archivo_final.jpeg'); // Nombre con el que se guardará
            // 5. Añadir al DOM, hacer click y removerlo inmediatamente
            document.body.appendChild(link);
            link.click();
            // Limpieza de recursos de memoria en el cliente
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            setLoading(false)
        } catch (error) {
            console.error('Error durante la descarga:', error);
        } finally {
        }
    };

    const fetchChangeLike = async (pack_id: number) => {
        try {
            const { data } = await API.post<IResponse<boolean>>('/api/like-pack', { pack_id });
            if (data.success) {
                setLike(data.data)
            }
        } catch (error) {
            console.error('Error fetching protected data:', error);
        } finally {
        }
    };

    const fetchChangeFavorite = async (pack_id: number) => {
        try {
            const { data } = await API.post<IResponse<boolean>>('/api/favorite-pack', { pack_id });
            if (data.success) {
                setFavorite(data.data)
            }
        } catch (error) {
            console.error('Error fetching protected data:', error);
        } finally {
        }
    };

    return (
        <div>
            <div className="">
                <div className="flex justify-between gap-2">
                    <button className="btn-primary font-bold"
                        disabled={loading}
                        onClick={() => {
                            if (user !== null) {
                                handleDownload()
                            } else {
                                setOpenDialogRegisterNow(true)
                            }
                        }}
                    >
                        <div className="px-2">
                            {t('extra-pack.descarga')}
                        </div>
                        <FaDownload
                            className='text-xl text-white'
                        />
                    </button>
                    <div className="col-start-1 row-start-1 flex items-start justify-end gap-1">
                        <button
                            className="btn-primary p-3 border rounded-full border-neutral-600 cursor-pointer"
                            onClick={() => {
                                fetchChangeFavorite(pack_id);
                            }}
                        >
                            <FaBookmark
                                className={'text-xl ' + (favorite === true ? ' text-yellow-400' : 'text-white')}
                            />
                        </button>
                        <button
                            className="btn-primary p-3 border rounded-full border-neutral-600 cursor-pointer"
                            onClick={() => {
                                fetchChangeLike(pack_id);
                            }}
                        >
                            <FaHeart
                                className={'text-xl ' + (like === true ? ' text-red-600' : 'text-white')}
                            />
                        </button>
                    </div>
                </div>
            </div>
            {
                user_buy ? (
                    <div className='py-2'>
                        <button
                            className='btn-primary w-full font-bold'
                            disabled={loading}
                            onClick={() => {
                                if (user !== null) {
                                    router.push('/my-purchases');
                                }
                            }}
                        >
                            {t('extra-pack.ver_compras')}
                        </button>
                    </div>
                ) : (
                    <div className='py-2'>
                        <button
                            className='btn-primary w-full font-bold'
                            disabled={loading}
                            onClick={() => {
                                if (user !== null) {
                                    router.push(`/buy/${code}`);
                                } else {
                                    setOpenDialogRegisterNow(true)
                                }
                            }}
                        >
                            {t('extra-pack.comprar')} ${price}
                        </button>
                    </div>
                )
            }

            <DialogRegisterNow
                open={openDialogRegisterNow}
                onClose={(open) => {
                    setOpenDialogRegisterNow(open)
                }}
            ></DialogRegisterNow>
        </div>
    )
}
