
import Link from "next/link";
import logger, { jsonLog } from "../utils/logger";
import { Metadata } from "next";
import Image from "next/image";
import { prisma } from "../utils/prisma";

export const metadata: Metadata = {
  title: 'Nuevas entradas',
  description: 'Nuevas entradas del mes de febrero',
}

export default async function Home() {

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
            packs.map((pack, i) =>

            (
              <div key={i} className="border-slate-900 border-2">
                <Link
                  className="items-start justify-center"
                  href={`/${pack.code}`}
                >
                  <Image
                    width={400}
                    height={500}
                    alt={`Preview ${pack.name}`}
                    fetchPriority="high"
                    className="w-full"
                    src={`${process.env.URL_S3}/${pack.code}/${pack.pages[0].page_size[0].size.name}/${pack.pages[0].num}.${pack.pages[0].page_size[0].size.extension}`}
                  />
                  <div className=''>
                    <div className='basis-full bg-gray-800 p-1'>
                      <div className='line-clamp-2 hover:line-clamp-none sm:text-14 xl:text-16'>
                        {/* <p className='inline bg-gray-900 p-1 text-sm' >
                        spanish
                      </p> */}
                        {pack.name.toLocaleUpperCase()}
                      </div>
                    </div>

                  </div>
                </Link>
              </div>
            ))
          }
        </div>
      </div>

    </div>
  );
}
