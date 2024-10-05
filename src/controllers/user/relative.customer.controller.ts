/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import RelativeCustomerModel from '../../models/users/relative.customer.model';
import { RelativeCustomer } from '../../types/relative.customer.type';
import { RelativeCustomerAccess } from '../../types/realative.customer.acces.type';
import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';
import AuditTrailModel from '../../models/logs/audit.trail.model';
import NotificationModel from '../../models/logs/notification.model';
import UserDevicesModel from '../../models/users/user.devices.model';
import BoxModel from '../../models/box/box.model';
import RealativeCustomerAccessModel from '../../models/users/relative.customer.access.model';
import UserBoxModel from '../../models/box/user.box.model';

const userBoxModel = new UserBoxModel();
const relativeCustomerAccessModel = new RealativeCustomerAccessModel();
const boxModel = new BoxModel();
const userDevicesModel = new UserDevicesModel();
const notificationModel = new NotificationModel();
const systemLog = new SystemLogModel();
const auditTrail = new AuditTrailModel();
const relativeCustomerModel = new RelativeCustomerModel();

export const createRelativeCustomer = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }
    try {
      const newRelaticeCustomerData: RelativeCustomer = req.body;
      const newRelaticeCustomerAccessData: RelativeCustomerAccess = req.body;

      const boxExist = await boxModel.getOne(newRelaticeCustomerData.box_id);
      if (!boxExist) {
        const source = 'createRelativeCustomer';
        systemLog.createSystemLog(user, 'Box Does Not Exist', source);
        return ResponseHandler.badRequest(res, i18n.__('BOX_DOES_NOT_EXIST'));
      }

      const boxRelatedToUSer = await userBoxModel.checkUserBox(
        newRelaticeCustomerData.customer_id,
        newRelaticeCustomerData.box_id,
      );
      if (!boxRelatedToUSer) {
        const source = 'createRelativeCustomer';
        systemLog.createSystemLog(user, 'Box Not Related To User', source);
        return ResponseHandler.badRequest(
          res,
          i18n.__('BOX_NOT_RELATED_TO_USER'),
        );
      }

      // check if relative customer exists
      const relativeCustomerExist = await relativeCustomerModel.getOne(
        newRelaticeCustomerData.relative_customer_id,
        newRelaticeCustomerData.box_id,
      );
      if (relativeCustomerExist) {
        const source = 'createRelativeCustomer';
        systemLog.createSystemLog(
          user,
          'Relative Customer Already Exist',
          source,
        );
        return ResponseHandler.badRequest(
          res,
          i18n.__('RELATIVE_CUSTOMER_ALREADY_EXIST'),
        );
      }

      // check if relative customer owns the box
      const relativeCustomerOwnsBox = await userBoxModel.checkUserBox(
        newRelaticeCustomerData.relative_customer_id,
        newRelaticeCustomerData.box_id,
      );
      if (relativeCustomerOwnsBox) {
        const source = 'createRelativeCustomer';
        systemLog.createSystemLog(
          user,
          'Relative Customer Owns the Box',
          source,
        );
        return ResponseHandler.badRequest(
          res,
          i18n.__('RELATIVE_CUSTOMER_ALREADY_OWNS_BOX'),
        );
      }

      const createdRelativeCustomer =
        await relativeCustomerModel.createRelativeCustomer(
          newRelaticeCustomerData,
        );

      const action = 'createRelativeCustomer';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('RELATIVE_CUSTOMER_CREATED_SUCCESSFULLY'),
        newRelaticeCustomerData.box_id,
      );

      // create relative customer accress
      const createdRelativeCustomerAccess =
        await relativeCustomerAccessModel.createRelativeCustomerAccess(
          newRelaticeCustomerAccessData,
          newRelaticeCustomerAccessData.relative_customer_id,
          newRelaticeCustomerData.box_id,
        );

      ResponseHandler.success(
        res,
        i18n.__('RELATIVE_CUSTOMER_CREATED_SUCCESSFULLY'),
        {
          ...createdRelativeCustomer,
          relative_customer_access: createdRelativeCustomerAccess,
        },
      );
    } catch (error: any) {
      const source = 'createRelativeCustomer';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getAllRelativeCustomersByUserId = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }
    try {
      const relativeCustomers = await relativeCustomerModel.getMany(user);
      ResponseHandler.success(
        res,
        i18n.__('RELATIVE_CUSTOMERS_RETRIEVED_SUCCESSFULLY'),
        relativeCustomers,
      );
    } catch (error: any) {
      const source = 'getAllRelativeCustomers';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);
export const getAllRelativeCustomersForAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }
    try {
      const relativeCustomers = await relativeCustomerModel.getAllForAdmin();
      ResponseHandler.success(
        res,
        i18n.__('RELATIVE_CUSTOMERS_RETRIEVED_SUCCESSFULLY'),
        relativeCustomers,
      );
    } catch (error: any) {
      const source = 'getAllRelativeCustomersForAdmin';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const updateRelativeCustomer = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }
    try {
      const relativeCustomerId = req.params.id;
      const relativeCustomerDate: RelativeCustomer = req.body;

      // if (req.body.relative_customer_access) {
      //   const relativeCustomerAccessData = req.body.relative_customer_access;
      //   relativeCustomerDate = {
      //     ...relativeCustomerDate,
      //     relative_customer_access: relativeCustomerAccessData,
      //   };
      // }

      const updatedRelativeCustomer = await relativeCustomerModel.updateOne(
        Number(relativeCustomerId),
        relativeCustomerDate,
      );
      notificationModel.createNotification(
        'updateRelativeCustomer',
        i18n.__('RELATIVE_CUSTOMER_UPDATED_SUCCESSFULLY'),
        null,
        user,
        relativeCustomerDate.box_id,
      );

      const action = 'updateRelativeCustomer';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('RELATIVE_CUSTOMER_UPDATED_SUCCESSFULLY'),
        relativeCustomerDate.box_id,
      );

      const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
      try {
        notificationModel.pushNotification(
          fcmToken,
          i18n.__('UPDATE_RELATIVE_CUSTOMER'),
          i18n.__('RELATIVE_CUSTOMER_UPDATED_SUCCESSFULLY'),
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const source = 'updateRelativeCustomer';
        systemLog.createSystemLog(
          user,
          i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
          source,
        );
      }
      ResponseHandler.success(
        res,
        i18n.__('RELATIVE_CUSTOMER_UPDATED_SUCCESSFULLY'),
        updatedRelativeCustomer,
      );
    } catch (error: any) {
      ResponseHandler.badRequest(res, error.message);
      const source = 'updateRelativeCustomer';
      systemLog.createSystemLog(user, (error as Error).message, source);
      // next(error);
    }
  },
);

export const deleteRelativeCustomer = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }

    try {
      const relativeCustomerId = req.params.id;
      const deletedRelativeCustomer = await relativeCustomerModel.deleteOne(
        Number(relativeCustomerId),
      );

      notificationModel.createNotification(
        'deleteRelativeCustomer',
        i18n.__('RELATIVE_CUSTOMER_DELETED_SUCCESSFULLY'),
        null,
        user,
        deletedRelativeCustomer.box_id,
      );
      const action = 'deleteRelativeCustomer';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('RELATIVE_CUSTOMER_DELETED_SUCCESSFULLY'),
        deletedRelativeCustomer.box_id,
      );
      ResponseHandler.success(
        res,
        i18n.__('RELATIVE_CUSTOMER_DELETED_SUCCESSFULLY'),
        deletedRelativeCustomer,
      );
    } catch (error: any) {
      const source = 'deleteRelativeCustomer';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

// update relative customer status
export const updateRelativeCustomerStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }

    try {
      const { id, status } = req.body;

      const updatedRelativeCustomer = await relativeCustomerModel.updateStatus(
        Number(id),
        status,
      );
      ResponseHandler.success(
        res,
        i18n.__('RELATIVE_CUSTOMER_STATUS_UPDATED_SUCCESSFULLY'),
        updatedRelativeCustomer,
      );
    } catch (error: any) {
      const source = 'updateRelativeCustomerStatus';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getRelativeCustomerAccess = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }
    try {
      const boxId = req.params.box_id;
      // check if box exists
      const boxExist = await boxModel.getOne(boxId);
      if (!boxExist) {
        const source = 'getRelativeCustomerAccess';
        systemLog.createSystemLog(user, 'Box Does Not Exist', source);
        return ResponseHandler.badRequest(res, i18n.__('BOX_DOES_NOT_EXIST'));
      }

      const relativeCustomerAccess =
        await relativeCustomerAccessModel.getAllRelativeCustomerAccess(
          user,
          boxId,
        );
      ResponseHandler.success(
        res,
        i18n.__('RELATIVE_CUSTOMER_ACCESS_RETRIEVED_SUCCESSFULLY'),
        relativeCustomerAccess,
      );
    } catch (error: any) {
      const source = 'getRelativeCustomerAccess';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

// update relative customer access
export const updateRelativeCustomerAccess = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }
    try {
      const id = req.params.id;
      // get the record id from the user id
      const record =
        await relativeCustomerAccessModel.getRelativeCustomerAccessById(id);

      if (!record) {
        const source = 'updateRelativeCustomerAccess';
        systemLog.createSystemLog(user, 'Record Does Not Exist', source);
        return ResponseHandler.badRequest(res, i18n.__('USER_DOES_NOT_EXIST'));
      }

      const newRelaticeCustomerAccessData: RelativeCustomerAccess = req.body;
      const updatedRelativeCustomerAccess =
        await relativeCustomerAccessModel.updateOne(
          newRelaticeCustomerAccessData,
          Number(record),
        );
      ResponseHandler.success(
        res,
        i18n.__('RELATIVE_CUSTOMER_ACCESS_UPDATED_SUCCESSFULLY'),
        updatedRelativeCustomerAccess,
      );
    } catch (error: any) {
      const source = 'updateRelativeCustomerAccess';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);
