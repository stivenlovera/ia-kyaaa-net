import * as https from 'https';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import logger, { jsonLog } from './logger';
import sharp from 'sharp';

export interface IFile {
    name: string
    buffer?: Buffer
    path: string
}

export async function uploadMultipleObjects(file: IFile) {
    try {
        const agent = new https.Agent({
            keepAlive: true,
            maxSockets: 1000, // Adjust based on testing
        });
        const s3ClientImages = new S3Client({
            requestHandler: new NodeHttpHandler({
                httpsAgent: agent
            }),
            region: process.env.AWS_REGION,
            forcePathStyle: true,
            endpoint: process.env.AWS_ENPOINT,
            // Replace with your AWS region
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!, // Ensure these are set in your environment
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_STATIC,
            Key: `img/${file.name}`, // The destination object key (file name)
            Body: file.buffer, // The file content
        });
        const result = await s3ClientImages.send(command);
        logger.info(`Imagen insertada: ${jsonLog({
            httpStatusCode: result.$metadata.httpStatusCode,
            name: file.name,
            path: file.path
        })}`)
    } catch (err) {
        logger.error(`Error uploading objects: ${jsonLog(err)}`);
        throw err;
    }
}

export async function deleteMultipleObjects(file: IFile) {
    logger.info(`deleteMultipleObjects ${jsonLog(file)}`)
    try {
        const agent = new https.Agent({
            keepAlive: true,
            maxSockets: 1000, // Adjust based on testing
        });
        const s3ClientImages = new S3Client({
            requestHandler: new NodeHttpHandler({
                httpsAgent: agent
            }),
            region: process.env.AWS_REGION,
            forcePathStyle: true,
            endpoint: process.env.AWS_ENPOINT,
            // Replace with your AWS region
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!, // Ensure these are set in your environment
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });

        const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_STATIC,
            Key: `img/${file.name}`, // The destination object key (file name)
        });
        const result = await s3ClientImages.send(command);
        logger.info(`Imagen delete: ${jsonLog({
            httpStatusCode: result.$metadata.httpStatusCode,
            name: file.name,
            path: file.path
        })}`)
    } catch (err) {
        logger.error(`Error delete objects: ${jsonLog(err)}`);
        throw err;
    }
}

export async function getBufferFile(path: string) {
    const bufferMarkwater = await sharp(path)
        .toBuffer();
    return bufferMarkwater;
}