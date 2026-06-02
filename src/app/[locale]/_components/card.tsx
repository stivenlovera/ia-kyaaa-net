import Image from "next/image"
import Link from "next/link"
interface ICard {
    code: string
    name: string
    urlImage: string
}
export const Card = ({
    code,
    name,
    urlImage
}: ICard) => {
    return (<div className="border-slate-900 border-2">
        <Link
            className="items-start justify-center"
            href={`/pack/${code}`}
        >
            <Image
                width={400}
                height={500}
                alt={`Preview ${name}`}
                fetchPriority="high"
                className="w-full"
                unoptimized
                src={`${urlImage}`}
            />
            <div className=''>
                <div className='basis-full bg-gray-800 p-1'>
                    <div className='line-clamp-2 hover:line-clamp-none sm:text-10 xl:text-12'>
                        {/* <p className='inline bg-gray-900 p-1 text-sm' >
                        spanish
                      </p> */}
                        {name.toLocaleLowerCase()}
                    </div>
                </div>

            </div>
        </Link>
    </div>)
}