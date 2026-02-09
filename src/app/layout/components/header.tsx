"use client";
import Link from 'next/link'
import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';
import Image from 'next/image';

import {
    faMagnifyingGlass,
    faBars
} from "@fortawesome/free-solid-svg-icons";
import { initialStateMenu, ListMenu } from '../layout.type';

export const Header = () => {
    const [openModal, setOpenModal] = useState(false);

    const onsubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log('envio de datos')
            const response = await axios.post('/api/login', {
                email: 'stivenlovera@gmail.com',
                password: '123456789'
            }); // Replace with your 
           // console.log('response', response.data)
        } catch (err) {
            //console.log(err)
        }
    }

    const [menu, setMenu] = useState<ListMenu[]>(initialStateMenu);
    //console.log(menu)
    return (
        <nav className="sticky top-0 bg-slate-950 sm:px-10 xl:px-10" >

            <div className='flex justify-between'>
                <Link href={"/"} className='flex justify-start space-x-2 p-3'>
                    <Image
                        className=''
                        src="/img/logo_white.png" ///img/logo_dark.png
                        alt="logo"
                        width={40}
                        height={0}
                    />

                    <p className={`font-wild-words-roman self-center text-3xl font-bold`} >ia.kyaaa!</p>
                </Link>
                <div className='justify-end space-x-2 p-2'>
                    {/*  <button
                        className="xl:hidden p-2 w-10 rounded-lg bg-grayl-300 hover:bg-grayl-400 dark:bg-grayl-700 dark:hover:bg-grayl-800"
                        onClick={() => setModeDark(!modeDark)}>
                        <FontAwesomeIcon
                            className='text-gray-900 dark:text-white text-xl '
                            icon={modeDark ? faMoon : faSun}
                            size='lg'
                        />
                    </button> */}
                    <button
                        className='xl:hidden p-2 w-10 rounded-lg bg-grayl-300 hover:bg-grayl-400 dark:bg-grayl-700 dark:hover:bg-grayl-800'
                        onClick={() => { }}
                    >
                        <FontAwesomeIcon
                            className='text-gray-900 dark:text-white text-xl'
                            icon={faBars}
                            size='lg'
                        />
                    </button>
                    <div className={`hidden w-full xl:block`}>
                        <ul className="font-medium flex space-x-2">
                            <li>
                                {/* <Search
                                    texto={search}
                                    value={setSearch}
                                    onSubmit={enviar}
                                /> */}
                            </li>
                            <li>
                                <button
                                    className="p-2 w-10 rounded-lg bg-grayl-300 hover:bg-grayl-400 dark:bg-grayl-700"
                                    onClick={() => { }}>
                                    {/* <FontAwesomeIcon
                                        className='text-gray-900 dark:text-white text-xl '
                                        icon={modeDark ? faMoon : faSun}
                                        size='lg'
                                    /> */}
                                </button>
                            </li>
                            {
                                menu.map((menu, i) => {
                                    return (
                                        <li key={i}>
                                            <Link
                                                href={menu.url}
                                                className="block p-2 hover:text-red-500 dark:hover:text-red-500"
                                            >
                                                {menu.name}
                                            </Link>
                                        </li>
                                    )
                                })
                            }
                            <li>

                            </li>
                        </ul>
                    </div>

                </div>
                <a
                    href="#"
                    className="block p-2 hover:text-red-500 dark:hover:text-red-500"
                    onClick={() => { }}>
                    Ingresar
                </a>
            </div>
            <div className="xl:hidden font-medium flex space-x-4 p-2">
                {/* <Search
                    texto={search}
                    value={setSearch}
                    onSubmit={enviar}
                /> */}
            </div>


        </nav >
    )
}
export default Header;
