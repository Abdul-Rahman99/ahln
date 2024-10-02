/* eslint-disable @typescript-eslint/no-explicit-any */
import authHandler from '../../utils/authHandler';
import asyncHandler from '../../middlewares/asyncHandler';
import HistoryModel from '../../models/users/history.model';
import ResponseHandler from '../../utils/responsesHandler';
import SystemLogModel from '../../models/logs/system.log.model';
import i18n from '../../config/i18n';
import UserBoxModel from '../../models/box/user.box.model';

const userBoxModel = new UserBoxModel();

const historyModel = new HistoryModel();
const systemLog = new SystemLogModel();

export const getAllTables = asyncHandler(async (req, res) => {
  const user = await authHandler(req, res);
  if (user === '0') {
    return user;
  }

  try {
    const tables = await historyModel.getAllTables();
    ResponseHandler.success(
      res,
      i18n.__('TABLES_RETRIEVED_SUCCESSFULLY'),
      tables,
    );
  } catch (error: any) {
    const source = 'getAllTables';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, (error as Error).message);
  }
});

export const getTableHistory = asyncHandler(async (req, res) => {
  const user = await authHandler(req, res);
  if (user === '0') {
    return user;
  }
  const { tableName } = req.body;

  try {
    const tableHistory = await historyModel.getTableHistory(tableName, user);
    ResponseHandler.success(
      res,
      i18n.__('HISTORY_RETRIEVED_SUCCESSFULLY'),
      tableHistory,
    );
  } catch (error: any) {
    const source = 'getTableHistory';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, (error as Error).message);
  }
});

export const getBoxHistory = asyncHandler(async (req, res) => {
  const user = await authHandler(req, res);
  if (user === '0') {
    return user;
  }
  const { boxId } = req.body;

  try {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const page = req.query.page ? Number(req.query.page) : 1;

    const checkUserBox = await userBoxModel.checkUserBox(user, boxId);

    if (!checkUserBox) {
      return ResponseHandler.badRequest(
        res,
        i18n.__('BOX_NOT_RELATED_TO_USER'),
      );
    }

    const boxHistory = await historyModel.getBoxHistory(
      user,
      boxId,
      limit,
      page,
    );
    ResponseHandler.success(
      res,
      i18n.__('BOX_HISTORY_RETRIEVED_SUCCESSFULLY'),
      boxHistory,
    );
  } catch (error: any) {
    const source = 'getBoxHistory';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, (error as Error).message);
  }
});
