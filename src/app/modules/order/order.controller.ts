import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IOrder } from './order.interfaces';
import { OrderService } from './order.service';

const createOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...orderData } = req.body;
    const result = await OrderService.createOrder(orderData);

    sendResponse<IOrder>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order created successfully!',
      data: result,
    });
  }
);

const getAllOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getAllService(req.user);
  sendResponse<IOrder[] | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully!',
    data: result,
  });
});

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const result = await OrderService.getSingleOrder(orderId, req.user);
  sendResponse<IOrder | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order retrieved successfully!',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getAllOrder,
  getSingleOrder,
};
