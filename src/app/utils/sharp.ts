import sharp from "sharp";
import logger from "./logger";

export async function resizeImage(path: string, nameFile: string) {
    logger.info(`resizeImage ${path}`)
    logger.info(`nameFile ${nameFile}`)
    const image = sharp(path)
    await image
        .resize(450)
        .toFormat("avif")
        .toFile(`./public/resize/${nameFile}.avif`);
}