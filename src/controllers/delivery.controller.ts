import { Request, Response, NextFunction } from 'express';
import DeliveryModel from '../models/delivery.model';
import i18n from '../config/i18n';

const deliveryModel = new DeliveryModel();

export const createDelivery = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const delivery = await deliveryModel.create(req.body);
    res.status(201).json({
      message: i18n.__('DELIVERY_CREATED_SUCCESS'),
      data: delivery,
    });
  } catch (err) {
    next(err);
  }
};

export const getDeliveries = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const deliveries = await deliveryModel.getMany();
    res.status(200).json({
      message: i18n.__('DELIVERIES_FETCHED_SUCCESS'),
      data: deliveries,
    });
  } catch (err) {
    next(err);
  }
};

export const getDelivery = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const delivery = await deliveryModel.getOne(parseInt(req.params.id));
    res.status(200).json({
      message: i18n.__('DELIVERY_FETCHED_SUCCESS'),
      data: delivery,
    });
  } catch (err) {
    next(err);
  }
};

export const updateDelivery = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const delivery = await deliveryModel.updateOne(
      req.body,
      parseInt(req.params.id),
    );
    res.status(200).json({
      message: i18n.__('DELIVERY_UPDATED_SUCCESS'),
      data: delivery,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteDelivery = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const delivery = await deliveryModel.deleteOne(parseInt(req.params.id));
    res.status(200).json({
      message: i18n.__('DELIVERY_DELETED_SUCCESS'),
      data: delivery,
    });
  } catch (err) {
    next(err);
  }
};
