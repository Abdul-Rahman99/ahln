import { Request, Response, NextFunction } from 'express';

const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.currentUser.role)) {
      res.status(400);
      throw new Error('Unauthorized to access this route');
    }
    next();
  };
};

export default authorize;
