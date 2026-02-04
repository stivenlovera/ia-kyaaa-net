import Link from 'next/link';
import React from 'react'
import { packService, totalCharacter, totalLabel, totalSerie, totalType } from './_service/code.service';
import moment from 'moment';
import { CardSection } from './_components/card-section';
import logger, { jsonLog } from '../../utils/logger';
import { notFound } from 'next/navigation';

export default async function PageCode({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params;

    const pack = await packService(code);
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
    const tagAuthors = await totalLabel(authors);

    const languages: number[] = [];
    pack?.pack_languages.map(({ language }) => {
        languages.push(language.language_id)
    })
    const tagLanguages = await totalLabel(languages);

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                <div
                    className="border-2 border-neutral-800"
                >
                    <Link
                        href={`/${pack?.code}/${pack?.pages[0].num}`}
                        className="flex flex-row min-h-full justify-center items-center"
                    >
                        <img
                            className='h-3/4 w-3/4 p-4'
                            alt='preview'
                            src={`${process.env.URL_S3}/${pack?.code}/web/${pack?.pages[0].num}.${pack?.pages[0].page_type.extension}`}
                        />
                    </Link>
                </div>
                <div className="border-2 border-neutral-800 items-center justify-center p-2">
                    <div className="p-2">
                        <h4 className='text-2xl'>{pack?.name}</h4>
                    </div>
                    <div className="p-2">
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
        </div>
    )
}

