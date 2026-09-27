'use client'
import { useState } from 'react'
import moment from 'moment'
import Link from 'next/link'
import { FaGear, FaPen, FaPlus, FaTrash } from 'react-icons/fa6'
import { useRouter } from '@/src/i18n/navigation'
import { IAdminPack } from '@/src/app/types/pack.types'
import { DialogPackForm } from './dialog-pack-form'
import { DialogDeletePack } from './dialog-delete-pack'

interface PackListProps {
    packs: IAdminPack[]
}

export const PackList = ({ packs }: PackListProps) => {
    const router = useRouter()
    const [editingPack, setEditingPack] = useState<IAdminPack | null | undefined>(undefined)
    const [deletingPack, setDeletingPack] = useState<IAdminPack | null>(null)

    const refresh = () => { router.refresh() }

    return (
        <div>
            <div className='flex justify-end pb-3'>
                <button
                    className='btn-primary flex items-center gap-2'
                    type='button'
                    onClick={() => { setEditingPack(null) }}
                >
                    <FaPlus /> Crear pack
                </button>
            </div>
            <div className='overflow-x-auto'>
                <table className='w-full text-left'>
                    <thead>
                        <tr className='border-b border-neutral-700'>
                            <th className='p-2'>Nombre</th>
                            <th className='p-2'>Código</th>
                            <th className='p-2'>Precio</th>
                            <th className='p-2'>Estado</th>
                            <th className='p-2'>Actualizado</th>
                            <th className='p-2'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {packs.length === 0 ? (
                            <tr>
                                <td className='p-2' colSpan={6}>No hay packs registrados.</td>
                            </tr>
                        ) : packs.map((pack) => (
                            <tr key={pack.pack_id} className='border-b border-neutral-800'>
                                <td className='p-2'>{pack.name}</td>
                                <td className='p-2'>{pack.code}</td>
                                <td className='p-2'>{pack.price_list}</td>
                                <td className='p-2'>{pack.state === 1 ? 'Activo' : 'Inactivo'}</td>
                                <td className='p-2'>{pack.update_at ? moment(pack.update_at).format('DD/MM/yyyy hh:mm') : ''}</td>
                                <td className='p-2'>
                                    <div className='flex justify-end gap-2'>
                                        <button
                                            className='btn-primary-icon'
                                            type='button'
                                            aria-label='Editar'
                                            onClick={() => { setEditingPack(pack) }}
                                        >
                                            <FaPen />
                                        </button>
                                        <Link
                                            className='btn-primary-icon'
                                            aria-label='Gestionar relaciones y páginas'
                                            title='Gestionar relaciones y páginas'
                                            href={`/admin/pack/edit?code=${pack.code}`}
                                        >
                                            <FaGear />
                                        </Link>
                                        <button
                                            className='btn-primary-icon text-red-500'
                                            type='button'
                                            aria-label='Eliminar'
                                            onClick={() => { setDeletingPack(pack) }}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <DialogPackForm
                open={editingPack !== undefined}
                pack={editingPack}
                onClose={() => { setEditingPack(undefined) }}
                onSaved={refresh}
            />
            <DialogDeletePack
                open={deletingPack !== null}
                pack={deletingPack}
                onClose={() => { setDeletingPack(null) }}
                onDeleted={refresh}
            />
        </div>
    )
}
