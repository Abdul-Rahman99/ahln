/* eslint-disable @typescript-eslint/no-explicit-any */

import { Response } from 'express';

class ResponseHandler {
  static logInSuccess(
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

  static success(
    res: Response,
    message: string,
    data: any = null,
    limit?: number,
    page?: number,
  ): Response {
    let responseBody: any;
    const dataCount = data ? data.length : 0;
    const skip = (page ? page - 1 : 0) * (limit ? Number(limit) : 0);

    if (limit && page) {
      data = data.slice(skip, skip + Number(limit));
    } else if (limit) {
      data = data.slice(0, Number(limit));
    } else if (page) {
      data = data.slice((page - 1) * Number(limit));
    }
    if (dataCount === 0) {
      data = null;
    }

    if (limit || page) {
      responseBody = {
        dataCount,
        success: true,
        message,
        data,
        limit,
        page,
      };
    } else {
      responseBody = {
        success: true,
        message,
        data,
      };
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
  static unauthorized(
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

    return res.status(401).json(responseBody);
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
