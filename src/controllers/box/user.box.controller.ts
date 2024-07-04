/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import UserBoxModel from '../../models/box/user.box.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { UserBox } from '../../types/user.box.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import UserModel from '../../models/users/user.model';
const userModel = new UserModel();
const userBoxModel = new UserBoxModel();

export const createUserBox = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const newUserBox: UserBox = req.body;
      const createdUserBox = await userBoxModel.createUserBox(newUserBox);
      ResponseHandler.success(
        res,
        i18n.__('USER_BOX_CREATED_SUCCESSFULLY'),
        createdUserBox,
      );
    } catch (error: any) {
      ResponseHandler.badRequest(
        res,
        error.message,
      );
    }
  },
);

export const getAllUserBoxes = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const userBoxes = await userBoxModel.getAllUserBoxes();
      ResponseHandler.success(
        res,
        i18n.__('USER_BOXES_RETRIEVED_SUCCESSFULLY'),
        userBoxes,
      );
    } catch (error: any) {
      ResponseHandler.badRequest(
        res,
        error.message,
      );
    }
  },
);

export const getUserBoxById = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const userBoxId = req.params.id;
      const userBox = await userBoxModel.getOne(userBoxId);
      ResponseHandler.success(
        res,
        i18n.__('USER_BOX_RETRIEVED_SUCCESSFULLY'),
        userBox,
      );
    } catch (error: any) {
      ResponseHandler.badRequest(
        res,
        error.message,
      );
    }
  },
);

export const updateUserBox = asyncHandler(
  async (req: Request, res: Response) => {
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
      ResponseHandler.badRequest(
        res,
        error.message,
      );
    }
  },
);

export const deleteUserBox = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const userBoxId = req.params.id;
      const deletedUserBox = await userBoxModel.deleteOne(userBoxId);
      ResponseHandler.success(
        res,
        i18n.__('USER_BOX_DELETED_SUCCESSFULLY'),
        deletedUserBox,
      );
    } catch (error: any) {
      ResponseHandler.badRequest(
        res,
        error.message,
      );
    }
  },
);

export const getUserBoxesByUserId = asyncHandler(
  async (req: Request, res: Response) => {
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
      ResponseHandler.badRequest(
        res,
        error.message,
      );
    }
  },
);
export const getUserBoxesByBoxId = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const boxId = req.params.boxId;
      const userBoxes = await userBoxModel.getUserBoxesByBoxId(boxId);
      ResponseHandler.success(
        res,
        i18n.__('USER_BOXES_BY_BOX_ID_RETRIEVED_SUCCESSFULLY'),
        userBoxes,
      );
    } catch (error: any) {
      ResponseHandler.badRequest(
        res,
        error.message,
      );
    }
  },
);

export const assignBoxToUser = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { userId, boxId } = req.body;
      const assignedUserBox = await userBoxModel.assignBoxToUser(userId, boxId);
      ResponseHandler.success(
        res,
        i18n.__('BOX_ASSIGNED_TO_USER_SUCCESSFULLY'),
        assignedUserBox,
      );
    } catch (error: any) {
      ResponseHandler.badRequest(
        res,
        error.message,
      );
    }
  },
);
