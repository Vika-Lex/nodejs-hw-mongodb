import cloudinary from 'cloudinary';
import fs from 'node:fs/promises';

import { getEnvVar } from './getEnvVar.js';
import { CLOUDINARY } from '../constants/index.js';

const cloudName = getEnvVar(CLOUDINARY.CLOUD_NAME);
const apiKey = getEnvVar(CLOUDINARY.API_KEY);
const apiSecret = getEnvVar(CLOUDINARY.API_SECRET);

console.log('Cloudinary config:', {
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret ? `${apiSecret.substring(0, 3)}...${apiSecret.substring(apiSecret.length - 3)}` : 'undefined'
});

cloudinary.v2.config({
  secure: true,
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export const saveFileToCloudinary = async (file) => {
  console.log('Uploading file to Cloudinary:', file.path);
  const response = await cloudinary.v2.uploader.upload(file.path);
  console.log('Cloudinary response:', response.secure_url);
  await fs.unlink(file.path);
  return response.secure_url;
};
