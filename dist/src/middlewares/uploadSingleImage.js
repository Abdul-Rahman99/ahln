"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSingleImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const multerOptions = () => {
    const multerStorage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path_1.default.join(__dirname, '../../uploads'));
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-';
            let filename = 'image-' + uniqueSuffix + path_1.default.extname(file.originalname);
            if (!file.originalname.toLowerCase().endsWith('.png')) {
                filename = filename.replace(/\.[^.]+$/, '.png');
            }
            cb(null, filename);
        },
    });
    const multerFilter = function (req, file, cb) {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only images allowed'));
        }
    };
    const upload = (0, multer_1.default)({
        storage: multerStorage,
        fileFilter: multerFilter,
    });
    return upload;
};
const uploadSingleImage = (fieldName) => multerOptions().single(fieldName);
exports.uploadSingleImage = uploadSingleImage;
//# sourceMappingURL=uploadSingleImage.js.map