import { body, param } from 'express-validator';
import i18n from '../../config/i18n';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

export const createBoxGenerationValidation = [
  body('model_name').notEmpty().withMessage(i18n.__('MODEL_NAME_REQUIRED')),
  body('number_of_doors')
    .isInt({ min: 1 })
    .withMessage(i18n.__('NUMBER_OF_DOORS_INVALID')),
  body('width').optional().isNumeric().withMessage(i18n.__('WIDTH_INVALID')),
  body('height').optional().isNumeric().withMessage(i18n.__('HEIGHT_INVALID')),
  body('color').optional().isString().withMessage(i18n.__('COLOR_INVALID')),
  body('model_image')
    .optional()
    .isString()
    .withMessage(i18n.__('MODEL_IMAGE_INVALID')),
  body('has_outside_camera')
    .optional()
    .isBoolean()
    .withMessage(i18n.__('HAS_OUTSIDE_CAMERA_BOOLEAN')),
  body('has_inside_camera')
    .optional()
    .isBoolean()
    .withMessage(i18n.__('HAS_INSIDE_CAMERA_BOOLEAN')),
  body('has_tablet')
    .optional()
    .isBoolean()
    .withMessage(i18n.__('HAS_TABLET_BOOLEAN')),
  validatorMiddleware,
];

export const updateBoxGenerationValidation = [
  param('id').isString().withMessage(i18n.__('INVALID_BOX_ID')),
  body('model_name')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('MODEL_NAME_REQUIRED')),
  body('number_of_doors')
    .optional()
    .isInt({ min: 1 })
    .withMessage(i18n.__('NUMBER_OF_DOORS_INVALID')),
  body('width').optional().isNumeric().withMessage(i18n.__('WIDTH_INVALID')),
  body('height').optional().isNumeric().withMessage(i18n.__('HEIGHT_INVALID')),
  body('color').optional().isString().withMessage(i18n.__('COLOR_INVALID')),
  body('model_image')
    .optional()
    .isString()
    .withMessage(i18n.__('MODEL_IMAGE_INVALID')),
  body('has_outside_camera')
    .optional()
    .isBoolean()
    .withMessage(i18n.__('HAS_OUTSIDE_CAMERA_BOOLEAN')),
  body('has_inside_camera')
    .optional()
    .isBoolean()
    .withMessage(i18n.__('HAS_INSIDE_CAMERA_BOOLEAN')),
  body('has_tablet')
    .optional()
    .isBoolean()
    .withMessage(i18n.__('HAS_TABLET_BOOLEAN')),
  validatorMiddleware,
];

export const getBoxGenerationByIdValidation = [
  param('id').isString().withMessage(i18n.__('INVALID_BOX_ID')),
  validatorMiddleware,
];

export const deleteBoxGenerationValidation = [
  param('id').isString().withMessage(i18n.__('INVALID_BOX_ID')),
  validatorMiddleware,
];

export const updateHasOutsideCameraStatusValidation = [
  body('has_outside_camera')
    .notEmpty()
    .withMessage(i18n.__('HAS_OUTSIDE_CAMERA_STATUS_REQUIRED')),
  param('id')
    .isString()
    .notEmpty()
    .withMessage(i18n.__('BOX_GENERATION_ID_REQUIRED')),
  validatorMiddleware,
];

export const updateHasInsideCameraStatusValidation = [
  body('has_inside_camera')
    .notEmpty()
    .withMessage(i18n.__('HAS_INSIDE_CAMERA_STATUS_REQUIRED')),
  param('id')
    .isString()
    .notEmpty()
    .withMessage(i18n.__('BOX_GENERATION_ID_REQUIRED')),
  validatorMiddleware,
];

export const updateHasTabletStatusValidation = [
  body('has_tablet')
    .notEmpty()
    .withMessage(i18n.__('HAS_TABLET_CAMERA_STATUS_REQUIRED')),
  param('id')
    .isString()
    .notEmpty()
    .withMessage(i18n.__('BOX_GENERATION_ID_REQUIRED')),
  validatorMiddleware,
];
