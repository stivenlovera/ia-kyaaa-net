import Link from "next/link"
import { TagInformation } from "./tag-information"

export interface ICountTag {
    name: string
    count: number
}
interface CardSectionProps {
    datos: ICountTag[]
    nameSection: string
    route: string
}
export const CardSection = ({ datos, nameSection, route }: CardSectionProps) => {
    return (
        <div className="">
            {
                datos!.length > 0 ? (
                    <div className="flex mx-auto flex-wrap">
                        <div className="py-1 m-1 font-bold">
                            <h5 className="">{nameSection}:</h5>
                        </div>
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
                                            href={`/${route}/${val.name}`}
                                        >
                                            <div className='rounded-l bg-gray-700 p-1'>
                                                {val.name}
                                            </div>
                                            <div className='border-2 border-transparent rounded-r bg-gray-600 p-1'>
                                                {val.count}
                                            </div>
                                        </Link>
                                    </div>
                                )
                            })
                        }
                    </div>
                ) : (null)
            }
        </div>
    )
}