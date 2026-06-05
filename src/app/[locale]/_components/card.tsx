import { useAuth } from "@/src/providers/AuthContext"
import Image from "next/image"
import Link from "next/link"
import { FaBookmark, FaCartArrowDown, FaHeart } from "react-icons/fa6"
interface ICard {
    pack_id: number
    code: string
    name: string
    urlImage: string
    like: boolean
    onLike: (pack_id: number) => void
    favorite: boolean
    onFavorite: (pack_id: number) => void
    buy: boolean
    onBuy: (pack_id: number) => void
}
export const Card = ({
    pack_id,
    code,
    name,
    urlImage,
    like,
    onLike,
    favorite,
    onFavorite,
    buy,
    onBuy
}: ICard) => {
    const { user } = useAuth()
    return (<div className="border-slate-900 border-2">
        <Link
            className="items-start justify-center"
            href={`/pack/${code}`}
        >
            <div className="grid place-items-end">
                <Image
                    width={400}
                    height={500}
                    alt={`Preview ${name}`}
                    fetchPriority="high"
                    className="w-full col-start-1 row-start-1"
                    unoptimized
                    priority
                    src={`${urlImage}`}
                />
                {user !== null ? (
                    <div className="col-start-1 row-start-1 flex items-start justify-end gap-1 p-1">
                        {
                            buy ? (
                                <button
                                    className="p-2 border rounded-full bg-neutral-950/60 border-neutral-600 disabled:bg-neutral-950/80"
                                    disabled={true}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        event.preventDefault();
                                        onBuy(pack_id);
                                    }}
                                >
                                    <FaCartArrowDown
                                        className={'text-xl ' + (buy === true ? ' text-blue-500' : 'text-white')}
                                    />
                                </button>
                            ) : (<></>)
                        }
                        <button
                            className="p-2 border rounded-full bg-neutral-950/60 border-neutral-600 cursor-pointer"
                            onClick={(event) => {
                                event.stopPropagation();
                                event.preventDefault();
                                onFavorite(pack_id);
                            }}
                        >
                            <FaBookmark
                                className={'text-xl ' + (favorite === true ? ' text-yellow-600' : 'text-white')}
                            />
                        </button>
                        <button
                            className="p-2 border rounded-full bg-neutral-950/60 border-neutral-600 cursor-pointer"
                            onClick={(event) => {
                                event.stopPropagation();
                                event.preventDefault();
                                onLike(pack_id);
                            }}
                        >
                            <FaHeart
                                className={'text-xl ' + (like === true ? ' text-red-600' : 'text-white')}
                            />
                        </button>
                    </div>
                ) : (<></>)}
            </div>

            <div className=''>
                <div className='flex justify-between basis-full bg-gray-800 p-1'>
                    <div className='line-clamp-2 hover:line-clamp-none sm:text-10 xl:text-12'>
                        {name.toLocaleLowerCase()}
                    </div>
                </div>
            </div>
        </Link>
    </div>)
}