import s3Config from './s3Config';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import sharpResize from './sharpResize';

interface PutImageParams {
  folderName?: string;
  file: Express.Multer.File;
  type?: 'GALLERY' | 'USER';
  resizeWidth?: number;
}

export default async ({
  folderName,
  type,
  file,
  resizeWidth,
}: PutImageParams) => {
  let bufferData = file.buffer;

  // console.log(process.env.AWS_BUCKET_NAME);
  // console.log(process.env.AWS_SECRET_ACCESS_KEY);
  // console.log(process.env.AWS_ACCESS_KEY);
  // console.log(process.env.AWS_S3_REGION);

  try {
    if (resizeWidth) {
      bufferData = await sharpResize(bufferData, resizeWidth);
    }

    const input = {
      Body: bufferData,
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${file.originalname}`,
      // Key: `${type}/${folderName}/${file.originalname}`,
    };

    console.log(input);
    //
    await s3Config.send(new PutObjectCommand(input));

    // const s3Domain = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com`;

    // return `${s3Domain}/${input.Key}`;
  } catch (error) {
    throw Error('upload fail');
  }
};
