import { RequestHandler } from "express";

const asyncHandler = (fn: RequestHandler): RequestHandler =>
  function asyncUtilWrap(req, res, next) {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
