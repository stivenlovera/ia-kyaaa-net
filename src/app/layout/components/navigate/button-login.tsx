import { FaUserCircle } from "react-icons/fa";
import Link from 'next/link'

export const ButtonLogin = () => {
    return (
        <Link
            href={'login'}
            className="btn-primary"
        >
            <div className='flex flex-row'>
                <FaUserCircle size={25} color="white" />
                <p className='px-2'>Inicia sesion</p>
            </div>
        </Link>
    )
}
