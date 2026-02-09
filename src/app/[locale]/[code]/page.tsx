import Link from 'next/link';
import React from 'react'
import { packInfo, packPages, totalAuthor, totalCharacter, totalLabel, totalLanguage, totalSerie, totalType } from './_service/code.service';
import moment from 'moment';
import { CardSection } from './_components/card-section';
import logger, { jsonLog } from '../../utils/logger';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';

interface PagePaginateProps {
    params: Promise<{
        code: string
    }>
}

export async function generateMetadata({ params }: PagePaginateProps): Promise<Metadata> {
    const { code } = await params;
    const pack = await packInfo(code);
    if (pack === null) {
        return {
            title: "Pagina no encontra",
            description: "No hay informacion",
        };
    }
    return {
        title: pack.name,
        description: pack.description,
    };
}

export default async function PagePage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params;

    const pack = await packInfo(code);
    if (pack === null) {
        logger.warn(`PageCode/pack not notFound`)
        return notFound();
    }
    logger.info(`PageCode/pack ${jsonLog(pack)}`)
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
    logger.warn(`PageCode/ labels ${jsonLog(labels)}`)
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

    const pages = await packPages(code);

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 pb-2">
                <div
                    className="border-2 border-neutral-700"
                >
                    <Link
                        href={`/${pack?.code}/${pack?.pages[0].num}`}
                        className="flex flex-row justify-center items-center"
                    >
                        <Image
                            width={400}
                            height={500}
                            className='h-3/4 w-3/4 p-1'
                            alt={`Preview ${pack.name}`}
                            fetchPriority="high"
                            src={`${process.env.URL_S3}/${pack?.code}/${pack?.pages[0].page_size[0].size.name}/${pack?.pages[0].num}.${pack?.pages[0].page_size[0].size.extension}`}
                        />
                    </Link>
                </div>
                <div className="border-2 border-neutral-700 items-center justify-center p-1">
                    <div className="p-1">
                        <h4 className='text-2xl'>{pack?.name}</h4>
                    </div>
                    <div className="p-1">
                        <h5 className='text-xl'>{pack?.code}</h5>
                    </div>
                    <CardSection
                        datos={tagSeries}
                        nameSection={('series')}
                        route='serie'
                    />
                    <CardSection
                        datos={tagCharacter}
                        nameSection={('personajes')}
                        route='character'
                    />
                    <CardSection
                        datos={tagLabels}
                        nameSection={('etiquetas')}
                        route='tag'
                    />
                    <CardSection
                        datos={tagAuthors}
                        nameSection={('autor')}
                        route='artist'
                    />
                    <CardSection
                        datos={tagLanguages}
                        nameSection={('language')}
                        route='language'
                    />
                    <CardSection
                        datos={tagTypes}
                        nameSection={('tipo')}
                        route='type'
                    />
                    <div className="p-1">
                        <div className="flex mx-auto flex-wrap">
                            <div className="m-1">
                                <h5 className="text-md">{/* t('pages') */}</h5>
                            </div>
                            <div className="m-2">
                                <h5 className="text-sm text-md">{pack?.pages.length}</h5>
                            </div>
                        </div>
                    </div>
                    <div className="p-1">
                        <div className="flex mx-auto flex-wrap">
                            <div className="m-1">
                                <h5 className="text-md">{/* t('update') */} Actualizado:</h5>
                            </div>
                            <div className="m-2">
                                <h5 className="text-sm ">{moment().format('DD/MM/yyyy hh:mm')}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-2 border-neutral-700">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
                    {
                        pages!.pages.map((page, i) => {
                            return (
                                <div
                                    className="flex p-1 sm:p-1 md:p-1 lg:p-2 xl:p-2 justify-center w-full"
                                    key={i}
                                >
                                    <Link
                                        href={`/${pack?.code}/${page.num}`}
                                        className=""
                                    >
                                        <Image
                                            fetchPriority="high"
                                            src={`${process.env.URL_S3}/${pack?.code}/${page.page_size[0].size.name}/${page.num}.${page.page_size[0].size.extension}`}
                                            alt={`pagina ${page.num}`}
                                            width={270}
                                            height={347}
                                        />
                                    </Link>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

