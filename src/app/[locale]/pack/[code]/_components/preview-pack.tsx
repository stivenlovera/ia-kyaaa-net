import Image from "next/image"
import Link from "next/link"
import { CardSection } from "../../_components/card-section"
import moment from "moment"
import logger, { jsonLog } from "@/src/app/utils/logger"
import { packInfo, totalAuthor, totalCharacter, totalLabel, totalLanguage, totalSerie, totalType } from "../../_service/code.service"
import { notFound } from "next/navigation"
import { repositoryPage } from "@/src/app/repositories/repository-pages"

interface PreviewPackProps {
    code: string
}

export const PreviewPack = async ({ code }: PreviewPackProps) => {
    logger.warn(`/pack PreviewPack ${jsonLog([code])}`)
    const pack = await packInfo(code);
    if (pack === null) {
        logger.warn(`/code not notFound`)
        return notFound();
    }
    
    const characters: number[] = [];
    pack?.pack_character.map(({ character }) => {
        characters.push(character.character_id)
    })
    const tagCharacter = await totalCharacter(characters);

    const types: number[] = [];
    pack?.pack_types.map(({ type }) => {
        types.push(type.type_id)
    })
    const tagTypes = await totalType(types);

    const series: number[] = [];
    pack?.pack_serie.map(({ serie }) => {
        series.push(serie.serie_id)
    })
    const tagSeries = await totalSerie(series);

    const labels: number[] = [];
    pack?.pack_label.map(({ label }) => {
        labels.push(label.label_id)
    })

    const tagLabels = await totalLabel(labels);

    const authors: number[] = [];
    pack?.pack_authors.map(({ author }) => {
        authors.push(author.author_id)
    })
    const tagAuthors = await totalAuthor(authors);

    const languages: number[] = [];
    pack?.pack_languages.map(({ language }) => {
        languages.push(language.language_id)
    })
    const tagLanguages = await totalLanguage(languages);

    const pages = await repositoryPage.findPagesPack(code, 1);

    //logger.warn(`/pack pages ${jsonLog(pages)}`)

    //const imageDescription = `${process.env.URL_S3}/${pack?.code}/${pack?.pages[0].page_size[0].size.name}/${pack?.pages[0].num}.${pack?.pages[0].page_size[0].size.extension}`
    const imageDescription = `${process.env.NEXT_PUBLIC_PACKS_URL_S3}/${pack?.code}/${pack?.pages[0].page_size[0].size.name}/${pack?.pages[0].num}.${pack?.pages[0].page_size[0].size.extension}`

    return (
        <div className='px-2 py-2 md:px-10 lg:px-20 xl:px-64 2xl:px-72 md:py-5 lg:py-10 xl:py-14'>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 pb-2">
                <div
                    className=""
                >
                    <Link
                        href={`/${pack?.code}/${pack?.pages[0].num}`}
                        className="flex flex-row justify-center md:justify-end"
                    >
                        <Image
                            width={400}
                            height={500}
                            className='h-3/4 w-3/4 p-1'
                            alt={`Preview ${pack.name}`}
                            fetchPriority="high"
                            unoptimized
                            src={imageDescription}
                        />
                    </Link>
                </div>
                <div className="card">
                    <div className="p-1">
                        <h4 className='text-2xl font-bold'>{pack?.name}</h4>
                    </div>
                    <div className="p-1">
                        <h5 className='text-lg'>{pack?.code}</h5>
                    </div>
                    <CardSection
                        datos={tagSeries}
                        nameSection={('Series')}
                        route='serie'
                    />
                    <CardSection
                        datos={tagCharacter}
                        nameSection={('Personajes')}
                        route='character'
                    />
                    <CardSection
                        datos={tagLabels}
                        nameSection={('Etiquetas')}
                        route='tag'
                    />
                    <CardSection
                        datos={tagAuthors}
                        nameSection={('Autor')}
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
                        <div className="flex mx-auto flex-wrap">
                            <div className="m-1">
                                <h5 className="text-md">Paginas:</h5>
                            </div>
                            <div className="mt-2">
                                <h5 className="text-sm mx-1">{pack?.pages.length}</h5>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="flex mx-auto flex-wrap">
                            <div className="m-1">
                                <h5 className="text-md">{/* t('update') */} Actualizado:</h5>
                            </div>
                            <div className="mt-2">
                                <h5 className="text-sm mx-1">{moment().format('DD/MM/yyyy hh:mm')}</h5>
                            </div>
                        </div>
                        <div className='py-2'>
                            <button className='btn-primary w-full font-bold'>
                                Comprar ahora!
                            </button>
                        </div>
                    </div>

                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
                {
                    pages!.pages.map((page, i) => {
                        const imagePage = `${process.env.NEXT_PUBLIC_PACKS_URL_S3}/${pack?.code}/${page.page_size[0].size.name}/${page.num}.${page.page_size[0].size.extension}`
                        return (
                            <div
                                className="flex p-1 sm:p-1 md:p-1 lg:p-2 xl:p-2 justify-center w-full"
                                key={i}
                            >
                                <Link
                                    href={`/pack/${pack?.code}?page=${page.num}`}
                                    className=""
                                >
                                    <Image
                                        fetchPriority="high"
                                        src={imagePage}
                                        alt={`pagina ${page.num}`}
                                        width={270}
                                        height={347}
                                        unoptimized
                                    />
                                </Link>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}