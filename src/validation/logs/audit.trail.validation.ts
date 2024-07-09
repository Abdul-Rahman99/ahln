import { param } from 'express-validator';
import i18n from '../../config/i18n';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

export const getAuditTrailByIdValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_AUDIT_TRAIL_ID')),
  validatorMiddleware,
];
export const deleteTrailByIdValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_AUDIT_TRAIL_ID')),
  validatorMiddleware,
];
