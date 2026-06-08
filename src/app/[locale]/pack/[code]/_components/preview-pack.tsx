import Image from "next/image"
import Link from "next/link"
import { CardSection } from "../../_components/card-section"
import moment from "moment"
import { IPackInfoPage } from "@/src/app/types/pack.types"
/* import { skeleton } from "@/src/app/utils/skeleton" */
import { repositoryPack } from "@/src/app/repositories/pack.repository"
import { repositoryCharacter } from "@/src/app/repositories/character.repository"
import { repositorySerie } from "@/src/app/repositories/serie.repository"
import { repositoryLabel } from "@/src/app/repositories/label.repository"
import { repositoryAuthor } from "@/src/app/repositories/author.repository"
import { repositoryPage } from "@/src/app/repositories/pages.repository"
import { getCurrentUser } from "@/src/app/utils/auth"
import { getTranslations } from "next-intl/server"
import logger, { jsonLog } from "@/src/app/utils/logger"
import { More } from "./more"
import { ExtraPack } from "./extras-pack"
import { ILikePack } from "@/src/app/types/like-pack.types"
import { IBuyPack } from "@/src/app/types/buy_pack.types"
import { IFavoritePack } from "@/src/app/types/favorite-pack.types"
import { repositoryLikePack } from "@/src/app/repositories/like-pack.repository"
import { repositoryBuyPack } from "@/src/app/repositories/buy-pack.repository"
import { repositoryFavoritePack } from "@/src/app/repositories/favorite-pack.repository"
import { notFound } from "next/navigation"

interface PreviewPackProps {
    code: string
}

export const PreviewPack = async ({ code }: PreviewPackProps) => {
    const t = await getTranslations('pack-info');
    const pack = await repositoryPack.findPackInfo(code);
    if (pack===null) {
        notFound()
    }

    const characters: number[] = [];
    pack?.pack_character.map(({ character }) => {
        characters.push(character.character_id)
    })
    const totalCharacter = await repositoryCharacter.findTotal(characters);

    const series: number[] = [];
    pack?.pack_serie.map(({ serie }) => {
        series.push(serie.serie_id)
    })
    const totalSeries = await repositorySerie.findTotal(series);

    const labels: number[] = [];
    pack?.pack_label.map(({ label }) => {
        labels.push(label.label_id)
    })
    const totalLabel = await repositoryLabel.findTotal(labels);

    const authors: number[] = [];
    pack?.pack_authors.map(({ author }) => {
        authors.push(author.author_id)
    })
    const totalAuthor = await repositoryAuthor.findTotal(authors);

    const pack_page = await repositoryPage.findPagesPack(code, 1);

    const user = await getCurrentUser();
    let likes: ILikePack[] = []
    let buys: IBuyPack[] = []
    let favorites: IFavoritePack[] = []
    if (user !== null) {
        likes = await repositoryLikePack.findLikePerUser(user!.user_id);
        buys = await repositoryBuyPack.findBuyPerUser(user!.user_id);
        favorites = await repositoryFavoritePack.findFavoritePerUser(user!.user_id);
    }
    const isLike = likes!.find((like) => like.pack_id === pack!.pack_id);
    const isBuy = buys!.find((like) => like.pack_id === pack!.pack_id);
    const isFavorite = favorites!.find((like) => like.pack_id === pack!.pack_id);
    const packInfo: IPackInfoPage = {
        ...pack!,
        total_characters: totalCharacter,
        total_series: totalSeries,
        total_labels: totalLabel,
        total_authors: totalAuthor,
        pages: pack_page!.pages!,
        buy: isBuy !== undefined ? true : false,
        like: isLike !== undefined ? true : false,
        favorite: isFavorite !== undefined ? true : false,
    }

    const imageDescription = `${process.env.NEXT_PUBLIC_PACKS_URL_S3}/${packInfo?.code}/${packInfo?.portada.name}/${packInfo?.portada.num}.${packInfo?.portada.extension}`
    const saltos: number = 40;
    const morePage = packInfo.pages!.filter((image, i) => {
        if (i > (saltos - 1)) {
            return image
        }
    });

    logger.info(`morePage ${jsonLog(morePage)}`)

    return (
        <div className='px-2 py-2 md:px-10 lg:px-20 xl:px-64 2xl:px-72 md:py-5 lg:py-10 xl:py-14'>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 pb-2">
                <div
                    className=""
                >
                    <Link
                        href={`/pack/${packInfo?.code}?page=${packInfo.portada.num}`}
                        className="flex flex-row justify-center md:justify-end"
                    >
                        <Image
                            width={400}
                            height={500}
                            className='h-3/4 w-3/4 p-1'
                            alt={`Preview ${packInfo?.name}`}
                            fetchPriority="high"
                            unoptimized
                            priority
                            src={imageDescription}
                        />
                    </Link>
                </div>
                <div className="card">
                    <div className="p-1">
                        <h4 className={'text-2xl font-bold'}>{packInfo?.name}</h4>
                    </div>
                    <div className="p-1">
                        <h5 className={'text-lg '}>{packInfo?.code}</h5>
                    </div>
                    <CardSection
                        datos={packInfo!.total_series!}
                        nameSection={t('serie')}
                        route='serie'
                    />
                    <CardSection
                        datos={packInfo!.total_characters!}
                        nameSection={t('personaje')}
                        route='character'
                    />
                    <CardSection
                        datos={packInfo!.total_labels!}
                        nameSection={t('etiqueta')}
                        route='tag'
                    />
                    <CardSection
                        datos={packInfo!.total_authors!}
                        nameSection={t('autor')}
                        route='artist'
                    />
                    {/*  <CardSection
                            datos={tagLanguages}
                            nameSection={('language')}
                            route='language'
                        />
                        <CardSection
                            datos={tagTypes}
                            nameSection={('tipo')}
                            route='type'
                        /> */}
                    <div className="">
                        <div className="flex mx-auto flex-wrap py-1">
                            <div className="m-1">
                                <h5 className="text-md font-bold">{t('paginas_gratis')}:</h5>
                            </div>
                            <div className="mt-2">
                                <h5 className={"text-sm mx-1 w-full "}>
                                    {
                                        packInfo?.pages.length === 0 ? ('') : (packInfo?.pages.length)
                                    }
                                </h5>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="flex mx-auto flex-wrap py-1">
                            <div className="m-1">
                                <h5 className="text-md font-bold">{t('paginas')}:</h5>
                            </div>
                            <div className="mt-2">
                                <h5 className={"text-sm mx-1 w-full "}>
                                    {
                                        packInfo?.pages.length === 0 ? ('') : (packInfo?.pages.length)
                                    }
                                </h5>
                            </div>
                        </div>
                    </div>

                    <div className="">
                        <div className="flex mx-auto flex-wrap py-1">
                            <div className="m-1">
                                <h5 className="text-md font-bold">{t('actualizado')}:</h5>
                            </div>
                            <div className="mt-2">
                                <h5 className={"text-sm mx-1 w-full"}>
                                    {
                                        packInfo?.name === '' ? ('') : (moment(packInfo!.update_at).format('DD/MM/yyyy hh:mm'))
                                    }
                                </h5>
                            </div>
                        </div>
                    </div>
                    <ExtraPack
                        code={code}
                        price={packInfo.price_list}
                        pack_id={packInfo.pack_id}
                        user_buy={packInfo.buy}
                        user_favorite={packInfo.favorite}
                        user_like={packInfo.like}
                    ></ExtraPack>
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
                {
                    packInfo.pages!.map((image, i) => {
                        const imagePage = `${process.env.NEXT_PUBLIC_PACKS_URL_S3}/${packInfo?.code}/${image.page_size[0].size.name}/${image.num}.${image.page_size[0].size.extension}`
                        if (i < (saltos)) {
                            return (
                                <div
                                    className="flex p-1 sm:p-1 md:p-1 lg:p-2 xl:p-2 justify-center w-full"
                                    key={i}
                                >
                                    <Link
                                        href={`/pack/${packInfo?.code}?page=${image.num}`}
                                        className=""
                                    >
                                        <Image
                                            fetchPriority="high"
                                            src={imagePage}
                                            alt={`pagina ${image.num}`}
                                            width={270}
                                            height={347}
                                            unoptimized
                                            priority
                                        />
                                    </Link>
                                </div>
                            )
                        }
                    })
                }
            </div>
            <More
                code={packInfo.code}
                pages={morePage}
                saltos={saltos}
            ></More>
        </div >
    )
}