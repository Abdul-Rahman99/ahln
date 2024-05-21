import multer, { Multer, FileFilterCallback } from 'multer';
import path from 'path';
import { RequestHandler, Request } from 'express';

const multerOptions = (): Multer => {
  const multerStorage = multer.diskStorage({
    destination: function (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ) {
      cb(null, path.join(__dirname, '../uploads')); // Set your desired destination folder
    },
    filename: function (req: Request, file: Express.Multer.File, cb: Function) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
    },
  });

  const multerFilter = function (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new Error('Images onlly allowed'));
    }
  };

  const upload: Multer = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });

  return upload;
};

export const uploadSingleImage = (fieldName: string): RequestHandler =>
  multerOptions().single(fieldName);
