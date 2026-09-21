// URLs de las imágenes de los packs. Solo para el servidor: usa las credenciales de S3.
//
// - Página gratis: URL pública estable (NEXT_PUBLIC_PACKS_URL_S3), cacheable.
// - Página de pago: URL firmada del bucket privado (AWS_BUCKET_PACKS_PRIVATE) que caduca.
//   Quien llama debe haber comprobado antes que el usuario puede ver la página
//   (ver repositoryPage.findPagesPack); esta función solo firma.
// - Si AWS_BUCKET_PACKS_PRIVATE no está definida, todo se sirve con la URL pública. Así el código se
//   puede desplegar antes de mover los archivos al bucket privado (scripts/move-paid-pages.mjs).
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Un lector puede pasar horas en el visor sin recargar la página, por eso el margen es amplio.
export const SIGNED_URL_TTL_SECONDS = 6 * 60 * 60;

export interface IPackImageSource {
    code: string
    size: string
    num: string
    extension: string
    /** La página es gratis (page_type 1): vive en el bucket público. */
    free: boolean
}

let client: S3Client | undefined;

function getClient(): S3Client {
    client ??= new S3Client({
        region: process.env.AWS_REGION,
        forcePathStyle: true,
        endpoint: process.env.AWS_ENPOINT,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
    });
    return client;
}

export async function packImageUrl({ code, size, num, extension, free }: IPackImageSource): Promise<string> {
    const key = `${code}/${size}/${num}.${extension}`;
    const privateBucket = process.env.AWS_BUCKET_PACKS_PRIVATE;
    if (free || !privateBucket) {
        return `${process.env.NEXT_PUBLIC_PACKS_URL_S3}/${key}`;
    }
    return getSignedUrl(
        getClient(),
        new GetObjectCommand({ Bucket: privateBucket, Key: key }),
        { expiresIn: SIGNED_URL_TTL_SECONDS },
    );
}
