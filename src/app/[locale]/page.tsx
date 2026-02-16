import { Metadata } from "next";
import { prisma } from "../utils/prisma";
import { Card } from "./_components/card";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Nuevas entradas',
  description: 'Nuevas entradas del mes de febrero',
}

interface PageHomeProps {
  params: Promise<{
    locale: string
  }>
}

export default async function Home({ params }: PageHomeProps) {
  const { locale } = await params;

  const packs = await prisma.pack.findMany({
    select: {
      name: true,
      description: true,
      pack_id: true,
      code: true,
      pages: {
        select: {
          num: true,
          page_size: {
            where: {
              size_id: 1
            },
            select: {
              size: {
                select: {
                  extension: true,
                  name: true
                }
              }
            }
          }
        }
      },
    },
    where: {
      state: 1,
    }
  });

  //logger.info(`PageCode/pack ${jsonLog(packs)}`)

  return (
    <div>
      <div className="bg-neutral-800 items-center justify-center p-2 md:p-5 lg:p-10 xl:p-10 ">
        <div className="p-3 pt-0" >
          <p className="text-center text-3xl">Nuevas entradas</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-2 lg:gap-3 xl:gap-4">
          {
            packs.map((pack, i) => {
              const urlImage = `${process.env.URL_S3}/${pack.code}/${pack.pages[0].page_size[0].size.name}/${pack.pages[0].num}.${pack.pages[0].page_size[0].size.extension}`
              return (
                <Card
                  code={pack.code}
                  name={pack.name}
                  urlImage={urlImage}
                  key={i}
                ></Card>
              )
            })
          }
        </div>
      </div>

    </div>
  );
}
