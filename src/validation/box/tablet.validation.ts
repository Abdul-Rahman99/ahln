import { body, param } from 'express-validator';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import TabletModel from '../../models/box/tablet.model';
import i18n from '../../config/i18n';

const tabletModel = new TabletModel();

export const createTabletValidation = [
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
      if (androidId) {
        const androidIdExists = await tabletModel.androidIdExists(androidId);
        if (androidIdExists) {
          throw new Error(i18n.__('ANDROID_ID_IN_USE'));
        }
      }
    }),
  validatorMiddleware,
];

export const updateTabletValidation = [
  param('id').isString().withMessage(i18n.__('INVALID_TABLET_ID')),
  body('serial_number')
    .optional()
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
    .optional()
    .notEmpty()
    .withMessage(i18n.__('ANDROID_ID_REQUIRED'))
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

export const getTabletByIdValidation = [
  param('id').isString().withMessage(i18n.__('INVALID_TABLET_ID')),
  validatorMiddleware,
];

export const deleteTabletValidation = [
  param('id').isString().withMessage(i18n.__('INVALID_TABLET_ID')),
  validatorMiddleware,
];
