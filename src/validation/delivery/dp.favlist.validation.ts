import { body, header } from 'express-validator';
import i18n from '../../config/i18n';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

export const createDPFavListValidation = [
  body('delivery_package_id')
    .isString()
    .withMessage(i18n.__('DELIVERY_PACKAGE_ID_REQUIRED')),
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
  validatorMiddleware,
];
