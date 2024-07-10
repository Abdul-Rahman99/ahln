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
const userModel = new UserModel();
const userBoxModel = new UserBoxModel();
const relativeCustomerModel = new RelativeCustomerModel();
const boxModel = new BoxModel();

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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const getUserBoxesByUserId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract token from the request headers
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return ResponseHandler.badRequest(res, i18n.__('TOKEN_NOT_PROVIDED'));
      }

      // Find the user by the token
      const user = await userModel.findByToken(token);
      if (!user) {
        return ResponseHandler.unauthorized(res, i18n.__('INVALID_TOKEN'));
      }

      // Fetch user boxes by user ID
      const userBoxes = await userBoxModel.getUserBoxesByUserId(user);

      // Send a success response
      ResponseHandler.success(
        res,
        i18n.__('USER_BOXES_BY_USER_ID_RETRIEVED_SUCCESSFULLY'),
        userBoxes,
      );
    } catch (error: any) {
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
    } catch (error: any) {
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const userAssignBoxToHimself = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract token from the request headers
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return ResponseHandler.badRequest(res, i18n.__('TOKEN_NOT_PROVIDED'));
      }

      // Find the user by the token
      const user = await userModel.findByToken(token);
      if (!user) {
        return ResponseHandler.badRequest(res, i18n.__('INVALID_TOKEN'));
      }
      const { serialNumber } = req.body;
      const assignedUserBox = await userBoxModel.userAssignBoxToHimslef(
        user,
        serialNumber,
      );
      ResponseHandler.success(
        res,
        i18n.__('BOX_ASSIGNED_TO_USER_SUCCESSFULLY'),
        assignedUserBox,
      );
    } catch (error: any) {
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const userAssignBoxToRelativeUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract token from the request headers
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return ResponseHandler.badRequest(res, i18n.__('TOKEN_NOT_PROVIDED'));
      }

      // Find the user by the token
      const user = await userModel.findByToken(token);
      if (!user) {
        return ResponseHandler.badRequest(res, i18n.__('INVALID_TOKEN'));
      }
      const { boxId, email, relation } = req.body;
      const boxExist = await boxModel.getOne(boxId);
      if (!boxExist) {
        return ResponseHandler.badRequest(res, i18n.__('BOX_DOES_NOT_EXIST'));
      }
      const assignedUserBox = await userBoxModel.assignRelativeUser(
        user,
        boxId,
        email,
      );
      const relative_customer = await userModel.findByEmail(email);
      if (!relative_customer) {
        ResponseHandler.badRequest(res, i18n.__('USER_NOT_EXIST'));
      } else {
        const relativeCustomerData = {
          customer_id: user,
          relative_customer_id: relative_customer.id,
          relation: relation,
        };
        relativeCustomerModel.createRelativeCustomer(relativeCustomerData);
      }
      ResponseHandler.success(
        res,
        i18n.__('BOX_ASSIGNED_TO_RELATIVE_USER_SUCCESSFULLY'),
        assignedUserBox,
      );
    } catch (error: any) {
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);
