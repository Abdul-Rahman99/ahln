import { Request, Response } from 'express';
import BoxModel from '../../models/box/box.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { Box } from '../../types/box.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';
import AuditTrailModel from '../../models/logs/audit.trail.model';
import CountryModel from '../../models/adminstration/country.model';
import CityModel from '../../models/adminstration/city.model';
import UserBoxModel from '../../models/box/user.box.model';

const userBoxModel = new UserBoxModel();
const countryModel = new CountryModel();
const cityModel = new CityModel();
const auditTrail = new AuditTrailModel();
const systemLog = new SystemLogModel();
const boxModel = new BoxModel();

export const createBox = asyncHandler(async (req: Request, res: Response) => {
  const user = await authHandler(req, res);

  try {
    const newBox: Box = req.body;
    const boxExist = await boxModel.boxExistsSerialNumber(newBox.serial_number);
    if (boxExist) {
      const source = 'createBox';
      systemLog.createSystemLog(user, i18n.__('BOX_ALREADY_EXISTS'), source);
      return ResponseHandler.badRequest(res, i18n.__('BOX_ALREADY_EXISTS'));
    }

    const createdBox = await boxModel.createBox(newBox);
    ResponseHandler.success(
      res,
      i18n.__('BOX_CREATED_SUCCESSFULLY'),
      createdBox,
    );
    const action = 'createBox';
    auditTrail.createAuditTrail(
      user,
      action,
      i18n.__('BOX_CREATED_SUCCESSFULLY'),
      createdBox.id,
    );
  } catch (error) {
    const source = 'createBox';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, (error as Error).message);
    // next(error);
  }
});

export const getAllBoxes = asyncHandler(async (req: Request, res: Response) => {
  try {
    const boxes = await boxModel.getMany();
    ResponseHandler.success(
      res,
      i18n.__('BOXES_RETRIEVED_SUCCESSFULLY'),
      boxes,
    );
  } catch (error) {
    const user = await authHandler(req, res);
    const source = 'getAllBoxes';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, (error as Error).message);
    // next(error);
  }
});

export const getBoxById = asyncHandler(async (req: Request, res: Response) => {
  const user = await authHandler(req, res);
  try {
    const boxId = req.params.id;
    const box = await boxModel.getOne(boxId);
    ResponseHandler.success(res, i18n.__('BOX_RETRIEVED_SUCCESSFULLY'), box);
  } catch (error) {
    const source = 'getBoxById';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, (error as Error).message);
    // next(error);
  }
});

export const updateBox = asyncHandler(async (req: Request, res: Response) => {
  const user = await authHandler(req, res);

  try {
    const boxId = req.params.id;
    const boxData: Partial<Box> = req.body;
    const updatedBox = await boxModel.updateOne(boxData, boxId);
    ResponseHandler.success(
      res,
      i18n.__('BOX_UPDATED_SUCCESSFULLY'),
      updatedBox,
    );
    const action = 'updateBox';
    auditTrail.createAuditTrail(
      user,
      action,
      i18n.__('BOX_UPDATED_SUCCESSFULLY'),
      updatedBox.id,
    );
  } catch (error) {
    const source = 'updateBox';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, (error as Error).message);
    // next(error);
  }
});

export const deleteBox = asyncHandler(async (req: Request, res: Response) => {
  const user = await authHandler(req, res);

  try {
    const boxId = req.params.id;
    const deletedBox = await boxModel.deleteOne(boxId);
    ResponseHandler.success(
      res,
      i18n.__('BOX_DELETED_SUCCESSFULLY'),
      deletedBox,
    );
    const action = 'deleteBox';
    auditTrail.createAuditTrail(
      user,
      action,
      i18n.__('BOX_DELETED_SUCCESSFULLY'),
      deletedBox.id,
    );
  } catch (error) {
    const source = 'deleteBox';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, (error as Error).message);
    // next(error);
  }
});

export const getBoxesByGenerationId = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);

    try {
      const boxGenerationId = req.params.generationId;
      const boxes = await boxModel.getBoxesByGenerationId(boxGenerationId);

      ResponseHandler.success(
        res,
        i18n.__('BOXES_RETRIEVED_SUCCESSFULLY'),
        boxes,
      );
    } catch (error) {
      const source = 'getBoxesByGenerationId';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const getBoxByTabletInfo = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);

    try {
      const { androidTabletId, tabletSerialNumber } = req.body;
      const box = await boxModel.getBoxByTabletInfo(
        androidTabletId,
        tabletSerialNumber,
      );
      ResponseHandler.success(res, i18n.__('BOX_RETRIEVED_SUCCESSFULLY'), box);
    } catch (error) {
      const source = 'getBoxByTabletInfo';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const assignTabletToBox = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);

    try {
      const { tabletId, boxId } = req.body;
      const assignTabletToBox = await boxModel.assignTabletToBox(
        tabletId,
        boxId,
      );
      ResponseHandler.success(
        res,
        i18n.__('TABLET_ASSIGNED_TO_BOX_SUCCESSFULLY'),
        assignTabletToBox,
      );
      const action = 'assignTabletToBox';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('TABLET_ASSIGNED_TO_BOX_SUCCESSFULLY'),
        boxId,
      );
    } catch (error) {
      const source = 'assignTabletToBox';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const resetTabletId = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    try {
      const { tabletId, boxId } = req.body;
      const resetedTablte = await boxModel.resetTabletId(tabletId, boxId);
      ResponseHandler.success(
        res,
        i18n.__('TABLET_RESET_TO_BOX_SUCCESSFULLY'),
        resetedTablte,
      );
      const action = 'resetTabletId';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('TABLET_RESET_TO_BOX_SUCCESSFULLY'),
        boxId,
      );
    } catch (error) {
      const source = 'resetTabletId';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const updateBoxAndAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);

    try {
      const boxId = req.params.id;
      const { boxLabel, country_id, city_id, district, street } = req.body;

      if (!boxId) {
        return ResponseHandler.badRequest(res, i18n.__('BOX_ID_REQUIRED'));
      }

      const boxRelatedToUser = await userBoxModel.checkUserBox(user, boxId);

      if (!boxRelatedToUser) {
        return ResponseHandler.badRequest(
          res,
          i18n.__('BOX_NOT_RELATED_TO_USER'),
        );
      }

      // check if the city and country exist
      const countryExist = await countryModel.getOne(country_id);
      if (!countryExist) {
        return ResponseHandler.badRequest(res, i18n.__('COUNTRY_NOT_EXIST'));
      }

      const cityExist = await cityModel.getCityById(city_id);
      if (!cityExist) {
        return ResponseHandler.badRequest(res, i18n.__('CITY_NOT_EXIST'));
      }
      const updatedBox = await boxModel.updateBoxAndAddress(
        boxId,
        boxLabel,
        country_id,
        city_id,
        district,
        street,
      );

      const action = 'updateBoxAndAddress';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('BOX_UPDATED_SUCCESSFULLY'),
        null,
      );
      ResponseHandler.success(
        res,
        i18n.__('BOX_UPDATED_SUCCESSFULLY'),
        updatedBox,
      );
    } catch (error) {
      const source = 'updateBoxAndAddress';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);
