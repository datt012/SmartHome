import * as cloudinary from 'cloudinary';
import { config } from './config';

export const setupCloudinary = () => {
  cloudinary.v2.config({
    cloud_name: config.get('application.cld.cloudname'),
    api_key: config.get('application.cld.api-key'),
    api_secret: config.get('application.cld.api-secret')
  });
};
