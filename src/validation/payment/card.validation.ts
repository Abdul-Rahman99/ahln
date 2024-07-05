import { body, param } from 'express-validator';
import i18n from '../../config/i18n';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

export const createCardValidation = [
  body('card_number')
    .isString()
    .notEmpty()
    .withMessage(i18n.__('CARD_NUMBER_REQUIRED'))
    .isLength({ min: 16, max: 16 })
    .withMessage(i18n.__('CARD_NUMBER_MUST_BE_16_CHARCHTER'))
    .isLength({ min: 16, max: 16 })
    .withMessage(i18n.__('CARD_NUMBER_MUST_BE_16_CHARCHTER')),
  body('expire_date')
    .isString()
    .notEmpty()
    .withMessage(i18n.__('EXPIRE_DATE_REQUIRED')),
  body('cvv')
    .isString()
    .notEmpty()
    .isLength({ min: 3, max: 3 })
    .withMessage(i18n.__('CVV_REQUIRED')),
  body('name_on_card')
    .isString()
    .notEmpty()
    .withMessage(i18n.__('NAME_ON_CARD_REQUIRED')),
  body('billing_address').isInt().optional(),
  body('user_id')
    .isString()
    .notEmpty()
    .withMessage(i18n.__('USER_ID_REQUIRED')),
  validatorMiddleware,
];

export const getCardByIdValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_CARD_ID')),
  validatorMiddleware,
];

export const updateCardValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_CARD_ID')),
  body('card_number')
    .isString()
    .optional()
    .notEmpty()
    .withMessage(i18n.__('CARD_NUMBER_REQUIRED')),
  body('expire_date')
    .isString()
    .optional()
    .notEmpty()
    .withMessage(i18n.__('EXPIRE_DATE_REQUIRED')),
  body('cvv')
    .isString()
    .optional()
    .notEmpty()
    .isLength({ min: 3, max: 3 })
    .withMessage(i18n.__('CVV_REQUIRED')),
  body('name_on_card')
    .isString()
    .optional()
    .notEmpty()
    .withMessage(i18n.__('NAME_ON_CARD_REQUIRED')),
  body('billing_address').isInt().optional(),
  body('user_id')
    .isString()
    .optional()
    .notEmpty()
    .withMessage(i18n.__('USER_ID_REQUIRED')),
  validatorMiddleware,
];

export const deleteCardValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_CARD_ID')),
  validatorMiddleware,
];
