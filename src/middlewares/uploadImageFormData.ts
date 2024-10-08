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
      cb(null, path.join(__dirname, '../../uploads')); // Desired destination folder is uploads
    },
    // eslint-disable-next-line @typescript-eslint/ban-types
    filename: function (req: Request, file: Express.Multer.File, cb: Function) {
      const uniqueSuffix = Date.now() + '-';
      let filename = 'image-' + uniqueSuffix + path.extname(file.originalname);

      // Transform non-PNG images to PNG
      if (!file.originalname.toLowerCase().endsWith('.png')) {
        filename = filename.replace(/\.[^.]+$/, '.png');
      }

      cb(null, filename);
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
      cb(new Error('Only images allowed'));
    }
  };

  const upload: Multer = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });

  return upload;
};

export const uploadFormData = (fieldName: string): RequestHandler =>
  multerOptions().single(fieldName);
