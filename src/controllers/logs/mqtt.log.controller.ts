import { Request, Response } from 'express';
import MqttLogModel from '../../models/logs/mqtt.log.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { MqttLog } from '../../types/mqtt.log.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import MqttTopicModel from '../../models/logs/mqtt.topic.model';
import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';
const systemLog = new SystemLogModel();
const mqttLogModel = new MqttLogModel();
const mqttTopic = new MqttTopicModel();

export const createMqttLog = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const newMqttLog: MqttLog = req.body;
      const mqttTopicExist = await mqttTopic.getMqttTopic(
        parseInt(req.body.mqtt_topic_id),
      );
      console.log(mqttTopicExist);

      if (!mqttTopicExist[0]) {
        return ResponseHandler.badRequest(
          res,
          i18n.__('PROVIDE_VALID_MQTT_TOPIC_ID'),
        );
      }
      const createdMqttLog = await mqttLogModel.createMqttLog(newMqttLog);
      ResponseHandler.success(
        res,
        i18n.__('MQTT_LOG_CREATED_SUCCESSFULLY'),
        createdMqttLog,
      );
    } catch (error) {
      const user = await authHandler(req, res);
      const source = 'createMqttLog';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const getAllMqttLogs = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const mqttLogs = await mqttLogModel.getAllMqttLogs();
      ResponseHandler.success(
        res,
        i18n.__('MQTT_LOGS_RETRIEVED_SUCCESSFULLY'),
        mqttLogs,
      );
    } catch (error) {
      const user = await authHandler(req, res);
      const source = 'getAllMqttLogs';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const getMqttLog = asyncHandler(async (req: Request, res: Response) => {
  try {
    const mqttLogId = req.params.id;
    const mqttLog = await mqttLogModel.getMqttLog(parseInt(mqttLogId));
    ResponseHandler.success(
      res,
      i18n.__('MQTT_LOG_RETRIEVED_SUCCESSFULLY'),
      mqttLog,
    );
  } catch (error) {
    const user = await authHandler(req, res);
    const source = 'getMqttLog';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, (error as Error).message);
    // next(error);
  }
});

export const deleteMqttLog = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const mqttLogId = req.params.id;
      const mqttLog = await mqttLogModel.deleteMqttLog(parseInt(mqttLogId));
      ResponseHandler.success(
        res,
        i18n.__('MQTT_LOG_DELETED_SUCCESSFULLY'),
        mqttLog,
      );
    } catch (error) {
      const user = await authHandler(req, res);
      const source = 'deleteMqttLog';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);
