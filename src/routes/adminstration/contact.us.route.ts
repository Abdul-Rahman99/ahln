import express from 'express';

import {
  createContactUs,
  deleteContactUs,
  getAllContactUs,
  getOneContactUs,
  // updateContactUs,
} from '../../controllers/adminstration/contact.us.controller';
import {
  createContactUsValidation,
  deleteContactUsValidation,
  getContactUsByIdValidation,
  // updateContactUsValidation,
} from '../../validation/adminstration/contact.us.validation';
import verifyToken from '../../middlewares/verifyToken';

const router = express.Router();

router.post('/new', createContactUsValidation, createContactUs);
router.get('/get-all', verifyToken, getAllContactUs);
router.get(
  '/get-one/:id',
  verifyToken,
  getContactUsByIdValidation,
  getOneContactUs,
);
// router.put(
//   '/update/:id',
//   verifyToken,
//   updateContactUsValidation,
//   updateContactUs,
// );
router.delete(
  '/delete/:id',
  verifyToken,
  deleteContactUsValidation,
  deleteContactUs,
);

export default router;
