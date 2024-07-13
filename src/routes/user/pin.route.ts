// import express from 'express';
// import {
//   createPin,
//   deleteOnePinByUser,
//   getAllPinByUser,
//   getOnePinByUser,
//   updateOnePinByUser,
// } from '../../controllers/user/pin.controller';

// import {
//   createPinValidation,
//   deleteUserPinByUserIdValidation,
//   getUserPinByUserIdValidation,
//   getUserPinsByUserIdValidation,
//   updatePinByValidation,
// } from '../../validation/user/pin.validation';

// import verifyToken from '../../middlewares/verifyToken';
// // import { authorize } from '../../middlewares/authorize';

// const router = express.Router();

// router.post(
//   '/new',
//   verifyToken,
//   //   authorize(['create_box']),
//   createPinValidation,
//   createPin,
// );

// router.get(
//   '/get-all',
//   verifyToken,
//   //  authorize(['read_box']),
//   getUserPinsByUserIdValidation,
//   getAllPinByUser,
// );

// router.get(
//   '/get-one/:id',
//   verifyToken,
//   //   authorize(['read_box']),
//   getUserPinByUserIdValidation,
//   getOnePinByUser,
// );

// router.put(
//   '/update/:id',
//   verifyToken,
//   //   authorize(['update_box']),
//   updatePinByValidation,
//   updateOnePinByUser,
// );

// router.delete(
//   '/delete/:id',
//   verifyToken,
//   //   authorize(['delete_box']),
//   deleteUserPinByUserIdValidation,
//   deleteOnePinByUser,
// );

// export default router;
