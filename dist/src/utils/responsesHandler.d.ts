import { Response } from 'express';
declare class ResponseHandler {
    static success(res: Response, message: string, data?: any, token?: string | null): Response;
    static badRequest(res: Response, message: string, data?: any, token?: string | null): Response;
    static internalError(res: Response, message: string, data?: any): Response;
}
export default ResponseHandler;
