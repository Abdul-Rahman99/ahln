import { Response } from 'express';
declare class ResponseHandler {
    static logInSuccess(res: Response, message: string, data?: any, token?: string | null): Response;
    static success(res: Response, message: string, data?: any): Response;
    static badRequest(res: Response, message: string, data?: any, token?: string | null): Response;
    static unauthorized(res: Response, message: string, data?: any, token?: string | null): Response;
    static internalError(res: Response, message: string, data?: any): Response;
}
export default ResponseHandler;
