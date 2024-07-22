import { Request, Response } from 'express';
export declare const createPermission: (req: Request, res: Response) => Promise<void>;
export declare const getAllPermissions: (req: Request, res: Response) => Promise<void>;
export declare const getPermissionById: (req: Request, res: Response) => Promise<void>;
export declare const updatePermission: (req: Request, res: Response) => Promise<void>;
export declare const deletePermission: (req: Request, res: Response) => Promise<void>;
