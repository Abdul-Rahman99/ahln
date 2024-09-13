import { body, header, param } from 'express-validator';
import i18n from '../../config/i18n';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

export const createBoxValidation = [
  body('serial_number')
    .notEmpty()
    .withMessage(i18n.__('SERIAL_NUMBER_REQUIRED')),
  body('box_label').notEmpty().withMessage(i18n.__('BOX_LABEL_REQUIRED')),
  body('has_empty_lockers')
    .isBoolean()
    .withMessage(i18n.__('HAS_EMPTY_LOCKERS_BOOLEAN')),
  body('current_tablet_id')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('CURRENT_TABLET_ID_REQUIRED')),
  body('previous_tablet_id')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('PREVIOUS_TABLET_ID_REQUIRED')),
  body('box_model_id').isString().withMessage(i18n.__('BOX_MODEL_ID_REQUIRED')),
  validatorMiddleware,
];

export const updateBoxValidation = [
  body('serial_number')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('SERIAL_NUMBER_REQUIRED')),
  body('box_label')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('BOX_LABEL_REQUIRED')),
  body('has_empty_lockers')
    .optional()
    .isBoolean()
    .withMessage(i18n.__('HAS_EMPTY_LOCKERS_BOOLEAN')),
  body('current_tablet_id')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('CURRENT_TABLET_ID_REQUIRED')),
  body('box_model_id')
    .optional()
    .isString()
    .withMessage(i18n.__('BOX_MODEL_ID_REQUIRED')),
  body('address_id')
    .optional()
    .isString()
    .withMessage(i18n.__('ADDRESS_ID_REQUIRED')),
  validatorMiddleware,
];

export const getBoxByIdValidation = [
  param('id').isString().withMessage(i18n.__('INVALID_BOX_ID')),
  validatorMiddleware,
];

export const deleteBoxValidation = [
  param('id').isString().withMessage(i18n.__('INVALID_BOX_ID')),
  validatorMiddleware,
];

export const getBoxGenerationByIdValidation = [
  param('generationId')
    .isString()
    .withMessage(i18n.__('INVALID_BOX_GENERATION_ID')),
  validatorMiddleware,
];

export const updateBoxAndAddressValidation = [
  header('authorization')
    .notEmpty()
    .withMessage(i18n.__('AUTH_HEADER_REQUIRED'))
    .custom((value, { req }) => {
      if (!value.startsWith('Bearer ')) {
        throw new Error(i18n.__('AUTH_HEADER_INVALID'));
      }
      const token = value.split(' ')[1];
      // Perform further validation on the token if necessary
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).token = token;
      return true;
    }),
  param('id').isString().withMessage(i18n.__('INVALID_BOX_ID')),
  body('boxLabel')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('BOX_LABEL_REQUIRED')),
  body('country')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('COUNTRY_ID_REQUIRED')),
  body('city').optional().notEmpty().withMessage(i18n.__('CITY_ID_REQUIRED')),
  body('district')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('DISTRICT_ID_REQUIRED')),
  body('street')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('STREET_ID_REQUIRED')),
  validatorMiddleware,
];
