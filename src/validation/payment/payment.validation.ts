import { body, param } from 'express-validator';
import i18n from '../../config/i18n';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

// Function to validate date in MM-DD-YYYY format
const isValidDate = (dateString: string): boolean => {
  const [month, day, year] = dateString.split('-');
  const date = new Date(`${year}-${month}-${day}`);
  return !isNaN(date.getTime());
};

export const createPaymentValidation = [
  body('amount').isInt().notEmpty().withMessage(i18n.__('AMOUNT_REQUIRED')),
  body('card_id').isInt().notEmpty().withMessage(i18n.__('CARD_ID_REQUIRED')),
  body('billing_date')
    .custom((value) => {
      if (!isValidDate(value)) {
        throw new Error(i18n.__('INVALID_DATE_FORMAT'));
      }
      return true;
    })
    .withMessage(i18n.__('PURCHASE_DATE_REQUIRED')),
  body('is_paid')
    .optional()
    .isBoolean()
    .withMessage(i18n.__('IS_PAID_REQUIRED')),
  validatorMiddleware,
];

export const getPaymentByIdValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_PAYMENT_ID')),
  validatorMiddleware,
];

export const updatePaymentValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_PAYMENT_ID')),
  body('amount')
    .optional()
    .isInt()
    .notEmpty()
    .withMessage(i18n.__('AMOUNT_REQUIRED')),
  body('card_id')
    .optional()
    .isInt()
    .notEmpty()
    .withMessage(i18n.__('CARD_ID_REQUIRED')),
  body('billing_date')
    .optional()
    .custom((value) => {
      if (!isValidDate(value)) {
        throw new Error(i18n.__('INVALID_DATE_FORMAT'));
      }
      return true;
    })
    .withMessage(i18n.__('PURCHASE_DATE_REQUIRED')),
  body('is_paid')
    .optional()
    .isBoolean()
    .withMessage(i18n.__('IS_PAID_REQUIRED')),
  validatorMiddleware,
];

export const deletePaymentValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_PAYMENT_ID')),
  validatorMiddleware,
];
