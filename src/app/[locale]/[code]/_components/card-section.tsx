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
                        <div className="m-1">
                            <h5 className="text-md ">{nameSection}:</h5>
                        </div>
                        {
                            datos?.map((val, i) => {
                                //const traslate = languajeToSpanish(val.name)
                                return (
                                    <div
                                        key={i}
                                        className="m-1">
                                        <TagInformation
                                            quantity={val.count}
                                            url={`/${route}/${val.name}`}
                                            value={val.name}
                                        />
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