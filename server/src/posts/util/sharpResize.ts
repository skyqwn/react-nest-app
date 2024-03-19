import sharp from "sharp";

export default async (buffer: ArrayBuffer, width: number) => {
  const sharpImage = await sharp(buffer)
    .resize({ width })
    .toFormat("webp")
    .toBuffer();

  return sharpImage;
};
