/* eslint-disable @typescript-eslint/no-explicit-any */

import { Response } from 'express';

class ResponseHandler {
  static success(
    res: Response,
    message: string,
    data: any = null,
    token: string | null = null,
  ): Response {
    const responseBody: any = {
      success: true,
      message,
      data,
      token,
    };
    if (data === null)
      if (token) {
        responseBody.token = token;
      }

    return res.status(200).json(responseBody);
  }

  static badRequest(
    res: Response,
    message: string,
    data: any = null,
    token: string | null = null,
  ): Response {
    const responseBody: any = {
      success: false,
      message,
      data,
    };

    if (token) {
      responseBody.token = token;
    }

    return res.status(400).json(responseBody);
  }

  static internalError(
    res: Response,
    message: string,
    data: any = null,
  ): Response {
    return res.status(500).json({
      success: false,
      message,
      data,
    });
  }
}

export default ResponseHandler;
