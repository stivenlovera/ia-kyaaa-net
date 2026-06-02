'use client'

type ModalDialogProps = {
    onClose: (modal: boolean) => void;
    isOpen: boolean
    children: React.ReactNode
    title: string
};
const Dialog = ({ isOpen, onClose, children, title }: ModalDialogProps) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 w-screen h-screen bg-dark-600/50 flex items-center justify-center backdrop-blur-sm p-5"
            onClick={() => { /* onClose(false) */ }}
        >
            <div className="bg-neutral-800 p-4 rounded-lg shadow-md shadow-black items-center relative md:w-96">
                <div className="flex justify-between px-3 py-2">
                    <div className="">
                        <p className="text-left text-2xl  font-bold">{title}</p>
                    </div>
                    {/* <div className="justify-center">
                        <button
                            onClick={() => { onClose(false) }}
                            className="btn-primary-icon rounded-full"
                        >
                            <FaTimes size={20} color="white" className='' />
                        </button>
                    </div> */}
                </div>
                {/* <button
                    onClick={() => { onClose(false) }}
                    className="btn-primary-icon absolute top-4 right-4 rounded-full"
                >
                    <FaTimes size={20} color="white" className='' />
                </button> */}
                <div
                    /* onClick={((event) => {
                        event.preventDefault();
                        event.stopPropagation();
                    })} */>
                    <div className="p-3">
                        {/* <p className="text-left text-2xl py-2 font-bold">{title}</p> */}
                        {children}
                    </div>

                </div>
            </div>
        </div>
    );
};
export default Dialog;
