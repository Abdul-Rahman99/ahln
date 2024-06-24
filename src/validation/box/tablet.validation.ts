import { body, check } from 'express-validator';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import TabletModel from '../../models/box/tablet.model';
import i18n from '../../config/i18n';

const tabletModel = new TabletModel();

export const getTabletValidator = [
  check('id').isString().withMessage(i18n.__('INVALID_ID')),
  validatorMiddleware,
];

export const createTabletValidator = [
  body('serial_number')
    .notEmpty()
    .withMessage(i18n.__('SERIAL_NUMBER_REQUIRED'))
    .custom(async (serialNumber) => {
      const serialNumberExists =
        await tabletModel.serialNumberExists(serialNumber);
      if (serialNumberExists) {
        throw new Error(i18n.__('SERIAL_NUMBER_IN_USE'));
      }
    }),
  body('android_id')
    .notEmpty()
    .withMessage(i18n.__('ANDROID_ID_REQUIRED'))
    .custom(async (androidId) => {
      const androidIdExists = await tabletModel.androidIdExists(androidId);
      if (androidIdExists) {
        throw new Error(i18n.__('ANDROID_ID_IN_USE'));
      }
    }),
  validatorMiddleware,
];

export const updateTabletValidator = [
  check('id').isString().withMessage(i18n.__('INVALID_ID')),
  body('serial_number')
    .optional()
    .custom(async (serialNumber) => {
      if (serialNumber) {
        const serialNumberExists =
          await tabletModel.serialNumberExists(serialNumber);
        if (serialNumberExists) {
          throw new Error(i18n.__('SERIAL_NUMBER_IN_USE'));
        }
      }
    }),
  body('android_id')
    .optional()
    .custom(async (androidId) => {
      if (androidId) {
        const androidIdExists = await tabletModel.androidIdExists(androidId);
        if (androidIdExists) {
          throw new Error(i18n.__('ANDROID_ID_IN_USE'));
        }
      }
    }),
  validatorMiddleware,
];

export const deleteTabletValidator = [
  check('id').isString().withMessage(i18n.__('INVALID_ID')),
  validatorMiddleware,
];
