import { notFound } from 'next/navigation'
import { repositoryPack } from '@/src/app/repositories/pack.repository'
import { repositoryLabel } from '@/src/app/repositories/label.repository'
import { repositoryCharacter } from '@/src/app/repositories/character.repository'
import { repositorySerie } from '@/src/app/repositories/serie.repository'
import { repositoryAuthor } from '@/src/app/repositories/author.repository'
import { repositoryLanguage } from '@/src/app/repositories/language.repository'
import { repositoryPage } from '@/src/app/repositories/pages.repository'
import { repositoryStatePack } from '@/src/app/repositories/state-pack.repository'
import { PackRelationsForm } from './_components/pack-relations-form'
import { PackPagesManager } from './_components/pack-pages-manager'
import { PackStateForm } from './_components/pack-state-form'

export const dynamic = 'force-dynamic'

interface AdminPackEditPageProps {
    searchParams: Promise<{
        code?: string
    }>
}

export default async function Page({ searchParams }: AdminPackEditPageProps) {
    const { code } = await searchParams
    if (code === undefined) {
        notFound()
    }

    const pack = await repositoryPack.findForEdit(code)
    if (pack === null) {
        notFound()
    }

    const [labels, characters, series, authors, languages, pages, states] = await Promise.all([
        repositoryLabel.findAllAndTotal(),
        repositoryCharacter.findAllAndTotal(),
        repositorySerie.findAllAndTotal(),
        repositoryAuthor.findAllAndTotal(),
        repositoryLanguage.findAll(),
        repositoryPage.findAllForAdmin(pack.pack_id, pack.code),
        repositoryStatePack.findAll(),
    ])

    return (
        <div className='px-2 py-2 md:px-10 lg:px-20 xl:px-64 2xl:px-72 md:py-5 lg:py-10 xl:py-14 grid grid-cols-1 gap-4'>
            <div className='card'>
                <h1 className='text-2xl md:text-3xl font-bold pb-1'>{pack.name}</h1>
                <p className='text-sm text-neutral-400 pb-3'>{pack.pack_id}-{pack.code}</p>
                <div className='pb-4'>
                    <PackStateForm
                        pack_id={pack.pack_id}
                        state_pack_id={pack.state_pack_id}
                        states={states}
                    />
                </div>
                <h2 className='text-xl font-bold pb-3'>Etiquetas, personajes, series, autores e idioma</h2>
                <PackRelationsForm
                    pack_id={pack.pack_id}
                    labels={labels ?? []}
                    characters={characters ?? []}
                    series={series ?? []}
                    authors={authors ?? []}
                    languages={languages}
                    selected={{
                        label_ids: pack.pack_label.map((pl) => pl.label.label_id),
                        character_ids: pack.pack_character.map((pc) => pc.character.character_id),
                        serie_ids: pack.pack_serie.map((ps) => ps.serie.serie_id),
                        author_ids: pack.pack_authors.map((pa) => pa.author.author_id),
                        language_ids: pack.pack_languages.map((pl) => pl.language.language_id),
                    }}
                />
            </div>
            <div className='card'>
                <h2 className='text-xl font-bold pb-3'>Páginas / imágenes</h2>
                <PackPagesManager pages={pages} />
            </div>
        </div>
    )
}
