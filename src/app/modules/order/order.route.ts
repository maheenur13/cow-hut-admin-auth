import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validaterequest';
import { OrderController } from './order.controller';
import { OrderValidation } from './order.validation';

const router = express.Router();

router.get(
  '/',
  auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  OrderController.getAllOrder
);

router.post(
  '/',
  validateRequest(OrderValidation.createOrderZodSchema),
  auth(ENUM_USER_ROLE.BUYER),
  OrderController.createOrder
);
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  OrderController.getSingleOrder
);

export const OrderRoutes = router;
