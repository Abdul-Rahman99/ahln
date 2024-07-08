import { Request, Response, NextFunction } from 'express';
export declare const createRole: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getAllRoles: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getRoleById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateRole: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteRole: (req: Request, res: Response, next: NextFunction) => Promise<void>;
