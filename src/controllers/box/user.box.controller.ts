/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import UserBoxModel from '../../models/box/user.box.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { UserBox } from '../../types/user.box.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import UserModel from '../../models/users/user.model';
import RelativeCustomerModel from '../../models/users/relative.customer.model';
import BoxModel from '../../models/box/box.model';
import authHandler from '../../utils/authHandler';
import AddressModel from '../../models/box/address.model';
import { Address } from '../../types/address.type';
const userModel = new UserModel();
const userBoxModel = new UserBoxModel();
const relativeCustomerModel = new RelativeCustomerModel();
const boxModel = new BoxModel();
const addressModel = new AddressModel();
import SystemLogModel from '../../models/logs/system.log.model';
const systemLog = new SystemLogModel();

import AuditTrailModel from '../../models/logs/audit.trail.model';
const auditTrail = new AuditTrailModel();

export const createUserBox = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUserBox: UserBox = req.body;
      const createdUserBox = await userBoxModel.createUserBox(newUserBox);
      ResponseHandler.success(
        res,
        i18n.__('USER_BOX_CREATED_SUCCESSFULLY'),
        createdUserBox,
      );
      const auditUser = await authHandler(req, res, next);
      const action = 'createUserBox';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('USER_BOX_CREATED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'createUserBox';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const getAllUserBoxes = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userBoxes = await userBoxModel.getAllUserBoxes();
      ResponseHandler.success(
        res,
        i18n.__('USER_BOXES_RETRIEVED_SUCCESSFULLY'),
        userBoxes,
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'getAllUserBoxes';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const getUserBoxById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userBoxId = req.params.id;
      const userBox = await userBoxModel.getOne(userBoxId);
      ResponseHandler.success(
        res,
        i18n.__('USER_BOX_RETRIEVED_SUCCESSFULLY'),
        userBox,
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'getUserBoxById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const updateUserBox = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userBoxId = req.params.id;
      const userBoxData: Partial<UserBox> = req.body;
      const updatedUserBox = await userBoxModel.updateOne(
        userBoxData,
        userBoxId,
      );
      ResponseHandler.success(
        res,
        i18n.__('USER_BOX_UPDATED_SUCCESSFULLY'),
        updatedUserBox,
      );
      const auditUser = await authHandler(req, res, next);
      const action = 'updateUserBox';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('USER_BOX_UPDATED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'updateUserBox';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const deleteUserBox = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userBoxId = req.params.id;
      const deletedUserBox = await userBoxModel.deleteOne(userBoxId);
      ResponseHandler.success(
        res,
        i18n.__('USER_BOX_DELETED_SUCCESSFULLY'),
        deletedUserBox,
      );
      const auditUser = await authHandler(req, res, next);
      const action = 'deleteUserBox';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('USER_BOX_DELETED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'deleteUserBox';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const getUserBoxesByUserId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authHandler(req, res, next);

      // Fetch user boxes by user ID
      const userBoxes = await userBoxModel.getUserBoxesByUserId(user);

      // Send a success response
      ResponseHandler.success(
        res,
        i18n.__('USER_BOXES_BY_USER_ID_RETRIEVED_SUCCESSFULLY'),
        userBoxes,
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'getUserBoxesByUserId';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);
export const getUserBoxesByBoxId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boxId = req.params.boxId;
      const userBoxes = await userBoxModel.getUserBoxesByBoxId(boxId);
      ResponseHandler.success(
        res,
        i18n.__('USER_BOXES_BY_BOX_ID_RETRIEVED_SUCCESSFULLY'),
        userBoxes,
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'getUserBoxesByBoxId';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const assignBoxToUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, boxId } = req.body;

      const assignedUserBox = await userBoxModel.assignBoxToUser(userId, boxId);
      ResponseHandler.success(
        res,
        i18n.__('BOX_ASSIGNED_TO_USER_SUCCESSFULLY'),
        assignedUserBox,
      );
      const auditUser = await authHandler(req, res, next);
      const action = 'assignBoxToUser';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('BOX_ASSIGNED_TO_USER_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'assignBoxToUser';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const userAssignBoxToHimself = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authHandler(req, res, next);

      const { serialNumber } = req.body;
      // create address
      const newAddress: Address = req.body;

      const result = await addressModel.createAddress(newAddress);

      const assignedUserBox = await userBoxModel.userAssignBoxToHimslef(
        user,
        serialNumber,
        result.id,
      );
      ResponseHandler.success(
        res,
        i18n.__('BOX_ASSIGNED_TO_USER_SUCCESSFULLY'),
        assignedUserBox,
      );
      const action = 'userAssignBoxToHimself';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('BOX_ASSIGNED_TO_USER_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'userAssignBoxToHimself';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const userAssignBoxToRelativeUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authHandler(req, res, next);

      const { boxId, email, relation } = req.body;
      const boxExist = await boxModel.getOne(boxId);
      if (!boxExist) {
        const user = await authHandler(req, res, next);
        const source = 'userAssignBoxToRelativeUser';
        systemLog.createSystemLog(user, 'Box Does Not Exist', source);
        return ResponseHandler.badRequest(res, i18n.__('BOX_DOES_NOT_EXIST'));
      }
      const assignedUserBox = await userBoxModel.assignRelativeUser(
        user,
        boxId,
        email,
      );
      const relative_customer = await userModel.findByEmail(email);
      if (!relative_customer) {
        const user = await authHandler(req, res, next);
        const source = 'userAssignBoxToRelativeUser';
        systemLog.createSystemLog(user, 'User Does Not Exist', source);
        ResponseHandler.badRequest(res, i18n.__('USER_NOT_EXIST'));
      } else {
        const relativeCustomerData = {
          customer_id: user,
          relative_customer_id: relative_customer.id,
          relation: relation,
          box_id: boxId,
        };
        relativeCustomerModel.createRelativeCustomer(relativeCustomerData);
      }
      ResponseHandler.success(
        res,
        i18n.__('BOX_ASSIGNED_TO_RELATIVE_USER_SUCCESSFULLY'),
        assignedUserBox,
      );
      const action = 'userAssignBoxToRelativeUser';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('BOX_ASSIGNED_TO_RELATIVE_USER_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'userAssignBoxToRelativeUser';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);
