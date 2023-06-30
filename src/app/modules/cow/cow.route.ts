import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validaterequest';
import { CowController } from './cow.controller';
import { CowValidation } from './cow.validation';

const router = express.Router();

router.get(
  '/',
  auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER),
  CowController.getAllCow
);

router.post(
  '/',
  validateRequest(CowValidation.createCowZodSchema),
  auth(ENUM_USER_ROLE.SELLER),
  CowController.createCow
);

router.patch(
  '/:id',
  validateRequest(CowValidation.updateCowZodSchema),
  auth(ENUM_USER_ROLE.SELLER),
  CowController.updateCow
);
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER),
  CowController.getSingleCow
);
router.delete('/:id', auth(ENUM_USER_ROLE.SELLER), CowController.deleteCow);

export const CowsRoutes = router;
