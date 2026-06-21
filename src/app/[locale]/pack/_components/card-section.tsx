import Link from "next/link"
import { skeleton } from "@/src/app/utils/skeleton"

export interface ICountTag {
    name: string
    count: number
    slug: string
}
interface CardSectionProps {
    datos: ICountTag[]
    nameSection: string
    route: string
}
export const CardSection = ({ datos, nameSection, route }: CardSectionProps) => {
    return (
        <div className={''}>
            <div className={"flex mx-auto flex-wrap flex-row"}>
                <div className={"py-1 m-1 font-bold"}>
                    <h5 className="">{nameSection}:</h5>
                </div>
                {datos.length > 0 ? (<></>) : (<div className={'m-1 flex w-40 ' + skeleton('')}></div>)}
                {
                    datos?.map((val, i) => {
                        //const traslate = languajeToSpanish(val.name)
                        return (
                            <div
                                key={i}
                                className="m-1">
                                {/* <TagInformation
                                            quantity={val.count}
                                            url={`/${route}/${val.name}`}
                                            value={val.name}
                                        /> */}
                                <Link
                                    className='flex'
                                    href={`/${route}/${val.slug}`}
                                >
                                    <div className='rounded-l bg-gray-700 px-2'>
                                        {val.name}
                                    </div>
                                    <div className='border-2 border-transparent rounded-r bg-gray-600 px-1'>
                                        {val.count}
                                    </div>
                                </Link>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}