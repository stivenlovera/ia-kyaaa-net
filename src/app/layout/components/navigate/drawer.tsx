'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { initialStateMenu, ListMenu } from '../../layout.type'
import { IAuth } from '@/src/app/types/user.type'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/src/providers/AuthContext'
interface DrawerProps {
    openDrawer: boolean
    onDrawerClose: () => void
    onLogin: () => void
    user: IAuth
}
const Drawer = ({ openDrawer, onDrawerClose, onLogin, user }: DrawerProps) => {
    const router = useRouter();
    const { signOut } = useAuth()
    const [menu] = useState<ListMenu[]>(initialStateMenu);
    return (
        <>
            <div className={`${!openDrawer && "hidden"} bg-dark-600/50 min-h-screen w-full fixed top-0 left-0 right-0 backdrop-blur-sm`} onClick={() => onDrawerClose()}></div>
            <div className={`${openDrawer ? "w-80" : "w-0"} bg-neutral-800 min-h-screen fixed top-0 left-0 transition-all duration-300`}>
                <div className={`${!openDrawer && "hidden"} pt-3 text-center `}>
                    {
                        menu.map((menu, i) => {
                            return (
                                <div className='p-1' key={i}>
                                    <Link
                                        href={menu.url}
                                        className="block p-3 hover:text-blue-400 hover:bg-blue-950"
                                        onClick={() => { onDrawerClose() }}
                                    >
                                        {menu.name}
                                    </Link>
                                </div>
                            )
                        })
                    }
                    <div className='p-1'>
                        <hr />
                        {user !== null ? (
                            <div className=' '>
                                <Link
                                    href={'/my-purchases'}
                                    className="block p-3 hover:text-blue-400 hover:bg-blue-950"
                                    onClick={() => { onDrawerClose() }}
                                >
                                    Mis compras
                                </Link>
                                <Link
                                    href={'/favorites'}
                                    className="block p-3 hover:text-blue-400 hover:bg-blue-950"
                                    onClick={() => { onDrawerClose() }}
                                >
                                    Favoritos
                                </Link>
                                <Link
                                    href={'/my-account'}
                                    className="block p-3 hover:text-blue-400 hover:bg-blue-950"
                                    onClick={() => { onDrawerClose() }}
                                >
                                    Mi cuenta
                                </Link>
                                <button
                                    className="block p-3 hover:text-blue-400 hover:bg-blue-950  w-full"
                                    onClick={() => {
                                        signOut()
                                        router.push('/login');
                                        onDrawerClose()
                                    }}
                                >
                                    Cerrar sesion
                                </button>
                            </div>
                        ) : (
                            <div className=' hover:bg-blue-950 '>
                                <Link
                                    href={'/login'}
                                    className="block p-3 hover:text-blue-400 hover:bg-blue-950"
                                    onClick={() => { onDrawerClose() }}
                                >
                                    Inicia sesion
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Drawer
