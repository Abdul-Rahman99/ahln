// import express from 'express';
// import {
//   createBox,
//   getAllBoxes,
//   getBoxById,
//   updateBox,
//   deleteBox,
// } from '../controllers/box.controller';
// import {
//   createBoxValidator,
//   updateBoxValidator,
//   getBoxValidator,
//   deleteBoxValidator,
// } from '../validation/box.validation';
// import verifyToken from '../middlewares/verifyToken';
// import {authorize} from '../middlewares/authorize';

// const router = express.Router();

// router.post(
//   '/new',
//   verifyToken,
//   authorize('admin', 'super admin', 'operations'),
//   createBoxValidator,
//   createBox,
// );
// router.get(
//   '/get-all',
//   verifyToken,
//   authorize('admin', 'super admin', 'operations'),
//   getAllBoxes,
// );
// router.get(
//   '/get-one/:id',
//   verifyToken,
//   authorize('admin', 'super admin', 'vendor', 'operations', 'customer'),
//   getBoxValidator,
//   getBoxById,
// );
// router.put(
//   '/update/:id',
//   verifyToken,
//   authorize('admin', 'super admin'),
//   updateBoxValidator,
//   updateBox,
// );
// router.delete(
//   '/delete/:id',
//   verifyToken,
//   authorize('admin', 'super admin'),
//   deleteBoxValidator,
//   deleteBox,
// );

// export default router;
