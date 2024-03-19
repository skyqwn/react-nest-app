import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import sharp from 'sharp';

const MAX_LENGTH = 1024;

@Injectable()
export class ResizeImagePipe implements PipeTransform {
  isSingleFile(value: any): value is Express.Multer.File {
    return value && 'fieldname' in value && 'originalname' in value;
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    console.log(2323);
    console.log(value);
    console.log(4323);
    // if (!this.isSingleFile(value)) {
    //   const result = { ...value };
    //   const keys = Object.keys(value);

    //   for (const key of keys) {
    //     const filetype = value[key][0].mimetype.split('/');

    //     if (filetype[0] === 'image') {
    //       result[key][0] = await this.resizeImage(value[key][0]);
    //     }
    //   }

    //   return result;
    // }

    const filetype = value[0].mimetype.split('/');
    if (filetype[0] === 'image') {
      value = await this.resizeImage(value, 1240);
    }
    console.log(value);
    return value;
  }

  async resizeImage(buffer: ArrayBuffer, w: number) {
    let width;
    let height;

    // 메타데이터를 읽어서 이미지의 가로세로 길이를 알아냄
    // await sharp(buffer)
    //   .metadata()
    //   .then((metadata) => {
    //     width = metadata.width;
    //     height = metadata.height;
    //   });

    // 가로세로 길이가 MAX_LENGTH를 넘어가지 않으면 리사이징 불필요
    // if (width < MAX_LENGTH && height < MAX_LENGTH) {
    //   return buffer;
    // }

    // // 가로세로 길이중 더 긴것을 MAX_LENGTH에 맞춰준다
    // const resizeOption =
    //   width >= height ? { width: MAX_LENGTH } : { height: MAX_LENGTH };

    const sharpImage = await sharp(buffer)
      .resize(w)
      .toFormat('webp')
      .toBuffer();

    // value.buffer = buffer;
    return buffer;
  }
}
