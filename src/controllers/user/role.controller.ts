/* eslint-disable @typescript-eslint/no-explicit-any */
// src/controllers/role.controller.ts
import { Request, Response } from 'express';
import RoleModel from '../../models/users/role.model';

const roleModel = new RoleModel();

export const createRole = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const role = await roleModel.create(title, description);
    res.status(201).json({ success: true, data: role });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const roles = await roleModel.getAll();
    res.status(200).json({ success: true, data: roles });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRoleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const role = await roleModel.getById(Number(id));
    res.status(200).json({ success: true, data: role });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const role = await roleModel.update(Number(id), title, description);
    res.status(200).json({ success: true, data: role });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const role = await roleModel.delete(Number(id));
    res.status(200).json({ success: true, data: role });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
