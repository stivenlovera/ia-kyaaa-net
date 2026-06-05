import { Metadata } from "next";
import { Welcome } from "./_components/welcome";
import { ListNew } from "./_components/list-new";
import { PageHomeProps } from "./layout";

export const dynamic = 'force-dynamic';

/* export const metadata: Metadata = {
  title: 'Nuevas entradas',
  description: 'Nuevas entradas del mes de febrero',
} */

type Props = {
  params: Promise<{ id: string }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Nuevas entradas',
    description: 'Nuevas entradas del mes de febrero',
    openGraph: {
      images: [
        {
          url: 'https://usc1.contabostorage.com/698352ccd113428cb40866703a92c514:kyaaa.net/20260128202951/tumb/002.avif',
          alt: 'Nuevas entradas',
        },
      ],
    },
  };
}

export default async function Home({ params }: PageHomeProps) {
  const { locale } = await params;

  return (
    <div className="px-2 py-2 md:px-10 lg:px-20 xl:px-64 2xl:px-72 md:py-5 lg:py-10 xl:py-14">
      <div>
        <Welcome></Welcome>
      </div>
      <ListNew></ListNew>
      <div className="card">
        <div className="p-3 pt-0" >
          <p className="text-center text-3xl">Nuevas entradas</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-2 lg:gap-3 xl:gap-4">
          {/*  {
            packs.map((pack, i) => {
              const urlImage = `/api/image-proxy?url=${process.env.URL_S3}/${pack.code}/${pack.pages[0].page_size[0].size.name}/${pack.pages[0].num}.${pack.pages[0].page_size[0].size.extension}`
              //const urlImage = `${process.env.URL_S3}/${pack.code}/${pack.pages[0].page_size[0].size.name}/${pack.pages[0].num}.${pack.pages[0].page_size[0].size.extension}`
              return (
                <Card
                  code={pack.code}
                  name={pack.name}
                  urlImage={urlImage}
                  key={i}
                ></Card>
              )
            })
          } */}
        </div>
      </div>

    </div>
  );
}
