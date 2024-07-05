import { body, param } from 'express-validator';
import i18n from '../../config/i18n';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

// Function to validate date in MM-DD-YYYY format
const isValidDate = (dateString: string): boolean => {
  const [month, day, year] = dateString.split('-');
  const date = new Date(`${year}-${month}-${day}`);
  return !isNaN(date.getTime());
};

export const createSalesInvoiceValidation = [
  body('customer_id')
    .isString()
    .notEmpty()
    .withMessage(i18n.__('CUSTOMER_ID_REQUIRED')),
  body('box_id').isString().notEmpty().withMessage(i18n.__('BOX_ID_REQUIRED')),
  body('purchase_date')
    .custom((value) => {
      if (!isValidDate(value)) {
        throw new Error(i18n.__('INVALID_DATE_FORMAT'));
      }
      return true;
    })
    .withMessage(i18n.__('PURCHASE_DATE_REQUIRED')),
  body('sales_id')
    .isString()
    .notEmpty()
    .withMessage(i18n.__('SALES_ID_REQUIRED')),
  validatorMiddleware,
];

export const getSalesInvoiceByIdValidation = [
  param('id').isString().withMessage(i18n.__('INVALID_SALES_INVOICE_ID')),
  validatorMiddleware,
];

export const updateSalesInvoiceValidation = [
  param('id').isString().withMessage(i18n.__('INVALID_SALES_INVOICE_ID')),
  body('customer_id')
    .optional()
    .isString()
    .notEmpty()
    .withMessage(i18n.__('CUSTOMER_ID_REQUIRED')),
  body('box_id')
    .optional()
    .isString()
    .notEmpty()
    .withMessage(i18n.__('BOX_ID_REQUIRED')),
  body('purchase_date')
    .optional()
    .custom((value) => {
      if (!isValidDate(value)) {
        throw new Error(i18n.__('INVALID_DATE_FORMAT'));
      }
      return true;
    })
    .withMessage(i18n.__('PURCHASE_DATE_REQUIRED')),
  body('sales_id')
    .optional()
    .isString()
    .notEmpty()
    .withMessage(i18n.__('SALES_ID_REQUIRED')),
  validatorMiddleware,
];

export const deleteSalesInvoiceValidation = [
  param('id').isString().withMessage(i18n.__('INVALID_SALES_INVOICE_ID')),
  validatorMiddleware,
];

export const getSalesInvoicesByUserIdValidation = [
  body('user_id')
    .isString()
    .withMessage(i18n.__('INVALID_USER_SALES_INVOICE_ID')),
  validatorMiddleware,
];

export const getSalesInvoicesBySalesIdValidation = [
  body('sales_id')
    .isString()
    .withMessage(i18n.__('INVALID_USER_SALES_INVOICE_ID')),
  validatorMiddleware,
];

export const getSalesInvoicesByBoxIdValidation = [
  param('box_id').isString().withMessage(i18n.__('INVALID_BOX_ID')),
  validatorMiddleware,
];
