import { IResponse } from '@/src/app/types/response';
import { NextRequest, NextResponse } from 'next/server';
import logger, { jsonLog } from '@/src/app/utils/logger';
import { getCurrentUser } from '@/src/app/utils/auth';
import { repositoryPack } from '@/src/app/repositories/pack.repository';
import { IPackInfoPage } from '@/src/app/types/pack.types';
import { repositoryCharacter } from '@/src/app/repositories/character.repository';
import { repositorySerie } from '@/src/app/repositories/serie.repository';
import { repositoryLabel } from '@/src/app/repositories/label.repository';
import { repositoryAuthor } from '@/src/app/repositories/author.repository';
import { repositoryPage } from '@/src/app/repositories/pages.repository';

export async function POST(request: NextRequest) {
    logger.info(`api/packs/pack-info POST ${jsonLog([])}`)
    try {
        const { code }: { code: string } = await request.json();
        const pack = await repositoryPack.findPackInfo(code);

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

        const resp: IResponse<IPackInfoPage> = {
            data: {
                ...pack!,
                total_characters: totalCharacter,
                total_series: totalSeries,
                total_labels: totalLabel,
                total_authors: totalAuthor,
                pages: pack_page!.pages!
            },
            message: 'Get pack info',
            success: true
        }
        return NextResponse.json(resp,
            { status: 200 }
        );
    } catch (error: any) {
        logger.error(`api/packs/new error=> ${jsonLog(error.message)}`)
        return NextResponse.json(
            { success: false, message: error.message || 'Login failed' },
            { status: 500 }
        );
    }
}