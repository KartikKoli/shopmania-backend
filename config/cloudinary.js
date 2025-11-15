import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv';

dotenv.config();

try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} catch (error) {
  console.log(`Error while configuring cloudinary`);
}

export default cloudinary;
