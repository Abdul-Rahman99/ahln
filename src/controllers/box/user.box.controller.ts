/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { UserBox } from '../../types/user.box.type';
import UserBoxModel from '../../models/box/user.box.model';
import asyncHandler from '../../middlewares/asyncHandler';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import UserModel from '../../models/users/user.model';
import RelativeCustomerModel from '../../models/users/relative.customer.model';
import BoxModel from '../../models/box/box.model';
import authHandler from '../../utils/authHandler';
import SystemLogModel from '../../models/logs/system.log.model';
import AuditTrailModel from '../../models/logs/audit.trail.model';
import UserDevicesModel from '../../models/users/user.devices.model';
import NotificationModel from '../../models/logs/notification.model';
import CityModel from '../../models/adminstration/city.model';
import CountryModel from '../../models/adminstration/country.model';
import { sendEmailInvitation } from '../../utils/nodemailer';
import { RelativeCustomerAccess } from '../../types/realative.customer.acces.type';
import RelativeCustomerAccessModel from '../../models/users/relative.customer.access.model';

const relativeCustomerAccessModel = new RelativeCustomerAccessModel();
const userDevicesModel = new UserDevicesModel();
const notificationModel = new NotificationModel();
const userModel = new UserModel();
const userBoxModel = new UserBoxModel();
const relativeCustomerModel = new RelativeCustomerModel();
const boxModel = new BoxModel();
const systemLog = new SystemLogModel();
const auditTrail = new AuditTrailModel();
const cityModel = new CityModel();
const countryModel = new CountryModel();

export const createUserBox = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }

    try {
      const newUserBox: UserBox = req.body;
      const createdUserBox = await userBoxModel.createUserBox(newUserBox);

      const action = 'createUserBox';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('USER_BOX_CREATED_SUCCESSFULLY'),
        createdUserBox.box_id,
      );
      ResponseHandler.success(
        res,
        i18n.__('USER_BOX_CREATED_SUCCESSFULLY'),
        createdUserBox,
      );
    } catch (error: any) {
      const source = 'createUserBox';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getAllUserBoxes = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }

    try {
      const userBoxes = await userBoxModel.getAllUserBoxes();
      ResponseHandler.success(
        res,
        i18n.__('USER_BOXES_RETRIEVED_SUCCESSFULLY'),
        userBoxes,
      );
    } catch (error: any) {
      const source = 'getAllUserBoxes';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getUserBoxById = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }

    try {
      const userBoxId = req.params.id;
      const userBox = await userBoxModel.getOne(userBoxId);
      ResponseHandler.success(
        res,
        i18n.__('USER_BOX_RETRIEVED_SUCCESSFULLY'),
        userBox,
      );
    } catch (error: any) {
      const source = 'getUserBoxById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const updateUserBox = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }

    try {
      const userBoxId = req.params.id;
      const userBoxData: Partial<UserBox> = req.body;
      const updatedUserBox = await userBoxModel.updateOne(
        userBoxData,
        userBoxId,
      );

      const action = 'updateUserBox';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('USER_BOX_UPDATED_SUCCESSFULLY'),
        updatedUserBox.box_id,
      );
      ResponseHandler.success(
        res,
        i18n.__('USER_BOX_UPDATED_SUCCESSFULLY'),
        updatedUserBox,
      );
    } catch (error: any) {
      const source = 'updateUserBox';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const deleteUserBox = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }

    try {
      const userBoxId = req.params.id;
      const deletedUserBox = await userBoxModel.deleteOne(userBoxId);

      const action = 'deleteUserBox';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('USER_BOX_DELETED_SUCCESSFULLY'),
        deletedUserBox.box_id,
      );
      ResponseHandler.success(
        res,
        i18n.__('USER_BOX_DELETED_SUCCESSFULLY'),
        deletedUserBox,
      );
    } catch (error: any) {
      const source = 'deleteUserBox';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getUserBoxesByUserId = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }
    try {
      // Fetch user boxes by user ID
      const userBoxes = await userBoxModel.getUserBoxesByUserId(user);
      // Send a success response
      ResponseHandler.success(
        res,
        i18n.__('USER_BOXES_BY_USER_ID_RETRIEVED_SUCCESSFULLY'),
        userBoxes,
      );
    } catch (error: any) {
      const source = 'getUserBoxesByUserId';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);
export const getUserBoxesByBoxId = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }

    try {
      const boxId = req.params.boxId;
      const userBoxes = await userBoxModel.getUserBoxesByBoxId(boxId);
      ResponseHandler.success(
        res,
        i18n.__('USER_BOXES_BY_BOX_ID_RETRIEVED_SUCCESSFULLY'),
        userBoxes,
      );
    } catch (error: any) {
      const source = 'getUserBoxesByBoxId';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const assignBoxToUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }

    try {
      const { userId, boxId, addressId } = req.body;

      const checkBoxExists = await boxModel.getOne(boxId);
      if (!checkBoxExists) {
        throw new Error('Box ID cannot be Not Found!');
      }
      // check if the user already assigned to box

      const checkUserBoxExists = await userBoxModel.getUserBoxesByBoxId(boxId);

      if (checkUserBoxExists.length > 0) {
        return ResponseHandler.badRequest(
          res,
          i18n.__('BOX_ALREADY_ASSIGNED_TO_USER'),
        );
      }
      const assignedUserBox = await userBoxModel.assignBoxToUser(
        userId,
        boxId,
        addressId,
      );

      notificationModel.createNotification(
        'assignBoxToUser',
        i18n.__('BOX_ASSIGNED_TO_USER_SUCCESSFULLY'),
        null,
        userId,
        boxId,
      );
      const action = 'assignBoxToUser';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('BOX_ASSIGNED_TO_USER_SUCCESSFULLY'),
        boxId,
      );

      ResponseHandler.success(
        res,
        i18n.__('BOX_ASSIGNED_TO_USER_SUCCESSFULLY'),
        assignedUserBox,
      );
    } catch (error: any) {
      const source = 'assignBoxToUser';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const userAssignBoxToHimself = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }

    try {
      const { serialNumber, country_id, city_id, district, street, boxLabel } =
        req.body;
      let assignedUserBox;
      // check if the city and country exist
      const countryExist = await countryModel.getOne(country_id);
      if (!countryExist) {
        return ResponseHandler.badRequest(res, i18n.__('COUNTRY_NOT_EXIST'));
      }

      const cityExist = await cityModel.getCityById(city_id);
      if (!cityExist) {
        return ResponseHandler.badRequest(res, i18n.__('CITY_NOT_EXIST'));
      }

      try {
        assignedUserBox = await userBoxModel.userAssignBoxToHimslef(
          user,
          serialNumber,
          country_id,
          city_id,
          district,
          street,
          boxLabel,
        );
      } catch (error: any) {
        const source = 'userAssignBoxToHimself';
        systemLog.createSystemLog(user, (error as Error).message, source);
        return ResponseHandler.badRequest(res, error.message);
        // next(error);
      }
      const boxId = await boxModel.boxExistsSerialNumber(serialNumber);

      try {
        notificationModel.createNotification(
          'userAssignBoxToHimself',
          i18n.__('BOX_ASSIGNED_TO_USER_SUCCESSFULLY'),
          null,
          user,
          boxId.id as unknown as string,
        );
      } catch (error: any) {
        const source = 'userAssignBoxToHimself';
        systemLog.createSystemLog(
          user,
          i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
          source,
        );
      }
      const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
      try {
        notificationModel.pushNotification(
          fcmToken,
          i18n.__('ASSIGN_BOX_TO_USER'),
          i18n.__('BOX_ASSIGNED_TO_USER_SUCCESSFULLY'),
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const source = 'userAssignBoxToHimself';
        systemLog.createSystemLog(
          user,
          i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
          source,
        );
      }
      try {
        const action = 'userAssignBoxToHimself';
        auditTrail.createAuditTrail(
          user,
          action,
          i18n.__('BOX_ASSIGNED_TO_USER_SUCCESSFULLY'),
          boxId.id as unknown as string,
        );
      } catch (error: any) {
        const source = 'userAssignBoxToHimself';
        systemLog.createSystemLog(
          user,
          i18n.__('ERROR_CREATING_AUDIT_TRAIL', ' ', error.message),
          source,
        );
      }
      ResponseHandler.success(
        res,
        i18n.__('BOX_ASSIGNED_TO_USER_SUCCESSFULLY'),
        assignedUserBox,
      );
    } catch (error: any) {
      const source = 'userAssignBoxToHimself';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const userAssignBoxToRelativeUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }
    try {
      const { boxId, email, relation } = req.body;
      const newRelaticeCustomerAccessData: RelativeCustomerAccess = req.body;
      let createdRelativeCustomerAccess;
      let assignedUserBox;
      let createdRelativeCustomer;
      const relative_customer = await userModel.findByEmail(email);

      // check if relative customer exist
      const relativeCustomerExist = await relativeCustomerModel.getOne(
        relative_customer?.id as string,
        boxId,
      );

      if (relativeCustomerExist) {
        return ResponseHandler.badRequest(
          res,
          i18n.__('RELATIVE_CUSTOMER_ALREADY_ASSIGNED'),
        );
      }

      if (!relative_customer) {
        // create a system log
        const source = 'userAssignBoxToRelativeUser';
        systemLog.createSystemLog(user, 'User Does Not Exist', source);

        // create a new user
        const newUser = await userModel.createUser({
          email: email,
          user_name: 'inviteduser',
          role_id: 3,
        });
        if (!newUser) {
          const source = 'userAssignBoxToRelativeUser';
          systemLog.createSystemLog(user, 'Error Creating User', source);
          return ResponseHandler.badRequest(
            res,
            i18n.__('ERROR_CREATING_USER'),
          );
        }

        // sned email notification to the new user with node mailer
        const emailSend = await sendEmailInvitation(newUser);
        if (!emailSend) {
          const source = 'userAssignBoxToRelativeUser';
          systemLog.createSystemLog(user, 'Error Sending Email', source);
          return ResponseHandler.badRequest(
            res,
            i18n.__('ERROR_SENDING_EMAIL'),
          );
        }

        // create relative customer accress
        createdRelativeCustomerAccess =
          await relativeCustomerAccessModel.createRelativeCustomerAccess(
            newRelaticeCustomerAccessData,
            newUser.id,
            boxId,
          );

        // create a new user box
        assignedUserBox = {
          customer_id: user,
          relative_customer_id: newUser.id,
          relation: relation,
          box_id: boxId,
        };
        createdRelativeCustomer =
          await relativeCustomerModel.createRelativeCustomer(assignedUserBox);
        const relativeFcmToken =
          await userDevicesModel.getFcmTokenDevicesByUser(newUser.id);
        try {
          notificationModel.pushNotification(
            relativeFcmToken,
            i18n.__('ASSIGN_BOX_TO_RELATIVE_USER'),
            i18n.__('BOX_ASSIGNED_TO_RELATIVE_USER_SUCCESSFULLY'),
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          const source = 'userAssignBoxToRelativeUser';
          systemLog.createSystemLog(
            user,
            i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
            source,
          );
        }
      } else {
        createdRelativeCustomerAccess =
          await relativeCustomerAccessModel.createRelativeCustomerAccess(
            newRelaticeCustomerAccessData,
            relative_customer?.id as string,
            boxId,
          );

        const relativeCustomerData = {
          customer_id: user,
          relative_customer_id: relative_customer.id,
          relation: relation,
          box_id: boxId,
        };
        createdRelativeCustomer =
          await relativeCustomerModel.createRelativeCustomer(
            relativeCustomerData,
          );
        const relativeFcmToken =
          await userDevicesModel.getFcmTokenDevicesByUser(relative_customer.id);
        try {
          notificationModel.pushNotification(
            relativeFcmToken,
            i18n.__('ASSIGN_BOX_TO_RELATIVE_USER'),
            i18n.__('BOX_ASSIGNED_TO_RELATIVE_USER_SUCCESSFULLY'),
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          const source = 'userAssignBoxToRelativeUser';
          systemLog.createSystemLog(
            user,
            i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
            source,
          );
        }

        try {
          const fcmToken =
            await userDevicesModel.getFcmTokenDevicesByUser(user);
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
        } catch (error: any) {
          const source = 'updateUserBoxStatus';
          systemLog.createSystemLog(user, (error as Error).message, source);
          ResponseHandler.badRequest(res, error.message);
          // next(error);
        }
      }
      const boxExist = await boxModel.getOne(boxId);
      if (!boxExist) {
        const source = 'userAssignBoxToRelativeUser';
        systemLog.createSystemLog(user, 'Box Does Not Exist', source);
        return ResponseHandler.badRequest(res, i18n.__('BOX_DOES_NOT_EXIST'));
      }
      assignedUserBox = await userBoxModel.assignRelativeUser(
        user,
        boxId,
        email,
      );

      notificationModel.createNotification(
        'userAssignBoxToRelativeUser',
        i18n.__('BOX_ASSIGNED_TO_RELATIVE_USER_SUCCESSFULLY'),
        null,
        user,
        boxId,
      );
      const action = 'userAssignBoxToRelativeUser';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('BOX_ASSIGNED_TO_RELATIVE_USER_SUCCESSFULLY'),
        boxId,
      );

      const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
      try {
        notificationModel.pushNotification(
          fcmToken,
          i18n.__('ASSIGN_BOX_TO_RELATIVE_USER'),
          i18n.__('BOX_ASSIGNED_TO_RELATIVE_USER_SUCCESSFULLY'),
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const source = 'userAssignBoxToRelativeUser';
        systemLog.createSystemLog(
          user,
          i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
          source,
        );
      }

      ResponseHandler.success(
        res,
        i18n.__('BOX_ASSIGNED_TO_RELATIVE_USER_SUCCESSFULLY'),
        {
          ...createdRelativeCustomer,
          relative_customer_access: createdRelativeCustomerAccess,
        },
      );
    } catch (error: any) {
      const source = 'userAssignBoxToRelativeUser';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const updateUserBoxStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }
    const { id } = req.params;
    const { is_active } = req.body;

    try {
      const updatedUserBox = await userBoxModel.updateUserBoxStatus(
        is_active,
        id,
      );

      const action = 'updateUserBoxStatus';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('USER_BOX_STATUS_UPDATED_SUCCESSFULLY'),
        null,
      );
      ResponseHandler.success(
        res,
        i18n.__('USER_BOX_STATUS_UPDATED_SUCCESSFULLY'),
        updatedUserBox,
      );
    } catch (error: any) {
      const source = 'updateUserBoxStatus';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const transferBoxOwnership = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }
    const { boxId, email } = req.body;
    try {
      const newUserId = await userModel.findByEmail(email);
      if (!newUserId) {
        const source = 'transferBoxOwnership';
        systemLog.createSystemLog(user, 'User Does Not Exist', source);
        return ResponseHandler.badRequest(res, i18n.__('USER_NOT_EXIST'));
      }
      // check if the boxId related to the user exists
      const boxExist = await boxModel.getOneByUser(user, boxId);
      if (!boxExist) {
        const source = 'transferBoxOwnership';
        systemLog.createSystemLog(user, 'Box Does Not Exist', source);
        return ResponseHandler.badRequest(
          res,
          i18n.__('BOX_NOT_RELATED_TO_USER'),
        );
      }

      // check if the user exists
      const userExist = await userModel.findByEmail(email);
      if (!userExist) {
        const source = 'transferBoxOwnership';
        systemLog.createSystemLog(user, 'User Does Not Exist', source);
        return ResponseHandler.badRequest(res, i18n.__('USER_NOT_EXIST'));
      }

      // check if the user is already the owner of the box
      const updatedUserBox = await userBoxModel.transferBoxOwnership(
        boxId,
        newUserId?.id as string,
      );
      const action = 'transferBoxOwnership';
      auditTrail.createAuditTrail(
        newUserId?.id as string,
        action,
        i18n.__('BOX_OWNERSHIP_TRANSFERRED_SUCCESSFULLY'),
        boxId,
      );

      notificationModel.createNotification(
        'transferBoxOwnership',
        i18n.__('BOX_OWNERSHIP_TRANSFERRED_SUCCESSFULLY'),
        null,
        newUserId?.id as string,
        boxId,
      );

      const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
      const fcmTokenNewUser = await userDevicesModel.getFcmTokenDevicesByUser(
        newUserId.id as string,
      );

      try {
        notificationModel.pushNotification(
          fcmToken,
          i18n.__('TRANSFER_BOX_OWNERSHIP'),
          i18n.__('BOX_OWNERSHIP_TRANSFERRED_SUCCESSFULLY'),
        );
        notificationModel.pushNotification(
          fcmTokenNewUser,
          i18n.__('TRANSFER_BOX_OWNERSHIP'),
          i18n.__('BOX_OWNERSHIP_TRANSFERRED_SUCCESSFULLY'),
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const source = 'transferBoxOwnership';
        systemLog.createSystemLog(
          user,
          i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
          source,
        );
      }
      ResponseHandler.success(
        res,
        i18n.__('BOX_OWNERSHIP_TRANSFERRED_SUCCESSFULLY'),
        updatedUserBox,
      );
    } catch (error: any) {
      const source = 'transferBoxOwnership';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);
