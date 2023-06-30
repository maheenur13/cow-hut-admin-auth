import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validaterequest';
import { MyProfileController } from '../my-profile/myProfile.controller';
import { MyProfileValidation } from '../my-profile/myProfile.validation';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const router = express.Router();

router.get('/', auth(ENUM_USER_ROLE.ADMIN), UserController.getAllUser);

router.get(
  '/my-profile',
  auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  MyProfileController.getProfileDetails
);

router.patch(
  '/my-profile',
  validateRequest(MyProfileValidation.updateProfileZodSchema),
  auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  MyProfileController.updateProfile
);

router.patch(
  '/:id',
  validateRequest(UserValidation.updateUserZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  UserController.updateUser
);
router.get('/:id', auth(ENUM_USER_ROLE.ADMIN), UserController.getSingleUser);
router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), UserController.deleteUser);

export const UserRoutes = router;
