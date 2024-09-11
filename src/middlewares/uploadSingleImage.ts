import multer, { Multer, FileFilterCallback } from 'multer';
import { RequestHandler, Request } from 'express';

const multerOptions = (): Multer => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = function (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'));
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
