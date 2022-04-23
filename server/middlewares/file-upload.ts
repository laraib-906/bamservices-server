import multer from "multer";
import path = require('path');
import { v4 as uuidv4 } from 'uuid';

export function uploadMiddleware() {
    const fileStorageEngine = multer.diskStorage({
      destination: process.env.UPLOADED_FILES_PATH || './uploads',
      filename: (req, file, cb) => {
          const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
          const extension: string = path.parse(file.originalname).ext;
          cb(null, `${filename}${extension}`)
      }
  });
  return multer({ storage: fileStorageEngine });
}
