/* eslint-disable @typescript-eslint/no-explicit-any */
// src/controllers/permission.controller.ts
import { Request, Response } from 'express';
import PermissionModel from '../../models/users/permission.model';

const permissionModel = new PermissionModel();

export const createPermission = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const permission = await permissionModel.create(title, description);
    res.status(201).json({ success: true, data: permission });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllPermissions = async (req: Request, res: Response) => {
  try {
    const permissions = await permissionModel.getAll();
    res.status(200).json({ success: true, data: permissions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPermissionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const permission = await permissionModel.getById(Number(id));
    res.status(200).json({ success: true, data: permission });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const permission = await permissionModel.update(
      Number(id),
      title,
      description,
    );
    res.status(200).json({ success: true, data: permission });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const permission = await permissionModel.delete(Number(id));
    res.status(200).json({ success: true, data: permission });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
