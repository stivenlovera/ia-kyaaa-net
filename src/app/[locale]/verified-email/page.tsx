import Image from "next/image";
import { getCurrentUser, verifyAccessTokenTemp } from "../../utils/auth";
import logger, { jsonLog } from "../../utils/logger";
import Link from "next/link";
import { repositoryAuth } from "../../repositories/repository-auth";
import moment from "moment";

interface IVerifiedEmail {
    /*     params: Promise<{
            code_verified: string
        }>, */
    searchParams: Promise<{
        code_verified: string
    }>,
}
export default async function Page({ searchParams }: IVerifiedEmail) {
    const { code_verified } = await searchParams;
    const valid = await verifyAccessTokenTemp(code_verified)
    logger.info(`/verified-email data token ${jsonLog(valid)}`);

    const user = await getCurrentUser()

    if (valid === null) {
        return (
            <div className="flex items-center justify-center h-dvs md:h-screen">
                <div className="p-4 w-full sm:w-3xl">
                    <div className="card">
                        <div className="flex justify-center">
                            <Image
                                fetchPriority="high"
                                src={'/img/link-no-valid.png'}
                                alt={``}
                                width={400}
                                height={500}
                                unoptimized
                                className=""
                            />
                        </div>
                        <div className="text-center text-3xl font-bold py-3">
                            Enlace no valido
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else {
        const verifiedEmail = await repositoryAuth.updateVerifiedEmail(valid!.email)
        logger.info(`/verified-email user data ${jsonLog(verifiedEmail)}`)

        return (
            <div className="flex items-center justify-center h-dvs md:h-screen">
                <div className="p-4 w-full sm:w-3xl">
                    <div className="card">
                        <div className="flex justify-center">
                            <Image
                                fetchPriority="high"
                                src={'/img/verified-succes.png'}
                                alt={``}
                                width={400}
                                height={500}
                                unoptimized
                                className=""
                            />
                        </div>
                        <div className="text-center">
                            <div className=" text-3xl font-bold py-3">
                                Email verificado correctamente
                            </div>
                           
                            {user !== null ? (
                                <p>volver a <Link href="/" className="text-blue-500 underline">pagina principal</Link></p>
                            )
                                :
                                (
                                    <p>inicia session entrando <Link href="/" className="text-blue-500 underline">aqui</Link></p>
                                )}
                        </div>

                    </div>
                </div>
            </div>
        )
    }


}