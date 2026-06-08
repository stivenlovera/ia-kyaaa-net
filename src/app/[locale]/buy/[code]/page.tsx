import { repositoryPack } from "@/src/app/repositories/pack.repository";
import { getCurrentUser } from "@/src/app/utils/auth";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
interface PageProps {
    params: Promise<{
        code: string
    }>,
    searchParams: Promise<{
        page: string
    }>
}
export default async function Page({ params }: PageProps) {
    const { code } = await params;

    const t = await getTranslations('buy');
    const user = await getCurrentUser();
    const pack = await repositoryPack.findPackInfo(code);

    if (user === null) {
        notFound()
    }
    if (pack === null) {
        notFound()
    }

    const urlImage = `${process.env.NEXT_PUBLIC_PACKS_URL_S3}/${pack.code}/${pack.portada.name}/${pack.portada.num}.${pack.portada.extension}`
    return (
        <div className="px-2 py-2 md:px-10 lg:px-20 xl:px-64 2xl:px-72 md:py-5 lg:py-10 xl:py-14 flex justify-center">
            <div className="card md:w-3xl">
                <div className="p-3 pt-0" >
                    <h1 className="text-center text-2xl md:text-3xl font-bold">{t('titulo')}</h1>
                </div>
                <div className="card p-2 flex flex-row">
                    <div className="w-20 h-25 md:w-30 md:h-40 flex justify-center items-center ">
                        <Image
                            width={400}
                            height={500}
                            alt={`Preview ${pack.name}`}
                            fetchPriority="high"
                            className=""
                            unoptimized
                            priority
                            src={`${urlImage}`}
                        />

                    </div>
                    <div className="px-2 flex flex-col text-end w-full ">
                        <div className=" text-neutral-100">{pack.name}</div>
                        <div className=" text-neutral-100">{pack.code}</div>
                        <div className=" text-neutral-100">750 fotos</div>
                        <div className=" text-neutral-100">7$ USD</div>
                    </div>
                </div>
                <div className="py-2">
                    <div className="card text-end p-3">
                        Total 7 $
                    </div>
                </div>

                <div className="">
                    <div className="card text-start p-3">
                        Metodos de pago
                    </div>
                    <div>
                        Paypal (tarjeta)
                    </div>
                    <div>
                        AirTM
                    </div>
                    <div>
                        Binance
                    </div>
                    <div>
                        Google pay (tarjeta)
                    </div>
                    <div>
                        Stripe (tarjeta)
                    </div>
                </div>
            </div>
        </div>
    )
}
