import { User } from '@/src/app/api/auth/_types/login'
import { useAuth } from '@/src/providers/AuthContext'
import { faCircleUser, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

interface ButtonUserProps {
    user: User
}

const ButtonUser = ({ user }: ButtonUserProps) => {
    const [openMenu, setOpenMenu] = useState(true)
    const router = useRouter();
    const { signOut } = useAuth()

    return (
        <div className='flex flex-row gap-2'>
            {/* <Link
                href={'login'}
                className="btn-primary p-2 block hover:text-blue-400 hover:bg-blue-950"
            >
            </Link> */}
            <div className="relative inline-block text-left"
                onClick={() => {
                    console.log('close')
                }}>
                <button
                    id="dropdown-button"
                    className="btn-primary hover:text-blue-400 hover:bg-blue-950 inline-flex justify-center w-full rounded-md shadow-sm px-2 py-2 font-medium focus:outline-none "
                    onClick={() => { setOpenMenu(!openMenu) }}
                >
                    <div className='flex flex-row gap-2'>
                        <FontAwesomeIcon
                            className=''
                            icon={faCircleUser}
                            size='xl'
                        />
                        <p className='px-1'>{user.name}</p>
                    </div>
                    <FontAwesomeIcon
                        className=''
                        icon={openMenu ? faAngleDown : faAngleUp}
                        size='xl'
                    />
                </button>

                <div id="dropdown-menu" className={openMenu ? ` hidden ` : `  ` + ` origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}>
                    <div className="py-1">
                        <Link
                            href={'my-purchases'}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Mis compras
                        </Link>
                        <Link
                            href={'favorites'}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Favoritos
                        </Link>
                        <Link
                            href={'my-account'}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Mi cuenta
                        </Link>
                        <button
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
                            onClick={() => {
                                signOut()
                                router.push('/login');
                            }}
                        >
                            Cerrar sesion
                        </button>
                    </div>
                </div>
            </div>
            {/* <Link
                href={'login'}
                className="btn-primary p-2 block hover:text-blue-400 hover:bg-blue-950"
            >
                <div className='flex flex-row'>
                    <FontAwesomeIcon
                        className=''
                        icon={faSignOut}
                        size='xl'
                    />
                    <p className='px-1'>salir</p>
                </div>
            </Link> */}
        </div>
    )
}

export default ButtonUser;
