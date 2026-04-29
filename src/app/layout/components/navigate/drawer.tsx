'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { initialStateMenu, ListMenu } from '../../layout.type'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faCircleUser } from '@fortawesome/free-solid-svg-icons'
interface DrawerProps {
    openDrawer: boolean
    onDrawerClose: () => void
    onLogin: () => void
}
const Drawer = ({ openDrawer, onDrawerClose, onLogin }: DrawerProps) => {
    const [menu, setMenu] = useState<ListMenu[]>(initialStateMenu);
    return (
        <>
            <div className={`${!openDrawer && "hidden"} bg-dark-600/50 min-h-screen w-full fixed top-0 left-0 right-0 backdrop-blur-sm`} onClick={() => onDrawerClose()}></div>
            <div className={`${openDrawer ? "w-80" : "w-0"} bg-slate-950 min-h-screen fixed top-0 left-0 transition-all duration-300`}>
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
                        <div className=' hover:bg-blue-950 '>
                            <button
                                className='p-3'
                                onClick={() => { onLogin() }}
                            >
                                <div className='flex flex-row'>
                                    <FontAwesomeIcon
                                        className=''
                                        icon={faCircleUser}
                                        size='xl'
                                    />
                                    <p className='px-2'>Inicia sesion</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Drawer
