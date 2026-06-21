'use client'
import { IPackInfo } from "@/src/app/types/pack.types";
import { PayPalScriptProvider, ReactPayPalScriptOptions } from "@paypal/react-paypal-js"
import { useTranslations } from "next-intl";
import Image from "next/image";
import { CheckoutButton } from "./checkout-button";

interface PayPackProps {
    pack: IPackInfo
}

export const PayPack = ({ pack }: PayPackProps) => {
    const t = useTranslations('buy');
    const initialOptions: ReactPayPalScriptOptions = {
        clientId: process.env.NEXT_PUBLIC_API_CLIENT_ID!, // Replace with your Sandbox/Live client ID
        currency: "USD",
        intent: "capture",
    };

    const urlImage = `${process.env.NEXT_PUBLIC_PACKS_URL_S3}/${pack.code}/${pack.portada.name}/${pack.portada.num}.${pack.portada.extension}`

    return (
        <PayPalScriptProvider options={initialOptions}>
            <div className="px-2 py-2 md:px-10 lg:px-20 xl:px-64 2xl:px-72 md:py-5 lg:py-10 xl:py-14 flex justify-center">
                <div className="card w-full md:w-3xl">
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
                    <div className="bg-neutral-200 rounded-sm p-2">
                        <CheckoutButton code={pack.code}></CheckoutButton>
                    </div>
                </div>

            </div>
        </PayPalScriptProvider>
    )
}
