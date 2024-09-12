/* eslint-disable @typescript-eslint/no-explicit-any */
import authHandler from '../../utils/authHandler';
import asyncHandler from '../../middlewares/asyncHandler';
import HistoryModel from '../../models/users/history.model';
import ResponseHandler from '../../utils/responsesHandler';
import SystemLogModel from '../../models/logs/system.log.model';
import i18n from '../../config/i18n';
import BoxModel from '../../models/box/box.model';

const boxModel = new BoxModel();

const historyModel = new HistoryModel();
const systemLog = new SystemLogModel();

export const getAllTables = asyncHandler(async (req, res) => {
  const user = await authHandler(req, res);

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
  const { boxId } = req.body;

  try {
    const boxHistory = await historyModel.getBoxHistory(user, boxId);
    const checkUserBox = await boxModel.getOneByUser(user, boxId);
    if (!checkUserBox) {
      ResponseHandler.badRequest(res, i18n.__('BOX_NOT_FOUND'));
    }
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
