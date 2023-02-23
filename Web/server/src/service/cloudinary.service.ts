import { Injectable, Logger } from '@nestjs/common';
import * as cloudinary from 'cloudinary';
import { UploadDto } from './dto/upload.dto';

@Injectable()
export class CloudinaryService {
  logger = new Logger('CloudinaryService');

  async signUploadForm(uploadDto: UploadDto) {
    const timestamp = Math.round((new Date).getTime() / 1000);

    const signature = cloudinary.v2.utils.api_sign_request({
      timestamp: timestamp,
      folder: uploadDto.uploadFolder
    }, cloudinary.v2.config().api_secret);

    return { timestamp, signature };
  }
}
