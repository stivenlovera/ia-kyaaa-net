import Dialog from '@/src/app/[locale]/_components/dialog'
import { useTranslations } from 'next-intl';
import Link from 'next/link';
interface DialogChangeEmailProps {
    open: boolean;
    onClose: (open: boolean) => void;
}
export const DialogRegisterNow = ({ open, onClose }: DialogChangeEmailProps) => {
    const t = useTranslations('pack-info.extra-pack.dialogo_descargar');
    return (
        <Dialog
            isOpen={open}
            onClose={(() => { onClose(false) })}
            title={t('titulo')}
        >
            <div className="grid grid-cols-1 gap-4">
                <div>
                    {t('mensaje')}
                    <br />
                    <Link className='text-blue-500 text-center underline ' href={'/login'}>{t('inicia_sesion')} </Link>
                </div>
                <div className='flex justify-between gap-3'>
                    <button
                        className="btn-primary w-full text-red-500"
                        type='button'
                        onClick={() => { onClose(false) }}
                    >
                        {t('cancelar')}
                    </button>
                    <div></div>
                </div>
            </div>
        </Dialog>
    )
}
