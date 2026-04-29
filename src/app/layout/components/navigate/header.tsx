"use client";
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';
import Image from 'next/image';

import {
    faCircleUser,
    faBars

} from "@fortawesome/free-solid-svg-icons";
import { initialStateMenu, ListMenu } from '../../layout.type';
import Drawer from './drawer';
import ModalLogin from '@/src/app/components/Auth/modalLogin';
import { TabAuth } from '@/src/app/components/Auth/tab-auth';
import { useAuth } from '@/src/providers/AuthContext'; import ButtonUser from './button-user';
import { ButtonLogin } from './button-login';

export const Header = () => {
    const [openDrawer, setDrawer] = useState<boolean>(false)
    const [openLogin, setLogin] = useState<boolean>(false)

    const { user } = useAuth()

    const [menu, setMenu] = useState<ListMenu[]>(initialStateMenu);

    useEffect(() => {
        console.log('reiniciar', user)
    }, [user]);

    //console.log(menu)
    return (
        <nav className="sticky top-0 bg-slate-950 md:px-10 xl:px-10 2xl:px-10" >
            <div className='flex justify-between'>
                <Link href={"/"} className='flex justify-start p-3'>
                    <Image
                        className=''
                        src="/img/logo_white.png"
                        alt="logo"
                        width={40}
                        height={40}
                    />

                    <h5 className={`font-wild-words-roman self-center text-2xl font-bold px-2`} >ia.kyaaa</h5>
                </Link>
                <div className='justify-end space-x-2 py-3'>
                    {/*  <button
                        className="xl:hidden p-2 w-10 rounded-lg bg-grayl-300 hover:bg-grayl-400 dark:bg-grayl-700 dark:hover:bg-grayl-800"
                        onClick={() => setModeDark(!modeDark)}>
                        <FontAwesomeIcon
                            className='text-gray-900 dark:text-white text-xl '
                            icon={modeDark ? faMoon : faSun}
                            size='lg'
                        />
                    </button> */}

                    <div className={`hidden w-full xl:block lg:block md:block`}>
                        <ul className="font-medium flex space-x-2">
                            {
                                menu.map((menu, i) => {
                                    return (
                                        <li key={i}>
                                            <Link
                                                href={menu.url}
                                                className="block p-2 hover:text-blue-400 hover:bg-blue-950"
                                            >
                                                {menu.name}
                                            </Link>
                                        </li>

                                    )
                                })
                            }
                            {
                                user ?
                                    (<li>
                                        <ButtonUser user={user} ></ButtonUser>
                                    </li>)
                                    :
                                    (<li>
                                        <ButtonLogin></ButtonLogin>
                                    </li>)
                            }
                        </ul>
                    </div>

                </div>
                <button
                    className='md:hidden lg:hidden xl:hidden p-3 rounded-lg bg-grayl-300 hover:bg-grayl-400 '
                    onClick={() => { setDrawer(true) }}
                >
                    <FontAwesomeIcon
                        className='btn-primary p-2'
                        icon={faBars}
                        size='xl'
                    />
                </button>
            </div>
            {/* <div className="xl:hidden font-medium flex space-x-4 p-2">
                <Search
                    texto={search}
                    value={setSearch}
                    onSubmit={enviar}
                />
            </div> */}
            <Drawer
                openDrawer={openDrawer}
                onDrawerClose={() => { setDrawer(false); console.log('close Navigate') }}
                onLogin={(() => { setLogin(true) })}
            ></Drawer>

            <ModalLogin
                isOpen={openLogin}
                onClose={(() => { setLogin(false) })}
            >
                <div className="items-center justify-center p-10">
                    <TabAuth></TabAuth>
                </div>
            </ModalLogin>
        </nav >
    )
}
export default Header;
