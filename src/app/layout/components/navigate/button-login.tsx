import { faCircleUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

export const ButtonLogin = () => {
    return (
        <Link
            href={'login'}
            className="btn-primary p-2 block hover:text-blue-400 hover:bg-blue-950"
        >
            <div className='flex flex-row'>
                <FontAwesomeIcon
                    className=''
                    icon={faCircleUser}
                    size='xl'
                />
                <p className='px-1'>Inicia sesion</p>
            </div>
        </Link>
    )
}
