'use client'

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ModalLoginProps = {
    onClose: (modal: boolean) => void;
    isOpen: boolean
    children: React.ReactNode
};
const ModalLogin = ({ isOpen, onClose, children }: ModalLoginProps) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 w-screen h-screen bg-dark-600/50 flex items-center justify-center backdrop-blur-sm p-5"
            onClick={() => { onClose(false) }}
        >
            <div className="bg-slate-950 p-4 rounded-lg shadow-lg items-center relative" >
                <button
                    onClick={() => { onClose(false) }}

                    className="btn-primary absolute top-4 right-4 px-1"
                >
                    <FontAwesomeIcon
                        className=''
                        icon={faXmark}
                        size='sm'
                    />
                </button>
                <div
                    onClick={((event) => {
                        event.preventDefault();
                        event.stopPropagation();
                    })}>
                    {children}
                </div>
            </div>
        </div>
    );
};
export default ModalLogin;
