import { Request, Response, NextFunction } from 'express';
import MqttTopicModel from '../../models/logs/mqtt.topic.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { MqttTopic } from '../../types/mqtt.topic.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';

const mqttTopicModel = new MqttTopicModel();

export const createMqttTopic = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newMqttTopic: MqttTopic = req.body;
      const createdMqttTopic =
        await mqttTopicModel.createMqttTopic(newMqttTopic);
      ResponseHandler.success(
        res,
        i18n.__('MQTT_TOPIC_CREATED_SUCCESSFULLY'),
        createdMqttTopic,
      );
    } catch (error) {
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const getAllMqttTopic = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createdMqttTopic = await mqttTopicModel.getAllMqttTopics();
      ResponseHandler.success(
        res,
        i18n.__('MQTT_TOPIC_RETRIEVED_SUCCESSFULLY'),
        createdMqttTopic,
      );
    } catch (error) {
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const getOneMqttTopic = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mqttTopicId = req.params.id;
      const createdMqttTopic = await mqttTopicModel.getMqttTopic(
        parseInt(mqttTopicId),
      );
      ResponseHandler.success(
        res,
        i18n.__('MQTT_TOPIC_RETRIEVED_SUCCESSFULLY'),
        createdMqttTopic,
      );
    } catch (error) {
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const deleteOneMqttTopic = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mqttTopicId = req.params.id;
      const createdMqttTopic = await mqttTopicModel.deleteMqttTopic(
        parseInt(mqttTopicId),
      );
      ResponseHandler.success(
        res,
        i18n.__('MQTT_TOPIC_DELETED_SUCCESSFULLY'),
        createdMqttTopic,
      );
    } catch (error) {
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);