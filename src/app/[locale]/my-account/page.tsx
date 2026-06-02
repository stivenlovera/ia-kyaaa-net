import { Metadata } from "next";
import logger, { jsonLog } from "../../utils/logger";
import { PageHomeProps } from "../layout";
import { FormProfile } from "./_components/form-profile";

export const metadata: Metadata = {
    title: 'Mi cuenta',
    description: 'Informacion sobre mi cuenta',
}

export default async function Page({ params }: PageHomeProps) {
    const { locale } = await params;
    logger.info(`my-account locale ${jsonLog(locale)}`)

    return (
        <div className="flex items-center justify-center h-dvs md:h-screen">
            <div className="p-4 w-full sm:w-3xl">
                <FormProfile></FormProfile>
            </div>
        </div>
    )
}