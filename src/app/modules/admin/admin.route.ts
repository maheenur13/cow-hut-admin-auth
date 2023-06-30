import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validaterequest';
import { MyProfileController } from '../my-profile/myProfile.controller';
import { MyProfileValidation } from '../my-profile/myProfile.validation';
import { AdminController } from './admin.controller';
import { AdminValidation } from './admin.validation';

const router = express.Router();

router.post(
  '/create-admin',
  validateRequest(AdminValidation.createAdminZodSchema),
  AdminController.createAdmin
);

router.post(
  '/login',
  validateRequest(AdminValidation.adminLoginZodSchema),
  AdminController.loginAdmin
);

router.get(
  '/my-profile',
  auth(ENUM_USER_ROLE.ADMIN),
  MyProfileController.getProfileDetails
);
router.patch(
  '/my-profile',
  validateRequest(MyProfileValidation.updateProfileZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  MyProfileController.updateProfile
);

router.get('/:id', AdminController.getAdmin);

export const AdminRoutes = router;
