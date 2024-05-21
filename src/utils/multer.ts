// import multer, { Multer } from "multer";
// import path from "path";
// import { Request } from "express";

// // Custom error class for invalid file types
// class InvalidFileTypeError extends Error {
//   status: number;
//   constructor(fileType: string) {
//     super(`Invalid file type: ${fileType}`);
//     this.name = "InvalidFileTypeError";
//     this.status = 400;
//   }
// }

// // Infer file type based on the file extension
// function inferFileType(file: any): "video" | "image" | "pdf" {
//   const extname = path.extname(file.originalname).toLowerCase();

//   if ([".jpg", ".jpeg", ".png", ".svg"].includes(extname)) {
//     return "image";
//   } else if ([".mp4", ".mov"].includes(extname)) {
//     return "video";
//   } else if (extname === ".pdf") {
//     return "pdf";
//   } else {
//     throw new InvalidFileTypeError(extname);
//   }
// }
// class CustomError extends Error {
//   status: number;

//   constructor(status: number, message: string) {
//     super(message);
//     this.name = "CustomError";
//     this.status = status;
//   }
// }

// // Configure multer for image storage based on category
// function configureMulter(filePath: string): Multer {
//   const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       // Use filePath to determine the destination directory
//       const fileTypeDir = `uploads/${filePath}`;
//       cb(null, fileTypeDir);
//     },
//     filename: (req, file, cb) => {
//       const type = inferFileType(file);
//       const uniqueSuffix =
//         new Date().toISOString().replace(/:/g, "-") +
//         "-" +
//         Math.round(Math.random() * 1e9);
//       const extname = path.extname(file.originalname);

//       const fileName = `${type}-${uniqueSuffix}-${extname}`;

//       cb(null, fileName);
//     },
//   });

//   const fileFilter = (
//     req: Request,
//     file: any,
//     cb: multer.FileFilterCallback
//   ) => {
//     try {
//       inferFileType(file);
//       cb(null, true);
//     } catch (error) {
//       // Handle the specific case of InvalidFileTypeError
//       if (error instanceof InvalidFileTypeError) {
//         const customError = new CustomError(
//           error.status || 400,
//           error.message || "Invalid file type"
//         );
//         cb(customError);
//       } else {
//         // If it's not an InvalidFileTypeError, pass the error to the next middleware
//         cb(error);
//       }
//     }
//   };

//   return multer({
//     storage,
//     limits: {
//       fileSize: 1024 * 1024,
//     },
//     fileFilter,
//   });
// }

// export default configureMulter;
